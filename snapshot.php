<?php
/* When we get data here, the ttId in timeTable and ttId in fixedEntry 
 * are likely to be wrong, as they were just computed at user end. Take care
 * of that. 
 */

function rollback() {
	global $CFG;
	$res = sqlUpdate("ROLLBACK;");
	if($res === false) {
		error_log("rollback: Failed", 0);
	} else
		error_log("rollback: Success", 0);
	$resString = "{\"Success\": \"False\",";
	$resString .= "\"Error\" : ".json_encode($CFG->conn->error);
	$resString .= "\"Query\" : \"".$CFG->last_query."\"}";
	return $resString;
}
function findNewTTId($ttId, $ttData, $currentSnapshotId, $newSnapshotId) {
	for($i = 0; $i < count($ttData); $i++) {
		if($ttData[$i]["ttId"] == $ttId) {
			$index = $i;
			break;
		}
	}
	$row = $ttData[$index];
	$newClassQuery = "SELECT classId from class WHERE classShortName = ".
						"(SELECT classShortName from class where classId = ".$row["classId"].
						" AND snapshotId = $currentSnapshotId )".
					" AND snapshotId = $newSnapshotId";
	$newClassId = $result[0]["classId"];
	$selectQuery = "SELECT ttId FROM timeTable WHERE".
					" day = ". $row["day"] . " AND slotNo = ". $row["slotNo"].
					" AND classId = ". $row["classId"]. 
					/*" AND roomId = ".$row["roomId"]. " AND teacherId = ".$row["teacherId"].
					" AND batchId = ". $row["batchId"].
					" AND subjectId = ".$row["subjectId"]. */
					" AND isFixed = ".$row["isFixed"]. " AND snapshotId = $newSnapshotId;";
	$res = sqlGetOneRow($selectQuery);
	return $res[0]["ttId"];
}
function findTTId($ttId, $ttData, $snapshotId) {
	for($i = 0; $i < count($ttData); $i++) {
		if($ttData[$i]["ttId"] == $ttId) {
			$index = $i;
			break;
		}
	}
	$row = $ttData[$index];
	$selectQuery = "SELECT ttId FROM timeTable WHERE".
					" day = ". $row["day"] . " AND slotNo = ". $row["slotNo"].
					" AND classId = ". $row["classId"]. 
					/*" AND roomId = ".$row["roomId"]. " AND teacherId = ".$row["teacherId"].
					" AND batchId = ". $row["batchId"].
					" AND subjectId = ".$row["subjectId"]. */
					" AND isFixed = ".$row["isFixed"]. " AND snapshotId = $snapshotId;";
	$res = sqlGetOneRow($selectQuery);
	return $res[0]["ttId"];
}
function saveSnapshot() {
	header("Content-Type: application/JSON: charset=UTF-8");
	global $CFG;
	$resString = "{\"Success\": \"True\"}";

	$snapshotName = getArgument("snapshotName");
	$user = getArgument("userId");
	$ttd = getArgument("ttData");
	$fed = getArgument("feData");
	$ttData = json_decode($ttd, true);	
	$feData = json_decode($fed, true);	

	$startTransactionQuery = "START TRANSACTION;";
	$result = sqlUpdate($startTransactionQuery);
	if($result != true)
		return rollback();
	
	$snapshotFindQuery = "SELECT snapshotId FROM snapshot WHERE snapshotName = \"$snapshotName\"";
	error_log("saveSnapShot: query: $snapshotFindQuery", 0);

	$result = sqlGetOneRow($snapshotFindQuery);	
	$snapshotId = $result[0]["snapshotId"];
	if($result != true)
		return rollback();

	error_log("saveSnapShot: ttData: ".json_encode($ttData), 0);
	error_log("saveSnapShot: fixedEntries: ".json_encode($feData), 0);

	$snapshotDeleteQuery = "DELETE FROM timeTable where snapshotId = $snapshotId;";	
	error_log("saveSnapShot: query: $snapshotDeleteQuery", 0);
	$result = sqlUpdate($snapshotDeleteQuery);
	if($result != true)
		return rollback();

	$snapshotDeleteQuery = "DELETE FROM fixedEntry where snapshotId = $snapshotId;";	
	error_log("saveSnapShot: query: $snapshotDeleteQuery", 0);
	$result = sqlUpdate($snapshotDeleteQuery);
	if($result != true)
		return rollback();

	for($k = 0; $k < count($ttData); $k++) {
		$currRow = $ttData[$k];
		$classId = $currRow["classId"];
		if($currRow["isFixed"] == 1) {
			$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, ".
							"teacherId, batchId, snapshotId, isFixed) VALUES (".
							$currRow["day"].",".$currRow["slotNo"].",".
							"null, $classId, null, null, ".
							//"(SELECT classId FROM class where classShortName=\"$className\"),".
							"null, ".
							$snapshotId.",".
							$currRow["isFixed"].");";
		} else {
			$batchStr = ($currRow["batchId"] == ""? "null": $currRow["batchId"]);
			$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, ".
							"teacherId, batchId, snapshotId, isFixed) VALUES (".
							$currRow["day"].",".$currRow["slotNo"].",".
							$currRow["roomId"].",".$currRow["classId"].",".
							$currRow["subjectId"].",".$currRow["teacherId"].",".
							$batchStr.",".
							$snapshotId.",".
							$currRow["isFixed"].");";
		}
		$result = sqlUpdate($ttInsertQuery);
		error_log("saveSnapShot: query: $ttInsertQuery", 0);
		if($result != true )
			return rollback();
	}
	for($k = 0; $k < count($feData); $k++) {
		$currRow = $feData[$k];
		$ttId = findTTId($currRow["ttId"], $ttData, $snapshotId);
		$feInsertQuery = "INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES (".
						$ttId.",\"".$currRow["fixedText"]."\",".$snapshotId.");";
		$result = sqlUpdate($feInsertQuery);
		error_log("saveSnapShot: query: $feInsertQuery", 0);
		if($result != true)
			return rollback();
	}
	sqlUpdate("COMMIT;");
	$resString = "{\"Success\": \"True\"}";
	error_log("saveSnapShot: Success True".  $resString, 0);
	return $resString;
}
global $newIDs;
function cloneAllTables($currentSnapshotId, $newSnapshotId) {
	/* Stage 1: Tables without any foreign key except snapshotId */
	$tableNames = array(//"dept", "config", "snapshot", 
					"teacher", 
					"class", 
					"room", 
					"subject", 
					"batch");
	for($k  = 0; $k < count($tableNames); $k++) {
		/* change snapshotId in each row of the table */
		$currTableName = $tableNames[$k];
		$getAllQuery = "SELECT * FROM $currTableName WHERE snapshotId = $currentSnapshotId";
		$allRows = sqlGetAllRows($getAllQuery);
		for($i = 0; $i < count($allRows); $i++)
			$allRows[$i]["snapshotId"] = $newSnapshotId;

		/* Get Names of columns for each table. This is to avoid per table code */
		$columnNamesQuery = " SELECT `COLUMN_NAME`  FROM `INFORMATION_SCHEMA`.`COLUMNS`  WHERE ".
							"`TABLE_SCHEMA`='timeTable'      AND `TABLE_NAME`='$currTableName';";
		$allColumnNames = sqlGetAllRows($columnNamesQuery);
		error_log("clone: got column Names: ". json_encode($allColumnNames));

		/* Make list of column names for INSERT query */
		$columnNames = "";
		$nColumns = count($allColumnNames);
		for($i = 1; $i < $nColumns - 1; $i++) { /* skip first Id column */
				$columnNames .= $allColumnNames[$i]["COLUMN_NAME"].", ";
		}
		$columnNames .= $allColumnNames[$nColumns - 1]["COLUMN_NAME"];

		$insertQueryHeader = "INSERT INTO $currTableName ($columnNames) VALUES ";
		/* 0'th column is always the Id for that table */
		$selectQueryHeader = "SELECT ".$allColumnNames[0]["COLUMN_NAME"]." FROM $currTableName WHERE ";
		for($i = 0; $i < count($allRows); $i++) {
			/* Make list of values for insert query and subsequent select query and make query*/
			array_shift($allRows[$i]);
			$valueString = implode("','", $allRows[$i]);
			$valueString = str_replace("''", "null", $valueString);
			$insertQuery = $insertQueryHeader."('".$valueString."')";

			/* The selection query will get us new Id. to be used as foreign key for other tables*/
			$selQueryStr = "";
			for($j = 1; $j < $nColumns - 1; $j++) { 
				$columnName = $allColumnNames[$j]["COLUMN_NAME"];
				$selQueryStr .= $columnName." = '".$allRows[$i][$columnName]."' AND ";
			}
			$selQueryStr .= " snapshotId = '".$newSnapshotId."';";
			$selQuery = $selectQueryHeader.$selQueryStr;
			//$allColumnNames[$nColumns - 1]["COLUMN_NAME"]." = ".$allRows[$i][$nColumns - 1].";";
			error_log("clone: select query: ".$selQuery, 0);

			if($i < 3) error_log("clone: Insert Query = ".$insertQuery, 0);
			$result = sqlUpdate($insertQuery);
			if($result === false) {
				return rollback();
				return false;
			}
			/* We'll need the new Id as foreign keys, store it */
			$id = sqlGetOneRow($selQuery);
			//$newIDs[$currTableName][$i] = $id[0][$allColumnNames[0]["COLUMN_NAME"]];
		}
	}

	/* ----------------------------------------------------------*/
	/* Stage 2: Tables with foreign keys from stage-1 tables*/
	$tableNames = array("batchCanOverlap", "batchClass", 
					"classRoom", "batchRoom", "subjectRoom", 
					"subjectBatchTeacher", "subjectClassTeacher", "overlappingSBT", 
					"fixedEntry");
	/* ----------------------------------------------------------*/
	/* batchClass Table */
	$getAllQuery = "SELECT * FROM batchClass WHERE snapshotId = $currentSnapshotId";
	$allRows = sqlGetAllRows($getAllQuery);
	error_log($getAllQuery, 0);
	for($i = 0; $i < count($allRows); $i++) {
		$insertQuery = "INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ".
				"(".
				"(SELECT batchId FROM batch WHERE batchName=".
					"(SELECT batchName from batch WHERE batchId=".$allRows[$i]["batchId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ". 
				"(SELECT classId FROM class WHERE classShortName=".
					"(SELECT classShortName from class WHERE classId=".$allRows[$i]["classId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), $newSnapshotId) "; 
		//error_log($insertQuery, 0);
		$result = sqlUpdate($insertQuery);
		if($result === false)
			return false; 
	}

	/* ----------------------------------------------------------*/
	/* classRoom Table */
	$getAllQuery = "SELECT * FROM classRoom WHERE snapshotId = $currentSnapshotId";
	$allRows = sqlGetAllRows($getAllQuery);
	error_log($getAllQuery, 0);
	for($i = 0; $i < count($allRows); $i++) {
		$insertQuery = "INSERT INTO classRoom(classId, roomId, snapshotId) VALUES ".
				"(".
				"(SELECT classId FROM class WHERE classShortName=".
					"(SELECT classShortName from class WHERE classId=".$allRows[$i]["classId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ".
				"(SELECT roomId FROM room WHERE roomShortName =".
					"(SELECT roomShortName from room WHERE roomId=".$allRows[$i]["roomId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ". 
				"$newSnapshotId) "; 
		//error_log($insertQuery, 0);
		$result = sqlUpdate($insertQuery);
		if($result === false)
			return false; 
	}
	/* ----------------------------------------------------------*/
	/* batchRoom Table */
	$getAllQuery = "SELECT * FROM batchRoom WHERE snapshotId = $currentSnapshotId";
	$allRows = sqlGetAllRows($getAllQuery);
	error_log($getAllQuery, 0);
	for($i = 0; $i < count($allRows); $i++) {
		$insertQuery = "INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ".
				"(".
				"(SELECT batchId FROM batch WHERE batchName=".
					"(SELECT batchName from batch WHERE batchId=".$allRows[$i]["batchId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ".
				"(SELECT roomId FROM room WHERE roomShortName =".
					"(SELECT roomShortName from room WHERE roomId=".$allRows[$i]["roomId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ". 
				"$newSnapshotId) "; 
		//error_log($insertQuery, 0);
		$result = sqlUpdate($insertQuery);
		if($result === false)
			return false; 
	}
	/* ----------------------------------------------------------*/
	/* subjectRoom Table */
	$getAllQuery = "SELECT * FROM subjectRoom WHERE snapshotId = $currentSnapshotId";
	$allRows = sqlGetAllRows($getAllQuery);
	error_log($getAllQuery, 0);
	for($i = 0; $i < count($allRows); $i++) {
		$insertQuery = "INSERT INTO subjectRoom(subjectId, roomId, snapshotId) VALUES ".
				"(".
				"(SELECT subjectId FROM subject WHERE subjectShortName=".
					"(SELECT subjectShortName from subject WHERE subjectId=".$allRows[$i]["subjectId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ".
				"(SELECT roomId FROM room WHERE roomShortName =".
					"(SELECT roomShortName from room WHERE roomId=".$allRows[$i]["roomId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ". 
				"$newSnapshotId) "; 
		//error_log($insertQuery, 0);
		$result = sqlUpdate($insertQuery);
		if($result === false)
			return false; 
	}

	/* ----------------------------------------------------------*/
	/* batchCanOverlap Table */
	$getAllQuery = "SELECT * FROM batchCanOverlap WHERE snapshotId = $currentSnapshotId";
	$allRows = sqlGetAllRows($getAllQuery);
	//error_log(json_encode($allRows), 0);
	error_log($getAllQuery, 0);
	for($i = 0; $i < count($allRows); $i++) {
		$insertQuery = "INSERT INTO batchCanOverlap(batchId, batchOverlapId, snapshotId) VALUES ".
				"(".
				"(SELECT batchId FROM batch WHERE batchName=".
					"(SELECT batchName from batch WHERE batchId=".$allRows[$i]["batchId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ". 
				"(SELECT batchId FROM batch WHERE batchName=".
					"(SELECT batchName from batch WHERE batchId=".$allRows[$i]["batchOverlapId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), $newSnapshotId) "; 
		//error_log($insertQuery), 0);
		$result = sqlUpdate($insertQuery);
		if($result === false)
			return false; 
	}

	/* ----------------------------------------------------------*/
	/* subjectBatchTeacher Table */
	$getAllQuery = "SELECT * FROM subjectBatchTeacher WHERE snapshotId = $currentSnapshotId";
	$allRows = sqlGetAllRows($getAllQuery);
	//error_log(json_encode($allRows), 0);
	error_log($getAllQuery, 0);
	for($i = 0; $i < count($allRows); $i++) {
		error_log(json_encode($allRows[$i]), 0);
		if($allRows[$i]["teacherId"] == null)
			$teacherStr = "null,";
		else
			$teacherStr = "".
				"(SELECT teacherId FROM teacher WHERE teacherShortName=".
					"(SELECT teacherShortName from teacher WHERE teacherId=".$allRows[$i]["teacherId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ";
		$insertQuery = "INSERT INTO subjectBatchTeacher (subjectId, batchId, teacherId, snapshotId) VALUES ".
				"(".
				"(SELECT subjectId FROM subject WHERE subjectShortName =".
					"(SELECT subjectShortName from subject WHERE subjectId=".$allRows[$i]["subjectId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ". 
				"(SELECT batchId FROM batch WHERE batchName=".
					"(SELECT batchName from batch WHERE batchId=".$allRows[$i]["batchId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ".
				$teacherStr.
				"$newSnapshotId) "; 
		error_log($insertQuery, 0);
		$result = sqlUpdate($insertQuery);
		if($result === false)
			return false; 
	}

	/* ----------------------------------------------------------*/
	/* subjectClassTeacher Table */
	$getAllQuery = "SELECT * FROM subjectClassTeacher WHERE snapshotId = $currentSnapshotId";
	$allRows = sqlGetAllRows($getAllQuery);
	//error_log(json_encode($allRows), 0);
	error_log($getAllQuery, 0);
	for($i = 0; $i < count($allRows); $i++) {
		error_log(json_encode($allRows[$i]), 0);
		if($allRows[$i]["teacherId"] == null)
			$teacherStr = "null, ";
		else
			$teacherStr = "".
				"(SELECT teacherId FROM teacher WHERE teacherShortName=".
					"(SELECT teacherShortName from teacher WHERE teacherId=".$allRows[$i]["teacherId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ";
		$insertQuery = "INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES ".
				"(".
				"(SELECT subjectId FROM subject WHERE subjectShortName =".
					"(SELECT subjectShortName from subject WHERE subjectId=".$allRows[$i]["subjectId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ". 
				"(SELECT classId FROM class WHERE classShortName=".
					"(SELECT classShortName from class WHERE classId=".$allRows[$i]["classId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ".
				$teacherStr.
				"$newSnapshotId) "; 
		error_log($insertQuery, 0);
		$result = sqlUpdate($insertQuery);
		if($result === false)
			return false; 
	}

	/* ----------------------------------------------------------*/
	/* overlappingSBT Table */
	/* This is quite complicated as overlappingSBT Table has foreign keys, which
	 * are recursively foreign-foreign-foreign keys 
	 */
	$getAllQuery = "SELECT * FROM overlappingSBT WHERE snapshotId = $currentSnapshotId";
	$allRows = sqlGetAllRows($getAllQuery);
	for($i = 0; $i < count($allRows); $i++) {
		$insertQuery = "";
		$sbtId1 = $allRows[$i]["sbtId1"];
		$sbtId2 = $allRows[$i]["sbtId2"];

		$tempQuery = "SELECT subjectId, batchId, teacherId from subjectBatchTeacher ".
						  " where sbtId = $sbtId1 and snapshotId = $currentSnapshotId";  
		$row = sqlGetOneRow($tempQuery);
		if($row === false)
			return false;
		$s1 = $row[0]["subjectId"]; $b1 = $row[0]["batchId"]; $t1 = $row[0]["teacherId"];

		$tempQuery = "SELECT subjectId, batchId, teacherId from subjectBatchTeacher ".
						  " where sbtId = $sbtId2 and snapshotId = $currentSnapshotId";  
		$row = sqlGetOneRow($tempQuery);
		if($row === false)
			return false;
		$s2 = $row[0]["subjectId"]; $b2 = $row[0]["batchId"]; $t2 = $row[0]["teacherId"];

		$tempQuery = "SELECT subjectId from subject where subjectShortName = ".
						" (SELECT subjectShortName from subject where subjectId = $s1 AND snapshotId = $currentSnapshotId) ".
					" AND snapshotId = $newSnapshotId";
		$row = sqlGetOneRow($tempQuery);
		if($row === false)
			return false;
		$news1 = $row[0]["subjectId"];

		$tempQuery = "SELECT batchId from batch where batchName = ".
						" (SELECT batchName from batch where batchId = $b1 AND snapshotId = $currentSnapshotId) ".
					" AND snapshotId = $newSnapshotId";
		$row = sqlGetOneRow($tempQuery);
		if($row === false)
			return false;
		$newb1 = $row[0]["batchId"];

		$tempQuery = "SELECT teacherId from teacher where teacherShortName = ".
						" (SELECT teacherShortName from teacher where teacherId = $t1 AND snapshotId = $currentSnapshotId) ".
					" AND snapshotId = $newSnapshotId";
		$row = sqlGetOneRow($tempQuery);
		if($row === false)
			return false;
		$newt1 = $row[0]["teacherId"];

		$tempQuery = "SELECT subjectId from subject where subjectShortName = ".
						" (SELECT subjectShortName from subject where subjectId = $s2 AND snapshotId = $currentSnapshotId) ".
					" AND snapshotId = $newSnapshotId";
		$row = sqlGetOneRow($tempQuery);
		if($row === false)
			return false;
		$news2 = $row[0]["subjectId"];

		$tempQuery = "SELECT batchId from batch where batchName = ".
						" (SELECT batchName from batch where batchId = $b2 AND snapshotId = $currentSnapshotId) ".
					" AND snapshotId = $newSnapshotId";
		$row = sqlGetOneRow($tempQuery);
		if($row === false)
			return false;
		$newb2 = $row[0]["batchId"];

		$tempQuery = "SELECT teacherId from teacher where teacherShortName = ".
						" (SELECT teacherShortName from teacher where teacherId = $t2 AND snapshotId = $currentSnapshotId) ".
					" AND snapshotId = $newSnapshotId";
		$row = sqlGetOneRow($tempQuery);
		if($row === false)
			return false;
		$newt2 = $row[0]["teacherId"];

		$tempQuery = "SELECT sbtId from subjectBatchTeacher where subjectId = $news1 ".
					 " AND batchId = $newb1 and teacherId = $newt1 and snapshotId = $newSnapshotId";	
		$row = sqlGetOneRow($tempQuery);
		if($row === false)
			return false;
		$newsbtId1 = $row[0]["sbtId"];

		$tempQuery = "SELECT sbtId from subjectBatchTeacher where subjectId = $news2 ".
					 " AND batchId = $newb2 and teacherId = $newt2 and snapshotId = $newSnapshotId";	
		$row = sqlGetOneRow($tempQuery);
		if($row === false)
			return false;
		$newsbtId2 = $row[0]["sbtId"];

		$insertQuery = "INSERT INTO overlappingSBT (sbtId1, sbtId2, snapshotId) VALUES ".
						"($newsbtId1, $newsbtId2, $newSnapshotId)";
		error_log($insertQuery, 0);
		$result = sqlUpdate($insertQuery);
		if($result === false)
			return false; 
	}

	return true;
}

function saveNewSnapshot() {
	header("Content-Type: application/JSON: charset=UTF-8");

	$newSnapshotName = getArgument("newSnapshotName");
	$currentSnapshotName = getArgument("currentSnapshotName");
	$user = getArgument("userId");
	$ttd = getArgument("ttData");
	$configId = getArgument("configId");
	$ttData = json_decode($ttd, true);	
	$fed = getArgument("feData");
	$feData = json_decode($fed, true);	

	$startTransactionQuery = "START TRANSACTION;";
	$result = sqlUpdate($startTransactionQuery); 
	if($result != true)
		return rollback();

	$snapshotCreateQuery = "INSERT INTO snapshot (snapshotName, snapshotCreator, createTime, modifyTime, configId) ".
							"VALUES (\"".
							$newSnapshotName."\",1,1000,2000, $configId);";
	$result = sqlUpdate($snapshotCreateQuery);	
	error_log("saveNewSnapshot: query: " + $result);
	if($result === false)
		return rollback();

	$query1 = "SELECT snapshotId FROM snapshot WHERE snapshotName = \"$currentSnapshotName\"";
	$query2 = "SELECT snapshotId FROM snapshot WHERE snapshotName = \"$newSnapshotName\"";
	$result = sqlGetOneRow($query1);	
	$currentSnapshotId = $result[0]["snapshotId"];
	$result = sqlGetOneRow($query2);	
	$newSnapshotId = $result[0]["snapshotId"];

	$cloneResult = cloneAllTables($currentSnapshotId, $newSnapshotId);
	if($cloneResult === false)
		return rollback();

	for($k = 0; $k < count($ttData); $k++) {
			$currRow = $ttData[$k];
			$classId = $currRow["classId"];
			if($currRow["isFixed"] == 1) {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, 
								teacherId, batchId, snapshotId, isFixed) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								"null, $classId, null, ".
								//"(SELECT classId FROM class where classShortName=\"$className\"),".
								"null, null, ".
								"(SELECT snapshotId FROM snapshot where snapshotName = \"$newSnapshotName\"),".
								$currRow["isFixed"].");";
			} else {
				$batchStr = ($currRow["batchId"] == ""? "null": $currRow["batchId"]);
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, 
								teacherId, batchId, snapshotId, isFixed) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								$currRow["roomId"].",".$currRow["classId"].",".
								$currRow["subjectId"].",".$currRow["teacherId"].",".
								$batchStr.",".
								"(SELECT snapshotId FROM snapshot where snapshotName = \"$newSnapshotName\"),".
								$currRow["isFixed"].");";
			}
			$result = sqlUpdate($ttInsertQuery);
			error_log("saveNewSnapshot: query: " + $ttInsertQuery);
			if($result != true )
				return rollback();
	}
	for($k = 0; $k < count($feData); $k++) {
		$currRow = $feData[$k];
		$ttId = findNewTTId($currRow["ttId"], $ttData, $currentSnapshotId, $newSnapshotId);
		$feInsertQuery = "INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES (".
						$ttId.",\"".$currRow["fixedText"]."\",".$newSnapshotId.");";
		$result = sqlUpdate($feInsertQuery);
		error_log("saveSnapShot: query: $feInsertQuery", 0);
		if($result != true)
			return rollback();
	}
	
	sqlUpdate("COMMIT;");
	$resString = "{\"Success\": \"True\",";
	$resString .= "\"snapshotId\": \"$newSnapshotId\"}";
	error_log("saveNewSnapShot: Success True".  $resString, 0);
	return $resString;
}

?>

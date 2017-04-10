<?php
/* When we get data here, the ttId in timeTable and ttId in fixedEntry 
 * are likely to be wrong, as they were just computed at user end. Take care
 * of that. 
 */
function rollback() {
	global $CFG;
	sqlUpdate("ROLLBACK;");
	$resString = "{\"Success\": \"False\",";
	$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
	return $resString;
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

	$startTransactionQuery = "START TRANSACTION";
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
function cloneAllTables($currentSnapshotId, $newSnapshotId) {
	$tableNames = array(//"dept", "config", "snapshot", 
					"teacher", 
					"class", 
					"batch", "batchCanOverlap", "batchClass", 
					"room", 
					"classRoom", "batchRoom", "subjectRoom", 
					"subject", 
					"subjectBatchTeacher", "subjectClassTeacher", "overlappingSBT", 
					"fixedEntry");
	for($k  = 0; $k < count($tableNames); $k++) {
		$currTableName = $tableNames[$k];
		$getAllQuery = "SELECT * FROM $currTableName WHERE snapshotId = $currentSnapshotId";
		$allRows = sqlGetAllRows($getAllQuery);
		for($i = 0; $i < count($allRows); $i++) {
			$allRows[$i]["snapshotId"] = $newSnapshotId;
		}
		$columnNamesQuery = " SELECT `COLUMN_NAME`  FROM `INFORMATION_SCHEMA`.`COLUMNS`  WHERE ".
							"`TABLE_SCHEMA`='timeTable'      AND `TABLE_NAME`='$currTableName';";
		$allColumnNames = sqlGetAllRows($columnNamesQuery);
		error_log("clone: got column Names: ". json_encode($allColumnNames));
		$columnNames = "";
		for($i = 1; $i < count($allColumnNames) - 1; $i++) { /* skip first Id column */
				$columnNames .= $allColumnNames[$i]["COLUMN_NAME"].", ";
		}
		$columnNames .= $allColumnNames[count($allColumnNames) - 1]["COLUMN_NAME"];
		$insertQueryHeader = "INSERT INTO $currTableName ($columnNames) VALUES ";
		for($i = 0; $i < count($allRows); $i++) {
			array_shift($allRows[$i]);
			$valueString = implode("','", $allRows[$i]);
			$valueString = str_replace("''", "null", $valueString);
			$insertQuery = $insertQueryHeader."('".$valueString."')";
			if($i < 3) error_log("clone: Insert Query = ".$insertQuery, 0);
			$result = sqlUpdate($insertQuery);
			if($result == false) {
				error_log("clone: query failed ". $insertQuery. "\nError: ".json_encode($CFG->conn->error));
				return false;
			}
		}
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

	$snapshotCreateQuery = "INSERT INTO snapshot (snapshotName, snapshotCreator, createTime, modifyTime, configId) ".
							"VALUES (\"".
							$newSnapshotName."\",1,1000,2000, $configId);";
	$result = sqlUpdate($snapshotCreateQuery);	
	error_log("saveNewSnapshot: query: " + $result);

	$query1 = "SELECT snapshotId FROM snapshot WHERE snapshotName = \"$currentSnapshotName\"";
	$query2 = "SELECT snapshotId FROM snapshot WHERE snapshotName = \"$newSnapshotName\"";
	$result = sqlGetOneRow($query1);	
	$currentSnapshotId = $result[0]["snapshotId"];
	$result = sqlGetOneRow($query2);	
	$newSnapshotId = $result[0]["snapshotId"];

	$cloneResult = cloneAllTables($currentSnapshotId, $newSnapshotId);

	if($cloneResult == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : \"Cloning Failed\"}";
		return $resString;
	}

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
			if($result != true ) {
				$resString = "{\"Success\": \"False\",";
				$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
			} else {
				$resString = "{\"Success\": \"True\"}";
			}
	}
	$resString = "{\"Success\": \"True\",";
	$resString .= "\"snapshotId\": \"$newSnapshotId\"}";
	error_log("saveNewSnapShot: Success True".  $resString, 0);
	return $resString;
}

?>

<?php

// This file is part of Taasika - a timetabling software for
// schools, colleges/universities.
//
// Taasika is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Taasika is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Taasika.  If not, see <http://www.gnu.org/licenses/>.

/**
 *
 * Copyright 2017 Abhijit A. M.(abhijit13@gmail.com)
 */


/* When we get data here, the ttId in timeTable and ttId in fixedEntry
 * are likely to be wrong, as they were just computed at user end. Take care
 * of that.
 */
function rollback() {
	global $CFG;
	$res = sqlUpdate("ROLLBACK;");
	if($res === false) {
		ttlog("rollback: Failed");
	} else
		ttlog("rollback: Success");
	$resString = "{\"Success\": \"False\",";
	$resString .= "\"Error\" : ".json_encode($CFG->conn->error).",";
	$resString .= "\"Query\" : \"".$CFG->last_query."\"}";
	return $resString;
}
function findNewTTId($ttId, $ttData, $currentSnapshotId, $newSnapshotId) {
	$index = -1;
	for($i = 0; $i < count($ttData); $i++) {
		if($ttData[$i]["ttId"] == $ttId) {
			$index = $i;
			break;
		}
	}
	if($index != -1) {
		$row = $ttData[$index];
		$newClassQuery = "SELECT classId from class WHERE classShortName = ".
							"(SELECT classShortName from class where classId = ".$row["classId"].
							" AND snapshotId = $currentSnapshotId )".
						" AND snapshotId = $newSnapshotId";
		$result = sqlGetOneRow($newClassQuery);
		$newClassId = $result[0]["classId"];
		$selectQuery = "SELECT ttId FROM timeTable WHERE".
						" day = ". $row["day"] . " AND slotNo = ". $row["slotNo"].
						" AND classId = ". $newClassId.
						/*" AND roomId = ".$row["roomId"]. " AND teacherId = ".$row["teacherId"].
						" AND batchId = ". $row["batchId"].
						" AND subjectId = ".$row["subjectId"]. */
						" AND isFixed = ".$row["isFixed"]. " AND snapshotId = $newSnapshotId;";
		$res = sqlGetOneRow($selectQuery);
		return $res[0]["ttId"];
	}
}
function findTTId($ttId, $ttData, $snapshotId) {
	$index = -1;
	for($i = 0; $i < count($ttData); $i++) {
		if($ttData[$i]["ttId"] == $ttId) {
			$index = $i;
			break;
		}
	}
	if($index != -1) {
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
}
function insertSnapshotEntry() {
	header("Content-Type: application/JSON: charset=UTF-8");
	global $CFG;
	$snapshotName = getArgument("snapshotName");
	$snapshotCreator = getArgument("snapshotCreator");
	$configId = getArgument("configId");
	date_default_timezone_set("Asia/Kolkata");

	$query = "INSERT INTO snapshot (snapshotName, snapshotCreator, createTime,".
				"modifyTime, configId) VALUES ('$snapshotName', $snapshotCreator,".
				"now(), now(), $configId);";
	$result = sqlUpdate($query);
	if($result === false) {
		ttlog("insertSnapshotEntry: $query Failed");
		$resString = "{\"Success\": \"False\"}";
		return $resString;
	}
	ttlog("insertSnapshotEntry: $query Success");
	$resString = "{\"Success\": \"True\"}";
	return $resString;
}
function saveSnapshot() {
	header("Content-Type: application/JSON: charset=UTF-8");
	global $CFG;
	$resString = "{\"Success\": \"True\"}";

	$snapshotName = getArgument("snapshotName");
	$user = getArgument("userId");
	$ttd = getArgument("ttData");
	$fed = getArgument("feData");
	$crd = getArgument("crData");
	$brd = getArgument("brData");
	$srd = getArgument("srData");
	$ttData = json_decode($ttd, true);
	$feData = json_decode($fed, true);
	$crData = json_decode($crd, true);
	$brData = json_decode($brd, true);
	$srData = json_decode($srd, true);
	date_default_timezone_set("Asia/Kolkata");

	$startTransactionQuery = "START TRANSACTION;";
	$result = sqlUpdate($startTransactionQuery);
	if($result != true)
		return rollback();

	$snapshotFindQuery = "SELECT snapshotId FROM snapshot WHERE snapshotName = \"$snapshotName\"";
	ttlog("saveSnapShot: query: $snapshotFindQuery");

	$result = sqlGetOneRow($snapshotFindQuery);
	$snapshotId = $result[0]["snapshotId"];
	if($result != true)
		return rollback();

	ttlog("saveSnapShot: ttData: ".json_encode($ttData));
	ttlog("saveSnapShot: fixedEntries: ".json_encode($feData));

	$snapshotDeleteQuery = "DELETE FROM timeTable where snapshotId = $snapshotId;";
	ttlog("saveSnapShot: query: $snapshotDeleteQuery");
	$result = sqlUpdate($snapshotDeleteQuery);
	if($result != true)
		return rollback();

	$snapshotDeleteQuery = "DELETE FROM fixedEntry where snapshotId = $snapshotId;";
	ttlog("saveSnapShot: query: $snapshotDeleteQuery");
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
		ttlog("saveSnapShot: query: $ttInsertQuery");
		if($result != true )
			return rollback();
	}
	for($k = 0; $k < count($feData); $k++) {
		$currRow = $feData[$k];
		$ttId = findTTId($currRow["ttId"], $ttData, $snapshotId);
		$feInsertQuery = "INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES (".
						$ttId.",\"".$currRow["fixedText"]."\",".$snapshotId.");";
		$result = sqlUpdate($feInsertQuery);
		ttlog("saveSnapShot: query: $feInsertQuery");
		if($result != true)
			return rollback();
	}
	$snapshotDeleteQuery = "DELETE FROM classRoom where snapshotId = $snapshotId;";
	ttlog("saveSnapshot: query: $snapshotDeleteQuery");
	$result = sqlUpdate($snapshotDeleteQuery);
	if($result != true)
		return rollback();

	for($k = 0; $k < count($crData); $k++) {
		$currRow = $crData[$k];
		$query = "INSERT INTO classRoom (classId, roomId, snapshotId) ".
			 "VALUES (". $currRow['classId'] .",". $currRow['roomId'] .", $snapshotId);";
		$result = sqlUpdate($query);
		ttlog("saveSnapshot: query: $query");
		if($result != true)
			return rollback();
	}

	$snapshotDeleteQuery = "DELETE FROM batchRoom where snapshotId = $snapshotId;";
	ttlog("saveSnapshot: query: $snapshotDeleteQuery");
	$result = sqlUpdate($snapshotDeleteQuery);
	if($result != true)
		return rollback();

	for($k = 0; $k < count($brData); $k++) {
		$currRow = $brData[$k];
		$query = "INSERT INTO batchRoom (batchId, roomId, snapshotId) ".
			 "VALUES (". $currRow['batchId'] .",". $currRow['roomId'] .", $snapshotId);";
		$result = sqlUpdate($query);
		ttlog("saveSnapshot: query: $query");
		if($result != true)
			return rollback();
	}

	$snapshotDeleteQuery = "DELETE FROM subjectRoom where snapshotId = $snapshotId;";
	ttlog("saveSnapshot: query: $snapshotDeleteQuery");
	$result = sqlUpdate($snapshotDeleteQuery);
	if($result != true)
		return rollback();

	for($k = 0; $k < count($srData); $k++) {
		$currRow = $srData[$k];
		$query = "INSERT INTO subjectRoom (subjectId, roomId, snapshotId) ".
			 "VALUES (". $currRow['subjectId'] .",". $currRow['roomId'] .", $snapshotId);";
		$result = sqlUpdate($query);
		ttlog("saveSnapshot: query: $query");
		if($result != true)
			return rollback();
	}

	$snapshotUpdateQuery = "UPDATE snapshot SET modifyTime = now() where snapshotId = $snapshotId;";
	ttlog("saveSnapshot: query: $snapshotUpdateQuery");
	$result = sqlUpdate($snapshotUpdateQuery);
	if($result != true)
		return rollback();

	sqlUpdate("COMMIT;");
	$resString = "{\"Success\": \"True\"}";
	ttlog("saveSnapShot: Success True".  $resString);
	return $resString;
}
global $newIDs;
function cloneAllTables($currentSnapshotId, $newSnapshotId) {
	global $CFG;	
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
							"`TABLE_SCHEMA`='".$CFG->db_database."'      AND `TABLE_NAME`='$currTableName';";
		$allColumnNames = sqlGetAllRows($columnNamesQuery);
		ttlog("clone: got column Names: ". json_encode($allColumnNames));
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
			ttlog("clone: select query: ".$selQuery);

			if($i < 3) ttlog("clone: Insert Query = ".$insertQuery);
			$result = sqlUpdate($insertQuery);
			if($result === false) {
				return rollback();
				return false;
			}
			/* We'll need the new Id as foreign keys, store it */
			$id = sqlGetOneRow($selQuery);
		}
	}

	/* ----------------------------------------------------------*/
	/* Stage 2: Tables with foreign keys from stage-1 tables*/
	$tableNames = array("batchCanOverlap", "batchClass",
					"subjectBatchTeacher", "subjectClassTeacher", "overlappingSBT",
					"fixedEntry", "classRoom", "batchRoom", "subjectRoom");
	/* ----------------------------------------------------------*/
	/* batchClass Table */
	$getAllQuery = "SELECT * FROM batchClass WHERE snapshotId = $currentSnapshotId";
	$allRows = sqlGetAllRows($getAllQuery);
	ttlog($getAllQuery);
	for($i = 0; $i < count($allRows); $i++) {
		$insertQuery = "INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ".
				"(".
				"(SELECT batchId FROM batch WHERE batchName=".
					"(SELECT batchName from batch WHERE batchId=".$allRows[$i]["batchId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ".
				"(SELECT classId FROM class WHERE classShortName=".
					"(SELECT classShortName from class WHERE classId=".$allRows[$i]["classId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), $newSnapshotId) ";
		$result = sqlUpdate($insertQuery);
		if($result === false)
			return false;
	}

	/* ----------------------------------------------------------*/
	/* batchCanOverlap Table */
	$getAllQuery = "SELECT * FROM batchCanOverlap WHERE snapshotId = $currentSnapshotId";
	$allRows = sqlGetAllRows($getAllQuery);
	ttlog($getAllQuery);
	for($i = 0; $i < count($allRows); $i++) {
		$insertQuery = "INSERT INTO batchCanOverlap(batchId, batchOverlapId, snapshotId) VALUES ".
				"(".
				"(SELECT batchId FROM batch WHERE batchName=".
					"(SELECT batchName from batch WHERE batchId=".$allRows[$i]["batchId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ".
				"(SELECT batchId FROM batch WHERE batchName=".
					"(SELECT batchName from batch WHERE batchId=".$allRows[$i]["batchOverlapId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), $newSnapshotId) ";
		$result = sqlUpdate($insertQuery);
		if($result === false)
			return false;
	}

	/* ----------------------------------------------------------*/
	/* subjectBatchTeacher Table */
	$getAllQuery = "SELECT * FROM subjectBatchTeacher WHERE snapshotId = $currentSnapshotId";
	$allRows = sqlGetAllRows($getAllQuery);
	ttlog($getAllQuery);
	for($i = 0; $i < count($allRows); $i++) {
		ttlog(json_encode($allRows[$i]));
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
		ttlog($insertQuery);
		$result = sqlUpdate($insertQuery);
		if($result === false)
			return false;
	}

	/* ----------------------------------------------------------*/
	/* subjectClassTeacher Table */
	$getAllQuery = "SELECT * FROM subjectClassTeacher WHERE snapshotId = $currentSnapshotId";
	$allRows = sqlGetAllRows($getAllQuery);
	ttlog($getAllQuery);
	for($i = 0; $i < count($allRows); $i++) {
		ttlog(json_encode($allRows[$i]));
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
		ttlog($insertQuery);
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
		ttlog($insertQuery);
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
	$crd = getArgument("crData");
	$crData = json_decode($crd, true);
	$brd = getArgument("brData");
	$brData = json_decode($brd, true);
	$srd = getArgument("srData");
	$srData = json_decode($srd, true);
	date_default_timezone_set("Asia/Kolkata");

	$startTransactionQuery = "START TRANSACTION;";
	$result = sqlUpdate($startTransactionQuery);
	if($result != true)
		return rollback();

	$snapshotCreateQuery = "INSERT INTO snapshot (snapshotName, snapshotCreator, createTime, modifyTime, configId) ".
							"VALUES (\"".
							$newSnapshotName."\",1,now(),now(), $configId);";
	$result = sqlUpdate($snapshotCreateQuery);
	ttlog("saveNewSnapshot: query: ". $result);
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
			ttlog("row: ".json_encode($currRow));

			$classId = $currRow["classId"];
			$roomId = $currRow["roomId"];
			$subjectId = $currRow["subjectId"];
			$teacherId = $currRow["teacherId"];
			$batchId = $currRow["batchId"];
			//$batchStr = ($currRow["batchId"] == ""? "null": $currRow["batchId"]);

			if($classId != "null" && $classId != "") {
				$tempQuery = "SELECT classId from class where classShortName= ".
								" (SELECT classShortName from class where classId = $classId AND snapshotId = $currentSnapshotId) ".
							" AND snapshotId = $newSnapshotId";
				$row = sqlGetOneRow($tempQuery);
				if($row === false)
					return false;
				$newClassId = $row[0]["classId"];
			} else
				$newClassId = "null";

			if($roomId != "null" && $roomId !="") {
				$tempQuery = "SELECT roomId from room where roomShortName= ".
								" (SELECT roomShortName from room where roomId = $roomId AND snapshotId = $currentSnapshotId) ".
							" AND snapshotId = $newSnapshotId";
				$row = sqlGetOneRow($tempQuery);
				if($row === false)
					return false;
				$newRoomId = $row[0]["roomId"];
			} else
				$newRoomId = "null";

			if($subjectId != "null" && $subjectId != "") {
				$tempQuery = "SELECT subjectId from subject where subjectShortName = ".
								" (SELECT subjectShortName from subject where subjectId = $subjectId AND snapshotId = $currentSnapshotId) ".
							" AND snapshotId = $newSnapshotId";
				$row = sqlGetOneRow($tempQuery);
				if($row === false)
					return false;
				$newSubjectId = $row[0]["subjectId"];
			} else
				$newSubjectId = "null";

			if($teacherId != "null" && $teacherId != "") {
				$tempQuery = "SELECT teacherId from teacher where teacherShortName= ".
								" (SELECT teacherShortName from teacher where teacherId = $teacherId AND snapshotId = $currentSnapshotId) ".
							" AND snapshotId = $newSnapshotId";
				$row = sqlGetOneRow($tempQuery);
				if($row === false)
					return false;
				$newTeacherId = $row[0]["teacherId"];
			} else
				$newTeacherId = "null";

			if($batchId != "null" && $batchId != "") {
				$tempQuery = "SELECT batchId from batch where batchName = ".
								" (SELECT batchName from batch where batchId = $batchId AND snapshotId = $currentSnapshotId) ".
							" AND snapshotId = $newSnapshotId";
				$row = sqlGetOneRow($tempQuery);
				if($row === false)
					return false;
				$newBatchId = $row[0]["batchId"];
			} else
				$newBatchId = "null";

			if($currRow["isFixed"] == 1) {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, ".
								" teacherId, batchId, snapshotId, isFixed) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								"null, $newClassId, null, ".
								"null, null, ".
								"(SELECT snapshotId FROM snapshot where snapshotName = \"$newSnapshotName\"),".
								$currRow["isFixed"].");";
			} else {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, ".
								" teacherId, batchId, snapshotId, isFixed) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								$newRoomId.",".$newClassId.",".
								$newSubjectId.",".$newTeacherId.",".
								$newBatchId.",".
								"(SELECT snapshotId FROM snapshot where snapshotName = \"$newSnapshotName\"),".
								$currRow["isFixed"].");";
			}
			$result = sqlUpdate($ttInsertQuery);
			ttlog("saveNewSnapshot: query: ". $ttInsertQuery);
			if($result != true )
				return rollback();
	}
	for($k = 0; $k < count($feData); $k++) {
		$currRow = $feData[$k];
		$ttId = findNewTTId($currRow["ttId"], $ttData, $currentSnapshotId, $newSnapshotId);
		$feInsertQuery = "INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES (".
						$ttId.",\"".$currRow["fixedText"]."\",".$newSnapshotId.");";
		$result = sqlUpdate($feInsertQuery);
		ttlog("saveNewSnapShot: query: $feInsertQuery");
		if($result != true)
			return rollback();
	}
	for($k = 0; $k < count($crData); $k++) {
		$crInsertQuery = "INSERT INTO classRoom(classId, roomId, snapshotId) VALUES ".
				"(".
				"(SELECT classId FROM class WHERE classShortName=".
					"(SELECT classShortName from class WHERE classId=".$crData[$k]["classId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ".
				"(SELECT roomId FROM room WHERE roomShortName =".
					"(SELECT roomShortName from room WHERE roomId=".$crData[$k]["roomId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ".
				"$newSnapshotId) ";
		ttlog("saveNewSnapShot: query: $crInsertQuery");
		$result = sqlUpdate($crInsertQuery);
		if($result != true)
			return rollback();
	}
	for($k = 0; $k < count($brData); $k++) {
		$brInsertQuery = "INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ".
				"(".
				"(SELECT batchId FROM batch WHERE batchName=".
					"(SELECT batchName from batch WHERE batchId=".$brData[$k]["batchId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ".
				"(SELECT roomId FROM room WHERE roomShortName =".
					"(SELECT roomShortName from room WHERE roomId=".$brData[$k]["roomId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ".
				"$newSnapshotId) ";
		ttlog("saveNewSnapShot: query: $brInsertQuery");
		$result = sqlUpdate($brInsertQuery);
		if($result != true)
			return rollback();
	}
	for($k = 0; $k < count($srData); $k++) {
		$srInsertQuery = "INSERT INTO subjectRoom(subjectId, roomId, snapshotId) VALUES ".
				"(".
				"(SELECT subjectId FROM subject WHERE subjectShortName=".
					"(SELECT subjectShortName from subject WHERE subjectId=".$srData[$k]["subjectId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ".
				"(SELECT roomId FROM room WHERE roomShortName =".
					"(SELECT roomShortName from room WHERE roomId=".$srData[$k]["roomId"]." AND snapshotId = $currentSnapshotId)".
				" AND snapshotId = $newSnapshotId), ".
				"$newSnapshotId) ";
		ttlog("saveNewSnapShot: query: $srInsertQuery");
		$result = sqlUpdate($srInsertQuery);
		if($result != true)
			return rollback();
	}
	sqlUpdate("COMMIT;");
	$resString = "{\"Success\": \"True\",";
	$resString .= "\"snapshotId\": \"$newSnapshotId\"}";
	ttlog("saveNewSnapShot: Success True".  $resString);
	return $resString;
}

?>

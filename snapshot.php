<?php

function saveSnapshot() {
	header("Content-Type: application/JSON: charset=UTF-8");
	global $CFG;
	$resString = "{\"Success\": \"True\"}";

	$snapshotName = getArgument("snapname");
	$user = getArgument("userId");
	$ttd = getArgument("ttData");
	$ttData = json_decode($ttd, true);	
	$snapshotFindQuery = "SELECT snapshotId FROM snapshot WHERE snapshotName = \"$snapshotName\"";
	error_log("saveSnapShot: query: $snapshotFindQuery", 0);

	$result = sqlGetOneRow($snapshotFindQuery);	
	$snapshotId = $result[0]["snapshotId"];

	$snapshotDeleteQuery = "DELETE from timeTable where snapshotId = $snapshotId";	
	$result = sqlUpdate($snapshotDeleteQuery);
	error_log("saveSnapShot: query: $snapshotDeleteQuery", 0);
	error_log("saveSnapShot: ttData: ".json_encode($ttData), 0);
	for($k = 0; $k < count($ttData); $k++) {
			$currRow = $ttData[$k];
			$classId = $currRow["classId"];
			if($currRow["isFixed"] == 1) {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, ".
								"teacherId, batchId, configId, snapshotId, isFixed) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								"null, null, null, ".
								//"(SELECT classId from class where classShortName=\"$className\"),".
								$classId.",".
								"null, null,".
								$snapshotId.",".
								$currRow["isFixed"].");";
			} else {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, ".
								"teacherId, batchId, configId, snapshotId, isFixed) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								$currRow["roomId"].",".$currRow["classId"].",".
								$currRow["subjectId"].",".$currRow["teacherId"].",".
								$currRow["batchId"].",".$currRow["configId"].",".
								$snapshotId.",".
								$currRow["isFixed"].");";
			}
			$result = sqlUpdate($ttInsertQuery);
			error_log("saveSnapShot: query: $ttInsertQuery", 0);
			if($result != true ) {
				$resString = "{\"Success\": \"False\",";
				$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
				return $resString;
			}
	}
	$resString = "{\"Success\": \"True\"}";
	error_log("saveSnapShot: Success True".  $resString, 0);
	return $resString;
}

function saveNewSnapshot() {
	header("Content-Type: application/JSON: charset=UTF-8");

	$snapshotName = getArgument("snapname");
	$user = getArgument("userId");
	$ttd = getArgument("ttData");
	$configId = getArgument("configId");
	$ttData = json_decode($ttd, true);	
	$snapshotCreateQuery = "INSERT INTO snapshot (snapshotName, snapshotCreator, createTime, modifyTime, configId) ".
							"VALUES (\"".
							$snapshotName."\",1,1000,2000, $configId);";
	$result = sqlUpdate($snapshotCreateQuery);	
	error_log("saveNewSnapshot: query: " + $result);

	for($k = 0; $k < count($ttData); $k++) {
			$currRow = $ttData[$k];
			$classId = $currRow["classId"];
			if($currRow["isFixed"] == 1) {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, 
								teacherId, batchId, configId, snapshotId, isFixed) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								"null, null, null, ".
								//"(SELECT classId from class where classShortName=\"$className\"),".
								$classId.",".
								"null, null,".
								"(SELECT snapshotId from snapshot where snapshotName = \"$snapshotName\"),".
								$currRow["isFixed"].");";
			} else {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, 
								teacherId, batchId, configId, snapshotId, isFixed) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								$currRow["roomId"].",".$currRow["classId"].",".
								$currRow["subjectId"].",".$currRow["teacherId"].",".
								$currRow["batchId"].",".$currRow["configId"].",".
								"(SELECT snapshotId from snapshot where snapshotName = \"$snapshotName\"),".
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
	$resString = "{\"Success\": \"True\"}";
	error_log("saveNewSnapShot: Success True".  $resString, 0);
	return $resString;
}

?>

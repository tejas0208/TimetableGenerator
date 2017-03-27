<?php

function saveSnapshot() {
	$resString = "";
	header("Content-Type: application/json: charset=UTF-8");
	$snapshotName = getArgument("snapname");
	$user = getArgument("userid");
	$ttd = getArgument("ttdata");
	$ttdata = json_decode($ttd, true);	
	$snapshotFindQuery = "SELECT snapshotId FROM snapshot WHERE snapshotName = \"$snapshotName\"";

	$result = sqlGetOneRow($snapshotFindQuery);	
	$snapshotId = $result[0]["snapshotId"];

	$snapshotDeleteQuery = "DELETE from timeTable where snapshotId = $snapshotId";	
	$result = sqlUpdate($snapshotDeleteQuery);

	for($k = 0; $k < count($ttdata); $k++) {
			$currRow = $ttdata[$k];
			$classId = $currRow["classId"];
			if($currRow["isBreak"] == 1) {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, 
								teacherId, batchId, configId, snapshotId, isBreak) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								"null, null, null, ".
								//"(SELECT classId from class where classShortName=\"$className\"),".
								$classId.",".
								"null, null,".
								$snapshotId.",".
								$currRow["isBreak"].");";
			} else {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, 
								teacherId, batchId, configId, snapshotId, isBreak) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								$currRow["roomId"].",".$currRow["classId"].",".
								$currRow["subjectId"].",".$currRow["teacherId"].",".
								$currRow["batchId"].",".$currRow["configId"].",".
								$snapshotId.",".
								$currRow["isBreak"].");";
			}
			$result = sqlUpdate($ttInsertQuery);
			if($result != true ) {
					$resString .= "Failed insert on $ttInsertQuery. Error = $result->conn \n";			
			}
	}
	return $resString;
}

function saveNewSnapshot() {
	$resString = "";
	header("Content-Type: application/json: charset=UTF-8");
	$snapshotName = getArgument("snapname");
	$user = getArgument("userid");
	$ttd = getArgument("ttdata");
	$ttdata = json_decode($ttd, true);	
	$snapshotCreateQuery = "INSERT INTO snapshot (snapshotName, snapshotCreator, createTime, modifyTime) VALUES (\"".
							$snapshotName."\",1,1000,2000);";
	$result = sqlUpdate($snapshotCreateQuery);	

	for($k = 0; $k < count($ttdata); $k++) {
			$currRow = $ttdata[$k];
			$classId = $currRow["classId"];
			if($currRow["isBreak"] == 1) {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, 
								teacherId, batchId, configId, snapshotId, isBreak) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								"null, null, null, ".
								//"(SELECT classId from class where classShortName=\"$className\"),".
								$classId.",".
								"null, null,".
								"(SELECT snapshotId from snapshot where snapshotName = \"$snapshotName\"),".
								$currRow["isBreak"].");";
			} else {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, 
								teacherId, batchId, configId, snapshotId, isBreak) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								$currRow["roomId"].",".$currRow["classId"].",".
								$currRow["subjectId"].",".$currRow["teacherId"].",".
								$currRow["batchId"].",".$currRow["configId"].",".
								"(SELECT snapshotId from snapshot where snapshotName = \"$snapshotName\"),".
								$currRow["isBreak"].");";
			}
			$result = sqlUpdate($ttInsertQuery);
			if($result != true ) {
					$resString .= "Failed insert on $ttInsertQuery. Error = $result->conn \n";			
			}
	}
	return $resString;
}

?>

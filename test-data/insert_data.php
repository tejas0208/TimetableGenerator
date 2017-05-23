<?php

/*
 *	Author: Aniket Bhadane
 *  
 *	Description: Use for loading test-data. Drop and Create database. Read CSV files and insert into database. Can be used on any platform
*/
	
require_once('../config.php');

$conn = new mysqli($CFG->server, $CFG->db_user, $CFG->db_pass, $CFG->db_database);
if($conn->error) {
	die("<br/>connection error ". $conn->error . "<br/>"); 
}

function insertCsv($conn, $filename) {

	$PATH = "csv/full/"; // specify the path to csv files

	$filepath = $PATH . $filename;

	$file = fopen($filepath, "r");

	$sql = "";
	$sql1 = "";

	while(!feof($file)) {

		$arg = fgetcsv($file);

		if(empty($arg[0])) // blank line
			break;

		switch($filename) {

			case "class.csv":
			$sql = "INSERT INTO class(className, classShortName, semester, classCount, snapshotId) VALUES 
			(\"$arg[0]\", \"$arg[1]\", $arg[2], $arg[3], 1);";
			break;

			case "subject.csv":
			$sql = "INSERT INTO subject(subjectName, subjectShortName, eachSlot, nSlots, batches, snapshotId) VALUES (\"$arg[0]\", \"$arg[1]\", $arg[2], $arg[3], $arg[4], 1);";
			break;

			case "teacher.csv":
			$sql = "INSERT INTO teacher(teacherName, teacherShortName, minHrs, maxHrs, deptId, snapshotId) VALUES (\"$arg[0]\", \"$arg[1]\", $arg[2], $arg[3], $arg[4], 1);";
			break;

			case "room.csv":
			$sql = "INSERT INTO room(roomName, roomShortName, roomCount, snapshotId) VALUES (\"$arg[0]\", \"$arg[1]\", $arg[2], 1);";
			break;

			case "batch.csv":
			$sql = "INSERT INTO batch(batchName, batchCount, snapshotId) VALUES (\"$arg[1]\", $arg[2], 1);";
			$sql1 = "INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName=\"$arg[1]\"),(SELECT classId from class WHERE classShortName=\"$arg[0]\"), 1);";
			break;

			case "batch-can-overlap.csv":
			$sql = "INSERT INTO batchCanOverlap(batchId, batchOverlapId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName=\"$arg[0]\"), ( (SELECT batchId FROM batch WHERE batchName=\"$arg[1]\")), 1);";
			break;

			case "subject-class-teacher.csv":
			if (!empty($arg[2]))
						$sql = "INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
							(SELECT subjectId FROM subject WHERE subjectShortName=\"$arg[1]\"), 
							(SELECT classId FROM class WHERE classShortName=\"$arg[0]\"),
							(SELECT teacherId from teacher WHERE teacherShortName=\"$arg[2]\"),
							1
						);";
				else
						$sql = "INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
							(SELECT subjectId FROM subject WHERE subjectShortName=\"$arg[1]\"), 
							(SELECT classId FROM class WHERE classShortName=\"$arg[0]\"),
							NULL,
							1
						);";
			break;

			case "subject-batch-teacher.csv":
			$sql = "INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
					(SELECT subjectId FROM subject WHERE subjectShortName=\"$arg[0]\"),
					(SELECT batchId FROM batch WHERE batchName=\"$arg[1]\"),
					(SELECT teacherId FROM teacher WHERE teacherShortName=\"$arg[2]\"),
					1
				);";
			break;

			case "overlappingSBT.csv":

				$qs1="SELECT subjectId from subject where subjectShortName = \"$arg[0]\" and snapshotId = 1";
				$qs2="SELECT subjectId from subject where subjectShortName = \"$arg[3]\" and snapshotId = 1";
				$qb1="SELECT batchId from batch where batchName = \"$arg[1]\" and snapshotId = 1";
				$qb2="SELECT batchId from batch where batchName = \"$arg[4]\" and snapshotId = 1";
				$qt1="SELECT teacherId from teacher where teacherShortName = \"$arg[2]\" and snapshotId = 1";
				$qt2="SELECT teacherId from teacher where teacherShortName= \"$arg[5]\" and snapshotId = 1";
				$sql = "INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
						(SELECT sbtId from subjectBatchTeacher WHERE subjectId = ($qs1) AND batchId = ($qb1) AND teacherId = ($qt1)),
						(SELECT sbtId from subjectBatchTeacher WHERE subjectId = ($qs2) AND batchId = ($qb2) AND teacherId = ($qt2)),
						1
					);";
				$sql1 = "INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
						(SELECT sbtId from subjectBatchTeacher WHERE subjectId = ($qs2) AND batchId = ($qb2) AND teacherId = ($qt2)),
						(SELECT sbtId from subjectBatchTeacher WHERE subjectId = ($qs1) AND batchId = ($qb1) AND teacherId = ($qt1)),
						1
					);";

			break;

			case "classRoom.csv":
			$sql = "INSERT INTO classRoom(classId, roomId, snapshotId) VALUES ((SELECT classId FROM class WHERE classShortName=\"$arg[0]\"),(SELECT roomId from room WHERE roomShortName=\"$arg[1]\"), 1);";
			break;

			case "batchRoom.csv":
			$sql = "INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName=\"$arg[0]\"),(SELECT roomId from room WHERE roomShortName=\"$arg[1]\"), 1);";
			break;

			case "subjectRoom.csv":
			$sql = "INSERT INTO subjectRoom(subjectId, roomId, snapshotId) VALUES ((SELECT subjectId FROM subject WHERE subjectShortName=\"$arg[0]\"),(SELECT roomId from room WHERE roomShortName=\"$arg[1]\"), 1);";
			break;

			case "timetable.csv":

				if ( $arg[7] == "TRUE" ) {
					$sql = "INSERT INTO timeTable(day, slotNo, classId, batchId, snapshotId, isFixed) VALUES 
							($arg[0], $arg[1], 
							(SELECT classId from class where classShortName=\"$arg[3]\"),
							NULL,  
							(SELECT snapshotId from snapshot where snapshotName=\"default\"),
							$arg[7]);";
					$sql1 = "INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES
							((SELECT ttId FROM timeTable WHERE day = $arg[0] AND slotNo = $arg[1] AND 
							classId = (SELECT classId from class WHERE classShortName=\"$arg[3]\")  
							AND isFixed = $arg[7]), \"LUNCH\", 1);";
				}
				else {
					if (empty($arg[6]))		
						$sql = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
									batchId, snapshotId, isFixed) VALUES
				 		($arg[0], $arg[1], 
						(SELECT roomId from room WHERE roomShortName=\"$arg[2]\"),
						(SELECT classId from class WHERE classShortName=\"$arg[3]\"), 
						(SELECT subjectId from subject WHERE subjectShortName=\"$arg[4]\"),
						(SELECT teacherId from teacher WHERE teacherShortName=\"$arg[5]\"), 
						NULL, 
						(SELECT snapshotId from snapshot where snapshotName=\"default\"),
						$arg[7]);";
					
					else
						$sql = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
									batchId, snapshotId, isFixed) VALUES 		
						($arg[0], $arg[1], 
						(SELECT roomId from room WHERE roomShortName=\"$arg[2]\"),
						(SELECT classId from class WHERE classShortName=\"$arg[3]\"), 
						(SELECT subjectId from subject WHERE subjectShortName=\"$arg[4]\"),
						(SELECT teacherId from teacher WHERE teacherShortName=\"$arg[5]\"), 
						(SELECT batchId from batch WHERE batchName=\"$arg[6]\"), 
						(SELECT snapshotId from snapshot where snapshotName=\"default\"),
						$arg[7]);";

				}

			break;

			default:
			echo "DEFAULT " . $filename;
			break;

		}
		
		if ($conn->query($sql) != TRUE) {
			echo "<br/>Error: " . $sql . "<br>" . $conn->error . "<br/>";
		} 

		if($sql1 != "") {
			if ($conn->query($sql1) != TRUE) {
				echo "<br/>Error: " . $sql1 . "<br>" . $conn->error . "<br/>";
			} 
		}

	}

	fclose($file);

}

function insertPDO($db, $file) {
	$sql = file_get_contents($file);
	$qr = $db->exec($sql);
}

$db = new PDO('mysql:host='.$CFG->server.';dbname='.$CFG->db_database, $CFG->db_user, $CFG->db_pass);


echo "<br/>---------------schema-----------------";
insertPDO($db, "../db-schema/database-create.sql");

insertPDO($db, "../db-schema/schema.sql");

echo "<br/>---------------triggers-----------------";
insertPDO($db, "../db-schema/triggers.sql");

echo "<br/>---------------dept -----------------";
insertPDO($db, "sql/dept.sql");

//this one, config needs changes, as it used deptId
echo "<br/>---------------config-----------------";
insertPDO($db, "sql/config.sql");

echo "<br/>---------------snapshot ----------------";
insertPDO($db, "sql/snapshot.sql");



echo "<br/>---------------class-----------------";
insertCsv($conn, "class.csv");

echo "<br/>---------------subject-----------------";
insertCsv($conn, "subject.csv");

echo "<br/>---------------teacher-----------------";
insertCsv($conn, "teacher.csv");

echo "<br/>---------------room-----------------";
insertCsv($conn, "room.csv");

echo "<br/>---------------batch-----------------";
insertCsv($conn, "batch.csv");

echo "<br/>---------------batch-can-overlap-----------------";
insertCsv($conn, "batch-can-overlap.csv");

echo "<br/>----------------subject-class-teacher-----------------";
insertCsv($conn, "subject-class-teacher.csv");

echo "<br/>---------------subject-batch-teacher-----------------";
insertCsv($conn, "subject-batch-teacher.csv");

echo "<br/>---------------overlappingSBT-----------------";
insertCsv($conn, "overlappingSBT.csv");

echo "<br/>---------------classRoom-----------------";
insertCsv($conn, "classRoom.csv");

echo "<br/>---------------batchRoom-----------------";
insertCsv($conn, "batchRoom.csv");

echo "<br/>---------------subjectRoom-----------------";
insertCsv($conn, "subjectRoom.csv");

echo "<br/>---------------timetable-----------------";
insertCsv($conn, "timetable.csv");



?>
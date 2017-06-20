<?php

/*

	Copyright 2017 Aniket Bhadane (aniketbhadane93@gmail.com)

    This file is part of Taasika - A Timetable generation software.

    Taasika is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Taasika is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Taasika.  If not, see <http://www.gnu.org/licenses/>.

*/

/*
 *	Author: Aniket Bhadane (aniketbhadane93@gmail.com)
 *  
 *	Description: Use for loading database schema and test-data. 
 *				 Drop and Create database. 
 *				 Read CSV files and insert into database. 
 *				 Can be used on any platform.
 *  The script expects 'datasetPath' to be received as POST/GET argument.
 *  If it does not receive 'datasetPath', 
 *  it assumes datasetPath to be csv/full/
*/
	
require_once('../config.php');
require_once('../common.php');

$conn = new mysqli($CFG->server, $CFG->db_user, $CFG->db_pass, $CFG->db_database);
if($conn->error) {
	die("<br/>connection error ". $conn->error . "<br/>"); 
}

function insertCSV($conn, $filename) {

    // specify the path to csv files

    $PATH = getArgument("datasetPath");

    if(empty($PATH)) {  			// if datasetPath is not passed
		$PATH = "csv/full/"; 		// consider csv/full/ as default datasetPath
		echo "<br/>datasetPath argument not received. Considering $PATH<br/>";
	}
	
	$filepath = $PATH . $filename;

	$file = fopen($filepath, "r");

	$line_number = 0;

	while(!feof($file)) {

		$arg = fgetcsv($file);

		$line_number++;

		if(!isset($arg[0])) // blank line
			break;

		$sql = "";
		$sql1 = "";

		switch($filename) {

			case "class.csv":

				if( isset($arg[0]) AND isset($arg[1]) AND isset($arg[2]) AND isset($arg[3]) )
					$sql = "INSERT INTO class(className, classShortName, semester, classCount, 
							snapshotId) VALUES (\"$arg[0]\", \"$arg[1]\", $arg[2], $arg[3], 1);";

				break;

			case "subject.csv":

				if( isset($arg[0]) AND isset($arg[1]) AND isset($arg[2]) AND isset($arg[3]) AND 
					isset($arg[4]))
					$sql = "INSERT INTO subject(subjectName, subjectShortName, eachSlot, nSlots, 
							batches, snapshotId) VALUES (\"$arg[0]\", \"$arg[1]\", $arg[2], 
							$arg[3], $arg[4], 1);";
				break;

			case "teacher.csv":

				if( isset($arg[0]) AND isset($arg[1]) AND isset($arg[2]) AND isset($arg[3]) 
					AND isset($arg[4]))
					$sql = "INSERT INTO teacher(teacherName, teacherShortName, minHrs, maxHrs, 
							deptId, snapshotId) VALUES (\"$arg[0]\", \"$arg[1]\", $arg[2], 
							$arg[3], $arg[4], 1);";
				break;

			case "room.csv":

				if( isset($arg[0]) AND isset($arg[1]) AND isset($arg[2]) )
					$sql = "INSERT INTO room(roomName, roomShortName, roomCount, snapshotId) VALUES
							(\"$arg[0]\", \"$arg[1]\", $arg[2], 1);";
				break;

			case "batch.csv":

				if( isset($arg[0]) AND isset($arg[1]) AND isset($arg[2]) ) {
					$sql = "INSERT INTO batch(batchName, batchCount, snapshotId) VALUES (
							\"$arg[1]\", $arg[2], 1);";
					$sql1 = "INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT 
							batchId FROM batch WHERE batchName=\"$arg[1]\"),(SELECT classId from 
							class WHERE classShortName=\"$arg[0]\"), 1);";
				}
				break;

			case "batch-can-overlap.csv":

				if( isset($arg[0]) AND isset($arg[1]) )
					$sql = "INSERT INTO batchCanOverlap(batchId, batchOverlapId, snapshotId) VALUES
							((SELECT batchId FROM batch WHERE batchName=\"$arg[0]\"), ( (SELECT 
							batchId FROM batch WHERE batchName=\"$arg[1]\")), 1);";
				break;

			case "subject-class-teacher.csv":

				if( isset($arg[0]) AND isset($arg[1]) )
					if (isset($arg[2]))
							$sql = "INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, 
								snapshotId) VALUES (
								(SELECT subjectId FROM subject WHERE subjectShortName=
								\"$arg[1]\"), 
								(SELECT classId FROM class WHERE classShortName=\"$arg[0]\"),
								(SELECT teacherId from teacher WHERE teacherShortName=\"$arg[2]\"),
								1
							);";
					else
							$sql = "INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, 
								snapshotId) VALUES (
								(SELECT subjectId FROM subject WHERE subjectShortName=
								\"$arg[1]\"), 
								(SELECT classId FROM class WHERE classShortName=\"$arg[0]\"),
								NULL,
								1
							);";
				break;

			case "subject-batch-teacher.csv":

				if( isset($arg[0]) AND isset($arg[1]) AND isset($arg[2]) )
					$sql = "INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, 
							snapshotId) VALUES (
							(SELECT subjectId FROM subject WHERE subjectShortName=\"$arg[0]\"),
							(SELECT batchId FROM batch WHERE batchName=\"$arg[1]\"),
							(SELECT teacherId FROM teacher WHERE teacherShortName=\"$arg[2]\"),
							1
						);";
				break;

			case "overlappingSBT.csv":

				if( isset($arg[0]) AND isset($arg[1]) AND isset($arg[2]) AND isset($arg[3]) 
					AND isset($arg[4]) AND isset($arg[5]) ) {

					$qs1="SELECT subjectId from subject where subjectShortName = \"$arg[0]\" and 
							snapshotId = 1";
					$qs2="SELECT subjectId from subject where subjectShortName = \"$arg[3]\" and 
							snapshotId = 1";
					$qb1="SELECT batchId from batch where batchName = \"$arg[1]\" and 
							snapshotId = 1";
					$qb2="SELECT batchId from batch where batchName = \"$arg[4]\" and 
							snapshotId = 1";
					$qt1="SELECT teacherId from teacher where teacherShortName = \"$arg[2]\" and 
							snapshotId = 1";
					$qt2="SELECT teacherId from teacher where teacherShortName= \"$arg[5]\" and 
							snapshotId = 1";
					$sql = "INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
							(SELECT sbtId from subjectBatchTeacher WHERE subjectId = ($qs1) AND 
								batchId = ($qb1) AND teacherId = ($qt1)),
							(SELECT sbtId from subjectBatchTeacher WHERE subjectId = ($qs2) AND 
								batchId = ($qb2) AND teacherId = ($qt2)),
							1
						);";
					$sql1 = "INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
							(SELECT sbtId from subjectBatchTeacher WHERE subjectId = ($qs2) AND 
								batchId = ($qb2) AND teacherId = ($qt2)),
							(SELECT sbtId from subjectBatchTeacher WHERE subjectId = ($qs1) AND 
								batchId = ($qb1) AND teacherId = ($qt1)),
							1
						);";
				}
				break;

			case "classRoom.csv":

				if( isset($arg[0]) AND isset($arg[1]) )
					$sql = "INSERT INTO classRoom(classId, roomId, snapshotId) VALUES ((SELECT 
							classId FROM class WHERE classShortName=\"$arg[0]\"),(SELECT roomId 
							from room WHERE roomShortName=\"$arg[1]\"), 1);";
				break;

			case "batchRoom.csv":

				if( isset($arg[0]) AND isset($arg[1]) )
					$sql = "INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT 
							batchId FROM batch WHERE batchName=\"$arg[0]\"),(SELECT roomId from 
							room WHERE roomShortName=\"$arg[1]\"), 1);";
				break;

			case "subjectRoom.csv":

				if( isset($arg[0]) AND isset($arg[1]) )
					$sql = "INSERT INTO subjectRoom(subjectId, roomId, snapshotId) VALUES ((SELECT 
							subjectId FROM subject WHERE subjectShortName=\"$arg[0]\"),(SELECT 
							roomId from room WHERE roomShortName=\"$arg[1]\"), 1);";
				break;

			case "timetable.csv":

				// not adding any checks here since some fields are allowed to be empty

				if ( $arg[7] == "TRUE" ) {
					$sql = "INSERT INTO timeTable(day, slotNo, classId, batchId, snapshotId, 
							isFixed) VALUES 
							($arg[0], $arg[1], 
							(SELECT classId from class where classShortName=\"$arg[3]\"), NULL,  
							(SELECT snapshotId from snapshot where snapshotName=\"default\"),
							$arg[7]);";
					$sql1 = "INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES
							((SELECT ttId FROM timeTable WHERE day = $arg[0] AND slotNo = $arg[1] 
							AND 
							classId = (SELECT classId from class WHERE classShortName=\"$arg[3]\")
							AND isFixed = $arg[7]), \"LUNCH\", 1);";
				}
				else {
					if (!isset($arg[6]))		// can be if(empty($arg[6]))
						$sql = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, 
								teacherId, batchId, snapshotId, isFixed) VALUES
						 		($arg[0], $arg[1], 
								(SELECT roomId from room WHERE roomShortName=\"$arg[2]\"),
								(SELECT classId from class WHERE classShortName=\"$arg[3]\"), 
								(SELECT subjectId from subject WHERE subjectShortName=\"$arg[4]\"),
								(SELECT teacherId from teacher WHERE teacherShortName=\"$arg[5]\"),
								NULL, 
								(SELECT snapshotId from snapshot where snapshotName=\"default\"),
								$arg[7]);";
					
					else
						$sql = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, 
								teacherId, batchId, snapshotId, isFixed) VALUES 		
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

		if($sql == "") {
			echo "<br/>Data Entry Error in $filename at line $line_number<br/>";
			continue;
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

$db = new PDO('mysql:host='.$CFG->server.';dbname='.$CFG->db_database, $CFG->db_user,
$CFG->db_pass);


echo "<br/>---------------schema-----------------------";
insertPDO($db, "../db-schema/database-create.sql");

insertPDO($db, "../db-schema/schema.sql");

echo "<br/>---------------triggers---------------------";
insertPDO($db, "../db-schema/triggers.sql");

echo "<br/>---------------dept-------------------------";
insertPDO($db, "sql/dept.sql");

//this one, config needs changes, as it used deptId
echo "<br/>---------------config-----------------------";
insertPDO($db, "sql/config.sql");

echo "<br/>---------------snapshot --------------------";
insertPDO($db, "sql/snapshot.sql");



echo "<br/>---------------class------------------------";
insertCSV($conn, "class.csv");

echo "<br/>---------------subject----------------------";
insertCSV($conn, "subject.csv");

echo "<br/>---------------teacher----------------------";
insertCSV($conn, "teacher.csv");

echo "<br/>---------------room-------------------------";
insertCSV($conn, "room.csv");

echo "<br/>---------------batch------------------------";
insertCSV($conn, "batch.csv");

echo "<br/>---------------batch-can-overlap------------";
insertCSV($conn, "batch-can-overlap.csv");

echo "<br/>---------------subject-class-teacher--------";
insertCSV($conn, "subject-class-teacher.csv");

echo "<br/>---------------subject-batch-teacher--------";
insertCSV($conn, "subject-batch-teacher.csv");

echo "<br/>---------------overlappingSBT---------------";
insertCSV($conn, "overlappingSBT.csv");

echo "<br/>---------------classRoom--------------------";
insertCSV($conn, "classRoom.csv");

echo "<br/>---------------batchRoom--------------------";
insertCSV($conn, "batchRoom.csv");

echo "<br/>---------------subjectRoom------------------";
insertCSV($conn, "subjectRoom.csv");

echo "<br/>---------------timetable--------------------";
insertCSV($conn, "timetable.csv");



?>
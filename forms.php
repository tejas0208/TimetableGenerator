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


$formsList = array(
	array("inputTeacherForm", "Teachers Configuration", "teacherTable"),
	array("inputSubjectForm", "Subjects Configuration", "subjectTable"),
	array("inputClassForm", "Classes Configuration", "classTable"),
	array("inputRoomForm", "Rooms Configuration", "roomTable"),
	array("inputBatchForm", "Batches Configuration", "batchTable"),
	/* */
	array("inputSBTForm", "Mapping: Subject, Batch, Teacher", "sbtTable"),
	array("inputSCTForm", "Mapping: Subject, Class, Teacher", "sctTable"),
	/* */
	array("inputBatchCanOverlapForm", "Possibly Overlapping Batch-Groups", "batchCanOverlapTable"),
	array("inputoverlappingSBTForm", "Must Overlapping Batch-Subjects", "overlappingSBTTable"),
	/* */
	array("inputBatchRoomForm", "Room Preferences for Batches", "batchRoomTable"),
	array("inputClassRoomForm", "Room Preferences for Classes", "classRoomTable"),
	array("inputSubjectRoomForm", "Room Preferences for Subjects", "subjectRoomTable"),
	/* */
	array("inputSnapshotForm", "Manage Snapshots", "snapshotTable"),
	array("inputConfigForm", "Manage timetable Configurations", "configTable"),
);
$formsHTML = "";
function generateInputForms() {
	global $formsList;
	global $formsHTML;
	for($i = 0; $i < count($formsList); $i++) {
		$formsHTML .=
			"<div class=\"inputForm\" id=\"".$formsList[$i][0]."\">".
			"<table class=\"inputFormTitleTable\"> <tr>
					<td class=\"inputFormTitle\"> ".$formsList[$i][1].
					"</td>
					<td> <button onclick = deleteSelectedFrom".$formsList[$i][2]."() >Delete Selected</button> </td>
					<td class=\"closebtn\">  <a href=\"javascript:void(0)\"
							onclick='formClose(\"".$formsList[$i][0]."\")'>
							<-- Back </a>
					</td>
			</table>
			<table id=\"".$formsList[$i][2]."\" class=\"inputFormTable\">
			</table>
			</div>";
	}
}
$checkMessage = "
	<div id=\"checkMessage\" class=\"waitMessage\">
	<h1> Checking Setup... </h1>
	</div>
";

$waitMessage = "
	<div id=\"waitMessage\" class=\"waitMessage\" display=\"\">
	<table width=\"60%\">
	<tr>
		<td> <h1> Wait till the operation completes ... </h1> </td>
	</tr>
	</table>
	</div>
";
function failMessage() {
	global $CFG;
	$resString = "{\"Success\": \"False\",";
	$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
	return $resString;
}
function successMessage() {
	$resString = "{\"Success\": \"True\"}";
	return $resString;
}
function teacherInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$teacherId = getArgument("teacherId");
	$teacherName = getArgument("teacherName");
	$teacherShortName = getArgument("teacherShortName");
	$minHrs = getArgument("minHrs");
	$maxHrs = getArgument("maxHrs");
	$deptId = getArgument("deptId");
	$snapshotId = getArgument("snapshotId");

	$query = "INSERT INTO teacher (teacherName, teacherShortName, minHrs, maxHrs, deptId, snapshotId) ".
		     "VALUES (\"$teacherName\", \"$teacherShortName\", $minHrs, $maxHrs, $deptId, $snapshotId)";
	$selectQuery = "SELECT * from teacher WHERE teacherShortName = \"$teacherShortName\" AND snapshotId = $snapshotId";
	ttlog("updateTeacher: Query: ".$query);

	$result = sqlUpdate($query);
	ttlog("teacherInsert(): $query Result: $result");

	if($result === false) {
		ttlog("teacherInsert(): resString: ".$resString);
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	ttlog("teacherInsert(): $selectQuery: Result: ".json_encode($result));
	if($result === false) {
		return failMessage();
	} else {
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"teacherId\"   : \"".$result[0]["teacherId"]."\"}";
		return $resString;
	}
}

function teacherDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$teacherId = getArgument("teacherId");
	$snapshotId = getArgument("snapshotId");

	$query = "DELETE FROM teacher WHERE teacherId = \"$teacherId\" AND snapshotId = $snapshotId;";

	$result = sqlUpdate($query);
	ttlog("teacherDelete(): $query Result: $result");

	if($result === false) {
		ttlog("teacherDelete(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("teacherDelete(): resString: ".successMessage());
	return successMessage();;
}


function teacherUpdate() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$teacherId = getArgument("teacherId");
	$teacherName = getArgument("teacherName");
	$teacherShortName = getArgument("teacherShortName");
	$minHrs = getArgument("minHrs");
	$maxHrs = getArgument("maxHrs");
	$deptId = getArgument("deptId");
	$snapshotId = getArgument("snapshotId");

	$query = "UPDATE teacher SET teacherName = \"$teacherName\", teacherShortName = ".
			 "\"$teacherShortName\", minHrs = \"$minHrs\", maxHrs = \"$maxHrs\",".
			 "deptId = \"$deptId\" WHERE teacherId = \"$teacherId\" AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("teacherUpdate(): $query Result: $result");

	if($result === false) {
		ttlog("teacherUpdate(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("teacherUpdate(): resString: ".successMessage());
	return successMessage();
}

function subjectInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$subjectId = getArgument("subjectId");
	$subjectName = getArgument("subjectName");
	$subjectShortName = getArgument("subjectShortName");
	$eachSlot = getArgument("eachSlot");
	$nSlots = getArgument("nSlots");
	$batches = getArgument("batches");
	$snapshotId = getArgument("snapshotId");

	$query = "INSERT INTO subject (subjectName, subjectShortName, eachSlot, nSlots, batches, snapshotId) ".
		 "VALUES (\"$subjectName\", \"$subjectShortName\", $eachSlot, $nSlots, $batches, $snapshotId)";
	$selectQuery = "SELECT * from subject where subjectShortName = \"$subjectShortName\" AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("insertSubject(): $query Result: ".json_encode($result));
	if($result === false) {
		ttlog("insertSubject(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	ttlog("insertSubject(): $selectQuery: Result: ".json_encode($result));
	if($result === false) {
		return failMessage();
	} else {
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"subjectId\"   : \"".$result[0]["subjectId"]."\"}";
		return $resString;
	}
}
function subjectDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$subjectId = getArgument("subjectId");
	$snapshotId = getArgument("snapshotId");

	$query = "DELETE FROM subject WHERE subjectId = \"$subjectId\" AND snapshotId = $snapshotId;";

	$result = sqlUpdate($query);
	ttlog("subjectDelete(): $query Result: ".json_encode($result));

	if($result === false) {
		ttlog("subjectDelete(): resString: ".failMessage());
		return failMessage();
	}
	return successMessage();
}
function subjectUpdate() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$subjectId = getArgument("subjectId");
	$subjectName = getArgument("subjectName");
	$subjectShortName = getArgument("subjectShortName");
	$eachSlot = getArgument("eachSlot");
	$nSlots = getArgument("nSlots");
	$batches = getArgument("batches");
	$snapshotId = getArgument("snapshotId");

	$query = "UPDATE subject SET subjectName = \"$subjectName\", subjectShortName = ".
			 "\"$subjectShortName\", eachSlot = \"$eachSlot\", nSlots= \"$nSlots\", ".
			 "batches= \"$batches\" WHERE subjectId = \"$subjectId\" AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("subjectUpdate(): $query Result: ".json_encode($result));

	if($result === false) {
		ttlog("subjectUpdate(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("subjectUpdate(): resString: ".successMessage());
	return successMessage();
}

function classInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$classId = getArgument("classId");
	$className = getArgument("className");
	$classShortName = getArgument("classShortName");
	$semester = getArgument("semester");
	$classCount = getArgument("classCount");
	$snapshotId = getArgument("snapshotId");

	$query = "INSERT INTO class (className, classShortName, semester, classCount, snapshotId) ".
			 "VALUES (\"$className\", \"$classShortName\", $semester, $classCount, $snapshotId)";
	$selectQuery = "SELECT * from class where classShortName = \"$classShortName\" AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("classInsert(): $query Result :".json_encode($result));

	if($result === false) {
		ttlog("classInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	ttlog("classInsert(): $selectQuery: Result: ".json_encode($result));
	if($result === false) {
		ttlog("classInsert(): resString: ".failMessage());
		return failMessage();
	} else {
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"classId\"   : \"".$result[0]["classId"]."\"}";
		return $resString;
	}
}

function classDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$classId = getArgument("classId");
	$snapshotId = getArgument("snapshotId");

	$query = "DELETE FROM class WHERE classId = \"$classId\" AND snapshotId = $snapshotId;";

	$result = sqlUpdate($query);
	ttlog("classDelete(): $query Result :".json_encode($result));

	if($result === false) {
		ttlog("classDelete(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("classDelete(): resString: ".successMessage());
	return successMessage();
}

function classUpdate() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$classId = getArgument("classId");
	$className = getArgument("className");
	$classShortName = getArgument("classShortName");
	$semester = getArgument("semester");
	$classCount = getArgument("classCount");
	$snapshotId = getArgument("snapshotId");

	$query = "UPDATE class SET className = \"$className\", classShortName = ".
			 "\"$classShortName\", semester = \"$semester\", classCount= \"$classCount\" ".
			 "WHERE classId = \"$classId\" and snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("classUpdate(): $query Result :".json_encode($result));

	if($result === false) {
		ttlog("classUpdate(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("classUpdate(): resString: ".successMessage());
	return successMessage();
}
/* TODO: We have made compulsory to enter a batch with class.
 * So this function needs an update
 */
function batchClassUpdate() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchId= getArgument("batchId");
	$classId = getArgument("classId");
	$snapshotId = getArgument("snapshotId");

	$query = "SELECT batchId, classId FROM batchClass WHERE batchId = $batchId and snapshotId = $snapshotId";
	$result = sqlGetAllRows($query);

	$selectQuery = "";
	if(count($result) == 1)
		$query = "UPDATE batchClass SET classId = $classId WHERE batchId = $batchId  AND snapshotId = $snapshotId;";
	else if(count($result == 0)) {
		$query = "INSERT INTO batchClass (batchId, classId, snapshotId) VALUES ($batchId, $classId, $snapshotId)";
		$selectQuery = "SELECT * from batchClass WHERE batchId =$batchId AND snapshotId = $snapshotId";
	}
	else
		$query = "ERORR-Query: Not found $batchId";
	ttlog("batchClassUpdate: Query: ".$query);

	$result = sqlUpdate($query);
	ttlog("batchClassUpdate: $query Result: ".json_encode($result));

	if($result === false) {
		ttlog("subjectUpdate(): resString: ".failMessage());
		return failMessage();
	}

	$result = false;
	if($selectQuery != "") {
		$result = sqlGetAllRows($selectQuery);
		ttlog("batchClassUpdate: $selectQuery: Result: ".json_encode($result));
		if($result === false) { // either query failed
			ttlog("batchClassUpdate(): resString: ".failMessage());
			return failMessage();
		} else {// both queries succeeded
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"bcId\"   : \"".$result[0]["bcId"]."\"}";
		}
	} else { // only update query was done
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"bcId\"   : \"-1\"}";
		return $resString;
	}
}
function batchInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchId = getArgument("batchId");
	$classId = getArgument("classId");
	$batchName = getArgument("batchName");
	$batchOrigName = getArgument("batchOrigName");
	$batchCount = getArgument("batchCount");
	$snapshotId = getArgument("snapshotId");

	$query = "INSERT INTO batch (batchName, batchCount, snapshotId) VALUES (\"$batchName\", $batchCount, $snapshotId)";
	$selectQuery = "SELECT * FROM batch where batchName = \"$batchName\" AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("batchInsert(): $query Result: ".json_encode($result));

	if($result === false) {
		ttlog("batchInsert(): resString: ".failMessage());
		return failMessage();
	}
	$result = sqlGetAllRows($selectQuery);
	ttlog("batchInsert(): $selectQuery: Result: ".json_encode($result));
	if($result === false) {
		ttlog("batchInsert(): resString: ".failMessage());
		return failMessage();
	} else {
		$insertBatchClassQuery =
			"INSERT INTO batchClass (batchId, classId, snapshotId) VALUES ( ".
				$result[0]["batchId"].  ", $classId, $snapshotId)";
		$res = sqlUpdate($insertBatchClassQuery);
		if($res === false) {
			ttlog("batchInsert(): resString: ".failMessage());
			return failMessage();
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"batchId\" : \"".$result[0]["batchId"]."\"}";
			return $resString;
		}
	}
}
function batchDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchId = getArgument("batchId");
	$snapshotId = getArgument("snapshotId");

	$query = "DELETE FROM batch WHERE batchId = \"$batchId\" AND snapshotId = $snapshotId;";

	$result = sqlUpdate($query);
	ttlog("batchDelete(): $query Result: ".json_encode($result));

	if($result === false) {
		ttlog("batchDelete(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("batchDelete(): resString: ".successMessage());
	return successMessage();

}
/* TODO: handle class Update here */
function batchUpdate() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchId = getArgument("batchId");
	$classId = getArgument("classId");
	$batchName = getArgument("batchName");
	$batchCount = getArgument("batchCount");
	$snapshotId = getArgument("snapshotId");

	$query = "UPDATE batch SET batchName = \"$batchName\", batchCount= \"$batchCount\" ".
			 "WHERE batchId = \"$batchId\" AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("batchUpdate(): Result: ".json_encode($result));

	if($result === false) {
		ttlog("batchUpdate(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("batchUpdate(): resString: ".successMessage());
	return successMessage();

}
function batchCanOverlapDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchesJSON = getArgument("batches");
	$snapshotId = getArgument("snapshotId");
	$batches = json_decode($batchesJSON);
	ttlog("batchCanOverlapDelete: received batches for deletion: $batchesJSON");

	$query = "DELETE FROM batchCanOverlap WHERE  snapshotId = $snapshotId AND ";
	$query .= " batchId = ".$batches[0]." OR batchOverlapId = ".$batches[0]." ";
	for($i = 1; $i < count($batches); $i++) { // 0 special case, to match the "OR" in query
			$query .= "OR batchId = ".$batches[$i]." OR batchOverlapId = ".$batches[$i]." ";
	}
	$query .= ";";
	ttlog("batchCanOverlapDelete: Created Query: ".$query);

	$result = sqlUpdate($query);
	ttlog("batchCanOverlapDelete: $query Result: ".json_encode($result));

	if($result === false) {
		ttlog("batchCanOverlapDelete(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("batchCanOverlapDelete(): resString: ".successMessage());
	return successMessage();
}
function batchCanOverlapInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchesString = getArgument("batches");
	$snapshotId = getArgument("snapshotId");
	$batches = [];
	$tok = strtok($batchesString, ",");
	$batches[count($batches)] = $tok;
	while($tok !== false) {
		$tok = strtok(",");
		if($tok !== false)
			$batches[count($batches)] = $tok;
	}
	ttlog("batchCanOverlapInsert: received batches for deletion: ".json_encode($batches));
	$query = "INSERT INTO batchCanOverlap (batchId, batchOverlapId, snapshotId) VALUES ";
	for($i = 0; $i < count($batches); $i++) { // 0 special case, to match the "OR" in query
			for($j = 0; $j < count($batches); $j++) {
				if($j == $i)
					continue;
				/* all this just to avoid the , on the last entry */
				if(($i == (count($batches) - 1)) && ($j == (count($batches) -2)))
					$query .= "(".$batches[$i].", ".$batches[$j].", $snapshotId)";
				else
					$query .= "(".$batches[$i].", ".$batches[$j].", $snapshotId), ";
			}
	}
	$query .= ";"; // remove the last comma
	ttlog("batchCanOverlapInsert: Query Created: ".$query);

	$result = sqlUpdate($query);
	ttlog("batchCanOverlapInsert: Result: ".json_encode($result));

	if($result === false) {
		ttlog("batchCanOverlapInsert(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("batchCanOverlapInsert(): resString: ".successMessage());
	return successMessage();
}
function roomInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$roomId = getArgument("roomId");
	$roomName = getArgument("roomName");
	$roomShortName = getArgument("roomShortName");
	$roomCount = getArgument("roomCount");
	$snapshotId = getArgument("snapshotId");

	$query = "INSERT INTO room (roomName, roomShortName, roomCount, snapshotId) ".
			 "VALUES (\"$roomName\", \"$roomShortName\", $roomCount, $snapshotId)";
	$selectQuery = "SELECT * from room where roomShortName = \"$roomShortName\" AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("roomInsert(): $query Result :".json_encode($result));

	if($result === false) {
		ttlog("roomInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	ttlog("roomInsert(): $selectQuery: Result: ".json_encode($result));
	if($result === false) {
		ttlog("roomInsert(): resString: ".failMessage());
		return failMessage();
	}else {
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"roomId\"   : \"".$result[0]["roomId"]."\"}";
		return $resString;
	}
}

function roomDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$roomId = getArgument("roomId");
	$snapshotId = getArgument("snapshotId");

	$query = "DELETE FROM room WHERE roomId = \"$roomId\" AND snapshotId = $snapshotId;";

	$result = sqlUpdate($query);
	ttlog("roomDelete(): $query Result :".json_encode($result));

	if($result === false) {
		ttlog("roomDelete(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("roomDelete(): resString: ".successMessage());
	return successMessage();
}

function roomUpdate() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$roomId = getArgument("roomId");
	$roomName = getArgument("roomName");
	$roomShortName = getArgument("roomShortName");
	$roomCount = getArgument("roomCount");
	$snapshotId = getArgument("snapshotId");

	$query = "UPDATE room SET roomName = \"$roomName\", roomShortName = ".
			 "\"$roomShortName\", roomCount= \"$roomCount\" ".
			 "WHERE roomId = \"$roomId\" AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("roomUpdate(): $query Result :".json_encode($result));

	if($result === false) {
		ttlog("roomUpdate(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("roomUpdate(): resString: ".successMessage());
	return successMessage();
}
function sbtInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$teacherId = getArgument("teacherId");
	$subjectId = getArgument("subjectId");
	$batchId = getArgument("batchId");
	$sbtId = getArgument("sbtId");
	$snapshotId = getArgument("snapshotId");
	ttlog("sbtInsert(): arguments: ".json_encode($_POST));

	$query = "INSERT INTO subjectBatchTeacher (teacherId, subjectId, batchId, snapshotId) ".
		     "VALUES ($teacherId, $subjectId, $batchId, $snapshotId)";
	$selectQuery = "SELECT * from subjectBatchTeacher WHERE teacherId = $teacherId".
			  " AND batchId = $batchId AND subjectId = $subjectId AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("sbtInsert(): $query Result: $result");

	if($result === false) {
		ttlog("sbtInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	ttlog("sbtInsert(): $selectQuery: Result: ".json_encode($result));
	if($result === false) {
		ttlog("sbtInsert(): resString: ".failMessage());
		return failMessage();
	} else {
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"sbtId\"   : \"".$result[0]["sbtId"]."\"}";
		return $resString;
	}
}
function sbtDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$teacherId = getArgument("teacherId");
	$subjectId = getArgument("subjectId");
	$batchId = getArgument("batchId");
	$sbtId = getArgument("sbtId");
	$snapshotId = getArgument("snapshotId");
	ttlog("sbtDelete(): arguments: ".json_encode($_POST));

	$query = "DELETE FROM subjectBatchTeacher WHERE sbtId = $sbtId AND snapshotId = $snapshotId;";
	$delTTQuery = "DELETE FROM timeTable WHERE subjectId = $subjectId AND teacherId = $teacherId ".
					" and batchId = $batchId AND snapshotId = $snapshotId;";

	$result = sqlUpdate($query);
	ttlog("sbtDelete(): $query Result: $result");

	if($result === false) {
		ttlog("sbtDelete(): resString: ".failMessage());
		return failMessage();
	}
	$result = sqlUpdate($delTTQuery);
	ttlog("sbtDelete: $delTTQuery Result: $result");
	if($result === false) {
		ttlog("sbtDelete(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("sbtDelete(): resString: ".successMessage());
	return successMessage();
}
function sbtUpdate() {

	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$oldTeacherId = getArgument("oldTeacherId");
	$newTeacherId = getArgument("newTeacherId");
	$subjectId = getArgument("subjectId");
	$batchId = getArgument("batchId");
	$sbtId = getArgument("sbtId");
	$snapshotId = getArgument("snapshotId");

	$selectQuery = "select t1.day, t1.slotNo from timeTable t1 join timeTable t2 on".
			" t1.day = t2.day and t1.slotNo = t2.slotNo where t1.teacherId = \"$oldTeacherId\"".
			" and t2.teacherId = \"$newTeacherId\" and t1.snapshotId = \"$snapshotId\"".
			" and t2.snapshotId = \"$snapshotId\" and t1.batchId = \"$batchId\" and t1.subjectId = \"$subjectId\"";

	$selectResult = sqlGetAllRows($selectQuery);
	//ttlog("sbtUpdate(): $selectQuery Result: " . json_encode($selectResult));
	for($x = 0; $x < count($selectResult); $x++) {
		$day = $selectResult[$x]["day"];
		$slotNo =  $selectResult[$x]["slotNo"];
		$deleteQuery = "delete from timeTable where day = \"$day\" and slotNo = \"$slotNo\"".
				" and teacherId = \"$oldTeacherId\" and snapshotId = \"$snapshotId\"";
		$deleteResult = sqlUpdate($deleteQuery);
		ttlog("sbtUpdate(): $deleteQuery Result: $deleteResult");
	}
	$updateQuery = "Update timeTable set teacherId = \"$newTeacherId\" where teacherId = \"$oldTeacherId\"".
			" and snapshotId = \"$snapshotId\" and batchId = \"$batchId\" and subjectId = \"$subjectId\"";
	$updateResult = sqlUpdate($updateQuery);
	ttlog("sbtUpdate(): $updateQuery Result: $updateResult");

	$query = "UPDATE subjectBatchTeacher SET teacherId = $newTeacherId, ".
			  "subjectId = $subjectId, batchId = $batchId".
			 " WHERE sbtId = $sbtId AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("sbtUpdate(): $query Result: $result");

	if($result === false) {
		ttlog("sbtUpdate(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("sbtUpdate(): resString: ".successMessage());
	return successMessage();
}
function sctInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$teacherId = getArgument("teacherId");
	$subjectId = getArgument("subjectId");
	$classId = getArgument("classId");
	$sctId = getArgument("sctId");
	$snapshotId = getArgument("snapshotId");

	$teacherStr = ($teacherId == "null" ? "null" : $teacherId);
	$query = "INSERT INTO subjectClassTeacher (teacherId, subjectId, classId, snapshotId) ".
		     "VALUES ($teacherStr, $subjectId, $classId, $snapshotId)";
	$selectQuery = "SELECT * from subjectClassTeacher WHERE teacherId = $teacherId".
			  " AND classId = $classId AND subjectId = $subjectId AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("sctInsert(): $query Result: $result");

	if($result === false) {
		ttlog("sctInsert(): resString: ".failMessage());
		return failMessage();
	}
	$result = sqlGetAllRows($selectQuery);
	ttlog("sctInsert(): $selectQuery: Result: ".json_encode($result));
	if($result === false) {
		ttlog("sctInsert(): resString: ".failMessage());
		return failMessage();
	} else {
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"sctId\"   : \"".$result[0]["sctId"]."\"}";
		return $resString;
	}
}

function sctDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$teacherId = getArgument("teacherId");
	$subjectId = getArgument("subjectId");
	$classId = getArgument("classId");
	$sctId = getArgument("sctId");
	$snapshotId = getArgument("snapshotId");

	$query = "DELETE FROM subjectClassTeacher WHERE sctId = $sctId AND snapshotId = $snapshotId; ";
	$delTTQuery = "DELETE FROM timeTable WHERE subjectId = $subjectId AND teacherId = $teacherId ".
						" and classId = $classId AND snapshotId = $snapshotId;";

	$result = sqlUpdate($query);
	ttlog("sctDelete(): $query Result: $result");

	if($result === false) {
		ttlog("sctDelete(): resString: ".failMessage());
		return failMessage();
	}
	$result = sqlUpdate($delTTQuery);
	ttlog("sctDelete(): $delTTQuery Result: $result");
	if($result === false) {
		ttlog("sctDelete(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("sctDelete(): resString: ".successMessage());
	return successMessage();
}

function sctUpdate() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$oldTeacherId = getArgument("oldTeacherId");
	$newTeacherId = getArgument("newTeacherId");
	$subjectId = getArgument("subjectId");
	$classId = getArgument("classId");
	$sctId = getArgument("sctId");
	$snapshotId = getArgument("snapshotId");

	$selectQuery = "select t1.day, t1.slotNo from timeTable t1 join timeTable t2 on ".
			"t1.day = t2.day and t1.slotNo = t2.slotNo where t1.teacherId = \"$oldTeacherId\"".
			" and t2.teacherId = \"$newTeacherId\" and t1.snapshotId = \"$snapshotId\"".
			" and t2.snapshotId = \"$snapshotId\" and t1.classId = \"$classId\" and t1.subjectId = \"$subjectId\"";

	$selectResult = sqlGetAllRows($selectQuery);
	ttlog("sctUpdate(): $selectQuery Result: " . json_encode($selectResult));
	for($x = 0; $x < count($selectResult); $x++) {
		$day = $selectResult[$x]["day"];
		$slotNo =  $selectResult[$x]["slotNo"];
		$deleteQuery = "delete from timeTable where day = \"$day\" and slotNo = \"$slotNo\"".
				" and teacherId = \"$oldTeacherId\" and snapshotId = \"$snapshotId\"";
		$deleteResult = sqlUpdate($deleteQuery);
		ttlog("sctUpdate(): $deleteQuery Result: $deleteResult");
	}

	$updateQuery = "Update timeTable set teacherId = \"$newTeacherId\"".
			" where teacherId = \"$oldTeacherId\" and snapshotId = \"$snapshotId\"".
			" and classId = \"$classId\" and subjectId = \"$subjectId\"";
	$updateResult = sqlUpdate($updateQuery);
	ttlog("sctUpdate(): $updateQuery Result: $updateResult");
	$query = "UPDATE subjectClassTeacher SET teacherId = \"$newTeacherId\", ".
			  "subjectId = \"$subjectId\", classId = \"$classId\"".
			 " WHERE sctId = \"$sctId\" AND snapshotId = \"$snapshotId\"";

	$result = sqlUpdate($query);
	ttlog("sctUpdate(): $query Result: $result");

	if($result === false) {
		ttlog("sctUpdate(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("sctUpdate(): resString: ".successMessage());
	return successMessage();
}
function subjectRoomInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$subjectId = getArgument("subjectId");
	$roomId = getArgument("roomId");
	$srId = getArgument("srId");
	$snapshotId = getArgument("snapshotId");

	$query = "INSERT INTO subjectRoom (subjectId, roomId, snapshotId) ".
			 "VALUES ($subjectId, $roomId, $snapshotId) ";
	$selectQuery = "SELECT * from subjectRoom where subjectId = $subjectId AND ".
			  " roomId = $roomId AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("subjectRoomInsert(): $query Result :".json_encode($result));

	if($result === false) {
		ttlog("subjectRoomInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	ttlog("subjectRoomInsert(): $selectQuery: Result: ".json_encode($result));
	if($result === false) {
		ttlog("subjectRoomInsert(): resString: ".failMessage());
		return failMessage();
	} else {
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"srId\"   : \"".$result[0]["srId"]."\"}";
		return $resString;
	}
}

function subjectRoomDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$srId = getArgument("srId");
	$snapshotId = getArgument("snapshotId");

	$query = "DELETE FROM subjectRoom WHERE srId = $srId AND snapshotId = $snapshotId;";

	$result = sqlUpdate($query);
	ttlog("subjectRoomDelete(): $query Result :".json_encode($result));

	if($result === false) {
		ttlog("subjectRoomDelete(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("subjectRoomDelete(): resString: ".successMessage());
	return successMessage();
}

function subjectRoomUpdate() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$subjectId = getArgument("subjectId");
	$roomId = getArgument("roomId");
	$srId = getArgument("srId");
	$snapshotId = getArgument("snapshotId");

	$query = "UPDATE subjectRoom SET subjectId = $subjectId, ".
			 "roomId = $roomId ".
			 "WHERE srId = $srId AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("subjectRoomUpdate(): $query Result :".json_encode($result));

	if($result === false) {
		ttlog("subjectRoomUpdate(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("subjectRoomUpdate(): resString: ".successMessage());
	return successMessage();
}
function classRoomInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$classId = getArgument("classId");
	$roomId = getArgument("roomId");
	$crId = getArgument("crId");
	$snapshotId = getArgument("snapshotId");

	$query = "INSERT INTO classRoom (classId, roomId, snapshotId) ".
			 "VALUES ($classId, $roomId, $snapshotId) ";
	$selectQuery = "SELECT * from classRoom where classId = $classId AND roomId = $roomId AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("classRoomInsert(): $query Result :".json_encode($result));

	if($result === false) {
		ttlog("classRoomInsert(): resString: ".failMessage());
		return failMessage();
	}
	$result = sqlGetAllRows($selectQuery);
	ttlog("classRoomInsert(): $selectQuery: Result: ".json_encode($result));
	if($result === false) {
		ttlog("classRoomInsert(): resString: ".failMessage());
		return failMessage();
	} else {
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"crId\"   : \"".$result[0]["crId"]."\"}";
		return $resString;
	}
	ttlog("classRoomInsert(): resString: ".successMessage());
	return successMessage();
}

function classRoomDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$crId = getArgument("crId");
	$snapshotId = getArgument("snapshotId");

	$query = "DELETE FROM classRoom WHERE crId = $crId AND snapshotId = $snapshotId;";

	$result = sqlUpdate($query);
	ttlog("classRoomDelete(): $query Result :".json_encode($result));

	if($result === false) {
		ttlog("classRoomDelete(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("classRoomDelete(): resString: ".successMessage());
	return successMessage();
}

function classRoomUpdate() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$classId = getArgument("classId");
	$roomId = getArgument("roomId");
	$crId = getArgument("crId");
	$snapshotId = getArgument("snapshotId");

	$query = "UPDATE classRoom SET classId = $classId, ".
			 "roomId = $roomId ".
			 "WHERE crId = $crId AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("classRoomUpdate(): $query Result :".json_encode($result));

	if($result === false) {
		ttlog("classRoomUpdate(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("classRoomUpdate(): resString: ".successMessage());
	return successMessage();
}
function batchRoomInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchId = getArgument("batchId");
	$roomId = getArgument("roomId");
	$brId = getArgument("brId");
	$snapshotId = getArgument("snapshotId");

	$query = "INSERT INTO batchRoom (batchId, roomId, snapshotId) ".
			 "VALUES ($batchId, $roomId, $snapshotId) ";
	$selectQuery = "SELECT * from batchRoom where batchId = $batchId AND roomId = $roomId AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("batchRoomInsert(): $query Result :".json_encode($result));

	if($result === false) {
		ttlog("batchRoomInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	ttlog("batchRoomInsert: $selectQuery: Result: ".json_encode($result));
	if($result === false) {
		ttlog("batchRoomInsert(): resString: ".failMessage());
		return failMessage();
	} else {
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"brId\"   : \"".$result[0]["brId"]."\"}";
		return $resString;
	}
	ttlog("batchRoomInsert(): resString: ".successMessage());
	return successMessage();
}

function batchRoomDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$brId = getArgument("brId");
	$snapshotId = getArgument("snapshotId");

	$query = "DELETE FROM batchRoom WHERE brId = $brId AND snapshotId = $snapshotId;";

	$result = sqlUpdate($query);
	ttlog("batchRoomDelete(): $query : Result :".json_encode($result));

	if($result === false) {
		ttlog("batchRoomDelete(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("batchRoomDelete(): resString: ".successMessage());
	return successMessage();
}

function batchRoomUpdate() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchId = getArgument("batchId");
	$roomId = getArgument("roomId");
	$brId = getArgument("brId");
	$snapshotId = getArgument("snapshotId");

	$query = "UPDATE batchRoom SET batchId = $batchId, ".
			 "roomId = $roomId ".
			 "WHERE brId = $brId AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	ttlog("batchRoomUpdate(): $query : Result :".json_encode($result));

	if($result === false) {
		ttlog("batchRoomUpdate(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("batchRoomUpdate(): resString: ".successMessage());
	return successMessage();
}

function snapshotDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$snapshotId = getArgument("snapshotId");

	$query = "DELETE FROM snapshot WHERE snapshotId = $snapshotId;";

	$result = sqlUpdate($query);
	ttlog("snapshotDelete(): $query Result: ".json_encode($result));

	if($result === false) {
		ttlog("snapshotDelete(): resString: ".failMessage());
		return failMessage();
	}
	return successMessage();
}

function configInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$configName = getArgument("configName");
	$configId = getArgument("configId");
	$dayBegin = getArgument("dayBegin");
	$slotDuration = getArgument("slotDuration");
	$nSlots = getArgument("nSlots");
	$deptId = getArgument("deptId");
	$incharge = getArgument("incharge");

	$query = "INSERT INTO config (configName, dayBegin, slotDuration, nSlots, deptId, incharge) ".
			 "VALUES (\"$configName\", \"$dayBegin\", $slotDuration, $nSlots, $deptId, $incharge)";
	$selectQuery = "SELECT * from config where configName = \"$configName\"";

	$result = sqlUpdate($query);
	ttlog("configInsert(): $query Result: ".json_encode($result));

	if($result === false) {
		ttlog("configInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	ttlog("configInsert(): $selectQuery: Result: ".json_encode($result));
	if($result === false) {
		ttlog("configInsert(): resString: ".failMessage());
		return failMessage();
	} else {
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"configId\"   : \"".$result[0]["configId"]."\"}";
		return $resString;
	}
}

function configDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$configId = getArgument("configId");

	$query = "DELETE FROM config WHERE configId = $configId;";

	$result = sqlUpdate($query);
	ttlog("configDelete(): $query Result: ".json_encode($result));

	if($result === false) {
		ttlog("configDelete(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("configDelete(): resString: ".successMessage());
	return successMessage();
}

function configUpdate() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$configName = getArgument("configName");
	$configId = getArgument("configId");
	$dayBegin = getArgument("dayBegin");
	$configOrigName = getArgument("configOrigName");
	$slotDuration = getArgument("slotDuration");
	$nSlots = getArgument("nSlots");
	$deptId = getArgument("deptId");
	$incharge = getArgument("incharge");

	$query = "UPDATE config SET configName = \"$configName\", dayBegin = ".
			 "\"$dayBegin\", slotDuration = $slotDuration, nSlots= $nSlots, ".
			 "deptId= $deptId, incharge=$incharge WHERE configId = \"$configId\"";

	$result = sqlUpdate($query);
	ttlog("configUpdate(): $query Result: ".json_encode($result));

	if($result === false) {
		ttlog("configUpdate(): resString: ".failMessage());
		return failMessage();
	}
	ttlog("configUpdate(): resString: ".successMessage());
	return successMessage();
}
function overlappingSBTInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$sbtId1 = getArgument("sbtId1");
	$sbtId2 = getArgument("sbtId2");
	$osbtId = getArgument("osbtId");
	$snapshotId = getArgument("snapshotId");

	$queryInsert1 = "INSERT INTO overlappingSBT (sbtId1, sbtId2, snapshotId) ".
		     "VALUES ($sbtId1, $sbtId2, $snapshotId)";
	$queryInsert2 = "INSERT INTO overlappingSBT (sbtId1, sbtId2, snapshotId) ".
		     "VALUES ($sbtId2, $sbtId1, $snapshotId)";
	$querySelect1 = "SELECT * from overlappingSBT WHERE sbtId1 = $sbtId1 ".
			  " AND sbtId2 = $sbtId2 AND snapshotId = $snapshotId";
	$querySelect2 = "SELECT * from overlappingSBT WHERE sbtId1 = $sbtId2 ".
			  " AND sbtId2 = $sbtId1 AND snapshotId = $snapshotId";

	$result = sqlUpdate($queryInsert1);
	ttlog("overlappingSBTInsert(): $queryInsert1 Result: $result");
	if($result === false) {
		ttlog("overlappingSBTInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlUpdate($queryInsert2);
	ttlog("overlappingSBTInsert: $queryInsert2 Result: $result");
	if($result === false) {
		ttlog("overlappingSBTInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result1 = sqlGetAllRows($querySelect1);
	ttlog("overlappingSBTInsert: $querySelect1: Result: ".json_encode($result1));
	if($result1 === false) {
		ttlog("overlappingSBTInsert(): resString: ".failMessage());
		return failMessage();
	} else {
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"osbtId1\"   : \"".$result1[0]["osbtId"]."\",";
	}

	$result = sqlGetAllRows($querySelect2);
	ttlog("overlappingSBTInsert(): $querySelect2: Result: ".json_encode($result));
	if($result === false) {
		ttlog("overlappingSBTInsert(): resString: ".failMessage());
		return failMessage();
	} else {
		$resString .= "\"osbtId2\"   : \"".$result[0]["osbtId"]."\"}";
	}
	return $resString;
}

function overlappingSBTDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$sbtId1 = getArgument("sbtId1");
	$sbtId2 = getArgument("sbtId2");
	$osbtId = getArgument("osbtId");
	$snapshotId = getArgument("snapshotId");

	$selectQuery = "SELECT * from overlappingSBT WHERE osbtId = $osbtId and snapshotId = $snapshotId;";
	$result = sqlGetOneRow($selectQuery);
	$sbtId1 = $result[0]["sbtId1"];
	$sbtId2 = $result[0]["sbtId2"];

	$query = "DELETE FROM overlappingSBT WHERE sbtId1 = $sbtId1 OR sbtId2 = $sbtId2 " .
			" OR sbtId2 = $sbtId1 OR sbtId1 = $sbtId2 ".
			" AND snapshotId = $snapshotId;";
	ttlog("overlappingSBTDelete(): Query: ".$query);

	$result = sqlUpdate($query);
	ttlog("overlappingSBTDelete(): $query Result: $result");
	if($result === false) {
		ttlog("overlappingSBTDelete(): resString: ".failMessage());
		return failMessage();
	} else {
		ttlog("overlappingSBTDelete(): resString: ".successMessage());
		return successMessage();
	}
}

function overlappingSBTUpdate() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$sbtId1 = getArgument("sbtId1");
	$sbtId2 = getArgument("sbtId2");
	$osbtId = getArgument("osbtId");
	$snapshotId = getArgument("snapshotId");

	$query = "UPDATE overlappingSBT SET sbtId1 = $sbtId1, ".
			  "sbtId2 = $sbtId2".
			 " WHERE osbtId = $osbtId AND snapshotId = $snapshotId";
	ttlog("overlappingSBTUpdate(): Query: ".$query);

	$result = sqlUpdate($query);
	ttlog("overlappingSBTUpdate(): $query Result: $result");
	if($result === false) {
		ttlog("overlappingSBTUpdate(): resString: ".failMessage());
		return failMessage();
	} else {
		return successMessage();
	}
}


function mSubjectDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");
	$sub = json_decode($_POST["subjectId"]);
	$arr = $sub->arr;
	$len = sizeof($arr);
	for($i = 0; $i < $len; $i++) {

		$subjectId = $arr[$i];
		$snapshotId = getArgument("snapshotId");

		$query = "DELETE FROM subject WHERE subjectId = \"$subjectId\" AND snapshotId = $snapshotId;";

		$result = sqlUpdate($query);
		ttlog("subjectDelete(): $query Result: ".json_encode($result));

		if($result === false) {
			ttlog("subjectDelete(): resString: ".failMessage());
			return failMessage();
		}
		
	}
		return successMessage();
}

function mClassDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");
	
	$cls = json_decode($_POST["classId"]);
	$arr = $cls->arr;
	$len = sizeof($arr);
	for($i = 0; $i < $len; $i++) {

		$classId = $arr[$i];
		$snapshotId = getArgument("snapshotId");

		$query = "DELETE FROM class WHERE classId = \"$classId\" AND snapshotId = $snapshotId;";

		$result = sqlUpdate($query);
		ttlog("classDelete(): $query Result :".json_encode($result));

		if($result === false) {
			ttlog("classDelete(): resString: ".failMessage());
			return failMessage();
		}
		ttlog("classDelete(): resString: ".successMessage());
	}
	return successMessage();
}

function mTeacherDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");
	
	$tec = json_decode($_POST["teacherId"]);
	$arr = $tec->arr;
	$len = sizeof($arr);
	for($i = 0; $i < $len; $i++) {
	
		$teacherId = $arr[$i];
		$snapshotId = getArgument("snapshotId");

		$query = "DELETE FROM teacher WHERE teacherId = \"$teacherId\" AND snapshotId = $snapshotId;";

		$result = sqlUpdate($query);
		ttlog("teacherDelete(): $query Result: $result");

		if($result === false) {
			ttlog("teacherDelete(): resString: ".failMessage());
			return failMessage();
		}
		ttlog("teacherDelete(): resString: ".successMessage());
	}
	return successMessage();;
}

function mBatchDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");
	
	$bat = json_decode($_POST["batchId"]);
	$arr = $bat->arr;
	$len = sizeof($arr);
	for($i = 0; $i < $len; $i++) {

		$batchId = $arr[$i];
		$snapshotId = getArgument("snapshotId");

		$query = "DELETE FROM batch WHERE batchId = \"$batchId\" AND snapshotId = $snapshotId;";

		$result = sqlUpdate($query);
		ttlog("batchDelete(): $query Result: ".json_encode($result));

		if($result === false) {
			ttlog("batchDelete(): resString: ".failMessage());
			return failMessage();
		}
		ttlog("batchDelete(): resString: ".successMessage());
	}
	return successMessage();

}

function mRoomDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");
	
	$rom = json_decode($_POST["roomId"]);
	$arr = $rom->arr;
	$len = sizeof($arr);
	for($i = 0; $i < $len; $i++) {	
	
		$roomId = $arr[$i];
		$snapshotId = getArgument("snapshotId");

		$query = "DELETE FROM room WHERE roomId = \"$roomId\" AND snapshotId = $snapshotId;";

		$result = sqlUpdate($query);
		ttlog("roomDelete(): $query Result :".json_encode($result));

		if($result === false) {
			ttlog("roomDelete(): resString: ".failMessage());
			return failMessage();
		}
		ttlog("roomDelete(): resString: ".successMessage());
	}
	return successMessage();
}

function mBatchRoomDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");
	
	$brt = json_decode($_POST["brId"]);
	$arr = $brt->arr;
	$len = sizeof($arr);
	for($i = 0; $i < $len; $i++) {

		$brId = $arr[$i];
		$snapshotId = getArgument("snapshotId");

		$query = "DELETE FROM batchRoom WHERE brId = $brId AND snapshotId = $snapshotId;";

		$result = sqlUpdate($query);
		ttlog("batchRoomDelete(): $query : Result :".json_encode($result));

		if($result === false) {
			ttlog("batchRoomDelete(): resString: ".failMessage());
			return failMessage();
		}
		ttlog("batchRoomDelete(): resString: ".successMessage());
	}
	return successMessage();
}

function mClassRoomDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");
	
	$crt = json_decode($_POST["crId"]);
	$arr = $crt->arr;
	$len = sizeof($arr);
	for($i = 0; $i < $len; $i++) {

		$crId = $arr[$i];
		$snapshotId = getArgument("snapshotId");

		$query = "DELETE FROM classRoom WHERE crId = $crId AND snapshotId = $snapshotId;";

		$result = sqlUpdate($query);
		ttlog("classRoomDelete(): $query Result :".json_encode($result));

		if($result === false) {
			ttlog("classRoomDelete(): resString: ".failMessage());
			return failMessage();
		}
		ttlog("classRoomDelete(): resString: ".successMessage());
	}
	return successMessage();
}

function mSubjectRoomDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");
	
	$srt = json_decode($_POST["srId"]);
	$arr = $srt->arr;
	$len = sizeof($arr);
	for($i = 0; $i < $len; $i++) {

		$srId = $arr[$i];
		$snapshotId = getArgument("snapshotId");

		$query = "DELETE FROM subjectRoom WHERE srId = $srId AND snapshotId = $snapshotId;";

		$result = sqlUpdate($query);
		ttlog("subjectRoomDelete(): $query Result :".json_encode($result));

		if($result === false) {
			ttlog("subjectRoomDelete(): resString: ".failMessage());
			return failMessage();
		}
		ttlog("subjectRoomDelete(): resString: ".successMessage());
	}
	return successMessage();
}

function mSbtDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");
	
	$sbt = json_decode($_POST["sbtId"]);
	$arr = $sbt->arr;
	$len = sizeof($arr);
	
	$sub = json_decode($_POST["subjectId"]);
	$sarr = $sub->arr;
	
	$bat = json_decode($_POST["batchId"]);
	$barr = $bat->arr;
	
	$tec = json_decode($_POST["teacherId"]);
	$tarr = $tec->arr;
	
	for($i = 0; $i < $len; $i++) {
		$teacherId = $tarr[$i];
		$subjectId = $sarr[$i];
		$batchId = $barr[$i];
		$sbtId = $arr[$i];
		$snapshotId = getArgument("snapshotId");

		$query = "DELETE FROM subjectBatchTeacher WHERE sbtId = $sbtId AND snapshotId = $snapshotId;";
		$delTTQuery = "DELETE FROM timeTable WHERE subjectId = $subjectId AND teacherId = $teacherId ".
						" and batchId = $batchId AND snapshotId = $snapshotId;";

		$result = sqlUpdate($query);
		ttlog("sbtDelete(): $query Result: $result");

		if($result === false) {
			ttlog("sbtDelete(): resString: ".failMessage());
			return failMessage();
		}
		$result = sqlUpdate($delTTQuery);
		ttlog("sbtDelete: $delTTQuery Result: $result");
		if($result === false) {
			ttlog("sbtDelete(): resString: ".failMessage());
			return failMessage();
		}
		ttlog("sbtDelete(): resString: ".successMessage());
	}
	return successMessage();
}

function mSctDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");
	
	$sct = json_decode($_POST["sctId"]);
	$arr = $sct->arr;
	$len = sizeof($arr);
	
	$sub = json_decode($_POST["subjectId"]);
	$sarr = $sub->arr;
	
	$cls = json_decode($_POST["classId"]);
	$carr = $cls->arr;
	
	$tec = json_decode($_POST["teacherId"]);
	$tarr = $tec->arr;
	
	for($i = 0; $i < $len; $i++) {
		$teacherId = $tarr[$i];
		$subjectId = $sarr[$i];
		$classId = $carr[$i];
		$sctId = $arr[$i];
		$snapshotId = getArgument("snapshotId");

		$query = "DELETE FROM subjectClassTeacher WHERE sctId = $sctId AND snapshotId = $snapshotId; ";
		$delTTQuery = "DELETE FROM timeTable WHERE subjectId = $subjectId AND teacherId = $teacherId ".
							" and classId = $classId AND snapshotId = $snapshotId;";

		$result = sqlUpdate($query);
		ttlog("sctDelete(): $query Result: $result");

		if($result === false) {
			ttlog("sctDelete(): resString: ".failMessage());
			return failMessage();
		}
		$result = sqlUpdate($delTTQuery);
		ttlog("sctDelete(): $delTTQuery Result: $result");
		if($result === false) {
			ttlog("sctDelete(): resString: ".failMessage());
			return failMessage();
		}
		ttlog("sctDelete(): resString: ".successMessage());
	}
	return successMessage();
}

function mBatchCanOverlapDelete() {

	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");
	
	$bco = json_decode($_POST["batches"]);
	$arr = $bco->arr;
	$len = sizeof($arr);
	
	for($j = 0; $j < $len; $j++) {
		$snapshotId = getArgument("snapshotId");
		$batches = $arr[$j];

		$query = "DELETE FROM batchCanOverlap WHERE  snapshotId = $snapshotId AND ";
		$query .= " batchId = ".$batches[0]." OR batchOverlapId = ".$batches[0]." ";
		for($i = 1; $i < count($batches); $i++) { // 0 special case, to match the "OR" in query
				$query .= "OR batchId = ".$batches[$i]." OR batchOverlapId = ".$batches[$i]." ";
		}
		$query .= ";";
		ttlog("batchCanOverlapDelete: Created Query: ".$query);

		$result = sqlUpdate($query);
		ttlog("batchCanOverlapDelete: $query Result: ".json_encode($result));

		if($result === false) {
			ttlog("batchCanOverlapDelete(): resString: ".failMessage());
			return failMessage();
		}
		ttlog("batchCanOverlapDelete(): resString: ".successMessage());
	}
	return successMessage();

}

function mOverlappingSBTDelete() {

	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");
	
	$osbt = json_decode($_POST["osbtId"]);
	$arr = $osbt->arr;
	$len = sizeof($arr);
	
	$sbt1 = json_decode($_POST["sbtId1"]);
	$sb1arr = $sbt1->arr;
	
	$sbt2 = json_decode($_POST["sbtId2"]);
	$sb2arr = $sbt2->arr;
	
	for($j = 0; $j < $len; $j++) {
		$sbtId1 = $sb1arr[$j];
		$sbtId2 = $sb2arr[$j];
		$osbtId = $arr[$j];
		$snapshotId = getArgument("snapshotId");
		
		

		$selectQuery = "SELECT * from overlappingSBT WHERE osbtId = $osbtId and snapshotId = $snapshotId;";

		$query = "DELETE FROM overlappingSBT WHERE sbtId1 = $sbtId1 OR sbtId2 = $sbtId2 " .
				" OR sbtId2 = $sbtId1 OR sbtId1 = $sbtId2 ".
				" AND snapshotId = $snapshotId;";
				
		ttlog("overlappingSBTDelete(): Query: ".$query);				

		$result = sqlUpdate($query);
		
	}
	ttlog("batchCanOverlapDelete(): resString: ".successMessage());
	return successMessage(); 
	
}	



?>

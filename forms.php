<?php
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
					<td class=\"closebtn\">  <a href=\"javascript:void(0)\" 
							onclick='formClose(\"".$formsList[$i][0]."\")'> 
							Close &times; </a> 
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
	error_log("updateTeacher: Query: ".$query, 0);

	$result = sqlUpdate($query);
	error_log("teacherInsert(): $query Result: $result", 0);

	if($result === false) {
		error_log("teacherInsert(): resString: ".$resString, 0);
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	error_log("teacherInsert(): $selectQuery: Result: ".json_encode($result), 0);
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
	error_log("teacherDelete(): $query Result: $result", 0);

	if($result === false) {
		error_log("teacherDelete(): resString: ".failMessage(), 0);
		return failMessage();
	}
	error_log("teacherDelete(): resString: ".successMessage(), 0);
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
	error_log("teacherUpdate(): $query Result: $result", 0);

	if($result === false) {
		error_log("teacherUpdate(): resString: ".failMessage(), 0);
		return failMessage();
	}
	error_log("teacherUpdate(): resString: ".successMessage(), 0);
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
	error_log("insertSubject(): $query Result: ".json_encode($result), 0);
	if($result === false) {
		error_log("insertSubject(): resString: ".failMessage(), 0);
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	error_log("insertSubject(): $selectQuery: Result: ".json_encode($result), 0);
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
	error_log("subjectDelete(): $query Result: ".json_encode($result), 0);

	if($result === false) {
		error_log("subjectDelete(): resString: ".failMessage());
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
	error_log("subjectUpdate(): $query Result: ".json_encode($result), 0);

	if($result === false) {
		error_log("subjectUpdate(): resString: ".failMessage());
		return failMessage();
	}
	error_log("subjectUpdate(): resString: ".successMessage());
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
	error_log("classInsert(): $query Result :".json_encode($result), 0);

	if($result === false) {
		error_log("classInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	error_log("classInsert(): $selectQuery: Result: ".json_encode($result), 0);
	if($result === false) {
		error_log("classInsert(): resString: ".failMessage());
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
	error_log("classDelete(): $query Result :".json_encode($result), 0);

	if($result === false) {
		error_log("classDelete(): resString: ".failMessage());
		return failMessage();
	}
	error_log("classDelete(): resString: ".successMessage(), 0);
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
	error_log("classUpdate(): $query Result :".json_encode($result), 0);

	if($result === false) {
		error_log("classUpdate(): resString: ".failMessage());
		return failMessage();
	}
	error_log("classUpdate(): resString: ".successMessage(), 0);
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
	error_log("batchClassUpdate: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("batchClassUpdate: $query Result: ".json_encode($result), 0);

	if($result === false) {
		error_log("subjectUpdate(): resString: ".failMessage());
		return failMessage();
	}

	$result = false;
	if($selectQuery != "") {
		$result = sqlGetAllRows($selectQuery);
		error_log("batchClassUpdate: $selectQuery: Result: ".json_encode($result), 0);
		if($result === false) { // either query failed
			error_log("batchClassUpdate(): resString: ".failMessage());
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
	error_log("batchInsert(): $query Result: ".json_encode($result), 0);

	if($result === false) {
		error_log("batchInsert(): resString: ".failMessage());
		return failMessage();
	}
	$result = sqlGetAllRows($selectQuery);
	error_log("batchInsert(): $selectQuery: Result: ".json_encode($result), 0);
	if($result === false) {
		error_log("batchInsert(): resString: ".failMessage());
		return failMessage();
	} else {
		$insertBatchClassQuery = 
			"INSERT INTO batchClass (batchId, classId, snapshotId) VALUES ( ".
				$result[0]["batchId"].  ", $classId, $snapshotId)";
		$result = sqlUpdate($insertBatchClassQuery);
		if($result === false) {
			error_log("batchInsert(): resString: ".failMessage());
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
	error_log("batchDelete(): $query Result: ".json_encode($result), 0);

	if($result === false) {
		error_log("batchDelete(): resString: ".failMessage());
		return failMessage();
	}
	error_log("batchDelete(): resString: ".successMessage(), 0);
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
	error_log("batchUpdate(): Result: ".json_encode($result), 0);

	if($result === false) {
		error_log("batchUpdate(): resString: ".failMessage());
		return failMessage();
	}
	error_log("batchUpdate(): resString: ".successMessage(), 0);
	return successMessage();

}
function batchCanOverlapDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchesJSON = getArgument("batches");
	$snapshotId = getArgument("snapshotId");
	$batches = json_decode($batchesJSON);
	error_log("batchCanOverlapDelete: received batches for deletion: $batchesJSON", 0);

	$query = "DELETE FROM batchCanOverlap WHERE  snapshotId = $snapshotId AND ";
	$query .= " batchId = ".$batches[0]." OR batchOverlapId = ".$batches[0]." ";
	for($i = 1; $i < count($batches); $i++) { // 0 special case, to match the "OR" in query
			$query .= "OR batchId = ".$batches[$i]." OR batchOverlapId = ".$batches[$i]." ";
	}
	$query .= ";";
	error_log("batchCanOverlapDelete: Created Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("batchCanOverlapDelete: $query Result: ".json_encode($result), 0);

	if($result === false) {
		error_log("batchCanOverlapDelete(): resString: ".failMessage());
		return failMessage();
	}
	error_log("batchCanOverlapDelete(): resString: ".successMessage(), 0);
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
	error_log("batchCanOverlapInsert: received batches for deletion: ".json_encode($batches), 0);
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
	error_log("batchCanOverlapInsert: Query Created: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("batchCanOverlapInsert: Result: ".json_encode($result), 0);

	if($result === false) {
		error_log("batchCanOverlapInsert(): resString: ".failMessage());
		return failMessage();
	}
	error_log("batchCanOverlapInsert(): resString: ".successMessage(), 0);
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
	error_log("roomInsert(): $query Result :".json_encode($result), 0);

	if($result === false) {
		error_log("roomInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	error_log("roomInsert(): $selectQuery: Result: ".json_encode($result), 0);
	if($result === false) {
		error_log("roomInsert(): resString: ".failMessage());
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
	error_log("roomDelete(): $query Result :".json_encode($result), 0);

	if($result === false) {
		error_log("roomDelete(): resString: ".failMessage());
		return failMessage();
	}
	error_log("roomDelete(): resString: ".successMessage(), 0);
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
	error_log("roomUpdate(): $query Result :".json_encode($result), 0);

	if($result === false) {
		error_log("roomUpdate(): resString: ".failMessage());
		return failMessage();
	}
	error_log("roomUpdate(): resString: ".successMessage(), 0);
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
	error_log("sbtInsert(): arguments: ".json_encode($_POST), 0);

	$query = "INSERT INTO subjectBatchTeacher (teacherId, subjectId, batchId, snapshotId) ".
		     "VALUES ($teacherId, $subjectId, $batchId, $snapshotId)";
	$selectQuery = "SELECT * from subjectBatchTeacher WHERE teacherId = $teacherId".
			  " AND batchId = $batchId AND subjectId = $subjectId AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	error_log("sbtInsert(): $query Result: $result", 0);

	if($result === false) {
		error_log("sbtInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	error_log("sbtInsert(): $selectQuery: Result: ".json_encode($result), 0);
	if($result === false) {
		error_log("sbtInsert(): resString: ".failMessage());
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
	error_log("sbtDelete(): arguments: ".json_encode($_POST), 0);

	$query = "DELETE FROM subjectBatchTeacher WHERE sbtId = $sbtId AND snapshotId = $snapshotId;";
	$delTTQuery = "DELETE FROM timeTable WHERE subjectId = $subjectId AND teacherId = $teacherId ".
					" and batchId = $batchId AND snapshotId = $snapshotId;";

	$result = sqlUpdate($query);
	error_log("sbtDelete(): $query Result: $result", 0);

	if($result === false) {
		error_log("sbtDelete(): resString: ".failMessage());
		return failMessage();
	}
	$result = sqlUpdate($delTTQuery);
	error_log("sbtDelete: $delTTQuery Result: $result", 0);
	if($result === false) {
		error_log("sbtDelete(): resString: ".failMessage());
		return failMessage();
	}
	error_log("sbtDelete(): resString: ".successMessage(), 0);
	return successMessage();
}
function sbtUpdate() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$teacherId = getArgument("teacherId");
	$subjectId = getArgument("subjectId");
	$batchId = getArgument("batchId");
	$sbtId = getArgument("sbtId");
	$snapshotId = getArgument("snapshotId");
	error_log("sbtUpdate(): arguments: ".json_encode($_POST), 0);

	$query = "UPDATE subjectBatchTeacher SET teacherId = $teacherId, ".
			  "subjectId = $subjectId, batchId = $batchId".
			 " WHERE sbtId = $sbtId AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	error_log("sbtUpdate(): $query Result: $result", 0);

	if($result === false) {
		error_log("sbtUpdate(): resString: ".failMessage());
		return failMessage();
	}
	error_log("sbtUpdate(): resString: ".successMessage(), 0);
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
	error_log("sctInsert(): $query Result: $result", 0);

	if($result === false) {
		error_log("sctInsert(): resString: ".failMessage());
		return failMessage();
	}
	$result = sqlGetAllRows($selectQuery);
	error_log("sctInsert(): $selectQuery: Result: ".json_encode($result), 0);
	if($result === false) {
		error_log("sctInsert(): resString: ".failMessage());
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
	error_log("sctDelete(): $query Result: $result", 0);

	if($result === false) {
		error_log("sctDelete(): resString: ".failMessage());
		return failMessage();
	}
	$result = sqlUpdate($delTTQuery);
	error_log("sctDelete(): $delTTQuery Result: $result", 0);
	if($result === false) {
		error_log("sctDelete(): resString: ".failMessage());
		return failMessage();
	}
	error_log("sctDelete(): resString: ".successMessage(), 0);
	return successMessage();
}

function sctUpdate() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$teacherId = getArgument("teacherId");
	$subjectId = getArgument("subjectId");
	$classId = getArgument("classId");
	$sctId = getArgument("sctId");
	$snapshotId = getArgument("snapshotId");

	$query = "UPDATE subjectClassTeacher SET teacherId = $teacherId, ".
			  "subjectId = $subjectId, classId = $classId".
			 " WHERE sctId = $sctId AND snapshotId = $snapshotId";

	$result = sqlUpdate($query);
	error_log("sctUpdate(): $query Result: $result", 0);

	if($result === false) {
		error_log("sctUpdate(): resString: ".failMessage());
		return failMessage();
	}
	error_log("sctUpdate(): resString: ".successMessage(), 0);
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
	error_log("subjectRoomInsert(): $query Result :".json_encode($result), 0);

	if($result === false) {
		error_log("subjectRoomInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	error_log("subjectRoomInsert(): $selectQuery: Result: ".json_encode($result), 0);
	if($result === false) {
		error_log("subjectRoomInsert(): resString: ".failMessage());
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
	error_log("subjectRoomDelete(): $query Result :".json_encode($result), 0);

	if($result === false) {
		error_log("subjectRoomDelete(): resString: ".failMessage());
		return failMessage();
	}
	error_log("subjectRoomDelete(): resString: ".successMessage(), 0);
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
	error_log("subjectRoomUpdate(): $query Result :".json_encode($result), 0);

	if($result === false) {
		error_log("subjectRoomUpdate(): resString: ".failMessage());
		return failMessage();
	}
	error_log("subjectRoomUpdate(): resString: ".successMessage(), 0);
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
	error_log("classRoomInsert(): $query Result :".json_encode($result), 0);

	if($result === false) {
		error_log("classRoomInsert(): resString: ".failMessage());
		return failMessage();
	}
	$result = sqlGetAllRows($selectQuery);
	error_log("classRoomInsert(): $selectQuery: Result: ".json_encode($result), 0);
	if($result === false) {
		error_log("classRoomInsert(): resString: ".failMessage());
		return failMessage();
	} else {
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"crId\"   : \"".$result[0]["crId"]."\"}";
		return $resString;
	}
	error_log("classRoomInsert(): resString: ".successMessage(), 0);
	return successMessage();
}

function classRoomDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$crId = getArgument("crId");
	$snapshotId = getArgument("snapshotId");
	
	$query = "DELETE FROM classRoom WHERE crId = $crId AND snapshotId = $snapshotId;";

	$result = sqlUpdate($query);	
	error_log("classRoomDelete(): $query Result :".json_encode($result), 0);

	if($result === false) {
		error_log("classRoomDelete(): resString: ".failMessage());
		return failMessage();
	}
	error_log("classRoomDelete(): resString: ".successMessage(), 0);
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
	error_log("classRoomUpdate(): $query Result :".json_encode($result), 0);

	if($result === false) {
		error_log("classRoomUpdate(): resString: ".failMessage());
		return failMessage();
	}
	error_log("classRoomUpdate(): resString: ".successMessage(), 0);
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
	error_log("batchRoomInsert(): $query Result :".json_encode($result), 0);

	if($result === false) {
		error_log("batchRoomInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	error_log("batchRoomInsert: $selectQuery: Result: ".json_encode($result), 0);
	if($result === false) {
		error_log("batchRoomInsert(): resString: ".failMessage());
		return failMessage();
	} else {
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"brId\"   : \"".$result[0]["brId"]."\"}";
		return $resString;
	}
	error_log("batchRoomInsert(): resString: ".successMessage(), 0);
	return successMessage();
}

function batchRoomDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$brId = getArgument("brId");
	$snapshotId = getArgument("snapshotId");
	
	$query = "DELETE FROM batchRoom WHERE brId = $brId AND snapshotId = $snapshotId;";

	$result = sqlUpdate($query);	
	error_log("batchRoomDelete(): $query : Result :".json_encode($result), 0);

	if($result === false) {
		error_log("batchRoomDelete(): resString: ".failMessage());
		return failMessage();
	}
	error_log("batchRoomDelete(): resString: ".successMessage(), 0);
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
	error_log("batchRoomUpdate(): $query : Result :".json_encode($result), 0);

	if($result === false) {
		error_log("batchRoomUpdate(): resString: ".failMessage());
		return failMessage();
	}
	error_log("batchRoomUpdate(): resString: ".successMessage(), 0);
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
	error_log("configInsert(): $query Result: ".json_encode($result), 0);

	if($result === false) {
		error_log("configInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlGetAllRows($selectQuery);
	error_log("configInsert(): $selectQuery: Result: ".json_encode($result), 0);
	if($result === false) {
		error_log("configInsert(): resString: ".failMessage());
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
	error_log("configDelete(): $query Result: ".json_encode($result), 0);

	if($result === false) {
		error_log("configDelete(): resString: ".failMessage());
		return failMessage();
	}
	error_log("configDelete(): resString: ".successMessage(), 0);
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
	error_log("configUpdate(): $query Result: ".json_encode($result), 0);

	if($result === false) {
		error_log("configUpdate(): resString: ".failMessage());
		return failMessage();
	}
	error_log("configUpdate(): resString: ".successMessage(), 0);
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
	error_log("overlappingSBTInsert(): $queryInsert1 Result: $result", 0);
	if($result === false) { 
		error_log("overlappingSBTInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result = sqlUpdate($queryInsert2);
	error_log("overlappingSBTInsert: $queryInsert2 Result: $result", 0);
	if($result === false) {
		error_log("overlappingSBTInsert(): resString: ".failMessage());
		return failMessage();
	}

	$result1 = sqlGetAllRows($querySelect1);
	error_log("overlappingSBTInsert: $querySelect1: Result: ".json_encode($result1), 0);
	if($result1 === false) {
		error_log("overlappingSBTInsert(): resString: ".failMessage());
		return failMessage();
	} else {
		$resString = "{\"Success\": \"True\",";
		$resString .= "\"osbtId1\"   : \"".$result1[0]["osbtId"]."\",";
	}

	$result = sqlGetAllRows($querySelect2);
	error_log("overlappingSBTInsert(): $querySelect2: Result: ".json_encode($result), 0);
	if($result === false) {
		error_log("overlappingSBTInsert(): resString: ".failMessage());
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
	error_log("overlappingSBTDelete(): Query: ".$query, 0);

	$result = sqlUpdate($query);
	error_log("overlappingSBTDelete(): $query Result: $result", 0);
	if($result === false) {
		error_log("overlappingSBTDelete(): resString: ".failMessage());
		return failMessage();
	} else {
		error_log("overlappingSBTDelete(): resString: ".successMessage(), 0);
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
	error_log("overlappingSBTUpdate(): Query: ".$query, 0);

	$result = sqlUpdate($query);
	error_log("overlappingSBTUpdate(): $query Result: $result", 0);
	if($result === false) {
		error_log("overlappingSBTUpdate(): resString: ".failMessage());
		return failMessage();
	} else {
		return successMessage();
	}
}
?>

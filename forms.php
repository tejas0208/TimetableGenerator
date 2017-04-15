<?php
$teacherForm = "
	<div class=\"inputForm\" id=\"inputTeacherForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" > Teachers Configuration  
			</td> 
			<td  align=\"right\">  <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"teacherFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"teacherTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateTeacher($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$teacherId = getArgument("teacherId");
	$teacherName = getArgument("teacherName");
	$teacherShortName = getArgument("teacherShortName");
	//$teacherOrigShortName = getArgument("teacherOrigShortName");
	$minHrs = getArgument("minHrs");
	$maxHrs = getArgument("maxHrs");
	$deptId = getArgument("deptId");
	$snapshotId = getArgument("snapshotId");

	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE teacher SET teacherName = \"$teacherName\", teacherShortName = ".
					 "\"$teacherShortName\", minHrs = \"$minHrs\", maxHrs = \"$maxHrs\",".
					 "deptId = \"$deptId\" WHERE teacherId = \"$teacherId\" AND snapshotId = $snapshotId";
			break;
		case "delete":
			$query = "DELETE FROM teacher WHERE teacherId = \"$teacherId\" AND snapshotId = $snapshotId;";
			break;
		case "insert":
			$query = "INSERT INTO teacher (teacherName, teacherShortName, minHrs, maxHrs, deptId, snapshotId) ".
				     "VALUES (\"$teacherName\", \"$teacherShortName\", $minHrs, $maxHrs, $deptId, $snapshotId)";
			$query2 = "SELECT * from teacher WHERE teacherShortName = \"$teacherShortName\" AND snapshotId = $snapshotId";
			break;
		default:
			$query = "ERROR;";
			break;
	}
	error_log("updateTeacher: Query: ".$query, 0);

	$result = sqlUpdate($query);
	error_log("updateTeacher: Result: $result", 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateTeacher: resString: ".$resString);
		return $resString;
	}

	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateTeacher: query2: Result: ".json_encode($result2), 0);
		if($result == false) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"teacherId\"   : \"".$result2[0]["teacherId"]."\"}";
		}
	} else {
			$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateTeacher: resString: ".$resString);
	return $resString;
}
?>
<?php
$subjectForm = "
	<div class=\"inputForm\" id=\"inputSubjectForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" > Subjects Configuration  
			</td> 
			<td  align=\"right\">  <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"subjectFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"subjectTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateSubject($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$subjectId = getArgument("subjectId");
	$subjectName = getArgument("subjectName");
	$subjectShortName = getArgument("subjectShortName");
	//$subjectOrigShortName = getArgument("subjectOrigShortName");
	$eachSlot = getArgument("eachSlot");
	$nSlots = getArgument("nSlots");
	$batches = getArgument("batches");
	$snapshotId = getArgument("snapshotId");

	$query2 = "";
	switch($type) {
			case "update":
				$query = "UPDATE subject SET subjectName = \"$subjectName\", subjectShortName = ".
						 "\"$subjectShortName\", eachSlot = \"$eachSlot\", nSlots= \"$nSlots\", ".
						 "batches= \"$batches\" WHERE subjectId = \"$subjectId\" AND snapshotId = $snapshotId";
				break;
			case "delete":
				$query = "DELETE FROM subject WHERE subjectId = \"$subjectId\" AND snapshotId = $snapshotId;";
				break;
			case "insert":
				$query = "INSERT INTO subject (subjectName, subjectShortName, eachSlot, nSlots, batches, snapshotId) ".
						 "VALUES (\"$subjectName\", \"$subjectShortName\", $eachSlot, $nSlots, $batches, $snapshotId)";
				$query2 = "SELECT * from subject where subjectShortName = \"$subjectShortName\" AND snapshotId = $snapshotId";
				break;
			default:	
				$query = "ERROR;";
				break;
	}
	error_log("updateSubject: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateSubject: Result: ".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateSubject: resString: ".$resString);
		return $resString;
	}

	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateSubject: query2: Result: ".json_encode($result2), 0);
		if($result != true) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"subjectId\"   : \"".$result2[0]["subjectId"]."\"}";
		}
	} else {
			$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateSubject: resString: ".$resString);
	return $resString;
}
?>
<?php
$classForm = "
	<div class=\"inputForm\" id=\"inputClassForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" > Classs Configuration  
			</td> 
			<td  align=\"right\">  <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"classFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"classTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateClass($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$classId = getArgument("classId");
	$className = getArgument("className");
	$classShortName = getArgument("classShortName");
	//$classOrigShortName = getArgument("classOrigShortName");
	$semester = getArgument("semester");
	$classCount = getArgument("classCount");
	$snapshotId = getArgument("snapshotId");
	
	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE class SET className = \"$className\", classShortName = ".
					 "\"$classShortName\", semester = \"$semester\", classCount= \"$classCount\" ".
					 "WHERE classId = \"$classId\" and snapshotId = $snapshotId";
			break;
		case "delete":
			$query = "DELETE FROM class WHERE classId = \"$classId\" AND snapshotId = $snapshotId;";
			break;
		case "insert":
			$query = "INSERT INTO class (className, classShortName, semester, classCount, snapshotId) ".
					 "VALUES (\"$className\", \"$classShortName\", $semester, $classCount, $snapshotId)";
			$query2 = "SELECT * from class where classShortName = \"$classShortName\" AND snapshotId = $snapshotId";
			break;
		default:
			$query = "ERROR;";
			break;
	}
	error_log("updateClass: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateClass: Result :".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateClass: resString: ".$resString);
		return $resString;
	}

	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateClass: query2: Result: ".json_encode($result2), 0);
		if($result != true) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"classId\"   : \"".$result2[0]["classId"]."\"}";
		}
	} else {
			$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateClass: resString: ".$resString);
	return $resString;
}
?>
<?php
$batchForm = "
	<div class=\"inputForm\" id=\"inputBatchForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" > Batch Configuration
			</td> 
			<td  align=\"right\"> <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"batchFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"batchTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";
$batchRoomForm = "
	<div class=\"inputForm\" id=\"inputBatchRoomForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" >Room Preferences for Batches 
			</td> 
			<td  align=\"right\"> <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"batchRoomFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"batchRoomTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";
$batchCanOverlapForm = "
	<div class=\"inputForm\" id=\"inputBatchCanOverlapForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" >Overlapping Batches Configuration
			</td> 
			<td  align=\"right\"> <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"batchCanOverlapFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"batchCanOverlapTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateBatchClass() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchId= getArgument("batchId");
	$classId = getArgument("classId");
	$snapshotId = getArgument("snapshotId");

	$query = "SELECT batchId, classId FROM batchClass WHERE batchId = $batchId and snapshotId = $snapshotId";
	$result = sqlGetAllRows($query);

	$query2 = "";
	if(count($result) == 1) 
		$query = "UPDATE batchClass SET classId = $classId WHERE batchId = $batchId  AND snapshotId = $snapshotId;";
	else if(count($result == 0)) {
		$query = "INSERT INTO batchClass (batchId, classId, snapshotId) VALUES ($batchId, $classId, $snapshotId)";
		$query2 = "SELECT * from batchClass WHERE batchId =$batchId AND snapshotId = $snapshotId";
	}
	else
		$query = "ERORR-Query: Not found $batchId"; 
	error_log("updateBatchClass: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateBatchClass: Result: ".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateBatchClass: resString: ".$resString);
		return $resString;
	}

	$result2 = false;
	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateBatchClass: query2: Result: ".json_encode($result2), 0);
		if($result2 == false) { // either query failed
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {// both queries succeeded
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"bcId\"   : \"".$result2[0]["bcId"]."\"}";
		}
	} else { // only update query was done
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"bcId\"   : \"-1\"}";
	}
	error_log("updateBatchClass: resString: ".$resString);
	return $resString;

}
function updateBatch($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchId = getArgument("batchId");
	$batchName = getArgument("batchName");
	$batchOrigName = getArgument("batchOrigName");
	$batchCount = getArgument("batchCount");
	$snapshotId = getArgument("snapshotId");
	$query2 = "";

	switch($type) {
			case "update":
				$query = "UPDATE batch SET batchName = \"$batchName\", batchCount= \"$batchCount\" ".
						 "WHERE batchId = \"$batchId\" AND snapshotId = $snapshotId";
				break;
			case "delete":
				$query = "DELETE FROM batch WHERE batchId = \"$batchId\" AND snapshotId = $snapshotId;";
				break;
			case "insert":
				$query = "INSERT INTO batch (batchName, batchCount, snapshotId) VALUES (\"$batchName\", $batchCount, $snapshotId)";
				$query2 = "SELECT * FROM batch where batchName = \"$batchName\" AND snapshotId = $snapshotId";
				break;
			default:
				$query = "ERROR;";
				break;
	}
	error_log("updateBatch: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateBatch: Result: ".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateBatch: resString: ".$resString);
		return $resString;
	}
	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateBatch: query2: Result: ".json_encode($result2), 0);
		if($result2 == false) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"batchId\" : \"".$result2[0]["batchId"]."\"}";
		}
	} else {
		$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateBatch: resString: ".$resString);
	return $resString;

}
function batchCanOverlapDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchesJSON = getArgument("batches");
	$batches = json_decode($batchesJSON);
	error_log("batchCanOverlapDelete: received batches for deletion: ".$batches." and ".$batchesJSON);
	$query = "DELETE FROM batchCanOverlap WHERE  snapshotId = $snapshotId AND ";
	$query .= " batchId = ".$batches[0]." OR batchOverlapId = ".$batches[0]." ";
	for($i = 1; $i < count($batches); $i++) { // 0 special case, to match the "OR" in query
			$query .= "OR batchId = ".$batches[$i]." OR batchOverlapId = ".$batches[$i]." ";
	}
	$query .= ";";
	error_log("batchCanOverlapDelete: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateBatch: Result: ".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("batchCanOverlapDelete: resString: ".$resString);
		return $resString;
	} else {
		$resString = "{\"Success\": \"True\"}";
	}
	error_log("batchCanOverlapDelete: resString: ".$resString);
	return $resString;
}
function batchCanOverlapInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchesString = getArgument("batches");
	$batches = [];
	$tok = strtok($batchesString, ",");
	$batches[count($batches)] = $tok;
	while($tok !== false) {
		$tok = strtok(",");
		if($tok !== false)
			$batches[count($batches)] = $tok;
	} 
	error_log("batchCanOverlapDelete: received batches for deletion: ".json_encode($batches));
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
	error_log("batchCanOverlapDelete: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateBatch: Result: ".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("batchCanOverlapInsert: resString: ".$resString);
		return $resString;
	} else {
		$resString = "{\"Success\": \"True\"}";
	}
	error_log("batchCanOverlapInsert: resString: ".$resString);
	return $resString;
}


?>
<?php
$roomForm = "
	<div class=\"inputForm\" id=\"inputRoomForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" > Rooms Configuration  
			</td> 
			<td  align=\"right\">  <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"roomFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"roomTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateRoom($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$roomId = getArgument("roomId");
	$roomName = getArgument("roomName");
	$roomShortName = getArgument("roomShortName");
	//$roomOrigShortName = getArgument("roomOrigShortName");
	$roomCount = getArgument("roomCount");
	$snapshotId = getArgument("snapshotId");
	
	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE room SET roomName = \"$roomName\", roomShortName = ".
					 "\"$roomShortName\", roomCount= \"$roomCount\" ".
					 "WHERE roomId = \"$roomId\" AND snapshotId = $snapshotId";
			break;
		case "delete":
			$query = "DELETE FROM room WHERE roomId = \"$roomId\" AND snapshotId = $snapshotId;";
			break;
		case "insert":
			$query = "INSERT INTO room (roomName, roomShortName, roomCount, snapshotId) ".
					 "VALUES (\"$roomName\", \"$roomShortName\", $roomCount, $snapshotId)";
			$query2 = "SELECT * from room where roomShortName = \"$roomShortName\" AND snapshotId = $snapshotId";
			break;
		default:
			$query = "ERROR;";
			break;
	}
	error_log("updateRoom: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateRoom: Result :".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateRoom: resString: ".$resString);
		return $resString;
	}

	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateRoom: query2: Result: ".json_encode($result2), 0);
		if($result != true) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"roomId\"   : \"".$result2[0]["roomId"]."\"}";
		}
	} else {
			$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateRoom: resString: ".$resString);
	return $resString;
}
?>
<?php
$sbtForm= "
	<div class=\"inputForm\" id=\"inputSBTForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\"> Subject-Batch-Teacher Configuration  
			</td> 
			<td align=\"right\">  <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"sbtFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\"id=\"sbtTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateSBT($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$teacherId = getArgument("teacherId");
	$subjectId = getArgument("subjectId");
	$batchId = getArgument("batchId");
	$sbtId = getArgument("sbtId");
	$snapshotId = getArgument("snapshotId");
	error_log("arguments: ".json_encode($_POST), 0);

	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE subjectBatchTeacher SET teacherId = $teacherId, ".
					  "subjectId = $subjectId, batchId = $batchId".
					 " WHERE sbtId = $sbtId AND snapshotId = $snapshotId";
			break;
		case "delete":
			$query = "DELETE FROM subjectBatchTeacher WHERE sbtId = $sbtId AND snapshotId = $snapshotId;";
			break;
		case "insert":
			$query = "INSERT INTO subjectBatchTeacher (teacherId, subjectId, batchId, snapshotId) ".
				     "VALUES ($teacherId, $subjectId, $batchId, $snapshotId)";
			$query2 = "SELECT * from subjectBatchTeacher WHERE teacherId = $teacherId".
					  " AND batchId = $batchId AND subjectId = $subjectId AND snapshotId = $snapshotId";
			break;
		default:
			$query = "ERROR;";
			break;
	}
	error_log("updateSBT: Query: ".$query, 0);

	$result = sqlUpdate($query);
	error_log("updateSBT: Result: $result", 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateSBT: resString: ".$resString);
		return $resString;
	}

	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateSBT: query2: Result: ".json_encode($result2), 0);
		if($result == false) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"sbtId\"   : \"".$result2[0]["sbtId"]."\"}";
		}
	} else {
			$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateSBT: resString: ".$resString);
	return $resString;
}
?>
<?php
$sctForm= "
	<div class=\"inputForm\" id=\"inputSCTForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\"> Subject-Class-Teacher Configuration  
			</td> 
			<td align=\"right\">  <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"sctFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\"id=\"sctTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateSCT($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$teacherId = getArgument("teacherId");
	$subjectId = getArgument("subjectId");
	$classId = getArgument("classId");
	$sctId = getArgument("sctId");
	$snapshotId = getArgument("snapshotId");

	$query2 = "";
	$query3 = "";
	switch($type) {
		case "update":
			$query = "UPDATE subjectClassTeacher SET teacherId = $teacherId, ".
					  "subjectId = $subjectId, classId = $classId".
					 " WHERE sctId = $sctId AND snapshotId = $snapshotId";
			break;
		case "delete":
			$query = "DELETE FROM subjectClassTeacher WHERE sctId = $sctId AND snapshotId = $snapshotId; ";
			$query3 = "DELETE FROM timeTable WHERE subjectId = $subjectId AND teacherId = $teacherId ".
						" and classId = $classId AND snapshotId = $snapshotId;";
			break;
		case "insert":
			$teacherStr = ($teacherId == "null" ? "null" : $teacherId);
			$query = "INSERT INTO subjectClassTeacher (teacherId, subjectId, classId, snapshotId) ".
				     "VALUES ($teacherStr, $subjectId, $classId, $snapshotId)";
			$query2 = "SELECT * from subjectClassTeacher WHERE teacherId = $teacherId".
					  " AND classId = $classId AND subjectId = $subjectId AND snapshotId = $snapshotId";
			break;
		default:
			$query = "ERROR;";
			break;
	}
	error_log("updateSCT: Query: ".$query, 0);

	$result = sqlUpdate($query);
	error_log("updateSCT: Result: $result", 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateSCT: resString: ".$resString);
		return $resString;
	}
	if($query3 != "") {
		error_log("updateSCT: Query: ".$query3, 0);
		$result = sqlUpdate($query3);
		error_log("updateSCT: Result: $result", 0);
		if($result == false) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
			return $resString;
		}
	}

	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateSCT: query2: Result: ".json_encode($result2), 0);
		if($result == false) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"sctId\"   : \"".$result2[0]["sctId"]."\"}";
		}
	} else {
			$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateSCT: resString: ".$resString);
	return $resString;
}
?>
<?php
$subjectRoomForm = "
	<div class=\"inputForm\" id=\"inputSubjectRoomForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" > Subjects Preferred Rooms 
			</td> 
			<td  align=\"right\">  <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"subjectRoomFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"subjectRoomTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateSubjectRoom($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$subjectId = getArgument("subjectId");
	$roomId = getArgument("roomId"); 
	$srId = getArgument("srId");
	$snapshotId = getArgument("snapshotId");
	
	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE subjectRoom SET subjectId = $subjectId, ".
					 "roomId = $roomId ".
					 "WHERE srId = $srId AND snapshotId = $snapshotId";
			break;
		case "delete":
			$query = "DELETE FROM subjectRoom WHERE srId = $srId AND snapshotId = $snapshotId;";
			break;
		case "insert":
			$query = "INSERT INTO subjectRoom (subjectId, roomId, snapshotId) ".
					 "VALUES ($subjectId, $roomId, $snapshotId) ";
			$query2 = "SELECT * from subjectRoom where subjectId = $subjectId AND ".
					  " roomId = $roomId AND snapshotId = $snapshotId";
			break;
		default:
			$query = "ERROR;";
			break;
	}
	error_log("updateSubjectRoom: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateSubjectRoom: Result :".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateSubjectRoom: resString: ".$resString);
		return $resString;
	}

	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateSubjectRoom: query2: Result: ".json_encode($result2), 0);
		if($result != true) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"srId\"   : \"".$result2[0]["srId"]."\"}";
		}
	} else {
			$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateSubjectRoom: resString: ".$resString);
	return $resString;
}
?>
<?php
$classRoomForm = "
	<div class=\"inputForm\" id=\"inputClassRoomForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" > Class: Preferred Rooms 
			</td> 
			<td  align=\"right\">  <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"classRoomFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"classRoomTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateClassRoom($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$classId = getArgument("classId");
	$roomId = getArgument("roomId"); 
	$crId = getArgument("crId");
	$snapshotId = getArgument("snapshotId");
	
	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE classRoom SET classId = $classId, ".
					 "roomId = $roomId ".
					 "WHERE crId = $crId AND snapshotId = $snapshotId";
			break;
		case "delete":
			$query = "DELETE FROM classRoom WHERE crId = $crId AND snapshotId = $snapshotId;";
			break;
		case "insert":
			$query = "INSERT INTO classRoom (classId, roomId, snapshotId) ".
					 "VALUES ($classId, $roomId, $snapshotId) ";
			$query2 = "SELECT * from classRoom where classId = $classId AND roomId = $roomId AND snapshotId = $snapshotId";
			break;
		default:
			$query = "ERROR;";
			break;
	}
	error_log("updateClassRoom: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateClassRoom: Result :".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateClassRoom: resString: ".$resString);
		return $resString;
	}

	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateClassRoom: query2: Result: ".json_encode($result2), 0);
		if($result != true) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"crId\"   : \"".$result2[0]["crId"]."\"}";
		}
	} else {
			$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateClassRoom: resString: ".$resString);
	return $resString;
}
?>
<?php
$batchRoomForm = "
	<div class=\"inputForm\" id=\"inputBatchRoomForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" > Batches Preferred Rooms 
			</td> 
			<td  align=\"right\">  <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"batchRoomFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"batchRoomTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateBatchRoom($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchId = getArgument("batchId");
	$roomId = getArgument("roomId"); 
	$brId = getArgument("brId");
	$snapshotId = getArgument("snapshotId");
	
	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE batchRoom SET batchId = $batchId, ".
					 "roomId = $roomId ".
					 "WHERE brId = $brId AND snapshotId = $snapshotId";
			break;
		case "delete":
			$query = "DELETE FROM batchRoom WHERE brId = $brId AND snapshotId = $snapshotId;";
			break;
		case "insert":
			$query = "INSERT INTO batchRoom (batchId, roomId, snapshotId) ".
					 "VALUES ($batchId, $roomId, $snapshotId) ";
			$query2 = "SELECT * from batchRoom where batchId = $batchId AND roomId = $roomId AND snapshotId = $snapshotId";
			break;
		default:
			$query = "ERROR;";
			break;
	}
	error_log("updateBatchRoom: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateBatchRoom: Result :".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateBatchRoom: resString: ".$resString);
		return $resString;
	}

	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateBatchRoom: query2: Result: ".json_encode($result2), 0);
		if($result != true) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"brId\"   : \"".$result2[0]["brId"]."\"}";
		}
	} else {
			$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateBatchRoom: resString: ".$resString);
	return $resString;
}
?>
<?php
$configForm = "
	<div class=\"inputForm\" id=\"inputConfigForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" > Configs Configuration  
			</td> 
			<td  align=\"right\">  <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"configFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"configTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateConfig($type) {
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

	$query2 = "";
	switch($type) {
			case "update":
				$query = "UPDATE config SET configName = \"$configName\", dayBegin = ".
						 "\"$dayBegin\", slotDuration = $slotDuration, nSlots= $nSlots, ".
						 "deptId= $deptId, incharge=$incharge WHERE configId = \"$configId\"";
				break;
			case "delete":
				$query = "DELETE FROM config WHERE configId = $configId;";
				break;
			case "insert":
				$query = "INSERT INTO config (configName, dayBegin, slotDuration, nSlots, deptId, incharge) ".
						 "VALUES (\"$configName\", \"$dayBegin\", $slotDuration, $nSlots, $deptId, $incharge)";
				$query2 = "SELECT * from config where configName = \"$configName\"";
				break;
			default:	
				$query = "ERROR;";
				break;
	}
	error_log("updateConfig: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateConfig: Result: ".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateConfig: resString: ".$resString);
		return $resString;
	}

	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateConfig: query2: Result: ".json_encode($result2), 0);
		if($result != true) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"configId\"   : \"".$result2[0]["configId"]."\"}";
		}
	} else {
			$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateConfig: resString: ".$resString);
	return $resString;
}
?>
<?php
$overlappingSBTForm= "
	<div class=\"inputForm\" id=\"inputoverlappingSBTForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\"> Overlapping Subject-Batches Configuration  
			</td> 
			<td align=\"right\">  <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"overlappingSBTFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\"id=\"overlappingSBTTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateOverlappingSBT($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$sbtId1 = getArgument("sbtId1");
	$sbtId2 = getArgument("sbtId2");
	$osbtId = getArgument("osbtId");
	$snapshotId = getArgument("snapshotId");

	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE overlappingSBT SET sbtId1 = $sbtId1, ".
					  "sbtId2 = $sbtId2".
					 " WHERE osbtId = $osbtId AND snapshotId = $snapshotId";
			break;
		case "delete":
			$query = "DELETE FROM overlappingSBT WHERE osbtId = $osbtId AND snapshotId = $snapshotId;";
			break;
		case "insert":
			$query = "INSERT INTO overlappingSBT (sbtId1, sbtId2, snapshotId) ".
				     "VALUES ($sbtId1, $sbtId2, $snapshotId)";
			$query2 = "SELECT * from overlappingSBT WHERE sbtId1 = $sbtId1 ".
					  " AND sbtId2 = $sbtId2 AND snapshotId = $snapshotId";
			break;
		default:
			$query = "ERROR;";
			break;
	}
	error_log("updateoverlappingSBT: Query: ".$query, 0);

	$result = sqlUpdate($query);
	error_log("updateoverlappingSBT: Result: $result", 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateoverlappingSBT: resString: ".$resString);
		return $resString;
	}

	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateoverlappingSBT: query2: Result: ".json_encode($result2), 0);
		if($result == false) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"osbtId\"   : \"".$result2[0]["osbtId"]."\"}";
		}
	} else {
			$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateoverlappingSBT: resString: ".$resString);
	return $resString;
}
$allForms = 		
		$teacherForm.  $subjectForm.  $classForm. 
		$batchForm. $batchRoomForm. $batchCanOverlapForm.
		$roomForm. $classRoomForm. $batchRoomForm. $subjectRoomForm.
		$sctForm. $sbtForm.
		$overlappingSBTForm;
		$configForm;
?>

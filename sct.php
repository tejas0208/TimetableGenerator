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

	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE subjectClassTeacher SET teacherId = $teacherId, ".
					  "subjectId = $subjectId, classId = $classId".
					 " WHERE sctId = $sctId";
			break;
		case "delete":
			$query = "DELETE FROM subjectClassTeacher WHERE sctId = $sctId;";
			break;
		case "insert":
			$query = "INSERT INTO subjectClassTeacher (teacherId, subjectId, classId) ".
				     "VALUES ($teacherId, $subjectId, $classId)";
			$query2 = "SELECT * from subjectClassTeacher WHERE teacherId = $teacherId".
					  " AND classId = $classId AND subjectId = $subjectId";
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

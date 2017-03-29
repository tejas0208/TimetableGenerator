<?php
$teacherForm = "
	<div class=\"inputForm\" id=\"inputTeacherForm\">
	<table> <tr> 
			<td align=\"center\" width=\"50%\"> Teachers Configuration  
			</td> 
			<td width=\"50%\" align=\"right\">  <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"teacherFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table id=\"teacherTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateTeacher($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$teacherName = getArgument("teacherName");
	$teacherShortName = getArgument("teacherShortName");
	$teacherOrigShortName = getArgument("teacherOrigShortName");
	$minHrs = getArgument("minHrs");
	$maxHrs = getArgument("maxHrs");
	$deptId = getArgument("deptId");

	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE teacher SET teacherName = \"$teacherName\", teacherShortName = ".
					 "\"$teacherShortName\", minHrs = \"$minHrs\", maxHrs = \"$maxHrs\",".
					 "deptId = \"$deptId\" WHERE teacherShortName = \"$teacherOrigShortName\"";
			break;
		case "delete":
			$query = "DELETE FROM teacher WHERE teacherShortName = \"$teacherShortName\";";
			break;
		case "insert":
			$query = "INSERT INTO teacher (teacherName, teacherShortName, minHrs, maxHrs, deptId) ".
				     "VALUES (\"$teacherName\", \"$teacherShortName\", $minHrs, $maxHrs, $deptId)";
			$query2 = "SELECT * from teacher WHERE teacherShortName = \"$teacherShortName\"";
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

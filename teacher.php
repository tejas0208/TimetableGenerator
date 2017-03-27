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
	$resString = ("Success");
	header("Content-Type: application/text: charset=UTF-8");
	$teacherName = getArgument("teacherName");
	$teacherShortName = getArgument("teacherShortName");
	$teacherOrigShortName = getArgument("teacherOrigShortName");
	$minHrs = getArgument("minHrs");
	$maxHrs = getArgument("maxHrs");
	$deptId = getArgument("deptId");
	if($type == "update") {
		$query = "UPDATE teacher SET teacherName = \"$teacherName\", teacherShortName = 
				\"$teacherShortName\", minHrs = \"$minHrs\", maxHrs = \"$maxHrs\", 
				deptId = \"$deptId\" WHERE teacherShortName = \"$teacherOrigShortName\"";
	} else if($type == "delete") {
		$query = "DELETE FROM teacher WHERE teacherShortName = \"$teacherShortName\";";
	} else if($type == "insert") {
		$query = "INSERT INTO teacher (teacherName, teacherShortName, minHrs, maxHrs, deptId) ".
				"VALUES (\"$teacherName\", \"$teacherShortName\", $minHrs, $maxHrs, $deptId)";

	} else 
		$query = "ERROR;";
	error_log("UpdateTeacher:Query\n".$query, 0);
	$result = sqlUpdate($query);	
	error_log("UpdateTeacher:Result \n".json_encode($result), 0);
	if($result != true) {
			$resString = "Failure: ".$CFG->conn->error;
	}
	return $resString;
}
?>

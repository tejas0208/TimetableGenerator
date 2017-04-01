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

	$className = getArgument("className");
	$classShortName = getArgument("classShortName");
	$classOrigShortName = getArgument("classOrigShortName");
	$semester = getArgument("semester");
	$classCount = getArgument("classCount");
	
	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE class SET className = \"$className\", classShortName = ".
					 "\"$classShortName\", semester = \"$semester\", classCount= \"$classCount\" ".
					 "WHERE classShortName = \"$classOrigShortName\"";
			break;
		case "delete":
			$query = "DELETE FROM class WHERE classShortName = \"$classShortName\";";
			break;
		case "insert":
			$query = "INSERT INTO class (className, classShortName, semester, classCount) ".
					 "VALUES (\"$className\", \"$classShortName\", $semester, $classCount)";
			$query2 = "SELECT * from class where classShortName = \"$classShortName\"";
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

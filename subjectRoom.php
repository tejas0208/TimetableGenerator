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
	
	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE subjectRoom SET subjectId = $subjectId, ".
					 "roomId = $roomId ".
					 "WHERE srId = $srId";
			break;
		case "delete":
			$query = "DELETE FROM subjectRoom WHERE srId = $srId;";
			break;
		case "insert":
			$query = "INSERT INTO subjectRoom (subjectId, roomId) ".
					 "VALUES ($subjectId, $roomId) ";
			$query2 = "SELECT * from subjectRoom where subjectId = $subjectId AND roomId = $roomId";
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

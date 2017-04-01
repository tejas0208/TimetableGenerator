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
	
	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE classRoom SET classId = $classId, ".
					 "roomId = $roomId ".
					 "WHERE crId = $crId";
			break;
		case "delete":
			$query = "DELETE FROM classRoom WHERE crId = $crId;";
			break;
		case "insert":
			$query = "INSERT INTO classRoom (classId, roomId) ".
					 "VALUES ($classId, $roomId) ";
			$query2 = "SELECT * from classRoom where classId = $classId AND roomId = $roomId";
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

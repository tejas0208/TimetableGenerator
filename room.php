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

	$roomName = getArgument("roomName");
	$roomShortName = getArgument("roomShortName");
	$roomOrigShortName = getArgument("roomOrigShortName");
	$roomCount = getArgument("roomCount");
	
	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE room SET roomName = \"$roomName\", roomShortName = ".
					 "\"$roomShortName\", roomCount= \"$roomCount\" ".
					 "WHERE roomShortName = \"$roomOrigShortName\"";
			break;
		case "delete":
			$query = "DELETE FROM room WHERE roomShortName = \"$roomShortName\";";
			break;
		case "insert":
			$query = "INSERT INTO room (roomName, roomShortName, roomCount) ".
					 "VALUES (\"$roomName\", \"$roomShortName\", $roomCount)";
			$query2 = "SELECT * from room where roomShortName = \"$roomShortName\"";
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

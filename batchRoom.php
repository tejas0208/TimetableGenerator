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
	
	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE batchRoom SET batchId = $batchId, ".
					 "roomId = $roomId ".
					 "WHERE brId = $brId";
			break;
		case "delete":
			$query = "DELETE FROM batchRoom WHERE brId = $brId;";
			break;
		case "insert":
			$query = "INSERT INTO batchRoom (batchId, roomId) ".
					 "VALUES ($batchId, $roomId) ";
			$query2 = "SELECT * from batchRoom where batchId = $batchId AND roomId = $roomId";
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

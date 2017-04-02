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

	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE overlappingSBT SET sbtId1 = $sbtId1, ".
					  "sbtId2 = $sbtId2".
					 " WHERE osbtId = $osbtId";
			break;
		case "delete":
			$query = "DELETE FROM overlappingSBT WHERE osbtId = $osbtId;";
			break;
		case "insert":
			$query = "INSERT INTO overlappingSBT (sbtId1, sbtId2) ".
				     "VALUES ($sbtId1, $sbtId2)";
			$query2 = "SELECT * from overlappingSBT WHERE sbtId1 = $sbtId1 ".
					  " AND sbtId2 = $sbtId2";
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
?>

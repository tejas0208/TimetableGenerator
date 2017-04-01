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

	$query2 = "";
	switch($type) {
		case "update":
			$query = "UPDATE subjectBatchTeacher SET teacherId = $teacherId, ".
					  "subjectId = $subjectId, batchId = $batchId".
					 " WHERE sbtId = $sbtId";
			break;
		case "delete":
			$query = "DELETE FROM subjectBatchTeacher WHERE sbtId = $sbtId;";
			break;
		case "insert":
			$query = "INSERT INTO subjectBatchTeacher (teacherId, subjectId, batchId) ".
				     "VALUES ($teacherId, $subjectId, $batchId)";
			$query2 = "SELECT * from subjectBatchTeacher WHERE teacherId = $teacherId".
					  " AND batchId = $batchId AND subjectId = $subjectId";
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

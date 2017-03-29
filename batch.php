<?php
$batchForm = "
	<div class=\"inputForm\" id=\"inputBatchForm\">
	<table> <tr> 
			<td align=\"center\" width=\"50%\"> Batch Configuration
			</td> 
			<td width=\"50%\" align=\"right\"> <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"batchFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table id=\"batchTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";
function updateBatchClass() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchId= getArgument("batchId");
	$classId = getArgument("classId");

	$query = "SELECT batchId, classId FROM batchClass WHERE batchId = $batchId";
	$result = sqlGetAllRows($query);

	$query2 = "";
	if(count($result) == 1) 
		$query = "UPDATE batchClass SET classId = $classId WHERE (batchId = $batchId);";
	else if(count($result == 0)) {
		$query = "INSERT INTO batchClass (batchId, classId) VALUES ($batchId, $classId)";
		$query2 = "SELECT * from batchClass WHERE batchId =$batchId";
	}
	else
		$query = "ERORR-Query: Not found $batchId"; 
	error_log("updateBatchClass: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateBatchClass: Result: ".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateBatchClass: resString: ".$resString);
		return $resString;
	}

	$result2 = false;
	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateBatchClass: query2: Result: ".json_encode($result2), 0);
		if($result2 == false) { // either query failed
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {// both queries succeeded
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"bcId\"   : \"".$result2[0]["bcId"]."\"}";
		}
	} else { // only update query was done
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"bcId\"   : \"-1\"}";
	}
	error_log("updateBatchClass: resString: ".$resString);
	return $resString;

}
function updateBatch($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchName = getArgument("batchName");
	$batchOrigName = getArgument("batchOrigName");
	$batchCount = getArgument("batchCount");

	switch($type) {
			case "update":
				$query = "UPDATE batch SET batchName = \"$batchName\", batchCount= \"$batchCount\" ".
						 "WHERE batchName = \"$batchOrigName\"";
				break;
			case "delete":
				$query = "DELETE FROM batch WHERE batchName = \"$batchName\";";
				break;
			case "insert":
				$query = "INSERT INTO batch (batchName, batchCount) VALUES (\"$batchName\", $batchCount)";
				$query2 = "SELECT * FROM batch where batchName = \"$batchName\"";
				break;
			default:
				$query = "ERROR;";
				break;
	}
	error_log("updateBatch: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateBatch: Result: ".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateBatch: resString: ".$resString);
		return $resString;
	}
	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateBatch: query2: Result: ".json_encode($result2), 0);
		if($result2 == false) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"batchId\" : \"".$result2[0]["batchId"]."\"}";
		}
	} else {
		$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateBatch: resString: ".$resString);
	return $resString;

}
?>

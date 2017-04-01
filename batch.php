<?php
$batchForm = "
	<div class=\"inputForm\" id=\"inputBatchForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" > Batch Configuration
			</td> 
			<td  align=\"right\"> <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"batchFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"batchTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";
$batchRoomForm = "
	<div class=\"inputForm\" id=\"inputBatchRoomForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" >Room Preferences for Batches 
			</td> 
			<td  align=\"right\"> <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"batchRoomFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"batchRoomTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";
$batchCanOverlapForm = "
	<div class=\"inputForm\" id=\"inputBatchCanOverlapForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" >Overlapping Batches Configuration
			</td> 
			<td  align=\"right\"> <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"batchCanOverlapFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"batchCanOverlapTable\" class=\"inputFormTable\">	
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
function batchCanOverlapDelete() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchesJSON = getArgument("batches");
	$batches = json_decode($batchesJSON);
	error_log("batchCanOverlapDelete: received batches for deletion: ".$batches." and ".$batchesJSON);
	$query = "DELETE FROM batchCanOverlap WHERE";
	$query .= " batchId = ".$batches[0]." OR batchOverlapId = ".$batches[0]." ";
	for($i = 1; $i < count($batches); $i++) { // 0 special case, to match the "OR" in query
			$query .= "OR batchId = ".$batches[$i]." OR batchOverlapId = ".$batches[$i]." ";
	}
	$query .= ";";
	error_log("batchCanOverlapDelete: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateBatch: Result: ".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("batchCanOverlapDelete: resString: ".$resString);
		return $resString;
	} else {
		$resString = "{\"Success\": \"True\"}";
	}
	error_log("batchCanOverlapDelete: resString: ".$resString);
	return $resString;
}
function batchCanOverlapInsert() {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$batchesString = getArgument("batches");
	$batches = [];
	$tok = strtok($batchesString, ",");
	$batches[count($batches)] = $tok;
	while($tok !== false) {
		$tok = strtok(",");
		if($tok !== false)
			$batches[count($batches)] = $tok;
	} 
	error_log("batchCanOverlapDelete: received batches for deletion: ".json_encode($batches));
	$query = "INSERT INTO batchCanOverlap (batchId, batchOverlapId) VALUES ";
	for($i = 0; $i < count($batches); $i++) { // 0 special case, to match the "OR" in query
			for($j = 0; $j < count($batches); $j++) {
				if($j == $i)
					continue;
				/* all this just to avoid the , on the last entry */
				if(($i == (count($batches) - 1)) && ($j == (count($batches) -2)))
					$query .= "(".$batches[$i].", ".$batches[$j].")";
				else
					$query .= "(".$batches[$i].", ".$batches[$j]."), ";
			}
	}
	$query .= ";"; // remove the last comma  
	error_log("batchCanOverlapDelete: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateBatch: Result: ".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("batchCanOverlapInsert: resString: ".$resString);
		return $resString;
	} else {
		$resString = "{\"Success\": \"True\"}";
	}
	error_log("batchCanOverlapInsert: resString: ".$resString);
	return $resString;
}


?>

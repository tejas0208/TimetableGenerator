<?php
$configForm = "
	<div class=\"inputForm\" id=\"inputConfigForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" > Configs Configuration  
			</td> 
			<td  align=\"right\">  <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"configFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"configTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateConfig($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$configName = getArgument("configName");
	$configId = getArgument("configId");
	$dayBegin = getArgument("dayBegin");
	$configOrigName = getArgument("configOrigName");
	$slotDuration = getArgument("slotDuration");
	$nSlots = getArgument("nSlots");
	$deptId = getArgument("deptId");
	$incharge = getArgument("incharge");

	$query2 = "";
	switch($type) {
			case "update":
				$query = "UPDATE config SET configName = \"$configName\", dayBegin = ".
						 "\"$dayBegin\", slotDuration = $slotDuration, nSlots= $nSlots, ".
						 "deptId= $deptId, incharge=$incharge WHERE configId = \"$configId\"";
				break;
			case "delete":
				$query = "DELETE FROM config WHERE configId = $configId;";
				break;
			case "insert":
				$query = "INSERT INTO config (configName, dayBegin, slotDuration, nSlots, deptId, incharge) ".
						 "VALUES (\"$configName\", \"$dayBegin\", $slotDuration, $nSlots, $deptId, $incharge)";
				$query2 = "SELECT * from config where configName = \"$configName\"";
				break;
			default:	
				$query = "ERROR;";
				break;
	}
	error_log("updateConfig: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateConfig: Result: ".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateConfig: resString: ".$resString);
		return $resString;
	}

	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateConfig: query2: Result: ".json_encode($result2), 0);
		if($result != true) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"configId\"   : \"".$result2[0]["configId"]."\"}";
		}
	} else {
			$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateConfig: resString: ".$resString);
	return $resString;
}
?>

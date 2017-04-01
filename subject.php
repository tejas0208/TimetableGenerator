<?php
$subjectForm = "
	<div class=\"inputForm\" id=\"inputSubjectForm\">
	<table width=\"60%\"> <tr> 
			<td align=\"center\" > Subjects Configuration  
			</td> 
			<td  align=\"right\">  <a href=\"javascript:void(0)\" 
					class=\"closebtn\" onclick=\"subjectFormClose()\"> 
					Close &times; </a> 
			</td> 
	</table>
	<table width=\"60%\" id=\"subjectTable\" class=\"inputFormTable\">	
	</table>
	</div>	
";

function updateSubject($type) {
	global $CFG;
	header("Content-Type: application/JSON: charset=UTF-8");

	$subjectName = getArgument("subjectName");
	$subjectShortName = getArgument("subjectShortName");
	$subjectOrigShortName = getArgument("subjectOrigShortName");
	$eachSlot = getArgument("eachSlot");
	$nSlots = getArgument("nSlots");
	$batches = getArgument("batches");

	$query2 = "";
	switch($type) {
			case "update":
				$query = "UPDATE subject SET subjectName = \"$subjectName\", subjectShortName = ".
						 "\"$subjectShortName\", eachSlot = \"$eachSlot\", nSlots= \"$nSlots\", ".
						 "batches= \"$batches\" WHERE subjectShortName = \"$subjectOrigShortName\"";
				break;
			case "delete":
				$query = "DELETE FROM subject WHERE subjectShortName = \"$subjectShortName\";";
				break;
			case "insert":
				$query = "INSERT INTO subject (subjectName, subjectShortName, eachSlot, nSlots, batches) ".
						 "VALUES (\"$subjectName\", \"$subjectShortName\", $eachSlot, $nSlots, $batches)";
				$query2 = "SELECT * from subject where subjectShortName = \"$subjectShortName\"";
				break;
			default:	
				$query = "ERROR;";
				break;
	}
	error_log("updateSubject: Query: ".$query, 0);

	$result = sqlUpdate($query);	
	error_log("updateSubject: Result: ".json_encode($result), 0);

	if($result == false) {
		$resString = "{\"Success\": \"False\",";
		$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		error_log("updateSubject: resString: ".$resString);
		return $resString;
	}

	if($query2 != "") {
		$result2 = sqlGetAllRows($query2);
		error_log("updateSubject: query2: Result: ".json_encode($result2), 0);
		if($result != true) {
			$resString = "{\"Success\": \"False\",";
			$resString .= "\"Error\" : ".json_encode($CFG->conn->error)."}";
		} else {
			$resString = "{\"Success\": \"True\",";
			$resString .= "\"subjectId\"   : \"".$result2[0]["subjectId"]."\"}";
		}
	} else {
			$resString = "{\"Success\": \"True\"}";
	}
	error_log("updateSubject: resString: ".$resString);
	return $resString;
}
?>

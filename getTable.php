<?php
	require_once('db.php');
	header("Content-Type: application/json; charset=UTF-8");

	/* List of tables to be returned */	
	$tablenames = array("timeTable", "teacher", "class", "batch", 
						"batchCanOverlap", "dept", "room", "config", 
						"subject", "batchClass", "subjectBatchTeacher", 
						"subjectClassTeacher");
	$length = count($tablenames);
	
	for($i = 0; $i < $length; $i++) {
		$query = "SELECT * FROM ".$tablenames[$i];/*TimeTable*/
		$outp = sqlGetAllRows($query);
		$tables[$tablenames[$i]] = $outp;
	}
	echo json_encode($tables);
?>

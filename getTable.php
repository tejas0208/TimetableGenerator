<?php
	require_once('db.php');
	header("Content-Type: application/json; charset=UTF-8");
	$conn = db_connect();
	$tablenames = array("timeTable", "teacher", "class", "batch", "batchCanOverlap", "dept", "room", "config", "subject", "batchClass", "subjectBatchTeacher", "subjectClassTeacher");/*Just add the table u want to fetch*/
	$length = count($tablenames);
	
	for($i = 0; $i < $length; $i++) {
		$query = "SELECT * FROM ".$tablenames[$i];/*TimeTable*/
		$result = $conn->query($query);
		$outp = array();
		if ($result->num_rows >= 0) {
			$outp = $result->fetch_all(MYSQLI_ASSOC);
			$tables[$tablenames[$i]] = $outp;
		}
	}
	echo json_encode($tables);
?>

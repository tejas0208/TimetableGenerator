<?php
require_once('config.php');
function dbConnect() {
	global $CFG;
	$conn = new mysqli($CFG->server, $CFG->db_user, $CFG->db_pass, $CFG->db_database);
	if($conn->error) {
		die("db.php: Database connection error". $conn->error .""); 
	}
	$CFG->conn = $conn;
	return $conn;
}
function sqlGetAllRows($query) {
	global $CFG;
	if($CFG->conn === false) 
		$conn = dbConnect();
	else
		$conn = $CFG->conn;
	$result = $conn->query($query);
	if($result === false)  {
		error_log("Query $query returned false", 0);
		$CFG->last_query = $query;
		die("Query $query returned false");
	}
	$allrows = array();
	$allrows = $result->fetch_all(MYSQLI_ASSOC);
	return $allrows;
}
function sqlGetOneRow($query) {
	global $CFG;
	if($CFG->conn === false) 
		$conn = dbConnect();
	else
		$conn = $CFG->conn;
	$result = $conn->query($query);
	if($result === false)  {
		error_log("sqlGetOneRow: $query Failed");
		die("sqlGetOneRow: Query $query returned false");
	}
	$allrows = array();
	$allrows = $result->fetch_all(MYSQLI_ASSOC);
	if(count($allrows) != 1) {
		error_log("sqlGetOneRow: $query returned ".count($allrows)." rows");
		$CFG->last_query = $query;
		die("sqlGetOneRow: $query returned ".count($allrows)." rows");
	}
	return $allrows;
}

function sqlUpdate($query) {
	global $CFG;
	if($CFG->conn === false)
		$conn = dbConnect();
	else
		$conn = $CFG->conn;
	$result = $conn->query($query);
	if($result === false) {
		$CFG->last_query = $query;
		error_log("sqlUpdate: Query $query returned false\n",0);	
		return $result;
	}
	return true;
}
?>

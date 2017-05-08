<?php
require_once('config.php');
require_once('common.php');
function dbConnect() {
	global $CFG;
	$conn = new mysqli($CFG->server, $CFG->db_user, $CFG->db_pass, $CFG->db_database);
	if($conn->connect_error) {
		return false;
	}
	$CFG->conn = $conn;
	return $conn;
}
function dbConnectNoDatabase() {
	global $CFG;
	$conn = new mysqli($CFG->server, $CFG->db_user, $CFG->db_pass);
	if($conn->connect_error) {
		return false;
	}
	$CFG->conn = $conn;
	return $conn;
}
function createDatabase($dbName) {
	$conn = dbConnectNoDatabase();
	$sqlQuery = "CREATE DATABASE ".$dbName.";";
	$result = $conn->query($sqlQuery);
	if($result === false)
		return false;
	return $result;
}
function sqlGetAllRows($query) {
	global $CFG;
	if($CFG->conn === false) 
		$conn = dbConnect();
	else
		$conn = $CFG->conn;
	if($conn === false) {
		die("db.php: Database connection error");
	}
	$result = $conn->query($query);
	if($result === false)  {
		ttlog("sqlGetAllRows: Query $query returned false");
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
	if($conn === false) {
		die("db.php: Database connection error");
	}
	$result = $conn->query($query);
	if($result === false)  {
		ttlog("sqlGetOneRow: $query Failed");
		die("sqlGetOneRow: Query $query returned false");
	}
	$allrows = array();
	$allrows = $result->fetch_all(MYSQLI_ASSOC);
	if(count($allrows) != 1) {
		ttlog("sqlGetOneRow: $query returned ".count($allrows)." rows");
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
	if($conn === false) {
		die("db.php: Database connection error");
	}
	$result = $conn->query($query);
	if($result === false) {
		$CFG->last_query = $query;
		ttlog("sqlUpdate: Query $query returned false\n");	
		return $result;
	}
	return true;
}
?>

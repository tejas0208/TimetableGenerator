<?php
	require_once('config.php');
	function db_connect() {
		global $CFG;
		$conn = new mysqli($CFG->server, $CFG->db_user, $CFG->db_pass, $CFG->db_database);
		if($conn->error) {
			die("connection error ". $conn->error . "<br>"); 
		}
		$CFG->conn = $conn;
		return $conn;
	}
	function sql_getallrows($query) {
		global $CFG;
		if($CFG->conn === false) 
			$conn = db_connect();
		else
			$conn = $CFG->conn;
		$result = $conn->query($query);
		if($result === false)  {
			die("Query $query returned false <br>");
		}
		$allrows = array();
		$allrows = $result->fetch_all(MYSQLI_ASSOC);
		return $allrows;
	}
?>

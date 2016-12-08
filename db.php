<?php
	require_once('config.php');
	function db_connect() {
		global $CFG;
		$conn = new mysqli($CFG->server, $CFG->db_user, $CFG->db_pass, $CFG->db_database);
		if($conn->error) {
			die("connection error ". $conn->error . "<br>"); 
		}
		return $conn;
	}
?>

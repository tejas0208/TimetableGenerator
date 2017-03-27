<?php
	require_once('config.php');
	function dbConnect() {
		global $CFG;
		$conn = new mysqli($CFG->server, $CFG->db_user, $CFG->db_pass, $CFG->db_database);
		if($conn->error) {
			die("connection error ". $conn->error . "<br>"); 
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
			die("Query $query returned false <br>");
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
			die("Query $query returned false <br>");
		}
		$allrows = array();
		$allrows = $result->fetch_all(MYSQLI_ASSOC);
		if(count($allrows) != 1) {
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
			error_log("sqlUpdate"."Query $query returned false\n",0);	
			return $result;
		}
		return true;
	}
?>

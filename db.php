<?php
// This file is part of Samay - a timetabling software for 
// schools, colleges/universities.
//
// Samay is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Samay is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Samay.  If not, see <http://www.gnu.org/licenses/>.

/**
 *
 * Copyright 2007 Abhijit A. M.(abhijit13@gmail.com)
 */
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

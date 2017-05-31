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


if(isset($_POST['reqType']) && $_POST['reqType'] == "checkInstallation") {
	$resultFail = "{\"Success\": \"False\"}";
	if(!configFileExists()) {
		echo $resultFail;
		return;
	}
	require_once('db.php');
	if(!dbConnect()) {
		echo $resultFail;
		return;
	}
	if(!tablesExist()) {
		echo $resultFail;
		return;
	}
	if(!atLeastOneDeptExists()) {
		echo $resultFail;
		return;
	}
	if(!atLeastOneUserExists()) {
		echo $resultFail;
		return;
	}
	echo "{\"Success\": \"True\"}";
	return;
}
function checkPHPVersion() {
	if (version_compare(phpversion(), '5.4.7') < 0) {
    	$phpversion = phpversion();
    	echo "Need php version at least 5.4.7. Current version is $phpversion).<br />";
    	die;
	}
}
function checkWebServer() {

}
function checkMySqlSetup() {
	/* This extension enables mysqli_result::fetch_all() function */
	if(!extension_loaded('mysqlnd')) {
		echo "Need php5-mysqlnd installed.  <br> ".
			"On Ubuntu try running \"sudo apt-get install php5-mysqlnd\"";
		die;
	}
}
global $msgStr;
function message($string) {
	global $msgStr;
	$msgStr .= "<div class=\"installMessage\"> $string </div>";
}
/**
 * The tasks of the install script begin here 
 */
checkPHPVersion();
checkWebServer();
checkMySqlSetup();

function configFileExists() {
	$configfile = './config.php';
	if (file_exists($configfile)) {
		return true;
	} else {
		return false;
	}
}
function showConfigFileForm() {
	$configFileHTML = file_get_contents("html/configFileForm.html");
	echo $configFileHTML;
	die;
}
function createConfigFile() {
	$dbname = $_POST['dbname'];	
	$dbuser = $_POST['dbuser'];	
	$dbpass = $_POST['dbpass'];	
	$dbport = $_POST['dbport'];	
	$dbhost = $_POST['dbhost'];	
	$dbtype = $_POST['dbtype'];	
	$configFile = fopen("config.php", "w");
	$text = "<?php
		unset(\$CFG);
		global \$CFG;

		\$CFG = new stdClass();

		\$CFG->db_type = \"$dbtype\";
		\$CFG->db_user = \"$dbuser\";
		\$CFG->db_pass = \"$dbpass\";
		\$CFG->db_database = \"$dbname\";
		\$CFG->server = \"$dbhost\";
		\$CFG->port = \"$dbport\";
		\$CFG->conn = false;
		\$CFG->logfile = false;
		\$CFG->logfileName = false;
	?>";
	/* TODO: Ask the user to create this file manually */
	$result = fwrite($configFile, $text);
	if($result === false) {
		echo("Can't write config.php to current Folder, Please check permissions.");
	}
	return;
}
if(isset($_POST['createConfig'])) {
	message("Creating Config File ...");
	createConfigFile();
}

if(!configFileExists()) {
	showConfigFileForm();
}
message("Config File Found...");

require_once('config.php');
require_once('db.php');

if(!dbConnect()) {
	if(dbConnectNoDatabase() === false) {
		die("Can not connect to database engine. Please check config.php <br>");
	} else {
		$result = createDatabase($CFG->db_database);
		if($result === false) {
			die("Creation of database Failed. Please check config.php <br>");
		}
		if(dbConnect() === false) {
			die("Can not connect to Database '$CFG->db_database'. Please check config.php <br>");
		}
	}
}
message("Database connection working ....");

function tablesExist() {
	global $CFG;
	$conn = $CFG->conn;
	$query = "SELECT * from teacher";
	$result = $conn->query($query);
	if($result === false) {
		return false;
	}
	return true;
}
function createTables() {
	$conn = dbConnect();
	$createSchemaQuery = file_get_contents("db-schema/schema.sql");		
	$result = $conn->multi_query($createSchemaQuery);
	if($result === false) {
		die("Creation of tables failed");
		return false;
	}
	return true;
}
if(!tablesExist()) {
	message("Creating Tables ....");
	createTables();
}
message("Tables Exist....");

function atLeastOneDeptExists() {
	$conn = dbConnect();
	$deptQuery = "SELECT * from dept";
	$result = sqlGetAllRows($deptQuery);
	if(count($result) < 1)
		return false;
	return true;	
}
function showDeptForm() {
	global $msgStr;
	$deptFormHTML = file_get_contents("html/deptForm.html");	
	$deptFormHTML = str_replace("Messages", $msgStr, $deptFormHTML);
	echo $deptFormHTML;
	die;
}
function createDept() {
	$deptName = $_POST['deptName'];
	$deptShortName = $_POST['deptShortName'];
	$insertQuery = "INSERT INTO dept (deptName, deptShortName) VALUES (".
			 "'$deptName', '$deptShortName')";
	$conn = dbConnect();
	$result = $conn->query($insertQuery);
	if($result === false) {
		die("Insert into table dept Failed. Query: $insertQuery");
		return false;	
	}
	return true;
}
/* the check for POST should be before the check for atLeastOneDeptExists */
if(isset($_POST['createDept'])) {
	require_once('db.php');
	if(!atLeastOneDeptExists()) 
		createDept();
}
function atLeastOneUserExists() {
	$conn = dbConnect();
	$query = "SELECT * from user";
	$result = sqlGetAllRows($query);
	if(count($result) < 1)
		return false;
	return true;	
}
if(!atLeastOneDeptExists()) {
	showDeptForm();
}
message("Department Exists...");

function showUserForm() {
	global $msgStr;
	$userFormHTML = file_get_contents("html/userForm.html");
	$userFormHTML = str_replace("Messages", $msgStr, $userFormHTML);
	echo $userFormHTML;
	die;
}
function createUser() {
	$userName = $_POST['userName'];
	$password = $_POST['password'];
	$insertQuery = "INSERT INTO user (userName, password) VALUES (".
			 "'$userName', '$password')";
	$conn = dbConnect();
	$result = $conn->query($insertQuery);
	if($result === false) {
		die("Insert into table dept Failed $insertQuery");
		return false;	
	}
	header("Location: timetable.php");
	return true;

}

if(isset($_POST['createUser'])) {
	require_once('db.php');
	if(!atLeastOneUserExists()) 
		createUser();
}

if(!atLeastOneUserExists()) {
	showUserForm();
}

message("Installation Complete ... Redirecting to timetable.php");
sleep(2);
header("Location: timetable.php");

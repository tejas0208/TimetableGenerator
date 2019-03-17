<?php
// This file is part of Taasika - a timetabling software for
// schools, colleges/universities.
//
// Taasika is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Taasika is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Taasika.  If not, see <http://www.gnu.org/licenses/>.

/**
 *
 * Copyright 2017 Abhijit A. M.(abhijit13@gmail.com)
 */
function checkRequirements(){
	$result=true;
	$requirements=["mysqlnd","gd","zip","xml","mbstring"];
	$message=["Need php5-mysqlnd installed.  <br> ".
	"On Ubuntu try running \"sudo apt-get install php5-mysqlnd\"<br>",
	"Need php-gd installed for exporting as excel. <br> ".
	"On Ubuntu try running \"sudo apt-get install php-gd\"<br>",
	"Need php-zip installed for exporting as zip. <br> ".
	"On Ubuntu try running \"sudo apt-get install php-zip\"<br>",
	"Need php-xml installed for exporting as excel. <br> ".
	"On Ubuntu try running \"sudo apt-get install php-xml\"",
	"Need php-mbstring installed for exporting as excel. <br> ".
	"On Ubuntu try running \"sudo apt-get install php-mbstring\"<br>"
	];
	for($i=0;$i<count($requirements);$i++){
		if(!extension_loaded($requirements[$i])){
			echo $message[$i];
			$result=false;
		}
	}
	if (version_compare(phpversion(), '7.0') < 0){$phpversion = PHP_VERSION;
		$message[$i]="Need php version at least 7.0. Current version is $phpversion.<br/>";
		echo $message[$i];
		$result=false;
	}
	return $result;
}
function configFileExists() {
	$configfile = '../config.php';
	if (file_exists($configfile)) {
		return true;
	} else {
		return false;
	}
	return;
}
function showConfigFileForm() {
	$configFileHTML = file_get_contents("../html/configFileForm.html");
	echo $configFileHTML;
}
function createConfigFile() {
	$dbname = $_POST['dbname'];
	$dbuser = $_POST['dbuser'];
	$dbpass = $_POST['dbpass'];
	$dbport = $_POST['dbport'];
	$dbtype = $_POST['dbtype'];
	$dbhost = $_POST['dbhost'];
	$text = "&lt;?php <br>
		unset(\$CFG);<br>
		global \$CFG;<br>
		\$CFG = new stdClass();<br>
		\$CFG->db_type = \"$dbtype\";<br>
		\$CFG->db_user = \"$dbuser\";<br>
		\$CFG->db_pass = \"$dbpass\";<br>
		\$CFG->db_database = \"$dbname\";<br>
		\$CFG->server = \"$dbhost\";<br>
		\$CFG->port = \"$dbport\";<br>
		\$CFG->conn = false;<br>
		\$CFG->logfile = false;<br>
		\$CFG->logfileName = false;<br>
		?>";
	$res=checkConnection($dbhost,$dbuser,$dbpass);
	if($res){
		$conn=new mysqli($dbhost,$dbuser,$dbpass);
		$query="create database if not exists ".$dbname.";";
		$result=$conn->query($query);
		if($result){
			echo $text;
		}
	}else{
		echo $result;
	}
	return;
}
function checkConnection($dbhost,$dbuser,$dbpass){
	$conn=new mysqli($dbhost,$dbuser,$dbpass);
	if ($conn->connect_error) {
		$result=$conn->connect_error;
		return $result;
	}
	return true;
}
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
	$query="use ".$dbname;
	$conn->query($query);
	$createSchemaQuery = file_get_contents("../db-schema/schema.sql");
	$result = $conn->multi_query($createSchemaQuery);
	if($result === false) {
		die("Creation of tables failed");
		return false;
	}
	return true;
}
function atLeastOneDeptExists() {
	$conn = dbConnect();
	$deptQuery = "SELECT * from dept";
	$result = sqlGetAllRows($deptQuery);
	if($result==false){
		return false;
	}
	if(count($result) < 1){
		return false;
	}
	return true;
}
function showDeptForm() {
	$deptFormHTML = file_get_contents("../html/deptForm.html");
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
		return "false";
	}
	echo true;
	return;
}
function showUserForm() {
	$userFormHTML = file_get_contents("../html/userForm.html");
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
	return;
}
function atLeastOneUserExists() {
	$conn = dbConnect();
	$query = "SELECT * from user";
	$result = sqlGetAllRows($query);
	if(count($result) < 1){
		return false;
	}
	return true;
}
function atLeastOneConfigExists() {
	$conn = dbConnect();
	$query = "SELECT * from config";
	$result = sqlGetAllRows($query);
	if(count($result) < 1){
		return false;
	}
	return true;
}
function showDefaultConfigForm() {
	$defaultConfigFormHTML = file_get_contents("../html/defaultConfigForm.html");
	echo $defaultConfigFormHTML;
	die;
}
function configInsert(){
	$configName = getArgument("configName");
	$dayBegin = getArgument("dayBegin");
	$slotDuration = getArgument("slotDuration");
	$nSlots = getArgument("nSlots");
	$deptId = getArgument("deptId");
	$incharge = getArgument("incharge");
	$insertQuery = "INSERT INTO config (configName, dayBegin, slotDuration, nSlots,deptId,incharge) "."VALUES (\"$configName\", \"$dayBegin\", $slotDuration, $nSlots,$deptId,$incharge)";
	$conn = dbConnect();
	$result = $conn->query($insertQuery);
	if($result === false) {
		die("Insert into table config Failed. Query: $insertQuery");
		return "false";
	}
	echo true;
	return;
}
function getTable() {
	header("Content-Type: application/JSON");
	$tableName = getArgument("tableName");
	$query = "SELECT * FROM $tableName ";
	$outp = sqlGetAllRows($query);
	$tables[$tableName] = $outp;
	echo json_encode($tables);
	return;
}
?>

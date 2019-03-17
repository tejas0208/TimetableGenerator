<?php
require_once("install_function.php");
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

if(isset($_POST['reqType']) && $_POST['reqType'] == "checkInstallation") {
	$resultFail = "{\"Success\": \"False\"}";
	if(!configFileExists()) {
		echo $resultFail;
		return;
	}
	require_once('../db.php');
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
	if(!atLeastOneConfigExists()) {
		echo $resultFail;
		return;
	}
	echo "{\"Success\": \"True\"}";
	return;
}

if(isset($_POST["checkRequirements"])){
	if(checkRequirements()){
		echo true;
	}
	return;
}

if(isset($_POST["setUpDatabase"])) {
	if(!configFileExists()){
		showConfigFileForm();
	}else{
		echo true;
	}
	return;
}


if(isset($_POST['createConfig'])) {
	createConfigFile();
	return;
}

if(isset($_POST["checkConfig"])){
	if(configFileExists()){
		echo true;
	}else{
		echo false;
	}
	return;
}


require_once('../db.php');
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
if(!tablesExist()) {
	createTables();
}


// the check for POST should be before the check for atLeastOneDeptExists
if(isset($_POST['createDept'])) {
	require_once('../db.php');
	if(atLeastOneDeptExists()==false){
		createDept();
	}
	return;
}
if(isset($_POST['departmentConfig'])){
	if(atLeastOneDeptExists()==false) {
		showDeptForm();
	}else{
		echo false;
	}
	return;
}


if(isset($_POST['createUser'])) {
	require_once('../db.php');
	if(atLeastOneUserExists()==false){
		createUser();
	}
	return;
}
if(isset($_POST['userConfig'])) {
	if(atLeastOneUserExists()==false) {
		showUserForm();
	}else{
		echo true;
	}
	return;
}
if(isset($_POST['defaultConfig'])){
	if(atLeastOneConfigExists()==false){
		showDefaultConfigForm();
	}else{
		echo true;
	}
}
if(isset($_POST['configInsert'])){
	configInsert();
}
if(isset($_POST['getTable'])){
	getTable();
	return;
}
?>


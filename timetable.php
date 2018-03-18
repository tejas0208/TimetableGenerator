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
 * Taasika frontpage.
 *
 * Copyright 2017 Abhijit A. M.(abhijit13@gmail.com)
 */


if(!file_exists('db.php'))
	header("Location: install.php");
if(!file_exists('config.php'))
	header("Location: install.php");
require_once('db.php');
require_once('common.php');
require_once('snapshot.php');
require_once('forms.php');
require_once('export.php');
require_once('exportsql.php');
require_once('exportpdf.php');
require_once('upgrade.php');
function getTimetable() {
	header("Content-Type: application/JSON; charset=UTF-8");
	$snapshotName = getArgument("snapshotName");
	if($snapshotName == "")
			$snapshotName = "default";
	
	$query = "SELECT * FROM timeTable where snapshotId = (SELECT snapshotId 
				from snapshot where snapshotName = $snapshotName)"; 
	ttlog("getTimetable: Query: ". $query);
	$outp = sqlGetAllRows($query);
	$tables["timeTable"] = $outp;
	return json_encode($tables);
}

$header = file_get_contents("html/header.html");
$bodystart="
	</head>
	<body>
";
$table= file_get_contents("html/menuoptions.html");
$footer = "</body> </html>";

generateInputForms();
global $formsHTML;
$page = $header.
		$bodystart. 
		$formsHTML.
		$table.
		$waitMessage.
		$checkMessage.
		$footer;

$reqType = getArgument("reqType");
switch($reqType) {
	case "insertSnapshotEntry":
	case "getDataTables":
	case "getTimetable":
	case "saveSnapshot":
	case "saveNewSnapshot":
	case "getOneTable":
	case "teacherUpdate": case "teacherDelete": case "teacherInsert":
	case "subjectUpdate": case "subjectDelete": case "subjectInsert":
	case "classUpdate": case "classDelete": case "classInsert":
	case "batchUpdate": case "batchDelete": case "batchInsert":
	case "batchClassUpdate":
	case "sctDelete": case "sctInsert": case "sctUpdate":
	case "sbtDelete": case "sbtInsert": case "sbtUpdate":
	case "roomDelete": case "roomInsert": case "roomUpdate":
	case "batchCanOverlapDelete": case "batchCanOverlapInsert":
	case "classRoomDelete": case "classRoomInsert": case "classRoomUpdate":
	case "batchRoomDelete": case "batchRoomInsert": case "batchRoomUpdate":
	case "subjectRoomDelete": case "subjectRoomInsert": case "subjectRoomUpdate":
	case "overlappingSBTDelete": case "overlappingSBTInsert": case "overlappingSBTUpdate":
	case "configDelete": case "configInsert": case "configUpdate": case "snapshotDelete":
	case "exportSQL":
		/* call the function which has same name as reqType */
		echo $reqType();
		break;
	case "exportConfigXLSX":
		$filename = exportConfigXLSX();
		header("Cache-Control: public");
		header("Content-Description: File Transfer");
		header("Content-disposition: attachment");
		header("filename:". $filename);	
		header('Content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header("Content-Transfer-Encoding: binary");
		readfile($filename);
		break;
	case "exportXLSX":
		$filename = exportXLSX();
		header("Cache-Control: public");
		header("Content-Description: File Transfer");
		header("Content-disposition: attachment");
		header("filename:". $filename);	
		header('Content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header("Content-Transfer-Encoding: binary");
		ob_clean();
		flush();
		readfile($filename);
		break;
	case "exportCurrentXLSX":
		$filename = exportCurrentXLSX();
		header("Cache-Control: public");
		header("Content-Description: File Transfer");
		header("Content-disposition: attachment");
		header("filename:". $filename);
		header('Content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header("Content-Transfer-Encoding: binary");
		ob_clean();
		flush();
		readfile($filename);
		break;
	case "exportWorkloadXLSX":
		$filename = exportWorkloadXLSX();
		header("Cache-Control: public");
		header("Content-Description: File Transfer");
		header("Content-disposition: attachment");
		header("filename:". $filename);
		header('Content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header("Content-Transfer-Encoding: binary");
		ob_clean();
		flush();
		readfile($filename);
		break;
	case "exportCSV":
		$filename = exportCSV();
		header("Cache-Control: public");
		header("Content-Description: File Transfer");
		header("Content-disposition: attachment");
		header("filename:". $filename);	
		header('Content-type: application/zip');
		header("Content-Transfer-Encoding: binary");
		ob_clean();
		flush();
		readfile($filename);
		break;
	case "exportPDF":
		$filename = exportPDF();
		header("Cache-Control: public");
		header("Content-Description: File Transfer");
		header("Content-disposition: attachment");
		header("filename:". $filename);	
		header('Content-type: application/zip');
		header("Content-Transfer-Encoding: binary");
		ob_clean();
		flush();
		readfile($filename);
		break;
	default:
		echo $page;
		break;
}

<?php
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

function getTimeTable() {
	header("Content-Type: application/JSON; charset=UTF-8");
	$snapshotName = getArgument("snapshotName");
	if($snapshotName == "")
			$snapshotName = "default";
	
	$query = "SELECT * FROM timeTable where snapshotId = (SELECT snapshotId 
				from snapshot where snapshotName = $snapshotName)"; 
	ttlog("getTimeTable: Query: ". $query);
	$outp = sqlGetAllRows($query);
	$tables["timeTable"] = $outp;
	//ttlog("getTimeTable: returning table: ".json_encode($tables));
	return json_encode($tables);
}

$header = file_get_contents("header.html");
$bodystart="
	</head>
	<body>
";
$table= file_get_contents("./menuoptions.html");
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
		echo insertSnapshotEntry();
		break;
	case "getDataTables":
		echo getDataTables();
		break;
	case "getTimetable":
		$snapname = getArgument("snapname");
		echo getTimeTable();
		break;
	case "saveSnapshot":
		echo saveSnapshot();
		break;
	case "saveNewSnapshot":
		echo saveNewSnapshot();
		break;
	case "getOneTable":
		$tableName = getArgument("tableName");
		echo getOneTable($tableName);	
		break;
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
	case "configDelete": case "configInsert": case "configUpdate":
		/* call the function which has same name as reqType */
		echo $reqType();
		break;
	case "export":
		$filename = exportFile();
		header("Cache-Control: public");
		header("Content-Description: File Transfer");
		header("Content-disposition: attachment");
		header("filename:". $filename);	
		header('Content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header("Content-Transfer-Encoding: binary");
		readfile($filename);
		break;
	case "exportSQL":
		exportDatabase();
		break;
	default:
		echo $page;
		break;
}
?>

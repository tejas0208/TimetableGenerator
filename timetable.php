<?php
require_once('db.php');
require_once('common.php');
require_once('snapshot.php');
require_once('forms.php');
require_once('export.php');
/*require_once('configForm.php');
require_once('teacher.php');
require_once('subject.php');
require_once('class.php');
require_once('batch.php');
require_once('room.php');
require_once('classRoom.php');
require_once('batchRoom.php');
require_once('subjectRoom.php');
require_once('sct.php');
require_once('sbt.php');
require_once('overlappingSBT.php');*/

function getTimeTable() {
	header("Content-Type: application/JSON; charset=UTF-8");
	$snapshotName = getArgument("snapshotName");
	if($snapshotName == "")
			$snapshotName = "default";
	
	$query = "SELECT * FROM timeTable where snapshotId = (SELECT snapshotId 
				from snapshot where snapshotName = $snapshotName)"; 
	error_log("getTimeTable: Query: ". $query);
	$outp = sqlGetAllRows($query);
	$tables["timeTable"] = $outp;
	error_log("getTimeTable: returning table: ".json_encode($tables));
	return json_encode($tables);
}

$header = file_get_contents("header.html");
$bodystart="
	</head>
	<body>
";
$table= file_get_contents("./menuoptions.html");
$footer = "</body> </html>";

$page = $header.
		$bodystart. 
		$allForms.
		$table.
		$footer;

$reqType = getArgument("reqType");
error_log("reqType = ".$reqType, 0);
switch($reqType) {
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
	case "teacherUpdate":
		echo updateTeacher("update");
		break;
	case "teacherDelete":
		echo updateTeacher("delete");
		break;
	case "teacherInsert":
		echo updateTeacher("insert");
		break;
	case "subjectUpdate":
		echo updateSubject("update");
		break;
	case "subjectDelete":
		echo updateSubject("delete");
		break;
	case "subjectInsert":
		echo updateSubject("insert");
		break;
	case "classUpdate":
		echo updateClass("update");
		break;
	case "classDelete":
		echo updateClass("delete");
		break;
	case "classInsert":
		echo updateClass("insert");
		break;
	case "batchUpdate":
		echo updateBatch("update");
		break;
	case "batchDelete":
		echo updateBatch("delete");
		break;
	case "batchInsert":
		echo updateBatch("insert");
		break;
	case "batchClassUpdate":
		echo updateBatchClass("");
		break;
	case "sctDelete":
		echo updateSCT("delete");
		break;
	case "sctInsert":
		echo updateSCT("insert");
		break;
	case "sctUpdate":
		echo updateSCT("update");
		break;
	case "sbtDelete":
		echo updateSBT("delete");
		break;
	case "sbtInsert":
		echo updateSBT("insert");
		break;
	case "sbtUpdate":
		echo updateSBT("update");
		break;
	case "roomDelete":
		echo updateRoom("delete");
		break;
	case "roomInsert":
		echo updateRoom("insert");
		break;
	case "roomUpdate":
		echo updateRoom("update");
		break;
	case "batchCanOverlapDelete":
		echo batchCanOverlapDelete("");
		break;
	case "batchCanOverlapInsert":
		echo batchCanOverlapInsert("");
		break;
	case "classRoomDelete":
		echo updateClassRoom("delete");
		break;
	case "classRoomInsert":
		echo updateClassRoom("insert");
		break;
	case "classRoomUpdate":
		echo updateClassRoom("update");
		break;
	case "batchRoomDelete":
		echo updateBatchRoom("delete");
		break;
	case "batchRoomInsert":
		echo updateBatchRoom("insert");
		break;
	case "batchRoomUpdate":
		echo updateBatchRoom("update");
		break;
	case "subjectRoomDelete":
		echo updateSubjectRoom("delete");
		break;
	case "subjectRoomInsert":
		echo updateSubjectRoom("insert");
		break;
	case "subjectRoomUpdate":
		echo updateSubjectRoom("update");
		break;
	case "overlappingSBTDelete":
		echo updateOverlappingSBT("delete");
		break;
	case "overlappingSBTInsert":
		echo updateOverlappingSBT("insert");
		break;
	case "overlappingSBTUpdate":
		echo updateOverlappingSBT("update");
		break;
	case "configDelete":
		echo updateConfig("delete");
		break;
	case "configInsert":
		echo updateConfig("insert");
		break;
	case "configUpdate":
		echo updateConfig("update");
		break;
	case "export":
		//error_log("Exporting file ", 0);
		$filename = exportFile();
		header("Cache-Control: public");
		header("Content-Description: File Transfer");
		//header("Content-disposition: attachment; filename='$filename'");	
		header("Content-disposition: attachment");
		header("filename:". $filename);	
		header('Content-type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header("Content-Transfer-Encoding: binary");
		readfile($filename);
		//error_log("Exported file $filename", 0);
		break;
	default:
		echo $page;
		break;
}
?>

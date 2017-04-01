<?php
require_once('db.php');
require_once('common.php');
require_once('teacher.php');
require_once('subject.php');
require_once('class.php');
require_once('batch.php');
require_once('room.php');
require_once('classRoom.php');
require_once('batchRoom.php');
require_once('subjectRoom.php');
require_once('snapshot.php');
require_once('sct.php');
require_once('sbt.php');

function getTimeTable() {
	header("Content-Type: application/json; charset=UTF-8");
	$snapshotName = getArgument("snapshotName");
	if($snapshotName == "")
			$snapshotName = "default";
	
	$query = "SELECT * FROM timeTable where snapshotId = (SELECT snapshotId 
				from snapshot where snapshotName = $snapshotName)"; 
	$outp = sqlGetAllRows($query);
	$tables["timeTable"] = $outp;
	//error_log("getTimeTable: returning table: ".json_encode($tables));
	return json_encode($tables);
}

$header = "
<html>
	<head>
		<title> TimeTable </title>
		<meta charset=\"utf-8\" /> 
		<link href=\"./select2-4.0.3/dist/css/select2.min.css\" rel=\"stylesheet\"/>
		<link rel=\"stylesheet\" type=\"text/css\" href=\"timetable.css\"/>
		<script type=\"text/javascript\" src=\"./jquery.js\"></script>
		<script src=\"./select2-4.0.3/dist/js/select2.min.js\"></script>
		<script src = \"timetable.js\"></script>
		<script src = \"teacherForm.js\"></script>
		<script src = \"subjectForm.js\"></script>
		<script src = \"classForm.js\"></script>
		<script src = \"batchForm.js\"></script>
		<script src = \"roomForm.js\"></script>
		<script src = \"classRoomForm.js\"></script>
		<script src = \"batchRoomForm.js\"></script>
		<script src = \"subjectRoomForm.js\"></script>
		<script src = \"sctForm.js\"></script>
		<script src = \"sbtForm.js\"></script>
		<script>
			function deptForm() {
				alert(\"Departments not supported yet\");
			}
			function userForm() {
				alert(\"Users not supported yet\");
			}
		</script>
";
$bodystart="
	</head>
	<body>
";
$table= "
	<table border = \"0\" padding = \"0\" style = \"width:100%;\" id=\"outerTable\">
		<tr> <td style = \"height:100px;\">
			<table border = \"0\" padding = \"0\" style = \"height:100px; width:100%;\" id=\"menuTable\">
			<tr> <td style = \"width:50%;\">
				 <h1> COEP Timetable </h1>
				</td>
				<td style = \"width:50%;\">   
					<!--h1> Scope for Menus Here </h1>
					<div class = \"selection-menu\">
						Select Snapshot<br>
						<select id = \"fetch-snapshot-menu\" class= \"select-menu\">
							<option value = \"\" selected></option>
						</select>
					</div>
					<div class=\"selection-menu\"> 
						<input type=button id=\"saveSnapshot\" value=\"Save Snapshot\"
							onclick=\"jsSaveSnapshot()\" >   <br>
						<input type=button id=\"saveNewSnapshot\" value=\"Save New Snapshot\" 
									onclick=\"jsSaveNewSnapshot()\" > 
					</div-->
					<div class=\"selection-menu\">
						Configuration	
						<select id=\"insert-data-menu\" class=\"select-menu\">
							<option value = \"\" selected> </option>
							<option value = \"Teacher\" onclick=\"teacherForm()\">Teachers</option>
							<option value = \"Subjects\" onclick=\"subjectForm()\">Subjects</option>
							<option value = \"Classes\" onclick=\"classForm()\">Classes</option>
							<option value = \"Batchs\" onclick=\"batchForm()\">Batches</option>
							<option value = \"Rooms\" onclick=\"roomForm()\">Rooms</option>
							<option value = \"Dept\" onclick=\"deptForm()\">Depts</option>
							<option value = \"Subject-Class Mapping\" onclick=\"sctForm()\"> Class-Subject-Teacher Mapping</option>
							<option value = \"Subject-Batch Mapping\" onclick=\"sbtForm()\"> Batch-Subject-Teacher Mapping</option>
							<option value = \"Add Batch-Overlap\" onclick=\"batchCanOverlapForm()\"> Batches: Alloweed Overlaps</option>
							<option value = \"Class-Room Mapping\" onclick=\"classRoomForm()\"> Room Preference for Classes</option>
							<option value = \"Batch-Room Mapping\" onclick=\"batchRoomForm()\"> Room Preference for Batches</option>
							<option value = \"Subject-Room Mapping\" onclick=\"subjectRoomForm()\"> Room Preference for Subjects</option>
							<option value = \"Configure TT\" onclick=\"configForm()\"> Configure Timetable</option>
							<option value = \"Users\" onclick=\"userForm()\">Users</option>
						</select>
					</div>
					<div class=\"selection-menu\">
					Warnings
					</div>
					</td>	
			</tr>
			</table>
			</td>
		</tr>
		<tr id = \"selection-menu\">
		<td >
			<!--div class = \"selection-menu\">
				See Subjectwise<br>
				<select id = \"subject-menu\" class= \"select-menu\">
					<option value = \"EMPTY\"> </option>
					</select>
			</div-->
			<div class = \"selection-menu\">
				See Classwise<br>
				<select id = \"class-menu\" class= \"select-menu\">
					<option value = \"EMPTY\"> </option>
				</select>
			</div>
			<div class = \"selection-menu\">
				See Roomwise<br>
					<select id = \"room-menu\" class= \"select-menu\">
					<option value = \"EMPTY\"> </option>
				</select> 
			</div>
			<div class = \"selection-menu\">
				See Teacherwise<br>
				<select id = \"teacher-menu\" class= \"select-menu\">
						<option value = \"EMPTY\" selected> </option>
				</select>
			</div>
			<div class = \"selection-menu\">
				See Batchwise<br>
					<select id = \"batch-menu\" class= \"select-menu\">
					<option value = \"EMPTY\"> </option>
				</select>
			</div>
			<div> 
			</div>
			<div class = \"selection-menu\">
				Select Snapshot<br>
				<select id = \"fetch-snapshot-menu\" class= \"select-menu\">
					<option value = \"\" selected></option>
				</select>
			</div>
			<div class=\"selection-menu\"> 
				<input type=button id=\"saveSnapshot\" value=\"Save Snapshot\"
					onclick=\"jsSaveSnapshot()\" >   <br>
				<input type=button id=\"saveNewSnapshot\" value=\"Save New Snapshot\" 
							onclick=\"jsSaveNewSnapshot()\" > 
			</div>
			<div class = \"selection-menu\">
				<form action=\"export.php\" method=\"POST\">
				Export <br>
				<select name=\"type\" class= \"select-menu\" onchange=\"this.form.submit()\">
					<option value = \"\" selected></option>
					<option value = \"ODS\">Timetable as ODS</option>
					<option value = \"Excel\">Timetable as Excel </option>
					<option value = \"Excelx\">Timetable as Excelx</option>
					<option value = \"DODS\">Configuration as ODS</option>
					<option value = \"DExcel\">Configuration as Excel </option>
					<option value = \"DExcelx\">Configuration as Excelx</option>
				</select>
				</form>
			</div>
			<div class = \"selection-menu\">
				<form action=\"import.php\" method=\"POST\">
				Import <br>
				<select name=\"type\" class= \"select-menu\" onchange=\"this.form.submit()\">
					<option value = \"\" selected></option>
					<option value = \"ODS\">Timetable as ODS</option>
					<option value = \"Excel\">Timetable as Excel </option>
					<option value = \"Excelx\">Timetable as Excelx</option>
					<option value = \"DODS\">Configuration as ODS</option>
					<option value = \"DExcel\">Configuration as Excel </option>
					<option value = \"DExcelx\">Configuration as Excelx</option>
				</select>
				</form>
			</div>


		</td>
		</tr>
		<tr > <td id = \"mainTimeTable\"> </td>
	</tr>
</table>"
;
$footer = "</body> </html>";

$page = $header.
		$bodystart.
		$teacherForm.  $subjectForm.  $classForm. 
		$batchForm. $batchRoomForm. $batchCanOverlapForm.
		$roomForm. $classRoomForm. $batchRoomForm. $subjectRoomForm.
		$sctForm. $sbtForm.
		$table.
		$footer;

$reqType = getArgument("reqType");
switch($reqType) {
	case "getAllData":
		echo getAllData();
		return;
		break;
	case "getTimetable":
		$snapname = getArgument("snapname");
		echo getTimeTable();
		return;
		break;
	case "saveSnapshot":
		return saveSnapshot();
		break;
	case "saveNewSnapshot":
		return saveNewSnapshot();
		break;
	case "getOneTable":
		$tableName = getArgument("tableName");
		echo getOneTable($tableName);	
		return;
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
	default:
		echo $page;
		break;
}
?>

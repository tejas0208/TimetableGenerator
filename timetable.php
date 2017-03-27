<?php
require_once('db.php');
require_once('common.php');
require_once('teacher.php');
require_once('snapshot.php');

function getTimeTable() {
	header("Content-Type: application/json; charset=UTF-8");
	$snapshotName = getArgument("snapshotName");
	if($snapshotName == "")
			$snapshotName = "default";
	
	$query = "SELECT * FROM timeTable where snapshotId = (SELECT snapshotId 
				from snapshot where snapshotName = $snapshotName)"; 
	$outp = sqlGetAllRows($query);
	$tables["timeTable"] = $outp;
	return json_encode($tables);
}

$header = "
<html>
	<head>
		<title> TimeTable </title>
		<meta charset=\"utf-8\" /> 
		<script type=\"text/javascript\" src=\"./jquery.js\"></script>
		<script src = \"timetable.js\"></script>
		<link rel=\"stylesheet\" type=\"text/css\" href=\"timetable.css\"/>
";
$bodystart="
	</head>
	<body>
";
$table= "
	<table border = \"0\" padding = \"0\" style = \"width:100%;\">
		<tr> <td style = \"height:100px;\">
			<table border = \"0\" padding = \"0\" style = \"height:100px; width:100%;\">
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
						Settings
						<select id=\"insert-data-menu\" class=\"select-menu\">
							<option value = \"\" selected> </option>
							<option value = \"Teacher\" onclick=\"teacherForm()\">Teacher</option>
							<option value = \"Add Class\" onclick=\"addNewClass()\">Add Class</option>
							<option value = \"Add Subject\" onclick=\"addNewSubject()\">Add Subject</option>
							<option value = \"Add Batch\" onclick=\"addNewBatch()\">Add Batch</option>
							<option value = \"Add Dept\" onclick=\"addNewDept()\">Add Dept</option>
							<option value = \"Add Room\" onclick=\"addNewRoom()\">Add Room</option>
							<option value = \"Subject-Class Mapping\" onclick=\"addNewSCT()\">
									Subject-Class Mapping</option>
							<option value = \"Subject-Batch Mapping\" onclick=\"addNewSBT()\">
									Subject-Batch Mapping</option>
							<option value = \"Add Batch-Overlap\" onclick=\"addNewBatchCanOverlap()\">
										Batch Overlap Mapping</option>
							<option value = \"Add Config\" onclick=\"addNewConfig()\">Add Config</option>
							<option value = \"Add User\" onclick=\"addNewUser()\">Add User</option>
							<option value = \"Add Class-Room\" onclick=\"addNewClassRoom()\">Add Class-Room</option>
							<option value = \"Add Batch-Room\" onclick=\"addNewBatchRoom()\">Add Batch-Room</option>
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
					<option value = \"DODS\">Data as ODS</option>
					<option value = \"DExcel\">Data as Excel </option>
					<option value = \"DExcelx\">Data as Excelx</option>
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
					<option value = \"DODS\">Data as ODS</option>
					<option value = \"DExcel\">Data as Excel </option>
					<option value = \"DExcelx\">Data as Excelx</option>
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
		$teacherForm.
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
	default:
		echo $page;
		break;
}
?>

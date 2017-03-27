<?php
require_once('db.php');
require_once('common.php');

function getAllData() {
	header("Content-Type: application/json; charset=UTF-8");
	/* List of tables to be returned */	
	$tableNames = array("teacher", "class", "batch", 
						"batchCanOverlap", "dept", "room", "config", 
						"subject", "batchClass", "subjectBatchTeacher", 
						"subjectClassTeacher", "snapshot");
	$length = count($tableNames);
	
	for($i = 0; $i < $length; $i++) {
		$query = "SELECT * FROM ".$tableNames[$i];/*TimeTable*/
		$outp = sqlGetAllRows($query);
		$tables[$tableNames[$i]] = $outp;
	}
	//error_log(json_encode($tables), 0);
	return json_encode($tables);
}
function getOneTable($tableName) {
	header("Content-Type: application/json; charset=UTF-8");
	$query = "SELECT * FROM $tableName";
	$outp = sqlGetAllRows($query);
	$tables[$tableName] = $outp;
	return json_encode($tables);
}
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

function saveSnapshot() {
	$resString = "";
	header("Content-Type: application/json: charset=UTF-8");
	$snapshotName = getArgument("snapname");
	$user = getArgument("userid");
	$ttd = getArgument("ttdata");
	$ttdata = json_decode($ttd, true);	
	$snapshotFindQuery = "SELECT snapshotId FROM snapshot WHERE snapshotName = \"$snapshotName\"";

	$result = sqlGetOneRow($snapshotFindQuery);	
	$snapshotId = $result[0]["snapshotId"];

	$snapshotDeleteQuery = "DELETE from timetable where snapshotId = $snapshotId";	
	$result = sqlUpdate($snapshotDeleteQuery);

	for($k = 0; $k < count($ttdata); $k++) {
			$currRow = $ttdata[$k];
			$classId = $currRow["classId"];
			if($currRow["isBreak"] == 1) {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, 
								teacherId, batchId, configId, snapshotId, isBreak) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								"null, null, null, ".
								//"(SELECT classId from class where classShortName=\"$className\"),".
								$classId.",".
								"null, null,".
								$snapshotId.",".
								$currRow["isBreak"].");";
			} else {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, 
								teacherId, batchId, configId, snapshotId, isBreak) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								$currRow["roomId"].",".$currRow["classId"].",".
								$currRow["subjectId"].",".$currRow["teacherId"].",".
								$currRow["batchId"].",".$currRow["configId"].",".
								$snapshotId.",".
								$currRow["isBreak"].");";
			}
			$result = sqlUpdate($ttInsertQuery);
			if($result != true ) {
					$resString .= "Failed insert on $ttInsertQuery. Error = $result->conn \n";			
			}
	}
	return $resString;
}

function saveNewSnapshot() {
	$resString = "";
	header("Content-Type: application/json: charset=UTF-8");
	$snapshotName = getArgument("snapname");
	$user = getArgument("userid");
	$ttd = getArgument("ttdata");
	$ttdata = json_decode($ttd, true);	
	$snapshotCreateQuery = "INSERT INTO snapshot (snapshotName, snapshotCreator, createTime, modifyTime) VALUES (\"".
							$snapshotName."\",1,1000,2000);";
	$result = sqlUpdate($snapshotCreateQuery);	

	for($k = 0; $k < count($ttdata); $k++) {
			$currRow = $ttdata[$k];
			$classId = $currRow["classId"];
			if($currRow["isBreak"] == 1) {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, 
								teacherId, batchId, configId, snapshotId, isBreak) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								"null, null, null, ".
								//"(SELECT classId from class where classShortName=\"$className\"),".
								$classId.",".
								"null, null,".
								"(SELECT snapshotId from snapshot where snapshotName = \"$snapshotName\"),".
								$currRow["isBreak"].");";
			} else {
				$ttInsertQuery = "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, 
								teacherId, batchId, configId, snapshotId, isBreak) VALUES (".
								$currRow["day"].",".$currRow["slotNo"].",".
								$currRow["roomId"].",".$currRow["classId"].",".
								$currRow["subjectId"].",".$currRow["teacherId"].",".
								$currRow["batchId"].",".$currRow["configId"].",".
								"(SELECT snapshotId from snapshot where snapshotName = \"$snapshotName\"),".
								$currRow["isBreak"].");";
			}
			$result = sqlUpdate($ttInsertQuery);
			if($result != true ) {
					$resString .= "Failed insert on $ttInsertQuery. Error = $result->conn \n";			
			}
	}
	return $resString;
}
function insertTeacher() {
	$resString = json_encode("result: true");
	header("Content-Type: application/json: charset=UTF-8");
	$teacherName = getArgument("teacherName");
	$teacherShortName = getArgument("teacherShortName");
	$minHrs = getArgument("minHrs");
	$maxHrs = getArgument("maxHrs");
	$deptName = getArgument("dept");
	$query = "INSERT INTO teacher (teacherName, teacherShortName, minHrs, maxHrs, deptId)".
				"VALUES (\"$teacherName\", \"$teacherShortName\", $minHrs, $maxHrs,".
				"(SELECT deptId from dept where deptShortName=\"$deptName\"))";
	$result = sqlUpdate($query);	
	error_log("insertTeacher\n".json_encode($result), 0);
	if($result != true) {
			//$resString .= json_encode({"result": "false", "query": $query, "error": $result});
	}
	return $resString;
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
							<option value = \"Add Teacher\" onclick=\"addNewTeacher()\">Add Teacher</option>
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

$teacherForm = "
<div class=\"inputForm\" id=\"inputTeacherForm\">
		<form id=\"teacherInputForm\">
		<p class=\"inputFormField\" id=\"teacherFormTitle\"> 
			Insert New Teacher Information  
			<a href=\"javascript:void(0)\" class=\"closebtn\" 
			onclick=\"teacherFormClose()\">Close Form&times;</a> 
		</p>
		<p class=\"inputFormField\" id=\"tf.teacherNameText\">
			Full Name: <br>
		</p>
			<input type=\"text\" id=\"tf.teacherName\" placeholder=\"Insert Full Name\"> 
		<p class=\"inputFormField\" id=\"tf.teacherShortNameText\">
			Short Name: <br>
		</p>
			<input type=\"text\" id=\"tf.teacherShortName\" placeholder=\"Insert Short Name\">
		<p class=\"inputFormField\" id=\"tf.minHrsText\">
			Minimum Workload: <br>
		</p>
			<input id=\"tf.minHrs\" type=\"number\" min=\"0\" max=\"30\" step=\"1\" value=\"16\">
		<p class=\"inputFormField\" id=\"tf.maxHrsText\">
			Maximum Workload: <br>
		</p>
			<input id=\"tf.maxHrs\" type=\"number\" min=\"1\" max=\"30\" step=\"1\" value=\"24\">
		<p class=\"inputFormField\" id=\"tf.deptText\">
			Department: <br>
		</p>
			<select  id=\"tf.dept\"> </select> 
		<p class=\"inputFormField\">
			<input type=\"submit\" id=\"tf.submit\" value=\"Submit\" onclick=teacherFormSubmit()> 
			<input type=\"reset\" id=\"tf.reset\">
		</p>
		</form>
</div>
";

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
	case "insertTeacher":
		echo insertTeacher();
	default:
		echo $page;
		break;
}
?>

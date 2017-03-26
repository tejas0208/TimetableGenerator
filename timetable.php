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
$header = "
<html>
	<head>
		<title> TimeTable </title>
		<meta charset=\"utf-8\" /> 
		<script type=\"text/javascript\" src=\"./jquery.js\"></script>
		<script src = \"timetable.js\"></script>
		<link rel=\"stylesheet\" type=\"text/css\" href=\"timetable.css\"/>
	</head>
	<body>
";
$table= "
		<table border = \"0\" padding = \"0\" style = \"width:100%;\">
			<tr>
				<td style = \"height:100px;\">
					<table border = \"0\" padding = \"0\" style = \"height:100px; width:100%;\">
						<tr>
							
						   	<td style = \"width:85%;\">
							<h1> COEP Timetable </h1>
							<!--img src = \"timetable-main.png\" alt= \"Time Table\" style = \"height: 100px; width : 100%;\" /-->
							</td>
							<td style = \"width:15%;\">
							<h2> Abhijit </h2>
							<!--img src = \"timetable.png\" alt= \"LOGO\" style = \"height: 100px; width : 100%;\" /-->
							</td>	
						</tr>
					</table>
				</td>
			</tr>
			<tr id = \"selection-menu\">
				<td >
					<!--div class = \"selection-menu\">
						Select Subject<br>
						<select id = \"subject-menu\" class= \"select-menu\">
							<option value = \"EMPTY\"> </option>
						</select>
					</div-->
					<div class = \"selection-menu\">
						Select Class<br>
						<select id = \"class-menu\" class= \"select-menu\">
							<option value = \"EMPTY\"> </option>
						</select>
					</div>
					<div class = \"selection-menu\">
						Select Room<br>
						<select id = \"room-menu\" class= \"select-menu\">
							<option value = \"EMPTY\"> </option>
						</select> 
					</div>
					<div class = \"selection-menu\">
						Select Teacher<br>
						<select id = \"teacher-menu\" class= \"select-menu\">
							<option value = \"EMPTY\"> </option>
						</select>
					</div>
					<div class = \"selection-menu\">
						Select Batch<br>
						<select id = \"batch-menu\" class= \"select-menu\">
							<option value = \"EMPTY\"> </option>
						</select>
					</div>
					<div class = \"selection-menu\">
						<form action=\"export.php\" method=\"POST\">
						Export <br>
						<select name=\"type\" class= \"select-menu\" onchange=\"this.form.submit()\">
							<option value = \"\" selected></option>
							<option value = \"ODS\">Timetabble as ODS</option>
							<option value = \"Excel\">Timetable as Excel </option>
							<option value = \"Excelx\">Timetable as Excelx</option>
							<option value = \"DODS\">Data as ODS</option>
							<option value = \"DExcel\">Data as Excel </option>
							<option value = \"DExcelx\">Data as Excelx</option>
						</select>
						</form>
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
				</td>
			</tr>
			<tr  >
				<td id = \"mainTimeTable\">
				</td>
			</tr>
		</table>
	";
$footer = "</body> </html>";

$page = $header.$table.$footer;

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
	default:
		echo $page;
		break;
}
?>

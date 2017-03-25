<?php
require_once('db.php');
require_once('common.php');

function getTables() {
	header("Content-Type: application/json; charset=UTF-8");

	/* List of tables to be returned */	
	$tablenames = array("timeTable", "teacher", "class", "batch", 
						"batchCanOverlap", "dept", "room", "config", 
						"subject", "batchClass", "subjectBatchTeacher", 
						"subjectClassTeacher");
	$length = count($tablenames);
	
	for($i = 0; $i < $length; $i++) {
		$query = "SELECT * FROM ".$tablenames[$i];/*TimeTable*/
		$outp = sqlGetAllRows($query);
		$tables[$tablenames[$i]] = $outp;
	}
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
						Export Data<br>
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
					<div class=\"selection-menu\"> 
						<form action=\"snapshot.php\" method=\"POST\" id=\"save-snapshot\">
						<input type=submit value=\"Save Snapshot\">  
						</form>
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

$tableRequest = getArgument("allDataRequest");
$save = getArgument("snapname");
$savemessage = "";
if($save != "" ) {
	$savemessage = "<div> Saving $save <br> </div>";
} /*else if($tableRequest === ""){
	var_dump($save);
	var_dump($tableRequest);	
	var_dump($_POST);
}  */

$page = $header.$table.$savemessage.$footer;

if($tableRequest != "") {
	echo getTables();
} else {
	echo $page;
}
?>

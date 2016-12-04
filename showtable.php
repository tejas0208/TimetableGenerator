<html> 
<head>
<title> Test PHP Page </title>
<meta charset="utf-8" /> 
<script type="text/javascript" src="./jquery.js">
</script>
<style>
.subjectentry {color:red}
.teacherentry {color:blue}
.batchentry {color:green}
.roomentry {color:cyan}
.classentry {color:magenta}
</style>

</head>

<body> 
<script>
function see_timetable(type, id) {
	window.location.replace("http://127.0.0.1/php/showtable.php?type="type"&id="id);
}
</script>
<p class="showtable"> 
<?php
	require_once('maketable.php');

	$conn = new mysqli("localhost", "root", "root", "timeTable");
	if($conn->error) {
		die("connection error ". $conn->error . "<br>"); 
	}
	$configquery = "SELECT * FROM config";	
	$ttconfig = $conn->query($configquery);
	if($conn->error or $ttconfig === FALSE) {
		die("could not fetch config" . $conn->error. $ttconfig);
	}
	$config = $ttconfig->fetch_assoc();

	/*$type = "batch"; $id = 22; // SYBT-CE-S1
	$type = "class"; $id = 2; // SYBT-CE
	$type = "room"; $id = 4; // SH */
	if($_SERVER["REQUEST_METHOD"] == "POST") {
		if (isset($_POST['class'])) {
			$type = "class";
			$id = $_POST['class'];
		} else if(isset($_POST['subject'])) {
			$type = "subject";
			$id = $_POST['subject'];
		} else if(isset($_POST['room'])) {
			$type = "room";
			$id = $_POST['room'];
		} else if(isset($_POST['teacher'])) {
			$type = "teacher";
			$id = $_POST['teacher'];
		}
	}
	else if($_SERVER["REQUEST_METHOD"] == "GET") {
		$type = $_GET['type'];
		$id = $_GET['id'];
	} else {
		$type = "class"; $id = "SYBT-CE"; //$id = 2; //Abhijit 
	}
	$tthtml = make_table($conn, $config, $type, $id);
	echo $tthtml;
	echo "</table>\n";

	?>	
</p>
</body>
</html>

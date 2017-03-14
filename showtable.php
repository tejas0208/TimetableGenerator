<?php
	require_once('config.php');
	require_once('db.php');
	require_once('common.php');
	require_once('display.php');

	global $OUTPUT;
	$conn = db_connect();
	$configquery = "SELECT * FROM config";	
	$ttconfig = $conn->query($configquery);
	if($conn->error or $ttconfig === FALSE) {
		die("could not fetch config" . $conn->error. $ttconfig);
	}
	$config = $ttconfig->fetch_assoc();

	$type = "class"; $id = "SYBT-CE"; //$id = 2; //Abhijit 
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
		} else if(isset($_POST['batch'])) {
			$type = "batch";
			$id = $_POST['batch'];
		} else {
			$type = "class"; $id = "SYBT-CE"; //$id = 2; //Abhijit 
		}
	}
	else if($_SERVER["REQUEST_METHOD"] == "GET") {
		$type = "class"; $id = "SYBT-CE"; //$id = 2; //Abhijit 
		//$type = $_GET['type'];
		//$id = $_GET['id'];
	} 
	echo $OUTPUT->default_header();
	echo $OUTPUT->default_scripts();
	$tthtml = make_table($conn, $config, $type, $id);
	echo $tthtml;
	echo $OUTPUT->default_footer();
	$conn->close();
?>	

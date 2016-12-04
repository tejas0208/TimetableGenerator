<html> 
<head>
<title> Test PHP Page </title>
<meta charset="utf-8" /> 
<style>

</style>

</head>

<body> 
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

	$qfetchsub = "SELECT subjectId, subjectName, subjectShortName FROM subject";
	$ressubjects = $conn->query($qfetchsub);
	$subjects = array();
	while($row = $ressubjects->fetch_assoc()) {
		$subjects[$row["subjectShortName"]]= $row["subjectName"];
	}

	$qfetchteacher = "SELECT teacherId, teacherName, teacherShortName, deptId FROM teacher";
	$teachers = $conn->query($qfetchteacher);	
	$qfetchroom = "SELECT roomId, roomShortName FROM room";
	$rooms = $conn->query($qfetchroom );	
	$qfetchclass = "SELECT classId, className, classShortName FROM class";
	$classes = $conn->query($qfetchclass);	

	/*$type = "batch"; $id = 22; // SYBT-CE-S1
	$type = "class"; $id = 2; // SYBT-CE
	$type = "room"; $id = 4; // SH */
	$type = "teacher"; $id = "Abhijit"; //$id = 2; //Abhijit 
	$tthtml = maketable($conn, $config, $subjects, $teachers, $rooms, $classes, $type, $id);
	echo $tthtml;
	echo "</table>\n";

	?>	
</p>
</body>
</html>
<?php
	/*$stmt = $conn->prepare("INSERT INTO timeTable (roomId, starttime, endtime, day, classId, subjectId, teacherId, batchId, configId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
	if($stmt === FALSE ) {
		die "preparation failed ". $conn->error . "<br>"; 
	} */
	//var_dump($conn);
	//echo $config["dayBegin"]. " ". $config["dayend"]. " " . $config["slotDuration"]. "<br>";
	/*foreach($config as $key => $value) {
		echo "key: $key value : $value type: ".gettype($value)."<br>";
	} */
	//var_dump($slottime);
	//$slottime += time();
		//echo "<th> $slottime ". gettype($slottime). " </th>\n";	
		//$slottime +=  $config["slotDuration"];  
?>

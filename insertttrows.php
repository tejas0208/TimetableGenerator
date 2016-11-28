<html> 
<head>
<title> Test PHP Page </title>
<meta charset="utf-8" /> 
</head>

<body> 
<p class="mysqlcode"> 
<?php
	$conn = new mysqli("localhost", "root", "root", "timetable");
	if($conn->error) {
		die("coonnection failed: " . $conn->error);
	} else {
		echo "connected <br>";
	}
	$stmt = $conn->prepare("INSERT INTO timetable (roomid, slotno, day, classid, subjectid, teacherid, batchid, configid) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
	if($stmt === FALSE ) {
		die ($conn->error);
	}
	$stmt->bind_param("iiiiiiii", $roomid, $slot, $day, $classid, $subjectid, $teacherid, $batchid, $configid);
	for($day = 1; $day <= 6; $day++) {
		for($slot = 2; $slot < 8; $slot++) {
			$roomid = 1;
			$classid = 1;
			$subjectid = 1;
			$teacherid = 1;
			$batchid = 1;
			$configid = 1;
			$stmt->execute();
		}
	}
	$stmt->close(); 
	
	
	$selquery = "SELECT * from timetable";
	$result = $conn->query($selquery);
	if($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			echo "day:  " . $row["day"]. "roomid: ". $row["roomid"] . "slot:" . $row["slotno"]. "<br>";
		}
	}
	var_dump($result);	

	$conn->close();
?>		
</p>


</body>
</html>

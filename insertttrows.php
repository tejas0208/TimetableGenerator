<html> 
<head>
<title> Test PHP Page </title>
<meta charset="utf-8" /> 
</head>

<body> 
<p class="mysqlcode"> 
<?php
	$conn = new mysqli("localhost", "root", "root", "timeTable");
	if($conn->error) {
		die("coonnection failed: " . $conn->error);
	} else {
		echo "connected <br>";
	}
	$stmt = $conn->prepare("INSERT INTO timeTable (roomId, slotNo, day, classId, subjectId, teacherId, batchId, configId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
	if($stmt === FALSE ) {
		die ($conn->error);
	}
	$stmt->bind_param("iiiiiiii", $roomId, $slot, $day, $classId, $subjectId, $teacherId, $batchId, $configId);
	for($day = 1; $day <= 6; $day++) {
		for($slot = 2; $slot < 8; $slot++) {
			$roomId = 1;
			$classId = 1;
			$subjectId = 1;
			$teacherId = 1;
			$batchId = 1;
			$configId = 1;
			$stmt->execute();
		}
	}
	$stmt->close(); 
	
	
	$selquery = "SELECT * from timeTable";
	$result = $conn->query($selquery);
	if($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			echo "day:  " . $row["day"]. "roomId: ". $row["roomId"] . "slot:" . $row["slotNo"]. "<br>";
		}
	}
	var_dump($result);	

	$conn->close();
?>		
</p>


</body>
</html>

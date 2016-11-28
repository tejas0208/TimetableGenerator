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
	$conn = new mysqli("localhost", "root", "root", "timetable");
	if($conn->error) {
		die("connection error ". $conn->error . "<br>"); 
	}
	/*$stmt = $conn->prepare("INSERT INTO timetable (roomid, starttime, endtime, day, classid, subjectid, teacherid, batchid, configid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
	if($stmt === FALSE ) {
		die "preparation failed ". $conn->error . "<br>"; 
	} */

	$configquery = "SELECT * FROM config";	
	$ttconfig = $conn->query($configquery);
	if($conn->error or $ttconfig === FALSE) {
		die("could not fetch config" . $conn->error. $ttconfig);
	}
	$conf = $ttconfig->fetch_assoc();
	//echo $conf["daybegin"]. " ". $conf["dayend"]. " " . $conf["slotduration"]. "<br>";
	echo "<table class=\"timetable\" border=\"2\">"; 
	echo "<tr> <th> Day </th>"; 
	$slottime=$conf["daybegin"];
	for($i = 0; $i < $conf["nslots"]; $i++) {
		echo "<th> $slottime </th>";	
		$slottime +=  $conf["slotduration"];
	}
	echo "</tr>"; 
	echo "</table>";
	for($i = 0; $i < $conf["nslots"]; $i++) {
		echo " $slottime <br>";	
		$slottime +=  $conf["slotduration"];
	}

	$selquery = "SELECT * from timetable";
	$result = $conn->query($selquery);
	while($row = $result->fetch_assoc()) {
		echo "day:  " . $row["day"]. "roomid: ". $row["roomid"] . "slot:" . $row["slotno"]. "<br>";
	}
?>	
</p>
</body>
</html>

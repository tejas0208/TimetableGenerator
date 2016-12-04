<html> 
<head>
<title> Test PHP Page </title>
<meta charset="utf-8" /> 
<style>
p.purehtml {
	background-color: white;
	color: red;
}
p.purephp {
	background-color: yellow;
	color: black;
}
p.mixedhtmlphp {
	background-color:  cyan;
	color: brown;
}

</style>

</head>

<body> 
<p class="mysqlcode"> 
<?php
	$table[0][0][0][0] = array(1,2,3);
	$table[0][0][0][1] = array(4,5,6);
	var_dump($table);
	$j = $table[0][0];
	var_dump($j);
?>
<?php
	$conn = new mysqli("localhost", "root", "root", "timetable");
	if($conn->error) {
		die("coonnection failed: " . $conn->error);
	} else {
		echo "connected <br>";
	}
	$sqlc = "create database testdb";
	if($conn->query($sqlc) == TRUE) {
		echo "db created <br>";
	} else 
		echo "db creation failed ". $conn->error. "<br>.";
	/*var_dump($conn); */
	foreach ($conn as $k => $v) {
		echo "$k ".":". $v ."<br>";
	}
		
	$stmt = $conn->prepare("INSERT INTO timetable (roomid, starttime, endtime, day, classid, subjectid, teacherid, batchid, configid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
	if($stmt === FALSE ) {
		die ($conn->error);
	}
	$stmt->bind_param("issiiiiii", $roomid, $starttime, $endtime, $day, $classid, $subjectid, $teacherid, $batchid, $configid);
	for($day = 1; $day <= 6; $day++) {
		for($start = 8; $start < 17; $start++) {
			$roomid = 1;
			$starttime = $start. "00";
			$endtime = ($start + 1). "00";
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
			echo "day:  " . $row["day"]. "roomid: ". $row["roomid"] . "starttime ". $row["starttime"]. "endtime ". $row["endtime"] . "<br>";
		}
	}
	var_dump($result);	

	$conn->close();
?>		
</p>

<p class="formarea" class="mixedhtmlphp"> 
<?php
	function check($data) {
		$len = strlen($data);
		if($len < 10) {
			return "len >= 10 required <br>";
		} else
			return "";
	} 
	function checkPhone($num) {
		$len = strlen($num);
		if($len < 10) {
			return "len >= 10 required <br>";
		} else
			return "";
	}
	if($_SERVER["REQUEST_METHOD"] == "POST") { 
		echo "POST METHOD NOT SUPPORTED <br>";
	} else if($_SERVER["REQUEST_METHOD"] == "GET") {
		$name = $_GET["name"];
		$nameErr = check($name);
		$phone = $_GET["phone"];
		$phoneErr = checkphone($phone);
		//echo "name = $name, phone = $phone <br>";	
	} else {
		//echo "please submit the form <br>";
	}	
?>
<form method="get" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]) ?>">
Name: <input type="text" name="name" value=<?php echo "$name"?>> <br>
<span class="err"> <?php echo "$nameErr <br>"; ?></span>
Phone: <input type="number" name="phone" value=<?php echo "$phone"?>> <br>
<span class="err"> <?php echo "$phoneErr<br>"; ?></span>
<input type = "submit">
</form>

</p>

<p class="purehtml"> 
This is pure html.
</p> 

<p class="purephp">
<?php 
	echo "This is from php <br>"
?>
</p>

<p class="mixedhtmlphp">
This is mixed html php. This line from html. 
<?php
	echo "this line is from php <br>"
?>
</p>

<p class="purephp"> 
<?php
	$x = 10234;
	var_dump($x);
	$y = "12345";
	var_dump($y);
	$z = 123.123;
	var_dump($z);
	$names = array ("Abhijit", "Ashok", "Meenakshi", 7, 10.11);
	var_dump($names);

	class testclass {
		function testclass() {
			$this->value = 100;
		}
		function testf() {
			echo "inside testclass.testf() <br>";
			return 10;
		}
	}
	$t = new testclass();
	$j = $t->testf();
	echo "j = $j <br>";
	var_dump($t);
	
	$n = null;
	var_dump($n);		
?>

</p> 

<p class="purephp"> 
	This is testing for strings. 
	<hr>
	<?php
	 echo "strlen of 'Hello world!' is "; echo strlen("Hello world!"); // outputs 12
	 echo "<br>";
	 echo "no of words in 'Hello world!' is "; echo str_word_count("Hello world!"); // outputs 2
	echo "<br>";

	define("GREETING", "Welcome to W3Schools.com!");
	echo "now printing the constant variable GREETING <br>";
	echo GREETING;		

	echo "now checking array comparison <br>";
	$x = array("a" => "red", "b" => "green");  
	$y = array("c" => "blue", "d" => "yellow");  
	$z = array("a" => "red", "b" => "green");  

	var_dump($x == $y);
	var_dump($x == $z);

	echo "loop example <br>";
	$cities = array("Mumbai", "Pune", "Nashik", "Nagpur");
	foreach ($cities as $city) {
		echo "City is : $city <br>";
	}
	echo "<br>";
	
	echo "now doing associative arrays examples, with functions <br>";
	$student = array ("name" => "Abhijit", "marks" => 100, "cgpa" => 9.8);
	var_dump($student);
	foreach ($student as $k => $v) {
		echo "key: $k, value = $v <br>";
	}
	echo "<br>";

	echo "after asorting <br>";
	asort($student);	
	foreach ($student as $k => $v) {
		echo "key: $k, value = $v <br>";
	}
	echo "<br>";

	echo "after ksorting <br>";
	ksort($student);	
	foreach ($student as $k => $v) {
		echo "key: $k, value = $v <br>";
	}
	echo "<br>";

	echo "after sorting <br>";
	sort($student);	
	foreach ($student as $k => $v) {
		echo "key: $k, value = $v <br>";
	}
	echo " This shows that calling sort() on associative array destroys it's associative nature <br>"; 

	?>

</p>


</body>
</html>

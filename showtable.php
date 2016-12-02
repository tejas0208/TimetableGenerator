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
	$daynames = array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
	function maketable($ttrows, $config, $subjects, $teachers, $rooms, $classes) {
		global $daynames;
		$table = array();
		$tablehtml = "";
		while($row = $ttrows->fetch_assoc()) {
			$table[$row["day"]][$row["slotNo"]] = array("subject" => $row["subjectShortName"],
									"room" => $row["roomShortName"],
									"class" => $row["classShortName"],
									"teacher" => $row["teacherShortName"]);
		}
		foreach($table as $dayno => $daysched) {
			$day = $daynames[$dayno];
			$tablehtml .= "\t<tr class=\"day\">\n";
			$tablehtml .= "\t\t<td class=\"dayname\"> $day </td>\n";
			foreach($daysched as $slot => $slotinfo) {
				$tablehtml .= "\t\t<td class=\"slot\">\n";
				$tablehtml .= "\t\t\t<table class=\"slottable\">\n";
				foreach($slotinfo as $key => $value) {
					switch($key) {
						case "subject":
							$tablehtml .= "\t\t\t<tr>\t\t\t\t<td>\n";
							$tablehtml .= "<select class=\"selectsubject\" id=\"a1\">\n";
							foreach($subjects as $short => $full) {
								if($short == $value) 
								$tablehtml .= "<option value=\"".$short."\" selected>".$short."</option>\n";
								else
								$tablehtml .= "<option value=\"".$short."\">".$short."</option>\n";
							}
							$tablehtml .= "</select>\t\t\t\t</td></tr>\n"; 
							//$tablehtml .= "\t\t\t\t</td>\n"; 
							break;
						case "room":
							$tablehtml .= "\t\t\t\t<tr><td>\n";
							$tablehtml .= "$value ";
							$tablehtml .= "\t\t\t\t</td></tr>\n";
							break;
						case "class":
							$tablehtml .= "\t\t\t<tr>\t\t\t\t<td>\n";
							$tablehtml .= "$value ";
							$tablehtml .= "\t\t\t\t</td></tr>\n";
							break;
						case "teacher":
							$tablehtml .= "\t\t\t\t<tr><td>\n";
							$tablehtml .= "$value ";
							$tablehtml .= "\t\t\t\t</td> </tr>\n";
							break;
						default:
							$tablehtml .= "!!Junk!!";
							break;
					}
				}
				$tablehtml .= "</td>\t\t\t</table>\n";
			}
			$tablehtml .= "\t</tr>\n";
		}
		//var_dump($tablehtml);
		return $tablehtml;
	}



	$conn = new mysqli("localhost", "root", "root", "timeTable");
	if($conn->error) {
		die("connection error ". $conn->error . "<br>"); 
	}
	/*$stmt = $conn->prepare("INSERT INTO timeTable (roomId, starttime, endtime, day, classId, subjectId, teacherId, batchId, configId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
	if($stmt === FALSE ) {
		die "preparation failed ". $conn->error . "<br>"; 
	} */
	//var_dump($conn);
	$configquery = "SELECT * FROM config";	
	$ttconfig = $conn->query($configquery);
	if($conn->error or $ttconfig === FALSE) {
		die("could not fetch config" . $conn->error. $ttconfig);
	}
	$config = $ttconfig->fetch_assoc();
	//echo $config["dayBegin"]. " ". $config["dayend"]. " " . $config["slotDuration"]. "<br>";
	echo "<table class=\"timeTable\" border=\"2\">"; 
	echo "<tr> <th> Day </th>\n"; 
	/*foreach($config as $key => $value) {
		echo "key: $key value : $value type: ".gettype($value)."<br>";
	} */
	$slottime = strtotime($config["dayBegin"]);
	//var_dump($slottime);
	//$slottime += time();
	for($i = 0; $i < $config["nSlots"]; $i++) {
		//echo "<th> $slottime ". gettype($slottime). " </th>\n";	
		//$slottime +=  $config["slotDuration"];  
		echo "<th> ". date("H i s", $slottime). "</th>\n";
		$slottime += $config["slotDuration"];
	}
	echo "</tr>\n"; 

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

	$qfetchtt = "SELECT tt.day, tt.slotNo, s.subjectShortName, r.roomShortName, c.classShortName, t.teacherShortName 
			FROM timeTable tt, teacher t, subject s, room r, class c
			WHERE  tt.roomId = r.roomId
			AND tt.classId = c.classId
			AND tt.subjectId = s.subjectId
			AND tt.teacherId = t.teacherId
			ORDER BY tt.day ASC,
			tt.slotNo ASC";
	$ttrows = $conn->query($qfetchtt);
	$tthtml = maketable($ttrows , $config, $subjects, $teachers, $rooms, $classes);
	echo $tthtml;
	echo "</table>\n";

	?>	
</p>
</body>
</html>

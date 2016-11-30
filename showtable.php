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
			$table[$row["day"]][$row["slotno"]] = array("subject" => $row["subjectshortname"],
									"room" => $row["roomname"],
									"class" => $row["classshortname"],
									"teacher" => $row["teachershortname"]);
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
							$tablehtml .= "</select>\t\t\t\t</td>\n"; 
							//$tablehtml .= "\t\t\t\t</td>\n"; 
							break;
						case "room":
							$tablehtml .= "\t\t\t\t<td>\n";
							$tablehtml .= "$value ";
							$tablehtml .= "\t\t\t\t</td></tr>\n";
							break;
						case "class":
							$tablehtml .= "\t\t\t<tr>\t\t\t\t<td>\n";
							$tablehtml .= "$value ";
							$tablehtml .= "\t\t\t\t</td>\n";
							break;
						case "teacher":
							$tablehtml .= "\t\t\t\t<td>\n";
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



	$conn = new mysqli("localhost", "root", "root", "timetable");
	if($conn->error) {
		die("connection error ". $conn->error . "<br>"); 
	}
	/*$stmt = $conn->prepare("INSERT INTO timetable (roomid, starttime, endtime, day, classid, subjectid, teacherid, batchid, configid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
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
	//echo $config["daybegin"]. " ". $config["dayend"]. " " . $config["slotduration"]. "<br>";
	echo "<table class=\"timetable\" border=\"2\">"; 
	echo "<tr> <th> Day </th>\n"; 
	$slottime=$config["daybegin"];
	for($i = 0; $i < $config["nslots"]; $i++) {
		echo "<th> $slottime ". gettype($slottime). " </th>\n";	
		$slottime +=  $config["slotduration"];  
	}
	echo "</tr>\n"; 

	$qfetchsub = "SELECT subjectid, subjectname, subjectshortname, coursecode FROM subject";
	$ressubjects = $conn->query($qfetchsub);
	$subjects = array();
	while($row = $ressubjects->fetch_assoc()) {
		$subjects[$row["subjectshortname"]]= $row["subjectname"];
	}

	$qfetchteacher = "SELECT teacherid, teachername, teachershortname, deptid FROM teacher";
	$teachers = $conn->query($qfetchteacher);	
	$qfetchroom = "SELECT roomid, roomname FROM room";
	$rooms = $conn->query($qfetchroom );	
	$qfetchclass = "SELECT classid, classname, classshortname FROM class";
	$classes = $conn->query($qfetchclass);	

	$qfetchtt = "SELECT tt.day, tt.slotno, s.subjectshortname, r.roomname, c.classshortname, t.teachershortname 
			FROM timetable tt, teacher t, subject s, room r, class c
			WHERE  tt.roomid = r.roomid
			AND tt.classid = c.classid
			AND tt.subjectid = s.subjectid
			AND tt.teacherid = t.teacherid
			ORDER BY tt.day ASC,
			tt.slotno ASC";
	$ttrows = $conn->query($qfetchtt);
	$tthtml = maketable($ttrows , $config, $subjects, $teachers, $rooms, $classes);
	echo $tthtml;
	echo "</table>\n";

	?>	
</p>
</body>
</html>

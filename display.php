<?php
$daynames = array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");

function make_query($type, $id) {
	switch($type) {
		case "teacher":
			//$condition = " AND tt.teacherId = $id";
			$condition = " AND t.teacherShortName = \"$id\"";
			break;
		case "class":
			$condition = " AND c.classShortName = \"$id\"";
			//$condition = " AND tt.classId = $id";
			break;
		case "room":
			$condition = " AND r.roomShortName= \"$id\"";
			//$condition = " AND tt.roomId = $id";
			break;
		case "subject":
			//$condition = " AND tt.subjectId = $id";
			$condition = " AND s.subjectShortName = \"$id\"";
			break;
		case "batch":
			//$condition = " AND tt.subjectId = $id";
			$condition = " AND b.batchName = \"$id\"";
			break;
		default:
			return "";	
	}
	$qfetchtt = "SELECT tt.day, tt.slotNo, s.subjectShortName, r.roomShortName, c.classShortName, b.batchName, t.teacherShortName 
			FROM timeTable2 tt, teacher t, subject s, room r, class c, batch b
			WHERE  tt.classId = c.classId 
			AND tt.teacherId = t.teacherId 
			AND tt.subjectId = s.subjectId 
			AND tt.batchId = b.batchId 
			AND tt.roomId = r.roomId" . " ". $condition . " ". 
			"ORDER BY tt.day ASC,
			tt.slotNo ASC";
	return $qfetchtt;
}
function dump_rows($allrows) {
	for($i = 0; $i < count($allrows); $i++) {
		echo "subject: ". $allrows[$i]["subjectShortName"]. "<br>";
		echo "room: ". $allrows[$i]["roomShortName"]. "<br>";
		echo "class: ". $allrows[$i]["classShortName"]. "<br>";
		echo "batch: ". $allrows[$i]["batchName"]. "<br>";
		echo "teacher: ". $allrows[$i]["teacherShortName"]. "<br>";
		echo "<br>";
	}
}
function make_header($subjects, $teachers, $rooms, $classes, $batches) {
	$header = "";
	$header .= "<table class=\"menutable\">";
	$header .= "<tr> ";
	$header .= "<td class=\"subjectentry\"> Select Subject </td> \n";
	$header .= "<td class=\"classentry\"> Select Class </td>\n ";
	$header .= "<td class=\"roomentry\"> Select Room </td> \n";
	$header .= "<td class=\"teacherentry\"> Select Teacher </td> \n";
	$header .= "<td class=\"batchentry\"> Select Batch </td> \n";
	$header .= "</tr>";

	$header .= "<tr>\n";

	$header .= "<td class=\"headercell\">\n";
	$header .= "<form method=\"post\" action=\"showtable.php\">";
	$header .= "<select class=\"selectsubject\" name=\"subject\" onchange=\"this.form.submit()\">\n";
	for($i = 0; $i < count($subjects); $i++) {
		$header .= "<option value=\"". $subjects[$i]["subjectShortName"]."\">".
			$subjects[$i]["subjectShortName"]."</option>\n";
	}
	$header .= "</select> ";
	$header .= "</form>\n";
	$header .= "</td>\n";

	$header .= "<td class=\"headercell\">\n";
	$header .= "<form method=\"post\" action=\"showtable.php\">";
	$header .= "<select class=\"selectclass\" name=\"class\" onchange=\"this.form.submit()\">\n";
	for($i = 0; $i < count($classes); $i++) {
		if($classes[$i]["classShortName"] == "NONE")
			continue;
		$header .= "<option value=\"". $classes[$i]["classShortName"]."\">".
			$classes[$i]["classShortName"]."</option>\n";
		/*$header .= "<option value=\"". $classes[$i]["classShortName"]. "\"". 
			" onclick='see_timetable(\"class\","."\"". $classes[$i]["classShortName"]."\")'>".
			$classes[$i]["classShortName"]."</option>\n";
		*/
	}
	$header .= "</select> ";
	$header .= "</form>\n";
	$header .= "</td>\n";

	$header .= "<td class=\"headercell\">\n";
	$header .= "<form method=\"post\" action=\"showtable.php\">";
	$header .= "<select class=\"selectroom\" name=\"room\" onchange=\"this.form.submit()\">\n";
	for($i = 0; $i < count($rooms); $i++) {
		$header .= "<option value=\"". $rooms[$i]["roomShortName"]."\">".
			$rooms[$i]["roomShortName"]."</option>\n";
	}
	$header .= "</select> ";
	$header .= "</form>\n";
	$header .= "</td>\n";

	$header .= "<td class=\"headercell\">\n";
	$header .= "<form method=\"post\" action=\"showtable.php\">";
	$header .= "<select class=\"selectteacher\" name=\"teacher\" onchange=\"this.form.submit()\">\n";
	for($i = 0; $i < count($teachers); $i++) {
		$header .= "<option value=\"". $teachers[$i]["teacherShortName"]."\">".
			$teachers[$i]["teacherShortName"]."</option>\n";
	}
	$header .= "</select> ";
	$header .= "</form>\n";
	$header .= "</td>\n";

	$header .= "<td class=\"headercell\">\n";
	$header .= "<form method=\"post\" action=\"showtable.php\">";
	$header .= "<select class=\"selectbatch\" name=\"batch\" onchange=\"this.form.submit()\">\n";
	for($i = 0; $i < count($batches); $i++) {
		if($batches[$i]["batchName"] == "NONE")
			continue;
		$header .= "<option value=\"". $batches[$i]["batchName"]."\">".
			$batches[$i]["batchName"]."</option>\n";
	}
	$header .= "</select> ";
	$header .= "</form>\n";
	$header .= "</td>\n";

	$header.= "</tr></table>\n";
	//$header .= "<input type=\"submit\" value=\"submit option\">";
	return $header;
}

function getOptions($conn, $id) {
	$text = "<option value =\"empty\">--SELECT SUBJECT--</option>";
	$text .= "<option value =\"lunch\">LUNCH</option>";
	$qsubjects = "SELECT subjectShortName FROM classSubjectReadable WHERE classShortName=\"$id\"";
	$subjects = $conn->query($qsubjects);
	while($subject = $subjects->fetch_assoc()) {
		$text .= "<option value = \"".$subject["subjectShortName"]."\">".$subject["subjectShortName"]."</option>";
	}
	return $text;
}

function getSubjectOptions($conn, $day, $slotNo, $value, $type, $id) {
	$text= "";
	switch($type) {
		case "class":
			$query = "SELECT subjectId FROM classSubject WHERE classId = (SELECT classId from class WHERE classShortName =\"$id\")";
			$result = $conn->query($query);
			break;
		case "subject":/*This case will not occur*/
			break;
		case "room" :
			$query = "SELECT subjectId FROM subject";/*All subjects are valid for a room*/
			$result = $conn->query($query);
			break;
		case "teacher" :
			$query = "SELECT subjectId FROM subjectTeacher where teacherId = (SELECT teacherId from teacher where teacherShortName =\"$id\")";
			$result = $conn->query($query);
			break;
		case "batch":
			$query = "SELECT subjectId FROM subjectBatch where batchId = (SELECT batchId from batch where batchShortName =\"$id\")";
			$result = $conn->query($query);
			break;
		default :
			
	}
	/*$query = "SELECT classId FROM timeTable2 WHERE day=$day AND slotNo=$slotNo AND subjectId= (SELECT subjectId FROM subject WHERE subjectShortName = \"$value\") ";
	$result = $conn->query($query);

	$row = $result->fetch_assoc();
	$classId = $row['classId'];
	$query = "SELECT subjectId FROM classSubject WHERE classId = $classId";
	$result = $conn->query($query);*/
	while($row = $result->fetch_assoc()) {
		$candidateSubjectId = $row["subjectId"];/*Candidate subject testing*/
		$query = "SELECT totalHrs FROM subject WHERE subjectId = $candidateSubjectId";
		$tempreslt = $conn->query($query);
		$temprow = $tempreslt->fetch_assoc();
		$totalHrs = $temprow['totalHrs'];
		$query = "SELECT COUNT(ttid) as count FROM timeTable2 WHERE subjectId = $candidateSubjectId";
		$tempreslt = $conn->query($query);
		$temprow = $tempreslt->fetch_assoc();
		$hoursgiven = $temprow['count'];/*Actual time already given in timetable*/
		if($hoursgiven >= $totalHrs)
				continue;/*Not eligible*//*TEST 1*/
		$query = "SELECT teacherId FROM subjectTeacher WHERE subjectId = $candidateSubjectId";
		$tempreslt = $conn->query($query);
		$temprow = $tempreslt->fetch_assoc();
		$teacherId = $temprow['teacherId'];/*Teacher for that subject*/
		$query = "SELECT day, slotNo FROM timeTable WHERE teacherId=$teacherId";
		$tempreslt = $conn->query($query);
		$temprow = $tempreslt->fetch_assoc();
		$Tday = $temprow['day'];
		$TslotNo = $temprow['slotNo'];
		if($Tday == $day && $TslotNo == $slotNo)
				continue;/*TEST 2 teacher alreay have lecture in this slot*/
		$query = "SELECT subjectShortName FROM subject WHERE subjectId = $candidateSubjectId";
		$tempreslt = $conn->query($query);
		$temprow = $tempreslt->fetch_assoc();
		$validsubj = $temprow['subjectShortName'];
		$text .= "<option value = \"$validsubj\">$validsubj</option>";
	}
	$text .= "<option value=\"$value\" selected>$value</value>";
	return $text;
}

function getRoomOptions($conn, $i, $j, $value) {
	$text = "";
	$text .= "<option value=\"$value\" selected>$value</value>";
	return $text;
}

function getClassOptions($conn, $i, $j, $value) {
	$text = "";
	$text .= "<option value=\"$value\" selected>$value</value>";
	return $text;
}

function getTeacherOptions($conn, $i, $j, $value) {
	$text = "";
	$text .= "<option value=\"$value\" selected>$value</value>";
	return $text;
}

function getBatchOptions($conn, $i, $j, $value) {
	$text = "";
	$text .= "<option value=\"$value\" selected>$value</value>";
	return $text;
}
function make_table($conn, $config, $type, $id) {
	global $daynames;
	$qfetchsub = "SELECT subjectId, subjectName, subjectShortName, totalHrs, eachSlot FROM subject";
	$ressubjects = $conn->query($qfetchsub);
	$subjects = array(); $i = 0;
	while($row = $ressubjects->fetch_assoc()) 
		$subjects[$i++] = $row;

	$qfetchteacher = "SELECT teacherId, teacherName, teacherShortName, minHrs, maxHrs, deptId FROM teacher";
	$resteachers = $conn->query($qfetchteacher);
	$teachers= array(); $i = 0;
	while($row = $resteachers->fetch_assoc()) 
		$teachers[$i++] = $row;

	$qfetchroom = "SELECT roomId, roomShortName, roomName FROM room";
	$resrooms = $conn->query($qfetchroom );	
	$rooms = array(); $i = 0;
	while($row = $resrooms->fetch_assoc()) 
		$rooms[$i++] = $row;

	$qfetchclass = "SELECT classId, className, classShortName, semester, classCount FROM class";
	$resclasses = $conn->query($qfetchclass);	
	$classes = array(); $i = 0;
	while($row = $resclasses->fetch_assoc()) 
		$classes[$i++] = $row;

	$qfetchbatch= "SELECT batchId, batchName, batchCount FROM batch";
	$resbatches = $conn->query($qfetchbatch);	
	$batches = array(); $i = 0;
	while($row = $resbatches->fetch_assoc()) 
		$batches[$i++] = $row;

	$tablehtml = "";
	$tablehtml .= make_header($subjects, $teachers, $rooms, $classes, $batches);

	$qfetchtt = make_query($type, $id);
	//var_dump($qfetchtt);
	$ttrows = $conn->query($qfetchtt);
	$table = array();
	$nslots = $config["nSlots"]; 
	$i = 0;
	while($row = $ttrows->fetch_assoc()) {
		$allrows[$i++] = $row;
	}
	for($i = 1; $i <= 6; $i++)  { // 6 days 
		for($j = 0; $j <$config["nSlots"]; $j++) {
			$table[$i][$j] = array();
		} 
	}
	//dump_rows($allrows);
	for($i = 0; $i < count($allrows); $i++) {/*Filling all slot information*/
		$rowno = $allrows[$i]["day"];
		$colno = $allrows[$i]["slotNo"];
		$count = count($table[$rowno][$colno]);
		$table[$rowno][$colno][$count] = 
			array("subject" => $allrows[$i]["subjectShortName"],
				"room" => $allrows[$i]["roomShortName"],
				"batch" => $allrows[$i]["batchName"],
				"class" => $allrows[$i]["classShortName"],
				"teacher" => $allrows[$i]["teacherShortName"]);
	}

	$tablehtml .= "<div width=100% align=center> Timetable for $type $id </div>";
	$tablehtml .=  "<table class=\"timeTable\" border=\"2\">"; 
	$tablehtml .= "<tr> <th> Day </th>\n"; 
	$slottime = strtotime($config["dayBegin"]." AM");
	for($i = 0; $i < $config["nSlots"]; $i++) {
		$tablehtml .= "<th> ". date("h ia", $slottime);
		$slottime += $config["slotDuration"];
		$tablehtml .= " to <br>".date("h ia", $slottime)."</th>\n";
	}
	for($i = 1; $i <= 6; $i++) { // 6 days 
		$tablehtml .= "<tr>\n"; 
		$day = $daynames[$i];
		$tablehtml .= "<td class=\"dayname\"> $day </td>\n";
		for($j = 0; $j < $nslots; $j++) {
			$cell = $table[$i][$j];	
					
			$count = count($cell);
			//var_dump($cell);
			$tablehtml .= "<td class=\"cell\"> <form method=post action=\"update.php\">";
			if($count == 0) {
				if($type =="class")
					$tablehtml .= "<select name=\"subject\" onchange=\"this.form.submit()\">".getSubjectOptions($conn, $i, $j, "--SELECT SUBJECT--", $type, $id)."</select>";
					$tablehtml .= "<input type=\"hidden\" name= \"column\" value=\"$i$j\"/>";
					$tablehtml .= "<input type=\"hidden\" name= \"type\" value=\"$type\"/>";
					$tablehtml .= "<input type=\"hidden\" name= \"id\" value=\"$id\"/>";
			}
			else {
				for($k = 0; $k < $count; $k++) {
					$tablehtml .= "<table class=\"slottable\"><div>\n";
					$entry = $cell[$k];
					$batchflag = 0;
					
					foreach($entry as $key => $value) {
						if($key == $type)/*Do not display what is selected*/
							continue;
						switch($key) {
							case "subject":
								$tablehtml .= "<tr><td class=\"subjectentry\">";
								$tablehtml .= "<select name=\"subject\" onchange=\"this.form.submit()\">".getSubjectOptions($conn, $i, $j, $value, $type, $id)."</select>";
								//$tablehtml .= "$value ";
								$tablehtml .= "</td></tr>\n"; 
								break;
							case "room":
								$tablehtml .= "<tr><td class=\"roomentry\">";
								$tablehtml .= "<select name=\"room\" onchange=\"this.form.submit()\">".getRoomOptions($conn, $i, $j, $value)."</select>";
								$tablehtml .= "</td></tr>\n";
								break;
							case "class":
								if($batchflag == 0) {
									$tablehtml .= "<tr><td class=\"classentry\">";
									$tablehtml .= "<select name=\"class\" onchange=\"this.form.submit()\">".getClassOptions($conn, $i, $j, $value)."</select>";
									$tablehtml .= "</td></tr>\n";
								}
								break;
							case "teacher":
								$tablehtml .= "<tr><td class=\"teacherentry\">";
								$tablehtml .= "<select name=\"teacher\" onchange=\"this.form.submit()\">".getTeacherOptions($conn, $i, $j, $value)."</select>";
								$tablehtml .= "</td> </tr>\n";
								break;
							case "batch":
								if($value != "NONE") {
									$tablehtml .= "<tr><td class=\"batchentry\">";
									$tablehtml .= "<select name=\"batch\" onchange=\"this.form.submit()\">".getBatchOptions($conn, $i, $j, $value)."</select>";
									$tablehtml .= "</td> </tr>\n";
									$batchflag = 1;
								}
								break;
							default:
								$tablehtml .= "!!Junk!!";
								break;
						}
					}
					$tablehtml .= "<input type=\"hidden\" name= \"column\" value=\"$i$j\"/>";
					$tablehtml .= "<input type=\"hidden\" name= \"type\" value=\"$type\"/>";
					$tablehtml .= "<input type=\"hidden\" name= \"id\" value=\"$id\"/>";
					$tablehtml .= "</div></table>\n";
				}
			}
			$tablehtml .= "</form></td>";
		}
		$tablehtml .= "</tr>\n"; 
	}
			/*foreach($table as $dayno => $daysched) {
				$day = $daynames[$dayno];
				$tablehtml .= "<tr class=\"day\">\n";
				$tablehtml .= "<td class=\"dayname\"> $day </td>\n";
				foreach($daysched as $slot => $slotinfo) {
					$tablehtml .= "<td class=\"slot\" draggable=\"true\">\n";
				}
			}
	//var_dump($tablehtml); */
	$tablehtml .= "</table>";
	return $tablehtml;
}

?>

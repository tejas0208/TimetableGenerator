<?php
$daynames = array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");

function makequery($type, $id) {
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
		case "batch":
			//$condition = " AND tt.batchId = $id";
			$condition = " AND b.batchName = \"$id\"";
			break;
		case "subject":
			//$condition = " AND tt.subjectId = $id";
			$condition = " AND s.subjectShortName = \"$id\"";
			break;
		default:
			return "";	
	}
	$qfetchtt = "SELECT tt.day, tt.slotNo, s.subjectShortName, r.roomShortName, c.classShortName, b.batchName, t.teacherShortName 
			FROM timeTable tt, teacher t, subject s, room r, class c, batch b
			WHERE  tt.classId = c.classId 
			AND tt.teacherId = t.teacherId 
			AND tt.subjectId = s.subjectId 
			AND tt.batchId = b.batchId 
			AND tt.roomId = r.roomId" . " ". $condition . " ". 
			"ORDER BY tt.day ASC,
			tt.slotNo ASC";
	return $qfetchtt;
}
function dumprows($allrows) {
	for($i = 0; $i < count($allrows); $i++) {
		echo "subject: ". $allrows[$i]["subjectShortName"]. "<br>";
		echo "room: ". $allrows[$i]["roomShortName"]. "<br>";
		echo "class: ". $allrows[$i]["classShortName"]. "<br>";
		echo "batch: ". $allrows[$i]["batchName"]. "<br>";
		echo "teacher: ". $allrows[$i]["teacherShortName"]. "<br>";
		echo "<br>";
	}
}
function maketable($conn, $config, $subjects, $teachers, $rooms, $classes, $type, $id) {
	global $daynames;
	$qfetchtt = makequery($type, $id);
	var_dump($qfetchtt);
	$ttrows = $conn->query($qfetchtt);
	$table = array();
	$tablehtml = "";
	$i = 0;
	while($row = $ttrows->fetch_assoc()) {
		$allrows[$i++] = $row;
	}
	//dumprows($allrows);
	for($i = 0; $i < count($allrows); $i++) {
		$table[$allrows[$i]["day"]][$allrows[$i]["slotNo"]] = array("subject" => $allrows[$i]["subjectShortName"],
								"room" => $allrows[$i]["roomShortName"],
								"class" => $allrows[$i]["classShortName"],
								"batch" => $allrows[$i]["batchName"],
								"teacher" => $allrows[$i]["teacherShortName"]);
	}

	$tablehtml .=  "<table class=\"timeTable\" border=\"2\">"; 
	$tablehtml .= "<tr> <th> Day </th>\n"; 
	$slottime = strtotime($config["dayBegin"]);
	for($i = 0; $i < $config["nSlots"]; $i++) {
		$tablehtml .= "<th> ". date("H i s", $slottime). "</th>\n";
		$slottime += $config["slotDuration"];
	}
	$tablehtml .= "</tr>\n"; 
	foreach($table as $dayno => $daysched) {
		$day = $daynames[$dayno];
		$tablehtml .= "\t<tr class=\"day\">\n";
		$tablehtml .= "\t\t<td class=\"dayname\"> $day </td>\n";
		foreach($daysched as $slot => $slotinfo) {
			$tablehtml .= "\t\t<td class=\"slot\" draggable=\"true\">\n";
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
					case "batch":
						$tablehtml .= "\t\t\t\t<tr><td>\n";
						$tablehtml .= "$value";
						$tablehtml .= "\t\t\t\t</td> </tr>\n";
						break;
					default:
						$tablehtml .= "!!Junk!!";
						break;
				}
			}
			$tablehtml .= "\t\t\t</table>\n";
		}
		$tablehtml .= "\t</tr>\n";
	}
	//var_dump($tablehtml);
	return $tablehtml;
}

?>

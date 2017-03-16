<?php
	require_once('config.php');
	require_once('db.php');
	require_once('common.php');
	require_once('display.php');
	
	$conn = db_connect();
	
	if($conn->error or $ttconfig === FALSE) {
		die("could not fetch config" . $conn->error. $ttconfig);
	}
	if($_SERVER["REQUEST_METHOD"] == "POST") {
		$day = $_POST["column"][0];
		$slotNo = $_POST["column"][1];
		if(isset($_POST['subject'])) {/*When subject changes-->subjectId, teacherId, batchId, isBreak, roomId changes*/
			$isBreak = "TRUE";
			echo $_POST["subject"];/*Checking for totalHrs remaining, teacher tt, room tt remaining*/
			if($_POST["subject"] == "lunch") {
				$isBreak = "TRUE";
				$roomId = $subjectId = $teacherId = $classId = $batchId = "NULL";
			}
			else {
				$query = "SELECT subjectId, batches FROM subject WHERE subjectShortName=\"".$_POST["subject"]."\"";
				$result = $conn->query($query);
				$row = $result->fetch_assoc();
				$subjectId = $row["subjectId"];
				$batches = $row["batches"];/*This is a string*/
				$query = "SELECT teacherId FROM subjectTeacher WHERE subjectId = \"$subjectId\"";
				$result = $conn->query($query);
				$row = $result->fetch_assoc();
				$teacherId = $row["teacherId"];
				$classShortName = $_POST['id'];
				$query = "SELECT classId FROM class WHERE classShortName = \"$classShortName\"";
				$result = $conn->query($query);
				$row = $result->fetch_assoc();
				$classId = $row["classId"];
				$batchId = 1;/*None*/
				/*Find a room*/
				echo "Batche:$batches";
				if($batches == "0") {
					$query = "SELECT roomId from room where roomCount >= (SELECT classCount FROM class WHERE classShortName = \"$classShortName\")";
				}
				else {
					$query = "SELECT roomId from room where roomCount >= (SELECT MAX(batchCount) FROM batch b, subjectBatch sb WHERE b.batchId = sb.batchId and sb.subjectId = $subjectId)  LIMIT 1";
				}
				$result = $conn->query($query);
				$row = $result->fetch_assoc();
				$roomId = $row["roomId"];
				

				$isBreak = "FALSE";
			}
			$configId = 1;
			/*echo "day: $day<br>slotNO: $slotNo<br>subjectId : $subjectId<br>teacherId : $teacherId<br>classId: $classId<br>configId : $configId<br>isBreak : $isBreak<br>";*/
			$query = "SELECT ttId FROM timeTable2 WHERE day= $day AND slotNo= $slotNo";
			$result = $conn->query($query);
			if ($result->num_rows > 0) {
			$query = "UPDATE timeTable2 SET roomId = $roomId, classId = $classId, subjectId =$subjectId, teacherId = $teacherId, batchId = $batchId, isBreak = $isBreak WHERE day= $day AND slotNo= $slotNo";
				$conn->query($query);
		
			}
			else {
				/*Insert an entry*/
				$query = "INSERT INTO timeTable2 (day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) VALUES ($day, $slotNo, $roomId, $classId, $subjectId, $teacherId, $batchId, $configId, $isBreak)";
				$conn->query($query);
					
				
			}
		}
		 
	}
	$configquery = "SELECT * FROM config";	
	$ttconfig = $conn->query($configquery);
	if($conn->error or $ttconfig === FALSE) {
		die("could not fetch config" . $conn->error. $ttconfig);
	}
	$config = $ttconfig->fetch_assoc();
	$type = $_POST['type'];
	$id = $_POST['id'];
	echo $OUTPUT->default_header();
	echo $OUTPUT->default_scripts();
	$tthtml = make_table($conn, $config, $type, $id);
	echo $tthtml;
	echo $OUTPUT->default_footer();
	$conn->close();

?>

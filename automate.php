<?php
/* Credit: Some parts of the code borrowed from solution provided by Aniket Thorat */

require_once('db.php');

function insertTTEntry($entry) {
	global $conn;
	$query = "INSERT INTO timetable(day, slotNo, roomId, classId, subjectId, teacherId, ".
				"batchId, configId, snapShotId, isBreak, snapshotId) VALUES (".
				$entry["day"].",".$entry["slot"].",".$entry["room"].",".$entry["class"].",".
				$entry["subject"].",".$entry["teacher"].",".$entry["batch"].
				",1,null, ".$entry["isBreak"].", $snapshotId)";
	if (sqlUpdate($query) === false) {
	    echo "ERROR: Failed inserting TT entry" . $query . "<br/>" . $conn->error;
	}

}

function createEntry($day, $slotId, $room, $class, $subject, $teacher, $batch, $isBreak) {
	$entry = array();
	$entry["day"] = $day;
	$entry["slot"] = $slotId;
	$entry["room"] = $room; 
	$entry["class"] = $class;
	$entry["subject"] = $subject; 
	$entry["batch"] = $batch;
	$entry["teacher"] = $teacher;
	$entry["isBreak"] = $isBreak;
	return $slot;
}

function search($array, $val) {
	for($i = 0 ; $i < count($array) ; $i++) {
		for($j = 0 ; $j < count($array[$i]) ; $j++) {
			if($array[$i][$j] == $val)
				return 1;
		}
	}
	return -1;
}


function createBatchSets($batchIds) {
	global $conn;
	$batch_sets = array();
	for ($i = 0 ; $i < count($batchIds) ; $i++)  {
		$set = array();
		if(search($batchIds[$i], $batch_sets) == -1) {
			$batchOverlapIds = sqlGetAllRows("SELECT batchOverlapId FROM ".
					"batchcanoverlap WHERE batchId = .".$batchIds[$i]);
			$set[] = $batchIds[$i];
			for($j = 0 ; $j < count($batchOverlapIds) ; $j++) {
				if($batchOverlapIds[$j]["batchOverlapId"] != null)
					$set[] = $batchOverlapIds[$j]["batchOverlapId"];
			}
			$batch_sets[] = $set;
		}
	}
	return $batch_sets;
}

function searchEmptySlot($slotLength, $day = null, $slot1 = null, $slot2 = null) {
	for($i = 0; $i < count($roomTTs); $i++) {
		$res = searchEmptySlotInRoom($i, $slotLength, $day, $slot1, $slot2);
		if($res !== null)
			return array($i, $res);
	}
	return null;
}
function searchEmptySlotInRoom($roomId, $slotLength, $day = null, $slot1 = null, $slot2 = null) {
	global $nDays;
	global $roomTTs;
	global $nSlots;
	$roomTT = $roomTTs[$roomId];

	$day === null? $iBegin = 0 : $iBegin = $day;
	$day === null? $iEnd = 0: $iEnd = $day + 1;

	$jBegin = 0;
	$jEnd = $nSlots;
	if($slot1 !== null)  {
		$jBegin = $slot1;
		if($slot2 === null) {
			echo "ERROR: slot1 not null, but slot2 null";
			die;
		}
		$jEnd = $slot2;
	}
	for($i = $iBegin; $i < $iEnd; $i++) {
		for($j = $jBegin; $j < $jEnd; $j++) {
			for($k = 0; $k < $slotLength; $k++) {
				if($roomTT[$i][$j + $k] == 1)
					break;	
			}
			if($k == $slotLength)
				return array($i, $j);
		}
	}
	return null;
}

echo "Beginning <br>";

global $nDays;
global $roomTTs;
global $nSlots;
global $automatedSnapshotId;
global $snapshotId;
global $configId;

$snapshotId = $_GET["snapshotId"];
$configId = $_GET["configId"];

echo "Got paramters : snapshotId: $snapshotId and configId = $configId <br>";

$snapshotQuery = "INSERT INTO snapshot (snapshotName, snapshotCreator, ".
					"createTime, modifyTime, configId) VALUES(".
					"\"automated\", 1, 080000, 080000, 1)";
$result = sqlUpdate($snapshotQuery);
if($result === false) {
	echo "Failed snapshot creation <br>";
	die;
} else {
	echo "auotmated snapshot created <br>";
}

$selectQuery = "SELECT * FROM snapshot where snapshotName=\"automated\"";
$res = sqlGetAllRows($selectQuery);
$automatedSnapshotId = $res[0]["snapshotId"];
echo "auotmated snapshot Id: $automatedSnapshotId <br>";

$selectQuery = "SELECT * from config where configId = $configId";
$res = sqlGetAllRows($selectQuery);
$nSlots = $res[0]["nSlots"];
$nDays = 5;
echo "Config: nSlots $nSlots days = $nDays <br>";

$roomsQuery = "SELECT * from room where snapshotId = $snapshotId";
$rooms = sqlGetAllRows($roomsQuery);
$nRooms = count($rooms);

$roomsTT = array();
for($i = 0 ; $i < $nRooms; $i++)
	for($j = 0 ; $j < $nDays ; $j++)
		for($k = 0 ; $k < $nSlots; $k++)
			$roomsTT[$i][$j][$k] = 0;	
echo "Rooms Initialized to ZERO <br>";//.json_encode($roomsTT);

$sctQuery = "SELECT * from subjectClassTeacher, subject where subjectClassTeacher.subjectId = subject.subjectId";
$sctRows = sqlGetAllRows($sctQuery);
echo "Got SCT Listing: <br>";//.json_encode($sctRows);

$sbtQuery = "SELECT * from subjectBatchTeacher, subject where subjectBatchTeacher.subjectId = subject.subjectId";
$sbtRows = sqlGetAllRows($sbtQuery);
echo "Got SBT Listing: <br>";//.json_encode($sbtRows);

echo "Beginning Auomated Generation <br>";


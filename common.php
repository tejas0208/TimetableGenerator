<?php	
function getArgument($arg) {
	//echo "in getArgument arg = $arg <br>";
	if(isset($_POST[$arg]))
			return $_POST[$arg];
	else if(isset($_GET[$arg]))
			return $_GET[$arg];
	else
		return ""; 
}
function getDataTables() {
	header("Content-Type: application/JSON; charset=UTF-8");
	/* List of tables to be returned */	
	$snapshotId = getArgument("snapshotId");
	$tableNames = array(//"dept", "config", "snapshot", 
					"teacher", 
					"class", 
					"batch", "batchCanOverlap", "batchClass", 
					"room", 
					"classRoom", "batchRoom", "subjectRoom", 
					"subject", 
					"subjectBatchTeacher", "subjectClassTeacher", "overlappingSBT", 
					"fixedEntry");
	$length = count($tableNames);

	for($i = 0; $i < $length; $i++) {
		$query = "SELECT * FROM ".$tableNames[$i]." WHERE snapshotId = $snapshotId";/*TimeTable*/
		$outp = sqlGetAllRows($query);
		$tables[$tableNames[$i]] = $outp;
	}
	//ttlog(json_encode($tables));
	return json_encode($tables);
}
function getOneTable($tableName) {
	header("Content-Type: application/JSON; charset=UTF-8");
	$snapshotId = getArgument("snapshotId");
	if($snapshotId != "")
		$query = "SELECT * FROM $tableName WHERE snapshotId = $snapshotId";
	else 
		$query = "SELECT * FROM $tableName ";
	$outp = sqlGetAllRows($query);
	$tables[$tableName] = $outp;
	ttlog("getOneTable: Returning: ".json_encode($tables));
	return json_encode($tables);
}
function ttlog($string) {
	global $CFG;

	if($CFG->logfile) {
		$logfile = $CFG->logfile;
	}
	else {
		if($CFG->logfileName)
			$logfileName = $CFG->logfileName;
		else {
			/* TODO: if the name was /tmp/timetable.log or /var/log/timetable.log
			 * Then fwrite succeeds, but file is not written. Check this 
			 */
			$logfileName = "timetable.log";
			$CFG->logfileName = $logfileName;
		}
		$logfile = fopen($logfileName, "a");
		if($logfile == False) {
			error_log("could not open timetable log file", 0);
		}
		$CFG->logfile = $logfile;
	}

	$currTime = date("d-m-Y:H-i-s");
	$string = $currTime.":".$string."\n";
	$result = fwrite($logfile, $string);	

	if($result === false) {
		error_log("could not write to timetable log file", 0);
	} 
}
?>

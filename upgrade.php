<?php
require_once('db.php');
require_once('version.php');

//The code below checks if the version table exists in the database
$ver = "";
$conn = dbConnect();
$result = $conn->query("SELECT * FROM version");
if($result === false)  {
	echo "<script>";
	echo "alert('Please backup your database, the application will be updated.');";
	echo "</script>";
	sqlUpdate("CREATE TABLE version (version varchar(16))");
	sqlUpdate("INSERT INTO version VALUES('".$taasika_version."')");
	sqlUpdate("ALTER TABLE config ADD daysInWeek int(11) DEFAULT ".
				"NULL COMMENT 'Number of days in a week'");
	sqlUpdate("UPDATE config SET daysInWeek = '7'");
}
//Following code runs when the databse has a version table,
//so the actual version is found and stored in $ver
else{
	$allrows = sqlGetOneRow("SELECT * FROM version");
	$ver = $allrows[0]["version"];
	$cmp = strcmp($ver, $taasika_version);
	//Update is performed only if the previous version is less than the current
	if($cmp < 0){
		echo "<script>";
		echo "alert('Please backup your database, the application will be updated.');";
		echo "</script>";
		sqlUpdate("UPDATE version SET version = '".$taasika_version."'");
		sqlUpdate("ALTER TABLE config ADD daysInWeek int(11) DEFAULT NULL ".
				"COMMENT 'Number of days in a week'");
		sqlUpdate("UPDATE config SET daysInWeek = '7'");
	}
	//Case with version already same in the database is ignored
	else if($cmp == 0){
	}
	//else no update is performed
	else {
		echo "<script>";
		echo "alert('The software in your system is later version of that '.
					'in the code, Please roll back to your version or the '.
					'code might not work properly. Your version is ".$ver."');";
		echo "</script>";
	}
}
?>

<?php
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
date_default_timezone_set('Asia/Kolkata');

define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
//require_once('../PHPExcel/Build/PHPExcel.phar');
require_once('./PHPExcel/Classes/PHPExcel.php');
require_once('./db.php');
$conn = db_connect();

$tableNames = array("teacher", "teacherShortName", "class", "classShortName", "batch", "batchName", "room", "roomShortName");

$objPHPExcel = new PHPExcel();
$objPHPExcel->getProperties()->setCreator("Abhijit A.M.")
							->setLastModifiedBy("Abhijit A. M.")
							->setTitle("Timetable for COEP")
							->setSubject("Subject for Timetable")
							->setDescription("This is description of timetable")
							->setKeywords("timetable generated");


function countNewLines($text) {
	return 1;
}
function find($allrows, $day, $slotNo) {
	$result = array();
	$i = 0;
	for($k = 0; $k < count($allrows); $k++) {
			if($allrows[$k]["day"] == $day && $allrows[$k]["slotNo"] == $slotNo)
					$result[$i++] = $allrows[$k];
	}
	return $result;
}
echo "<html> <head></head> <body>";
$sheetCount = 0;
$query = "SELECT * from config where configId = 1";
$result = $conn->query($query);
$allrows = array();
$allrows = $result->fetch_all(MYSQLI_ASSOC);
$nSlots = $allrows[0]["nSlots"];
# consider having a timetable class with derived classes 
# on teacherTT, classTT, batchTT, etc. and have a specific code in each.
echo "nSlots = $nSlots <br>";
for($i = 0; $i < count($tableNames); $i += 2) { # Generate worksheets for each table
	$currTableName = $tableNames[$i];
	$currParam = $tableNames[$i + 1];
	$query = "SELECT * FROM $currTableName";
	//echo "First Query:  $query <br>";
	$result = $conn->query($query);
	$allrows = array();
	$allrows = $result->fetch_all(MYSQLI_ASSOC);
	for($j = 0; $j < count($allrows); $j++) { 
		# Generate worksheets for each room/class/teacher/batch in each table
		$searchParam = $allrows[$j][$currParam];
		$query = "SELECT * FROM timeTableReadable where  $currParam = \"$searchParam \"";
		$result2 = $conn->query($query);
		$allrows2 = array();
		$allrows2 = $result2->fetch_all(MYSQLI_ASSOC);

		$myWorkSheet = new PHPExcel_Worksheet($objPHPExcel, $currTableName."_".$searchParam);
		$objPHPExcel->addSheet($myWorkSheet, $sheetCount);
		$objPHPExcel->setActiveSheetIndex($sheetCount);
		
		# Generate the Header for the worksheet
		$text = array("College of Engineering Pune", "Timetable Generated", "Dept of Comp Engg and IT");
		for($x = 0; $x < count($text); $x++) { # The header in the worksheet  
				$xx = $x + 1;
				$objRichText = new PHPExcel_RichText();
				$currText = $objRichText->createTextRun($text[$x]);
				$currText->getFont()->setBold(true);
				$currText->getFont()->setSize(16);
				$currText->getFont()->setColor( new PHPExcel_Style_Color(PHPExcel_Style_Color::COLOR_DARKGREEN ) );
				$objPHPExcel->getActiveSheet()->getCell('A'.$xx)->setValue($objRichText);
				$objPHPExcel->getActiveSheet()->getRowDimension($xx)->setRowHeight(3*12.75);
				$objPHPExcel->getActiveSheet()->mergeCells("A$xx:M$xx");
				$objPHPExcel->getActiveSheet()->getStyle('A'.$xx)->getAlignment()->
											setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		}

		$rowshift = count($text) + 1;
		$colshift = 1;
		
		# Generate the Slots-Labels and Day-Wise Labels
		$cols = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O','P','Q','R','S');
		for($k = 0; $k < 12; $k++) { 	# Column Labels  Slot -1, etc. 
			$objRichText = new PHPExcel_RichText();
			$currText = $objRichText->createTextRun("Slot ".$k);
			$currText->getFont()->setBold(true);
			$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
			$objPHPExcel->getActiveSheet()->getCell($cols[$k+$colshift].$rowshift)->setValue($objRichText);
			$objPHPExcel->getActiveSheet()->getStyle($cols[$k+$colshift].$rowshift)->getAlignment()->
										setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle($cols[$k+$colshift].$rowshift)->getAlignment()->
										setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
		}
		$rowshift++;
		$days = array("Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
		for($k = 0; $k < count($days); $k++){ # print row labels
			$dayname = $days[$k];
			$objRichText = new PHPExcel_RichText();
			$currText = $objRichText->createTextRun($dayname);
			$currText->getFont()->setBold(true);
			$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK));
			$z = $k + $rowshift;
			$objPHPExcel->getActiveSheet()->getCell('A'.$z)->setValue($objRichText);
			$objPHPExcel->getActiveSheet()->getStyle('A'.$z)->getAlignment()->
											setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle('A'.$z)->getAlignment()->
											setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
		}
		# Generate the Actual Timetable Cells 
		# This is an inefficient way of doing it. Running one loop on all rows of $allrows2 will be more efficient, but
		# this will require creating each cell content as it appears inn $allrows2, and if you encounter again the same
		# cell, then appending to it. There is no way to append to a cell while preserving the formatting using PHPExcel, 
		# so taking this long route of finding all $allrows for each possible cell(days*nSlots) 
		for($day = 1; $day <= 6; $day++) {
			for($slotNo = 1; $slotNo <= $nSlots; $slotNo++) {
				$row = $day - 1 + $rowshift; # day counts start with 1, not 0
				$col = $cols[$slotNo - 1 + $colshift]; # cols count start with 1

				$thisSlotEntries = find($allrows2, $day, $slotNo);
				$objRichText = new PHPExcel_RichText();

				for($d= 0; $d< count($thisSlotEntries); $d++) {
					$currEntry = $thisSlotEntries[$d];	

					$currText = $objRichText->createTextRun($currEntry["classShortName"]."\t");
					$currText->getFont()->setBold(true);
					$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKGREEN ) );

					$currText = $objRichText->createTextRun($currEntry["subjectShortName"]."\n");
					$currText->getFont()->setBold(true);
					$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );

					$currText = $objRichText->createTextRun($currEntry["teacherShortName"]."\t");
					$currText->getFont()->setBold(true);
					$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKBLUE) );

					$currText = $objRichText->createTextRun($currEntry["roomShortName"]."\n");
					$currText->getFont()->setBold(true);
					$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
				}
				$objPHPExcel->getActiveSheet()->getCell($col.$row)->setValue($objRichText);
				# need to work lot more on setting height, width and formatting of 4 entries
				$height = 12.75 * count($thisSlotEntries);
				$objPHPExcel->getActiveSheet()->getRowDimension($row)->setRowHeight($height);
				$width = 12.75;
				$objPHPExcel->getActiveSheet()->getColumnDimension($col)->setWidth($width);
				$objPHPExcel->getActiveSheet()->getStyle($col.$row)->getAlignment()->
										setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
				$objPHPExcel->getActiveSheet()->getStyle($col.$row)->getAlignment()->
										setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
			}
		}
		# print information about subject shortcut names, subject-teacher mapping	
		$sheetCount++;	
	}
}
	

//$objPHPExcel->setCellValue('A2','World');

if($_POST["type"] == "ODS") {
	$format = 'OpenDocument';
	$replace = 'ods';
} else if ($_POST["type"] == "Excel") {
	$format = 'Excel5';
	$replace = 'xls'; 
} else {
	$format = 'Excel2007';
	$replace = 'xlsx';
}
echo "type = ".$_POST["type"]."format = $format";
$objPHPWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $format);
$filename = str_replace('php',$replace, basename(__FILE__));
$objPHPWriter->save(str_replace('php',$replace, basename(__FILE__)));
# need to work more on the filename part, also just set the output type of this file to be xls and include this in timetable.php
//$filename = "/tmp/output."$replace;
//$objPHPWriter->save($filename);
echo "<br> Download file <a href=\"$filename\">click here</a> </body></html>";
?>

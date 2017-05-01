<?php
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
//date_default_timezone_set('Asia/Kolkata');

//define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
//require_once('../PHPExcel/Build/PHPExcel.phar');
require_once('./PHPExcel/Classes/PHPExcel.php');
require_once('./db.php');

global $objPHPExcel; 
function count_new_lines($text) {
	return 1;
}
function find($allrows, $day, $slotNo) {
	$result = array();
	$i = 0;
	for($k = 0; $k < count($allrows); $k++) {
			if($allrows[$k]["day"] == $day && 
						$allrows[$k]["slotNo"] == $slotNo)
					$result[$i++] = $allrows[$k];
	}
	return $result;
}
/* Generates one worksheet for teacher=teacherShortName, class=classShortName, etc. */
function generate_timetable_worksheet($currTableName, $searchParam, $sheetCount, $allrows2, $nSlots) {
	global $objPHPExcel; 
	//ttlog("generate_timetable_worksheet: $currTableName $searchParam $sheetCount $nSlots");
	global $objPHPExcel;
	$myWorkSheet = new PHPExcel_Worksheet($objPHPExcel, $currTableName."_".$searchParam);
	$objPHPExcel->addSheet($myWorkSheet, $sheetCount);
	$objPHPExcel->setActiveSheetIndex($sheetCount);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
	$objPHPExcel->getActiveSheet()->getPageMargins()->setTop(0.5); //inches
	$objPHPExcel->getActiveSheet()->getPageMargins()->setRight(0.3);
	$objPHPExcel->getActiveSheet()->getPageMargins()->setLeft(0.3);
	$objPHPExcel->getActiveSheet()->getPageMargins()->setBottom(0.5);
	# Generate the Header for the worksheet
	$text = array("College of Engineering Pune", "Dept of Comp Engg and IT", "Timetable For $currTableName: $searchParam");
	for($x = 0; $x < count($text); $x++) { # The header in the worksheet  
			$xx = $x + 1;
			$objRichText = new PHPExcel_RichText();
			$currText = $objRichText->createTextRun($text[$x]);
			$currText->getFont()->setBold(true);
			$currText->getFont()->setSize(16);
			$currText->getFont()->setColor( new PHPExcel_Style_Color(PHPExcel_Style_Color::COLOR_DARKGREEN ) );
			$objPHPExcel->getActiveSheet()->getCell('A'.$xx)->setValue($objRichText);
			$objPHPExcel->getActiveSheet()->getRowDimension($xx)->setRowHeight(18);
			$objPHPExcel->getActiveSheet()->mergeCells("A$xx:L$xx");
			$objPHPExcel->getActiveSheet()->getStyle('A'.$xx)->getAlignment()->
										setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
	}

	$rowshift = count($text) + 1;
	$colshift = 1;
	$styleArray = array(
	 'borders' => array(
		'top' => array(
			'style' => PHPExcel_Style_Border::BORDER_THIN,
		 ),
		'bottom' => array(
			'style' => PHPExcel_Style_Border::BORDER_THIN,
		 ),
		'left' => array(
			'style' => PHPExcel_Style_Border::BORDER_THIN,
		 ),
		'right' => array(
			'style' => PHPExcel_Style_Border::BORDER_THIN,
		 ),
	 ),
	);

	# Generate the Slots-Labels and Day-Wise Labels
	$cols = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O','P','Q','R','S');
	for($k = 0; $k < $nSlots; $k++) { 	# Column Labels  Slot -1, etc. 
		$objRichText = new PHPExcel_RichText();
		$currText = $objRichText->createTextRun("Slot ".$k);
		$currText->getFont()->setBold(true);
		$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
		$objPHPExcel->getActiveSheet()->getCell($cols[$k+$colshift].$rowshift)->setValue($objRichText);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$k+$colshift].$rowshift)->getAlignment()->
									setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$k+$colshift].$rowshift)->getAlignment()->
									setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$k+$colshift].$rowshift)->applyFromArray($styleArray);
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
		$objPHPExcel->getActiveSheet()->getStyle('A'.$z)->applyFromArray($styleArray);
	}
	# Generate the Actual Timetable Cells 
	# This is an inefficient way of doing it. Running one loop on all rows of $allrows2 will be more efficient, but
	# this will require creating each cell content as it appears inn $allrows2, and if you encounter again the same
	# cell, then appending to it. There is no way to append to a cell while preserving the formatting using PHPExcel, 
	# so taking this long route of finding all $allrows for each possible cell(days*nSlots) 
	for($col = 0; $col <= $nSlots - 1; $col++)
		$widths[$col] = 6.5;
	for($day = 1; $day <= 6; $day++) {
		for($slotNo = 1; $slotNo <= $nSlots; $slotNo++) {
			$row = $day - 1 + $rowshift; # day counts start with 1, not 0
			$col = $cols[$slotNo - 1 + $colshift]; # cols count start with 1

			$thisSlotEntries = find($allrows2, $day, $slotNo);
			$objRichText = new PHPExcel_RichText();
		
			$nEntries = count($thisSlotEntries); 

			if($currTableName != "class" || $nEntries <= 1) {
				for($d = 0; $d < $nEntries; $d++) {
					$currEntry = $thisSlotEntries[$d];	

					if($currEntry["batchName"] != "NULL" && $currTableName != "batch") {
						$currText = $objRichText->createTextRun($currEntry["batchName"]."\n");
						$currText->getFont()->setBold(true);
						$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKGREEN ) );
					}
					if($currTableName != "class" && $currTableName != "batch" && $currEntry["batchName"] != "NULL") {
						$currText = $objRichText->createTextRun($currEntry["classShortName"]."\n");
						$currText->getFont()->setBold(true);
						$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKGREEN ) );
					}

					if($currTableName != "subject") {
						$currText = $objRichText->createTextRun($currEntry["subjectShortName"]."\n");
						$currText->getFont()->setBold(true);
						$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );
					}

					if($currTableName != "teacher") {
						$currText = $objRichText->createTextRun($currEntry["teacherShortName"]."\n");
						$currText->getFont()->setBold(true);
						$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKBLUE) );
					}

					if($currTableName != "room") {
						$currText = $objRichText->createTextRun($currEntry["roomShortName"]."\n");
						$currText->getFont()->setBold(true);
						$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
					}
				}
				/* Check if there was no row-col with bigger width for same col */
				if($nEntries == 0 & $widths[$slotNo - 1] < 8.35) {
					$width = 6.5;
					$widths[$slotNo - 1] = 6.5;
				}
				if($widths[$slotNo - 1] < 16.70) { 
					$width = 8.35;
					$widths[$slotNo - 1] = 8.35;
				} else {
					$width = 16.70;
					$widths[$slotNo - 1] = 16.70;
				}
			}
			else { /* nEntries > 1 for table = "class" */
				for($d = 0; $d < $nEntries; $d++) {
					$currEntry = $thisSlotEntries[$d];	
					$currText = $objRichText->createTextRun($currEntry["batchName"]."/");
					$currText->getFont()->setBold(true);
					$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKGREEN ) );
					$currText = $objRichText->createTextRun($currEntry["roomShortName"]."\n");
					$currText->getFont()->setBold(true);
					$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
					$currText = $objRichText->createTextRun($currEntry["subjectShortName"]."/");
					$currText->getFont()->setBold(true);
					$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );
					$currText = $objRichText->createTextRun($currEntry["teacherShortName"]."\n");
					$currText->getFont()->setBold(true);
					$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKBLUE) );
				}
				$width = 16.70;
				$widths[$slotNo - 1] = 16.70;
			}
			$objPHPExcel->getActiveSheet()->getCell($col.$row)->setValue($objRichText);
			/* 1 Point is 0.35 mm, 0 is hidden row, max value is 409*/
			if($nEntries > 1)
				$height = (34.27 * $nEntries) / 2;// * count($thisSlotEntries);//12.75 * count($thisSlotEntries);
			else
				$height = 68.55;// * count($thisSlotEntries);//12.75 * count($thisSlotEntries);
			$objPHPExcel->getActiveSheet()->getRowDimension($row)->setRowHeight($height);
			//$width = 12.75;
			//ttlog("export: $currTableName $searchParam $day $slotNo width = $width");
			$objPHPExcel->getActiveSheet()->getColumnDimension($col)->setWidth($width);
			$objPHPExcel->getActiveSheet()->getStyle($col.$row)->getAlignment()->
									setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle($col.$row)->getAlignment()->
									setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);

			$objPHPExcel->getActiveSheet()->getStyle($col.$row)->applyFromArray($styleArray);
		}
	}
}
function generate_timetable_spreadsheet() {
	$tableNames = array("teacher", "teacherShortName", "class", "classShortName", 
				"batch", "batchName", "room", "roomShortName");
	$query = "SELECT * from config WHERE configId = 1";
	$allrows = sqlGetAllRows($query);
	$currentSnapshotName = getArgument("snapshotName");
	$currentSnapshotId = getArgument("snapshotId");
	# consider having a timetable class with derived classes 
	# on teacherTT, classTT, batchTT, etc. and have a specific code in each.
	$nSlots = $allrows[0]["nSlots"];
	$sheetCount = 0;
	for($i = 0; $i < count($tableNames); $i += 2) { 
		# Generate worksheets for each table: teachers, classes, batches, rooms
		$currTableName = $tableNames[$i];
		$currParam = $tableNames[$i + 1];
		$query = "SELECT * FROM $currTableName WHERE snapshotId = $currentSnapshotId";
		$allrows = sqlGetAllRows($query);
		for($j = 0; $j < count($allrows); $j++) { 
			# Generate worksheets for each room/class/teacher/batch in each table
			$searchParam = $allrows[$j][$currParam];
			$query = "SELECT * FROM timeTableReadable WHERE  $currParam = \"$searchParam\" ".
					 "AND snapshotName = \"$currentSnapshotName\"";
			$allrows2 = sqlGetAllRows($query);
			//ttlog("export: allrows2: ".json_encode($allrows2));
			generate_timetable_worksheet($currTableName, $searchParam, $sheetCount, $allrows2, $nSlots);

			# print information about subject shortcut names, subject-teacher mapping	

			$sheetCount++;	
		}
	}
}	
function generate_data_worksheet($currTableName, $sheetCount, $nameOrId) {
	global $objPHPExcel;

	$myWorkSheet = new PHPExcel_Worksheet($objPHPExcel, $currTableName);
	$objPHPExcel->addSheet($myWorkSheet, $sheetCount);
	$objPHPExcel->setActiveSheetIndex($sheetCount);
	$currentSnapshotName = getArgument("snapshotName");
	$currentSnapshotId = getArgument("snapshotId");

	$styleArray = array(
	 'borders' => array(
		'top' => array(
			'style' => PHPExcel_Style_Border::BORDER_THIN,
		 ),
		'bottom' => array(
			'style' => PHPExcel_Style_Border::BORDER_THIN,
		 ),
		'left' => array(
			'style' => PHPExcel_Style_Border::BORDER_THIN,
		 ),
		'right' => array(
			'style' => PHPExcel_Style_Border::BORDER_THIN,
		 ),
	 ),
	);

	$objPHPExcel->getActiveSheet()->getStyle('A1:Z100')->getAlignment()->setWrapText(true);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
	$objPHPExcel->getActiveSheet()->getPageMargins()->setTop(1); //inches
	$objPHPExcel->getActiveSheet()->getPageMargins()->setRight(0.3);
	$objPHPExcel->getActiveSheet()->getPageMargins()->setLeft(0.8);
	$objPHPExcel->getActiveSheet()->getPageMargins()->setBottom(0.5);
	
	$query = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS ". 
			" WHERE TABLE_SCHEMA='timeTable' AND TABLE_NAME='".$currTableName."';";
	$colNames = sqlGetAllRows($query);

	if($nameOrId == "name")
		$query = "SELECT * FROM $currTableName WHERE snapshotName = \"$currentSnapshotName\";";
	else if($nameOrId == "none")
		$query = "SELECT * FROM $currTableName";
	else
		$query = "SELECT * FROM $currTableName WHERE snapshotId = $currentSnapshotId;";
	$allrows = sqlGetAllRows($query);
	$colLabels = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 
						'K', 'L', 'M', 'N', 'O','P','Q','R','S');
	/* print header row */
	for($j = 0; $j < count($colNames); $j++) {
		$row = 1;
		$col = $colLabels[$j];
		$objRichText = new PHPExcel_RichText();
		$currText = $objRichText->createTextRun($colNames[$j]["COLUMN_NAME"]);
		$currText->getFont()->setBold(true);
		$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKGREEN ) );
		$objPHPExcel->getActiveSheet()->getCell($col.$row)->setValue($objRichText);
		/* 1 Point is 0.35 mm, 0 is hidden row, max value is 409*/
		$height = 12.75;//12.75 * count($thisSlotEntries);
		$objPHPExcel->getActiveSheet()->getRowDimension($row)->setRowHeight($height);
		$width = 12.75;
		//$objPHPExcel->getActiveSheet()->getColumnDimension($col)->setWidth($width);
		$objPHPExcel->getActiveSheet()->getColumnDimension($col)->setAutoSize(true);
		$objPHPExcel->getActiveSheet()->getStyle($col.$row)->getAlignment()->
								setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$objPHPExcel->getActiveSheet()->getStyle($col.$row)->getAlignment()->
								setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
		$objPHPExcel->getActiveSheet()->getStyle($col.$row)->applyFromArray($styleArray);

	}
	/* print data */
	for($i = 0; $i < count($allrows); $i++) {
		for($j = 0; $j < count($colNames); $j++) {
			$row = $i + 2;
			$col = $colLabels[$j];

			$objRichText = new PHPExcel_RichText();
			$currText = $objRichText->createTextRun("".$allrows[$i][$colNames[$j]["COLUMN_NAME"]]);
			$currText->getFont()->setBold(true);
			$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
			$objPHPExcel->getActiveSheet()->getCell($col.$row)->setValue($objRichText);
			/* 1 Point is 0.35 mm, 0 is hidden row, max value is 409*/
			$height = 12.75;//12.75 * count($thisSlotEntries);
			$objPHPExcel->getActiveSheet()->getRowDimension($row)->setRowHeight($height);
			$width = 12.75;
			//$objPHPExcel->getActiveSheet()->getColumnDimension($col)->setWidth($width);
			$objPHPExcel->getActiveSheet()->getColumnDimension($col)->setAutoSize(true);
			$objPHPExcel->getActiveSheet()->getStyle($col.$row)->getAlignment()->
									setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle($col.$row)->getAlignment()->
									setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle($col.$row)->applyFromArray($styleArray);

		}
	}
}
function generate_data_spreadsheet() {
	$tableNames = array("teacherReadable", "name", "class", "id", "batch","id", 
						"batchClassReadable", "name", "batchCanOverlapReadable", 
						"name", "subjectClassTeacherReadable", "name",
						"subjectBatchTeacherReadable", "name", "config", "none"); 

	$sheetCount = 0;
	for($i = 0; $i < count($tableNames); $i += 2) { 
		# Generate worksheets for each table: teachers, classes, batches, rooms
		$currTable = $tableNames[$i];
		$nameOrId = $tableNames[$i + 1];
		generate_data_worksheet($currTable, $sheetCount, $nameOrId);

		# print information about subject shortcut names, subject-teacher mapping	
		$sheetCount++;	
	}

}
function saveFile($savefilename) {
	global $_POST, $objPHPExcel; 
	$extension = getArgument("extension");
	if($extension == "")
			$extension = 'xlsx';	

	if($extension == "ODS") {
		$format = 'OpenDocument';
		$extension = 'ods';
	} else if ($extension == "Excel") {
		$format = 'Excel5';
		$extension = 'xls'; 
	} else {
		$format = 'Excel2007';
		$extension = 'xlsx';
	}
	$objPHPWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $format);
	$filename = str_replace('EXT', $extension, $savefilename); 
	$objPHPWriter->save($filename); //str_extension('php',$extension, basename(__FILE__)));
	//ttlog("export: Saving file $filename");
	return $filename; 
}
function exportFile() {
	global $objPHPExcel; 
	$objPHPExcel = new PHPExcel();
	$objPHPExcel->getProperties()->setCreator("Abhijit A.M.")
						->setLastModifiedBy("Abhijit A. M.")
						->setTitle("Timetable for COEP")
						->setSubject("Subject for Timetable")
						->setDescription("This is description of timetable")
						->setKeywords("timetable generated");

	$type = getArgument("type");
	if($type == "config") {
		generate_data_spreadsheet();
		$savefilename = "config.EXT";
	} else if($type == "timetable") {
		generate_timetable_spreadsheet();
		$savefilename = "timetable.EXT";
	} else {
		$savefilename = "something.EXT";
	}
	$filename = saveFile($savefilename);
	return $filename;
}
/*
echo "<html>";
echo "<head></head>";
echo "<body>";
echo "<br> Download file <a href=\"$filename\">click here</a> ";
echo "</body>";
echo "</html>";
*/
?>

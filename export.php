<?php
// This file is part of Samay - a timetabling software for 
// schools, colleges/universities.
//
// Samay is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Samay is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Samay.  If not, see <http://www.gnu.org/licenses/>.

/**
 *
 * Copyright 2007 Abhijit A. M.(abhijit13@gmail.com)
 */

error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
#date_default_timezone_set('Asia/Kolkata');

#define('EOL',(PHP_SAPI == 'cli') ? PHP_EOL : '<br />');
#require_once('../PHPExcel/Build/PHPExcel.phar');
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
function generate_timetable_worksheet($currTableName, $searchParam, $sheetCount,
		$allrows2, $nSlots, $dayBegin, $slotDuration) {
	global $objPHPExcel; 
	#ttlog("generate_timetable_worksheet: $currTableName $searchParam $sheetCount $nSlots");
	global $objPHPExcel;
	$myWorkSheet = new PHPExcel_Worksheet($objPHPExcel, $currTableName."_".$searchParam);
	$objPHPExcel->addSheet($myWorkSheet, $sheetCount);
	$objPHPExcel->setActiveSheetIndex($sheetCount);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
	$objPHPExcel->getActiveSheet()->getPageMargins()->setTop(0.5); #inches
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
	$currSlotTime = strtotime($dayBegin);
	$currSlotTimeFormatted = date("H:i", $currSlotTime);

	# Generate the Slots-Labels and Day-Wise Labels
	$cols = array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O','P','Q','R','S');
	for($k = 0; $k < $nSlots; $k++) { 	# Column Labels  Slot -1, etc. 
		$objRichText = new PHPExcel_RichText();
		//$currText = $objRichText->createTextRun("Slot ".$k);
		$currText = $objRichText->createTextRun($currSlotTimeFormatted);
		$currSlotTime += $slotDuration;
		$currSlotTimeFormatted = date("H:i", $currSlotTime);
		$currText->getFont()->setBold(true);
		$currText->getFont()->setSize(13);
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
		$currText->getFont()->setSize(13);
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
		for($slotNo = 0; $slotNo < $nSlots; $slotNo++) {
			$row = $day - 1 + $rowshift; # day counts start with 1, not 0
			$col = $cols[$slotNo + $colshift]; # cols count start with 1

			$thisSlotEntries = find($allrows2, $day, $slotNo);
			$objRichText = new PHPExcel_RichText();
		
			$nEntries = count($thisSlotEntries); 

			if($currTableName != "class" || $nEntries <= 1) {
				for($d = 0; $d < $nEntries; $d++) {
					$currEntry = $thisSlotEntries[$d];	

					if($currEntry["batchName"] != "NULL" && $currTableName != "batch") {
						$currText = $objRichText->createTextRun($currEntry["batchName"]."\n");
						$currText->getFont()->setBold(true);
						$currText->getFont()->setSize(10);
						$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKGREEN ) );
					}
					if($currTableName != "class" && $currTableName != "batch" && $currEntry["batchName"] != "NULL") {
						$currText = $objRichText->createTextRun($currEntry["classShortName"]."\n");
						$currText->getFont()->setBold(true);
						$currText->getFont()->setSize(10);
						$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKGREEN ) );
					}

					if($currTableName != "subject") {
						$currText = $objRichText->createTextRun($currEntry["subjectShortName"]."\n");
						$currText->getFont()->setBold(true);
						$currText->getFont()->setSize(10);
						$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );
					}

					if($currTableName != "teacher") {
						$currText = $objRichText->createTextRun($currEntry["teacherShortName"]."\n");
						$currText->getFont()->setBold(true);
						$currText->getFont()->setSize(10);
						$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKBLUE) );
					}

					if($currTableName != "room") {
						$currText = $objRichText->createTextRun($currEntry["roomShortName"]."\n");
						$currText->getFont()->setBold(true);
						$currText->getFont()->setSize(10);
						$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
					}
				}
				/* Check if there was no row-col with bigger width for same col */
				if($nEntries == 0 & $widths[$slotNo] < 8.35) {
					$width = 6.5;
					$widths[$slotNo] = 6.5;
				}
				if($widths[$slotNo] < 16.70) { 
					$width = 8.35;
					$widths[$slotNo] = 8.35;
				} else {
					$width = 16.70;
					$widths[$slotNo] = 16.70;
				}
			}
			else { /* nEntries > 1 for table = "class" */
				for($d = 0; $d < $nEntries; $d++) {
					$currEntry = $thisSlotEntries[$d];	
					$currText = $objRichText->createTextRun($currEntry["batchName"]."/");
					$currText->getFont()->setBold(true);
					$currText->getFont()->setSize(10);
					$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKGREEN ) );
					$currText = $objRichText->createTextRun($currEntry["roomShortName"]."\n");
					$currText->getFont()->setBold(true);
					$currText->getFont()->setSize(10);
					$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
					$currText = $objRichText->createTextRun($currEntry["subjectShortName"]."/");
					$currText->getFont()->setBold(true);
					$currText->getFont()->setSize(10);
					$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );
					$currText = $objRichText->createTextRun($currEntry["teacherShortName"]."\n");
					$currText->getFont()->setBold(true);
					$currText->getFont()->setSize(10);
					$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKBLUE) );
				}
				$width = 16.70;
				$widths[$slotNo] = 16.70;
			}
			$objPHPExcel->getActiveSheet()->getCell($col.$row)->setValue($objRichText);
			/* 1 Point is 0.35 mm, 0 is hidden row, max value is 409*/
			if($nEntries > 1)
				$height = (34.27 * $nEntries) / 2;# * count($thisSlotEntries);#12.75 * count($thisSlotEntries);
			else
				$height = 68.55;# * count($thisSlotEntries);#12.75 * count($thisSlotEntries);
			$objPHPExcel->getActiveSheet()->getRowDimension($row)->setRowHeight($height);
			#$width = 12.75;
			#ttlog("export: $currTableName $searchParam $day $slotNo width = $width");
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
	
	/* TODO: Change this to use currentConfigId */
	$nSlots = $allrows[0]["nSlots"];
	$dayBegin = $allrows[0]["dayBegin"];
	$slotDuration = $allrows[0]["slotDuration"];
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
			#ttlog("export: allrows2: ".json_encode($allrows2));
			generate_timetable_worksheet($currTableName, $searchParam, $sheetCount,
				$allrows2, $nSlots, $dayBegin, $slotDuration);

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
	$objPHPExcel->getActiveSheet()->getPageMargins()->setTop(1); #inches
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
		$height = 12.75;#12.75 * count($thisSlotEntries);
		$objPHPExcel->getActiveSheet()->getRowDimension($row)->setRowHeight($height);
		$width = 12.75;
		#$objPHPExcel->getActiveSheet()->getColumnDimension($col)->setWidth($width);
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
			$height = 12.75;#12.75 * count($thisSlotEntries);
			$objPHPExcel->getActiveSheet()->getRowDimension($row)->setRowHeight($height);
			$width = 12.75;
			#$objPHPExcel->getActiveSheet()->getColumnDimension($col)->setWidth($width);
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
	$objPHPWriter->save($filename); #str_extension('php',$extension, basename(__FILE__)));
	#ttlog("export: Saving file $filename");
	return $filename; 
}
function exportConfigXLSX() {
	global $objPHPExcel; 
	$objPHPExcel = new PHPExcel();
	$objPHPExcel->getProperties()->setCreator("Abhijit A.M.")
						->setLastModifiedBy("Abhijit A. M.")
						->setTitle("Timetable for COEP")
						->setSubject("Subject for Timetable")
						->setDescription("This is description of timetable")
						->setKeywords("timetable generated");

	generate_data_spreadsheet();
	$savefilename = "config.EXT";
	$filename = saveFile($savefilename);
	return $filename;
}
function exportXLSX() {
	global $objPHPExcel; 
	$objPHPExcel = new PHPExcel();
	$objPHPExcel->getProperties()->setCreator("Abhijit A.M.")
						->setLastModifiedBy("Abhijit A. M.")
						->setTitle("Timetable for COEP")
						->setSubject("Subject for Timetable")
						->setDescription("This is description of timetable")
						->setKeywords("timetable generated");

	generate_timetable_spreadsheet();
	$savefilename = "timetable.EXT";
	$filename = saveFile($savefilename);
	return $filename;
}
function exportCSV() {
	$filename = "timetable.zip";
	$tempDir =	sys_get_temp_dir();
	/* TODO: check why files not getting created in tmp folder */
	/*$res = mkdir("$tempDir/timetable/");	
	if($res === false) {
		ttlog("mkdir Failed");
	} */
	//$currentSnapshotName = getArgument("currentSnapshotId");
	$currentSnapshotName = "default";
	$currentSnapshotId = "1";

	if(!file_exists("tmp"))
		mkdir("tmp");
	if(!file_exists("tmp/timetable"))
		mkdir("tmp/timetable");
	$tableNames = array(
		"teacherReadable", "name",
			["teacherShortName", "teacherName", "minHrs", "maxHrs", "deptShortName"],
		"class", "id", ["classShortName", "className", "classCount"],
		"batch","id", ["batchName", "batchCount"], 
		"batchClassReadable", "name", ["batchName", "classShortName"],
		"batchCanOverlapReadable", "name",
			["b1Name", "b2Name"],
		"subjectClassTeacherReadable", "name",
			["classShortName", "subjectShortName", "teacherShortName"],
		"subjectBatchTeacherReadable", "name",
			["batchName", "subjectShortName", "teacherShortName"],
		"config", "none",["configName", "dayBegin", "slotDuration", "nSlots", "incharge"]
	); 
	for($i = 0; $i < count($tableNames); $i += 3) { 

		$currTableName = $tableNames[$i];
		if($tableNames[$i + 1] == "name")
			$query = "SELECT * FROM $currTableName WHERE snapshotName = \"$currentSnapshotName\";";
		else if($tableNames[$i + 1] == "none")
			$query = "SELECT * FROM $currTableName";
		else
		$query = "SELECT * FROM $currTableName WHERE snapshotId = $currentSnapshotId;";
		$allRows = sqlGetAllRows($query);

		$nameOrId = $tableNames[$i + 1];
		$selectedColumns = $tableNames[$i + 2];
		$file = fopen("tmp/timetable/$currTableName.csv", "w");
		for($j = 0; $j < count($allRows); $j++) {
			$currRow = $allRows[$j];
			for($k = 0; $k < count($selectedColumns) - 1 ; $k++) {
				fwrite($file, $currRow[$selectedColumns[$k]].",");
			}
			fwrite($file, $currRow[$selectedColumns[$k]]);
			fwrite($file, "\n");
		}
		HZip::zipDir('tmp/timetable', 'timetable.zip');
		# print information about subject shortcut names, subject-teacher mapping	
	}
	
	return $filename;
}
/* Credit: http://php.net/manual/en/class.ziparchive.php */
class HZip
{
  /**
   * Add files and sub-directories in a folder to zip file.
   * @param string $folder
   * @param ZipArchive $zipFile
   * @param int $exclusiveLength Number of text to be exclusived from the file path.
   */
  private static function folderToZip($folder, &$zipFile, $exclusiveLength) {
    $handle = opendir($folder);
    while (false !== $f = readdir($handle)) {
      if ($f != '.' && $f != '..') {
        $filePath = "$folder/$f";
        // Remove prefix from file path before add to zip.
        $localPath = substr($filePath, $exclusiveLength);
        if (is_file($filePath)) {
          $zipFile->addFile($filePath, $localPath);
        } elseif (is_dir($filePath)) {
          // Add sub-directory.
          $zipFile->addEmptyDir($localPath);
          self::folderToZip($filePath, $zipFile, $exclusiveLength);
        }
      }
    }
    closedir($handle);
  }

  /**
   * Zip a folder (include itself).
   * Usage:
   *   HZip::zipDir('/path/to/sourceDir', '/path/to/out.zip');
   *
   * @param string $sourcePath Path of directory to be zip.
   * @param string $outZipPath Path of output zip file.
   */
  public static function zipDir($sourcePath, $outZipPath)
  {
    $pathInfo = pathInfo($sourcePath);
    $parentPath = $pathInfo['dirname'];
    $dirName = $pathInfo['basename'];

    $z = new ZipArchive();
    $z->open($outZipPath, ZIPARCHIVE::CREATE);
    $z->addEmptyDir($dirName);
    self::folderToZip($sourcePath, $z, strlen("$parentPath/"));
    $z->close();
  }
}
?>

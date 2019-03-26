<?php
// This file is part of Taasika - a timetabling software for
// schools, colleges/universities.
//
// Taasika is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Taasika is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Taasika.  If not, see <http://www.gnu.org/licenses/>.

/**
 *
 * Copyright 2017 Abhijit A. M.(abhijit13@gmail.com)
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
function countTotalLoad_excel($allrows2) {
	$total = count($allrows2);
	for($i = 0; $i < count($allrows2); $i++) {
		for($j = $i + 1; $j < count($allrows2); $j++) {
			$one = $allrows2[$i];
			$two = $allrows2[$j];
			if($one["day"] == $two["day"] && $one["slotNo"] == $two["slotNo"])
				$total--;
		}
	}
	return $total;
}
function how_many_days_are_empty($allrows2){
	$count = 0;
	for ($day=1; $day < 7; $day++) {
		if (this_day_entries($allrows2,$day) == 0) {
			$count++;
		}
	}
	return $count;
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
function this_day_entries($allRows,$day){
	$result = 0;
	for ($i=0; $i <count($allRows); $i++) {
		if($allRows[$i]["day"] == $day)
			$result++;
	}
	return $result;
}
$width = 9.5;
function maxofSlotsperday($allRows,$day,$nSlots){
	$count = 0;
	$result = array_fill(0, $nSlots+1, 0);	//intialize the array with size = nslots with all value is 0
	for ($i=0; $i < count($allRows); $i++) {
		if($allRows[$i]["day"] == $day){
			$currSlot = $allRows[$i]["slotNo"];
			$result[$currSlot] = $result[$currSlot] + 1;
		}
	}
	return max($result);
}
function this_slot_week_entry($allRows,$slotNo){
	$count = 0;
	for ($i=0; $i <count($allRows); $i++) {
		if ($allRows[$i]['slotNo'] == $slotNo) {
			$count++;
		}
	}
	return $count;
}
/* Generates one worksheet for teacher=teacherShortName, class=classShortName, etc. */
function generate_timetable_worksheet($currTableName, $searchParam, $sheetCount,
		$allrows2, $nSlots, $dayBegin, $slotDuration, $deptName) {
	global $objPHPExcel;
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
	$text = array("College of Engineering Pune", $deptName, "Timetable For $currTableName: $searchParam");
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
		$currText->getFont()->setSize(10);
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
	$mmm = 0;
	$z=0;
	$m=0;
	for($k = 0; $k < count($days); $k++){ # print row labels
		$dayname = $days[$k];
		$objRichText = new PHPExcel_RichText();
		$currText = $objRichText->createTextRun($dayname);
		$currText->getFont()->setBold(true);
		$currText->getFont()->setSize(9);
		$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK));
		$z = $k + $rowshift+$mmm;
		$m = $z+maxofSlotsperday($allrows2,$k+1,$nSlots)-1;
		if (maxofSlotsperday($allrows2,$k+1,$nSlots)!=0) {
			$mmm=$mmm-1+maxofSlotsperday($allrows2,$k+1,$nSlots);
		}
		if($m > $z)
			$objPHPExcel->getActiveSheet()->mergeCells("A$z:A$m");
		else {
			$objPHPExcel->getActiveSheet()->mergeCells("A$z:A$z");
		}
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
	//for($col = 0; $col <= $nSlots - 1; $col++)
	//	$widths[$col] = 6.5;
	$flag1=0;
	for($day = 1; $day <= 6; $day++) {
		//$flag = 0;
		$no_use=0;
		$maxdayenty = maxofSlotsperday($allrows2,$day,$nSlots);
		for($slotNo = 0; $slotNo < $nSlots; $slotNo++) {
			$flag1 = 0;
			$row = $no_use + $rowshift; # day counts start with 1, not 0
			$col = $cols[$slotNo + $colshift]; # cols count start with 1
			$thisSlotEntries = find($allrows2, $day, $slotNo);
			$objRichText = new PHPExcel_RichText();
			$nEntries = count($thisSlotEntries);
			if(this_slot_week_entry($allrows2,$slotNo) == 0 /*&& $day == 1*/){
				$objPHPExcel->getActiveSheet()->getColumnDimension($col)->setWidth(5.09);
				$flag1 = 1;
			}
			$row_tmp = $row;
			$col_tmp = $col;
			if($currTableName != "class" ) {
					$popo = 0;
					for($d = 0; $d < $nEntries; $d++) {
						$objRichText = new PHPExcel_RichText();
						$currEntry = $thisSlotEntries[$d];
						if($nEntries == 1){
							$sh = $row + $maxdayenty-1;
							if ($sh > $row) {
								// code...
								$objPHPExcel->getActiveSheet()->mergeCells("$col$row:$col$sh");
							}
						}
						if ($nEntries == 2 && $maxdayenty == 4) {
							$sh = $row_tmp + 1;
							$objPHPExcel->getActiveSheet()->mergeCells("$col_tmp$row_tmp:$col_tmp$sh");
							$popo = 1;
						}


						if($currEntry["isFixed"] == "1") {
							$fixedTextQuery = "SELECT * from fixedEntry where ttId=".$currEntry["ttId"];
							$fixedTextRow = sqlGetOneRow($fixedTextQuery);
							$fixedText = $fixedTextRow[0]["fixedText"];
							$currText = $objRichText->createTextRun($fixedText."\n");
							$currText->getFont()->setBold(true);
							$currText->getFont()->setSize(6);
							$currText->getFont()->setColor(
								new PHPExcel_Style_Color(PHPExcel_Style_Color::COLOR_BLACK));
						}
						if($currEntry["batchName"] != NULL && $currTableName != "batch") {
							if ($currTableName == "room" ) {
								$currText = $objRichText->createTextRun($currEntry["batchName"]);
							}else
								$currText = $objRichText->createTextRun($currEntry["batchName"]."\n");
							$currText->getFont()->setBold(true);
							$currText->getFont()->setSize(6);
							$currText->getFont()->setColor(
								new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKGREEN));
						}
						if($currTableName != "class" && $currTableName != "batch" && $currTableName !="teacher" && $currEntry["batchName"] != "NULL" && $currTableName != "teacher" && $currTableName != "room") {
							$currText = $objRichText->createTextRun($currEntry["classShortName"]." ");
							$currText->getFont()->setBold(true);
							$currText->getFont()->setSize(6);
							$currText->getFont()->setColor(
								new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKGREEN));
						}
						if($currTableName != "subject") {
							if (strlen($currEntry["subjectShortName"]) > 6 && $currTableName!= "teacher")
								$currText = $objRichText->createTextRun("\n".$currEntry["subjectShortName"]."\n");
							else
								$currText = $objRichText->createTextRun($currEntry["subjectShortName"]."\n");
							$currText->getFont()->setBold(true);
							$currText->getFont()->setSize(6);
							$currText->getFont()->setColor(
								new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );
						}
						if($currTableName != "teacher" && $currTableName != "room") {
							$currText = $objRichText->createTextRun($currEntry["teacherShortName"]."\n");
							$currText->getFont()->setBold(true);
							$currText->getFont()->setSize(6);
							$currText->getFont()->setColor(
								new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKBLUE) );
						}
						if($currTableName != "room") {
							if ($currTableName == "teacher") {
								$currText = $objRichText->createTextRun($currEntry["roomShortName"]);
							}else
								$currText = $objRichText->createTextRun($currEntry["roomShortName"]."\n");
							$currText->getFont()->setBold(true);
							$currText->getFont()->setSize(6);
							$currText->getFont()->setColor(
								new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
						}
						$objPHPExcel->getActiveSheet()->getCell($col.$row_tmp)->setValue($objRichText);
						$width = 9.5;//16.70;
						if (this_day_entries($allrows2,$day) == 0) {
							$height = 10;
							$this_much_days = how_many_days_are_empty($allrows2);
							if ($this_much_days == 2) {
								$height = 37;
							}if ($this_much_days >= 3) {
								$height = 43;
							}
						}else if ($maxdayenty == 1) {
							$height = 24;
						}
						else if($currTableName == "teacher") {
							$height = 35;
						}else if($currTableName == "class"){
							$height = 21;
						}else if($currTableName == "room") {
							if (strpos($currEntry["roomShortName"],'AC') === false ) {
								$height = 33;
							}else {
								$height = 21;
							}
						}
						$objPHPExcel->getActiveSheet()->getRowDimension($row_tmp)->setRowHeight($height);
						if($flag1 != 1)
						$objPHPExcel->getActiveSheet()->getColumnDimension($col)->setWidth($width);
						$objPHPExcel->getActiveSheet()->getStyle($col.$row_tmp)->getAlignment()->
						setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
						$objPHPExcel->getActiveSheet()->getStyle($col.$row_tmp)->getAlignment()->
						setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);

						$objPHPExcel->getActiveSheet()->getStyle($col.$row_tmp)->applyFromArray($styleArray);

						if (!$popo) {
							$row_tmp++;
						}else{
							$row_tmp +=2;
						}
					}
			}
			else {
				$popo = 0;
				for($d = 0; $d < $nEntries; $d++) {
					$objRichText = new PHPExcel_RichText();
					$currEntry = $thisSlotEntries[$d];
					//ttlog("generate_timetable_worksheet: currEntry = ".json_encode($currEntry));
					if ($day == 1) {
						//ttlog(json_encode($currEntry));
					}
					if($nEntries == 1){
						$sh = $row + $maxdayenty-1;
						$objPHPExcel->getActiveSheet()->mergeCells("$col$row:$col$sh");
					}
					if ($nEntries == 2 && $maxdayenty == 4) {
						$sh = $row_tmp + 1;
						$objPHPExcel->getActiveSheet()->mergeCells("$col_tmp$row_tmp:$col_tmp$sh");
						$popo = 1;
					}

					//text part to enter in each entry
					if($currEntry["isFixed"] == "1") {
						$fixedTextQuery = "SELECT * from fixedEntry where ttId=".$currEntry["ttId"];
						$fixedTextRow = sqlGetOneRow($fixedTextQuery);
						$fixedText = $fixedTextRow[0]["fixedText"];
						$currText = $objRichText->createTextRun($fixedText."\n");
						$currText->getFont()->setBold(true);
						$currText->getFont()->setSize(8);
						$currText->getFont()->setColor(
							new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
						$objPHPExcel->getActiveSheet()->getCell($col.$row_tmp)->setValue($objRichText);

						break;
					}if ($nEntries == 1) {
						$currText = $objRichText->createTextRun($currEntry["roomShortName"]."\n");
					}
					else
						$currText = $objRichText->createTextRun($currEntry["roomShortName"]." ");
					$currText->getFont()->setBold(true);
					$currText->getFont()->setSize(6);
					$currText->getFont()->setColor(
						new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
					$currText = $objRichText->createTextRun($currEntry["subjectShortName"]."\n");
					$currText->getFont()->setBold(true);
					$currText->getFont()->setSize(6);
					$currText->getFont()->setColor(
						new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );
					if ($currEntry["batchName"] != NULL) {
						// code...
						$currText = $objRichText->createTextRun("(".$currEntry["batchName"].")");
						$currText->getFont()->setBold(true);
						$currText->getFont()->setSize(6);
						$currText->getFont()->setColor(
							new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKGREEN ) );
					}
					$objPHPExcel->getActiveSheet()->getCell($col.$row_tmp)->setValue($objRichText);
					$width = 9.5;//16.70;
					if (this_day_entries($allrows2,$day) == 0) {
						$height = 10;
						$this_much_days = how_many_days_are_empty($allrows2);
						if ($this_much_days == 2) {
							$height = 37;
						}if ($this_much_days >= 3) {
							$height = 43;
						}
					}else if ($maxdayenty == 1) {
						$height = 24;
					}
					else if($currTableName == "teacher") {
						$height = 35;
					}else if($currTableName == "class"){
						$height = 21;
					}else if($currTableName == "room") {
						if (strpos($currEntry["roomShortName"],'AC') === false ) {
							$height = 33;
						}else {
							$height = 21;
						}
					}
					$objPHPExcel->getActiveSheet()->getRowDimension($row_tmp)->setRowHeight($height);
					if($flag1 != 1)
						$objPHPExcel->getActiveSheet()->getColumnDimension($col)->setWidth($width);
					$objPHPExcel->getActiveSheet()->getStyle($col.$row_tmp)->getAlignment()->
											setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
					$objPHPExcel->getActiveSheet()->getStyle($col.$row_tmp)->getAlignment()->
											setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);

					$objPHPExcel->getActiveSheet()->getStyle($col.$row_tmp)->applyFromArray($styleArray);

					if (!$popo) {
						$row_tmp++;
					}else{
						$row_tmp +=2;
					}

				}
				$width = 9.5;//16.70;
			}
			$width = 9.5;
			if (this_day_entries($allrows2,$day) == 0) {
				$height = 10;
				$this_much_days = how_many_days_are_empty($allrows2);
				if ($this_much_days == 2) {
					$height = 37;
				}if ($this_much_days >= 3) {
					$height = 43;
				}
			}else if ($maxdayenty == 1) {
				$height = 30;
			}
			else if($currTableName == "teacher") {
				$height = 35;
			}else if($currTableName == "class"){
				$height = 21;
			}else if($currTableName == "room") {
				/*if (strpos($currEntry["roomShortName"],'AC') === false ) {
					$height = 33;
					ttlog("$height"."\n");
				}else { */ 
					$height = 21;
				//}
			}
			for ($row_tmp=$row; $row_tmp <= $row+$maxdayenty; $row_tmp++) {
				$objPHPExcel->getActiveSheet()->getRowDimension($row_tmp)->setRowHeight($height);
				if($flag1 != 1)
					$objPHPExcel->getActiveSheet()->getColumnDimension($col)->setWidth($width);
				$objPHPExcel->getActiveSheet()->getStyle($col.$row_tmp)->getAlignment()->
				setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
				$objPHPExcel->getActiveSheet()->getStyle($col.$row_tmp)->getAlignment()->
				setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);

				$objPHPExcel->getActiveSheet()->getStyle($col.$row_tmp)->applyFromArray($styleArray);
			}

		}
		if ($maxdayenty !=0) {
			$rowshift += $maxdayenty;
		}else {
			$rowshift++;
		}
	}
	$row = $row+2;
	$col = 'E';
	$objPHPExcel->getActiveSheet()->getCell($col.$row)->setValue("Total Hours");
	$objPHPExcel->getActiveSheet()->getStyle($col.$row)->applyFromArray($styleArray);
	$col = 'F';
	$objPHPExcel->getActiveSheet()->getCell($col.$row)->setValue(countTotalLoad_excel($allrows2));
	$objPHPExcel->getActiveSheet()->getStyle($col.$row)->applyFromArray($styleArray);
}
function generate_workload_worksheet($sheetCount,$allrows2,$deptName,$currentSnapshotName) {
	global $objPHPExcel;
	if($sheetCount == 0)
		$sheetName = "Subject_Load";
	else if($sheetCount == 1)
		$sheetName = "Teacher_Load1";
	else
		$sheetName = "Teacher_Load2";
	$myWorkSheet = new PHPExcel_Worksheet($objPHPExcel, $sheetName);
	$objPHPExcel->addSheet($myWorkSheet, $sheetCount);
	$objPHPExcel->setActiveSheetIndex($sheetCount);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
	$objPHPExcel->getActiveSheet()->getPageMargins()->setTop(0.5);
	$objPHPExcel->getActiveSheet()->getPageMargins()->setRight(0.3);
	$objPHPExcel->getActiveSheet()->getPageMargins()->setLeft(0.3);
	$objPHPExcel->getActiveSheet()->getPageMargins()->setBottom(0.5);
	$cols = array('A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
			'AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT',
			'AU','AV','AW','AX','AY','AZ','BA','BB','BC','BD','BE','BF','BG','BH','BI','BJ','BK','BL','BM','BN',
			'BO','BP','BQ','BR','BS','BT','BU','BV','BW','BX','BY','BZ','CA','CB','CC','CD','CE','CF','CG','CH',
			'CI','CJ','CK','CL','CM','CN','CO','CP','CQ','CR','CS','CT','CU','CV','CW','CX','CY','CZ');
	$text = array("College of Engineering, Pune", $deptName, $sheetName." For Snapshot : $currentSnapshotName");
	if($sheetCount == 0){
		for($x = 0; $x < count($text); $x++) {
			$xx = $x + 1;
			$objRichText = new PHPExcel_RichText();
			$currText = $objRichText->createTextRun($text[$x]);
			$currText->getFont()->setBold(true);
			$currText->getFont()->setSize(16);
			$currText->getFont()->setColor( new PHPExcel_Style_Color(PHPExcel_Style_Color::COLOR_DARKGREEN ) );
			$objPHPExcel->getActiveSheet()->getCell('A'.$xx)->setValue($objRichText);
			$objPHPExcel->getActiveSheet()->getRowDimension($xx)->setRowHeight(18);
			$objPHPExcel->getActiveSheet()->mergeCells("A$xx:G$xx");
			$objPHPExcel->getActiveSheet()->getStyle('A'.$xx)->getAlignment()->
									setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		}
		$rowshift = count($text) + 3;
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
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(15);
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(15);
		$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(15);
		$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(15);
		$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(15);
		$cols2 = array("Subject", "Class/Batch", "Teacher", "Semester", "Load");
		$colsdb = array("subjectShortName","Class_Batch","teacherShortName","semester","load1");
		for($k = 0; $k < count($cols2); $k++) {
			$colname = $cols2[$k];
			$objRichText = new PHPExcel_RichText();
			$currText = $objRichText->createTextRun($colname);
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
		for($col = 0; $col <= 4; $col++)
			$widths[$col] = 10.5;
		for($row1 = 0; $row1 < count($allrows2); $row1++) {
			for($col1 = 0; $col1 < count($colsdb); $col1++) {
				$row = $row1 - 1 + $rowshift;
				$col = $cols[$col1 + $colshift];
				$colname = $colsdb[$col1];
				$text = $allrows2[$row1][$colname];
				$objRichText = new PHPExcel_RichText();
				$currText = $objRichText->createTextRun($text);
				$currText->getFont()->setBold(true);
				$currText->getFont()->setSize(10);
				$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
				$objPHPExcel->getActiveSheet()->getCell($cols[$col1+$colshift].$rowshift)->setValue($objRichText);
				$objPHPExcel->getActiveSheet()->getStyle($cols[$col1+$colshift].$rowshift)->getAlignment()->
										setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
				$objPHPExcel->getActiveSheet()->getStyle($cols[$col1+$colshift].$rowshift)->getAlignment()->
										setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
				$objPHPExcel->getActiveSheet()->getStyle($cols[$col1+$colshift].$rowshift)->applyFromArray($styleArray);
			}
			$rowshift++;
		}
	}
	else if($sheetCount == 1){
		for($x = 0; $x < count($text); $x++) {
			$xx = $x + 1;
			$objRichText = new PHPExcel_RichText();
			$currText = $objRichText->createTextRun($text[$x]);
			$currText->getFont()->setBold(true);
			$currText->getFont()->setSize(16);
			$currText->getFont()->setColor( new PHPExcel_Style_Color(PHPExcel_Style_Color::COLOR_DARKGREEN ) );
			$objPHPExcel->getActiveSheet()->getCell('A'.$xx)->setValue($objRichText);
			$objPHPExcel->getActiveSheet()->getRowDimension($xx)->setRowHeight(18);
			$objPHPExcel->getActiveSheet()->mergeCells("A$xx:P$xx");
			$objPHPExcel->getActiveSheet()->getStyle('A'.$xx)->getAlignment()->
									setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		}
		$rowshift = count($text) + 3;
		$colshift = 0;
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
		$abbrevations = "Sub -> Subject, C/B -> Class/Batch, Sem -> Semester, L -> Load, TL -> Total Load";
		$objRichText = new PHPExcel_RichText();
		$xx++;
		$currText = $objRichText->createTextRun($abbrevations);
		$currText->getFont()->setBold(true);
		$currText->getFont()->setSize(13);
		$currText->getFont()->setColor( new PHPExcel_Style_Color(PHPExcel_Style_Color::COLOR_BLACK ) );
		$objPHPExcel->getActiveSheet()->getCell('A'.$xx)->setValue($objRichText);
		$objPHPExcel->getActiveSheet()->getRowDimension($xx)->setRowHeight(18);
		$objPHPExcel->getActiveSheet()->mergeCells("A$xx:P$xx");
		$objPHPExcel->getActiveSheet()->getStyle('A'.$xx)->getAlignment()->
								setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$rowshift++;
		$cols2 = array("Teacher", "Sub", "C/B", "Sem", "L", "TL");
		$colsdb = array("teacherShortName","subjectShortName","Class_Batch","semester","load1");
		$count = 1;
		$max = $count;
		for($row1 = 0; $row1 < count($allrows2); $row1++) {
			$colname = $colsdb[0];
			if(strcmp($allrows2[$row1][$colname],$allrows2[$row1 + 1][$colname]) === 0){
				$count++;
			}
			else{
				if($count > $max)
					$max = $count;
				$count = 1;
			}
		}
		$text = $cols2[0];
		$objRichText = new PHPExcel_RichText();
		$currText = $objRichText->createTextRun($text);
		$currText->getFont()->setBold(true);
		$currText->getFont()->setSize(13);
		$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
		$objPHPExcel->getActiveSheet()->getCell($cols[$colshift].$rowshift)->setValue($objRichText);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$colshift].$rowshift)->getAlignment()->
								setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$colshift].$rowshift)->getAlignment()->
								setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$colshift].$rowshift)->applyFromArray($styleArray);
		$count = 0;
		for($col1 = 1; $col1 <= $max; $col1++){
			for($i = 1; $i < count($cols2)-1; $i++){
				$count++;
				$text = $cols2[$i].$col1;
				$objRichText = new PHPExcel_RichText();
				$currText = $objRichText->createTextRun($text);
				$currText->getFont()->setBold(true);
				$currText->getFont()->setSize(13);
				$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
				$objPHPExcel->getActiveSheet()->getCell($cols[$count+$colshift].$rowshift)->
									setValue($objRichText);
				$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->getAlignment()->
									setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
				$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->getAlignment()->
									setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
				$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->
									applyFromArray($styleArray);
			}
		}
		$count++;
		$text = $cols2[5];
		$objRichText = new PHPExcel_RichText();
		$currText = $objRichText->createTextRun($text);
		$currText->getFont()->setBold(true);
		$currText->getFont()->setSize(13);
		$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
		$objPHPExcel->getActiveSheet()->getCell($cols[$count+$colshift].$rowshift)->
								setValue($objRichText);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->getAlignment()->
								setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->getAlignment()->
								setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->
								applyFromArray($styleArray);
		$rowshift++;
		for($row1 = 0; $row1 < count($allrows2); $row1++) {
			$row = $row1 - 1 + $rowshift;
			$colname = $colsdb[0];
			$text = $allrows2[$row1][$colname];
			$objRichText = new PHPExcel_RichText();
			$currText = $objRichText->createTextRun($text);
			$currText->getFont()->setBold(true);
			$currText->getFont()->setSize(8);
			$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
			$objPHPExcel->getActiveSheet()->getCell($cols[$colshift].$rowshift)->setValue($objRichText);
			$objPHPExcel->getActiveSheet()->getStyle($cols[$colshift].$rowshift)->getAlignment()->
									setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle($cols[$colshift].$rowshift)->getAlignment()->
									setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle($cols[$colshift].$rowshift)->applyFromArray($styleArray);
			$colshift++;
			$col4 = 0;
			$load = 0;
			for($col1 = 0; $col1 < $max; $col1++) {
				for($col3 = 1; $col3 < count($colsdb); $col3++) {
					$row = $row1 - 1 + $rowshift;
					$col = $cols[$col1 + $colshift];
					$colname = $colsdb[$col3];
					$text = $allrows2[$row1][$colname];
					$objRichText = new PHPExcel_RichText();
					$currText = $objRichText->createTextRun($text);
					$currText->getFont()->setBold(true);
					$currText->getFont()->setSize(8);
					$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
					$objPHPExcel->getActiveSheet()->getCell($cols[$col4+$colshift].$rowshift)->setValue($objRichText);
					$objPHPExcel->getActiveSheet()->getStyle($cols[$col4+$colshift].$rowshift)->getAlignment()->
										setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
					$objPHPExcel->getActiveSheet()->getStyle($cols[$col4+$colshift].$rowshift)->getAlignment()->
										setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
					$objPHPExcel->getActiveSheet()->getStyle($cols[$col4+$colshift].$rowshift)->
										applyFromArray($styleArray);
					if($colname == "load1"){
						$load = $load + $text;
					}
					$col4++;
				}
				$x = $row1 + 1;
				if(strcmp($allrows2[$row1]["teacherShortName"],$allrows2[$x]["teacherShortName"]) === 0){
					$row1++;
				}
				else{
					$colshift = 0;
					break;
				}
			}
			$text = $load;
			$objRichText = new PHPExcel_RichText();
			$currText = $objRichText->createTextRun($text);
			$currText->getFont()->setBold(true);
			$currText->getFont()->setSize(8);
			$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
			$objPHPExcel->getActiveSheet()->getCell($cols[$count+$colshift].$rowshift)->setValue($objRichText);
			$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->getAlignment()->
									setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->getAlignment()->
									setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->
									applyFromArray($styleArray);
			$rowshift++;
		}
	}
	else {
		for($x = 0; $x < count($text); $x++) {
			$xx = $x + 1;
			$objRichText = new PHPExcel_RichText();
			$currText = $objRichText->createTextRun($text[$x]);
			$currText->getFont()->setBold(true);
			$currText->getFont()->setSize(16);
			$currText->getFont()->setColor( new PHPExcel_Style_Color(PHPExcel_Style_Color::COLOR_DARKGREEN ) );
			$objPHPExcel->getActiveSheet()->getCell('A'.$xx)->setValue($objRichText);
			$objPHPExcel->getActiveSheet()->getRowDimension($xx)->setRowHeight(18);
			$objPHPExcel->getActiveSheet()->mergeCells("A$xx:P$xx");
			$objPHPExcel->getActiveSheet()->getStyle('A'.$xx)->getAlignment()->
									setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		}
		$rowshift = count($text) + 3;
		$colshift = 0;
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
		$abbrevations = "Teacher, Subject, Class/Batch, Sem -> Semester, Load, TL -> Total Load";
		$objRichText = new PHPExcel_RichText();
		$xx++;
		$currText = $objRichText->createTextRun($abbrevations);
		$currText->getFont()->setBold(true);
		$currText->getFont()->setSize(13);
		$currText->getFont()->setColor( new PHPExcel_Style_Color(PHPExcel_Style_Color::COLOR_BLACK ) );
		$objPHPExcel->getActiveSheet()->getCell('A'.$xx)->setValue($objRichText);
		$objPHPExcel->getActiveSheet()->getRowDimension($xx)->setRowHeight(18);
		$objPHPExcel->getActiveSheet()->mergeCells("A$xx:P$xx");
		$objPHPExcel->getActiveSheet()->getStyle('A'.$xx)->getAlignment()->
								setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$rowshift++;
		$cols2 = array("Teacher", "Sub", "C/B", "Sem", "L", "TL");
		$colsdb = array("teacherShortName","subjectShortName","Class_Batch","semester","load1");
		$count = 1;
		$max = $count;
		for($row1 = 0; $row1 < count($allrows2); $row1++) {
			$colname = $colsdb[0];
			if(strcmp($allrows2[$row1][$colname],$allrows2[$row1 + 1][$colname]) === 0){
				$count++;
			}
			else{
				if($count > $max)
					$max = $count;
				$count = 1;
			}
		}
		$objRichText = new PHPExcel_RichText();
		$currText = $objRichText->createTextRun("Teacher");
		$currText->getFont()->setBold(true);
		$currText->getFont()->setSize(13);
		$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
		$objPHPExcel->getActiveSheet()->getCell($cols[$colshift].$rowshift)->setValue($objRichText);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$colshift].$rowshift)->getAlignment()->
								setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$colshift].$rowshift)->getAlignment()->
								setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$colshift].$rowshift)->applyFromArray($styleArray);

		$count = $max + 1;
		$objRichText = new PHPExcel_RichText();
		$currText = $objRichText->createTextRun("TL");
		$currText->getFont()->setBold(true);
		$currText->getFont()->setSize(13);
		$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
		$objPHPExcel->getActiveSheet()->getCell($cols[$count+$colshift].$rowshift)->
								setValue($objRichText);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->getAlignment()->
								setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->getAlignment()->
								setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
		$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->
								applyFromArray($styleArray);
		$rowshift++;
		for($row1 = 0,$i = 0; $row1 < count($allrows2); $row1++,$i++) {
			$colname = $colsdb[0];
			$text = $allrows2[$row1][$colname];
			$objRichText = new PHPExcel_RichText();
			$currText = $objRichText->createTextRun($text);
			$currText->getFont()->setBold(true);
			$currText->getFont()->setSize(8);
			$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
			$height = (34.27 * 4) / 2;
			$objPHPExcel->getActiveSheet()->getRowDimension($rowshift)->setRowHeight($height);
			$objPHPExcel->getActiveSheet()->getCell($cols[$colshift].$rowshift)->setValue($objRichText);
			$objPHPExcel->getActiveSheet()->getStyle($cols[$colshift].$rowshift)->getAlignment()->
									setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle($cols[$colshift].$rowshift)->getAlignment()->
									setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle($cols[$colshift].$rowshift)->applyFromArray($styleArray);
			$colshift++;
			$col4 = 0;
			$load = 0;
			for($col1 = 0; $col1 < $max; $col1++) {
				$objRichText = new PHPExcel_RichText();
				$text = $allrows2[$row1]["subjectShortName"];
				$currText = $objRichText->createTextRun($text."\n");
				$currText->getFont()->setBold(true);
				$currText->getFont()->setSize(8);
				$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
				$text = $allrows2[$row1]["Class_Batch"];
				$currText = $objRichText->createTextRun($text."\n");
				$currText->getFont()->setBold(true);
				$currText->getFont()->setSize(8);
				$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );
				$text = $allrows2[$row1]["semester"];
				$currText = $objRichText->createTextRun("Sem: ".$text."\n");
				$currText->getFont()->setBold(true);
				$currText->getFont()->setSize(8);
				$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKGREEN ) );
				$text = $allrows2[$row1]["load1"];
				$load = $load + $text;
				$currText = $objRichText->createTextRun("Load: ".$text."\n");
				$currText->getFont()->setBold(true);
				$currText->getFont()->setSize(8);
				$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKBLUE) );
				$objPHPExcel->getActiveSheet()->getCell($cols[$col4+$colshift].$rowshift)->setValue($objRichText);
				$objPHPExcel->getActiveSheet()->getStyle($cols[$col4+$colshift].$rowshift)->getAlignment()->
									setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
				$objPHPExcel->getActiveSheet()->getStyle($cols[$col4+$colshift].$rowshift)->getAlignment()->
									setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
				$objPHPExcel->getActiveSheet()->getStyle($cols[$col4+$colshift].$rowshift)->
									applyFromArray($styleArray);
				$col4++;
				$x = $row1 + 1;
				if(strcmp($allrows2[$row1]["teacherShortName"],$allrows2[$x]["teacherShortName"]) === 0){
					$row1++;
				}
				else{
					$colshift = 0;
					break;
				}
			}
			$text = $load;
			$objRichText = new PHPExcel_RichText();
			$currText = $objRichText->createTextRun($text);
			$currText->getFont()->setBold(true);
			$currText->getFont()->setSize(8);
			$currText->getFont()->setColor( new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_BLACK) );
			$objPHPExcel->getActiveSheet()->getCell($cols[$count+$colshift].$rowshift)->setValue($objRichText);
			$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->getAlignment()->
									setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->getAlignment()->
									setVertical(PHPExcel_Style_Alignment::VERTICAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle($cols[$count+$colshift].$rowshift)->
									applyFromArray($styleArray);
			$rowshift++;
		}
	}
}
function generate_timetable_spreadsheet() {
	//$tableNames = array("class", "classShortName", "teacher", "teacherShortName",
		//		"room", "roomShortName", "batch", "batchName");
	$tableNames = array("class", "classShortName", "teacher", "teacherShortName",
				"room", "roomShortName") ;
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

	$deptQuery = "SELECT deptName from dept d, config c, snapshot s ".
				"where s.configId = c.configId and c.deptId = d.deptId".
				" AND s.snapshotId = $currentSnapshotId";
	$deptQueryRes = sqlGetOneRow($deptQuery);
	$deptName = $deptQueryRes[0]["deptName"];
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
				$allrows2, $nSlots, $dayBegin, $slotDuration, $deptName);

			# print information about subject shortcut names, subject-teacher mapping

			$sheetCount++;
			if($currTableName == "class")
				classlegendPage($sheetCount,"classShortName", $searchParam);
			else if($currTableName == "teacher")
				teacherlegendPage($sheetCount,"teacherShortName", $searchParam);
			else if($currTableName == "room")
				roomlegendPage($sheetCount,"roomShortName", $searchParam);
			else if($currTableName == "batch")
				batchlegendPage($sheetCount,"batchShortName", $searchParam);

			$sheetCount++;
			ttlog("generate_timetable_spreadsheet: generated $currTableName $searchParam worksheet");
		}
	}
}
function generate_current_timetable_spreadsheet() {
	$query = "SELECT * from config WHERE configId = 1";
	$allrows = sqlGetAllRows($query);
	$currentSnapshotName = getArgument("snapshotName");
	$currentSnapshotId = getArgument("snapshotId");

	$nSlots = $allrows[0]["nSlots"];
	$dayBegin = $allrows[0]["dayBegin"];
	$slotDuration = $allrows[0]["slotDuration"];

	$sheetCount = 0;
	$deptQuery = "SELECT deptName from dept d, config c, snapshot s ".
				"where s.configId = c.configId and c.deptId = d.deptId".
				" AND s.snapshotId = $currentSnapshotId";
	$deptQueryRes = sqlGetOneRow($deptQuery);
	$deptName = $deptQueryRes[0]["deptName"];

	$currTableName = getArgument("tableName");
	if($currTableName == "class")
		$currParam = "classShortName";
	else if($currTableName == "teacher")
		$currParam = "teacherShortName";
	else if($currTableName == "room")
		$currParam = "roomShortName";
	else if($currTableName == "batch")
		$currParam = "batchName";

	$searchParam = getArgument("option");
	$query = "SELECT * FROM timeTableReadable WHERE  $currParam = \"$searchParam\" ".
					 "AND snapshotName = \"$currentSnapshotName\"";
	$allrows2 = sqlGetAllRows($query);

	generate_timetable_worksheet($currTableName, $searchParam, $sheetCount,
				$allrows2, $nSlots, $dayBegin, $slotDuration, $deptName);
	$sheetCount++;
	if($currTableName == "class")
		classlegendPage($sheetCount,"classShortName", $searchParam);
	else if($currTableName == "teacher")
		teacherlegendPage($sheetCount,"teacherShortName", $searchParam);
	else if($currTableName == "room")
		roomlegendPage($sheetCount,"roomShortName", $searchParam);
	else if($currTableName == "batch")
		batchlegendPage($sheetCount,"batchShortName", $searchParam);


}
function generate_workload_spreadsheet(){
	$query = "SELECT * from config WHERE configId = 1";
	$allrows = sqlGetAllRows($query);
	$currentSnapshotName = getArgument("snapshotName");
	$currentSnapshotId = getArgument("snapshotId");

	$sheetCount = 0;

	$deptQuery = "SELECT deptName from dept d, config c, snapshot s ".
				"where s.configId = c.configId and c.deptId = d.deptId".
				" AND s.snapshotId = $currentSnapshotId";
	$deptQueryRes = sqlGetOneRow($deptQuery);
	$deptName = $deptQueryRes[0]["deptName"];
	$query = "SELECT a.subjectShortName, a.classShortName as Class_Batch, a.teacherShortName, c.semester, (s.eachSlot*s.nSlots) as load1".
				" from ((subjectClassTeacherReadable a".
				" JOIN class c ON a.classShortName = c.classShortName)".
				" JOIN subject s ON a.subjectShortName = s.subjectShortName)".
				" where c.snapshotId = $currentSnapshotId and a.snapshotName = \"$currentSnapshotName\"".
				" and  s.snapshotId = $currentSnapshotId".
		" UNION".
		" SELECT a.subjectShortName, a.batchName as Class_Batch, a.teacherShortName, c.semester, (s.eachSlot*s.nSlots) as load1".
				" from subjectBatchTeacherReadable a, class c, batchClass bc, batch b, subject s".
				" where a.batchName = b.batchName and b.batchId = bc.batchId and bc.classId = c.classId".
				" and c.snapshotId = $currentSnapshotId and a.snapshotName = \"$currentSnapshotName\"".
				" and b.snapshotId = $currentSnapshotId and bc.snapshotId = $currentSnapshotId".
				" and s.snapshotId = $currentSnapshotId and a.subjectShortName = s.subjectShortName".
				" ORDER by subjectShortName ASC, Class_Batch ASC";
	$allrows2 = sqlGetAllRows($query);
	generate_workload_worksheet($sheetCount,$allrows2,$deptName,$currentSnapshotName);
	$sheetCount++;
	$query = "SELECT a.teacherShortName, a.subjectShortName, a.classShortName as Class_Batch,c.semester, (s.eachSlot*s.nSlots) as load1".
				" from ((subjectClassTeacherReadable a".
				" JOIN class c ON a.classShortName = c.classShortName)".
				" JOIN subject s ON a.subjectShortName = s.subjectShortName)".
				" where c.snapshotId = $currentSnapshotId and a.snapshotName = \"$currentSnapshotName\"".
				" and  s.snapshotId = $currentSnapshotId".
		" UNION".
		" SELECT a.teacherShortName, a.subjectShortName, a.batchName as Class_Batch, c.semester, (s.eachSlot*s.nSlots) as load1".
				" from subjectBatchTeacherReadable a, class c, batchClass bc, batch b, subject s".
				" where a.batchName = b.batchName and b.batchId = bc.batchId and bc.classId = c.classId".
				" and c.snapshotId = $currentSnapshotId and a.snapshotName = \"$currentSnapshotName\"".
				" and b.snapshotId = $currentSnapshotId and bc.snapshotId = $currentSnapshotId".
				" and s.snapshotId = $currentSnapshotId and a.subjectShortName = s.subjectShortName".
				" ORDER by teacherShortName ASC, subjectShortName ASC, Class_Batch ASC";
	$allrows2 = sqlGetAllRows($query);
	generate_workload_worksheet($sheetCount,$allrows2,$deptName,$currentSnapshotName);
	$sheetCount++;
	generate_workload_worksheet($sheetCount,$allrows2,$deptName,$currentSnapshotName);
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
	$filename = sys_get_temp_dir()."/".$filename;
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
function exportCurrentXLSX() {
	global $objPHPExcel;
	$option = getArgument("option");
	$objPHPExcel = new PHPExcel();
	$objPHPExcel->getProperties()->setCreator("Abhijit A.M.")
						->setLastModifiedBy("Abhijit A. M.")
						->setTitle("Timetable for COEP")
						->setSubject("Subject for Timetable")
						->setDescription("This is description of timetable")
						->setKeywords("timetable generated");

	generate_current_timetable_spreadsheet();
	$savefilename = $option."_timetable.EXT";
	$filename = saveFile($savefilename);
	return $filename;
}
function exportWorkloadXLSX(){
	global $objPHPExcel;
	$objPHPExcel = new PHPExcel();
	$objPHPExcel->getProperties()->setCreator("Abhijit A.M.")
						->setLastModifiedBy("Abhijit A. M.")
						->setTitle("Timetable for COEP")
						->setSubject("Subject for Timetable")
						->setDescription("This is description of timetable")
						->setKeywords("timetable generated");

	generate_workload_spreadsheet();
	$savefilename = "workload.EXT";
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
	$currentSnapshotName = getArgument("snapshotName");
	$currentSnapshotId = getArgument("snapshotId");

	if(!file_exists("tmp"))
		mkdir("tmp");
	if(!file_exists("tmp/timetable"))
		mkdir("tmp/timetable");
	$tableNames = array(
		"teacherReadable", "name",
			["teacherShortName", "teacherName", "minHrs", "maxHrs", "deptShortName"],
		"room", "id", ["roomShortName", "roomName", "roomCount"],
		"subject", "id", ["subjectShortName", "subjectName", "eachSlot", "nSlots", "batches"],
		"class", "id", ["classShortName", "className", "classCount"],
		"batch","id", ["batchName", "batchCount"],
		"batchClassReadable", "name", ["batchName", "classShortName"],
		"batchCanOverlapReadable", "name",
			["b1Name", "b2Name"],
		"overlappingSBTReadable", "name", ["subject1", "batch1", "teacher1", "subject2", "batch2", "teacher2"],
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
function classlegendPage( $sheetCount,$currParam, $searchParam) {
	global $objPHPExcel;
	$objWorkSheet = $objPHPExcel->createSheet($sheetCount); //Setting index when creating
	$objWorkSheet->setTitle("Legend Page".$searchParam);
	$currentSnapshotId = getArgument("snapshotId");
	$currentSnapshotName = getArgument("snapshotName");
	$currTableName = getArgument("tableName");
	$objPHPExcel->setActiveSheetIndex($sheetCount);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setFitToPage(true);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setFitToWidth(1);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setFitToHeight(0);
	$styleArray = array(
		'borders' => array(
			'allborders' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN
				)
		)
	);
	$query = "select distinct(A.roomShortName), roomName from (select distinct(roomShortName) ".
	" from timeTableReadable where roomShortName is not null and ".
	" snapshotName = 'default' and classShortName = \"$searchParam\") as A ".
	" inner join room on room.roomShortName = A.roomShortName";
	$allrows2 = sqlGetAllRows($query);
	$objWorkSheet->setCellValue('A1',"Room Short Name");
	$objWorkSheet->setCellValue('B1',"Room Name");
	for($i=0; $i < count($allrows2); $i++){
			$objWorkSheet->setCellValue(("A".($i+2)),$allrows2[$i]['roomShortName']);
			$objWorkSheet->setCellValue(("B".($i+2)),$allrows2[$i]['roomName']);
	}
	$objPHPExcel->getActiveSheet()->getStyle("A1:B".($i+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
	$objPHPExcel->getActiveSheet()->getStyle("A1:B".($i+1))->applyFromArray($styleArray);



	$query = "select distinct(A.subjectShortName), subjectName from (select distinct(subjectShortName) ".
	" from timeTableReadable where subjectShortName is not null and ".
	" snapshotName = \"$currentSnapshotName\" and classShortName = \"$searchParam\") as A inner ".
	" join subject on subject.subjectShortName = A.subjectShortName";
	$allrows2 = sqlGetAllRows($query);
	$objWorkSheet->setCellValue('G1',"Subject Short Name");
	$objWorkSheet->setCellValue('H1',"Subject Name");
	for($i=0; $i < count($allrows2); $i++){
			$objWorkSheet->setCellValue(("G".($i+2)),$allrows2[$i]['subjectShortName']);
			$objWorkSheet->setCellValue(("H".($i+2)),$allrows2[$i]['subjectName']);
	}
	$objPHPExcel->getActiveSheet()->getStyle("G1:H".($i+1))->applyFromArray($styleArray);
	$objPHPExcel->getActiveSheet()->getStyle("G1:G".($i+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );
	$objPHPExcel->getActiveSheet()->getStyle("H1:H".($i+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
	$objWorkSheet->setCellValue('D1',"Subject Short Name: Batch Names");
	$objWorkSheet->setCellValue('E1',"Teacher Name");
	$l = 2;
	$query = "select distinct(T.teacherShortName), teacherName from (select distinct(teacherShortName)".
	" from timeTableReadable where snapshotName = \"$currentSnapshotName\" and classShortName = \"$searchParam\" and ".
	" teacherShortName is not null) as T inner join teacher on teacher.teacherShortName = T.teacherShortName";
	$teacherShortName = sqlGetAllRows($query);
	for($i=0; $i < count($teacherShortName); $i++){
		$name = $teacherShortName[$i]['teacherShortName'];
			$query = "select DISTINCT subjectShortName from timeTableReadable where ".
			" snapshotName = \"$currentSnapshotName\" and classShortName = \"$searchParam\" and".
			" teacherShortName = \"$name\" and teacherShortName is not null and subjectShortName is not null";
			$subjectShortName = sqlGetAllRows($query);

			for($k=0; $k < count($subjectShortName); $k++){
				$subject = $subjectShortName[$k]['subjectShortName'];
				$query = "select DISTINCT batchName from timeTableReadable where ".
				" snapshotName = \"$currentSnapshotName\" and classShortName = \"$searchParam\" and ".
				" teacherShortName = \"$name\" and subjectShortName = \"$subject\" and batchName is not null";
				$batchName = sqlGetAllRows($query);
				$str = "";
				for($m = 0; $m < count($batchName); $m++){
					$str .= $batchName[$m]['batchName'];
					if($m+1 < count($batchName)){
						$str .= ", ";
					}
				}
				if(strlen($str) == 0 ){
					$objWorkSheet->setCellValue(("D".($l)), $subject);

				}
				else{
					$str = $subjectShortName[$k]['subjectShortName'].": ".$str;
					$objWorkSheet->setCellValue(("D".($l)), $str);
				}
				$objWorkSheet->setCellValue(("E".($l)), $teacherShortName[$i]['teacherName']);
				$l++;
			}

	}
	foreach(range('A','H') as $columnID) {
		$objPHPExcel->getActiveSheet()->getColumnDimension($columnID)
			->setAutoSize(true);
	}
	$objPHPExcel->getActiveSheet()->getStyle( "A1:H50")
                            ->getAlignment( )
                            ->setHorizontal( PHPExcel_Style_Alignment::HORIZONTAL_CENTER )
                            ->setVertical( PHPExcel_Style_Alignment::VERTICAL_CENTER )
                    ;
	//$objPHPExcel->getActiveSheet()->getColumnDimensionByColumn('H')->setAutoSize(true);
	$objPHPExcel->getActiveSheet()->getStyle("D1:E".($l-1))->applyFromArray($styleArray);

	$objPHPExcel->getActiveSheet()->getStyle("D1:D".($l+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );
	$objPHPExcel->getActiveSheet()->getStyle("E1:E".($l+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKBLUE) );
	$objPHPExcel->getActiveSheet()->getStyle("A1:H1")->getFont()->setBold(true)->setName('Verdana')->setSize(10);
	return 0;
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
function batchlegendPage( $sheetCount,$currParam, $searchParam){
	global $objPHPExcel;
	$objWorkSheet = $objPHPExcel->createSheet($sheetCount); //Setting index when creating
	$objWorkSheet->setTitle("Legend Page".$searchParam);
	$currentSnapshotId = getArgument("snapshotId");
	$currentSnapshotName = getArgument("snapshotName");
	$currTableName = getArgument("tableName");
	$objPHPExcel->setActiveSheetIndex($sheetCount);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setFitToPage(true);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setFitToWidth(1);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setFitToHeight(0);
	$styleArray = array(
		'borders' => array(
			'allborders' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN
				)
		)
	);
	$query = "select distinct(A.roomShortName), roomName from (select distinct(roomShortName) from timeTableReadable ".
	" where roomShortName is not null and snapshotName = 'default' and batchName = \"$searchParam\") as ".
	" A inner join room on room.roomShortName = A.roomShortName";
	$allrows2 = sqlGetAllRows($query);
	$objWorkSheet->setCellValue('A1',"Room Short Name");
	$objWorkSheet->setCellValue('B1',"Room Name");
	for($i=0; $i < count($allrows2); $i++){
			$objWorkSheet->setCellValue(("A".($i+2)),$allrows2[$i]['roomShortName']);
			$objWorkSheet->setCellValue(("B".($i+2)),$allrows2[$i]['roomName']);
	}
	$objPHPExcel->getActiveSheet()->getStyle("A1:B".($i+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
	$objPHPExcel->getActiveSheet()->getStyle("A1:B".($i+1))->applyFromArray($styleArray);
	$query = "select classShortName from batchClassReadable where batchName = \"$searchParam\"";
	$className = sqlGetAllRows($query);
	$className = $className[0]['classShortName'];


	$query = "select distinct(A.subjectShortName), subjectName from (select distinct(subjectShortName) ".
	" from timeTableReadable where subjectShortName is not null and ".
	" snapshotName = \"$currentSnapshotName\" and (batchName = \"$searchParam\" or batchName is null) ".
	" and classShortName = \"$className\") as A inner join subject on subject.subjectShortName = A.subjectShortName";
	$allrows2 = sqlGetAllRows($query);
	$objWorkSheet->setCellValue('G1',"Subject Short Name");
	$objWorkSheet->setCellValue('H1',"Subject Name");
	for($i=0; $i < count($allrows2); $i++){
			$objWorkSheet->setCellValue(("G".($i+2)),$allrows2[$i]['subjectShortName']);
			$objWorkSheet->setCellValue(("H".($i+2)),$allrows2[$i]['subjectName']);
	}
	$objPHPExcel->getActiveSheet()->getStyle("G1:H".($i+1))->applyFromArray($styleArray);
	$objPHPExcel->getActiveSheet()->getStyle("G1:G".($i+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );
	$objPHPExcel->getActiveSheet()->getStyle("H1:H".($i+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
	$objWorkSheet->setCellValue('D1',"Subject Short Name");
	$objWorkSheet->setCellValue('E1',"Teacher Name");
	$l = 2;


	$query = "select distinct(T.teacherShortName), teacherName from (select distinct(teacherShortName) ".
	" from timeTableReadable where snapshotName = \"$currentSnapshotName\" and teacherShortName ".
	" is not NULL and (batchName = \"$searchParam\" or batchName is null) and classShortName = \"$className\") ".
	" as T inner join teacher on teacher.teacherShortName = T.teacherShortName";
	$teacherShortName = sqlGetAllRows($query);
	for($i=0; $i < count($teacherShortName); $i++){
		$name = $teacherShortName[$i]['teacherShortName'];
			$query = "select DISTINCT subjectShortName from timeTableReadable where ".
			" snapshotName = \"$currentSnapshotName\" and teacherShortName = \"$name\" and ".
			" teacherShortName is not null and subjectShortName is not null and (batchName = \"$searchParam\" or ".
			" batchName is null) and classShortName = \"$className\" ";
			$subjectShortName = sqlGetAllRows($query);

			for($k=0; $k < count($subjectShortName); $k++){
				$subject = $subjectShortName[$k]['subjectShortName'];
				$objWorkSheet->setCellValue(("D".($l)), $subject);
				$objWorkSheet->setCellValue(("E".($l)), $teacherShortName[$i]['teacherName']);
				$l++;
			}

	}
	foreach(range('A','H') as $columnID) {
		$objPHPExcel->getActiveSheet()->getColumnDimension($columnID)
			->setAutoSize(true);
	}
	$objPHPExcel->getActiveSheet()->getStyle( "A1:H50")
                            ->getAlignment( )
                            ->setHorizontal( PHPExcel_Style_Alignment::HORIZONTAL_CENTER )
                            ->setVertical( PHPExcel_Style_Alignment::VERTICAL_CENTER )
                    ;
	//$objPHPExcel->getActiveSheet()->getColumnDimensionByColumn('H')->setAutoSize(true);
	$objPHPExcel->getActiveSheet()->getStyle("D1:E".($l-1))->applyFromArray($styleArray);

	$objPHPExcel->getActiveSheet()->getStyle("D1:D".($l+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );
	$objPHPExcel->getActiveSheet()->getStyle("E1:E".($l+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKBLUE) );
	$objPHPExcel->getActiveSheet()->getStyle("A1:H1")->getFont()->setBold(true)->setName('Verdana')->setSize(10);
	return 0;
}
function roomlegendPage( $sheetCount,$currParam, $searchParam){
	global $objPHPExcel;
	$objWorkSheet = $objPHPExcel->createSheet($sheetCount); //Setting index when creating
	$objWorkSheet->setTitle("Legend Page".$searchParam);
	$currentSnapshotId = getArgument("snapshotId");
	$currentSnapshotName = getArgument("snapshotName");
	$currTableName = getArgument("tableName");
	$objPHPExcel->setActiveSheetIndex($sheetCount);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setFitToPage(true);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setFitToWidth(1);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setFitToHeight(0);
	$styleArray = array(
		'borders' => array(
			'allborders' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN
				)
		)
	);

	$query = "select distinct(A.subjectShortName), subjectName from (select distinct(subjectShortName) from ".
	" timeTableReadable where subjectShortName is not null and snapshotName = \"$currentSnapshotName\" and ".
	" roomShortName = \"$searchParam\") as A inner join subject on subject.subjectShortName = A.subjectShortName";
	$allrows2 = sqlGetAllRows($query);
	$objWorkSheet->setCellValue('A1',"Subject Short Name");
	$objWorkSheet->setCellValue('B1',"Subject Name");
	for($i=0; $i < count($allrows2); $i++){
			$objWorkSheet->setCellValue(("A".($i+2)),$allrows2[$i]['subjectShortName']);
			$objWorkSheet->setCellValue(("B".($i+2)),$allrows2[$i]['subjectName']);
	}
	$objPHPExcel->getActiveSheet()->getStyle("A1:B".($i+1))->applyFromArray($styleArray);
	$objPHPExcel->getActiveSheet()->getStyle("A1:A".($i+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );
	$objPHPExcel->getActiveSheet()->getStyle("B1:B".($i+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
	$objWorkSheet->setCellValue('D1',"Subject Short Name: Batch Names");
	$objWorkSheet->setCellValue('E1',"Teacher Name");
	$l = 2;
	$query = "select distinct(T.teacherShortName), teacherName from (select distinct(teacherShortName) from ".
	" timeTableReadable where snapshotName = \"$currentSnapshotName\" and roomShortName = \"$searchParam\" and ".
	" teacherShortName is not null) as T inner join teacher on teacher.teacherShortName = T.teacherShortName";
	$teacherShortName = sqlGetAllRows($query);
	for($i=0; $i < count($teacherShortName); $i++){
		$name = $teacherShortName[$i]['teacherShortName'];
			$query = "select DISTINCT subjectShortName from timeTableReadable where ".
			" snapshotName = \"$currentSnapshotName\" and roomShortName = \"$searchParam\" and ".
			" teacherShortName = \"$name\" and teacherShortName is not null and subjectShortName is not null";
			$subjectShortName = sqlGetAllRows($query);

			for($k=0; $k < count($subjectShortName); $k++){
				$subject = $subjectShortName[$k]['subjectShortName'];
				$query = "select DISTINCT batchName from timeTableReadable where ".
				" snapshotName = \"$currentSnapshotName\" and roomShortName = \"$searchParam\" and ".
				" teacherShortName = \"$name\" and subjectShortName = \"$subject\" and batchName is not null";
				$batchName = sqlGetAllRows($query);
				$str = "";
				for($m = 0; $m < count($batchName); $m++){
					$str .= $batchName[$m]['batchName'];
					if($m+1 < count($batchName)){
						$str .= ", ";
					}
				}
				if(strlen($str) == 0 ){
					$objWorkSheet->setCellValue(("D".($l)), $subject);

				}
				else{
					$str = $subjectShortName[$k]['subjectShortName'].": ".$str;
					$objWorkSheet->setCellValue(("D".($l)), $str);
				}
				$objWorkSheet->setCellValue(("E".($l)), $teacherShortName[$i]['teacherName']);
				$l++;
			}

	}
	foreach(range('A','H') as $columnID) {
		$objPHPExcel->getActiveSheet()->getColumnDimension($columnID)
			->setAutoSize(true);
	}
	$objPHPExcel->getActiveSheet()->getStyle( "A1:E50")
                            ->getAlignment( )
                            ->setHorizontal( PHPExcel_Style_Alignment::HORIZONTAL_CENTER )
                            ->setVertical( PHPExcel_Style_Alignment::VERTICAL_CENTER )
                    ;
	//$objPHPExcel->getActiveSheet()->getColumnDimensionByColumn('H')->setAutoSize(true);
	$objPHPExcel->getActiveSheet()->getStyle("D1:E".($l-1))->applyFromArray($styleArray);

	$objPHPExcel->getActiveSheet()->getStyle("D1:D".($l+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );
	$objPHPExcel->getActiveSheet()->getStyle("E1:E".($l+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKBLUE) );
	$objPHPExcel->getActiveSheet()->getStyle("A1:E1")->getFont()->setBold(true)->setName('Verdana')->setSize(10);
}
function teacherlegendPage( $sheetCount,$currParam, $searchParam){
	global $objPHPExcel;
	$objWorkSheet = $objPHPExcel->createSheet($sheetCount); //Setting index when creating
	$objWorkSheet->setTitle("Legend Page".$searchParam);
	$currentSnapshotId = getArgument("snapshotId");
	$currentSnapshotName = getArgument("snapshotName");
	$currTableName = getArgument("tableName");
	$objPHPExcel->setActiveSheetIndex($sheetCount);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setOrientation(PHPExcel_Worksheet_PageSetup::ORIENTATION_LANDSCAPE);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setPaperSize(PHPExcel_Worksheet_PageSetup::PAPERSIZE_A4);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setFitToPage(true);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setFitToWidth(1);
	$objPHPExcel->getActiveSheet()->getPageSetup()->setFitToHeight(0);
	$styleArray = array(
		'borders' => array(
			'allborders' => array(
					'style' => PHPExcel_Style_Border::BORDER_THIN
				)
		)
	);
	$query = "select distinct(A.roomShortName), roomName from (select distinct(roomShortName) ".
	" from timeTableReadable where roomShortName is not null and snapshotName = 'default' and ".
	" teacherShortName = '$searchParam') as A inner join room on room.roomShortName = A.roomShortName";
	$allrows2 = sqlGetAllRows($query);
	$objWorkSheet->setCellValue('A1',"Room short name");
	$objWorkSheet->setCellValue('B1',"Room name");
	for($i=0; $i < count($allrows2); $i++){
			$objWorkSheet->setCellValue(("A".($i+2)),$allrows2[$i]['roomShortName']);
			$objWorkSheet->setCellValue(("B".($i+2)),$allrows2[$i]['roomName']);
	}
	$objPHPExcel->getActiveSheet()->getStyle("A1:B".($i+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
	$objPHPExcel->getActiveSheet()->getStyle("A1:B".($i+1))->applyFromArray($styleArray);
	$query = "select distinct(A.subjectShortName), subjectName from (select distinct(subjectShortName) ".
	" from timeTableReadable where subjectShortName is not null and snapshotName = \"$currentSnapshotName\" and ".
	" teacherShortName = \"$searchParam\") as A inner join subject on subject.subjectShortName = A.subjectShortName";
	$allrows2 = sqlGetAllRows($query);
	$objWorkSheet->setCellValue('D1',"Subject Short Name");
	$objWorkSheet->setCellValue('E1',"Subject Name");
	for($i=0; $i < count($allrows2); $i++){
			$objWorkSheet->setCellValue(("D".($i+2)),$allrows2[$i]['subjectShortName']);
			$objWorkSheet->setCellValue(("E".($i+2)),$allrows2[$i]['subjectName']);
	}
	$objPHPExcel->getActiveSheet()->getStyle("D1:E".($i+1))->applyFromArray($styleArray);
	$objPHPExcel->getActiveSheet()->getStyle("D1:E".($i+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKRED) );
	$objPHPExcel->getActiveSheet()->getStyle("D1:D".($i+1))->getFont()->setSize(8)->setColor(
		new PHPExcel_Style_Color( PHPExcel_Style_Color::COLOR_DARKYELLOW) );
	foreach(range('A','H') as $columnID) {
		$objPHPExcel->getActiveSheet()->getColumnDimension($columnID)
			->setAutoSize(true);
	}
	$objPHPExcel->getActiveSheet()->getStyle( "A1:E50")
                            ->getAlignment( )
                            ->setHorizontal( PHPExcel_Style_Alignment::HORIZONTAL_CENTER )
                            ->setVertical( PHPExcel_Style_Alignment::VERTICAL_CENTER )
                    ;
	$objPHPExcel->getActiveSheet()->getStyle("A1:E1")->getFont()->setBold(true)->setName('Verdana')->setSize(10);
}

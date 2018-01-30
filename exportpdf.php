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

require_once('./fpdf-easytable/exfpdf.php');
require_once('./fpdf-easytable/easyTable.php');

// Global variable for name of output file (for PDF purpose: single and multiple )
$path = '';
$filename = '';

function printRow($rowData, $table, $rowspan, $searchParam) { // $rowspan is rowspan for visible cell
	$filledRows = array_fill(0, count($rowData), 0); // each element is count of virtual rows filled
	$count = array_fill(0, count($rowData), 0); // each element is rows printed from $rowData
	for($i = 0;$i < $rowspan;$i++) { // for each virtual row in a day slot
		for($j = 0;$j < count($rowData);$j++) { // for each cell in a row
			if($filledRows[$j] == $i) {
				$blankRows = $rowspan - count($rowData[$j]);
				if($i == 0 && count($rowData[$j]) == 1) {
					$virtualRowspan = $rowspan;
					$style = "valign:M;";
				}
				else if($i == 0) {
					$virtualRowspan = floor($blankRows / 2) + 1;
					$style = "valign:B;";
				}
				else if($count[$j] == ( count($rowData[$j]) - 1 ) ) {
					$virtualRowspan = ceil($blankRows / 2) + 1;
					$style = "valign:T;";
				}
				else
					$virtualRowspan = 1;
				$filledRows[$j] += $virtualRowspan;
				$style .= "font-size:10; paddingY:0.4";
				for($k = 0;$k < count($rowData[$j][$count[$j]]);$k++) {
					$table->easyCell($rowData[$j][$count[$j]][$k]['str'],$rowData[$j][$count[$j]][$k]['style']."rowspan:".$virtualRowspan.";".$style);
				}
				$count[$j] += 1;
			}
		}
		$table->printRow();
	}
}
function countTotalLoad($allrows2) {
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
/* Pseudo-code ->
Create a pdf object
set all attributes for pdf document
for each day
	for each slot
		fetch all entries in a slot
		(for multiple column spanning entries,
		consider all the columns spanned by that entry as single slot and)
		create multidimensional array similar to helperTable in timetable.js
		In this helpertable each entry has associated colspan.
		store entries of a slot in an array cellData
		store cellData in an array rowData
	store array rowData in array tableData(tableData is helperTable)
adjust column width of table for empty columns, columns with at max single entry and columns with multiple entries.
pass each entry in tableData to printRow() which actually renders the row in pdf document.
for legend page create mappings of subject-teacher, subjectShortName-subject, roomShortName-Room mappings
save the pdf document to tmp/timetable_pdf/ directory

structure of tableData(helperTable)
array(**this is tableData**
		array(**this is rowData**
			array(**this is cellData**
				array(string, style of the string) /This are
				array(string, style of the string) /the entries in
				array(string, style of the string) /timetable slot
				.
				.
				.
			)
			.
			.
			.
			.
			maximum cells equal to no of slots in a day
		)
		.
		.
		.
		.
		rows equal to count of days
	)
style of a string contains fontColor of string, colspan for the entry(for overlapping entries in a slot colspan can be different))
*/
$cellData;
function generate_timetable_pdf($currTableName, $searchParam, $allrows2, $nSlots, $dayBegin,
		$slotDuration, $deptName) {
	$pdf = new exFPDF('L', 'mm', 'A3');
	$pdf->setTitle("Timetable for COEP");
	$pdf->setSubject("Subject for Timetable");
	$pdf->setKeywords("timetable generated");

	$snapshotId = getArgument("snapshotId");
	$pdf->AddPage(); //page for timetable
	$pdf->setMargins(5, 5, 5);
	$pdf->SetAutoPageBreak(false, 5);
	$pdf->SetFont('helvetica','B',16);
	$pdf->setTextColor(34, 139, 34);
	$pdf->setY(5);

	$pdf->Cell(0, 6, "College of Engineering Pune", 0, 1, 'C');
	$pdf->SetFont('helvetica','',16);
	//$pdf->Cell(0, 6, "Dept of Comp Engg and IT", 0, 1, 'C');
	$pdf->Cell(0, 6, $deptName, 0, 1, 'C');
	$pdf->SetFont('helvetica','BU',16);
	$pdf->Cell(0, 6, "Timetable For $currTableName: $searchParam", 0, 1, 'C');

	$days = array("Mon", "Tue", "Wed", "Thu", "Fri");
	$batchColor = '#0000cd'; //medium blue
	$roomColor = '#228b22'; //forest green
	$classColor = '#ff00ff';//magenta
	$subjectColor = '#ff0000';//red
	$colWidth = array_fill(0, $nSlots, -1);//array to store widths of every column in timetable
	$rowSpan = array();
	$tableData = array();// all entries are stored in $tableData to determine the width of a column
	for($day = 1; $day <= 5; $day++) {//Monday to Friday
		$rowData = array();
		$rowspan = 1;
		array_push($rowData, array(array(array('str' => $days[$day - 1],
										 'style' => "align:C; valign:M; font-color:#000000; colspan:1;")
								  )));
		for($slotNo = 0; $slotNo < $nSlots; $slotNo += $colspan) {
			$thisSlotEntries = find($allrows2, $day, $slotNo);
			$nEntries = count($thisSlotEntries);
			$cellData = array();
			$entries = array();
			$colspan = 1;
			$entries[0] = array();
			for($i = 0;$i < $nEntries;$i++) {
				if($thisSlotEntries[$i]['isFixed'] != 1) {
					$query = "SELECT eachSlot FROM subject WHERE subjectShortName = \"".
						$thisSlotEntries[$i]['subjectShortName']."\"and snapshotId = $snapshotId;";
					$subjectRow = sqlGetOneRow($query);
					if($subjectRow[0]['eachSlot'] > $colspan)
						$colspan = $subjectRow[0]['eachSlot'];
					if($currTableName === "class")
						array_push($entries[0], array('row' => $thisSlotEntries[$i], 'colspan' => $subjectRow[0]['eachSlot']));
				}
			}
			if($nEntries == 1 && $colWidth[$slotNo] < 0)
				$colWidth[$slotNo] = 0;
			if($nEntries > 1)
				$colWidth[$slotNo] = 1;
			for($i = 1;$i < $colspan;$i++) {
				$nextSlotEntries = find($allrows2, $day, $slotNo + $i);
				for($j = 0;$j < count($thisSlotEntries);$j++) {
					for($k = 0;$k < count($nextSlotEntries);$k++) {
						if($nextSlotEntries[$k]['subjectShortName'] === $thisSlotEntries[$j]['subjectShortName'] &&
							$nextSlotEntries[$k]['batchName'] === $thisSlotEntries[$j]['batchName'] &&
							$nextSlotEntries[$k]['roomShortName'] === $thisSlotEntries[$j]['roomShortName']) {
							array_splice($nextSlotEntries, $k, 1);
							break;
						}
					}
				}
				if($currTableName === "class") {
					$entries[$i] = array();
					for($j = 0;$j < count($nextSlotEntries);$j++) {
						$query = "SELECT eachSlot FROM subject WHERE subjectShortName = \"".
							$nextSlotEntries[$j]['subjectShortName']."\"and snapshotId = $snapshotId;";
						$subjectRow = sqlGetOneRow($query);
						if($subjectRow[0]['eachSlot'] + $i > $colspan)
							$colspan = $subjectRow[0]['eachSlot'] + $i ;
						array_push($entries[$i], array('row' => $nextSlotEntries[$j], 'colspan' => $subjectRow[0]['eachSlot']));
					}
				}
				if(count($nextSlotEntries) > 0)
					$colWidth[$slotNo + $i] = 1;
				$thisSlotEntries = array_merge($thisSlotEntries, $nextSlotEntries);
			}
			$nEntries = count($thisSlotEntries);
			$borderBottom = 'B';
			$borderTop = 'T';
			if($currTableName != "class" || $nEntries <= 1) {
				for($d = 0; $d < $nEntries; $d++) {
					$currEntry = $thisSlotEntries[$d];
					if($currEntry["batchName"] != NULL && $currTableName != "batch") {
						array_push($cellData, array(array('str' => $currEntry["batchName"],
														  'style' => "colspan:".(2 * $colspan).
																	";font-color:$batchColor; align:C;border:LR;")
													));
					}
					if($currTableName != "class" && $currTableName != "batch" && $currEntry["classShortName"] != NULL) {
						array_push($cellData, array(array('str' => $currEntry["classShortName"],
														  'style' => "colspan:".(2 * $colspan).
																	";font-color:$classColor; align:C;border:LR;")
													));
					}
					if($currTableName != "subject" && $currTableName != "room" && $currTableName != "teacher"
						&& $currEntry["subjectShortName"] != NULL) {
						array_push($cellData, array(array('str' => $currEntry["subjectShortName"],
														  'style' => "colspan:".(2 * $colspan).
																	";font-color:$subjectColor; align:C;border:LR;")
													));
					}
					if($currTableName != "room" && $currTableName != "teacher" && $currEntry["roomShortName"] != NULL) {
						array_push($cellData, array(array('str' => $currEntry["roomShortName"],
														  'style' => "colspan:".(2 * $colspan).
																	";font-color:$roomColor; align:C;border:LR;")
													));
					}
					if($currEntry['isFixed'] == 1) {
						$query = "SELECT fixedText FROM fixedEntry WHERE ttId = ".$currEntry['ttId']
							." AND snapshotId = $snapshotId;";
						$fixedText = sqlGetOneRow($query);
						array_push($cellData, array(array('str' => $fixedText[0]['fixedText'],
														  'style' => "colspan:".(2 * $colspan).
																	";font-color:#000000; align:C;border:LR;")
													));
					}
				}
				if($currTableName === "teacher" && $nEntries > 0) {//for teacher show roomName and subject name once
					array_push($cellData, array(array('str' => $thisSlotEntries[0]["roomShortName"],
													  'style' => "colspan:$colspan;font-color:$roomColor; align:R;border:L;"),
												array('str' => $thisSlotEntries[0]["subjectShortName"],
													  'style' => "colspan:$colspan;font-color:$subjectColor; align:L;border:R;")
												));
				}
				if($currTableName === "room" && $nEntries > 0) {//for room show subjectName once
					array_push($cellData, array(array('str' => $thisSlotEntries[0]["subjectShortName"],
													  'style' => "colspan:".(2 * $colspan).
																";font-color:$subjectColor; align:C;border:LR;")
												));
				}
				if($nEntries === 0)// if a slot has no entries add empty string
					array_push($cellData, array(array('str' => '', 'style' => "colspan:".(2 * $colspan).";border:LR;")));
				for($d = 0;$d < count($cellData[0]);$d++) {// add top border to topmost row in a cell
					$pos = strpos($cellData[0][$d]['style'], "border:");
					$cellData[0][$d]['style'] = substr_replace($cellData[0][$d]['style'], $borderTop, $pos + strlen("border:"), 0);
				}
				for($d = 0;$d < count($cellData[count($cellData) - 1]);$d++) {// add bottom border to bottommost row in a cell
					$pos = strpos($cellData[count($cellData) - 1][$d]['style'], "border:");
					$cellData[count($cellData) - 1][$d]['style'] = substr_replace($cellData[count($cellData) - 1][$d]['style'], $borderBottom, $pos + strlen("border:"), 0);
				}
			}
			else { /* nEntries > 1 for table = "class" */
				for($i = 0;$i < count($entries);$i++) {
					for($j = 0;$j < count($entries[$i]);$j++) {
						$row1 = array();
						$row2 = array();
						for($k = 0;$k < $i;$k++) {
							array_push($row1, array('str' => '', 'style' => "colspan:2;border:TLR;"));
							array_push($row2, array('str' => '', 'style' => "colspan:2;border:BLR;"));
						}
						$nextSlot = $i;
						while($nextSlot < $colspan) {
							if(count($entries[$nextSlot]) > 0) {
								array_push($row1, array('str' => $entries[$nextSlot][0]['row']["batchName"],
														'style' => "colspan:".(2 * $entries[$nextSlot][0]['colspan']).
																	";font-color:$batchColor; align:C;border:TLR;"));
								array_push($row2, array('str' => $entries[$nextSlot][0]['row']["roomShortName"],
														'style' => "colspan:".$entries[$nextSlot][0]['colspan'].
																	";font-color:$roomColor; align:R;border:LB;"),
												  array('str' => $entries[$nextSlot][0]['row']["subjectShortName"],
														'style' => "colspan:".$entries[$nextSlot][0]['colspan'].
														  			";font-color:$subjectColor; align:L;border:BR;"));
								if($nextSlot === $i)
									$j--;
								$tmp = $nextSlot;
								$nextSlot += $entries[$nextSlot][0]['colspan'];
								array_splice($entries[$tmp], 0, 1);
							}
							else if(count($entries[$nextSlot]) == 0) {
								array_push($row1, array('str' => '', 'style' => "colspan:2;border:TLR;"));
								array_push($row2, array('str' => '', 'style' => "colspan:2;border:BLR;"));
								$nextSlot++;
							}
						}
						if(count($row1) > 0) {
							array_push($cellData, $row1);
							array_push($cellData, $row2);
						}
					}
				}
				for($d = 0;$d < count($cellData[0]);$d++) {//add top border to topmost row in a cell
					$pos = strpos($cellData[0][$d]['style'], "border:");
					$cellData[0][$d]['style'] = substr_replace($cellData[0][$d]['style'], $borderTop, $pos + strlen("border:"), 0);
				}
				for($d = 0;$d < count($cellData[count($cellData) - 1]);$d++) {//add bottom border to bottommost row in a cell
					$pos = strpos($cellData[count($cellData) - 1][$d]['style'], "border:");
					$cellData[count($cellData) - 1][$d]['style'] = substr_replace($cellData[count($cellData) - 1][$d]['style'], $borderBottom, $pos + strlen("border:"), 0);
				}
			}
			array_push($rowData, $cellData);
			if(count($cellData) > $rowspan)
				$rowspan = count($cellData);
		}
		array_push($tableData, $rowData);
		array_push($rowSpan, $rowspan);
	}
	$count = array_fill(0, 3, 0);//{count_of_empty_cols, count_of_cols_with_single_entry_in_cell, count_of_multiple_entry_cols}
	for($i = 0;$i < $nSlots;$i++)
		$count[$colWidth[$i] + 1]++;
	$width = '{8';
	$w1 = 16;// width for column with no entry
	if($nSlots - $count[0]) {
		$w = ( $pdf->GetPageWidth() - $w1 * $count[0] - 8 )  / ($nSlots - $count[0]);
		if($count[2] != 0) {
			$w2 = ( $w - 10 ) / 2;//width for column with cells containing maximum single entry
			$w3 = ( $w + ( 10 * $count[1] ) / $count[2] ) / 2;//width for column with cells containing multiple entry
		}
		else {
			$w2 = $w / 2;
			$w3 = $w / 2;
		}
	}
	else {
		$w = $pdf->GetPageWidth() - 8;
		$w1 = ($w / $nSlots);
	}
	for($i = 0;$i < $nSlots - 1;$i++) {
		switch ($colWidth[$i]) {
			case -1:
				$width .= (', '.$w1.', '.$w1);
				break;
			case 0:
				$width .= (', '.$w2.', '.$w2);
				break;
			case 1:
				$width .= (', '.$w3.', '.$w3);
				break;
		}
	}
	$width .= '}';
	/* Main timeTable */
	$table = new easyTable($pdf, $width, 'align:L; font-style:B; font-size:13;
		font-family:helvetica; border:1; border-color:#000000; border-width:0.4; width:'.$pdf->GetPageWidth().';');

	$table->easyCell('');
	$currSlotTime = strtotime($dayBegin);
	$currSlotTimeFormatted = date("H:i", $currSlotTime);
	// Generate the Slots-Labels
	for($i = 0; $i < $nSlots; $i++) {
		$table->easyCell($currSlotTimeFormatted, 'align:C; valign:M; font-color:#000000; colspan:2;');
		$currSlotTime += $slotDuration;
		$currSlotTimeFormatted = date("H:i", $currSlotTime);
	}
	$table->printRow();
	for($i = 0;$i < count($tableData);$i++)
		printRow($tableData[$i], $table, $rowSpan[$i], $searchParam);
	$table->endTable(0);
	/*Add color legend*/
	$pdf->ln();
	$table = new easyTable($pdf, 5, 'align:C; font-size:13; font-family:helvetica; border:1; border-width:0.4;');
	$table->easyCell("Color Legend ->", "border:1; align:C;");
	$table->easyCell("Batch Name", "font-color:$batchColor; align:C;");
	$table->easyCell("Room Name", "font-color:$roomColor; align:C;");
	$table->easyCell("Class Name", "font-color:$classColor; align:C;");
	$table->easyCell("Subject Name", "font-color:$subjectColor; align:C;");
	$table->printRow();
	$table->endTable(0);

	/*on teacher paga add hrs/week */
	if($currTableName == "teacher") {
		$pdf->ln();
		$table = new easyTable($pdf, '{25, 15}', 'align:C; font-size:13; font-family:helvetica;
										border:1; border-width:0.4; width:40; font-color:#000000;  align:L:');
		$table->easyCell("Total Load", "font-style:B; align:C;");
		$table->easyCell(countTotalLoad($allrows2)." Hrs", "font-style:B; align:C;");
		$table->printRow();
		$table->endTable(0);
	}
	/* see next page message*/
	$pdf->SetFont('helvetica','',12);
	$pdf->SetY(-15);
	$pdf->setTextColor(0, 0, 0);
	$pdf->Cell(0, 5, 'Please see the legend on the next page for details of acronyms', 0, 0, 'C');

	/*Add Page No*/
	$pdf->ln();
	$pdf->SetY(-10);
	$pdf->SetFont('helvetica','',12);
	$pdf->Cell(0,5,'Page '.$pdf->PageNo(),0,0,'C');

	$align = array('align:L{LC}; ', '', 'align:R; ');
	$i = 0;
	$styleCell = 'font-size:10;';
	$tableWidth = $pdf->GetPageWidth() / 3 - 10;
	switch($currTableName) {
		case "teacher":
			$data = ShortNameMappings($allrows2, "roomShortName", "roomName", "room", array("Room Short Name", "Room Name"));
			if($data != 0)
				$y = createTable($pdf, $data, '{'. 0.3 * $tableWidth .','. 0.7 * $tableWidth .'}', 2, $align[$i++], $styleCell);
			break;
		case "class": case "batch"://show room-short name and subject-teacher mappings
			$data = ShortNameMappings($allrows2, "roomShortName", "roomName", "room", array("Room Short Name", "Room Name"));
			if($data != 0)
				$y = createTable($pdf, $data, '{'. 0.37 * $tableWidth .','. 0.63 * $tableWidth .'}', 2, $align[$i++], $styleCell);
			$data = SubjectTeacherMappings($allrows2, $currTableName, array("Subject Short Name: Batch Names", "Teacher Name"));
			if($data != 0)
				$y = createTable($pdf, $data, '{'. 0.58 * $tableWidth .','. 0.42 * $tableWidth .'}', 2, $align[$i++], $styleCell, $y);
			break;
		case "room"://show subject-teacher mapping
			$data = SubjectTeacherMappings($allrows2, $currTableName, array("Subject Short Name: Batch Names", "Teacher Name"));
			if($data != 0)
				$y = createTable($pdf, $data, '{'. 0.58 * $tableWidth .','. 0.42 * $tableWidth .'}', 2, $align[$i++], $styleCell);
			break;
	}
	//show subject-short name mapping
	$data = ShortNameMappings($allrows2, "subjectShortName", "subjectName", "subject",
				array("Subject Short Name", "Subject Name"));
	if($data != 0)
		$y = createTable($pdf, $data, '{'. 0.33 * $tableWidth .','. 0.67 * $tableWidth .'}', 2, $align[$i++], $styleCell, $y);
	if($pdf->PageNo() == 2) {//if lenged page exists
		$pdf->SetY(-30);
		$pdf->SetFont('helvetica','B',14);
		$pdf->setTextColor(0, 0, 0);
		$pdf->Cell($pdf->GetPageWidth() / 2, 10, "Timetable Incharge", 0, 0, 'C');
		$pdf->Cell($pdf->GetPageWidth() / 2, 10, "Head of Department", 0, 0, 'C');

		$pdf->SetFont('helvetica','',12);
		$pdf->SetY(-10);
		$pdf->Cell(0,6,'Page '.$pdf->PageNo(),0,0,'C');
	}
		$pdf->output('F', sys_get_temp_dir().$GLOBALS['path'].$currTableName."_".$searchParam.".pdf");
	
		$GLOBALS['filename'] = sys_get_temp_dir().$GLOBALS['path'].$currTableName."_".$searchParam.".pdf";
}
function createTable($pdf, $data, $width, $pageNo, $styleTable = '', $styleCell = '', $y = 0) {
	if($pdf->PageNo() != $pageNo) {
		$pdf->AddPage(); #legend page
		$pdf->setMargins(5, 10, 5);
		$pdf->SetFont('helvetica','B',16);
		$pdf->SetX(15);
		$pdf->Cell(0, 8, "Legend Page", 0, 1, 'C');
		$pdf->SetFont('helvetica','B',13);
		$y=$pdf->GetY();
	}
	else
		$pdf->SetY($y);

	$table = new easyTable($pdf, $width, $styleTable.'width:90; font-style:B; font-size:13;
				font-family:helvetica; border:1; border-color:#000000; border-width:0.4');
	for($i = 0;$i < count($data[0]);$i++)
		$table->easyCell($data[0][$i], 'align:C; valign:M; font-color:#006400 font-size:14');
	$table->printRow();
	for($i = 1;$i < count($data);$i++) {
		for($j = 0;$j < 2;$j++) {
			$table->easyCell($data[$i][$j], $styleCell.'align:C; valign:M; font-color:#000000');
		}
		$table->printRow();
	}
	$table->endTable();
	return $y;
}
function ShortNameMappings($allrows2, $currParam, $searchParam, $tableName, $headerRow) {
	$currentSnapshotId = getArgument("snapshotId");
	$tableData = array();
	foreach ( $allrows2 as $currEntry ) {
		if($currEntry['isFixed'] != 1) {
			$arr = array($currEntry[$currParam]);
			if(array_search($arr, $tableData) === false)
				array_push($tableData, $arr);
		}
	}
	for($k = 0; $k < count($tableData); $k++) {
		$query = "SELECT $searchParam FROM $tableName WHERE $currParam=\"".$tableData[$k][0]. "\" and
					snapshotId = $currentSnapshotId";
		$row = sqlGetOneRow($query);
		array_push($tableData[$k], $row[0][$searchParam]);
	}
	if(count($tableData) != 0) {
		array_unshift($tableData, $headerRow);
		return $tableData;
	}
	return 0;
}
function SubjectTeacherMappings($allrows2, $currTableName, $headerRow) {
	$currentSnapshotId = getArgument("snapshotId");
	$subjectTeacher = array();
	$batchNames = array();
	foreach ( $allrows2 as $currEntry ) {
		if($currEntry['isFixed'] != 1) {
			$key = $currEntry['subjectShortName'].$currEntry['teacherShortName'];
			$arr = array($currEntry['subjectShortName'], $currEntry['teacherShortName']);
			if(array_search($arr, $subjectTeacher) === false)
				array_push($subjectTeacher, $arr);
			if($currTableName != "batch" && $currEntry['batchName'] != NULL) {
				if(!array_key_exists($key, $batchNames))
					$batchNames[$key] = array();
				if(array_search($currEntry['batchName'], $batchNames[$key]) === false)
					array_push($batchNames[$key], $currEntry['batchName']);
			}
		}
	}
	for($k = 0; $k < count($subjectTeacher); $k++) {
		$key = $subjectTeacher[$k][0].$subjectTeacher[$k][1];
		if($currTableName != "batch" && array_key_exists($key, $batchNames))
			$subjectTeacher[$k][0] .= (": " .implode(", ", $batchNames[$key]));
		$query = "SELECT teacherName FROM teacher WHERE teacherShortName=\"".$subjectTeacher[$k][1]. "\" and
					snapshotId = $currentSnapshotId";
		$teacherName = sqlGetOneRow($query);
		$subjectTeacher[$k][1] = $teacherName[0]['teacherName'];
	}
	if(count($subjectTeacher) != 0) {
		array_unshift($subjectTeacher, $headerRow);
		return $subjectTeacher;
	}
	return 0;
}
function exportPDF() {
	if (PHP_OS == 'Windows' || PHP_OS == 'WINNT' || PHP_OS == 'WIN32') {
		$filename = sys_get_temp_dir()."\\timetable_pdf\\timetable_pdf.zip";
		$GLOBALS['path'] = "\\timetable_pdf\\";	
		if(!file_exists(sys_get_temp_dir()."\\timetable_pdf\\"))
			mkdir(sys_get_temp_dir()."\\timetable_pdf\\");
		else
			array_map('unlink', glob(sys_get_temp_dir()."\\timetable_pdf\\*"));
	}
	else {
		$filename = sys_get_temp_dir()."/timetable_pdf/timetable_pdf.zip";
		$GLOBALS['path'] ="/timetable_pdf/";
		if(!file_exists(sys_get_temp_dir().'/timetable_pdf/'))
			mkdir(sys_get_temp_dir().'/timetable_pdf/');
		else
			array_map('unlink', glob(sys_get_temp_dir().'/timetable_pdf/*'));
	}
	$tableNames = array("teacher", "teacherShortName", "class", "classShortName",
				"batch", "batchName", "room", "roomShortName");
	$query = "SELECT * from config WHERE configId = 1";
	$allrows = sqlGetAllRows($query);
	$currentSnapshotName = getArgument("snapshotName");
	$currentSnapshotId = getArgument("snapshotId");
	# consider having a timetable class with derived classes
	# on teacherTT, classTT, batchTT, etc. and have a specific code in each.

	/* TODO: Change this to use currentConfigId */
	$nSlots = $allrows[0]["nSlots"] + 1;/*extra one slot for displaying day name*/
	$dayBegin = $allrows[0]["dayBegin"];
	$slotDuration = $allrows[0]["slotDuration"];

	$deptQuery = "SELECT deptName from dept d, config c, snapshot s ".
				"where s.configId = c.configId and c.deptId = d.deptId".
				" AND s.snapshotId = $currentSnapshotId";
	$deptQueryRes = sqlGetOneRow($deptQuery);
	$deptName = $deptQueryRes[0]["deptName"];

	for($i = 0; $i < count($tableNames); $i += 2) {
		# Generate a pdf for each table: teachers, classes, batches, rooms
		$currTableName = $tableNames[$i];
		$currParam = $tableNames[$i + 1];
		$query = "SELECT * FROM $currTableName WHERE snapshotId = $currentSnapshotId";
		$allrows = sqlGetAllRows($query);
		for($j = 0; $j < count($allrows); $j++) {
			# Generate pdf for each room/class/teacher/batch in each table
			$searchParam = $allrows[$j][$currParam];
			$query = "SELECT * FROM timeTableReadable WHERE  $currParam = \"$searchParam\" ".
					 "AND snapshotName = \"$currentSnapshotName\"";
			$allrows2 = sqlGetAllRows($query);
			if($currTableName == "batch") {
				if(count($allrows2) == 0) {
					$query = "SELECT classShortName FROM batchClassReadable WHERE batchName = \"".
						"$searchParam\" AND snapshotName = \"$currentSnapshotName\"";
					$classRow = sqlGetOneRow($query);
					$classShortName = $classRow[0]['classShortName'];
				}
				else {
					$classShortName = $allrows2[0]['classShortName'];
				}
				$query = "SELECT * FROM timeTableReadable WHERE classShortName = \"$classShortName".
					"\" AND batchName IS NULL AND snapshotName = \"$currentSnapshotName\"";
				$classRows = sqlGetAllRows($query);
				$allrows2 = array_merge($allrows2, $classRows);
			}
			generate_timetable_pdf($currTableName, $searchParam, $allrows2, $nSlots, $dayBegin, $slotDuration, $deptName);
		}
	}
	if (PHP_OS == 'Windows' || PHP_OS == 'WINNT' || PHP_OS == 'WIN32')
		HZip::zipDir(sys_get_temp_dir()."\\timetable_pdf\\", $filename);
	else
		HZip::zipDir(sys_get_temp_dir()."/timetable_pdf/", $filename);
	return $filename;
}
// To export only single PDF and save in 'tmp' folder 
function exportPDFsingle() {
	if (PHP_OS == 'Windows' || PHP_OS == 'WINNT' || PHP_OS == 'WIN32') {
		$GLOBALS['path'] = "\\timetable_pdf\\";	
		if(!file_exists(sys_get_temp_dir()."\\timetable_pdf\\"))
			mkdir(sys_get_temp_dir()."\\timetable_pdf\\");
		else
			array_map('unlink', glob(sys_get_temp_dir()."\\timetable_pdf\\*"));
	}
	else {
		$GLOBALS['path'] ="/timetable_pdf/";
		if(!file_exists(sys_get_temp_dir().'/timetable_pdf/'))
			mkdir(sys_get_temp_dir().'/timetable_pdf/');
		else
			array_map('unlink', glob(sys_get_temp_dir().'/timetable_pdf/*'));
	}
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

	$deptQuery = "SELECT deptName from dept d, config c, snapshot s ".
				"where s.configId = c.configId and c.deptId = d.deptId".
				" AND s.snapshotId = $currentSnapshotId";
	$deptQueryRes = sqlGetOneRow($deptQuery);
	$deptName = $deptQueryRes[0]["deptName"];

	# currParam is short name and searchParam is actual name 
	$currTableName = getArgument("viewtype");
	// Loop to find the corresponding short name and assign to currParam
	for($x = 0; $x < 7; $x=$x+2) {
		if ($tableNames[$x] == $currTableName) {
			$currParam = $tableNames[$x+1] ;	
		}
	}
	$searchParam = getArgument("viewId");
	$query = "SELECT * FROM timeTableReadable WHERE  $currParam = \"$searchParam\" ".
			"AND snapshotName = \"$currentSnapshotName\"";
	$allrows2 = sqlGetAllRows($query);
	if($currTableName == "batch") {
		if(count($allrows2) == 0) {
			$query = "SELECT classShortName FROM batchClassReadable WHERE batchName = \"".
				"$searchParam\" AND snapshotName = \"$currentSnapshotName\"";
			$classRow = sqlGetOneRow($query);
			$classShortName = $classRow[0]['classShortName'];
		}
		else {
			$classShortName = $allrows2[0]['classShortName'];
		}
		$query = "SELECT * FROM timeTableReadable WHERE classShortName = \"$classShortName".
			"\" AND batchName IS NULL AND snapshotName = \"$currentSnapshotName\"";
		$classRows = sqlGetAllRows($query);
		$allrows2 = array_merge($allrows2, $classRows);
	}
	generate_timetable_pdf($currTableName, $searchParam, $allrows2, $nSlots + 1, $dayBegin, $slotDuration, $deptName);
	return $GLOBALS['filename']; 
}
?>

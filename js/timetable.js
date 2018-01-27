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
 * Taasika frontpage.
 *
 * Copyright 2017 Abhijit A. M. (abhijit13@gmail.com),
 * Copyright 2017 Vinay Desai (desaivinay1997@gmail.com)
 */


/* These are used in copy-cut-paste of cells */
var selectedCell ;
var prevBorder;
var copyCell;
var dragSrcEl = null;
var srcI, NoOfSlots = 11;
var srcSlotEntry;

/* These global variables represent one table each from the database */
var database;
var dept, config, snapshot;
var teacher, classTable, batch, batchCanOverlap, batchClass;
var room, classRoom, batchRoom, subjectRoom;
var subject, subjectBatchTeacher, subjectClassTeacher, overlappingSBT;
var fixedEntry;
var timeTableReadable;

/* These three represent the current Dept/Snapshot/Config we are working on */
var currentSnapshotId;
var currentSnapshotName;
var currentDeptId;

/*this variables are used to cancel xlsx or pdf export*/
var exportType = null;
var xmlObject = null;
/* In future give a menu option to select a Config, and then a snapshot in that config */
var currentConfigId = 1;

var type;// = "class";
var currTableId;// = "SYBT-CE";
var supportObject;

var daysName = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
var enabledRows = [];

/* helperTable has size 6 * nSlots * maxPossibleRows. It's a cube. Let's say each entry
 * is a cube-cell.
 * It stores timeTable[] entries as objects, as they appear on screen.
 * Thus, if DSA-Lab_SY-IT appears on Monday,at Slot2 for 2 hours as third entry in cell,
 * then it stores, two entries at [0, 2, 3], [2, 3, 3]. Note the change in j, but no
 * change in k index.
 * It is initialized to zero. When a cube-cell is ready to be occupied, it is set to null.
 * It is heavily used in drag-drop, display of table properly.
 */
var helperTable = [];

var dirtyTimeTable = false;

/* This stores information about no. of schedules done from SCT/SBT */
var tracker = [];
var completion;

var roomSizeDelta = 10;

function makeTrackerList() {
	tracker = [];
	for (i in subjectClassTeacher) {
		entry = {}
		curr = subjectClassTeacher[i];

		entry["subjectId"] =  curr["subjectId"];
		entry["batchId"] = "";
		entry["classId"] = curr["classId"];
		entry["teacherId"] = curr["teacherId"];
		subjectRow =  search(subject, "subjectId", subjectClassTeacher[i]["subjectId"]);
		entry["nSlots"] = subjectRow["nSlots"];
		entry["eachSlot"] = subjectRow["eachSlot"];
		entry["sbtId"] = null;
		entry["done"] = 0;
		tracker.push(entry);
	}
	for (i in subjectBatchTeacher) {
		entry = {}
		curr = subjectBatchTeacher[i];

		entry["subjectId"] =  curr["subjectId"];
		entry["batchId"] = curr["batchId"];
		entry["classId"] = search(batchClass, "batchId", curr["batchId"])["classId"];
		entry["teacherId"] = curr["teacherId"];
		subjectRow =  search(subject, "subjectId", curr["subjectId"]);
		entry["nSlots"] = subjectRow["nSlots"];
		entry["eachSlot"] = subjectRow["eachSlot"];
		entry["sbtId"] = curr["sbtId"];
		entry["done"] = 0;
		tracker.push(entry);
	}
	for(i = 0; i < timeTable.length; i++) {
		curr = timeTable[i];
		/* 3 types of entries. (a) isFixed = 1 (b) isFixed = 0, batchId != null
		 * (c) isFixed = 0, batchId = null
		 */
		if(curr["isFixed"] == "1")
			continue;
		if("" + curr["batchId"] != "null") {
			index = searchIndex(tracker, "subjectId", curr["subjectId"],
						"batchId", curr["batchId"], "classId", curr["classId"]);
			if(index == -1) {
				alert("ERROR: index -1 in searchIndex i = . " + i + " curr = " +
						JSON.stringify(curr) + "Tracker: " + JSON.stringify(
							search(tracker, "batchId", curr["batchId"])) + JSON.stringify(
							search(tracker, "teacherId", curr["teacherId"])) + JSON.stringify(
							search(tracker, "subjectId", curr["subjectId"])) + JSON.stringify(
							search(subjectBatchTeacher, "subjectId", curr["subjectId"])) + JSON.stringify(
							search(subjectBatchTeacher, "teacherId", curr["teacherId"])) + JSON.stringify(
							search(subjectBatchTeacher, "batchId", curr["batchId"]))
						);
			}
			eachSlot = tracker[index]["eachSlot"];
			tracker[index]["done"] += (1.0/eachSlot);
			continue;
		}
		if("" + curr["batchId"] == "null") {
			index = searchIndex(tracker, "subjectId", curr["subjectId"],
						"classId", curr["classId"]);
			if(index == -1) {
				alert("ERROR: index -1 in searchIndex i = . " + i + " curr = " +
						JSON.stringify(curr) + "Tracker: " + JSON.stringify(tracker));
			}
			eachSlot = tracker[index]["eachSlot"];
			tracker[index]["done"] += (1.0/eachSlot);
		} else {
			alert("ERROR: should not come here in makeTrackerList");
			continue;
		}
	}
}
var subjectSort = 1, batchSort = 1, teacherSort = 1, doneSort = 1;

function sortTrackerOnTeacher() {
	tracker.sort(function(a, b) {
		x = search(teacher, "teacherId", a["teacherId"])["teacherShortName"];
		y = search(teacher, "teacherId", b["teacherId"])["teacherShortName"];
		if(x < y)
			return ((teacherSort == 1? 1 : -1) * (-1));
		if(x > y)
			return ((teacherSort == 1? 1 : -1) * (1));
	});
	teacherSort = 1 - teacherSort;
	showTrackerList();
	$(".teachersort").css("background-color", "red");
}
function sortTrackerOnSub() {
	tracker.sort(function(a, b) {
		x = search(subject, "subjectId", a["subjectId"])["subjectShortName"];
		y = search(subject, "subjectId", b["subjectId"])["subjectShortName"];
		if(x < y)
			return ((subjectSort == 1? 1 : -1) * (-1));
		if(x > y)
			return ((subjectSort == 1? 1 : -1) * (1));
	});
	subjectSort = 1 - subjectSort;
	showTrackerList();
	$(".subsort").css("background-color", "red");
}
function sortTrackerOnBatch() {
	tracker.sort(function(a, b) {
		var x = search(batch, "batchId", a["batchId"])["batchName"];
		if(x == undefined)
			var x = search(classTable, "classId", a["classId"])["classShortName"];
		var y = search(batch, "batchId", b["batchId"])["batchName"];
		if(y == undefined)
			var y = search(classTable, "classId", b["classId"])["classShortName"];
		if(x < y)
			return ((batchSort == 1? 1 : -1) * (-1));
		if(x > y)
			return ((batchSort == 1? 1 : -1) * (1));
	});
	batchSort = 1 - batchSort;
	showTrackerList();
	$(".batchsort").css("background-color", "red");
}
function sortTrackerOnDone() {
	tracker.sort(function (a, b) {
		var x = a.done/a.nSlots;
		var y = b.done/b.nSlots;
		if(x < y)
			return ((doneSort == 1? 1 : -1) * (-1));
		if(x > y)
			return ((doneSort == 1? 1 : -1) * (1));
	});
	doneSort = 1 - doneSort;
	showTrackerList();
	$(".donesort").css("background-color", "red");
}
var trackerStr = "";
function addOSBTRowToTrackerShow(trackerRow) {
	currSBTID = trackerRow["sbtId"];
	if(currSBTID == null)
		return;
	overlappingSBTENtries = searchMultipleRows(overlappingSBT, "sbtId1", currSBTID);
	if(overlappingSBTENtries == -1)
		return;
	for(x in overlappingSBTENtries) {
		currOverlappingSBT = overlappingSBTENtries[x];
		currOverlappingSBTId = currOverlappingSBT["sbtId2"];
		var curr = search(tracker, "sbtId", currOverlappingSBTId);
		if(curr == -1)
			return;
		trackerStr += "<tr class=\"trackerrowExtra\">";
		trackerStr += "<td class=\"trackercolExtra\">O_";
		trackerStr += search(subject, "subjectId", curr["subjectId"])["subjectShortName"];
		trackerStr += "</td>";
		trackerStr += "<td class=\"trackercolExtra\">";
		if(curr["batchId"] != "") {
			trackerStr += search(batch, "batchId", curr["batchId"])["batchName"];
		} else {
			trackerStr += search(classTable, "classId", curr["classId"])["classShortName"];
		}
		trackerStr += "</td>";
		trackerStr += "<td class=\"trackercolExtra\">";
		trackerStr += search(teacher, "teacherId", curr["teacherId"])["teacherShortName"];
		trackerStr += "</td>";
		trackerStr += "<td class=\"trackercolExtra\">";
		trackerStr += curr["done"] + "/" + curr["nSlots"];
		trackerStr += "</td>";
		trackerStr += "</tr>";
	}
}
function showTrackerList() {
	trackerStr = "<table class=\"trackertable\">";
	trackerStr += "<tr class=\"trackerrow\">";
	trackerStr += "<td class=\"trackercol\"> <a href=\"javascript:void(0) " +
					"\"class=\"subsort\" onclick=\"sortTrackerOnSub()\">" +
					"Sub^ </a></td>";
	trackerStr += "<td class=\"trackercol\"> <a href=\"javascript:void(0) " +
					"\"class=\"batchsort\" onclick=\"sortTrackerOnBatch()\">" +
					"Batch^ <br> Class^ </a></td>";
	trackerStr += "<td class=\"trackercol\"> <a href=\"javascript:void(0) " +
					"\"class=\"teachersort\" onclick=\"sortTrackerOnTeacher()\">" +
					"Teacher^ </a></td>";
	trackerStr += "<td class=\"trackercol\"> <a href=\"javascript:void(0) " +
					"\"class=\"donesort\" onclick=\"sortTrackerOnDone()\">" +
					"Done^ </a></td>";
	trackerStr += "</tr>";
	completionNSlots = 0;
	completionDone = 0;
	switch(type) {
		case "class":
			currClassId = search(classTable, "classShortName", currTableId)["classId"];
			for(i = 0; i < tracker.length; i++) {
				curr = tracker[i];
				if(curr["classId"] != currClassId)
					continue;
				trackerStr += "<tr class=\"trackerrow\">";
				trackerStr += "<td class=\"trackercol\">";
				trackerStr += search(subject, "subjectId", curr["subjectId"])["subjectShortName"];
				trackerStr += "</td>";
				trackerStr += "<td class=\"trackercol\">";
				if(curr["batchId"] != "") {
					trackerStr += search(batch, "batchId", curr["batchId"])["batchName"];
				} else {
					trackerStr += search(classTable, "classId", curr["classId"])["classShortName"];
				}
				trackerStr += "</td>";
				trackerStr += "<td class=\"trackercol\">";
				trackerStr += search(teacher, "teacherId", curr["teacherId"])["teacherShortName"];
				trackerStr += "</td>";
				trackerStr += "<td class=\"trackercol\">";
				trackerStr += curr["done"] + "/" + curr["nSlots"];
				completionNSlots += Number(curr["nSlots"]);
				completionDone += Number(curr["done"]);
				trackerStr += "</td>";
				trackerStr += "</tr>";
				addOSBTRowToTrackerShow(curr);
			}
			break;
		case "batch":
			currBatchId = search(batch, "batchName", currTableId)["batchId"];
			for(i = 0; i < tracker.length; i++) {
				curr = tracker[i];
				if(curr["batchId"] != currBatchId)
					continue;
				trackerStr += "<tr class=\"trackerrow\">";
				trackerStr += "<td class=\"trackercol\">";
				trackerStr += search(subject, "subjectId", curr["subjectId"])["subjectShortName"];
				trackerStr += "</td>";
				trackerStr += "<td class=\"trackercol\">";
				trackerStr +=  currTableId;
				trackerStr += "</td>";
				trackerStr += "<td class=\"trackercol\">";
				trackerStr += search(teacher, "teacherId", curr["teacherId"])["teacherShortName"];
				trackerStr += "</td>";
				trackerStr += "<td class=\"trackercol\">";
				trackerStr += curr["done"] + "/" + curr["nSlots"];
				completionNSlots += Number(curr["nSlots"]);
				completionDone += Number(curr["done"]);
				trackerStr += "</td>";
				trackerStr += "</tr>";
				addOSBTRowToTrackerShow(curr);
			}
			break;
		case "teacher":
			currTeacherId = search(teacher, "teacherShortName", currTableId)["teacherId"];
			for(i = 0; i < tracker.length; i++) {
				curr = tracker[i];
				if(curr["teacherId"] != currTeacherId)
					continue;
				trackerStr += "<tr class=\"trackerrow\">";
				trackerStr += "<td class=\"trackercol\">";
				trackerStr += search(subject, "subjectId", curr["subjectId"])["subjectShortName"];
				trackerStr += "</td>";
				trackerStr += "<td class=\"trackercol\">";
				if(curr["batchId"] != "") {
					trackerStr += search(batch, "batchId", curr["batchId"])["batchName"];
				} else {
					trackerStr += search(classTable, "classId", curr["classId"])["classShortName"];
				}
				trackerStr += "</td>";
				trackerStr += "<td class=\"trackercol\">";
				trackerStr += currTableId;
				trackerStr += "</td>";
				trackerStr += "<td class=\"trackercol\">";
				trackerStr += curr["done"] + "/" + curr["nSlots"];
				completionNSlots += Number(curr["nSlots"]);
				completionDone += Number(curr["done"]);
				trackerStr += "</td>";
				trackerStr += "</tr>";
				addOSBTRowToTrackerShow(curr);
			}
			break;
		case "room":
			break;
			for(i = 0; i < tracker.length; i++) {
				curr = tracker[i];
				trackerStr += "<tr class=\"trackerrow\">";
				trackerStr += "<td class=\"trackercol\">";
				trackerStr += search(subject, "subjectId", curr["subjectId"])["subjectShortName"];
				trackerStr += "</td>";
				trackerStr += "<td class=\"trackercol\">";
				if(curr["batchId"] != "") {
					trackerStr += search(batch, "batchId", curr["batchId"])["batchName"];
				} else {
					trackerStr += search(classTable, "classId", curr["classId"])["classShortName"];
				}
				trackerStr += "</td>";
				trackerStr += "<td class=\"trackercol\">";
				trackerStr += search(teacher, "teacherId", tracker[i]["teacherId"])["teacherShortName"];;
				trackerStr += "</td>";
				trackerStr += "<td class=\"trackercol\">";
				trackerStr += curr["done"] + "/" + curr["nSlots"];
				completionNSlots += Number(curr["nSlots"]);
				completionDone += Number(curr["done"]);
				trackerStr += "</td>";
				trackerStr += "</tr>";
				addOSBTRowToTrackerShow(curr);
			}
			break;
		default:
			trackerStr = "<tr> <td> ERROR: Please check</td> </tr>";
			break;
	}
	trackerStr += "</table>";
	document.getElementById("tracker").innerHTML = trackerStr;
	if(completionNSlots)
		completion = completionDone * 100 / completionNSlots;
	else
		completion = 0;
	document.getElementById("completionTag").innerHTML = "Done: " + completion.toFixed(1) + "%";
	trackerElem = document.getElementById("tracker");
    trackerElem.style.height = (trackerElem.scrollHeight)+"px";
}

function debugPrint(tableName, row) {
	var res = {};
	switch(tableName) {
		case "timeTable":
			res.ttid = row["ttId"];
			res.day = row["day"];
			res.slotNo = row["slotNo"];

			roomId = row["roomId"];
			if("" + roomId != "null")
				res.roomShortName = search(room, "roomId", roomId)["roomShortName"];
			else
				res.roomShortName = "null";

			subjectId = row["subjectId"];
			if("" + subjectId != "null")
				res.subjectShortName = search(subject, "subjectId", subjectId)["subjectShortName"];
			else
				res.subjectShortName = "null";

			teacherId = row["teacherId"];
			if("" + teacherId != "null")
				res.teacherShortName = search(teacher, "teacherId", teacherId)["teacherShortName"];
			else
				res.teacherShortName = "null";

			classId = row["classId"];
			if("" + classId != "null")
				res.classShortName = search(classTable, "classId", classId)["classShortName"];
			else
				res.classShortName = "null";

			batchId = row["batchId"];
			if("" + batchId != "null")
				res.batchName = search(batch, "batchId", batchId)["batchName"];
			else
				res.batchName = "null";

			res.isFixed = row["isFixed"];

			snapshotId = row["snapshotId"];
			if("" + snapshotId != "null")
				res.snapshotName = search(snapshot, "snapshotId", snapshotId)["snapshotName"];
			else
				res.snapshotName = "null";
			break;
		case "fixedEntry":
			res.feId = row["feId"];
			res.ttId = row["ttId"];
			res.fixedText = row["fixedText"];
			snapshotId = row["snapshotId"];
			if("" + snapshotId != "null")
				res.snapshotName = search(snapshot, "snapshotId", snapshotId)["snapshotName"];
			else
				res.snapshotName = "null";
			break;
		default:
			alert(tableName + " table not supported yet in debugPrint");
			break;
	}
	return JSON.stringify(res);
}
function dragStartHandler(e) {
	e.target.style.opacity = '0.4';
	dragSrcEl = e.target;
	/*var i = parseInt(e.target.id.substring(9, 10));
	var j = parseInt(e.target.id.substring(10, e.target.id.length - 1));
	var k = parseInt(e.target.id.substring(e.target.id.length - 1, e.target.id.length)); */
	[i, j, k] = makeIJKFromId(e.target.id);
	console.log("dragStartHandler: i = " + i + " j = " + j + " k = " + k);

	srcSlotEntry = helperTable[i - 1][j][k];
	srcI = i;/*Needed afterwards*/
  	e.dataTransfer.effectAllowed = 'move';
  	e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function dragEnterHandler(e) {
	e.target.classList.add('over');
}

function dragOverHandler(e) {
  	if (e.preventDefault) {
    	e.preventDefault(); // Necessary. Allows us to drop.
  	}

  	e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  	return false;
}

function dragLeaveHandler(e) {
	e.target.classList.remove('over');
}

/*i, j of destn slot and source object*/
/*There is no need to check for max entry of subject*/
function checkValidity(i, j, source) {
	var subjectRow = search(subject, "subjectId", source["subjectId"]);
	var bco = searchMultipleRows(batchCanOverlap, "batchId", source["batchId"]);
	if((j + parseInt(subjectRow["eachSlot"])) > parseInt(NoOfSlots)) {
		alert("Operation Not Possible.\nReason: The subject entry is exceeding " +
			"the timetable boundary.");
		return false;
	}
	var valid = true;
	next: for(var p = 0; p < subjectRow["eachSlot"]; p++) {
		var tEntry = search(timeTable, "day", i, "slotNo", (j + p),
			"teacherId", source["teacherId"], "snapshotId", currentSnapshotId);
		if(tEntry !== -1) {
			valid = false;
			alert("Operation Not Possible.\nReason: Teacher Busy");
			break;
		}
		tEntry = search(timeTable, "day", i, "slotNo", (j + p), "roomId", source["roomId"],
				 "snapshotId", currentSnapshotId);
		if(tEntry !== -1) {
			valid = false;
			alert("Operation Not Possible.\nReason: Room not free");
			break;
		}
		tEntry = searchMultipleRows(timeTable, "day", i, "slotNo", (j + p),
					"classId", source["classId"], "snapshotId", currentSnapshotId);
		if(subjectRow["batches"] == "0") { /*Class subject*/
			if(tEntry !== -1) {
				valid = false;
				alert("Operation Not Possible.\nReason: Class subj cannot be "+
					"overlapped with batch subj");
				break;
			}
		}
		else {/*Batch subject*/
			for(var q in tEntry) {
				if(tEntry[q]["batchId"] == "1") {/*Class entry present*/
					valid = false;
					alert("Operation Not Possible.\nReason: Class subj cannot be "+
					"overlapped with batch subj");
					break next;
				}
				if(tEntry[q]["batchId"] == source["batchId"]) {/*Batch is already having smthng*/
					valid = false;
					alert("Operation Not Possible.\nReason: Batch(src/dest) is busy");
					break next;
				}
				if(bco !== -1) {
					if(search(bco, "batchOverlapId", tEntry[q]["batchId"]) === -1) {
						valid = false;
						alert("Operation Not Possible.\nReason: Batch cannot overlap");
						break next;
					}
				}
			}
		}
	}
	return valid;
}

function dropHandler(e) {
	/* get id
	find in helpertable
	if not null
	swap
	if null
	check validatiy of source only
	validatiy =>subject:eachSlot(teacher free, if class subj ==> 
		no batch subj or other class subj, if batch subj ==> 
		batch free, no class subj in slot, only overlapping batches)
	*/
	console.log("dropHandler: Entered ");
	var id = e.target.id.replace(/[^0-9\.]/g, '');
	if(id.length == 0) {
		dragSrcEl.style.opacity = 1;
		return;
	}
	var i = parseInt(id.substring(0, 1));
	var j = parseInt(id.substring(1, id.length - 1));
	var k = parseInt(id.substring(id.length - 1, id.length));

	var slotNo = parseInt(srcSlotEntry["slotNo"]);
	var destSlotEntry = helperTable[i - 1][j][k];
	var srcSubjectRow = search(subject, "subjectId", srcSlotEntry["subjectId"]);
	if(destSlotEntry !== null) { /*SWAP*/
		//Sourse valid in destn place
		var temp1 = [];/*for dest*/
		var temp2 = [];/*for src*/
		var destSubjectRow = search(subject, "subjectId", destSlotEntry["subjectId"]);
		for(var r = 0; r < destSubjectRow["eachSlot"]; r++) {
			temp1[r] = search(timeTable, "day", i, "slotNo", (j + r), "batchId", srcSlotEntry["batchId"],
					 "subjectId", destSubjectRow["subjectId"], "classId", destSlotEntry["classId"]);
			temp1[r]["day"] = "-1";/*equivalent to removing*/
			temp1[r]["slotNo"] = "-1";
		}
		var valid1 = checkValidity(i, j, srcSlotEntry);
		var valid2= false;
		//destn valid in source
		if(valid1) {
			for(var r = 0; r < srcSubjectRow["eachSlot"]; r++) {/*Remove previous entry*/
				temp2[r] = search(timeTable, "day", srcI,
					 "slotNo", (slotNo + r), "batchId", srcSlotEntry["batchId"],
					 "subjectId", srcSubjectRow["subjectId"], "classId", srcSlotEntry["classId"]);
				temp2[r]["day"] = "-1";
				temp2[r]["slotNo"] = "-1";
			}
			valid2 = checkValidity(srcI, slotNo, destSlotEntry);

		}
		if(!valid2 || !valid1) {
			if(temp2.length !== 0) {/*If operation fails*/
				for(var r = 0; r < srcSubjectRow["eachSlot"]; r++) {
					temp2[r]["day"] = srcI;
					temp2[r]["slotNo"] = "" + (slotNo + r);
				}
			}
			for(var r = 0; r < destSubjectRow["eachSlot"]; r++) {
				temp1[r]["day"] = "" + i;
				temp1[r]["slotNo"] = "" + (j + r);
			}
		}
		if(valid1 && valid2) {
			var r;/*swap day n slotNo*/
			for(r = 0; r < destSubjectRow["eachSlot"]; r++) {
				temp1[r]["day"] = srcI;
				temp1[r]["slotNo"] = "" + (slotNo + r);
			}
			for(r = 0; r < srcSubjectRow["eachSlot"]; r++) {
				temp2[r]["day"] = "" + i;
				temp2[r]["slotNo"] = "" + (j + r);
			}
		}
		else {
			dragSrcEl.style.opacity = 1;
		}
	}
	else if(destSlotEntry === null || destSlotEntry == 0) {/*Dest is blank*/
		var valid = checkValidity(i, j, srcSlotEntry);
		if(valid) {
			for(var r = 0; r < srcSubjectRow["eachSlot"]; r++) {
				var slot = search(timeTable, "day", srcI,"slotNo", (slotNo + r),
				"batchId", srcSlotEntry["batchId"], "subjectId", srcSubjectRow["subjectId"],
				"classId", srcSlotEntry["classId"]);
				slot["day"] = "" + i;
				slot["slotNo"] = "" + (j + r);
			}
		}
		else {
			dragSrcEl.style.opacity = 1;
		}
	}
	srcSlotEntry = null;
	fillTable2(true);
}

function dragEndHandler(e) {
	dragSrcEl.style.opacity = 1;
}


function searchIndex(table) {/*Searches and return the row, Otherwise returns -1*/
	var i;
	if(typeof table == "undefined" || table.length == 0) {
		return -1;
	}
	for(i in table){
		var found = true;
		for(var j = 1; j < arguments.length; j++) {
			if(table[i][arguments[j]] != arguments[j + 1]) {
				found = false;
				break;
			}
			j++;
		}
		if(found == true) {
			return i;
		}
	}
	return -1;

}

/* Searches and return the row, Otherwise returns -1
 * TODO: Return null if nothing found. That makes more sense.
 */
function search(table) {
	var i;
	if(typeof table == "undefined" || table.length == 0) {
		return -1;
	}
	for(i in table){
		var found = true;
		for(var j = 1; j < arguments.length; j++) {
			if(table[i][arguments[j]] != arguments[j + 1]) {
				found = false;
				break;
			}
			j++;
		}
		if(found == true) {
			return table[i];
		}
	}
	return -1;

}
/* Searches and return the row(many rows in form of array),
 * Otherwise returns -1
 * TODO: Return null if nothing found. That makes more sense.
 */
function searchMultipleRows(table) {
	var i;
	if(typeof table == "undefined" || table.length == 0) {
		return -1;
	}
	var rows = [];
	for(i in table){
		var found = true;
		for(var j = 1; j < arguments.length; j++) {
			if(table[i][arguments[j]] != arguments[j + 1]) {
				found = false;
				break;
			}
			j++;
		}
		if(found == true) {
			rows.push(table[i]);
		}
	}
	if(rows.length == 0)
		return -1;
	else
		return rows;

}
/* Depending on which page we are, indicated by global 'type' variable,
 * and the selected value from select-menu, indicated by global 'id'
 * Read the appropriate supportObject
 */
function getSupportObject() {
	switch(type) {
		case "class": supportObject = search(classTable, "classShortName", currTableId);
			break;
		case "teacher":supportObject = search(teacher, "teacherShortName", currTableId);
			break;
		case "room": supportObject = search(room, "roomShortName", currTableId);
			break;
		case "batch": supportObject = search(batch, "batchName", currTableId);
			break;
		default:
			console.log("ERROR: getSupportObject: should not come here in default");
			break;
	}
}
/* TODO: Check. Is this function for jQuery ? */
function insertAfter(elem, refElem) {
	var parent = refElem.parentNode;
	var next = refElem.nextSibling;
	if (next)
		return parent.insertBefore(elem, next);
	else
		return parent.appendChild(elem);
}

/* Highlight the selected cell */
function selected(element) {
	if(typeof selectedCell != "undefined") {
		[i, j, k] = makeIJKFromId(selectedCell.id);
		if(k == 0)
			selectedCell.style.borderStyle = "solid solid none";
		else
			selectedCell.style.borderStyle = "none solid";
		selectedCell.style.borderColor = "black";
		selectedCell.style.borderWidth = "1px";
	}
	element.style.borderColor = "green";
	element.style.borderStyle = "solid";
	element.style.borderWidth = "5px";
	selectedCell = element;
}
/* TODO: Remove copy() and paste() */
function copy() {
	if(typeof selectedCell != "undefined") {
		var clipboard = document.getElementById("clipboard");
		clipboard.removeChild(clipboard.childNodes[0]);
		var clone = selectedCell.childNodes[1].cloneNode(true);
		copyCell = clone;
		clipboard.appendChild(clone);
	}
}
function paste() {
	if(typeof copyCell != "undefined") {
		selectedCell.removeChild(selectedCell.childNodes[1]);
		var clone = copyCell.cloneNode(true);
		selectedCell.appendChild(clone);
	}
}
/*Loads timeTable data for snapshotName from server synchronously*/
function getTimetable(snapshotName) {
	var xhttp;
	xhttp = new XMLHttpRequest();
	/*xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			}
		}
	}; */
	xhttp.open("POST", "timetable.php", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=getTimetable&snapshotName=\"" + snapshotName + "\"");
	var db = JSON.parse(xhttp.responseText);
	timeTable = db.timeTable;
	if(typeof timeTable == "undefined")
		timeTable = [];
	currentSnapshotName = snapshotName;
}
function getOneTable(tName, asynchronousOrNot) {/*Loads data from server asynchronously*/
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var db = JSON.parse(this.responseText);
			return db;
		}
	};
	xhttp.open("POST", "timetable.php", asynchronousOrNot);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=getOneTable&tableName=" + tName + "&snapshotId=" + currentSnapshotId);
	if(asynchronousOrNot == false) {
		var db = JSON.parse(xhttp.responseText);
		return db;  /* JS variables are pass by value */
	}
}
function getSnapshotTable() {/*Loads data from server asynchronously*/
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "timetable.php", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=getOneTable&tableName=snapshot");
	var db = JSON.parse(xhttp.responseText);
	return db;  /* JS variables are pass by value */
}
function firstSnapshotForm() {
	var snapshotName = prompt("No Snapshot exists. Enter first snapshot Name", "default");
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "timetable.php", false);
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	/* TODO: Change snapshotCreator */
	xhttp.send("reqType=insertSnapshotEntry" + "&configId=" + currentConfigId +
				"&snapshotCreator=1" + "&snapshotName=" + snapshotName);
	$("checkMessage").html("Creating Snapshot...Wait");
	$("checkMessage").show();
	var response = JSON.parse(xhttp.responseText);
	if(response["Success"] == "True")
		return true;
	return false;
}
function getDeptConfigSnapshot() {
	$("#waitMessage").hide();
	$("#checkMessage").hide();
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "timetable.php", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=getOneTable&tableName=dept");
	database = JSON.parse(xhttp.responseText);
	dept = database.dept;
	if(typeof dept == "undefined") {
		alert("Table: dept not found. Check your Error Logs");
		return false;
	}
	dept.sort(function(a, b) {
		var x = a.deptShortName.toLowerCase();
		var y = b.deptShortName.toLowerCase();
		if(x < y)
			return -1;
		if(x > y)
			return 1;
		return 0;
	});
	currentDeptId = dept[0]["deptId"];

	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "timetable.php", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=getOneTable&tableName=config");
	database = JSON.parse(xhttp.responseText);
	config = database.config;
	if(typeof config == "undefined") {
		alert("Table: config not found. Check your Error Logs");
		return false;
	}
	if(config.length < 1) {
		configForm();
		return false;
	}
	/* TODO: This should be configurable */
	currentConfigId = config[0]["configId"];

	snapshot = getSnapshotTable().snapshot;
	if(snapshot.length < 1) {
		firstSnapshotForm();
		getDeptConfigSnapshot();
	}
	if(typeof snapshot == "undefined") {
		alert("Table: snapshot not found. Check your Error Logs");
		return false;
	}
	currentSnapshotId = snapshot[0]["snapshotId"];
	currentSnapshotName = snapshot[0]["snapshotName"];

	/* Initially all selection menu is hidden, now display it */
	$(".selection-menu").css("display", "block");
	return true;
}
function getDataTables() {/*Loads data from server asynchronously*/
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.open("POST", "timetable.php", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=getDataTables&snapshotId=" + currentSnapshotId);
	database = JSON.parse(xhttp.responseText);
	teacher = database.teacher;
	if(typeof teacher == "undefined") {
		alert("Table: teacher not found. Check your Error Logs");
		return false;
	}
	teacher.sort(function(a, b) {
		var x = a.teacherShortName.toLowerCase();
		var y = b.teacherShortName.toLowerCase();
		if(x < y)
			return -1;
		if(x > y)
			return 1;
		return 0;
	});

	classTable = database.class;
	if(typeof classTable == "undefined") {
		alert("Table: class not found. Check your Error Logs");
		return false;
	}
	classTable.sort(function(a, b) {
		var x = a.classShortName.toLowerCase();
		var y = b.classShortName.toLowerCase();
		if(x < y)
			return -1;
		if(x > y)
			return 1;
		return 0;
	});

	batch = database.batch;
	if(typeof batch == "undefined") {
		alert("Table: batch not found. Check your Error Logs");
		return false;
	}
	batch.sort(function(a, b) {
		var x = a.batchName.toLowerCase();
		var y = b.batchName.toLowerCase();
		if(x < y)
			return -1;
		if(x > y)
			return 1;
		return 0;
	});

	batchCanOverlap = database.batchCanOverlap;
	if(typeof batchCanOverlap == "undefined") {
		alert("Table: batchCanOverlap not found. Check your Error Logs");
		return false;
	}

	room = database.room;
	if(typeof room == "undefined") {
		alert("Table: room not found. Check your Error Logs");
		return false;
	}
	room.sort(function(a, b) {
		var x = a.roomShortName.toLowerCase();
		var y = b.roomShortName.toLowerCase();
		if(x < y)
			return -1;
		if(x > y)
			return 1;
		return 0;
	});

	batchClass = database.batchClass;
	if(typeof batchClass == "undefined") {
		alert("Table: batchClass not found. Check your Error Logs");
		return false;
	}

	subject = database.subject;
	if(typeof subject == "undefined") {
		alert("Table: subject not found. Check your Error Logs");
		return false;
	}
	subject.sort(function(a, b) {
		var x = a.subjectShortName.toLowerCase();
		var y = b.subjectShortName.toLowerCase();
		if(x < y)
			return -1;
		if(x > y)
			return 1;
		return 0;
	});

	subjectBatchTeacher = database.subjectBatchTeacher; // subjectBatch
	if(typeof subjectBatchTeacher == "undefined") {
		alert("Table: subjectBatchTeacher not found. Check your Error Logs");
		return false;
	}

	subjectClassTeacher = database.subjectClassTeacher;
	if(typeof subjectClassTeacher == "undefined") {
		alert("Table: subjectClassTeacher not found. Check your Error Logs");
		return false;
	}

	classRoom = database.classRoom;
	if(typeof classRoom == "undefined")
		classRoom = [];

	batchRoom = database.batchRoom;
	if(typeof batchRoom == "undefined")
		batchRoom = [];

	subjectRoom = database.subjectRoom;
	if(typeof subjectRoom == "undefined")
		subjectRoom = [];

	overlappingSBT = database.overlappingSBT;
	if(typeof overlappingSBT == "undefined")
		overlappingSBT = [];

	fixedEntry = database.fixedEntry;
	if(typeof fixedEntry == "undefined")
		fixedEntry = [];

}

function createOptionTag(value, textString, selected) {
	var option = document.createElement("option");
	option.setAttribute("value", value);
	if(selected)
		option.selected = true;
	var text = document.createTextNode(textString);
	option.appendChild(text);
	return option;
}

/*Returns time in needed format*/
function displayTime(date) {
	var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
	var am_pm = date.getHours() >= 12 ? "PM" : "AM";
	hours = hours < 10 ? "0" + hours : hours;
	var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
	return hours + ":" + minutes +" " + am_pm;
}

/* initializeEnableRowArray:
 * slottableCount is set to no. of actual rows needed per day,
 * which is no. of batches for a class, 1 otherwise.
 * initial_value is 0 in the only call() we have, so it can be removed.
 */
function initializeEnableRowArray(row, cols, slottableCount, initial_value) {
	enabledRows = new Array(row).fill(initial_value);
	helperTable = new Array(row).fill(initial_value).map(row => new Array(cols).fill(initial_value).
						map(cols => new Array(slottableCount).fill(initial_value)));
}

function createTable(days, nSlots, slotTablePerDay, startTime, timePerSlot) {
	var table = document.createElement("TABLE");
	var i, j, k, tr, td, text;
	table.setAttribute("class", "timeTable");
	//table.setAttribute("border", "3px solid black");
	tr = document.createElement("tr");
	td = document.createElement("th");
	text = document.createTextNode("Day");
	var button = document.createElement("button");
	button.setAttribute("class", "animateButtonTop");
	button.style.align = "right";
	button.appendChild(document.createTextNode("+"));
	td.appendChild(button);
	td.appendChild(text);
	td.appendChild(button);
	tr.appendChild(td);
	var start = new Date("February 25, 2017 "+ startTime);

	for(i = 0; i < nSlots; i++) {
		td = document.createElement("th");
		var text = displayTime(start);
		start = new Date(start.getTime() + (timePerSlot * 1000)); /*timePerSlot is in seconds*/
		td.innerHTML = text;
		tr.appendChild(td);
	}
	table.appendChild(tr);
	for(i = 1; i <= days; i++) {/*Daywise*/
		for(k = 0; k < slotTablePerDay; k++) {/*slottable row per day*/
			tr = document.createElement("tr");
			tr.setAttribute("id", "row" + i + k);
			tr.setAttribute("class", "mainTableRow");
			if(k == 0) {/*slottable per day*/
				td = document.createElement("td");
				td.setAttribute("id", "" + i);
				td.setAttribute("class", "dayname");
				var button = document.createElement("button");
				button.setAttribute("class", "animateButton");
				button.style.align = "right";
				button.appendChild(document.createTextNode("+"));
				td.appendChild(button);
				td.appendChild(document.createElement("br"));
				td.appendChild(document.createTextNode(daysName[i]));
				tr.appendChild(td);
			}
			for(j = 0; j < nSlots; j++) {
				/*i=noOfDays * k=slottable-row-per-day * j=nSlots */
				td = document.createElement("td");
				td.setAttribute("id", "cell"+ makeIdFromIJK(i, j, k));
				td.setAttribute("class", "cell");
				td.setAttribute("onmousedown", "selected(this)");
				var div = document.createElement("div");
				div.setAttribute("class", "div"+ i + j);
				var slottable = document.createElement("table");
				slottable.setAttribute("id", "slottable"+ makeIdFromIJK(i, j, k));
				slottable.setAttribute("class", "slottable");
				slottable.setAttribute("width", "90%");
				//slottable.setAttribute("class", "slottable" + k);
				td.setAttribute("ondragenter", "dragEnterHandler(event)");
				slottable.setAttribute("ondragover", "dragOverHandler(event)");
				td.setAttribute("ondragleave", "dragLeaveHandler(event)");
				slottable.setAttribute("ondrop", "dropHandler(event)");
				slottable.setAttribute("ondragend", "dragEndHandler(event)");
				//slottable.style.width = "100%";
				div.appendChild(slottable);
				td.appendChild(div);
				tr.appendChild(td);
			}
			//document.getElementsByClassName("cell").style.width = window.width * 0.8 / nSlots;
			table.appendChild(tr);
			if(k != 0) {
				tr.style.display = "none";
			}
		}
	}
	return table;
}

/* Sorts the subject table on eachSlot of a subject  */
function sort(table) {
	for(var i = 0; i < table.length - 1; i++) {
		for(var j = 0; j < table.length - i - 1 ; j++) {
			var row1 = search(subject, "subjectId", table[j]["subjectId"]);
			var row2 = search(subject, "subjectId", table[j + 1]["subjectId"]);
			if(row1["eachSlot"] < row2["eachSlot"]) {
				var temp = table[j + 1];
				table[j + 1] = table[j];
				table[j] = temp;
			}
		}
	}
}

function createTimeTableEntry(day, slotNo, roomId, classId, subjectId,
			teacherId, batchId, snapshotId, isFixed) {
	this.day = "" + day;
	this.slotNo = "" + slotNo;
	this.roomId = "" + roomId;
	this.classId = "" + classId;
	this.subjectId = "" + subjectId;
	this.teacherId = "" + teacherId;
	this.batchId = "" + batchId;
	this.isFixed = "" + isFixed;
	this.snapshotId = "" + snapshotId;
	if(timeTable.length == 0)
		this.ttId = 1;
	else
		this.ttId = "" + (parseInt(timeTable[timeTable.length - 1]["ttId"]) + 1);
	dirtyTimeTable = true;
}

function createClassRoomEntry(classId, roomId) {
	this.classId = "" + classId;
	this.roomId = "" + roomId;
	if(classRoom.length == 0)
		this.crId = 1;
	else
		this.crId = "" + (parseInt(classRoom[classRoom.length - 1]["crId"]) + 1);
}

function createBatchRoomEntry(batchId, roomId) {
	this.batchId = "" + batchId;
	this.roomId = "" + roomId;
	if(batchRoom.length == 0)
		this.brId = 1;
	else
		this.brId = "" + (parseInt(batchRoom[batchRoom.length - 1]["brId"]) + 1);
}

function createSubjectRoomEntry(subjectId, roomId) {
	this.subjectId = "" + subjectId;
	this.roomId = "" + roomId;
	if(subjectRoom.length == 0)
		this.srId = 1;
	else
		this.srId = "" + (parseInt(subjectRoom[subjectRoom.length - 1]["srId"]) + 1);
}

function makeTimeTableEntry(day, slotNo, roomId, classId, subjectId,
		teacherId, batchId, currentSnapshotId, isFixed, eachSlot) {
	if(classId == null && batchId == null) {
		alert("ERROR: makeTimeTableEntry: classId is null");
	}
	for(var i = 0; i < eachSlot; i++) {
		var newEntry = new createTimeTableEntry(day, (parseInt(slotNo) + i),
						roomId, classId, subjectId, teacherId, batchId,
						currentSnapshotId, isFixed);
		timeTable.push(newEntry);
		console.log("makeTimeTableEntry: " + debugPrint("timeTable", newEntry));
	}
	if((""+ batchId) != "null") {
	/* TODO: Abhijit. Check this if condition. For overlapping sbt*/
		var sbt = search(subjectBatchTeacher, "subjectId", subjectId,
							 "batchId", batchId);
		var osbt;
		/* TODO: Abhijit. This should be done in a loop over each entry of sbt.
		 * use searchMultipleRows instead of search() above
		 */
		if(sbt !== -1) {
			var osbt = searchMultipleRows(overlappingSBT, "sbtId1", sbt["sbtId"]);
			if(osbt === -1)
				 return;
			for(var i in osbt) {
				var batchId = search(subjectBatchTeacher, "sbtId", osbt[i]["sbtId2"])["batchId"];
				var classId = search(batchClass, "batchId", batchId)["classId"];
				for(var j = 0; j < eachSlot; j++) {
					var newEntry = new createTimeTableEntry(day, (parseInt(slotNo) + j),
									roomId, classId, subjectId, teacherId,
									batchId, currentSnapshotId, isFixed);
					timeTable.push(newEntry);
					console.log("makeTimeTableEntry: newEntry = " + JSON.stringify(newEntry));
				}
			}
		}
	}
}

function roomSelected(selecttag) {
	var Id = selecttag.getAttribute("id");
	[iid, jid, kid ] = makeIJKFromId(Id);
	Id = makeIdFromIJK(iid, jid, kid);
	var roomShortName = document.getElementById("room" + Id).
				options[document.getElementById("room" + Id).selectedIndex].text;
	if(roomShortName == "--Room--")
		return;
	var roomRow = search(room, "roomShortName", roomShortName);

	var batchId = null;
	var classId;
	var teacherId;
	var temp = document.getElementById("subject"+ Id );
	/*subject*/
	var subjectRow = search(subject, "subjectShortName", temp.innerHTML);

	if(subjectRow["batches"] == "1") {/*batch*/
		temp = document.getElementById("batch" + Id);
		var batchRow = search(batch, "batchName", temp.innerHTML);
		batchId = batchRow["batchId"];
	}
	if(type == "teacher")
		teacherId = supportObject["teacherId"];
	else
		teacherId = search(teacher, "teacherShortName",
				document.getElementById("teacher" + Id).innerHTML)["teacherId"];/*teacher*/
	if(type == "class")
		classId = supportObject["classId"];
	else
		classId = search(classTable, "classShortName",
					document.getElementById("class" + Id).innerHTML)["classId"];
	if(type == "batch") {
		batchId = supportObject["batchId"];
	}
	/*for(var i = 0; i < parseInt(subjectRow["eachSlot"]); i++) {
		var newEntry = new createTimeTableEntry(iid, (parseInt(jid) + i),
							roomRow["roomId"], classId,
							subjectRow["subjectId"], teacherId,
							batchId, currentSnapshotId, 0);
		timeTable.push(newEntry);
		console.log("roomEntry: newEntry = " + JSON.stringify(newEntry));
	}*/
	makeTimeTableEntry(iid, jid, roomRow["roomId"], classId, subjectRow["subjectId"],
		teacherId, batchId, currentSnapshotId, 0, parseInt(subjectRow["eachSlot"]));

	var crEntry = new createClassRoomEntry(classId, roomRow["roomId"]);
	if(batchId)
		var brEntry = new createBatchRoomEntry(batchId, roomRow["roomId"]);
	var srEntry = new createSubjectRoomEntry(subjectRow["subjectId"], roomRow["roomId"]);

	if(search(classRoom, "classId", classId) === -1)
		classRoom.push(crEntry);
	if(batchId && search(batchRoom, "batchId", batchId) === -1)
		batchRoom.push(brEntry);

	if(search(subjectRoom, "subjectId", subjectRow["subjectId"]) === -1)
		subjectRoom.push(srEntry);
	fillTable2(true);
}

function getEligibleBatches(i, j, k, subjectRow) {
	console.log("getEligibleBatches: i = " + i + " j = " + j + " k = " + k +
				"subject = " + subjectRow["subjectShortName"]);
	var optionString = "<option value=\"NOT_SELECTED\">--Batch--</option>";
	var eligibleBatches = [];
	var disabledBatches = [];
	var configRow = search(config, "configId", currentConfigId);

	/*Get batches for this subject which belong to the same class*/
	var sbtlist;
	if(type == "class") {
		sbtlist = searchMultipleRows(subjectBatchTeacher, "subjectId", subjectRow["subjectId"]);
		var bcRows = searchMultipleRows(batchClass, "classId", supportObject["classId"]);
		for(var n = 0; n < sbtlist.length; n++) {
			if(search(bcRows, "batchId", sbtlist[n]["batchId"]) === -1) {
				sbtlist.splice(n, 1);
				--n;
			}
		}
	}
	else if(type == "teacher") {
		sbtlist = searchMultipleRows(subjectBatchTeacher, "subjectId", subjectRow["subjectId"],
					"teacherId", supportObject["teacherId"]);
	}
	else if(type == "room") {
		sbtlist = searchMultipleRows(subjectBatchTeacher, "subjectId", subjectRow["subjectId"]);
	} else {
		alert("ERROR: getEligibleBatches: type = " + type + ". Should not come here");
	}
	var eachSlot = parseInt(subjectRow["eachSlot"]);

	for(var m = 0; m < sbtlist.length; m++) {
		var currBatch = search(batch, "batchId", sbtlist[m]["batchId"]);
		//var currSubject = search(subject, "subjectId", sbtlist[m]["subjectId"]);
		/* Skip if already included in the list */
		if(eligibleBatches.indexOf(currBatch) != -1) {
			continue;
		}

		if(allEntriesAlreadyDoneForSubject(subjectRow, "batchId" , sbtlist[m]["batchId"], 
			search(batch, "batchId", sbtlist[m]["batchId"])["batchName"], 0)) {
				disabledBatches.push([search(batch, "batchId", sbtlist[m]["batchId"])["batchName"],
				"Done"]);
			continue;
		}
		if(teacherBusyInThisSlot(i, j, subjectRow, sbtlist[m]["teacherId"], 0)) {
			disabledBatches.push([search(batch, "batchId", sbtlist[m]["batchId"])["batchName"],
				"TchrBusy"]);
			continue;
		}
		if(BatchBusyInThisSlot(i, j, subjectRow, sbtlist[m]["classId"],
						sbtlist[m]["batchId"], 0)) {
			disabledBatches.push([search(batch, "batchId", sbtlist[m]["batchId"])["batchName"],
				"BtchBusy"]);
			continue;
		}
		/* The only separate check for batches */
		if(overlappingBatchBusyInThisSlot(i, j, sbtlist[m], sbtlist[m]["batchId"], 0)) {
			disabledBatches.push([search(batch, "batchId", sbtlist[m]["batchId"])["batchName"],
				"OLBusy"]);
			continue;
		}

		eligibleBatches.push(search(batch, "batchId", sbtlist[m]["batchId"]));
	}
	for(var r in eligibleBatches) {
		var batchName = eligibleBatches[r]["batchName"];
		optionString += "<option value =\""+ batchName +"\">" + batchName + "</option>";
	}
	for(var z in disabledBatches) {
		optionString += "<option class=\"disabledEntries1\" disabled=\"disabled\"" +
			"value = \"\">" + disabledBatches[z][0] + "</option>";
		optionString += "<option class=\"disabledEntries2\" disabled=\"disabled\"" +
			"value = \"\">&nbsp&nbsp:" + disabledBatches[z][1] + "</option>";
	}
	return optionString;
}

function getEligibleRoom(i, j, k, capacity, subjectRow, roomFound) {
	// TODO: This needs to be modified to return the fixed room
	// if there is a classRoom or batchRoom mapping
	var optionString = "";
	var eachSlot = parseInt(subjectRow["eachSlot"]);
	if(roomFound === -1) {
		optionString += "<option value = \"NOT_SELECTED\">--Room--</option>";
	}
	else {/*For perferred room*/
		var roomRow = search(room, "roomId", roomFound["roomId"]);
		var validPreferred = 1;
		for(var z =0; z < eachSlot; z++) {
			var found = search(timeTable,
						"day", i, "slotNo", "" + (parseInt(j) + z),
						"roomId", roomRow["roomId"],  "snapshotId", currentSnapshotId);
			if(found !== -1) {/*There are other classes in this room*/
				validPreferred = 0;
				break;
			}
		}
		if(validPreferred == 1) {
			var temporary_row = search(room, "roomId", roomRow['roomId']);
			if(parseInt(temporary_row['roomCount']) + roomSizeDelta > capacity){
				optionString += "<option value = \"" + roomRow["roomShortName"] +
						"\" selected=\"selected\">" + roomRow["roomShortName"] +
						"</option>";
			}
		}
	}
	disabledRooms = []
	for(var y = 0; y < room.length; y++) {
		var valid = 1;
		for(var z =0; z < eachSlot; z++) {
			var found = search(timeTable, "day", i, "slotNo", "" + (parseInt(j) + z),
						"roomId", room[y]["roomId"],  "snapshotId", currentSnapshotId);
			/*There are other classes in this room*/
			if(found !== -1) {
				valid = 0;
				disabledRooms.push([room[y]["roomShortName"], "Busy"]);
				break;
			}
			if((parseInt(room[y]["roomCount"]) + roomSizeDelta) < capacity) {
				valid = 0;
				disabledRooms.push([room[y]["roomShortName"], "Small"]);
				break;
			}
		}
		if(valid == 0)
			continue;
		/* TODO: The capacity check needs to be more flexible
		if(parseInt(room[y]["roomCount"]) >= capacity)  */
		if(room[y]["roomId"] != roomFound["roomId"] || validPreferred == 0) {
			 optionString += "<option value = \"" + room[y]["roomShortName"] +
							"\">" + room[y]["roomShortName"] + "</option>";
		}
	}
	for(z in disabledRooms) {
		 optionString += "<option disabled=true class=\"disabledEntries1\"" +
					"\">" + disabledRooms[z][0] + "</option>";
		 optionString += "<option disabled=true class=\"disabledEntries2\"" +
					"\">&nbsp;&nbsp" + disabledRooms[z][1] + "</option>";
	}
	return optionString;
}

/*Final stage for room/teacher type*/
function classSelected(selecttag) {
	if(type == "room") {
		var classShortName = selecttag.options[selecttag.selectedIndex].text;
		var Id = selecttag.getAttribute("id");
		[iid, jid, kid ] = makeIJKFromId(Id);
		Id = makeIdFromIJK(iid, jid, kid);

		var classRow = search(classTable, "classShortName", classShortName);
		var subjectShortName = document.getElementById("subject" + Id).innerHTML;
		var subjectRow = search(subject, "subjectShortName", subjectShortName);
		var teacherRow = search(subjectClassTeacher, "subjectId", subjectRow["subjectId"],
					"classId", classRow["classId"]);
		makeTimeTableEntry(iid, jid, supportObject["roomId"], classRow["classId"], subjectRow["subjectId"],
			teacherRow["teacherId"], null, currentSnapshotId, 0, parseInt(subjectRow["eachSlot"]));
		fillTable2(false);
	} else if(type == "teacher") {
		var classShortName = selecttag.options[selecttag.selectedIndex].text;
		var Id = selecttag.getAttribute("id");
		[iid, jid, kid ] = makeIJKFromId(Id);
		Id = makeIdFromIJK(iid, jid, kid);
		capacity = search(classTable, "classShortName", classShortName)["classCount"];
		var subjectShortName = document.getElementById("subject" + Id).innerHTML;
		var subjectRow = search(subject, "subjectShortName", subjectShortName);
		var roomSelect = document.getElementById("room" + Id);
		roomSelect.style.display = "";
		document.getElementById("checkbox" + Id).style.display = "";
		selecttag.parentElement.innerHTML = "" +
		"<div id= \"class" + Id + "\"class= \"box\">" +
			classShortName+
		"</div>";

		roomFound = search(classRoom, "classId", search(classTable,
						"classShortName", classShortName)["classId"]);
		roomSelect.innerHTML = getEligibleRoom(parseInt(iid), parseInt(jid), parseInt(kid),
								 capacity, subjectRow, roomFound);/*room option*/
	} else {
		alert("ERROR: classSelected wrong type");
	}
}

/* Called only from "room" page after selecting a Subject
 * Checks two conditions for every SCT entry for this subject
 *   (a) Some entries still left for this class-subject pair
 *   (b) Class is free on all required slots
 */
function getEligibleClass(i, j, k, subjectRow) {
	var sct = searchMultipleRows(subjectClassTeacher, "subjectId", subjectRow["subjectId"]);
	var classlist = [];
	var existingEntries;
	var optionString = "<option value=\"NOT_SELECTED\">--Class--</option>";
	var disabledClasses = [];
	for(var l in sct) {
		var classId = sct[l]["classId"];

		if(allEntriesAlreadyDoneForSubject(subjectRow, "classId", sct[l]["classId"],
				search(classTable, "classId", sct[l]["classId"])["classShortName"], 0)) {
			disabledClasses.push([search(classTable, "classId", sct[l]["classId"])
						["classShortName"], "Full"]);
			console.log("getEligibleClass: Done. skipping " + search(classTable, "classId", sct[l]["classId"])
						["classShortName"]);
				continue;
		}
		if(classBusyInThisSlot(i, j, subjectRow, sct[l]["classId"], 0)) {
			disabledClasses.push([search(classTable, "classId", sct[l]["classId"])
				["classShortName"], "Busy"]);
			console.log("getEligibleClass: Busy. skipping " + search(classTable, "classId", sct[l]["classId"])
						["classShortName"]);
			continue;
		}
		classlist.push(search(classTable, "classId", classId));
	}
	if(classlist.length == 0) {
		alert("ERROR: getEligibleClass: No eligible class found");
		fillTable2(false);
		return  "";
	}
	for(var r in classlist) {
		optionString += "<option value= \"" + classlist[r]["classShortName"] + "\">" +
					classlist[r]["classShortName"] + "</option>";
	}
	for(z in disabledClasses) {
		 optionString += "<option disabled=true class=\"disabledEntries1\"" +
					"\">" + disabledClasses[z][0] + "</option>";
		 optionString += "<option disabled=true class=\"disabledEntries2\"" +
					"\">&nbsp;&nbsp" + disabledClasses[z][1] + "</option>";
	}
	return optionString;
}

/* On class page:
 *    show teacher Info + roomselect
 * On teacher page:
 *    show class info + roomselect
 * On batch page:
 *     ERORR
 * On room page:
 * 	   Make TT entry. showTable();
 */
function batchSelected(selecttag) {
	var batchName = selecttag.options[selecttag.selectedIndex].text;

	var Id = selecttag.getAttribute("id");
	[iid, jid, kid ] = makeIJKFromId(Id);
	Id = makeIdFromIJK(iid, jid, kid);

	var batchRow = search(batch, "batchName", batchName);
	var extraInfo = "";/*When additional info is discovered*/
	switch(type) {
		case "class" :
		case "teacher" :
			var roomFound, optionString = "";
			var subjectShortName = document.getElementById("subject" + Id).innerHTML;
			var subjectRow = search(subject, "subjectShortName", subjectShortName);
			var roomSelect = document.getElementById("room" + Id);
			roomSelect.style.display = "";
			document.getElementById("checkbox" + Id).style.display = "";

			var capacity = parseInt(batchRow["batchCount"]);
			if(type == "class") {
				var teacherRow = search(subjectBatchTeacher, "subjectId", subjectRow["subjectId"],
							"batchId", batchRow["batchId"]);
				teacherRow = search(teacher, "teacherId", teacherRow["teacherId"]);
				extraInfo += "<div id=\"teacher" + Id +"\" class=\"box\">" +
							teacherRow["teacherShortName"] +
						"</div>";
			}
			else if(type == "teacher"){
				var classShortName = search(classTable, "classId",
							search(batchClass, "batchId", batchRow["batchId"])["classId"])
									["classShortName"];
				extraInfo += "<div id=\"class" + Id + "\" class=\"box\">" +
							classShortName +
						"</div>";
			}
			roomFound = search(subjectRoom, "subjectId", subjectRow["subjectId"]);
			if(roomFound == -1) {
				roomFound = search(batchRoom, "batchId", batchRow["batchId"]);
			}
			roomSelect.innerHTML = getEligibleRoom(parseInt(iid), parseInt(jid), parseInt(kid),
								 capacity, subjectRow, roomFound);/*room option*/
			break;
		case "room" :/*Final stage for room type*/
			var subjectShortName = document.getElementById("subject" + Id).innerHTML;
			var subjectRow = search(subject, "subjectShortName", subjectShortName);
			var teacherId = search(subjectBatchTeacher, "subjectId", subjectRow["subjectId"],
						"batchId", batchRow["batchId"])["teacherId"];
			var classId = search(batchClass, "batchId", batchRow["batchId"])["classId"];
			makeTimeTableEntry(iid, jid, supportObject["roomId"], classId, subjectRow["subjectId"],
								teacherId, batchRow["batchId"], currentSnapshotId,
								0, parseInt(subjectRow["eachSlot"]));
			fillTable2(false);
			return;
			break;
		default:
			alert("ERROR: batchSelected: should not come here in default");
			break;
	}
	selecttag.parentElement.innerHTML =	"<div id= \"batch" + Id + "\"class= \"box\">"
			+ batchName + "</div>" + extraInfo;
}

function fixedEntryObject(ttId, fixedText) {
	this.ttId = "" + ttId;
	this.fixedText = "" + fixedText;
	if(fixedEntry.length == 0)
		this.feId = 1;
	else
		this.feId = "" + (parseInt(fixedEntry[fixedEntry.length - 1]["feId"]) + 1);
}

/* Get Text for fixedEntry
 * Make TT Entry
 * Make fixedEntry
 * Show Fixed Entry
 * Make helperTable entry
 */
function fixedSlotEntry(i, j, k) {
	var label = prompt("Enter Label for Fixed Slot:", "LUNCH");
	if(label != null) {
		if(type == "class") {
			makeTimeTableEntry(i, j, null, supportObject["classId"], null,
				null, null, currentSnapshotId, 1, 1);
		}
		else if(type == "batch") {
			classId = search(batchClass, "batchId", supportObject["batchId"])["classId"];
			makeTimeTableEntry(i, j, null, classId, null,
				null, supportObject["batchId"], currentSnapshotId, 1, 1);
		}
		fixedEntry.push(new fixedEntryObject(timeTable[timeTable.length - 1]["ttId"], label));
		/*var slottable = document.getElementById("slottable" + makeIdFromIJK(i, j, k));
		if(slottable == null) {
			alert("ERROR: slottable null for fixedEntry");
			return;
		}

		slottable.innerHTML =
			"<tr class=\"mainTableRow\">" +
				"<td>" +
					"<div class= \"box\" id = \"box" +  makeIdFromIJK(i, j, k) + "\">" +
						"<span class = \"fixedEntry\"" +
						"id = \"fixed" + makeIdFromIJK(i, j, k) + "\">" +
							label +
						"</span>" +
						"<span id = \"" + makeIdFromIJK(i, j, k) + "\" " +
						"class=\"delete\" onclick = deleteEntry(this)>" +
							"x" +
						"</span>" +
					"</div>" +
				"</td>" +
			"</tr>";*/
		helperTable[i - 1][j][k] = timeTable[timeTable.length - 1];
		fillTable2(false);
	}
}

/* After selecting a subject
 * On class page:
 *    show teacherInfo + batchList/RoomList
 * On batch page:
 *    show  class+teacher Info + RoomList
 * On room page:
 *    show  class+batch List
 * On teacher page:
 *    show classInfo + batchList/RoomList
 */
function subjectSelected(selecttag) {
	var index = selecttag.selectedIndex;
	var subjectShortName = selecttag.options[index].value;

	var Id = selecttag.getAttribute("id");
	[iid, jid, kid] = makeIJKFromId(Id);
	Id = makeIdFromIJK(iid, jid, kid);

	if(subjectShortName == "FixedEntry") {
		fixedSlotEntry(parseInt(iid), parseInt(jid), parseInt(kid));
		return;
	}

	var subjectRow = search(subject, "subjectShortName", subjectShortName);
	var batches = subjectRow["batches"];
	var extraInfo = "";/*When additional info is discovered*/
	var roomFound;
	switch(type) {
		case "class" :
			if(batches === "0") { /* Non Batchable Subject*/
				var roomSelect = document.getElementById("room" + Id);
				roomSelect.style.display = "";
				document.getElementById("checkbox" + Id).style.display = "";
				var capacity = parseInt(supportObject["classCount"]);
				/* On class page, show teacher's info*/
				var sctEntry = search(subjectClassTeacher,
								"subjectId", subjectRow["subjectId"],
								"classId", supportObject["classId"]);
				var teacherRow = search(teacher, "teacherId", sctEntry["teacherId"]);
				extraInfo += "<div id=\"teacher"+ Id +
								"\" class=\"box\">" +
								teacherRow["teacherShortName"] +
					"</div>";
				roomFound = search(classRoom, "classId", supportObject["classId"]);
				if(roomFound == -1) {
					roomFound = search(subjectRoom, "subjectId", subjectRow["subjectId"]);
				}
				/* get List of rooms to be displayed*/
				roomSelect.innerHTML = getEligibleRoom(parseInt(iid), parseInt(jid),
											parseInt(kid), capacity, subjectRow, roomFound);
			}
			else {/*Subject Having Batches*/
				var batchSelect = document.getElementById("batch" + Id);
				batchSelect.style.display = "";
				batchSelect.innerHTML = getEligibleBatches(parseInt(iid), parseInt(jid),
											parseInt(kid), subjectRow);/*batch option*/
			}
			break;
		case "teacher" :
			if(batches === "0") { /* Non Batchable Subject*/
				var sctEntry = searchMultipleRows(subjectClassTeacher,
								"subjectId", subjectRow["subjectId"],
								"teacherId", supportObject["teacherId"]);
				if(sctEntry.length == 1) {
					var classRow = search(classTable, "classId", sctEntry[0]["classId"]);
					extraInfo += "<div id=\"class"+ Id +
								"\" class=\"box\">" +
								classRow["classShortName"] +
								"</div>";
					roomFound = search(classRoom, "classId", classRow["classId"]);
				} else {
					var classSelect = document.getElementById("class" + Id);
					classSelect.style.display = "";
					classSelect.innerHTML = getEligibleClass(parseInt(iid), parseInt(jid),
									parseInt(kid), subjectRow);
				}
			} else {
				var batchSelect = document.getElementById("batch" + Id);
				batchSelect.style.display = "";
				batchSelect.innerHTML = getEligibleBatches(parseInt(iid), parseInt(jid),
											parseInt(kid), subjectRow);/*batch option*/
			}
			break;
		case "batch" :
			var roomSelect = document.getElementById("room" + Id);
			roomSelect.style.display = "";
			document.getElementById("checkbox" + Id).style.display = "";
			var classRow = search(classTable, "classId",
					search(batchClass, "batchId", supportObject["batchId"])["classId"]);
			var teacherRow = search(teacher, "teacherId", search(subjectBatchTeacher,
						 "subjectId", subjectRow["subjectId"], "batchId",
								 supportObject["batchId"])["teacherId"]);
			extraInfo += "<div id= \"teacher"+ Id +"\"class=\"box\">" +
						teacherRow["teacherShortName"] +
					"</div>";
			extraInfo += "<div id= \"class"+ Id +"\"class=\"box\">" +
						classRow["classShortName"] +
						"</div>";
			var capacity = parseInt(classRow["classCount"]);
			roomFound = search(subjectRoom, "subjectId", subjectRow["subjectId"]);
			if(roomFound == -1) {
				roomFound = search(batchRoom, "batchId", supportObject["batchId"]);
			}
			roomSelect.innerHTML = getEligibleRoom(parseInt(iid), parseInt(jid),
								parseInt(kid), capacity,
								subjectRow, roomFound);/*room option*/
			break;
		case "room" :
			if(subjectRow["batches"] == "0") {
				var classSelect = document.getElementById("class" + Id);
				classSelect.style.display = "";
				classSelect.innerHTML = getEligibleClass(parseInt(iid), parseInt(jid),
									parseInt(kid), subjectRow);
			}
			else {
				var batchSelect = document.getElementById("batch" + Id);
				batchSelect.style.display = "";
				batchSelect.innerHTML = getEligibleBatches(parseInt(iid), parseInt(jid),
											parseInt(kid),
											subjectRow);/*batch option*/
			}
			break;
		default:
			alert("ERROR: subjectSelected: should not have come here.");
			break;
		}
		/* TODO: should we do fillTable2(false) here, or it can be done
		 * with lesser work?
		 */
		selecttag.parentElement.innerHTML = "" +
		"<div id= \"subject" + Id + "\"class= \"box\">" +
			subjectShortName +
		"</div>" +
		"<span id = \"" + Id + "\" class=\"delete\" " +
				"onclick = fillTable2(false)>" + "x" +
		"</span>" + extraInfo;
}

/* TODO: Abhijit: A subject may be rejected due to multiple reasons.
 * Which reason to display ?
 */
function disabledSubjectAdd(disabledArray, subject, searchId, string) {
	for(i = 0; i < disabledArray.length; i++) {
		if(disabledArray[i][0] === subject) {
			disabledArray[i][(disabledArray[i].length)] = [searchId, string];
			return 1;
		}
	}
	disabledArray.push([subject, [searchId, string]]);
	return 0;
}

function allEntriesAlreadyDoneForSubject(currSubject, searchOn, searchId,
		searchIdName, logOrNot) {
	var maxEntriesForSubject = currSubject["nSlots"];

	/* # entries in tt for this batch-subject or class-subject */
	var existingEntries = searchMultipleRows(timeTable, "subjectId",
			currSubject["subjectId"], searchOn, searchId);

	/* For a subject with eachSlot=2, we enter two entries in timetable */
	if(existingEntries !== -1)
		lenExistingEntries = (existingEntries.length / currSubject["eachSlot"]);
	else
		lenExistingEntries = 0;

	/* Checking whether we have done nSlots entries for the subject */
	if(lenExistingEntries == maxEntriesForSubject) {
		if(logOrNot == 1)
			disabledSubjectAdd(disabledSubjects, currSubject["subjectShortName"], searchIdName, "Done");
		return true;
	}
	if(lenExistingEntries > maxEntriesForSubject) {
		alert("ERROR: More than max possible entries for subject: " + currSubject["subjectShortName"]);
		return true;
	}
	return false;
}

/* TODO: Abhijit thinks this function is meaningles */
function roomBusyOnRoomPageInThisSlot(i, j, currSubject) {
	if(type != "room") 
		return false;
	for(var n = 0; n < currSubject["eachSlot"]; n++) {
		/* If we are on room timeTable page, and room is busy in any of j+eachSlot
		 * then skip this subject Entry.
		 */
		var res = search(timeTable, "day", i, "slotNo", j + n,
				"roomId", supportObject["roomId"], "snapshotId", currentSnapshotId);
		if(res !== -1) {
			disabledSubjectAdd(disabledSubjects, currSubject["subjectShortName"], "", "RoomBusy");
			return true;
		}
	}
	return false;
}

function teacherBusyInThisSlot(i, j, currSubject, teacherId, logOrNot) {
	currTeacher = search(teacher, "teacherId", teacherId);

	for(var n = 0; n < currSubject["eachSlot"]; n++) {
		var nEntriesForTeacher = search(timeTable, "day", i, "slotNo", j + n,
			 "teacherId", teacherId, "snapshotId", currentSnapshotId);
		if(nEntriesForTeacher != -1) {
			if(logOrNot == 1)
				disabledSubjectAdd(disabledSubjects, currSubject["subjectShortName"],
							currTeacher["teacherShortName"], "Busy");
			return true;
		}
	}
	return false;
}
function classBusyInThisSlot(i, j, currSubject, classId, logOrNot) {
	if(currSubject["batches"] == "0") {
		/* Skip subject because already a theory lecture in that slot
		 * TODO: Abhijit: should we check this. Don't we call getEligibleSubjects()
 		 * only if the slot had no entry?
		 */
		if(classId == "undefined") {
			alert("classBusyInThisSlot ERROR: classId undefined subject: " +
					currSubject["subjectShortName"]);
		}
		for(var n = 0; n < currSubject["eachSlot"]; n++) {
			var slotEntries = searchMultipleRows(timeTable, "day", i, "slotNo", (j + n),
				"classId", classId, "snapshotId", currentSnapshotId);
			if(slotEntries !== -1) {
				if(logOrNot == 1)
					disabledSubjectAdd(disabledSubjects, currSubject["subjectShortName"],
						search(classTable, "classId", classId)["classShortName"], "Busy");
				return true;
			}
		}
		return false;
	}
	return false;
}


/* Skip this subject if there is already conflicting entry in this slot
 * Remember: we are inside: for each SCT entry, for eachSlot of subject
 */
function BatchBusyInThisSlot(i, j, currSubject, classId, batchId, logOrNot) {
	/* We are going to look at Batchable subjects now
	 * For batchable subjects:
	 * (a) there should be no theory class in this slot
	 * (b) the batch should be free in this slot
	 * (c) there should be at least one overlapping batch with this batch
	 */
	if(typeof classId == "undefined")
		classId = search(batchClass, "batchId", batchId) ["classId"];
	if(batchId == "undefined") {
		alert("BatchBusyInThisSlot ERROR: batchId undefined subject: " +
				currSubject["subjectShortName"]);
	}
	/* We check three conditions for each of the j + n slots.
	 * Note: we are only checking the entry here for a subject-batch pair, not for a subject
	 */
	var bco = searchMultipleRows(batchCanOverlap, "batchId", batchId);
	for(var n = 0; n < currSubject["eachSlot"]; n++) {
		var thisSlotEntries = searchMultipleRows(timeTable, "day", i, "slotNo", (j + n),
			"classId", classId, "snapshotId", currentSnapshotId);
		if(thisSlotEntries.length < 1 || thisSlotEntries === -1)
			continue;
		for(var q in thisSlotEntries) {
			if("" + thisSlotEntries[q]["batchId"] == "null") {
				/* There is a non-batchable entry , so skip */
				if(logOrNot == 1)
					disabledSubjectAdd(disabledSubjects, currSubject["subjectShortName"],
						search(batch, "batchId", batchId)["batchName"], "Overlap");
				return true;
			}
			/* current batch-subject's batch is busy */
			if(thisSlotEntries[q]["batchId"] == batchId) {
				if(logOrNot == 1)
					disabledSubjectAdd(disabledSubjects, currSubject["subjectShortName"],
						search(batch, "batchId", batchId)["batchName"], "Busy");
				return true;
			}
		}
	}
	/* If some batches overlap with current batch-subject's batch,
	 * check that only those batches exist in the n + j slots */
	for(var n = 0; n < currSubject["eachSlot"]; n++) {
		var thisSlotEntries = searchMultipleRows(timeTable, "day", i, "slotNo", (j + n),
			"classId", classId, "snapshotId", currentSnapshotId);
		var overlappingPossible;
		/*If there are time table entries in that slot.*/
		if(thisSlotEntries != -1) {
			/*If batchCanOverlap table contains rows.*/
			if(bco !== -1) {
				overlappingPossible = true;
				for(var q in thisSlotEntries) {
					/* TODO: Abhijit: Check. This may be impossible condition */
					/*If there are no entries of the overlapping batches in the batchoverlaptable*/
					if(search(bco, "batchOverlapId", thisSlotEntries[q]["batchId"]) === -1) {
							overlappingPossible = false;
							break;
					}
				}
			}
			else
				overlappingPossible = false;
		}
		/* No entries in this slot, so overlapping is obviously possible */
		else
			overlappingPossible = true;

		if(overlappingPossible == false) {
			if(logOrNot == 1)
				disabledSubjectAdd(disabledSubjects, currSubject["subjectShortName"],
					search(batch, "batchId", batchId)["batchName"], "BatchOverlap");
			return true;
		}
	}
	return false;
}

function subjectCantFitInRemainingSlots(currSubject, j, nSlotsPerDay, idText) {
	if(j + parseInt(currSubject["eachSlot"]) - 1  >= nSlotsPerDay) {
		disabledSubjectAdd(disabledSubjects, currSubject["subjectShortName"],
				idText, "Len=" + currSubject["eachSlot"]);
		return true;
	}
	return false;
}

/* Checks the must overlapping subject in its own class timeTable
 * Returns true if there is no problem in overlapping
 * Otherwise false
 */
function batchOverlappingPossible(i, j, osbt, subjectRow) {
	var sbt = search(subjectBatchTeacher, "sbtId", osbt["sbtId2"]);
	var overlappingBatchId = sbt["batchId"];
	var overlappingClassId = search(batchClass, "batchId", sbt["batchId"])["classId"];
	var bco = searchMultipleRows(batchCanOverlap, "batchId", sbt["batchId"]);
	for(var p = 0; p < subjectRow["eachSlot"]; p++) {
		var slotEntries = searchMultipleRows(timeTable, "day", i, "slotNo", (j + p),
					"classId", overlappingClassId, "snapshotId", currentSnapshotId);
		if(slotEntries === -1)
			continue;
		for(var q in slotEntries) {
			/*console.log("batchOverlappingPossible: i = " + i + " j = " + j +
						" slotBId = " + slotEntries[q]["batchId"]); */
			/*Class entry present*/
			if("" + slotEntries[q]["batchId"] == "null") {
				return false;
			}
			/*Batch is already having smthng*/
			if(slotEntries[q]["batchId"] == sbt["batchId"]) {
				return false;
			}
			/* Abhijit. TODO: What does this mean? */
			if(bco !== -1) {
				if(search(bco, "batchOverlapId", slotEntries[q]["batchId"]) === -1) {
					return false;
				}
			}
		}
	}
	return true;
}


function overlappingBatchBusyInThisSlot(i, j, sctOrSbtEntry, batchId, logOrNot) {
	var currSubject= search(subject, "subjectId", sctOrSbtEntry["subjectId"]);
	var osbt = searchMultipleRows(overlappingSBT, "sbtId1", sctOrSbtEntry["sbtId"]);
	/*console.log("overlappingBatchBusyInThisSlot: i = " + i + " j = " + j +
				" searching for " + currSubject["subjectShortName"] +
				"into osbt = " + JSON.stringify(osbt));
	 */
	if(osbt !== -1) {
		for(var q in osbt) {
			if(!batchOverlappingPossible(i, j, osbt[q], currSubject)) {
				if(logOrNot == 1)
					disabledSubjectAdd(disabledSubjects, currSubject["subjectShortName"],
						search(batch, "batchId", batchId)["batchName"], "OLBusy");
				return true;
			}
		}
	}
	return false;
}

/* Check if this room is big enough for the given class/batch */
function roomSmallOnRoomPageForThisClassOrBatch(sctOrSbtEntry, searchId, capacity) {
	if(type != "room")
		return false;
	var currSubject= search(subject, "subjectId", sctOrSbtEntry["subjectId"]);
	if(searchId == "classId")
		searchText = search(classTable, "classId", sctOrSbtEntry["classId"])["classShortName"];
	else
		searchText = search(batch, "batchId", sctOrSbtEntry["batchId"])["batchName"];

	if(parseInt(search(room, "roomShortName", currTableId)["roomCount"]) +
			roomSizeDelta < capacity) {
		disabledSubjectAdd(disabledSubjects, currSubject["subjectShortName"],
				searchText, "TooBig");
		return true;
	}
	return false;
}
function enableSelect(disabledSelect) {
	disabledSelect.disabled = false;
}
function disableSelect(enabledSelect) {
	enabledSelect.disabled = true;
}
/* getEligibleSubjects:
 * Returns list of eligible subjects as select-options for a given slot.
 * Correctness of this function is crucial to working of the software.
 *
 * Algo:
 * Make SBT+SCT List as subsets of subjectCT and subjectBT lists.
 *
 *
 */
function getEligibleSubjects(i, j, k) {
	var configrow = search(config, "configId", currentConfigId);
	var nSlotsPerDay = configrow["nSlots"];
	var select = "<select id= \"subject" + makeIdFromIJK(i, j, k) +
				"\" onchange=\"subjectSelected(this)\">" +
				"<option value=\"NOT_SELECTED\">Subject" +
				"</option>";

	var subjectsList = [];
	var blist;
	var sbtlist = [];
	var sctlist = [];
	var searchOn;
	var Id = makeIdFromIJK(i, j, k);
	/* Make the sbtlist and sctlist depending on which page you are*/
	switch(type) {
		case "room" :
			/* TODO: Change this. Just copy subjectClassTeacher = sctlist and
			 * subjectBatchTeacher = sbtlist */
			sctlist = sctlist.concat(subjectClassTeacher);
			sbtlist = sbtlist.concat(subjectBatchTeacher);
			break;
		case "class":
			sctlist = searchMultipleRows(subjectClassTeacher, "classId", supportObject["classId"]);
			blist = searchMultipleRows(batchClass, "classId", supportObject["classId"]);
			for (var m = 0; m < blist.length; m++) {
				var res = searchMultipleRows(subjectBatchTeacher, "batchId", blist[m]["batchId"]);
				if(res != -1)
					sbtlist = sbtlist.concat(res);
			}
			break;
		case "teacher":
			sctlist = searchMultipleRows(subjectClassTeacher, "teacherId", supportObject["teacherId"]);
			sbtlist = searchMultipleRows(subjectBatchTeacher, "teacherId", supportObject["teacherId"]);
			break;
		case "batch":
			sbtlist = searchMultipleRows(subjectBatchTeacher, "batchId", supportObject["batchId"]);
			break;
		default:
			alert("ERROR: getEligibleSubjects: default: shouldn't come here");
			break;
	}
	/* Handle all SCT Entries */
	disabledSubjects = [];
	for(var m = 0; m < sctlist.length; m++) {
		var currSubject= search(subject, "subjectId", sctlist[m]["subjectId"]);
		/* Skip if all required entries are already done */
		if(allEntriesAlreadyDoneForSubject(currSubject, "classId", sctlist[m]["classId"],
				search(classTable, "classId", sctlist[m]["classId"])["classShortName"], 1)) {
			continue;
		}

		/* Skip the subject if it can't fit remaining slots of day */
		if(subjectCantFitInRemainingSlots(currSubject, j, nSlotsPerDay,
				search(classTable, "classId", sctlist[m]["classId"])["classShortName"])) {
			continue;
		}
		if(teacherBusyInThisSlot(i, j, currSubject, sctlist[m]["teacherId"], 1)) {
			continue;
		}
		if(roomBusyOnRoomPageInThisSlot(i, j, currSubject)) {
			continue;
		}
		if(classBusyInThisSlot(i, j, currSubject, sctlist[m]["classId"], 1)) {
			continue;
		}
		if(roomSmallOnRoomPageForThisClassOrBatch(sctlist[m], "classId",
				search(classTable, "classId", sctlist[m]["classId"])["classCount"])) {
			continue;
		}

		subjectsList.push([currSubject["subjectShortName"],
						search(classTable, "classId", sctlist[m]["classId"])["classShortName"],
						search(teacher, "teacherId", sctlist[m]["teacherId"])["teacherShortName"]
						]);
	}

	/* Handle all SBT Entries */
	for(var m = 0; m < sbtlist.length; m++) {
		var currSubject= search(subject, "subjectId", sbtlist[m]["subjectId"]);
		/* Skip if all required entries are already done */
		if(allEntriesAlreadyDoneForSubject(currSubject, "batchId" ,
				sbtlist[m]["batchId"], 
				search(batch, "batchId", sbtlist[m]["batchId"])["batchName"], 1)) {
			continue;
		}

		/* Skip the subject if it can't fit remaining slots of day */
		if(subjectCantFitInRemainingSlots(currSubject, j, nSlotsPerDay,
				search(batch, "batchId", sbtlist[m]["batchId"])["batchName"])) {
			continue;
		}
		if(teacherBusyInThisSlot(i, j, currSubject, sbtlist[m]["teacherId"], 1)) {
			continue;
		}
		if(roomBusyOnRoomPageInThisSlot(i, j, currSubject)) {
			continue;
		}
		if(BatchBusyInThisSlot(i, j, currSubject, sbtlist[m]["classId"],
			sbtlist[m]["batchId"], 1)) {
			continue;
		}
		/* The only separate check for batches */
		if(overlappingBatchBusyInThisSlot(i, j, sbtlist[m], sbtlist[m]["batchId"], 1)) {
			continue
		}
		if(roomSmallOnRoomPageForThisClassOrBatch(sbtlist[m], "batchId",
			search(batch, "batchId", sbtlist[m]["batchId"])["batchCount"])) {
			continue;
		}
		subjectsList.push([currSubject["subjectShortName"],
						search(batch, "batchId", sbtlist[m]["batchId"])["batchName"],
						search(teacher, "teacherId", sbtlist[m]["teacherId"])["teacherShortName"]
						]);
	}
	if(subjectsList.length == 0) {
		var select = "<select disabled=true id=\"subject" + makeIdFromIJK(i, j, k) + "\" " +
				" onmouseenter=enableSelect(this)"+
				" onmouseout=disableSelect(this)"+
				">" +
				"<option value=\"NOT_SELECTED\">Subject" +
				"</option>";
		for(x = 0; x < disabledSubjects.length; x++) {
			select += "<option class=\"disabledEntries1\" disabled=\"disabled\"" +
			  "value = \"\">" + disabledSubjects[x][0] + "</option>";
			for(y = 1; y < disabledSubjects[x].length; y++) {
				  select += "<option class=\"disabledEntries2\" disabled=\"disabled\"" +
				  "value = \"\">&nbsp&nbsp" + disabledSubjects[x][y][0] + "</option>";
				  select += "<option class=\"disabledEntries3\" disabled=\"disabled\"" +
				  "value = \"\">&nbsp:" + disabledSubjects[x][y][1] + "</option>";
			}
		}
		return select;
	}
	for(var r in subjectsList) {
		var subj = subjectsList[r][0];
		select += "<option value =\"" + subj + "\" " +
					"title=\"" + subjectsList[r][1] + "," + subjectsList[r][2] + "\"" +
					">" + subj + "</option>";
	}
	if((type == "batch" || type == "class") &&  cellEmpty(i, j)) {
		select += "<option title=\"Insert a fixed slot/ LUNCH slot\" " +
				  "value = \"FixedEntry\">Fixed Slot</option>";
	}
	for(x = 0; x < disabledSubjects.length; x++) {
		select += "<option class=\"disabledEntries1\" disabled=\"disabled\"" +
		  "value = \"\">" + disabledSubjects[x][0] + "</option>";
		for(y = 1; y < disabledSubjects[x].length; y++) {
			select += "<option class=\"disabledEntries2\" disabled=\"disabled\"" +
				"value = \"\">&nbsp&nbsp" + disabledSubjects[x][y][0] + "</option>";
			select += "<option class=\"disabledEntries3\" disabled=\"disabled\"" +
				"value = \"\">&nbsp:" + disabledSubjects[x][y][1] + "</option>";
		}
	}
	select += "</select>";
	return select;
}

/* cell is empty if all helperTable entries for i.j are 0 or null
 */
function cellEmpty(i, j) {
	for(var k = 0 ; k < helperTable[i - 1][j].length; k++) {
		if(helperTable[i - 1][j][k] !== 0 && helperTable[i - 1][j][k] != null) {
			return false;
		}
	}
	return true;
}

/*For deleting an entry from timeTable*/
function deleteEntry(Span) {
	var Id = Span.id; /* Id of "x" */
	[day, SlotNo, slottableNo ] = makeIJKFromId(Id);
	Id = makeIdFromIJK(day, SlotNo, slottableNo);

	var row = helperTable[day - 1][SlotNo][slottableNo];

	var batchId, classId, teacherId, roomId, isFixed;
	roomId = row["roomId"];
	teacherId = row["teacherId"];
	classId = row["classId"];
	batchId = row["batchId"];
	isFixed = row["isFixed"];
	subjectId = row["subjectId"];

	/* Delete Fixed Entry */
	if(isFixed == "1") {
		var index = timeTable.indexOf(row);
		if(index != -1) {
			console.log("Deleting TT Entry: " + debugPrint("timeTable", timeTable[index]));
			timeTable.splice(index, 1);/*Delete entry from table*/
		}
		else
			console.log("Error Deleting TT Entry: Couldn't find index");

		index = searchIndex(fixedEntry, "ttId", row["ttId"]);
		if(index != -1) {
			console.log("Deleting Fixed Entry: " + debugPrint("fixedEntry", fixedEntry[index]));
			fixedEntry.splice(index, 1);/*Delete entry from table*/
		}
		else
			console.log("Error Deleting TT Entry: Couldn't find index");

		fillTable2(true);
		dirtyTimeTable = true;
		return;
	}
	/* Delete Non-Fixed Entry, both batched and non-batched */
	var subjRow = search(subject, "subjectId", row["subjectId"]);

	for(var i = 0; i < subjRow["eachSlot"]; i++) {
		var index = searchIndex(timeTable, "day", day, "slotNo", "" + (parseInt(SlotNo) + i),
					"subjectId", subjRow["subjectId"], "batchId", batchId,
					"classId", classId, "snapshotId", currentSnapshotId);
		if(index != -1) {
			console.log("Deleting TT Entry: " + debugPrint("timeTable", timeTable[index]));
			timeTable.splice(index, 1);/*Delete entry from table*/
		} else {
			console.log("ERROR: Deleting TT Entry: Couldn't find index");
		}
	}
	/*For overlapping sbt, delete OSBT entries*/
	if(batchId != "" + null) {
		var sbt = search(subjectBatchTeacher, "subjectId", subjectId,
							 "batchId", batchId, "teacherId", teacherId);
		var osbt;
		if(sbt !== -1) {
			var osbt = searchMultipleRows(overlappingSBT, "sbtId1", sbt["sbtId"]);
			if(osbt === -1) {
				console.log("No OSBT Entry found for subject: " + subjectId +
							" batch: " + batchId + "teacher: " + teacherId);
				fillTable2(true);
				dirtyTimeTable = true;
				return;
			}
			for(var i in osbt) {
				var batchId = search(subjectBatchTeacher, "sbtId", osbt[i]["sbtId2"])["batchId"];
				var classId = search(batchClass, "batchId", batchId)["classId"];
				for(var j = 0; j < subjRow["eachSlot"]; j++) {
					var index = searchIndex(timeTable, "day", day, "slotNo", (parseInt(SlotNo) + j),
						"subjectId", subjRow["subjectId"], "batchId", batchId,
						"classId", classId, "snapshotId", currentSnapshotId);
					if(index != -1) {
						console.log("Deleting TT Entry: " + debugPrint("timeTable", timeTable[index]));
						timeTable.splice(index, 1);
					}
				}
			}
		}
	}
	dirtyTimeTable = true;
	fillTable2(true);
}

/* getPosition():
 * is called with day starting at 1, not 0  so we do, day = day1 - 1.
 *
 * Returns the next k'th row available for entering a new entry
 * Returns null if (a) we don't have sufficient columns ahead
 *   (b) The current entry already exists (for multi-column entries)
 *   (c) We can't find any k in current cell
 *   TODO: Check c is possible
 *
 * rowEntry is null when we are looking for entering 'select-box'
 * else it is some entry we have found in timeTable at day1-slotNo
 *
 * Function also sets the k'th+eachSlot positions in helperTable for the rowEntry
 */
function getPosition(day1, slotNo, rowEntry, eachSlot) {
	var subjectId = -1, classId= -1, batchId = -1, pos = -1;
	var day = day1 - 1;
	if(rowEntry != null) {
		subjectId = rowEntry["subjectId"];
		classId = rowEntry["classId"];
		batchId = rowEntry["batchId"];
	}
	var $nSlots = search(config, "configId", currentConfigId)["nSlots"];
	$nSlots = parseInt($nSlots) - 1;//Array starts from 0
	/* helperTable[][].length = no. of batches for a class, or 1 */
	for(var k = 0; k < helperTable[day][slotNo].length; k++) {
		var valid = true;
		for(var n = 0; n < eachSlot; n++) {
			if((slotNo + n) > $nSlots)
				return null;
			var temp = helperTable[day][slotNo + n][k];
			if(temp == null) /* Means "Subject select box is there */
				continue;
			if(temp !== 0) {/*means Row Entry is there*/
				if(temp["subjectId"] === subjectId && temp["batchId"] === batchId
					&& temp["classId"] === classId) {
					/* This rowEntry was already displayed, because it was a multi-column entry
					 * and the first call for first column already filled in all the other columns
					 */
					//valid = false;
					return null;
				}
				valid = false;
				break;
			}
		}
		if(valid && pos == -1) {
			pos = k;
		}
	}
	if(pos == -1) {
		return null;
	}
	for(var n = 0; n < eachSlot; n++) {
		/* This is the only place where we make entries in helperTable.
		 * For a 3rd entry of 3 slots, on Monday starting at slot-3, we make
		 * 3 entries in [0, 3, 3], [0, 4, 3], [0, 5, 3]
		 * Note: rowEntry is null when we are trying to insert a subject-select
		 * in that case, eachSlot is 1.
		 */
		helperTable[day][slotNo + n][pos] = rowEntry;
	}
	/* enabledRows is used only here, to set the display attribute and
	 * to set the border
	 */
	if(pos > 0) {
		if(pos > enabledRows[day]) { /*Enabling rows and hiding the borders row-wise*/
			for(var p = enabledRows[day] + 1; p <= pos; p++) {
				var row = document.getElementById("row" + day1 + p);
				row.style.display = "";
				for(var x = 0; x < row.children.length; x++) {
					document.getElementById(row.children[x].id).style.borderTop = "0px none white";
				}
				row = document.getElementById("row" + day1 + (p - 1));
				for(x = 0; x < row.children.length; x++) {
					document.getElementById(row.children[x].id).style.borderBottom = "0px none white";
				}
			}
			enabledRows[day] = pos;
		}
		document.getElementById("cell"+ makeIdFromIJK(day1, slotNo, pos)).style.borderTop = "0px solid black";
	}
	return pos;
}

/* fillTable2()
 * Should be called whenever the timeTable() changes.
 * Pseudo Code.
 * If(createNewTable)
 *    createNewTable
 * initializeEnableRowArray();
 * for 6 days : i
 *   for each of the nSlots : j
 *     slotRows = getAllTTRowsOn-day-i-slot-j
 *     if slotRows,
 *      for each of the slotRows: k
 *        call getPosition()/enter in helperTable();
 *        display that entry
 *		  for class-page, show select box
 *     else
 *		  display "Select" box
 */
function fillTable2(createNewTable) {
	makeTrackerList();
	var configrow = search(config, "configId", currentConfigId);
	NoOfSlots = configrow["nSlots"];
	var days = 6;
	var slottablePerDay = 1;
	if(type == undefined || currTableId == undefined)
		return;
	if(type == "class") {
		var row = searchMultipleRows(batchClass, "classId", supportObject["classId"]);
		/*Depending on the no of batches in a class. TODO: check + 1*/
		if(row !== -1)
			slottablePerDay = row.length;
	}

	if(createNewTable) {
		/*Clear previous timetable or message*/
		var tdTimetable = document.getElementById("mainTimeTable");
		if(tdTimetable.childNodes[1] != null)
			tdTimetable.removeChild(tdTimetable.childNodes[1]);

		/*Data needed for empty table*/

		var dayBegin = configrow["dayBegin"];
		var timePerSlot = configrow["slotDuration"];

		var table = createTable(days, NoOfSlots, slottablePerDay, dayBegin, timePerSlot);
		 /*Attaching the created empty table*/
		var div = document.createElement("div");
		div.setAttribute("id" , "timeTable");
		//div.style.display = "none";
		div.appendChild(table);
		tdTimetable.appendChild(div);
		//$("#timeTable").slideDown("fast");
		$(".animateButton").click(function(){
			var text = this.innerHTML;
			var id = this.parentElement.id;
			if(text == "+") {
				this.innerHTML= "-";
				$(".animate" + id).fadeIn();
				var all_buttons = document.getElementsByClassName("animateButton");
				var j;
				for(j = 0; j < 6; j++) {
					if(all_buttons[j].innerHTML != "-") {
						break;
					}
				}
				if(j == 6) {
					var top_button = document.getElementsByClassName("animateButtonTop");
					top_button[0].innerHTML = "-";
				}
			}
			else {
				this.innerHTML = "+";
				$(".animate" + id).fadeOut();
				var all_buttons = document.getElementsByClassName("animateButton");
				var j;
				for(j = 0; j < 6; j++) {
					if(all_buttons[j].innerHTML != "+") {
						break;
					}
				}
				if(j == 6) {
					var top_button = document.getElementsByClassName("animateButtonTop");
					top_button[0].innerHTML = "+";
				}
			}
		});
		$(".animateButtonTop").click(function() {
			var text = this.innerHTML;
			if(text == "+") {
				this.innerHTML = "-";
				for(var i = 1; i <=6; i++) {
					$(".animate" + i).fadeIn();
				}
				var all_buttons = document.getElementsByClassName("animateButton");
				for(var j = 0; j < 6; j++) {
					all_buttons[j].innerHTML = "-";
				}
			}
			else {
				this.innerHTML = "+";
				for(var i = 1; i <=6; i++) {
					$(".animate" + i).fadeOut();
				}
				var all_buttons = document.getElementsByClassName("animateButton");
				for(var j = 0; j < 6; j++) {
					all_buttons[j].innerHTML = "+";
				}
			}
		});
	}

	initializeEnableRowArray(6, parseInt(NoOfSlots), slottablePerDay, 0);

	var classId;
	if(type == "batch") {
		classId = search(batchClass, "batchId", supportObject["batchId"])["classId"];
		if(""+ classId == "null")
			return;
	}
	for(var i = 1; i <= days; i++) { /*daywise*/
		for(var j = 0; j < NoOfSlots; j++) { /*slotwise*/
			var slotRows;
			if(type == "batch") {
				xbatchId = search(batch, "batchName", currTableId)["batchId"];
				slotRows = searchMultipleRows(timeTable, "day", i, "slotNo", j,
					"classId", classId, "batchId", xbatchId,
					"snapshotId", currentSnapshotId);
				slotRows2 = searchMultipleRows(timeTable, "day", i, "slotNo", j,
					"classId", classId, "batchId", null,
					"snapshotId", currentSnapshotId);
				if(slotRows != -1)
					for(k in slotRows2)
						slotRows.push(slotRows2[k]);
				else
					slotRows = slotRows2;
			}
			else {
				slotRows = searchMultipleRows(timeTable, "day", i, "slotNo", j,
					type + "Id", supportObject[type + "Id"],
					"snapshotId", currentSnapshotId);
			}
			if(slotRows != -1) {
				sort(slotRows);
				var subjectHasBatches = "1";
				/*within each slot*/
				for(var k = 0; k < slotRows.length; k++) {
					var teacherShortName = "", classShortName = "",
						batchName = "", roomShortName = "";
					/*For Fixed Slot Entries*/
					if(slotRows[k]["isFixed"] == "1") {
						var position = getPosition(i, j, slotRows[k], 1);
						if(position == null) {
							alert("ERROR: i: " + i + "slot " + j + "k = " + k + " fixed slot. got position null");
							continue;
						}
						subjectHasBatches = "0";
						var slottable = document.getElementById("slottable" + makeIdFromIJK(i, j, position));
						if(slottable == null) {
							alert("ERROR. i: " + i + "slot " + j + "k = " + k + " got slottabble  null. ERROR");
							continue;
						}
						var label = search(fixedEntry, "ttId", slotRows[k]["ttId"])["fixedText"];
						if(typeof label == "undefined"){
							alert("ERROR. i: " + i + "slot " + j + "k = " + k + " got fixedText null. ERROR");
							label = "LUNCH";
						}
						//if(slotRows[k]["batchId"] != 1)
						var batchName = "";
						if("" + slotRows[k]["batchId"] !== "null") { // changed from 1 to null by Abhijit. check. TODO.
							batchName = search(batch, "batchId",slotRows[k]["batchId"])["batchName"];
							subjectHasBatches = "1";
							if(typeof batchName == "undefined") {
								alert("ERROR. i: " + i + "slot " + j + "k = " + k + " got batchName undefined. ERROR");
								batchName = "";
							}
						}
						slottable.innerHTML =
							"<tr class=\"mainTableRow\">" +
								"<td class=\"slottd\">" +
									"<div class= \"box\" id = \"box" + makeIdFromIJK(i, j, position) + "\">"+
										"<span class = \"fixedEntry\"" +
										"id = \"fixed" + makeIdFromIJK(i, j, position) + "\">" +
											label +
										"</span>" +
										"<span class = \"batchentry\"" +
										"id = \"batch" + makeIdFromIJK(i, j, position) + "\">" +
											batchName +
										"</span>" +
										"<span id = \"" + makeIdFromIJK(i, j, k) + "\" "+
										"class=\"delete\" onclick = deleteEntry(this)>"+
											"x" +
										"</span>" +
									"</div>" +
								"</td>" +
							"</tr>";
						continue;
					}
					/* For each NON-Fixed Slot Entry */
					if(type != "teacher")
						teacherShortName = search(teacher, "teacherId",
							slotRows[k]["teacherId"])["teacherShortName"];

					var subjectRow = search(subject, "subjectId", slotRows[k]["subjectId"]);
					if(type != "room")
						roomShortName = search(room, "roomId", slotRows[k]["roomId"])["roomShortName"];
					if(type != "class")
						classShortName = search(classTable, "classId", slotRows[k]["classId"])["classShortName"];

					var eachSlot = subjectRow["eachSlot"];

					subjectHasBatches = subjectRow["batches"];
					batchName = "";
					batchIdNull = ("" + slotRows[k]["batchId"] == "null");
					if(!batchIdNull) { // && (type != "batch"))
						var batchRow = search(batch, "batchId", slotRows[k]["batchId"]);
						batchName = "" + batchRow["batchName"];
					}
					/* On room/teacher page, show className. use batchName field for that */
					if((type == "room" || type == "teacher") && batchIdNull) {
						var classRow = search(classTable, "classId", slotRows[k]["classId"]);
						batchName = "" + classRow["classShortName"];
					}
					var position = getPosition(i, j, slotRows[k], subjectRow["eachSlot"]);
					if(position == null)
						continue;
					var slottable = document.getElementById("slottable" + makeIdFromIJK(i,  j, position));
					if(slottable == null) {
						alert("ERROR. i: " + i + "slot " + j + "k = " + k + " position = " + position + " got slottabble  null. ERROR");
						continue;
					}
 					// Note: inside i=days * j=NoOfSlots loop
					if(batchName == "undefined")
						alert("ERROR: undefined batchName");
					/* Display the Non-fixed Slot Entry in colspan = eachSlot */
					slottable.innerHTML =
						"<tr class=\"mainTableRow\">" +
							"<td colspan=\"" + eachSlot + "\" class=\"slottd\">"+
								"<div class= \"box\" id = \"box" + makeIdFromIJK(i, j, position) + "\">"+
									"<span class = \"subjectentry\""+
									"id = \"subject" + makeIdFromIJK(i, j, position) + "\">" +
										subjectRow["subjectShortName"] + " " +
									"</span>" +
									"<span class = \"batchentry\" " +
									"id = \"batch" + makeIdFromIJK(i, j, position) + "\">" +
										batchName +
									"</span>" +
									"<span id = \"" + makeIdFromIJK(i, j, k) + "\" " +
									"class=\"delete\" onclick = deleteEntry(this)>" +
										"x" +
									"</span>" +
								"</div>" +
								"<div class = \"animate" + i + "\">" +
									"<div class = \"box\">" +
										"<span id = \"room" + makeIdFromIJK(i, j, position) + "\" " +
										"class = \"roomentry\" >"
												 + roomShortName +
										"</span>" +
										"<span class =\"teacherentry\" " +
										"id = \"teacher" + makeIdFromIJK(i, j, position) + "\">" +
												teacherShortName +
										"</span>" +
										"<span class =\"classentry\" " +
										"id = \"class" + makeIdFromIJK(i, j, position) + "\">" +
												classShortName +
										"</span>" +
									"</div>" +
								"</div>" +
							"</td>" +
						"</tr>";
					slottable.setAttribute("draggable", "true");
					slottable.setAttribute("ondragstart", "dragStartHandler(event)");
					if(eachSlot > 1) {/**/
						for(var p = 1; p < eachSlot; p++) {
							document.getElementById("cell" + makeIdFromIJK(i, j + p, position)).style.display = "none";
						}
						document.getElementById("cell" + makeIdFromIJK(i, j, position)).setAttribute("colspan", eachSlot);
					}
				}
				/* For each Cell, having some existing entries
				 * Display subject select box on class page,
				 * only if subject has batches
				 */
				if(subjectHasBatches !== "0" && type == "class") {
					var position = getPosition(i, j, null, 1);
					if(position == null) {
						console.log("WARNING: subjectHasBatches true, on class Page, got positionn null at " + i + " " + j);
						document.getElementById("" + i).setAttribute("rowspan", slotRows.length);
						continue;
					}
					slottable = document.getElementById("slottable" + makeIdFromIJK(i, j, position));
					slottable.innerHTML =
					"<tr class=\"mainTableRow\">" +
						"<td class=\"slottd\">" + getEligibleSubjects(i, j, position) + "</td>" +
					"</tr>" +
					"<tr class=\"mainTableRow\">" +
						"<td class=\"slottd\">" +
							"<select id=\"batch" + makeIdFromIJK(i, j, position) + "\" style=\"display:none;\" " +
							"onchange=\"batchSelected(this)\"/>" +
						"</td>" +
					"</tr>" +
					"<tr class=\"mainTableRow\">" +
						"<td class=\"slottd\">" +
							"<select id=\"teacher" + makeIdFromIJK(i, j, position) + "\" style=\"display:none;\"/>" +
						"</td>" +
					"</tr>" +
					"<tr class=\"mainTableRow\">" +
						"<td class=\"slottd\">" +
							"<select id=\"class" + makeIdFromIJK(i, j, position) + "\" style=\"display:none;\"" +
							"onchange=\"classSelected(this)\"/>" +
						"</td>" +
					"</tr>" +
					"<tr class=\"mainTableRow\">" +
						"<td class=\"slottd\">" +
							"<select id=\"room" + makeIdFromIJK(i, j, position) + "\" " + "style=\"display:none;\" />" +
							"Done" +
							"<input id= \"checkbox" + makeIdFromIJK(i, j, position) + "\" class=\"toggle\"" + " type=checkbox" +
							" value = \"" + makeIdFromIJK(i, j, position) + "\"style=\" display:none;\"" +
							" onclick=roomSelected(this)>" +
						"</td>" +
					"</tr>";
				}
				/* Cells with existing Entries. Set Rowspan. refers to dayname td*/
				var rowspan = document.getElementById("" + i).getAttribute("rowspan");
				if(rowspan == null) {
					rowspan = "" + 1;
				}
				if(parseInt(rowspan) <= slotRows.length && type == "class") {
					document.getElementById("" + i).setAttribute("rowspan",
						(slotRows.length + parseInt(subjectHasBatches)));
				}
			} /* End - if cell has an existing entry */
			/* Else: Cell not having any existing entry, show select box */
			else {
				var k = getPosition(i, j, null, 1);
				slottable = document.getElementById("slottable" + makeIdFromIJK(i, j, k));
				if(slottable == null) {
					alert("ERROR: slottable null, i = " + i + " j = " + j + " k = " + k);
					continue;
				}
				// Note: inside i=days * j=NoOfSlots loop, subjectHasBatches !=0
				slottable.innerHTML =
					"<tr class=\"mainTableRow\">" +
						"<td class=\"slottd\">" +
							getEligibleSubjects(i, j, k) +
						"</td>" +
					"</tr>" +
					"<tr class=\"mainTableRow\">" +
						"<td class=\"slottd\">" +
							"<select id=\"batch" + makeIdFromIJK(i, j, k) + "\"" +
								"onchange=\"batchSelected(this)\"" +
								"style=\"display:none;\"/>" +
						"</td>" +
					"</tr>" +
					"<tr class=\"mainTableRow\">" +
						"<td class=\"slottd\">" +
							"<select id=\"teacher" + makeIdFromIJK(i, j, k) + "\"" +
								"style=\"display:none;\"/>" +
						"</td>" +
					"</tr>" +
					"<tr class=\"mainTableRow\">" +
						"<td class=\"slottd\">" +
							"<select id=\"class" + makeIdFromIJK(i, j, k) + "\"" +
								"onchange=\"classSelected(this)\" " +
								"style=\"display:none;\"/>" +
						"</td>" +
					"</tr>" +
					"<tr class=\"mainTableRow\">" +
						"<td class=\"slottd\">" +
							"<select id=\"room" + makeIdFromIJK(i, j, k) + "\"" +
								"style=\"display:none;\" />" +
							"Done<input id= \"checkbox" + makeIdFromIJK(i, j, k) +
								"\" class= \"toggle\"" +
							"type=checkbox" +
							" value = \"" + makeIdFromIJK(i, j, k) +
								"\" style=\"display:none;\" onchange=roomSelected(this) >" +
						"</td>" +
					"</tr>";
			} /* end if-else cells having entry, vacant cells */
		} /* end for each slot */
	} /* end for each day */
	for(var i = 1; i <= 6; i++) {
		/* Initially hiding extra rows */
		$(".animate" + i).hide();
	}
	showTrackerList();
	width1 = 0.7 * window.width / NoOfSlots;
	width2 = window.width = width1;
	$(".cell").width(width1);
	$(".outercol2").width(width2);
}

function classChange(createNewTable){
	var index = document.getElementById("class-menu").selectedIndex; /*Setting the select tag*/
	if(index === 0) {
		document.getElementById("class-menu").selectedIndex = "-1";
		classForm();
		selectoption();
		return;
	}
	var classShortName = document.getElementById("class-menu").options[index].text;
	type = "class";
	currTableId = classShortName;
	document.getElementById("teacher-menu").selectedIndex = "-1";
	document.getElementById("room-menu").selectedIndex = "-1";
	document.getElementById("batch-menu").selectedIndex = "-1";
	getSupportObject();//fills supportObject correctly depending on type and id;
	/*Filling the table*/
	document.getElementById("title").innerHTML =
				"<h2> " + search(dept, "deptId", currentDeptId)["deptName"] +
				"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
				"Timetable for " +
				"<span class=\"currTitle\"> Class: " + classShortName + " </span> </h2>";
	fillTable2(createNewTable);

}
function snapshotChange() {
	var index = document.getElementById("fetch-snapshot-menu").selectedIndex;
	var snapshotName = document.getElementById("fetch-snapshot-menu").options[index].text;
	if(dirtyTimeTable) {
			save = confirm("Timetable Modified. Your changes will be lost if not saved. Save current timeTable?");
			if(save == true) {
				alert("Saving snapshot");
				jsSaveSnapshot(false);
			}
	}
	currentSnapshotName = snapshotName;
	currentSnapshotId = search(snapshot, "snapshotName", currentSnapshotName)["snapshotId"];
	loadNewSnapshot();
	document.getElementById("fetch-snapshot-menu").selectedIndex = index;
	dirtyTimeTable = false;
	fillTable2(false);
}

function roomChange(createNewTable){
	document.getElementById("teacher-menu").selectedIndex = "-1";
	document.getElementById("class-menu").selectedIndex = "-1";
	document.getElementById("batch-menu").selectedIndex = "-1";
	var index = document.getElementById("room-menu").selectedIndex; /*Setting the select tag*/
	if(index === 0) {
		document.getElementById("room-menu").selectedIndex = "-1";
		roomForm();
		selectoption();
		return;
	}
	var roomShortName = document.getElementById("room-menu").options[index].text;
	document.getElementById("title").innerHTML =
				"<h2> " + search(dept, "deptId", currentDeptId)["deptName"] +
				"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
				"Timetable for " +
				"<span class=\"currTitle\"> Room: " + roomShortName + " </span> </h2>";
	type = "room";
	currTableId = roomShortName;
	getSupportObject();//fills supportObject correctly depending on type and id;
	/*Filling the table*/
	fillTable2(createNewTable);
}

function batchChange(createNewTable){
	document.getElementById("teacher-menu").selectedIndex = "-1";
	document.getElementById("room-menu").selectedIndex = "-1";
	document.getElementById("class-menu").selectedIndex = "-1";
	var index = document.getElementById("batch-menu").selectedIndex; /*Setting the select tag*/
	if(index === 0) {
		document.getElementById("batch-menu").selectedIndex = "-1";
		batchForm();
		selectoption();
		return;
	}
	var batchName = document.getElementById("batch-menu").options[index].text;
	document.getElementById("title").innerHTML =
				"<h2> " + search(dept, "deptId", currentDeptId)["deptName"] +
				"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
				"Timetable for " +
				"<span class=\"currTitle\"> Batch: " + batchName + " </span> </h2>";
	type = "batch";
	currTableId = batchName;
	getSupportObject();//fills supportObject correctly depending on type and id;
	/*Filling the table*/
	fillTable2(createNewTable);
}

function teacherChange(createNewTable){
	var index = document.getElementById("teacher-menu").selectedIndex; /*Setting the select tag*/
	if(index === 0) {
		document.getElementById("teacher-menu").selectedIndex = "-1";
		teacherForm();
		selectoption();
		return;
	}
	var teacherShortName = document.getElementById("teacher-menu").options[index].text;
	document.getElementById("title").innerHTML =
				"<h2> " + search(dept, "deptId", currentDeptId)["deptName"] +
				"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
				"Timetable for " +
				"<span class=\"currTitle\"> Teacher: " + teacherShortName + " </span> </h2>";
	type = "teacher";
	currTableId = teacherShortName;
	document.getElementById("room-menu").selectedIndex = "-1";
	document.getElementById("class-menu").selectedIndex = "-1";
	document.getElementById("batch-menu").selectedIndex = "-1";
	getSupportObject();//fills supportObject correctly depending on type and id;
	/*Filling the table*/
	fillTable2(createNewTable);
}
/*if a snapshot was displayed before selecting add option then
this function will reselect the option which was selected before selcting add option*/
function selectoption() {
	if(type == undefined)
		return;
	switch(type) {
		case "class":
			var selectTag = document.getElementById("class-menu");
			var value = supportObject["classShortName"];
			var table = "classTable";
			break;
		case "batch":
			var selectTag = document.getElementById("batch-menu");
			var value = supportObject["batchName"];
			var table = "batch";
			break;
		case "room":
			var selectTag = document.getElementById("room-menu");
			var value = supportObject["roomShortName"];
			var table = "room";
			break;
		case "teacher":
			var selectTag = document.getElementById("teacher-menu");
			var value = supportObject["teacherShortName"];
			var table = "teacher";
			break;
	}
	for(i = 0;i < selectTag.options.length;i++) {
		if(selectTag.options[i].value === value) {
			selectTag.selectedIndex = "" + i;
			return;
		}
	}
	selectTag.selectedIndex = "-1";
}
function sortSelect(selElem) {
    var tmpAry = new Array();
    for (var i = 0; i < selElem.options.length; i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = selElem.options[i].text;
        tmpAry[i][1] = selElem.options[i].value;
    }
    tmpAry.sort();
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    for (var i = 0; i < tmpAry.length; i++) {
        var op = new Option(tmpAry[i][0], tmpAry[i][1]);
        selElem.options[i] = op;
    }
    return;
}
function loadTeacherMenu() {
	var selectTag = document.getElementById("teacher-menu");
	while(selectTag.hasChildNodes()) {
		selectTag.removeChild(selectTag.childNodes[0]);
	}
	for (i in teacher) {
		selectTag.appendChild(createOptionTag(teacher[i]["teacherShortName"],
								teacher[i]["teacherShortName"], "false"));
	}
	selectTag.setAttribute("onchange", "teacherChange(true)");
	sortSelect(selectTag);
	selectTag.add(createOptionTag("Add Teacher", "Add Teacher", "false"), 0);
	document.getElementById("teacher-menu").selectedIndex = -1; /*Setting the select tag*/
}
function loadClassMenu() {
	var selectTag = document.getElementById("class-menu");
	while(selectTag.hasChildNodes()) {
		selectTag.removeChild(selectTag.childNodes[0]);
	}
	for (i in classTable) {
		selectTag.appendChild(createOptionTag(classTable[i]["classShortName"],
								classTable[i]["classShortName"], "false"));
	}
	selectTag.setAttribute("onchange", "classChange(true)");
	selectTag.add(createOptionTag("Add Class", "Add Class", "false"), 0);
	document.getElementById("class-menu").selectedIndex = -1; /*Setting the select tag*/
}
function loadBatchMenu() {
	var selectTag = document.getElementById("batch-menu");
	while(selectTag.hasChildNodes()) {
		selectTag.removeChild(selectTag.childNodes[0]);
	}
	for (i in batch) {
		selectTag.appendChild(createOptionTag(batch[i]["batchName"],
								batch[i]["batchName"], "false"));
	}
	selectTag.setAttribute("onchange", "batchChange(true)");
	sortSelect(selectTag);
	selectTag.add(createOptionTag("Add Batch", "Add Batch", "false"), 0);
	document.getElementById("batch-menu").selectedIndex = -1; /*Setting the select tag*/
}
function loadRoomMenu() {
	var selectTag = document.getElementById("room-menu");
	while(selectTag.hasChildNodes()) {
		selectTag.removeChild(selectTag.childNodes[0]);
	}
	for (i in room) {
		selectTag.appendChild(createOptionTag(room[i]["roomShortName"],
								room[i]["roomShortName"], "false"));
	}
	selectTag.setAttribute("onchange", "roomChange(true)");
	sortSelect(selectTag);
	selectTag.add(createOptionTag("Add Room", "Add Room", "false"), 0);
	document.getElementById("room-menu").selectedIndex = -1; /*Setting the select tag*/
}
function loadSelectMenus() {
	loadRoomMenu();
	$("#room-menu").css("display", "block");
	if(room.length  === 0) {
		$("#mainTimeTable").html("<div align=center> Please select the Configuration Menu and " +
					"enter at least one room, teacher, class, batch, " +
					"entry to see the select menus</div>");
	}
	$("#teacher-menu").css("display", "block");
	loadTeacherMenu();
	$("#class-menu").css("display", "block");
	loadClassMenu();
	$("#batch-menu").css("display", "block");
	loadBatchMenu();
	selectoption();
}
/* Loads a new snapshot in JS variables.
 * Snapshot includes all Data Tables. Teacher, Class, Subject, ..., Timetable. and mappinngs.
 * Also reinitializes all select-menus
 */
function loadNewSnapshot() {
	if(getDataTables() === false) {
		alert("Loading of Tables Failed. Check your Error Logs");
		return false;
	}
	if(getTimetable(currentSnapshotName) === false) {
		alert("Loading of default snapshot Failed. Check your Error Logs");
		return false;
	};
	loadSelectMenus(); /* load Teacher, Class, Batch, Room Menu */
	loadSnapshotMenu(search(snapshot, "snapshotId", currentSnapshotId)["snapshotName"]);
	getSupportObject();
	console.log("loadNewSnapshot: loaded snapshot " + currentSnapshotId);
	/* If some table was already displayed, then type and id globals will be set
	 * and this call will redisplay that table. Else, it will just return
	 */
	fillTable2(true);
	/* Settings for saving the snapshot */
	return true;
}
/* Reload the select menu for snapshots. This is typically done
 * after a new snaphot is created, to accomodate for the new entry.
 * Make sure that table snapshot is fetch properly before calling this
 */
function loadSnapshotMenu(selectedName) {
	var selectTag = document.getElementById("fetch-snapshot-menu");
	while(selectTag.hasChildNodes()) {
		selectTag.removeChild(selectTag.childNodes[0]);
	}
	for (i in snapshot) {
		if(snapshot[i]["snapshotName"] === selectedName) {
			option = createOptionTag(snapshot[i]["snapshotId"],
						snapshot[i]["snapshotName"], "true");
			index = i;
		}
		else
			option = createOptionTag(snapshot[i]["snapshotId"],
						snapshot[i]["snapshotName"], "false");
		selectTag.appendChild(option);
	}
	selectTag.setAttribute("onchange", "snapshotChange()");
	document.getElementById("saveNewSnapshot").disabled = false;
	document.getElementById("saveSnapshot").disabled = false;
	document.getElementById("fetch-snapshot-menu").selectedIndex = index;
}
function jsSaveNewSnapshot() {
	var newSnapshotName = prompt("Enter snapshot Name","snapshot");
	if(newSnapshotName != null) {
		var xhttp;
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				response = JSON.parse(this.responseText);
				if(response["Success"] == "True") {
					alert("snapshot " + newSnapshotName + " Saved. Press OK to continue");
					document.getElementById("saveNewSnapshot").value = "Save As"
					document.getElementById("saveNewSnapshot").disabled = false;
					// JS variables are passed by vale, so snapshot can be changed here only
					snapshot = getSnapshotTable().snapshot;
					currentSnapshotName = newSnapshotName;
					currentSnapshotId = response["snapshotId"];
					loadNewSnapshot();
					dirtyTimeTable = false;
				} else{
					alert("Saving New Snapshot Failed. Error: " + response["Error"]);
					loadSnapshotMenu(currentSnapshotName);
					document.getElementById("saveNewSnapshot").value = "Save New Snapshot";
					document.getElementById("saveNewSnapshot").disabled = false;
				}
			}
			$("#mainTimeTable").show();
			$("#selection-menu-column").show();
			$("#configuration-menu-column").show();
			$("#waitMessage").hide();
		}
		$("#mainTimeTable").hide();
		$("#selection-menu-column").hide();
		$("#configuration-menu-column").hide();
		$("#waitMessage").show();
		document.getElementById("saveNewSnapshot").value = "Saving New...wait";
		document.getElementById("saveNewSnapshot").disabled = true;
		xhttp.open("POST", "timetable.php", true); // asynchronous
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("reqType=saveNewSnapshot&newSnapshotName=" + newSnapshotName + "&currentSnapshotName=" + currentSnapshotName +
					"&configId=" + currentConfigId + "&ttData=" + JSON.stringify(timeTable) +
					"&feData=" + JSON.stringify(fixedEntry) + "&brData="+ JSON.stringify(batchRoom)
					 + "&crData=" + JSON.stringify(classRoom) + "&srData=" + JSON.stringify(subjectRoom));
	}
}
function jsSaveSnapshot(asynchronousOrNot) {
	if(currentSnapshotName != null) {
		var xhttp;
		xhttp = new XMLHttpRequest();
		if(asynchronousOrNot === true)
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				response = JSON.parse(this.responseText);
				if(response["Success"] == "True") {
					alert("snapshot " + currentSnapshotName + " Saved. Press OK to continue");
					document.getElementById("saveSnapshot").value = "Save";
					document.getElementById("saveSnapshot").disabled = false;
					loadSnapshotMenu(currentSnapshotName);
					dirtyTimeTable = false;
				} else {
					alert("Saving snapshot failed. Error = " + response["Error"]);
					document.getElementById("saveSnapshot").value = "Save";
					document.getElementById("saveSnapshot").disabled = false;
				}
			}
			$("#mainTimeTable").show();
			$("#selection-menu-column").show();
			$("#configuration-menu-column").show();
			$("#waitMessage").hide();
		}
		xhttp.open("POST", "timetable.php", asynchronousOrNot); // asynchronous
		document.getElementById("saveSnapshot").value = "Saving snapshot ...wait";
		document.getElementById("saveSnapshot").disabled = true;
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("reqType=saveSnapshot&snapshotName=" + currentSnapshotName + "&ttData=" +
				JSON.stringify(timeTable) + "&feData=" + JSON.stringify(fixedEntry) + "&brData="
				+ JSON.stringify(batchRoom) + "&crData=" + JSON.stringify(classRoom) +
				"&srData=" + JSON.stringify(subjectRoom));
		$("#mainTimeTable").hide();
		$("#selection-menu-column").hide();
		$("#configuration-menu-column").hide();
		$("#waitMessage").show();
		if(asynchronousOrNot === false) {
			response = JSON.parse(xhttp.responseText);
			$("#mainTimeTable").show();
			$("#selection-menu-column").show();
			$("#configuration-menu-column").show();
			$("#waitMessage").hide();
			if(response["Success"] == "True") {
				alert("snapshot " + currentSnapshotName + " Saved. Press OK to continue");
				document.getElementById("saveSnapshot").value = "Save";
				document.getElementById("saveSnapshot").disabled = false;
				loadSnapshotMenu(currentSnapshotName);
				dirtyTimeTable = false;
			} else {
				alert("Saving snapshot failed. Error = " + response["Error"]);
				document.getElementById("saveSnapshot").value = "Save";
				document.getElementById("saveSnapshot").disabled = false;
			}
		}
	} else {
		alert("jsSaveSnapshot: can't find currentSnapshotName");
	}
}

function makeIdFromIJK(i, j, k) {
	return "_" + i + "_" + j + "_" + k;
}
function makeIJKFromId(id) {
	return id.split("_").splice(1);
}
function jsSQLExport(type) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var blob = this.response;
			var headers = this.getAllResponseHeaders();
			/* if you have the fileName header available */
			var fileName = this.getResponseHeader("filename"); 
			var link=document.createElement('a');
			link.href=window.URL.createObjectURL(blob);
			link.download=fileName;
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			$("#mainTimeTable").show();
			$("#selection-menu-column").show();
			$("#configuration-menu-column").show();
			$("#waitMessage").hide();
		}
	}
	$("#mainTimeTable").hide();
	$("#selection-menu-column").hide();
	$("#configuration-menu-column").hide();
	$("#waitMessage").show();
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.responseType = "blob";
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=exportSQL&snapshotName=" + currentSnapshotName+ "&type=" +
				type + "&snapshotId=" + currentSnapshotId);

}
function jsExport(type) {
	if(type == "exportCurrentXLSX"){
		if(window.type == "class" || window.type == "room" ||
			window.type == "teacher" || window.type == "batch"){
			var optionSelected = currTableId;
		}

		else{
			alert("please select any timetable");
			return;
		}
	}
	var xhttp = new XMLHttpRequest();
	exportType = type;
	xmlObject = xhttp;
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var blob = this.response;
			var headers = this.getAllResponseHeaders();
			/* if you have the fileName header available */
			var fileName = this.getResponseHeader("filename"); 
			var link=document.createElement('a');
			link.href=window.URL.createObjectURL(blob);
			link.download=fileName;
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			$("#mainTimeTable").show();
			$("#selection-menu-column").show();
			$("#configuration-menu-column").show();
			$("#waitMessage").hide();
		}
	}
	$("#mainTimeTable").hide();
	$("#selection-menu-column").hide();
	$("#configuration-menu-column").hide();
	$("#waitMessage").show();
	if(dirtyTimeTable) {
		save = confirm("Timetable not saved. Save before exporting?");
		if(save == true) {
			jsSaveSnapshot(false);
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.responseType = "blob";
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	if(type == "exportCurrentXLSX"){
		xhttp.send("reqType=" + type + "&tableName=" + window.type + "&option=" +
			optionSelected + "&snapshotName=" + currentSnapshotName +
			"&snapshotId=" + currentSnapshotId);
	}
	else{
		xhttp.send("reqType=" + type + "&snapshotName=" + currentSnapshotName +
			"&snapshotId=" + currentSnapshotId);
	}

}
function shortcutEscButton() {
	if(currentFormName != null)
		formClose(currentFormName)
	else if(exportType == "exportXLSX" || exportType == "exportPDF") {
		cancel = confirm("Do you want to cancel the export process?\n Press OK to stop, cancel to continue.");
		if(cancel == true) {
			$("#mainTimeTable").show();
			$("#selection-menu-column").show();
			$("#configuration-menu-column").show();
			$("#waitMessage").hide();
			xmlObject.onreadystatechange = function () {return;};
			exportType = null;
		}
	}
}
/**
 * function wait():
 * Attribution: http://stackoverflow.com/questions/14226803/javascript-wait-5-seconds-before-executing-next-line
 */
function wait(ms){
	var start = new Date().getTime();
	var end = start;
	while(end < start + ms) {
		end = new Date().getTime();
	}
}
function checkInstallation() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "install.php", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=checkInstallation");
	$("#checkMessage").hide();
	$("#checkMessage").html("<h1>Checking Installation... Please wait</h1>");
	$("#checkMessage").show();
	wait(1000);
	var response = JSON.parse(xhttp.responseText);
	if(response["Success"] == "True")
		return true;
	else {
		/* TODO: Check why the new message is displayed after wait is over */
		$("#checkMessage").hide();
		$("#checkMessage").html("<h1>Installation incomplete, redirecting to install.php</h1>");
		$("#checkMessage").show();
		wait(1000);
		var currLocation = window.location.href;
		window.location.replace("install.php");
		/* Dead code */
		return false;
	}
}
hiddenTracker = 0;
function hideTracker() {
	if(!hiddenTracker)  {
		$("#trackerDiv").hide();
		$("#trackerDiv").html("Dashboard <span id=\"completionTag\"> </span>" +
							"<a href=\"javascript:void(0)\" onclick='hideTracker()'> Show </a>");
		$("#trackerDiv").show();
		hiddenTracker = 1;
	} else {
		$("#trackerDiv").hide();
		$("#trackerDiv").html("Dashboard <span id=\"completionTag\"> </span>" +
						"<a href=\"javascript:void(0)\" onclick='hideTracker()'> Hide </a>" +
						"<div id=\"tracker\" rows = \"3\" cols = \"20\" readonly=\"readonly\">");
		$("#trackerDiv").show();
		showTrackerList();
		hiddenTracker = 0;
	}
}
hiddenSidePane = 0;
function hideSidePane() {
	if(!hiddenSidePane) {
		$("#configurationDiv").hide();
		$("#trackerDiv").hide();
		$("#warningsDiv").hide();
		$(".outercol2").css("width", "1%");
		$("#hideButton").html("<a href=\"javascript:void(0)\" onclick='hideSidePane()'> Show &lt; </a>");
		hiddenSidePane = 1;
	} else {
		$("#configurationDiv").show();
		$("#trackerDiv").show();
		$("#warningsDiv").show();
		$(".outercol2").css("width", "20%");
		$("#hideButton").html("<a href=\"javascript:void(0)\" onclick='hideSidePane()'> Hide &gt; </a>");
		hiddenSidePane = 0;
	}
}
/* Load all tables, including Dept, Config, Snapshot and Initialize
 * the display timeTable. Load default Snapshot
 */
function load() {
	var i;
	if(checkInstallation() === false)
		return false;
	if(getDeptConfigSnapshot() === false) {
		return false;
	}
	/*Load the default snapshot*/
	res = loadNewSnapshot();
	if(res === false) {
		alert("load(): Loading of Snapshot Failed. Check your Error Logs.");
		return false;
	}

	$("#mainTimeTable").append("<center><B>No TimeTable loaded </B><br>" +
								"Please select option from above catgories</center>");
	document.getElementById("title").innerHTML =  "<h2> Timetable for " +
				search(dept, "deptId", currentDeptId)["deptName"] + "</h2>";
	$("#waitMessage").hide();

	$(window).resize(function () {
		/* do something */
		fillTable2(true);
	});

	shortcut.add("Esc", function () {shortcutEscButton()});
	shortcut.add("Ctrl+s", function () { jsSaveSnapshot(false)});
	shortcut.add("Ctrl+shift+s", function () { jsSaveNewSnapshot()});
	return res;
}

window.onload = load;
window.onbeforeunload = function(event)
{
	if(dirtyTimeTable == true)
		return "Confirm refresh";
};

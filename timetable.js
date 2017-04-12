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
/* In future give a menu option to select a Config, and then a snapshot in that config */
var currentConfigId = 1;

var type;// = "class";
var id;// = "SYBT-CE";
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

var dirtyTimeTable = 0;

function debugPrint(tableName, row) {
	var res = {};
	switch(tableName) {
		case "timeTable":
			//if((res = search(timeTableReadable, "ttId", row["ttId"])) !== -1)
				//return JSON.stringify(res);

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
	console.log("i = " + i + " j = " + j + " k = " + k);

	srcSlotEntry = helperTable[i - 1][j][k];
	srcI = i;/*Needed afterwards*/
	//console.log(dragSlotEntry);
  	e.dataTransfer.effectAllowed = 'move';
  	e.dataTransfer.setData('text/html', e.target.innerHTML);
}

function dragEnterHandler(e) {
	e.target.classList.add('over');
}

function dragOverHandler(e) {
	//e.target.parentElement.parentElement.classList.add('over');
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
	//get id
	//find in helpertable
	//if not null
	//swap
	//if null
	///check validatiy of source only
//validatiy =>subject:eachSlot(teacher free, if class subj==> no batch subj or other class subj, if batch subj==> batch free, no class subj in slot, only overlapping batches)
	console.log("drop fired");
	var id = e.target.id.replace(/[^0-9\.]/g, '');
	//console.log(id);
	if(id.length == 0) {
		dragSrcEl.style.opacity = 1;
		return;
	}
	var i = parseInt(id.substring(0, 1));
	var j = parseInt(id.substring(1, id.length - 1));
	var k = parseInt(id.substring(id.length - 1, id.length));

	var slotNo = parseInt(srcSlotEntry["slotNo"]);
	//console.log("i -1"+ (i - 1));
	var destSlotEntry = helperTable[i - 1][j][k];
	//alert(destSlotEntry);
	var srcSubjectRow = search(subject, "subjectId", srcSlotEntry["subjectId"]);
	if(destSlotEntry !== null) { /*SWAP*/
		//Sourse valid in destn place
		//alert("over here");
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
			valid2 = checkValidity(parseInt(srcSlotEntry["day"]), slotNo,
						 destSlotEntry);
		}
		if(!valid2 || !valid1) {
			if(temp2.length !== 0) {/*If operation fails*/
				for(var r = 0; r < srcSubjectRow["eachSlot"]; r++) {
					//timeTable.push(temp2.pop());
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
		//alert("Came here");
		var valid = checkValidity(i, j, srcSlotEntry);
		if(valid) {
			//srcSlotEntry["day"] = ""+i;
			//srcSlotEntry["slotNo"] = ""+j;
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
	console.log("searchMultipleRows: " + JSON.stringify(arguments));
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
		case "class": supportObject = search(classTable, "classShortName", id);
			break;
		case "teacher":supportObject = search(teacher, "teacherShortName", id);
			break;
		case "room": supportObject = search(room, "roomShortName", id);
			break;
		case "batch": supportObject = search(batch, "batchName", id);
			break;
		default:
			console.log("ERROR: getSupportObject: should not come here in default");
			break;
	}
}

function insertAfter(elem, refElem) {
	var parent = refElem.parentNode;
	var next = refElem.nextSibling;
	if (next)
		return parent.insertBefore(elem, next);
	else 
		return parent.appendChild(elem);
}

function selected(element) {
	if(typeof selectedCell != "undefined")
		selectedCell.style.border = prevBorder;
	prevBorder = element.style.border;
	element.style.borderColor = "green";
	element.style.borderStyle = "solid";
	element.style.borderWidth = "5px";
	selectedCell = element;
}
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
/*Loads timeTable data for snapshotName from server asynchronously*/
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
	//classChange(true);
}
function getOneTable(tName, asynchronousOrNot) {/*Loads data from server asynchronously*/
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//alert("getOneTable: " + this.responseText);
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
function getDeptConfigSnapshot() {
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
	//alert("dept = " + JSON.stringify(dept) + "\n currDeptId = " + currentDeptId);

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
	currentConfigId = config[0]["configId"];
	//alert("config = " + JSON.stringify(config) + "\n currConfigId = " + currentConfigId);

	snapshot = getSnapshotTable().snapshot;
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
	//xhttp.onreadystatechange = function() {
		//if (this.readyState == 4 && this.status == 200) {
			//};
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
//}

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

function displayTime(date) { /*Reurns time in needed format*/
        var hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
        var am_pm = date.getHours() >= 12 ? "PM" : "AM";
        hours = hours < 10 ? "0" + hours : hours;
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        return hours + ":" + minutes +" " + am_pm;
}

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
	td.appendChild(text);
	tr.appendChild(td);
	var start = new Date("February 25, 2017 "+ startTime);

	for(i = 0; i < nSlots; i++) {
		td = document.createElement("th");
		var text = displayTime(start);
		start = new Date(start.getTime() + (timePerSlot * 1000)); /*timePerSlot is in seconds*/
		text = text + " to<br>" + displayTime(start);
		td.innerHTML = text;
		tr.appendChild(td);
	}
	table.appendChild(tr);
	for(i = 1; i <= days; i++) {/*Daywise*/
		for(k = 0; k < slotTablePerDay; k++) {/*slottable row per day*/
			tr = document.createElement("tr");
			tr.setAttribute("id", "row" + i + k);
			tr.setAttribute("class", "row" + i);
			//tr.setAttribute("class", "row"); //TODO: you may add this to enable rowwise css
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
				/*td.setAttribute("id", "cell"+i+j+k); */
				td.setAttribute("id", "cell"+ makeIdFromIJK(i, j, k));
				td.setAttribute("class", "cell");
				td.setAttribute("onclick", "selected(this)");
				var div = document.createElement("div");
				div.setAttribute("class", "div"+ i + j);
				var slottable = document.createElement("table");
				/*slottable.setAttribute("id", "slottable"+i+j+k); */
				slottable.setAttribute("id", "slottable"+ makeIdFromIJK(i, j, k));
				slottable.setAttribute("class", "slottable" + k);
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
			table.appendChild(tr);
			if(k != 0) {
				tr.style.display = "none";                                                       
			}
		}
	}
	return table;
}

function sort(table) {
	//console.log("sort: table = " + JSON.stringify(table));
	for(var i = 0; i < table.length - 1; i++) {
		for(var j = 0; j < table.length - i - 1 ; j++) {
			var row1 = search(subject, "subjectId", table[j]["subjectId"]);
			var row2 = search(subject, "subjectId", table[j + 1]["subjectId"]);
			if(row1["eachSlot"] < row2["eachSlot"]) {
				//console.log("sort: row1" + row1["eachSlot"]+"< row2: "+row2["eachSlot"]);
				var temp = table[j + 1];
				table[j + 1] = table[j];
				table[j] = temp;
				//console.log("sort: table : " + JSON.stringify(table));
			}
		}
	}
}

function createTimeTableEntry(day, slotNo, roomId, classId, subjectId,
			teacherId, batchId, snapshotId, isFixed) {
	console.log(timeTable);
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
	dirtyTimeTable = 1; 
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
function makeTimeTableEntry1(day, slotNo, roomId, classId, subjectId,
		teacherId, batchId, currentSnapshotId, isFixed, eachSlot) {
	alert("goig to make timmeTable Entry:" + batchId);
	makeTimeTableEntry(day, slotNo, roomId, classId, subjectId,
		teacherId, batchId, currentSnapshotId, isFixed, eachSlot);
}
function makeTimeTableEntry(day, slotNo, roomId, classId, subjectId,
		teacherId, batchId, currentSnapshotId, isFixed, eachSlot) {
	if(classId == null) {
		alert("makeTimeTableEntry: classId is null");
	}
	for(var i = 0; i < eachSlot; i++) {
		var newEntry = new createTimeTableEntry(day, (parseInt(slotNo) + i),
							roomId, classId,
							subjectId, teacherId,
							batchId, currentSnapshotId, isFixed);
		timeTable.push(newEntry);
		console.log("makeTimeTableEntry: " + debugPrint("timeTable", newEntry));
		//console.log("makeTimeTableEntry: newEntry = " + JSON.stringify(newEntry));
	}
	//if(batchId != "1" && batchId != null) {/*For overlapping sbt*/
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
							roomId, classId,
							subjectId, teacherId,
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
	/*Id = Id.substring(8, Id.length);
	iid = Id.substring(0, 1);
	jid = Id.substring(1, Id.length -1);
	kid = Id.substring(Id.length - 1,Id.length);
	*/
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
	var subjectRow = search(subject, "subjectShortName", temp.innerHTML);/*subject*/
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
	//alert(JSON.stringify(crEntry)+"\n"+JSON.stringify(brEntry));
	if(search(classRoom, "classId", classId) === -1)
		classRoom.push(crEntry);

	if(batchId && search(batchRoom, "batchId", batchId) === -1)
		batchRoom.push(brEntry);

	if(search(subjectRoom, "subjectId", subjectRow["subjectId"]) === -1)
		subjectRoom.push(srEntry);
	//alert(JSON.stringify(classRoom)+"\n"+JSON.stringify(batchRoom)+"\n"+JSON.stringify(subjectRoom)+"\n");
	fillTable2(true);
}

function getEligibleBatches(i, j, k, subjectRow) {
	console.log("getEligibleBatches: i = " + i + " j = " + j + " k = " + k +
				"subject = " + subjectRow["subjectShortName"]);
	var optionString = "<option value=\"NOT_SELECTED\">--Batch--</option>";
	var eligibleBatches = [];
	var configRow = search(config, "configId", currentConfigId);
	/*Get batches of class and for that subject*/
	var sbtRows;
	if(type == "class") {
		sbtRows = searchMultipleRows(subjectBatchTeacher, "subjectId", subjectRow["subjectId"]);
		var bcRows = searchMultipleRows(batchClass, "classId", supportObject["classId"]);
		for(var n = 0; n < sbtRows.length; n++) {
			if(search(bcRows, "batchId", sbtRows[n]["batchId"]) === -1) {
				sbtRows.splice(n, 1);
				--n;
			}
		}
	}
	else if(type == "teacher") {
		sbtRows = searchMultipleRows(subjectBatchTeacher, "subjectId", subjectRow["subjectId"],
					"teacherId", supportObject["teacherId"]);
	}
	else if(type == "room") {
		sbtRows = searchMultipleRows(subjectBatchTeacher, "subjectId", subjectRow["subjectId"]);
	}
	//console.log("getEligibleBatches: bcRows = " + JSON.stringify(bcRows));
	//console.log("getEligibleBatches: sbtRows = " + JSON.stringify(sbtRows));
	var eachSlot = parseInt(subjectRow["eachSlot"]);
	outerloop: //label
	for(var y = 0; y < sbtRows.length; y++) {
		console.log("getEligibleBatches Looping y:" + y + " " + JSON.stringify(sbtRows[y]));
		var currTeacher = search(teacher, "teacherId", sbtRows[y]["teacherId"]);
		var maxEntriesForSubject = subjectRow["nSlots"];

		//c = # entries in tt for this batch-subject
		var existingEntries = searchMultipleRows(timeTable,"subjectId", subjectRow["subjectId"],
							"batchId", sbtRows[y]["batchId"]);
		if(existingEntries !== -1) {
			lenExistingEntries = (existingEntries.length / subjectRow["eachSlot"]);
			//<==Changed this*/
		}
		else {
			lenExistingEntries = 0;
		}
		//Checking whether there is time left for subject(1) , batch
		if(lenExistingEntries == maxEntriesForSubject) {
			continue outerloop;
		// Done: following needs a fix for batchable subjects.
		} else if(lenExistingEntries > maxEntriesForSubject) {
			alert(lenExistingEntries + " i.e. More than " + maxEntriesForSubject +
				" Entries for Subject " + subjectRow["subjectShortName"]+
				"existingEntriesLen = " + existingEntries.length + " eachSlot = " + subjectRow["eachSlot"] +
				"existingEntries = " + JSON.stringify(existingEntries));
		}
		/*Maxhr for teacher exceeded or not(1)*/
		var allocatedTimeForTeacher = searchMultipleRows(timeTable, "teacherId",
								currTeacher["teacherId"]);
		if(allocatedTimeForTeacher !== -1) {
			 allocatedTimeForTeacher = allocatedTimeForTeacher.length;
		}
		else {
			 allocatedTimeForTeacher = 0;
		}
		if((allocatedTimeForTeacher + eachSlot) > parseInt(currTeacher["maxHrs"])) {/*(5)*/
			console.log("getEligibleBataches:  teacher: " + currTeacher["teacherShortName"]
										+" max hr exceeded");
			continue outerloop;
		}
		/*overlapping batches for curr batch*/
		var bcoEntries = searchMultipleRows(batchCanOverlap, "batchId", sbtRows[y]["batchId"]);
		var bc = search(batchClass, "batchId", sbtRows[y]["batchId"]);
		for(var z = 0; z < eachSlot; z++) {
			var slotEntries = searchMultipleRows(timeTable, "day", i, "slotNo", (j + z),
								"classId", bc["classId"],
								"snapshotId", currentSnapshotId);
			if(slotEntries !== -1) {
				/*Batche in slot --> in overlaping batches array*/
				if(bcoEntries !== -1) {
					for(var p in slotEntries) {
						var index = search(bcoEntries,
								"batchOverlapId", slotEntries[p]["batchId"]);
						if(index === -1) {//(2)
							console.log("getEligibleBatches: overlapping "
										+ JSON.stringify(p));
							continue outerloop;
						}
					}
				}
			}
					/*batch already in slot(3)*/
			index = search(slotEntries, "batchId", sbtRows[y]["batchId"]);
			if(index !== -1) {
				console.log("getEligibleBatches: batch " + sbtRows[y]["batchId"] + " busy");
				continue outerloop;
			}
			var nEntriesForTeacher = search(timeTable, "day", i, "slotNo", j + z,
							 "teacherId", currTeacher["teacherId"],
							 "snapshotId", currentSnapshotId);
						//if t is busy in this slot(i,j)
							//continue(4)
			if(nEntriesForTeacher != -1) {
				console.log("getEligibleBatches: Teacher " + currTeacher["teacherId"] + " Busy");
				continue outerloop;
			}
		}
		eligibleBatches.push(search(batch, "batchId", sbtRows[y]["batchId"]));
	}
	for(var r in eligibleBatches) {
		var batchName = eligibleBatches[r]["batchName"];
		optionString += "<option value =\""+ batchName +"\">" + batchName + "</option>";
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
		var valid = 1;
		for(var z =0; z < eachSlot; z++) {
			var found = search(timeTable,
						"day", i, "slotNo", "" + (parseInt(j) + z),
						"roomId", roomRow["roomId"],  "snapshotId", currentSnapshotId);
			if(found !== -1) {/*There are other classes in this room*/
				valid = 0;
				break;
			}
		}
		if(valid == 1) {
			optionString += "<option value = \"" + roomRow["roomShortName"] + "\" selected=\"selected\">" +
						roomRow["roomShortName"] +
					"</option>";
		}
	}
	for(var y = 0; y < room.length; y++) {
	//alert(parseInt(room[i]["roomCount"]) +" ,"+capacity);
		var valid = 1;
		for(var z =0; z < eachSlot; z++) {
			var found = search(timeTable, "day", i, "slotNo", "" + (parseInt(j) + z),
						"roomId", room[y]["roomId"],  "snapshotId", currentSnapshotId);
			if(found !== -1) {/*There are other classes in this room*/
				valid = 0;
				break;
			}
		}
		if(valid == 0)
			continue;
				// TODO: The capacity check needs to be more flexible
				//if(parseInt(room[y]["roomCount"]) >= capacity) {
		optionString += "<option value = \"" + room[y]["roomShortName"] + "\">" +
			room[y]["roomShortName"] + "</option>";
				//}
	}
	return optionString;
}

function classSelected(selecttag) {/*Final stage for room type*/
	var classShortName = selecttag.options[selecttag.selectedIndex].text;
	var Id = selecttag.getAttribute("id");
	/*Id = Id.substring(5, Id.length);
	iid = Id.substring(0, 1);
	jid = Id.substring(1, Id.length -1);
	kid = Id.substring(Id.length - 1,Id.length);
	*/
	[iid, jid, kid ] = makeIJKFromId(Id);
	Id = makeIdFromIJK(iid, jid, kid);

	var classRow = search(classTable, "classShortName", classShortName);
	var subjectShortName = document.getElementById("subject" + Id).innerHTML;
	//alert(subjectShortName);
	var subjectRow = search(subject, "subjectShortName", subjectShortName);
	var teacherRow = search(subjectClassTeacher, "subjectId", subjectRow["subjectId"],
				"classId", classRow["classId"]);
	/*for(var i = 0; i < parseInt(subjectRow["eachSlot"]); i++) {
		var newEntry = new createTimeTableEntry(iid, (parseInt(jid) + i),
							supportObject["roomId"], classRow["classId"],
							subjectRow["subjectId"], teacherRow["teacherId"],
							1, currentSnapshotId, 0);
		timeTable.push(newEntry);
		console.log("roomEntry: newEntry = " + JSON.stringify(newEntry));
	}*/
	makeTimeTableEntry(iid, jid, supportObject["roomId"], classRow["classId"], subjectRow["subjectId"],
		teacherRow["teacherId"], null, currentSnapshotId, 0, parseInt(subjectRow["eachSlot"]));
	fillTable2(false);
}

function getEligibleClass(i, j, k, subjectRow) {/*Not considering room capacity*/
	var sct = searchMultipleRows(subjectClassTeacher, "subjectId", subjectRow["subjectId"]);
	var classlist = [];
	var existingEntries;
	var optionString = "<option value=\"NOT_SELECTED\">--Class--</option>";
next_class:for(var l in sct) {
		var classId = sct[l]["classId"];
		/*Maxhr of subject excceded in this class*/
		res = searchMultipleRows(timeTable, "classId", classId,"subjectId",
					subjectRow["subjectId"],"snapshotId", currentSnapshotId);
		if(res === -1){
			existingEntries = 0;
		}
		else {
			existingEntries = (res.length/subjectRow["eachSlot"]);
		}
		if(existingEntries >= subjectRow["nSlots"]) {
			console.log("getEligibleClass: maxHrs prob" + classId);
			continue next_class;
		}
		for(var n = 0; n < subjectRow["eachSlot"]; n++) {
			/*Whether this class is free in ech slot*/
			var res = search(timeTable, "day", i, "slotNo", (j + n), "classId", classId,
					"snapshotId", currentSnapshotId);
			if(res !== -1)
				continue next_class;
		}
		classlist.push(search(classTable, "classId", classId));
	}
	if(classlist.length == 0) {
		alert("Not found appropriate class for this subject for this particular room");
		fillTable2(false);
		return  "";
	}
	for(var r in classlist) {
		optionString += "<option value= \"" + classlist[r]["classShortName"] + "\">" +
					classlist[r]["classShortName"] +
				"</option>";
	}
	return optionString;
}

function batchSelected(selecttag) {
	var batchName = selecttag.options[selecttag.selectedIndex].text;

	var Id = selecttag.getAttribute("id");
	/*Id = Id.substring(5, Id.length);
	iid = Id.substring(0, 1);
	jid = Id.substring(1, Id.length -1);
	kid = Id.substring(Id.length - 1,Id.length);
	*/
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
				//alert(JSON.stringify(teacherRow));
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
			/*for(var i = 0; i < subjectRow["eachSlot"]; i++) {
				var newEntry = new createTimeTableEntry(iid, (parseInt(jid) + i),
							supportObject["roomId"], classId,
							subjectRow["subjectId"], teacherId,
							batchRow["batchId"], currentSnapshotId, 0);
				timeTable.push(newEntry);
				console.log("roomEntry: newEntry = " + JSON.stringify(newEntry));
			}*/
			makeTimeTableEntry(iid, jid, supportObject["roomId"], classId, subjectRow["subjectId"],
			teacherId, batchRow["batchId"], currentSnapshotId, 0, parseInt(subjectRow["eachSlot"]));
			fillTable2(false);
			return;
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
		// ABHIJIT var slottable = document.getElementById("slottable"+ i + j + k);
		var slottable = document.getElementById("slottable" + makeIdFromIJK(i, j, k));
		if(slottable == null) {
			return;
		}

		slottable.innerHTML =
			"<tr>" +
				"<td>" +
					//"<div class= \"box\" id = \"box" + i + j + k + "\">" +
					"<div class= \"box\" id = \"box" +  makeIdFromIJK(i, j, k) + "\">" +
						"<span class = \"fixedEntry\"" +
						//"id = \"fixed" + i + j + k + "\">" +
						"id = \"fixed" + makeIdFromIJK(i, j, k) + "\">" +
							label +
						"</span>" +
						//"<span id = \"" + i + j + k + "\" " +
						"<span id = \"" + makeIdFromIJK(i, j, k) + "\" " +
						"class=\"delete\" onclick = deleteEntry(this)>" +
							"x" +
						"</span>" +
					"</div>" +
				"</td>" +
			"</tr>";
		helperTable[i - 1][j][k] = timeTable[timeTable.length - 1];
	}
}
function subjectSelected(selecttag) {
	var index = selecttag.selectedIndex;
	var subjectShortName = selecttag.options[index].value;

	var Id = selecttag.getAttribute("id");
	/*Id = Id.substring(7, Id.length);
	iid = Id.substring(0, 1);
	jid = Id.substring(1, Id.length -1);
	kid = Id.substring(Id.length - 1,Id.length);
	*/
	[iid, jid, kid ] = makeIJKFromId(Id);
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
		case "teacher" :
			if(batches === "0") { /* Non Batchable Subject*/
				var roomSelect = document.getElementById("room" + Id);
				roomSelect.style.display = "";
				document.getElementById("checkbox" + Id).style.display = "";
				var capacity = parseInt(supportObject["classCount"]);
				/*Teacher Entry*/
				if(type == "class") {
					var sctEntry = search(subjectClassTeacher,
									"subjectId", subjectRow["subjectId"],
									"classId", supportObject["classId"]);
					var teacherRow = search(teacher, "teacherId", sctEntry["teacherId"]);
					extraInfo += "<div id=\"teacher"+ Id + 
									"\" class=\"box\">" +
									teacherRow["teacherShortName"] +
						"</div>";
					roomFound = search(classRoom, "classId", supportObject["classId"]);
				}
				else {/*Class Entry*/
					var sctEntry = search(subjectClassTeacher,
									"subjectId", subjectRow["subjectId"],
									"teacherId", supportObject["teacherId"]);
					var classRow = search(classTable, "classId", sctEntry["classId"]);
					extraInfo += "<div id=\"class"+ Id 
									"\" class=\"box\">" +
									classRow["classShortName"] +
						"</div>";
					roomFound = search(classRoom, "classId", classRow["classId"]);
				}

				if(roomFound == -1) {
					roomFound = search(subjectRoom, "subjectId", subjectRow["subjectId"]);
				}
				roomSelect.innerHTML = getEligibleRoom(parseInt(iid), parseInt(jid),
											parseInt(kid),
											capacity, subjectRow, roomFound);/*room option*/
			}
			else {/*Subject Having Batches*/
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
			extraInfo += "<div id= \"teacher"+ iid + jid + kid +"\"class=\"box\">" +
						teacherRow["teacherShortName"] +
					"</div>";
			extraInfo += "<div id= \"class"+ iid + jid + kid +"\"class=\"box\">" +
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
function disabledSubjectPresent(disabledArray, subject) {
	//console.log("disabledSubjectPresent: " + subject);
	for(i = 0; i < disabledArray.length; i++) {
		if(disabledArray[i][0] === subject) {
			//console.log("Present");
			return 1;
		}
	}
	//console.log("Absent");
	return 0;
}
function getEligibleSubjects(i, j, k) {
	var configrow = search(config, "configId", currentConfigId);
	var nSlotsPerDay = configrow["nSlots"];
	//var select = "<select id= \"subject" + i + j + k +
	var select = "<select id= \"subject" + makeIdFromIJK(i, j, k) +
				"\" onchange=\"subjectSelected(this)\">" +
				"<option value=\"NOT_SELECTED\">Subject" +
				"</option>";
	var subjectsList = [];
	var blist;
	var sbtlist = [];
	var searchOn;
	var sctlist = [];
	switch(type) {
		case "room" :/*Filling the sbtlist n sctlist*/
			for(var h in subject) {
				if(subject[h]["batches"] == "0") {
					var temp = searchMultipleRows(subjectClassTeacher,
								"subjectId", subject[h]["subjectId"]);
					//console.log(temp);
					if(temp !== -1)
						sctlist = sctlist.concat(temp);
				}
				else {
					var temp = searchMultipleRows(subjectBatchTeacher,
								"subjectId", subject[h]["subjectId"]);
					//console.log(temp);
					if(temp !== -1)
						sbtlist = sbtlist.concat(temp);
				}
			}
			break;
		case "class":
			sctlist = searchMultipleRows(subjectClassTeacher, "classId", supportObject["classId"]);
			blist = searchMultipleRows(batchClass, "classId", supportObject["classId"]);
			for (var m = 0; m < blist.length; m++) {
				var res = searchMultipleRows(subjectBatchTeacher, "batchId", blist[m]["batchId"]);
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
	lists = [sctlist, sbtlist];
	//console.log(lists);
	for(l in lists) {
		if(lists[l] === sbtlist)
			searchOn = "batchId";
		else
			searchOn = "classId";
		disabledSubjects = [];
		for(var m = 0; m < lists[l].length; m++) {
			var currSubject= search(subject, "subjectId", lists[l][m]["subjectId"]);
			if(subjectsList.indexOf(currSubject) != -1)
				continue;
			var maxEntriesForSubject = currSubject["nSlots"];

			/* # entries in tt for this batch-subject */
			var existingEntries = searchMultipleRows(timeTable, "subjectId", 
					currSubject["subjectId"], searchOn, lists[l][m][searchOn]);

			/* For a subject with eachSlot=2, we enter two entries in timetable */
			if(existingEntries !== -1)
				lenExistingEntries = (existingEntries.length / currSubject["eachSlot"]);
			else
				lenExistingEntries = 0;

			/* Checking whether we have done nSlots entries for the subject */ 
			if(lenExistingEntries == maxEntriesForSubject /*&& lists[l] != sbtlist*/) {
				//console.log("eligibleSubjects:  maxEntriesFor subject " + currSubject["subjectShortName"] +
					//"class/batch: " + searchOn + " = " + lists[l][m][searchOn]);
					if(!disabledSubjectPresent(disabledSubjects, currSubject["subjectShortName"]))
						disabledSubjects.push([currSubject["subjectShortName"],  ": 0/" + maxEntriesForSubject]);
					continue;
			}
			if(lenExistingEntries > maxEntriesForSubject) {
				//console.log("eligibleSubjects: More than desired entries for " +
					//currSubject["subjectShortName"] + " So skipping ");
				alert("ERROR: More than max possible entries for subject: " + currSubject["subjectShortName"]);
				continue;
			}

			/* Skip the subject if it can't fit remaining slots of day */
			if(j + parseInt(currSubject["eachSlot"]) - 1  >= nSlotsPerDay) {
				//console.log("Skipping slot " + j + " for " + currSubject["subjectShortName"] +
							//" on day " + i + " as slot out of day ");
				if(!disabledSubjectPresent(disabledSubjects, currSubject["subjectShortName"]))
					disabledSubjects.push([currSubject["subjectShortName"],  ": Len="+currSubject["eachSlot"]]);
				continue;
			}
			
			currTeacher = search(teacher, "teacherId", lists[l][m]["teacherId"]);
			var validSubj = 1;
			var gotoNextSubject = false;
			for(var n = 0; n < currSubject["eachSlot"]; n++) {
				/* If we are on room timeTable page, and room is busy in any of j+eachSlot
				 * then skip this subject Entry.
				 * TODO: Check this logic. Abhijit thinks if room is busy, no subject is possible. 
				 *  and this loop will always have res !=-1 for all subjects
				 */
				if(type == "room") {
					var res = search(timeTable, "day", i, "slotNo", j + n,
							"roomId", supportObject["roomId"], "snapshotId", currentSnapshotId);
					if(res !== -1) {
						gotoNextSubject = true;
						break;
					}
				}

				/* Skip subject if teacher is busy */
				var nEntriesForTeacher = search(timeTable, "day", i, "slotNo", j + n,
					 "teacherId", currTeacher["teacherId"], "snapshotId", currentSnapshotId);
				if(nEntriesForTeacher != -1) {
					//console.log("eligibleSubjects: Skipping teacher " +
						//currTeacher["teacherShortName"] + " as busy");
					if(!disabledSubjectPresent(disabledSubjects, currSubject["subjectShortName"]))
						disabledSubjects.push([currSubject["subjectShortName"],  "Tchr Busy"]);
					validSubj = 0;
					gotoNextSubject = true;
					break;
				}

				var classId = lists[l][m]["classId"];
				if(typeof classId == "undefined") {
					classId = search(batchClass, "batchId", lists[l][m]["batchId"]) ["classId"];
				}

				/* Skip this subject if there is already conflicting entry in this slot */
				/* Remember: we are inside: for each SCT entry, for eachSlot of subject */
				var slotEntries = searchMultipleRows(timeTable, "day", i, "slotNo", (j + n),
						"classId", classId, "snapshotId", currentSnapshotId);
				if(currSubject["batches"] == "0") {
					/* Skip subject because already a theory lecture in that slot 
					 * TODO: Abhijit: should we check this. Don't we call getEligibleSubjects()
 					 * only if the slot had no entry?
					 */
					if(slotEntries !== -1) {
						//console.log("getEligibleSubject: Batched-subject " +
									//supportObject["classShortName"] + " in slot");
						validSubj = 0;
						gotoNextSubject = true;
						break;
					}
				}
				else {
					/* For batchable subjects: 
					 * (a) there should be no theory class in this slot 
					 * (b) the batch should be free in this slot
					 * (c) there should be at least one overlapping batch with this batch
					 */
					var bco = searchMultipleRows(batchCanOverlap, "batchId", lists[l][m]["batchId"]);
					for(var q in slotEntries) {
						if(slotEntries[q]["batchId"] == null) {
							//console.log("getEligibleSubject:  " + currSubject["subjectShortName"] +
									 //supportObject["classShortName"] + " subject for whole class");
							if(!disabledSubjectPresent(disabledSubjects, currSubject["subjectShortName"]))
								disabledSubjects.push([currSubject["subjectShortName"],  "Overlaps"]);
							validSubj = 0;
							gotoNextSubject = true;
							break;
						}
						/*batch subj but in this slot subj for whole class present*/
						if(slotEntries[q]["batchId"] == lists[l][m]["batchId"]) {
							console.log("getEligibleSubject: " + lists[l][m]["batchShortName"] +
								" batch not free");
							validSubj = 0;
							gotoNextSubject = true;
							if(!disabledSubjectPresent(disabledSubjects, currSubject["subjectShortName"]))
								disabledSubjects.push([currSubject["subjectShortName"],  "Batch Busy"]);
							break;
						}
						if(bco !== -1) {
							/* TODO: Abhijit: Check. This may be impossible condition */
							if(search(bco, "batchOverlapId", slotEntries[q]["batchId"]) === -1) {
								//console.log("BatchCannot overlap");
								gotoNextSubject = true;
								if(!disabledSubjectPresent(disabledSubjects, currSubject["subjectShortName"]))
									disabledSubjects.push([currSubject["subjectShortName"],  "No Overlap"]);
								break;
							}
						}
					} /* end: for each batchCanOverlap entry */
				} /* end: for each batchable subject */
			} /* end: for each slot for current subject */

			/* Some condition for each Slot failed for this subject */
			if(gotoNextSubject == true)
				continue;

			/* if current subject has MUST overlap entry, and other batch is busy, then skip */
			if(currSubject["batches"] == "1") {
				var osbt = searchMultipleRows(overlappingSBT, "sbtId1", lists[l][m]["sbtId"]);
				if(osbt !== -1)
					for(var q in osbt) {
						if(!overlappingPossible(i, j, osbt[q], currSubject)) {
							if(!disabledSubjectPresent(disabledSubjects, currSubject["subjectShortName"]))
								disabledSubjects.push([currSubject["subjectShortName"],  "OL Batch Busy"]);
							continue;
						}
					}
			}

			/* TODO: for all validSubj =0, we set gotoNextSubject = true, so no need of these lines */
			if(validSubj === 0) { 
				alert("Should'nt come there : validSubj == 0");
				continue;
			}

			/* subject-batch combination has many repetitions of subject, 
			 * so need to remove duplicates
			 */
			subjectsList.push(currSubject);
		} /* end: for each sct or sbt entry */
	} /* end: for each sct/sbt list */

	if(subjectsList.length == 0) {
		var select = "<select disabled=true id= \"subject" + makeIdFromIJK(i, j, k) +
				"\" onchange=\"subjectSelected(this)\">" +
				"<option value=\"NOT_SELECTED\">Subject" +
				"</option>";
		for(x = 0; x < disabledSubjects.length; x++) {
			select += "<option class=\"disabledEntries\" disabled=\"disabled\"" +
				  "value = \"\">" + disabledSubjects[x][0] + ":" +
					disabledSubjects[x][1] + "</option>";
		}
		return select;
	}
	for(var r in subjectsList) {
		var subj = subjectsList[r]["subjectShortName"];
		select += "<option value =\"" + subj + "\">" + subj + "</option>";
	}
	if((type == "batch" || type == "class") &&  cellEmpty(i, j)) {
		select += "<option title=\"Insert a fixed slot/ LUNCH slot\" value = \"FixedEntry\">Fixed slot</option>";
	}
	for(x = 0; x < disabledSubjects.length; x++) {
		select += "<option class=\"disabledEntries\" disabled=\"disabled\"" +
				  "value = \"\">" + disabledSubjects[x][0] + ":" +
					disabledSubjects[x][1] + "</option>";
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

/*Checks the must overlapping subject in its own class timeTable
Returns true if there is no problem in overlapping
Otherwise false*/
function overlappingPossible(i, j, osbt, subjectRow) {
	var sbt = search(subjectBatchTeacher, "sbtId", osbt["sbtId2"]);
	var classId = search(batchClass, "batchId", sbt["batchId"])["classId"];
	var bco = searchMultipleRows(batchCanOverlap, "batchId", sbt["batchId"]);
	for(var p = 0; p < subjectRow["eachSlot"]; p++) {
		var slotEntries = searchMultipleRows(timeTable, "day", i, "slotNo", (j + p),
					"classId", classId, "snapshotId", currentSnapshotId);
		for(var q in slotEntries) {
			if(slotEntries[q]["batchId"] == "1") {/*Class entry present*/
				return false;
			}
			if(slotEntries[q]["batchId"] == sbt["batchId"]) {/*Batch is already having smthng*/
				return false;
			}
			if(bco !== -1) {
				if(search(bco, "batchOverlapId", slotEntries[q]["batchId"]) === -1) {
					return false;
				}
			}
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
	if(isFixed == "1") {/*Fixed Entry handling*/
		var index = timeTable.indexOf(row);
		console.log("Deleting TT Entry: " + debugPrint("timeTable", timeTable[index]));
		if(index != -1)
			timeTable.splice(index, 1);/*Delete entry from table*/
		else
			console.log("Error Deleting TT Entry: Couldn't find index");

		index = searchIndex(fixedEntry, "ttId", row["ttId"]);
		console.log("Deleting Fixed Entry: " + debugPrint("fixedEntry", fixedEntry[index]));
		if(index != -1)
			fixedEntry.splice(index, 1);/*Delete entry from table*/
		else
			console.log("Error Deleting TT Entry: Couldn't find index");

		fillTable2(true);
		return;
	}
	var subjRow = search(subject, "subjectId", row["subjectId"]);/*For the subject*/
	for(var i = 0; i < subjRow["eachSlot"]; i++) {
		var index = searchIndex(timeTable, "day", day, "slotNo", "" + (parseInt(SlotNo) + i),
					"subjectId", subjRow["subjectId"], "batchId", batchId,
					"classId", classId, "snapshotId", currentSnapshotId);
		if(index != -1) {
			console.log("Deleting TT Entry: " + debugPrint("timeTable", timeTable[index]));
			timeTable.splice(index, 1);/*Delete entry from table*/
		} else {
			console.log("Error Deleting TT Entry: Couldn't find index");
		}
	}
	if(batchId != "" + null) {/*For overlapping sbt*/
		var sbt = search(subjectBatchTeacher, "subjectId", subjRow["subjectId"],
							 "batchId", batchId);
		var osbt;
		if(sbt !== -1) {
			var osbt = searchMultipleRows(overlappingSBT, "sbtId1", sbt["sbtId"]);
			if(osbt === -1) {
				fillTable2(true);
				return;
			}
			for(var i in osbt) {
				var batchId = search(subjectBatchTeacher, "sbtId", osbt[i]["sbtId2"])["batchId"];
				var classId = search(batchClass, "batchId", batchId)["classId"];
				for(var j = 0; j < subjRow["eachSlot"]; j++) {
					var index = searchIndex(timeTable, "day", day, "slotNo", (SlotNo + j),
						"subjectId", subjRow["subjectId"], "batchId", batchId,
						"classId", classId, "snapshotId", currentSnapshotId);
					console.log("Deleting TT Entry: " + debugPrint("timeTable", timeTable[index]));
					if(index != -1)
						timeTable.splice(index, 1);
				}
			}
		}
	}
	dirtyTimeTable = 1;
	fillTable2(true);
}

function getPosition(i, j, rowEntry, eachSlot) {
	var subjectId = -1, classId= -1, batchId = -1, pos = -1;
	if(rowEntry != null) {
		subjectId = rowEntry["subjectId"];
		classId = rowEntry["classId"];
		batchId = rowEntry["batchId"];
	}
	for(var k = 0; k < helperTable[i - 1][j].length; k++) {
		var valid = true;
		for(var n = 0; n < eachSlot; n++) {
			if((j + n) > 10)
				return null;
			var temp = helperTable[i - 1][j + n][k];
			if(temp == null) /* Means "Subject select box is there */
				continue;
			if(temp !== 0) {/*means Row Entry is there*/
				if(temp["subjectId"] === subjectId && temp["batchId"] === batchId && temp["classId"] === classId) {
					valid = false;/*this subject was already displayed*/
					//alert("helperTable: entry exists" + JSON.stringify(helperTable));
					//alert("Entry exists: i = " + i + " j = " + j + " subject = " + search(subject, "subjectId", subjectId)["subjectShortName"]);
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
		helperTable[i - 1][j + n][pos] = rowEntry;
		//console.log(JSON.stringify(helperTable));
	}
	//console.log("Found location:"+i+j+k);
	if(pos > 0) {
		if(pos > enabledRows[i - 1]) { /*Enabling rows and hiding the borders row-wise*/
			for(var p = enabledRows[i - 1] + 1; p <= pos; p++) {
				var row = document.getElementById("row" + i + p);
				row.style.display = "";
				//console.log("Row enabled ==========================>"+i+","+p);
				for(var x = 0; x < row.children.length; x++) {
					document.getElementById(row.children[x].id).style.borderTop = "0px none white";
				}
				row = document.getElementById("row" + i + (p - 1));
				for(x = 0; x < row.children.length; x++) {
					document.getElementById(row.children[x].id).style.borderBottom = "0px none white";
				}
			}
			enabledRows[i - 1] = pos;
		} 
		// ABHIJIT document.getElementById("cell"+i+j+pos).style.borderTop = "0px solid black";
		document.getElementById("cell"+ makeIdFromIJK(i, j, pos)).style.borderTop = "0px solid black";
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
 *        call getPosition();
 *        enter in helperTable();
 *        display that entry
 *     else display "Select" box
 */
function fillTable2(createNewTable) {
	var configrow = search(config, "configId", currentConfigId);
	NoOfSlots = configrow["nSlots"];
	var days = 6;
	var slottablePerDay = 1;
	if(type == undefined || id == undefined)
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
			}
			else {
				this.innerHTML = "+";
				$(".animate" + id).fadeOut();
			}
		});
	}

	initializeEnableRowArray(6, parseInt(NoOfSlots), slottablePerDay, 0);

	var classId;
	if(type == "batch") {
		classId = search(batchClass, "batchId", supportObject["batchId"])["classId"];
		if(classId == "1")
			return;
	}
	console.log(JSON.stringify(timeTable));
	for(var i = 1; i <= days; i++) { /*daywise*/
		for(var j = 0; j < NoOfSlots; j++) { /*slotwise*/
			var slotRows;
			console.log(" i = " + i + " j = " + j + "\n");
			if(type == "batch") 
				slotRows = searchMultipleRows(timeTable, "day", i, "slotNo", j, 
					"classId", classId, "batchId", 1, "snapshotId", currentSnapshotId);
			else
				slotRows = searchMultipleRows(timeTable, "day", i, "slotNo", j,
					type + "Id", supportObject[type + "Id"], "snapshotId", currentSnapshotId);
			console.log("slotRows: " + JSON.stringify(slotRows));
			if(slotRows != -1) {
				sort(slotRows);
				var batches = "1";
				/*within each slot*/
				for(var k = 0; k < slotRows.length; k++) {
					var teacherShortName = "", classShortName = "",
						batchName = "", roomShortName = "";
					/*For lunch*/
					if(slotRows[k]["isFixed"] == "1") {
						var position = getPosition(i, j, slotRows[k], 1);
						if(position == null) {
							alert("i: " + i + "slot " + j + "k = " + k + " fixed slot. got position null");
							continue;
						}
						batches = "0";
						// ABHIJIT. var slottable = document.getElementById("slottable"+ i + j + position);
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
						if(slotRows[k]["batchId"] !== null) { // changed from 1 to null by Abhijit. check. TODO.
							batchName = search(batch, "batchId",slotRows[k]["batchId"])["batchName"];
							batches = "1";
							if(typeof batchName == "undefined") {
								alert("ERROR. i: " + i + "slot " + j + "k = " + k + " got batchName undefined. ERROR");
								batchName = "";
							}
						}
						slottable.innerHTML =
							"<tr>" +
								"<td>" +
									//"<div class= \"box\" id = \"box" + i + j + position + "\">"+
									"<div class= \"box\" id = \"box" + makeIdFromIJK(i, j, position) + "\">"+
										"<span class = \"fixedEntry\"" +
										//"id = \"fixed" + i + j + position + "\">" +
										"id = \"fixed" + makeIdFromIJK(i, j, position) + "\">" +
											label +
										"</span>" +
										"<span class = \"batchentry\"" +
										//"id = \"batch" + i + j + position + "\">" +
										"id = \"batch" + makeIdFromIJK(i, j, position) + "\">" +
											batchName +
										"</span>" +
										//"<span id = \"" + i + j + k + "\" "+
										"<span id = \"" + makeIdFromIJK(i, j, k) + "\" "+
										"class=\"delete\" onclick = deleteEntry(this)>"+
											"x" +
										"</span>" +
									"</div>" +
								"</td>" +
							"</tr>";
						continue;
					}
					if(type != "teacher")
						teacherShortName = search(teacher, "teacherId",
							slotRows[k]["teacherId"])["teacherShortName"];

					var subjectRow = search(subject, "subjectId", slotRows[k]["subjectId"]);
					if(type != "room")
						roomShortName = search(room, "roomId", slotRows[k]["roomId"])["roomShortName"];
					if(type != "class")
						classShortName = search(classTable, "classId", slotRows[k]["classId"])["classShortName"];

					var eachSlot = subjectRow["eachSlot"];

					batches = subjectRow["batches"];
					batchName = "";
					//if(slotRows[k]["batchId"] != 1 && type != "batch")
					batchIdNull = ("" + slotRows[k]["batchId"] == "null");
					//alert("batchIdNull: " + batchIdNull + " batchId = " + slotRows[k]["batchId"] + " slotRows = " + JSON.stringify(slotRows[k]));	
					if(!batchIdNull && (type != "batch")) { 
						/* NUll made by abhijit. check. TODO */
						var batchRow = search(batch, "batchId", slotRows[k]["batchId"]);
						batchName = "" + batchRow["batchName"];
						//alert("batchName = " + batchName + " batchId = " + slotRows[k]["batchId"]);
					}
					var position = getPosition(i, j, slotRows[k], subjectRow["eachSlot"]);
					if(position == null)
						continue;
					//var slottable = document.getElementById("slottable"+ i + j + position);
					var slottable = document.getElementById("slottable" + makeIdFromIJK(i,  j, position));
					if(slottable == null) {
						alert("ERROR. i: " + i + "slot " + j + "k = " + k + " position = " + position + " got slottabble  null. ERROR");
						continue;
					}
 					// Note: inside i=days * j=NoOfSlots loop
					if(batchName == "undefined")
						alert("undefined2");
					slottable.innerHTML =
						"<tr>" +
							"<td colspan=\"" + eachSlot + "\">"+
								//"<div class= \"box\" id = \"box" + i + j + position + "\">"+
								"<div class= \"box\" id = \"box" + makeIdFromIJK(i, j, position) + "\">"+
									"<span class = \"subjectentry\""+
									//"id = \"subject" + i + j + position + "\">" +
									"id = \"subject" + makeIdFromIJK(i, j, position) + "\">" +
										subjectRow["subjectShortName"] + " " +
									"</span>" +
									"<span class = \"batchentry\" " +
									//"id = \"batch" + i + j + position + "\">" +
									"id = \"batch" + makeIdFromIJK(i, j, position) + "\">" +
										batchName +
									"</span>" +
									//"<span id = \"" + i + j + k + "\" " +
									"<span id = \"" + makeIdFromIJK(i, j, k) + "\" " +
									"class=\"delete\" onclick = deleteEntry(this)>" +
										"x" +
									"</span>" +
								"</div>" +
								"<div class = \"animate" + i + "\">" +
									"<div class = \"box\">" +
										//"<span id = \"room" + i + j + position + "\" " +
										"<span id = \"room" + makeIdFromIJK(i, j, position) + "\" " +
										"class = \"roomentry\" >"
												 + roomShortName +
										"</span>" +
										"<span class =\"teacherentry\" " +
										//"id = \"teacher" + i + j + position + "\">" +
										"id = \"teacher" + makeIdFromIJK(i, j, position) + "\">" +
												teacherShortName +
										"</span>" +
										"<span class =\"classentry\" " +
										//"id = \"class" + i + j + position + "\">" +
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
							// ABHIJIT document.getElementById("cell" + i + (j + p) + position).style.display = "none";
							document.getElementById("cell" + makeIdFromIJK(i, j + p, position)).style.display = "none";
						}
						// ABHIJIT document.getElementById("cell" + i + j + position).setAttribute("colspan", eachSlot);
						document.getElementById("cell" + makeIdFromIJK(i, j, position)).setAttribute("colspan", eachSlot);
					}
				}
				if(batches !== "0" && type == "class") {
					var position = getPosition(i, j, null, 1);
					//document.getElementById("cell" + i + j + k).style.borderTop = "2px solid black";
					if(position == null) {
						alert("ERROR: batches true, on class Page, got positionn null ");
						continue;
					}
					// ABHIJIT slottable = document.getElementById("slottable" + i + j + position);
					slottable = document.getElementById("slottable" + makeIdFromIJK(i, j, position));
					//console.log("slottable" + i + j + k);
					slottable.innerHTML =
					"<tr>" +
						"<td>" + getEligibleSubjects(i, j, position) + "</td>" +
					"</tr>" +
					"<tr>" +
						"<td>" +
							//"<select id=\"batch" + i + j + position + "\" style=\"display:none;\" " +
							"<select id=\"batch" + makeIdFromIJK(i, j, position) + "\" style=\"display:none;\" " +
							"onchange=\"batchSelected(this)\"/>" +
						"</td>" +
					"</tr>" +
					"<tr>" +
						"<td>" +
							//"<select id=\"teacher" + i + j + position + "\" style=\"display:none;\"/>" +
							"<select id=\"teacher" + makeIdFromIJK(i, j, position) + "\" style=\"display:none;\"/>" +
						"</td>" +
					"</tr>" +
					"<tr>" +
						"<td>" +
							//"<select id=\"class" + i + j + position + "\" style=\"display:none;\"" +
							"<select id=\"class" + makeIdFromIJK(i, j, position) + "\" style=\"display:none;\"" +
							"onchange=\"classSelected(this)\"/>" +
						"</td>" +
					"</tr>" +
					"<tr>" +
						"<td>" +
							//"<select id=\"room" + i + j + position + "\" " + "style=\"display:none;\" />" +
							"<select id=\"room" + makeIdFromIJK(i, j, position) + "\" " + "style=\"display:none;\" />" +
							"Done" +
							//"<input id= \"checkbox" + i + j + position + "\" class=\"toggle\"" + " type=checkbox" +
							"<input id= \"checkbox" + makeIdFromIJK(i, j, position) + "\" class=\"toggle\"" + " type=checkbox" +
							//" value = \"" + i + j + position + "\"style=\" display:none;\"" +
							" value = \"" + makeIdFromIJK(i, j, position) + "\"style=\" display:none;\"" +
							" onclick=roomSelected(this)>" +
						"</td>" +
					"</tr>";
				}
				/* refers to dayname td*/
				var rowspan = document.getElementById("" + i).getAttribute("rowspan"); 
				if(rowspan == null)
					rowspan = "" + 1;
				if(parseInt(rowspan) <= slotRows.length && type == "class") {
					document.getElementById("" + i).setAttribute("rowspan", 
						(slotRows.length + parseInt(batches)));
				}
			}
			else {
				var k = getPosition(i, j, null, 1);
				// ABHIJIT slottable = document.getElementById("slottable" + i + j + k);
				slottable = document.getElementById("slottable" + makeIdFromIJK(i, j, k));
				if(slottable == null) {
					alert("ERROR: slottable null, i = " + i + " j = " + j + " k = " + k);
					continue;
				}
				// Note: inside i=days * j=NoOfSlots loop, batches !=0
				slottable.innerHTML =
					"<tr>" +
						"<td>" +
							getEligibleSubjects(i, j, k) +
						"</td>" +
					"</tr>" +
					"<tr>" +
						"<td>" +
							//"<select id=\"batch" + i + j + k + "\"" +
							"<select id=\"batch" + makeIdFromIJK(i, j, k) + "\"" +
								"onchange=\"batchSelected(this)\"" +
								"style=\"display:none;\"/>" +
						"</td>" +
					"</tr>" +
					"<tr>" +
						"<td>" +
							//"<select id=\"teacher" + i + j + k + "\"" +
							"<select id=\"teacher" + makeIdFromIJK(i, j, k) + "\"" +
								"style=\"display:none;\"/>" +
						"</td>" +
					"</tr>" +
					"<tr>" +
						"<td>" +
							//"<select id=\"class" + i + j + k + "\"" +
							"<select id=\"class" + makeIdFromIJK(i, j, k) + "\"" +
								"onchange=\"classSelected(this)\" " +
								"style=\"display:none;\"/>" +
						"</td>" +
					"</tr>" +
					"<tr>" +
						"<td>" +
							//"<select id=\"room" + i + j + k + "\"" +
							"<select id=\"room" + makeIdFromIJK(i, j, k) + "\"" +
								"style=\"display:none;\" />" +
							//"Done<input id= \"checkbox" + i + j + k + "\" class= \"toggle\"" +
							"Done<input id= \"checkbox" + makeIdFromIJK(i, j, k) + "\" class= \"toggle\"" +
							"type=checkbox" +
							//" value = \"" + i + j + k + "\" style=\"display:none;\" onchange=roomSelected(this) >" +
							" value = \"" + makeIdFromIJK(i, j, k) + "\" style=\"display:none;\" onchange=roomSelected(this) >" +
						"</td>" +
					"</tr>";
			}
		}
	}
	for(var i = 1; i <= 6; i++) {/*hiding extra part initially*/
		$(".animate" + i).hide();
	}

}

function classChange(createNewTable){
	var index = document.getElementById("class-menu").selectedIndex; /*Setting the select tag*/
	var classShortName = document.getElementById("class-menu").options[index].text;
	type = "class";
	id = classShortName;
	document.getElementById("teacher-menu").selectedIndex = "-1";
	document.getElementById("room-menu").selectedIndex = "-1";
	//document.getElementById("subject-menu").selectedIndex = "-1";
	document.getElementById("batch-menu").selectedIndex = "-1";
	getSupportObject();//fills supportObject correctly depending on type and id;
	/*Filling the table*/
	fillTable2(createNewTable);

}
function snapshotChange() {
	var index = document.getElementById("fetch-snapshot-menu").selectedIndex;
	var snapshotName = document.getElementById("fetch-snapshot-menu").options[index].text;
	if(snapshotName == currentSnapshotName)
		return;
	if(dirtyTimeTable) {
			save = confirm("Timetable Modified. Your changes will be lost if not saved. Save current timeTable?");
			if(save == "yes")
				jsSaveSnapshot();
	}
	currentSnapshotName = snapshotName;
	currentSnapshotId = search(snapshot, "snapshotName", currentSnapshotName)["snapshotId"];
	loadNewSnapshot();
	document.getElementById("fetch-snapshot-menu").selectedIndex = index;
	dirtyTimeTable = 0;
	fillTable2(false);
}

function roomChange(createNewTable){
	document.getElementById("teacher-menu").selectedIndex = "-1";
	//document.getElementById("subject-menu").selectedIndex = "-1";
	document.getElementById("class-menu").selectedIndex = "-1";
	document.getElementById("batch-menu").selectedIndex = "-1";
	var index = document.getElementById("room-menu").selectedIndex; /*Setting the select tag*/
	var roomShortName = document.getElementById("room-menu").options[index].text;
	type = "room";
	id = roomShortName;
	getSupportObject();//fills supportObject correctly depending on type and id;
	/*Filling the table*/
	fillTable2(createNewTable);
}

function batchChange(createNewTable){
	document.getElementById("teacher-menu").selectedIndex = "-1";
	document.getElementById("room-menu").selectedIndex = "-1";
	document.getElementById("class-menu").selectedIndex = "-1";
	//document.getElementById("subject-menu").selectedIndex = "-1";
	var index = document.getElementById("batch-menu").selectedIndex; /*Setting the select tag*/
	var batchName = document.getElementById("batch-menu").options[index].text;
	type = "batch";
	id = batchName;
	getSupportObject();//fills supportObject correctly depending on type and id;
	/*Filling the table*/
	fillTable2(createNewTable);
}

function teacherChange(createNewTable){
	var index = document.getElementById("teacher-menu").selectedIndex; /*Setting the select tag*/
	var teacherShortName = document.getElementById("teacher-menu").options[index].text;
	type = "teacher";
	id = teacherShortName;
	document.getElementById("room-menu").selectedIndex = "-1";
	document.getElementById("class-menu").selectedIndex = "-1";
	document.getElementById("batch-menu").selectedIndex = "-1";
	getSupportObject();//fills supportObject correctly depending on type and id;
	/*Filling the table*/
	fillTable2(createNewTable);
}
function sortSelect(selElem) {
    var tmpAry = new Array();
    for (var i=0;i<selElem.options.length;i++) {
        tmpAry[i] = new Array();
        tmpAry[i][0] = selElem.options[i].text;
        tmpAry[i][1] = selElem.options[i].value;
    }
    tmpAry.sort();
    while (selElem.options.length > 0) {
        selElem.options[0] = null;
    }
    for (var i=0;i<tmpAry.length;i++) {
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
	//sortSelect(selectTag);
	selectTag.setAttribute("onchange", "teacherChange(true)");
	sortSelect(selectTag);
	document.getElementById("teacher-menu").selectedIndex = -1; /*Setting the select tag*/
	//$("#teacher-menu").select2();
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
	document.getElementById("class-menu").selectedIndex = -1; /*Setting the select tag*/
	//$("#class-menu").select2();
	//sortSelect(selectTag);
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
	//sortSelect(selectTag);
	selectTag.setAttribute("onchange", "batchChange(true)");
	sortSelect(selectTag);
	document.getElementById("batch-menu").selectedIndex = -1; /*Setting the select tag*/
	//$("#batch-menu").select2();
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
	//sortSelect(selectTag);
	selectTag.setAttribute("onchange", "roomChange(true)");
	sortSelect(selectTag);
	document.getElementById("room-menu").selectedIndex = -1; /*Setting the select tag*/
	//$("#room-menu").select2();
}
function loadSelectMenus() {
	if(room.length > 0) {
		$("#room-menu").css("display", "block");
		loadRoomMenu();
	}
	else {
		$("#teacher-menu").css("display", "none");
		$("#class-menu").css("display", "none");
		$("#batch-menu").css("display", "none");
		$("#room-menu").css("display", "none"); 
		return;
	}
	if(teacher.length > 0) {
		$("#teacher-menu").css("display", "block");
		//$("#teacher-menu").setAttribute("disabled", "false");
		loadTeacherMenu();
	}
	if(classTable.length > 0) {
		$("#class-menu").css("display", "block");
		loadClassMenu();
	}
	if(batch.length > 0) {
		$("#batch-menu").css("display", "block");
		loadBatchMenu();
	}
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
	//alert(JSON.stringify(timeTable));
	/* If some table was already displayed, then type and id globals will be set 
	 * and this call will redisplay that table. Else, it will just return
	 */
	fillTable2(true);
	/* Settings for saving the snapshot */
	return true;
}
/* Load all tables, including Dept, Config, Snapshot and Initialize
 * the display timeTable. Load default Snapshot
 */
function load() {
	var i;
	if(getDeptConfigSnapshot() === false) {
		alert("load(): Loading of Dept/Config/Snapshot Tables Failed. Check your Error Logs");
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
	return res;
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
	//sortSelect(selectTag);
}
function jsSaveNewSnapshot() {
	var newSnapshotName = prompt("Enter snapshot Name","snapshot");
	if(newSnapshotName != null) {
		var xhttp;
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				//alert("snapshot response: " + this.responseText);
				alert(this.responseText);
				response = JSON.parse(this.responseText);
				if(response["Success"] == "True") {
					alert("snapshot " + newSnapshotName + " Saved. Press OK to continue");
					document.getElementById("saveNewSnapshot").value = "Save New Snapshot"
					document.getElementById("saveNewSnapshot").disabled = false;
					// JS variables are pass by vale, so snapshot can be changed here only
					snapshot = getSnapshotTable().snapshot;
					currentSnapshotName = newSnapshotName;
					currentSnapshotId = response["snapshotId"];
					//getDataTables();
					//getTimetable(newSnapshotName);
					//loadSnapshotMenu(newSnapshotName);
					loadNewSnapshot();
					//fillTable2(true);
				} else{
					alert("Saving New Snapshot Failed. Error: " + response["Error"]);
					loadSnapshotMenu(currentSnapshotName);
					document.getElementById("saveNewSnapshot").value = "Save New Snapshot";
					document.getElementById("saveNewSnapshot").disabled = false;
				}
			}
		}
		document.getElementById("saveNewSnapshot").value = "Saving New snapshot ...wait";
		document.getElementById("saveNewSnapshot").disabled = true;
		xhttp.open("POST", "timetable.php", true); // asynchronous
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("reqType=saveNewSnapshot&newSnapshotName=" + newSnapshotName + "&currentSnapshotName=" + currentSnapshotName +
					"&configId=" + currentConfigId + "&ttData=" + JSON.stringify(timeTable) +
					"&feData=" + JSON.stringify(fixedEntry));
	}
}
function jsSaveSnapshot() {
	if(currentSnapshotName != null) {
		var xhttp;
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				response = JSON.parse(this.responseText);
				if(response["Success"] == "True") {
					//alert("snapshot response: " + this.responseText);
					alert("snapshot " + currentSnapshotName + " Saved. Press OK to continue");
					document.getElementById("saveSnapshot").value = "Save snapshot";
					document.getElementById("saveSnapshot").disabled = false;
					loadSnapshotMenu(currentSnapshotName);
				} else {
					alert("Saving snapshot failed. Error = " + response["Error"]);
					document.getElementById("saveSnapshot").value = "Save snapshot";
					document.getElementById("saveSnapshot").disabled = false;
				}
			}
		}
		xhttp.open("POST", "timetable.php", true); // asynchronous
		document.getElementById("saveSnapshot").value = "Saving snapshot ...wait";
		document.getElementById("saveSnapshot").disabled = true;
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("reqType=saveSnapshot&snapshotName=" + currentSnapshotName + "&ttData=" + 
				JSON.stringify(timeTable) + "&feData=" + JSON.stringify(fixedEntry));
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
window.onload = load;

var selectedCell ;
var prevBorder;
var copyCell;
var timeTable, teacher, dept, classTable, batch, batchCanOverlap, currentSnapshotId, classRoom, subjectRoom, batchRoom; 
var room, subject, config, batchClass, subjectBatchTeacher, subjectClassTeacher, snapshot;
var database;
var configId = 1;
var type = "class";
var id = "SYBT-CE";
var daysName = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
var enabledRows = [];
var helperTable = [];
var supportObject;
var dirtyTimeTable = 0;
var dragSrcEl = null;
var srcI;
var srcSlotEntry;

function dragStartHandler(e) {
	e.target.style.opacity = '0.4';
	dragSrcEl = e.target;
	var i = parseInt(e.target.id.substring(9, 10));
	var j = parseInt(e.target.id.substring(10, e.target.id.length - 1));
	var k = parseInt(e.target.id.substring(e.target.id.length - 1, e.target.id.length)); 
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
function checkValidity(i, j, source, checkMaxEntry) {
	var subjectRow = search(subject, "subjectId", source["subjectId"]);
	var bco = searchMultipleRows(batchCanOverlap, "batchId", source["batchId"]);
	if(checkMaxEntry) {
		var len;
		var subjEntry = searchMultipleRows(timeTable, "classId", source["classId"], 
				"subjectId", subjectRow["subjectId"], "snapshotId", currentSnapshotId);
		if(subjEntry == -1)
			len = 0;
		else
			len = subjEntry.length/subjectRow["eachSlot"];

		if(len >= subjectRow["nSlots"]) {
			alert("Operation Not Possible\nReason: Maximum entry of Subject for the class is FULL");
			return false;
		}
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
			temp1[r] = search(timeTable, "day", i, "slotNo", (j + r),//<==This needs to be changed
					 "subjectId", destSubjectRow["subjectId"], "classId", destSlotEntry["classId"]);
			temp1[r]["day"] = "-1";/*equivalent to removing*/
			temp1[r]["slotNo"] = "-1";
		}
		var valid1 = checkValidity(i, j, srcSlotEntry, false);
		var valid2= false;
		var slotNo = parseInt(srcSlotEntry["slotNo"]);
		//destn valid in source
		if(valid1) {
			
			for(var r = 0; r < srcSubjectRow["eachSlot"]; r++) {/*Remove previous entry*/
				temp2[r] = search(timeTable, "day", srcI,//<==This needs to be changed
					 "slotNo", (slotNo + r),
					 "subjectId", srcSubjectRow["subjectId"], "classId", srcSlotEntry["classId"]);
				temp2[r]["day"] = "-1";
				temp2[r]["slotNo"] = "-1";				
			}
			valid2 = checkValidity(parseInt(srcSlotEntry["day"]), slotNo,
						 destSlotEntry, false);
			
		}
		if(!valid2 || !valid1) {
			if(temp2.length !== 0) {/*If operation fails*/
				for(var r = 0; r < srcSubjectRow["eachSlot"]; r++) {
					//timeTable.push(temp2.pop());
					temp2[r]["day"] = srcI;
					temp2[r]["slotNo"] = ""+(slotNo + r);
				}
			}
			for(var r = 0; r < destSubjectRow["eachSlot"]; r++) {
				temp1[r]["day"] = ""+i;
				temp1[r]["slotNo"] = ""+(j + r);
			}
		}
		if(valid1 && valid2) {
			var r;/*swap day n slotNo*/
			for(r = 0; r < destSubjectRow["eachSlot"]; r++) {
				temp1[r]["day"] = srcI;
				temp1[r]["slotNo"] = ""+(slotNo + r);
			}
			for(r = 0; r < srcSubjectRow["eachSlot"]; r++) {
				temp2[r]["day"] = ""+i;
				temp2[r]["slotNo"] = ""+(j + r);
			}
			
		}
		else {
			dragSrcEl.style.opacity = 1;
		}
	}
	else if(destSlotEntry === null || destSlotEntry == 0) {
		//alert("Came here");
		var valid = checkValidity(i, j, srcSlotEntry, true);
		if(valid) {
			//srcSlotEntry["day"] = ""+i;
			//srcSlotEntry["slotNo"] = ""+j;
			for(var r = 0; r < srcSubjectRow["eachSlot"]; r++) {
				timeTable.push(new createTimeTableEntry(i, (j + r), srcSlotEntry["roomId"],
					srcSlotEntry["classId"], srcSlotEntry["subjectId"], srcSlotEntry["teacherId"],
					srcSlotEntry["batchId"], srcSlotEntry["configId"], srcSlotEntry["snapshotId"], 
					srcSlotEntry["isFixed"]));
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

function search(table) {/*Searches and return the row, Otherwise returns -1*/
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
	}
}

function insertAfter(elem, refElem) {
	var parent = refElem.parentNode;
	var next = refElem.nextSibling;
	if (next) {
		return parent.insertBefore(elem, next);
	}
	else {
		return parent.appendChild(elem);
	}
}

function selected(element) {
	if(typeof selectedCell != "undefined") {
		selectedCell.style.border = prevBorder;
	}
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
function getTimetable(snapshotName) {/*Loads data from server asynchronously*/
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			//alert("getTimeTable: " + this.responseText);
			var db = JSON.parse(this.responseText);
			timeTable = db.timeTable;
			if(typeof timeTable == "undefined") {
				timeTable = [];
			}
			//console.log(timeTable);
		}
	};
	xhttp.open("POST", "timetable.php", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=getTimetable&snapshotName=\""+snapshotName+"\"");
	currSnapshotName = snapshotName; 
	//classChange(true);
}
function getOneTable(tName, asynchronousOrNot) {/*Loads data from server asynchronously*/
	var xhttp;
	xhttp = new XMLHttpRequest();
	if(asynchronousOrNot == true) {
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				//alert("getOneTable: " + this.responseText);
				var db = JSON.parse(this.responseText);
				return db; 
			}
		};
	}
	xhttp.open("POST", "timetable.php", asynchronousOrNot);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=getOneTable&tableName="+tName);
	if(asynchronousOrNot == false) {
		var db = JSON.parse(xhttp.responseText);
		return db;  /* JS variables are pass by value */
	}
}


function getAllData() {/*Loads data from server asynchronously*/
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			database = JSON.parse(this.responseText);

			teacher = database.teacher;
			if(typeof teacher == "undefined")
				alert("Teacher's information not found");
			teacher.sort(function(a, b) {
				var x = a.teacherShortName.toLowerCase();
				var y = b.teacherShortName.toLowerCase();
				if(x < y)
					return -1;
				if(x > y)
					return 1;
				return 0;
			});

			dept = database.dept;
			if(typeof dept == "undefined")
				alert("Department's information not found");
			dept.sort(function(a, b) {
				var x = a.deptShortName.toLowerCase();
				var y = b.deptShortName.toLowerCase();
				if(x < y)
					return -1;
				if(x > y)
					return 1;
				return 0;
			});


			classTable = database.class;
			if(typeof classTable == "undefined")
				alert("Class's information not found");
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
			if(typeof batch == "undefined")
				alert("Batch's information not found");
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
			if(typeof batchCanOverlap == "undefined")
				alert("Batch Can Overlap's information not found");

			room = database.room;
			if(typeof room == "undefined")
				alert("Room's information not found");
			room.sort(function(a, b) {
				var x = a.roomShortName.toLowerCase();
				var y = b.roomShortName.toLowerCase();
				if(x < y)
					return -1;
				if(x > y)
					return 1;
				return 0;
			});

			subject = database.subject;
			if(typeof subject == "undefined")
				alert("Subject's information not found");
			subject.sort(function(a, b) {
				var x = a.subjectShortName.toLowerCase();
				var y = b.subjectShortName.toLowerCase();
				if(x < y)
					return -1;
				if(x > y)
					return 1;
				return 0;
			});

			config = database.config;
			if(typeof config == "undefined")
				alert("Configuration's information not found");

			batchClass = database.batchClass;
			if(typeof batchClass == "undefined")
				alert("Batch and class relation's information not found");

			subjectBatchTeacher = database.subjectBatchTeacher; // subjectBatch
			if(typeof subjectBatchTeacher == "undefined")
				alert("Batch, subject and Teacher relation's information not found");

			subjectClassTeacher = database.subjectClassTeacher;
			if(typeof subjectClassTeacher == "undefined")
				alert("Class, subject and Teachers relation's information not found");

			snapshot = database.snapshot;
			if(typeof snapshot == "undefined")
				alert("snapshot's information not found");
					
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
		}
	};
	xhttp.open("POST", "timetable.php", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=getAllData");
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
	helperTable =  new Array(row).fill(initial_value).map(row => new Array(cols).fill(initial_value).
						map(cols => new Array(slottableCount).fill(initial_value)));
	
}

function createTable(days, nSlots, slotTablePerDay, startTime, timePerSlot) {
	var table = document.createElement("TABLE");
	var i, j, k, tr, td, text;
	table.setAttribute("class", "timeTable");
	table.setAttribute("border", "3px solid black");
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
		text =  text + " to<br>" + displayTime(start);
		td.innerHTML = text;
		tr.appendChild(td);
	}
	table.appendChild(tr);
	for(i = 1; i <= days; i++) {/*Daywise*/
		for(k = 0; k < slotTablePerDay; k++) {/*slottable row per day*/
			tr = document.createElement("tr");
			tr.setAttribute("id", "row"+i+k);
			tr.setAttribute("class", "row"+i);
			if(k == 0) {/*slottable per day*/
				td = document.createElement("td");
				td.setAttribute("id", ""+i);
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
				td.setAttribute("id", "cell"+i+j+k);
				td.setAttribute("class", "cell");
				td.setAttribute("onclick", "selected(this)");
				var div = document.createElement("div");
				div.setAttribute("class", "div"+i+j);
				var slottable = document.createElement("table");
				slottable.setAttribute("id", "slottable"+i+j+k);
				slottable.setAttribute("class", "slottable"+k);
				td.setAttribute("ondragenter", "dragEnterHandler(event)");
				slottable.setAttribute("ondragover", "dragOverHandler(event)");
				td.setAttribute("ondragleave", "dragLeaveHandler(event)");
				slottable.setAttribute("ondrop", "dropHandler(event)");
				slottable.setAttribute("ondragend", "dragEndHandler(event)");
				slottable.style.width = "100%";
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
		for(var j = 0; j < table.length - i -1 ; j++) {
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
			teacherId, batchId, configId, snapshotId, isFixed) {
	this.day = "" +day;
	this.slotNo = ""+slotNo;
	this.roomId = ""+roomId;
	this.classId = ""+classId;
	this.subjectId = "" +subjectId;
	this.teacherId = ""+teacherId;
	this.batchId = ""+batchId;
	this.configId = ""+configId;
	this.isFixed = ""+isFixed;
	this.snapshotId = ""+snapshotId;
	if(timeTable.length == 0)
		this.ttId =  1;
	else
		this.ttId = ""+(parseInt(timeTable[timeTable.length - 1]["ttId"]) + 1);
	dirtyTimeTable = 1;
}

function createClassRoomEntry(classId, roomId) {
	this.classId = ""+classId;
	this.roomId = ""+roomId;
	if(classRoom.length == 0) 
		this.crId = 1;
	else
		this.crId = ""+(parseInt(classRoom[classRoom.length - 1]["crId"]) + 1);
}

function createBatchRoomEntry(batchId, roomId) {
	this.batchId = ""+batchId;
	this.roomId = ""+roomId;
	if(batchRoom.length == 0) 
		this.brId = 1;
	else
		this.brId = ""+(parseInt(batchRoom[batchRoom.length - 1]["brId"]) + 1);
}

function createSubjectRoomEntry(subjectId, roomId) {
	this.subjectId = ""+subjectId;
	this.roomId = ""+roomId;
	if(subjectRoom.length == 0) 
		this.srId = 1;
	else
		this.srId = ""+(parseInt(subjectRoom[subjectRoom.length - 1]["srId"]) + 1);
}
function roomSelected(selecttag) {
	
	var Id = selecttag.getAttribute("id");
	Id = Id.substring(8, Id.length);
	iid = Id.substring(0, 1);
	jid = Id.substring(1, Id.length -1);
	kid = Id.substring(Id.length - 1,Id.length);
	var roomShortName = document.getElementById("room"+Id).
				options[document.getElementById("room"+Id).selectedIndex].text; 
	if(roomShortName == "--Room--")
		return;
	var roomRow = search(room, "roomShortName", roomShortName);
	
	var batchId = "1";
	var classId;
	var teacherId;
	var temp = document.getElementById("subject"+iid+jid+kid);
	var subjectRow = search(subject, "subjectShortName", temp.innerHTML);/*subject*/
	if(subjectRow["batches"] == "1") {/*batch*/
		temp = document.getElementById("batch"+iid+jid+kid);
		var batchRow = search(batch, "batchName", temp.innerHTML);
		batchId =  batchRow["batchId"];
				
	}
	if(type == "teacher") {
		teacherId = supportObject["teacherId"];
	}
	else {
		teacherId = search(teacher, "teacherShortName", 
				document.getElementById("teacher"+iid+jid+kid).innerHTML)["teacherId"];/*teacher*/
	}
	if(type == "class") {
		classId = supportObject["classId"];
	}
	else {
		classId = search(classTable, "classShortName", 
					document.getElementById("class"+iid+jid+kid).innerHTML)["classId"];
	}
	if(type == "batch") {
		batchId = supportObject["batchId"];
	}
	for(var i = 0; i < parseInt(subjectRow["eachSlot"]); i++) {
		var newEntry = new createTimeTableEntry(iid, (parseInt(jid) + i), 
							roomRow["roomId"], classId, 
							subjectRow["subjectId"], teacherId, 
							batchId, configId, currentSnapshotId, 0);
		timeTable.push(newEntry);
		console.log("roomEntry: newEntry = " + JSON.stringify(newEntry));
	}
	var crEntry = new createClassRoomEntry(classId, roomRow["roomId"]);
	var brEntry = new createBatchRoomEntry(batchId, roomRow["roomId"]);
	var srEntry = new createSubjectRoomEntry(subjectRow["subjectId"], roomRow["roomId"]);
	//alert(JSON.stringify(crEntry)+"\n"+JSON.stringify(brEntry));
	if(search(classRoom, "classId", classId) === -1)
		classRoom.push(crEntry);

	if(search(batchRoom, "batchId", batchId) === -1)
		batchRoom.push(brEntry);

	if(search(subjectRoom, "subjectId", subjectRow["subjectId"]) === -1)
		subjectRoom.push(srEntry);
	//alert(JSON.stringify(classRoom)+"\n"+JSON.stringify(batchRoom)+"\n"+JSON.stringify(subjectRoom)+"\n");
	fillTable2(false);
}

function getEligibleBatches(i, j, k, subjectRow) {
	console.log("getEligibleBatches: i = " + i + " j = " + j + " k = " + k + 
				"subject  = " + subjectRow["subjectShortName"]);
	var optionString = "<option value=\"NOT_SELECTED\">--Batch--</option>";
	var eligibleBatches = [];
	var configRow = search(config, "configId", configId);
	/*Get batches of class and for that subject*/
	var sbtRows;
	if(type == "class") {
		sbtRows = searchMultipleRows(subjectBatchTeacher, "subjectId", subjectRow["subjectId"]);
		var bcRows = searchMultipleRows(batchClass, "classId", supportObject["classId"]);
		for(var n = 0; n < sbtRows.length; n++) {
			if(search(bcRows, "batchId", sbtRows[n]["batchId"])  === -1) {
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
		console.log("getEligibleBatches Looping y:" +  y + " " + JSON.stringify(sbtRows[y]));
		var currTeacher = search(teacher, "teacherId", sbtRows[y]["teacherId"]);
		var maxEntriesForSubject = subjectRow["nSlots"];
		
		//c = # entries in tt for this batch-subject
		var existingEntries = searchMultipleRows(timeTable,"subjectId", subjectRow["subjectId"], 
							"batchId", sbtRows[y]["batchId"]);
		if(existingEntries !== -1) {
			lenExistingEntries = (existingEntries.length / subjectRow["eachSlot"]);/*<==Changed this*/
		}
		else {
			lenExistingEntries = 0;
		}
				
		//Checking whether there is time left for subject(1) , batch
				
		if(lenExistingEntries == maxEntriesForSubject) {
			continue outerloop;
		// Done: following needs a fix for batchable subjects.
		} else if(lenExistingEntries > maxEntriesForSubject) {
			alert("More than "+maxEntriesForSubject+" Entries for Subject "+subjectRow["subjectShortName"]);
		}
		/*Maxhr for teacher exceeded or not(1)*/
		var allocatedTimeForTeacher = searchMultipleRows(timeTable, "teacherId", 
								currTeacher["teacherId"]);
		if(allocatedTimeForTeacher !== -1) {
			 allocatedTimeForTeacher =  allocatedTimeForTeacher.length;
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
								"configId", configId, "snapshotId", currentSnapshotId);
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
			var found = search(timeTable, "configId", configId,
						"day", i, "slotNo", ""+(parseInt(j) + z), 
						"roomId", roomRow["roomId"],  "snapshotId", currentSnapshotId);
			if(found !== -1) {/*There are other classes in this room*/
				valid = 0;
				break;
			}
		}
		if(valid == 1) {
			optionString += "<option value = \""+roomRow["roomShortName"]+"\" selected=\"selected\">"+
						roomRow["roomShortName"] +
					"</option>";
		}
	}
	
	for(var y = 0; y < room.length; y++) {
	//alert(parseInt(room[i]["roomCount"]) +" ,"+capacity);
		var valid = 1;
		for(var z =0; z < eachSlot; z++) {
			var found = search(timeTable, "configId", configId,
						"day", i, "slotNo", ""+(parseInt(j) + z), 
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
		optionString += "<option value = \""+ room[i]["roomShortName"] +"\">"+ 
					room[y]["roomShortName"] + 
				"</option>"; 
				//}
	}
		
	return optionString;
}

function classSelected(selecttag) {/*Final stage for room type*/
	var classShortName = selecttag.options[selecttag.selectedIndex].text;
	var Id = selecttag.getAttribute("id");
	Id = Id.substring(5, Id.length);
	iid = Id.substring(0, 1);
	jid = Id.substring(1, Id.length -1);
	kid = Id.substring(Id.length - 1,Id.length);
	var classRow = search(classTable, "classShortName", classShortName);
	var subjectShortName = document.getElementById("subject"+iid+jid+kid).innerHTML;
	//alert(subjectShortName);
	var subjectRow = search(subject, "subjectShortName", subjectShortName);
	var teacherRow = search(subjectClassTeacher, "subjectId", subjectRow["subjectId"], 
				"classId", classRow["classId"]);
	for(var i = 0; i < parseInt(subjectRow["eachSlot"]); i++) {
		var newEntry = new createTimeTableEntry(iid, (parseInt(jid) + i), 
							supportObject["roomId"], classRow["classId"], 
							subjectRow["subjectId"], teacherRow["teacherId"], 
							1,configId, currentSnapshotId, 0);
		timeTable.push(newEntry);
		console.log("roomEntry: newEntry = " + JSON.stringify(newEntry));
	}
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
			console.log("getEligibleClass: maxHrs prob"+classId);
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
		optionString += "<option value= \""+classlist[r]["classShortName"]+"\">"+
					classlist[r]["classShortName"] +
				"</option>";
	}
	return optionString;
}

function batchSelected(selecttag) {
	var batchName = selecttag.options[selecttag.selectedIndex].text;

	var Id = selecttag.getAttribute("id");
	Id = Id.substring(5, Id.length);
	iid = Id.substring(0, 1);
	jid = Id.substring(1, Id.length -1);
	kid = Id.substring(Id.length - 1,Id.length);
	var batchRow = search(batch, "batchName", batchName);
	var extraInfo = "";/*When additional info is discovered*/
	switch(type) {
		case "class" :
		case "teacher" :
			var roomFound, optionString = "";
			var subjectShortName = document.getElementById("subject"+iid+jid+kid).innerHTML;
			var subjectRow = search(subject, "subjectShortName", subjectShortName);
			var roomSelect = document.getElementById("room"+Id);
			roomSelect.style.display = "";
			document.getElementById("checkbox"+Id).style.display = "";
			var capacity = parseInt(batchRow["batchCount"]);
			if(type == "class") {
				var teacherRow = search(subjectBatchTeacher, "subjectId", subjectRow["subjectId"], 
							"batchId", batchRow["batchId"]);
				//alert(JSON.stringify(teacherRow));
				teacherRow = search(teacher, "teacherId", teacherRow["teacherId"]);
				extraInfo += "<div id=\"teacher"+iid+jid+kid+"\" class=\"box\">"+
							teacherRow["teacherShortName"]+
						"</div>";
				
			}
			else if(type == "teacher"){
				var classShortName = search(classTable, "classId", 
							search(batchClass, "batchId", batchRow["batchId"])["classId"])
									["classShortName"];
				extraInfo += "<div id=\"class"+iid+jid+kid+"\" class=\"box\">"+
							classShortName +
						"</div>";
				
			}
			roomFound = search(subjectRoom, "subjectId", subjectRow["subjectId"]);
			if(roomFound == -1) {
				roomFound = search(batchRoom, "batchId", batchRow["batchId"]);
			}
			
			roomSelect.innerHTML =  getEligibleRoom(parseInt(iid), parseInt(jid), parseInt(kid),
								 capacity, subjectRow, roomFound);/*room option*/
			break;	
		case "room" :/*Final stage for room type*/
			var subjectShortName = document.getElementById("subject"+iid+jid+kid).innerHTML;
			var subjectRow = search(subject, "subjectShortName", subjectShortName);
			var teacherId = search(subjectBatchTeacher, "subjectId", subjectRow["subjectId"], 
						"batchId", batchRow["batchId"])["teacherId"];
			var classId = search(batchClass, "batchId", batchRow["batchId"])["classId"];
			for(var i = 0; i < subjectRow["eachSlot"]; i++) {
				var newEntry = new createTimeTableEntry(iid, (parseInt(jid) + i), 
							supportObject["roomId"], classId, 
							subjectRow["subjectId"], teacherId, 
							batchRow["batchId"],configId, currentSnapshotId, 0);
				timeTable.push(newEntry);
				console.log("roomEntry: newEntry = " + JSON.stringify(newEntry));
			}
			fillTable2(false);
			return;
			break;		
	}
	selecttag.parentElement.innerHTML =	"<div id= \"batch"+ iid+jid+kid+"\"class= \"box\">" 
							+batchName+ 
						"</div>"+extraInfo;
}

function subjectSelected(selecttag) {
	var index = selecttag.selectedIndex;
	var subjectShortName = selecttag.options[index].text;
	
	var Id = selecttag.getAttribute("id");
	Id = Id.substring(7, Id.length);
	iid = Id.substring(0, 1);
	jid = Id.substring(1, Id.length -1);
	kid = Id.substring(Id.length - 1,Id.length);
	var subjectRow = search(subject, "subjectShortName", subjectShortName);
	var batches = subjectRow["batches"];
	var extraInfo = "";/*When additional info is discovered*/
	var roomFound;
	switch(type) {
		case "class" :
		case "teacher" :
				
				if(batches === "0") {/*Normal subject*/
					var roomSelect = document.getElementById("room"+Id);
					roomSelect.style.display = "";
					document.getElementById("checkbox"+Id).style.display = "";
					var capacity = parseInt(supportObject["classCount"]);
					/*Teacher Entry*/
					if(type == "class") {
						var sctEntry = search(subjectClassTeacher, 
										"subjectId", subjectRow["subjectId"],
										"classId", supportObject["classId"]);
						var teacherRow = search(teacher, "teacherId", sctEntry["teacherId"]);
						extraInfo += "<div id=\"teacher"+ iid + jid + kid +
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
						extraInfo += "<div id=\"class"+ iid + jid + kid +
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
					var batchSelect = document.getElementById("batch"+ Id);
					batchSelect.style.display = "";
					batchSelect.innerHTML = getEligibleBatches(parseInt(iid), parseInt(jid), 
												parseInt(kid), subjectRow);/*batch option*/
				}
				break;
		case "batch" :
				var roomSelect = document.getElementById("room"+Id);
				roomSelect.style.display = "";
				document.getElementById("checkbox"+Id).style.display = "";
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
					var classSelect = document.getElementById("class"+ Id);
					classSelect.style.display = "";
					classSelect.innerHTML = getEligibleClass(parseInt(iid), parseInt(jid), 
										parseInt(kid), subjectRow);
				}
				else {
					var batchSelect = document.getElementById("batch"+ Id);
					batchSelect.style.display = "";
					batchSelect.innerHTML = getEligibleBatches(parseInt(iid), parseInt(jid), 
												parseInt(kid), 
												subjectRow);/*batch option*/
				}
				break;
	}
	selecttag.parentElement.innerHTML =""+
		"<div id= \"subject"+ iid +jid + kid + "\"class= \"box\">" + 
			subjectShortName+ 
		"</div>"+
		"<span id = \""+iid+jid+kid+"\" class=\"delete\" "+
				"onclick = fillTable2(false)>"+ "x"+
		"</span>" +extraInfo;
	
}

function getEligibleSubjects(i, j, k) {
	// Check that there is a room available in this slot 
	// Return "NO ROOM otherwise
	/*var r = search(timeTable, "day", i, "slot", j);
	for(var i = 0; i < r.length; i++) {
	}
	if (r.length < 1) 
		return "NO ROOM";   */
	//console.log(i + "," + j);
	var configrow = search(config, "configId", configId);
	var nSlotsPerDay = configrow["nSlots"];
	var select = "<select id= \"subject"+ i + j + k +
				"\" onchange=\"subjectSelected(this)\">"+
				"<option value=\"NOT_SELECTED\">--Subject--"+
				"</option>";
	var subjectsList = [];
	var blist;
	var sbtlist = [];
	var searchOn;
	var sctlist = [];
	//if tt-has i-j'th entry with a non-batchable subject,
		//return "";
	//entriesInThisSlot = searchMultipleRows(timeTable, "day", i, "slotNo", j, "classId", supportObject["classId"]);
	//if(entriesInThisSlot != -1) {
	//		subjectEntry = search(subject, "subjectId", entriesInThisSlot[0]["subjectId"]);
	//		if(subjectEntry["batches"] = "0")
	//			return "";
	//}	
	//sctlist = get-all-subjects-for-this-class from SCT table
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
		case "class":
		case "teacher":
			
			if(type == "class")
				sctlist = searchMultipleRows(subjectClassTeacher, "classId", supportObject["classId"]);
			else if(type == "teacher")
				sctlist = searchMultipleRows(subjectClassTeacher, "teacherId", supportObject["teacherId"]);
			//sbtlist = get-all-batched-subjects-for-this-class from SBT table
			
			if(type == "class") {
				blist = searchMultipleRows(batchClass, "classId", supportObject["classId"]);
				for (var m = 0; m < blist.length; m++) {
					var res = searchMultipleRows(subjectBatchTeacher, "batchId", blist[m]["batchId"]);
					sbtlist = sbtlist.concat(res);
					//if(sbtlist.length > 0)alert("sbtlist =  " + JSON.stringify(sbtlist));
				}
			}
			else if(type == "teacher") {
				sbtlist = searchMultipleRows(subjectBatchTeacher, "teacherId", 
								supportObject["teacherId"]);
			}
			//for sub in sbtlist
			lists = [sctlist, sbtlist];
			//console.log(lists);
			for(l in lists) {
				if(lists[l] === sbtlist) { 
					searchOn = "batchId";
				}
				else {
					searchOn = "classId";
				}
			next :for(var m = 0; m < lists[l].length; m++) {
					var currSubject= search(subject, "subjectId", lists[l][m]["subjectId"]);
					if(subjectsList.indexOf(currSubject) != -1)
						continue;
					var maxEntriesForSubject = currSubject["nSlots"];
				
					//c = # entries in tt for this batch-subject
					var existingEntries = searchMultipleRows(timeTable, 
										"subjectId", currSubject["subjectId"], 
										searchOn, lists[l][m][searchOn]);
					if(existingEntries !== -1) {
						// This is because, for a subject with eachSlot=2, 
						//	we enter two entries in timetable
						lenExistingEntries = (existingEntries.length / currSubject["eachSlot"]);
					}
					else {
						lenExistingEntries = 0;
					}
						//alert("Current: " + JSON.stringify(currSubject));
						//Checking whether there is time left for subject(1)
			
						// TODO: For batches, we need to add the check for batch. 
						//Otherwise one entry for a sub-batch
						// will make the subject disappear.	
					if(lenExistingEntries == maxEntriesForSubject /*&& lists[l] != sbtlist*/) {
						console.log("eligibleSubjects:  maxEntriesFor subject " + 
								currSubject["subjectShortName"] + 
								"class/batch: " + searchOn + " = " + lists[l][m][searchOn]);
							//alert("maxEntriesFor subject equal");
							continue next;
						}
				
					if(lenExistingEntries > maxEntriesForSubject) {
						console.log("eligibleSubjects: More than desired entries for " + 
									currSubject["subjectShortName"] + 
									JSON.stringify(existingEntries) + searchOn);
						continue next;
					}

					if(j + parseInt(currSubject["eachSlot"]) - 1  >= nSlotsPerDay) {
						console.log("Skipping slot "+ j + " for " + currSubject["subjectShortName"] + 
									" on day " + i + " as slot out of day ");
						continue next;
					}
					//t = teacher for this subject-class
					currTeacher = search(teacher, "teacherId", lists[l][m]["teacherId"]);
					/*if(currTeacher === -1){
							alert("Problem");
						}*/
						/*teacher allocated time + time for this subject < maxhrs for teacher*/
					var allocatedTimeForTeacher = searchMultipleRows(timeTable, "teacherId", 
											currTeacher["teacherId"]);
					if(allocatedTimeForTeacher !== -1) {
						 allocatedTimeForTeacher =  allocatedTimeForTeacher.length;
					}
					else {
						 allocatedTimeForTeacher = 0;
					}
					if((allocatedTimeForTeacher + parseInt(currSubject["eachSlot"])) 
								 > parseInt(currTeacher["maxHrs"])) {/*(5)*/
						console.log("getEligibleSubjects: teachers max hr exceeded for " + 
									currTeacher["teacherShortName"]);
							//alert("teachers max hr exceeded");
							continue next;						
						}
						//console.log("day " + i + " slot " + j + " currsubject " + JSON.stringify(currSubject));
						//for k = 0; k < sc->eachSlot; k++
			
						var validSubj = 1;		
						for(var n = 0; n < currSubject["eachSlot"]; n++) {
								/*if(i == 1 && j == 8)
									alert("n:"+n);*/
								if(type == "room") {
									var res = search(timeTable, "day", i,
											"slotNo", j + n,
											"roomId", supportObject["roomId"],
											"snapshotId", currentSnapshotId);
									if(res !== -1)
										continue next;
								}
								var nEntriesForTeacher = search(timeTable, "day", i, "slotNo", j + n,
												 "teacherId", currTeacher["teacherId"],
												 "snapshotId", currentSnapshotId);
								//if t is busy in this slot(i,j)
									//continue(2)
								if(nEntriesForTeacher != -1) {
									console.log("eligibleSubjects: Skipping teacher " 
										+ currTeacher["teacherShortName"] + " as busy");
									validSubj = 0;
									continue next;
								}
								//if non-practical subj(considered) and prac subj is in this slot already
									//continue;
								if(currSubject["batches"] == "0") {
									var currentSlotEntry = search(timeTable, "day", i, "slotNo", j + n,
													"classId", lists[l][m]["classId"],
													 "snapshotId", currentSnapshotId);
									if(currentSlotEntry !== -1) {
										console.log("getEligibleSubject: Batched-subject " + 
													supportObject["classShortName"] +
											 " in slot");
										validSubj = 0;
										continue next;
									}
								}	
								else {
									/*Batch Must be free*/
									//console.log(currSubject);
									var classId = search(batchClass, "batchId", lists[l][m]["batchId"])
													["classId"];
									var currentSlotEntry = search(timeTable, "day", i, "slotNo", j + n,
													"classId", classId,
													"batchId", lists[l][m]["batchId"],
													 "snapshotId", currentSnapshotId);
									
									if(currentSlotEntry !== -1) {
										console.log("getEligibleSubject: " + 
										lists[l][m]["batchShortName"] + " batch not free");
										validSubj = 0;
										//alert(validSubj);
										continue next;
									}
									/*batch subj but in this slot subj for whole class present*/
									currentSlotEntry = search(timeTable, "day", i, "slotNo", (j + n),
													"classId", classId,
													"batchId", 1,  
												"snapshotId", currentSnapshotId);
									//console.log("currSlotEntry:"+currentSlotEntry);
									
									if(currentSlotEntry !== -1) {
										console.log("getEligibleSubject:  " 
										+currSubject["subjectShortName"]+
											 supportObject["classShortName"] 
													+ " subject for whole class");
										validSubj = 0;
										continue next;
									}
								}
						
						
						}
						//console.log("validSubj==================>"+validSubj);
						if(validSubj === 0) {
							continue;
						}
						// subject-batch combination has many repetitions of subject, so need to remove duplicates
						
						subjectsList.push(currSubject);
					}
				}
				break;
		case "batch":
			var classId = search(batchClass, "batchId", supportObject["batchId"])["classId"];
			var sbt = searchMultipleRows(subjectBatchTeacher, "batchId", supportObject["batchId"]);
			var bco	= searchMultipleRows(batchCanOverlap, "batchId", supportObject["batchId"]);
	next_subject : for(var n in sbt) {
				var lenExistingEntries;
				var currSubject = search(subject, "subjectId", sbt[n]["subjectId"]);
				/*MaxHrs exceeded*/
				var maxEntriesForSubject = currSubject["nSlots"];
				var existingEntries = searchMultipleRows(timeTable, 
								"subjectId", currSubject["subjectId"], 
								"batchId", supportObject["batchId"]);
				if(existingEntries !== -1) {
				// This is because, for a subject with eachSlot=2, we enter two entries in timetable
					lenExistingEntries = (existingEntries.length / currSubject["eachSlot"]);
				}
				else {
					lenExistingEntries = 0;
				}
				if(lenExistingEntries >= maxEntriesForSubject) {
					console.log("eligibleSubjects:  maxEntriesFor subject " + currSubject["subjectShortName"]);
					continue next_subject;
				}
				for(var p = 0; p < currSubject["eachSlot"]; p++) {
					var entry = searchMultipleRows(timeTable, "day", i, "slotNo", (j + p), "classId", classId,
								 "snapshotId", currentSnapshotId);
					for(var q in entry) {/*class Subject present in this slot*/
						if(entry[q]["batchId"] == "1") {
							console.log("getEligibleSubject: class Subject Present:"+
									currSubject["subjectName"]);
							continue next_subject;
						}/*batch that cannot be overlapped*/
						if(search(bco, "batchId", supportObject["batchId"],
							 "batchOverlapId", entry[q]["batchId"]) === -1) {
							console.log("getEligibleSubject: batch cannt overlap:"+
									currSubject["subjectName"]);
							continue next_subject;
						}
					}
					entry = search(timeTable, "day", i, "slotNo", (j + p), 
							"teacherId", sbt[n]["teacherId"], "snapshotId", currentSnapshotId);
					if(entry !== -1) {
						console.log("teacher Busy:"+currSubject["subjectName"]);
						continue next_subject;
					}
				}
				subjectsList.push(currSubject);	
			}
			break;
	}
	if(subjectsList.length == 0) {
		return "";
	}
	for(var r in subjectsList) {
		var subj = subjectsList[r]["subjectShortName"];
		select += "<option value =\""+ subj +"\">" + subj + "</option>";		
	}
	select += "</select>";
	return select;
}


/*For deleting an entry from timeTable*/
function deleteEntry(Span) {
	var Id = Span.id;/*Id of "x"*/
	var day = Id.substring(0, 1);
	var SlotNo = Id.substring(1, Id.length -1);
	var slottableNo = Id.substring(Id.length -1, Id.length);
	var subjShortName = document.getElementById("subject"+Id).innerHTML;
	var subjRow = search(subject, "subjectShortName", subjShortName);
	var batchId, classId, teacherId, roomId;
	if(type == "room") {
		roomId = supportObject["roomId"];
	}
	else {
		roomId = search(room, "roomShortName", 
				document.getElementById("room" + Id).innerHTML)["roomId"];
	
	}
	if(type == "teacher") {
		teacherId = supportObject["teacherId"];
	}
	else {
		teacherId = search(teacher, "teacherShortName", 
				document.getElementById("teacher" + Id).innerHTML)["teacherId"];
	
	}
	if(type == "class") {
		classId = supportObject["classId"];
	}
	else {
		classId = search(classTable, "classShortName", 
				document.getElementById("class" + Id).innerHTML)["classId"];
	
	}
	if(type == "batch") {
		batchId = supportObject["batchId"];
	}
	else {
		var batchName = document.getElementById("batch" + Id).innerHTML;
		if(batchName  === "") {
			batchName = "NONE";
		}
		batchId = search(batch, "batchName", batchName)["batchId"];
	}
	
	for(var i = 0; i < subjRow["eachSlot"]; i++) {
		var index = timeTable.indexOf(
					search(timeTable, "day", day, "slotNo", (parseInt(SlotNo) + i), 
					"subjectId", subjRow["subjectId"], "batchId", batchId,
					"classId", classId, "teacherId", teacherId, "roomId", roomId,
					 "snapshotId", currentSnapshotId) );
				
		if(index != -1)
			timeTable.splice(index, 1);/*Delete entry from table*/
	}
	dirtyTimeTable = 1;
	fillTable2(true);
}

/*
for each day
	for each slot
		x = all existing schedules of this class in this slot
		if(x)
			for each entry
				get teachername,roomname,subjectname
				display existing schedule
				hide horizontally next slots of needed
			if(batches)
				make visible outer-rows if needed
				add one more row with select-options
			set rowspan
		else
			add one more row with select-options
hide-animate class cells
*/
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
			var temp = helperTable[i - 1][j + n][k];
			if(temp == null)
				continue;
			if(temp !== 0) {/*means Row Entry is there*/
				if(temp["subjectId"] === subjectId && temp["batchId"] === batchId && temp["classId"] === classId) {
					valid = false;/*this subject was already displayed*/
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
						
		document.getElementById("cell"+i+j+pos).style.borderTop = "2px solid black";
		
	}
	return pos;
}

function fillTable2(createNewTable) {
	var configrow = search(config, "configId", configId);
	var NoOfSlots = configrow["nSlots"];
	var days = 6;
	var slottablePerDay = 1;
	if(type == "class") {
		var row = searchMultipleRows(batchClass, "classId", supportObject["classId"]); /*Depending on the no of batches in a class*/
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
							$(".animate"+id).fadeIn();
						}
						else {
							this.innerHTML = "+";
							$(".animate"+id).fadeOut();
						}
		});
		

	}
	initializeEnableRowArray(6, 11, slottablePerDay, 0);
	//console.log(helperTable);
	for(var i = 1; i <= days; i++) { /*daywise*/
		for(var j = 0; j < NoOfSlots; j++) { /*slotwise*/
			var slotRows = searchMultipleRows(timeTable, "day", i, "slotNo", j, "configId", configId, 
												type+"Id", supportObject[type+"Id"],
											"snapshotId", currentSnapshotId);
			
			if(slotRows != -1) { // inside i=days * j=NoOfSlots loop
				sort(slotRows);
				var batches = "1";
				for(var k = 0; k < slotRows.length; k++) {/*within each slot*/
					
					var teacherShortName = "", classShortName = "", 
						batchName = "", roomShortName = "";
					/*For lunch*/
					if(slotRows[k]["subjectId"] == null) {
						var position = getPosition(i, j, null, 1);
						if(position  == null) 
							continue;
						batches = "0";
						var slottable = document.getElementById("slottable"+ i + j + position);
						if(slottable == null) {
							continue;
						}
						slottable.innerHTML = "LUNCH";
						continue;
					}
					if(type != "teacher")
						teacherShortName = search(teacher, "teacherId", 
									slotRows[k]["teacherId"])["teacherShortName"];

					var subjectRow = search(subject, "subjectId", slotRows[k]["subjectId"]);
					if(type != "room")
						roomShortName = search(room, "roomId", 
								slotRows[k]["roomId"])["roomShortName"];
					if(type != "class")
						classShortName = search(classTable, "classId", 
								slotRows[k]["classId"])["classShortName"];
					
					var eachSlot = subjectRow["eachSlot"];
					
					batches = subjectRow["batches"];
					if(slotRows[k]["batchId"] != 1 && type != "batch") {
						var batchRow = search(batch, "batchId", slotRows[k]["batchId"]);
						batchName = "" + batchRow["batchName"];
					}
					
					var position = getPosition(i, j, slotRows[k], subjectRow["eachSlot"]);
					if(position  == null) 
						continue;
					var slottable = document.getElementById("slottable"+ i + j + position);
					if(slottable == null) {
						continue;
					}
 					// Note: inside i=days * j=NoOfSlots loop
					slottable.innerHTML = 
							"<tr>"+
								"<td>"+
									"<div class= \"box\" id = \"box"+i+j+position+"\">"+
											"<span class = \"subjectentry\""+
											"id = \"subject"+i+j+position+"\">" + 
												subjectRow["subjectShortName"] + 
											"</span>"+
											"<span class = \"batchentry\" "+
											"id = \"batch"+i+j+position+"\">"+ 
												batchName + 
											"</span>"+
											"<span id = \""+i+j+k+"\" "+
											"class=\"delete\" onclick = deleteEntry(this)>"+
												"x"+
											"</span>"+
									"</div>"+
									"<div class = \"animate" + i + "\">" +
										"<div class = \"box\">"+
											"<span id = \"room"+i+j+position+"\" "+
											"class = \"roomentry\" >" 
													+ roomShortName + 
											"</span>"+
											"<span class =\"teacherentry\" "+
											"id = \"teacher"+i+j+position+"\">" +
													teacherShortName + 
											"</span>"+
											"<span class =\"classentry\" "+
											"id = \"class"+i+j+position+"\">" +
													classShortName + 
											"</span>"+
										"</div>"+
									"</div>"+
								"</td>"+
							"</tr>";
					slottable.setAttribute("draggable", "true");
					slottable.setAttribute("ondragstart", "dragStartHandler(event)");
					if(eachSlot > 1) {/**/
						for(var p = 1; p < eachSlot; p++) {
							document.getElementById("cell"+ i + (j + p)+ position).style.display = "none";
							//enabledSlots[i - 1][j + p] = k + 1;
						}
						document.getElementById("cell"+ i + j + k).setAttribute("colspan", eachSlot);	
					}
 					// Note: inside i=days * j=NoOfSlots loop
					
					//enabledSlots[i - 1][j] += 1;
					
				}
 				// Note: inside i=days * j=NoOfSlots loop; if existingrows
				if(batches !== "0" && type == "class") {
					//alert("in if");
					var position = getPosition(i, j, null, 1);
					//document.getElementById("cell"+i+j+k).style.borderTop = "2px solid black";
					if(position == null) {
						continue;
					}
					slottable = document.getElementById("slottable"+i+j+position);
					//console.log("slottable"+i+j+k);
					slottable.innerHTML = 
					"<tr>"+
						"<td>"+ getEligibleSubjects(i, j, position) +"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>"+
							"<select id=\"batch"+ i+j+position +"\" style=\"display:none;\" "+
							"onchange=\"batchSelected(this)\"/>"+
						"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>"+
							"<select id=\"teacher"+ i+j +position+"\" style=\"display:none;\"/>"+
						"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>"+
							"<select id=\"class"+ i+j +position+"\" style=\"display:none;\""+
							"onchange=\"classSelected(this)\"/>"+
						"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>"+
							"<select id=\"room"+ i+j +position+"\" "+
							"style=\"display:none;\" />"+
							"Done<input id= \"checkbox"+i+j +position+"\" class=\"toggle\""+
							" type=checkbox"+
							" value = \""+i+j +position+"\"style=\" display:none;\""+
							" onchange=roomSelected(this)>" +
						"</td>"+
					"</tr>";
				}
				var rowspan = document.getElementById(""+ i).getAttribute("rowspan");
				if(rowspan == null)
					rowspan = ""+1;
				if(parseInt(rowspan) <= slotRows.length && type == "class") {
					document.getElementById(""+ i).setAttribute("rowspan", (slotRows.length + parseInt(batches)));
				}	
			}
			else {
				var k = getPosition(i, j, null, 1);
				slottable = document.getElementById("slottable"+i+j+k);
				if(slottable == null)
					continue;
				// Note: inside i=days * j=NoOfSlots loop, batches !=0
				slottable.innerHTML = 	
					"<tr>"+
						"<td>" +
							getEligibleSubjects(i, j, k) +
						"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>"+
							"<select id=\"batch"+ i + j + k +"\""+
								"onchange=\"batchSelected(this)\""+
								"style=\"display:none;\"/>"+
						"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>"+
							"<select id=\"teacher"+ i + j + k + "\""+
								"style=\"display:none;\"/>"+
						"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>"+
							"<select id=\"class"+ i + j + k + "\""+
								"onchange=\"classSelected(this)\" "+
								"style=\"display:none;\"/>"+
						"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>"+
							"<select id=\"room"+ i + j + k + "\""+
								"style=\"display:none;\" />"+
							"Done<input id= \"checkbox"+i+j +k+"\" class= \"toggle\""+
							"type=checkbox"+
							" value = \""+i+j +k+"\" style=\"display:none;\" onchange=roomSelected(this) >" +
						"</td>"+
					"</tr>";
			}
		}
	}
	for(var i = 1; i <= 6; i++) {/*hiding extra part initially*/
		$(".animate"+i).hide();
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
var currSnapshotName;
function snapshotChange() {
	var index = document.getElementById("fetch-snapshot-menu").selectedIndex;
	var snapshotName = document.getElementById("fetch-snapshot-menu").options[index].text;
	if(snapshotName == currSnapshotName)
		return;
	if(dirtyTimeTable) {
			save = confirm("Timetable Modified. Your changes will be lost if not saved. Save current timeTable?");
			if(save == "yes")
				jsSaveSnapshot();
	}
	getTimetable(snapshotName);	
	currSnapshotName = snapshotName;
	var snapshotRow = search(snapshot, "snapshotName", snapshotName);
	currentSnapshotId = snapshotRow["snapshotId"];
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

function load() {
	var i;
	//alert("Come 1");
	getAllData();/*Load whole database*/
	//alert("Loaded db");
	getTimetable("default");
	//alert("Got default tt");
	/*var selectTag = document.getElementById("subject-menu");
	//Filling all select tags Menu
	for (i in subject) {
		selectTag.appendChild(createOptionTag(subject[i]["subjectShortName"], 
							subject[i]["subjectShortName"], "subjectChange()"));		
	}
	selectTag.setAttribute("onchange", "subjectChange()");
	sortSelect(selectTag); 
	*/
	selectTag = document.getElementById("teacher-menu");
	for (i in teacher) {
		selectTag.appendChild(createOptionTag(teacher[i]["teacherShortName"], 
								teacher[i]["teacherShortName"], "classChange()"));		
	}
	//sortSelect(selectTag);
	selectTag.setAttribute("onchange", "teacherChange(true)");
	sortSelect(selectTag);

	var selectTag = document.getElementById("class-menu");
	for (i in classTable) {
		selectTag.appendChild(createOptionTag(classTable[i]["classShortName"], 
								classTable[i]["classShortName"], "classChange()"));		
	}
	selectTag.setAttribute("onchange", "classChange(true)");
	//sortSelect(selectTag);

	var selectTag = document.getElementById("batch-menu");
	for (i in batch) {
		selectTag.appendChild(createOptionTag(batch[i]["batchName"], 
								batch[i]["batchName"], "batchChange()"));		
	}
	//sortSelect(selectTag);
	selectTag.setAttribute("onchange", "batchChange(true)");
	sortSelect(selectTag);

	var selectTag = document.getElementById("room-menu");
	for (i in room) {
		selectTag.appendChild(createOptionTag(room[i]["roomShortName"], 
								room[i]["roomShortName"], "roomChange()"));		
	}
	//sortSelect(selectTag);	
	selectTag.setAttribute("onchange", "roomChange(true)");
	sortSelect(selectTag);	

	loadSnapshotMenu("default");
	$("#mainTimeTable").append("<center><B>No TimeTable loaded </B><br>"+
								"Please select option from above catgories</center>");
	/* Settings for saving the snapshot */
}
function loadSnapshotMenu(selectedName) {
	//alert("loadSnapshotMenu: here");
	var selectTag = document.getElementById("fetch-snapshot-menu");
	while(selectTag.hasChildNodes()) {
		selectTag.removeChild(selectTag.childNodes[0]);
	}
	for (i in snapshot) {
		option = createOptionTag(snapshot[i]["snapshotName"], 
								snapshot[i]["snapshotName"], "snapshotChange()");
		if(snapshot[i]["snapshotName"] === selectedName) {
			option.selected = true;
			currentSnapshotId = snapshot[i]["snapshotId"];
			//alert("default" + option.text);
		}
		selectTag.appendChild(option);
		
	}
	selectTag.setAttribute("onchange", "snapshotChange()");
	document.getElementById("saveNewSnapshot").disabled =  false;
	document.getElementById("saveSnapshot").disabled = false;
	//sortSelect(selectTag);	
}
function jsSaveNewSnapshot() {
	var snapshotName = prompt("Enter snapshot Name","snapshot");
	if(snapshotName != null) {
			var xhttp;
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
							//alert("snapshot response: " + this.responseText);
							alert("snapshot " + snapshotName + " Saved. Press OK to continue");
							document.getElementById("saveNewSnapshot").value = "Save New Snapshot"
							document.getElementById("saveNewSnapshot").disabled =  false;
							// JS variables are pass by vale, so snapshot can be changed here only
							snapshot = getOneTable("snapshot", false).snapshot;
							loadSnapshotMenu(snapshotName);
							currSnapshotName = snapshotName;
							getTimetable(snapshotName);
					}
			}
			document.getElementById("saveNewSnapshot").value = "Saving New snapshot ...wait";
			document.getElementById("saveNewSnapshot").disabled =  true;
			xhttp.open("POST", "timetable.php", true); // asynchronous
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("reqType=saveNewSnapshot&snapname="+snapshotName+"&ttdata="+JSON.stringify(timeTable));
	}
	
}
function jsSaveSnapshot() {
	var snapshotName = currSnapshotName; 
	if(snapshotName != null) {
			var xhttp;
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
					if (this.readyState == 4 && this.status == 200) {
							//alert("snapshot response: " + this.responseText);
							alert("snapshot " + snapshotName + " Saved. Press OK to continue");
							document.getElementById("saveSnapshot").value = "Save snapshot";
							document.getElementById("saveSnapshot").disabled =  false;
					}
			}
			xhttp.open("POST", "timetable.php", true); // asynchronous
			document.getElementById("saveSnapshot").value = "Saving snapshot ...wait";
			document.getElementById("saveSnapshot").disabled =  true;
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.send("reqType=saveSnapshot&snapname="+snapshotName+"&ttdata="+JSON.stringify(timeTable));
	} else {
		alert("jsSaveSnapshot: can't find currSnapshotName");
	}
}
window.onload = load;

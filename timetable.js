var selectedCell ;
var prevBorder;
var copyCell;
var timeTable, teacher, dept, classTable, batch, batchCanOverlap; 
var room, subject, config, batchClass, subjectBatchTeacher, subjectClassTeacher;
var database;
var configId = 1;
var type = "class";
var id = "SYBT-CE";
var daysName = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
var enabledSlots = [];
var enabledRows = [];
var supportObject;


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
function getData() {/*Loads data from server asynchronously*/
	var xhttp;
	if (window.XMLHttpRequest) {
		xhttp = new XMLHttpRequest();
	} 
	else {
				    // code for IE6, IE5
		xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			database = JSON.parse(this.responseText);
			timeTable = database.timeTable;//<====================================Change this
			if(typeof timeTable == "undefined")
				timeTable = [];
			teacher = database.teacher;
			if(typeof teacher == "undefined")
				alert("Teacher's information not found");
			dept = database.dept;
			if(typeof dept == "undefined")
				alert("Department's information not found");
			classTable = database.class;
			if(typeof classTable == "undefined")
				alert("Class's information not found");
			batch = database.batch;
			if(typeof batch == "undefined")
				alert("Batch's information not found");
			batchCanOverlap = database.batchCanOverlap;
			if(typeof batchCanOverlap == "undefined")
				alert("Batch Can Overlap's information not found");
			room = database.room;
			if(typeof room == "undefined")
				alert("Room's information not found");
			subject = database.subject;
			if(typeof subject == "undefined")
				alert("Subject's information not found");
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
		}
	};
	xhttp.open("POST", "timetable.php", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("allDataRequest=true");
}

function createOptionTag(value, textString) {
	var option = document.createElement("option");
	option.setAttribute("value", value);
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

function initializeEnableRowArray(row, cols, initial_value) {
	enabledSlots = new Array(row).fill(initial_value).map(row => new Array(cols).fill(initial_value));
	enabledRows = new Array(row).fill(initial_value);
	
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
				teacherId, batchId, configId, isBreak) {
	this.day = "" +day;
	this.slotNo = ""+slotNo;
	this.roomId = ""+roomId;
	this.classId = ""+classId;
	this.subjectId = "" +subjectId;
	this.teacherId = ""+teacherId;
	this.batchId = ""+batchId;
	this.configId = ""+configId;
	this.isBreak = ""+isBreak;
	if(timeTable.length == 0)
		this.ttId =  1;
	else
		this.ttId = ""+(parseInt(timeTable[timeTable.length - 1]["ttId"]) + 1);
}

function roomSelected(selecttag) {
	var index = selecttag.selectedIndex;
	var roomShortName = selecttag.options[index].text;
	
	var Id = selecttag.getAttribute("id");
	Id = Id.substring(4, Id.length);
	iid = Id.substring(0, 1);
	jid = Id.substring(1, Id.length -1);
	kid = Id.substring(Id.length - 1,Id.length);
	var roomRow = search(room, "roomShortName", roomShortName);
	switch(type) {
		case "class" :
			var batchId = "1";
			var temp = document.getElementById("subject"+iid+jid+kid);
			var subjectRow = search(subject, "subjectShortName", temp.innerHTML);
			if(subjectRow["batches"] == "1") {
				temp = document.getElementById("batch"+iid+jid+kid);
				var batchRow = search(batch, "batchName", temp.innerHTML);
				batchId =  batchRow["batchId"];
				
			}
			temp = document.getElementById("teacher"+iid+jid+kid);
			var teacherRow = search(teacher, "teacherShortName", temp.innerHTML);
			for(var i = 0; i < parseInt(subjectRow["eachSlot"]); i++) {
				var newEntry = new createTimeTableEntry(iid, (parseInt(jid) + i), 
									roomRow["roomId"], supportObject["classId"], 
									subjectRow["subjectId"], teacherRow["teacherId"], 
									batchId,configId, 0);
				timeTable.push(newEntry);
				console.log("roomEntry: newEntry = " + JSON.stringify(newEntry));
			}
			classChange(false);
			break;
	}
}

function getEligibleBatches(i, j, k, subjectRow) {
	console.log("getEligibleBatches: i = " + i + " j = " + j + " k = " + k + 
				"subject  = " + subjectRow["subjectShortName"]);
	var optionString = "<option value=\"NOT_SELECTED\">--Batch--</option>";
	var eligibleBatches = [];
	var configRow = search(config, "configId", configId);
	switch(type) {
		case "class":
			/*Get batches of class and for that subject*/
			var sbtRows = searchMultipleRows(subjectBatchTeacher, "subjectId", subjectRow["subjectId"]);
			var bcRows = searchMultipleRows(batchClass, "classId", supportObject["classId"]);
			for(var n = 0; n < sbtRows.length; n++) {
				if(search(bcRows, "batchId", sbtRows[n]["batchId"])  === -1) {
					sbtRows.splice(n, 1);
					--n;
				}
			}
			console.log("getEligibleBatches: bcRows = " + JSON.stringify(bcRows));
			console.log("getEligibleBatches: sbtRows = " + JSON.stringify(sbtRows));
			var eachSlot = parseInt(subjectRow["eachSlot"]);
			outerloop: //label
			for(var y = 0; y < sbtRows.length; y++) {
				console.log("getEligibleBatches Looping y:" +  y + " " + JSON.stringify(sbtRows[y]));
				var currTeacher = search(teacher, "teacherId", sbtRows[y]["teacherId"]);
				var maxEntriesForSubject = subjectRow["nSlots"];
				
				//c = # entries in tt for this batch-subject
				var existingEntries = searchMultipleRows(timeTable, 
										"subjectId", subjectRow["subjectId"], 
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
				var allocatedTimeForTeacher = searchMultipleRows(timeTable, "teacherId", currTeacher["teacherId"]);
				if(allocatedTimeForTeacher !== -1) {
					 allocatedTimeForTeacher =  allocatedTimeForTeacher.length;
				}
				else {
					 allocatedTimeForTeacher = 0;
				}
				if((allocatedTimeForTeacher + eachSlot) 
							 > parseInt(currTeacher["maxHrs"])) {/*(5)*/
					console.log("getEligibleBataches:  teacher: " + currTeacher["teacherShortName"] +" max hr exceeded");
					continue outerloop;						
				}
				/*overlapping batches for curr batch*/
				var bcoEntries = searchMultipleRows(batchCanOverlap, 
										"batchId", sbtRows[y]["batchId"]);
				for(var z = 0; z < eachSlot; z++) {
					var slotEntries = searchMultipleRows(timeTable, "day", i, "slotNo", (j + z), 
								"classId", supportObject["classId"],
								"configId", configId);
					if(slotEntries !== -1) {
						/*Batche in slot --> in overlaping batches array*/
						if(bcoEntries !== -1) {
							for(var p in slotEntries) {
								var index = search(bcoEntries, 
										"batchOverlapId", slotEntries[p]["batchId"]);
								if(index === -1) {//(2)
									console.log("getEligibleBatches: overlapping " + JSON.stringify(p));
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
										 "teacherId", currTeacher["teacherId"]);
						//if t is busy in this slot(i,j)
							//continue(4)
					if(nEntriesForTeacher != -1) {
							console.log("getEligibleBatches: Teacher " + currTeacher["teacherId"] + " Busy");
							continue outerloop;
					}
				}
				eligibleBatches.push(search(batch, "batchId", sbtRows[y]["batchId"]));
			}
			break;
	}
	for(var r in eligibleBatches) {
		var batchName = eligibleBatches[r]["batchName"];
		optionString += "<option value =\""+ batchName +"\">" + batchName + "</option>";		
	}
	return optionString;
}

function getEligibleRoom(i, j, k, capacity, subjectRow) {
	// TODO: This needs to be modified to return the fixed room
	// if there is a classRoom or batchRoom mapping 
	var optionString = "<option value = \"NOT_SELECTED\">--Room--</option>";
	switch(type) {
		case "class": 
			var eachSlot = parseInt(subjectRow["eachSlot"]);
			for(var y = 0; y < room.length; y++) {
			//alert(parseInt(room[i]["roomCount"]) +" ,"+capacity);
				var valid = 1;
				for(var z =0; z < eachSlot; z++) {
					var found = search(timeTable, "configId", configId,
								"day", i, "slotNo", ""+(parseInt(j) + z), 
								"roomId", room[y]["roomId"]);
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
			break;
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
			var subjectShortName = document.getElementById("subject"+iid+jid+kid).innerHTML;
			var subjectRow = search(subject, "subjectShortName", subjectShortName);
			var roomSelect = document.getElementById("room"+Id);
			roomSelect.style.display = "";
			var capacity = parseInt(batchRow["batchCount"]);
			var teacherRow = search(subjectBatchTeacher, "subjectId", subjectRow["subjectId"], 
						"batchId", batchRow["batchId"]);
			teacherRow = search(teacher, "teacherId", teacherRow["teacherId"]);
			extraInfo += "<div id=\"teacher"+iid+jid+kid+"\" class=\"box\">"+
						teacherRow["teacherShortName"]+
					"</div>";
			roomSelect.innerHTML = getEligibleRoom(parseInt(iid), parseInt(jid), parseInt(kid),
								 capacity, subjectRow);/*room option*/
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
	switch(type) {
		case "class" :
				if(batches === "0") {/*Normal subject*/
					var roomSelect = document.getElementById("room"+Id);
					roomSelect.style.display = "";
					var capacity = parseInt(supportObject["classCount"]);
					/*Teacher Entry*/
					var sctEntry = search(subjectClassTeacher, 
									"subjectId", subjectRow["subjectId"],
									"classId", supportObject["classId"]);
					var teacherRow = search(teacher, "teacherId", sctEntry["teacherId"]);
					extraInfo += "<div id=\"teacher"+ iid + jid + kid +
									"\" class=\"box\">" + 
									teacherRow["teacherShortName"] +
						"</div>";
					roomSelect.innerHTML = getEligibleRoom(parseInt(iid), parseInt(jid), 
												parseInt(kid), 
												capacity, subjectRow);/*room option*/
				}
				else {/*Subject Having Batches*/
					var batchSelect = document.getElementById("batch"+ Id);
					batchSelect.style.display = "";
					batchSelect.innerHTML = getEligibleBatches(parseInt(iid), parseInt(jid), 
												parseInt(kid), subjectRow);/*batch option*/
				}
				break;
	}
	selecttag.parentElement.innerHTML = "<div id= \"subject"+ iid +jid + kid + 
											"\"class= \"box\">" + subjectShortName+ 
						"</div>"+extraInfo;
	
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
	//if tt-has i-j'th entry with a non-batchable subject,
		//return "";
	//entriesInThisSlot = searchMultipleRows(timeTable, "day", i, "slotNo", j, "classId", supportObject["classId"]);
	//if(entriesInThisSlot != -1) {
	//		subjectEntry = search(subject, "subjectId", entriesInThisSlot[0]["subjectId"]);
	//		if(subjectEntry["batches"] = "0")
	//			return "";
	//}	
	//sctlist = get-all-subjects-for-this-class from SCT table
	var sctlist = searchMultipleRows(subjectClassTeacher, "classId", supportObject["classId"]);
	//sbtlist = get-all-batched-subjects-for-this-class from SBT table
	var blist = searchMultipleRows(batchClass, "classId", supportObject["classId"]);
	var sbtlist = [];
	var searchOn;
	for (var m = 0; m < blist.length; m++) {
		var res = searchMultipleRows(subjectBatchTeacher, "batchId", blist[m]["batchId"]);
		sbtlist = sbtlist.concat(res);
		//if(sbtlist.length > 0)alert("sbtlist =  " + JSON.stringify(sbtlist));
	}
	//for sub in sbtlist
	lists = [sctlist, sbtlist];
	for(l in lists) {
			if(lists[l] === sbtlist) { 
				searchOn = "batchId";
			}
			else {
				searchOn = "classId";
			}
			for(var m = 0; m < lists[l].length; m++) {
				
				//currSubject = subjectcandidate(s);
				var currSubject= search(subject, "subjectId", lists[l][m]["subjectId"]);
				
				//b or c = batch-or-class-of-this-entry
				/*var currBatchOrClass;
				if(search === "batchId")
					currentBatchOrClass = search(batch, searchOn, lists[l][m][searchOn]);
				else
					currentBatchOrClass = search(classTable, searchOn, lists[l][m][searchOn]);*/
				//n = possible #entries for this subject
				var maxEntriesForSubject = currSubject["nSlots"];
				
				//c = # entries in tt for this batch-subject
				var existingEntries = searchMultipleRows(timeTable, 
										"subjectId", currSubject["subjectId"], 
										searchOn, lists[l][m][searchOn]);
				if(existingEntries !== -1) {
					// This is because, for a subject with eachSlot=2, we enter two entries in timetable
					lenExistingEntries = (existingEntries.length / currSubject["eachSlot"]);
				}
				else {
					lenExistingEntries = 0;
				}
				//alert("Current: " + JSON.stringify(currSubject));
				//Checking whether there is time left for subject(1)
			
				// TODO: For batches, we need to add the check for batch. Otherwise one entry for a sub-batch
				// will make the subject disappear.	
				if(lenExistingEntries == maxEntriesForSubject && lists[l] != sbtlist) {
					console.log("eligibleSubjects:  maxEntriesFor subject " + currSubject["subjectShortName"] + 
								"class/batch: " + searchOn + " = " + lists[l][m][searchOn]);
					//alert("maxEntriesFor subject equal");
					continue;
				}
				
				if(lenExistingEntries > maxEntriesForSubject)
					console.log("eligibleSubjects: More than desired entries for " + 
								currSubject["subjectShortName"] + 
								JSON.stringify(existingEntries) + searchOn);

				if(j + parseInt(currSubject["eachSlot"]) - 1  > nSlotsPerDay) {
					//console.log("Skipping slot "+ j + " for " + currSubject["subjectShortName"] + 
							//	" on day " + i + " as slot out of day ");
					continue;
				}
				//t = teacher for this subject-class
				currTeacher = search(teacher, "teacherId", lists[l][m]["teacherId"]);
				/*if(currTeacher === -1){
					alert("Problem");
				}*/
				/*teacher allocated time + time for this subject < maxhrs for teacher*/
				var allocatedTimeForTeacher = searchMultipleRows(timeTable, "teacherId", currTeacher["teacherId"]);
				if(allocatedTimeForTeacher !== -1) {
					 allocatedTimeForTeacher =  allocatedTimeForTeacher.length;
				}
				else {
					 allocatedTimeForTeacher = 0;
				}
				if((allocatedTimeForTeacher + parseInt(currSubject["eachSlot"])) 
							 > parseInt(currTeacher["maxHrs"])) {/*(5)*/
					console.log("getEligibleSubjects: teachers max hr exceeded for " + currTeacher["teacherShortName"]);
					//alert("teachers max hr exceeded");
					continue;						
				}
				//console.log("day " + i + " slot " + j + " currsubject " + JSON.stringify(currSubject));
				//for k = 0; k < sc->eachSlot; k++
				
				var validSubj = 1;		
				for(var n = 0; n < currSubject["eachSlot"] - 1; n++); {
						
						var nEntriesForTeacher = search(timeTable, "day", i, "slotNo", j + n,
										 "teacherId", currTeacher["teacherId"]);
						//if t is busy in this slot(i,j)
							//continue(2)
						if(nEntriesForTeacher != -1) {
							console.log("eligibleSubjects: Skipping teacher " 
										+ currTeacher["teacherShortName"] + " as busy");
							validSubj = 0;
							break;
						}
						//if non-practical subj(considered) and prac subj is in this slot already
							//continue;
						if(currSubject["batches"] == "0") {
							var currentSlotEntry = search(timeTable, "day", i, "slotNo", j + n,
											"classId", supportObject["classId"]);
							//console.log(i+","+j+","+supportObject["classId"]+"=="+currentSlotEntry);
							if(currentSlotEntry !== -1) {
								console.log("getEligibleSubject: Batched-subject " + 
											supportObject["classShortName"] + " in slot");
								validSubj = 0;
								break;
							}
						}	
						else {
							/*Batch Must be free*/
							//console.log(currSubject);
							var currentSlotEntry = search(timeTable, "day", i, "slotNo", j + n,
											"classId", supportObject["classId"],
											"batchId", lists[l][m]["batchId"]);
							//console.log(i+","+j+","+supportObject["classId"]+"=="+currentSlotEntry);
							if(currentSlotEntry !== -1) {
								console.log("getEligibleSubject: " + lists[l][m]["batchShortName"] + " batch not free");
								validSubj = 0;
								//alert(validSubj);
								break;
							}
							/*batch subj but in this slot subj for whole class present*/
							currentSlotEntry = search(timeTable, "day", i, "slotNo", j + n,
											"classId", supportObject["classId"],
											"batchId", 1);
							if(currentSlotEntry !== -1) {
								console.log("getEligibleSubject:  " + supportObject["classShortName"] 
											+ " subject for whole class");
								validSubj = 0;
								break;
							}
						}
						
						
				}
				//console.log("validSubj==================>"+validSubj);
				if(validSubj === 0) {
					alert("Invalid subject");
					continue;
				}
				// subject-batch combination has many repetitions of subject, so need to remove duplicates
				if(subjectsList.indexOf(currSubject) == -1)
						subjectsList.push(currSubject);
			}
		}
		/*if(subjectsList.length == 0)
			alert("day " + i + "slot " + j + "subjectlist: " + JSON.stringify(subjectsList));*/
		for(var r in subjectsList) {
			var subj = subjectsList[r]["subjectShortName"];
			select += "<option value =\""+ subj +"\">" + subj + "</option>";		
		}
		select += "</select>";
		return select;
}

function subjectChange(){
	//var index = document.getElementById("subject-menu").selectedIndex;
	//var subjectShortName = document.getElementById("subject-menu").options[index].text;
	document.getElementById("teacher-menu").selectedIndex = "-1";
	document.getElementById("room-menu").selectedIndex = "-1";
	document.getElementById("class-menu").selectedIndex = "-1";
	document.getElementById("batch-menu").selectedIndex = "-1";
	
	
}

/*For deleting an entry from timeTable*/
function deleteEntry(Span) {
	var Id = Span.id;/*Id of "x"*/
	var day = Id.substring(0, 1);
	var SlotNo = Id.substring(1, Id.length -1);
	var slottableNo = Id.substring(Id.length -1, Id.length);
	switch(type) {
		case "class" :
			/*Subject and Batch determines unique slot*/
			var subjShortName = document.getElementById("subject"+Id).innerHTML;
			var batchName = document.getElementById("batch" + Id).innerHTML;
			if(batchName  === "") {
				batchName = "NONE";
			}
			var subjRow = search(subject, "subjectShortName", subjShortName);
			var batchRow = search(batch, "batchName", batchName);
			for(var i = 0; i < subjRow["eachSlot"]; i++) {
				var index = timeTable.indexOf(
					search(timeTable, "day", day, "slotNo", (parseInt(SlotNo) + i), 
					"subjectId", subjRow["subjectId"], "batchId", batchRow["batchId"]) );
				
				if(index != -1)
					timeTable.splice(index, 1);/*Delete entry from table*/
			}
			classChange(true);
			break;
	}
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
	var configrow = search(config, "configId", configId);
	var NoOfSlots = configrow["nSlots"];
	var days = 6;
	var row = searchMultipleRows(batchClass, "classId", supportObject["classId"]); /*Depending on the no of batches in a class*/
	var slottablePerDay = row.length;
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
	
	/*Filling the table*/
	//initializeEnableRowArray(days, NoOfSlots, 0);
	initializeEnableRowArray(6, 11, 0);

	for(var i = 1; i <= days; i++) { /*daywise*/
		for(var j = 0; j < NoOfSlots; j++) { /*slotwise*/
			var slotRows = searchMultipleRows(timeTable, "day", i, "slotNo", j, "configId", configId, 
												"classId", supportObject["classId"]);
			if(slotRows != -1) { // inside i=days * j=NoOfSlots loop
				sort(slotRows);
				var batches = "1";
				for(var k = (enabledSlots[i - 1][j]); k < slotRows.length; k++) {/*within each slot*/
					var slottable = document.getElementById("slottable"+ i + j + k);
					var teacherRow = search(teacher, "teacherId", slotRows[k]["teacherId"]);
					var subjectRow = search(subject, "subjectId", slotRows[k]["subjectId"]);
					var roomRow = search(room, "roomId", slotRows[k]["roomId"]);
					var batchName = "";
					var eachSlot = subjectRow["eachSlot"];
					batches = subjectRow["batches"];
					if(slotRows[k]["batchId"] != 1) {
						var batchRow = search(batch, "batchId", slotRows[k]["batchId"]);
						batchName = "" + batchRow["batchName"];
					}
 					// Note: inside i=days * j=NoOfSlots loop
					slottable.innerHTML = 
							"<tr>"+
								"<td>"+
									"<div class= \"box\" id = \"box"+i+j+k+"\">"+
											"<span class = \"subjectentry\""+
											"id = \"subject"+i+j+k+"\">" + 
												subjectRow["subjectShortName"] + 
											"</span>"+
											"<span class = \"batchentry\" "+
											"id = \"batch"+i+j+k+"\">"+ 
												batchName + 
											"</span>"+
											"<span id = \""+i+j+k+"\" "+
											"class=\"delete\" onclick = deleteEntry(this)>"+
												"x"+
											"</span>"+
									"</div>"+
									"<div class = \"animate" + i + "\">" +
										"<div class = \"box\">"+
											"<span id = \"room"+i+j+k+"\" "+
											"class = \"roomentry\" >" 
													+ roomRow["roomShortName"] + 
											"</span>"+
											"<span class =\"teacherentry\" "+
											"id = \"teacher"+i+j+k+"\">" +
													teacherRow["teacherShortName"] + 
											"</span>"+
										"</div>"+
									"</div>"+
								"</td>"+
							"</tr>";
					
					if(eachSlot > 1) {
						for(var p = 1; p < eachSlot; p++) {
							document.getElementById("cell"+ i + (j + p)+ k).style.display = "none";
							enabledSlots[i - 1][j + p] = k + 1;
						}
						document.getElementById("cell"+ i + j + k).setAttribute("colspan", eachSlot);	
					}
 					// Note: inside i=days * j=NoOfSlots loop
					if(k > 0) {
						if((k) > enabledRows[i - 1]) { /*Enabling rows and hiding the borders row-wise*/
							var row = document.getElementById("row" + i + k);
							row.style.display = "";
							for(var x = 0; x < row.children.length; x++) {
								document.getElementById(row.children[x].id).style.borderTop = "0px none white";
							}
							row = document.getElementById("row" + i + (k - 1));
							for(x = 0; x < row.children.length; x++) {
								document.getElementById(row.children[x].id).style.borderBottom = "0px none white";
							}
							
							enabledRows[i - 1] += 1;
						}  
						
						document.getElementById("cell"+i+j+k).style.borderTop = "2px solid black";
					}
					enabledSlots[i - 1][j] += 1;
					
				}
 				// Note: inside i=days * j=NoOfSlots loop; if existingrows
				if(batches !== "0") {
					//alert("in if");
					k = enabledSlots[i - 1][j];
					//alert(""+i+j+k);
					if((k) > enabledRows[i - 1]) { /*Enabling rows and hiding the borders row-wise*/
						
						var row = document.getElementById("row" + i + k);
						if(row == null) {
							continue;
						}
						row.style.display = "";
						for(var x = 0; x < row.children.length; x++) {
							document.getElementById(row.children[x].id).style.borderTop = "0px none white";
						}
						row = document.getElementById("row" + i + (k - 1));
						for(x = 0; x < row.children.length; x++) {
							document.getElementById(row.children[x].id).style.borderBottom = "0px none white";
						}
						
						enabledRows[i - 1] += 1;
					} 
					enabledSlots[i - 1][j] += 1; 
					document.getElementById("cell"+i+j+k).style.borderTop = "2px solid black";
					slottable = document.getElementById("slottable"+i+j+k);
					//console.log("slottable"+i+j+k);
					slottable.innerHTML = 
					"<tr>"+
						"<td>"+ getEligibleSubjects(i, j, k) +"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>"+
							"<select id=\"batch"+ i+j+k +"\" style=\"display:none;\" "+
							"onchange=\"batchSelected(this)\"/>"+
						"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>"+
							"<select id=\"teacher"+ i+j +k+"\" style=\"display:none;\"/>"+
						"</td>"+
					"</tr>"+
					"<tr>"+
						"<td>"+
							"<select id=\"room"+ i+j +k+"\" onchange=\"roomSelected(this)\" "+
							"style=\"display:none;\" />"+
						"</td>"+
					"</tr>";
				}
				var rowspan = document.getElementById(""+ i).getAttribute("rowspan");
				if(rowspan == null)
					rowspan = ""+1;
				if(parseInt(rowspan) <= slotRows.length ) {
					document.getElementById(""+ i).setAttribute("rowspan", slotRows.length + parseInt(batches));
				}	
			}
			else {
				var k = enabledSlots[i - 1][j];
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
							"<select id=\"room"+ i + j + k + "\""+
								"onchange=\"roomSelected(this)\" "+
								"style=\"display:none;\" />"+
						"</td>"+
					"</tr>";
			}
		}
	}
	for(var i = 1; i <= 6; i++) {/*hiding extra part initially*/
		$(".animate"+i).hide();
	}

}

function roomChange(){
	document.getElementById("teacher-menu").selectedIndex = "-1";
	//document.getElementById("subject-menu").selectedIndex = "-1";
	document.getElementById("class-menu").selectedIndex = "-1";
	document.getElementById("batch-menu").selectedIndex = "-1";
}

function batchChange(){
	document.getElementById("teacher-menu").selectedIndex = "-1";
	document.getElementById("room-menu").selectedIndex = "-1";
	document.getElementById("class-menu").selectedIndex = "-1";
	//document.getElementById("subject-menu").selectedIndex = "-1";
}

function teacherChange(){
	//document.getElementById("subject-menu").selectedIndex = "-1";
	document.getElementById("room-menu").selectedIndex = "-1";
	document.getElementById("class-menu").selectedIndex = "-1";
	document.getElementById("batch-menu").selectedIndex = "-1";
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
	getData();/*Load whole database*/
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
	selectTag.setAttribute("onchange", "teacherChange()");
	sortSelect(selectTag);
	var selectTag = document.getElementById("class-menu");
	for (i in classTable) {
		selectTag.appendChild(createOptionTag(classTable[i]["classShortName"], 
								classTable[i]["classShortName"], "classChange()"));		
	}
	selectTag.setAttribute("onchange", "classChange(true)");
	sortSelect(selectTag);
	var selectTag = document.getElementById("batch-menu");
	for (i in batch) {
		selectTag.appendChild(createOptionTag(batch[i]["batchName"], 
								batch[i]["batchName"], "batchChange()"));		
	}
	selectTag.setAttribute("onchange", "batchChange()");
	sortSelect(selectTag);
	var selectTag = document.getElementById("room-menu");
	for (i in room) {
		selectTag.appendChild(createOptionTag(room[i]["roomShortName"], 
								room[i]["roomShortName"], "roomChange()"));		
	}
	selectTag.setAttribute("onchange", "roomChange()");
	sortSelect(selectTag);	
	$("#mainTimeTable").append("<center><B>No TimeTable loaded </B><br>"+
								"Please select option from above catgories</center>");			
}

window.onload = load;

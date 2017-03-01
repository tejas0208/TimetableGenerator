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

$(document).ready(function(){
				
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
});

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
				alert("Batch and subject relation's information not found");
			subjectClassTeacher = database.subjectClassTeacher;
			if(typeof subjectClassTeacher == "undefined")
				alert("Class and subject relation's information not found");
		}
	};
	xhttp.open("POST", "getTable.php", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send();
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
	var start = new Date("February 25, 2017 "+ "08:00");
	
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
	//console.log(table);
	for(var i = 0; i < table.length - 1; i++) {
		for(var j = 0; j < table.length - i -1 ; j++) {
			var row1 = search(subject, "subjectId", table[j]["subjectId"]);
			var row2 = search(subject, "subjectId", table[j + 1]["subjectId"]);
			if(row1["eachSlot"] < row2["eachSlot"]) {
				//console.log(row1["eachSlot"]+"<"+row2["eachSlot"]);
				var temp = table[j + 1];
				table[j + 1] = table[j];
				table[j] = temp;
				//console.log(table);
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
			var newEntry = new createTimeTableEntry(iid, jid, roomRow["roomId"], 
									supportObject["classId"], subjectRow["subjectId"], 
									teacherRow["teacherId"], batchId,configId, 0);
			timeTable.push(newEntry);
			classChange();
			break;
	}
}

function getEligibleRoom(i, j, k, capacity) {
	var optionString = "<option value = \"NOT_SELECTED\">--Room--</option>";
	for(var i = 0; i < room.length; i++) {
		//alert(parseInt(room[i]["roomCount"]) +" ,"+capacity);
		var found = search(timeTable, "configId", "day", i, 
								"slotNo", j, configId, 
								"roomId", room[i]["roomId"]);
		if(found !== -1) {/*There are other classes in this room*/
			continue;
		}
		if(parseInt(room[i]["roomCount"]) >= capacity) {
			optionString += "<option value = \""+ 
									room[i]["roomShortName"] + "\">"+ 
									room[i]["roomShortName"] + 
							"</option>"; 
		}
	}
	return optionString;
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
					var possibleTeachers = searchMultipleRows(subjectClassTeacher, 
												"subjectId", subjectRow["subjectId"]);
					for(var i in possibleTeachers) {
						var found = search(subjectClassTeacher, 
											"teacherId", possibleTeachers[i]["teacherId"], 
											"classId", supportObject["classId"]);
						if(found !== -1) {
							var teacherRow = search(teacher, "teacherId", found["teacherId"]);
							extraInfo += "<div id=\"teacher"+ iid + jid + kid +
											"\" class=\"box\">" + 
											teacherRow["teacherShortName"] +
										"</div>";
						}
					}
					roomSelect.innerHTML = getEligibleRoom(parseInt(iid), parseInt(jid), 
												parseInt(kid), capacity);/*room option*/
				}
				break;
	}
	selecttag.parentElement.innerHTML = "<div id= \"subject"+ iid +jid + kid + 
											"\"class= \"box\">" + subjectShortName+ 
										"</div>"+extraInfo;
	//$("#subject"+id).remove();
	
}

function getEligibleSubjects(i, j, k) {
	// Check that there is a room available in this slot 
	// Return "NO ROOM otherwise
	/*var r = search(timeTable, "day", i, "slot", j);
	for(var i = 0; i < r.length; i++) {
	}
	if (r.length < 1) 
		return "NO ROOM";   */

	var configrow = search(config, "configId", configId);
	var nSlotsPerDay = configrow["nSlots"];
	var select = "<select id= \"subject"+ i + j + k +
						"\" onchange=\"subjectSelected(this)\">"+
						"<option value=\"NOT_SELECTED\">--Subject--"+
						"</option>";
	var subjectsList = [];
	//if tt-has i-j'th entry with a non-batchable subject,
		//return "";
	entriesInThisSlot = searchMultipleRows(timeTable, "day", i, "slotNo", j, "classId", supportObject["classId"]);
	if(entriesInThisSlot != -1) {
			subjectEntry = search(subject, "subjectId", entriesInThisSlot[0]["subjectId"]);
			if(subjectEntry["batches"] = "0")
				return "";
	}	
	//sctlist = get-all-subjects-for-this-class from SCT table
	var sctlist = searchMultipleRows(subjectClassTeacher, "classId", supportObject["classId"]);
	//sbtlist = get-all-batched-subjects-for-this-class from SBT table
	var blist = searchMultipleRows(batchClass, "classId", supportObject["classId"]);
	var sbtlist = [];
	for (var i = 0; i < blist.length; i++) {
		var res = searchMultipleRows(subjectBatchTeacher, "batchId", blist[i]["batchId"]);
		sbtlist = sbtlist.concat(res);
		//if(sbtlist.length > 0)alert("sbtlist =  " + JSON.stringify(sbtlist));
	}
	//for sub in sbtlist
	lists = [sctlist, sbtlist];
	for(l in lists) {
			for(var m = 0; m < lists[l].length; m++) {
				if(lists[l] === sbtlist) 
					searchOn = "batchId";
				else
					searchOn = "classId";
				//currSubject = subjectcandidate(s);
				var currSubject= search(subject, "subjectId", lists[l][m]["subjectId"]);
				//b or c = batch-or-class-of-this-entry
				var currBatchOrClass = search(subject, searchOn, lists[l][m][searchOn]);
				//n = possible #entries for this subject
				var maxEntriesForSubject = currSubject["totalHrs"] / currSubject["eachSlot"];
				//c = # entries in tt for this batch-subject
				var existingEntries = search(timeTable, "day", i, "slotNo", j, 
										"subjectid", currSubject["subjectId"], 
										searchOn, currBatchOrClass[searchOn]);
				//alert("Current: " + JSON.stringify(currSubject));
				//if c = n, continue
				if(existingEntries == maxEntriesForSubject)
					continue;
				//if c > n, errror
				if(existingEntries > maxEntriesForSubject)
					alert("More than desired entries for " + currSubject["subjectShortName"] + "+" + currBatch["batchShortName"]);
				//t = teacher for this subject-class
				currTeacher = search(teacher, "teacherId", lists[l][m]["teacherId"]);
				//console.log("day " + i + " slot " + j + " currsubject " + JSON.stringify(currSubject));
				//for k = 0; k < sc->eachSlot; k++		
				for(var n = 0; n < currSubject["eachSlot"] - 1; n++); {
						nEntriesForTeacher = search(timeTable, "day", i, "slotNo", j + n, "teacherId", currTeacher["teacherId"]);
						//if t is busy in this slot(i,j)
							//continue
						if(nEntriesForTeacher != -1) {
							//console.log("Skipping .. teacher busy");
							continue;
						}
						//if j+subject->eachSlot > nSlots, i.e. if this entry will exceed totalSlots of day
								//continue
						if(j + n > nSlotsPerDay - 1) {
							//console.log("Skipping .. out of day busy");
							continue;
						}
				}
				// subject-batch combination has many repetitions of subject, so need to remove duplicates
				if(subjectsList.indexOf(currSubject) == -1)
						subjectsList.push(currSubject);
			}
		}
		if(subjectsList.length == 0)
			alert("day " + i + "slot " + j + "subjectlist: " + JSON.stringify(subjectsList));
		for(var r in subjectsList) {
			var subj = subjectsList[r]["subjectShortName"];
			select += "<option value =\""+ subj +"\">" + subj + "</option>";		
		}
		select += "</select>";
		return select;
}

function subjectChange(){
	var index = document.getElementById("subject-menu").selectedIndex;
	var subjectShortName = document.getElementById("subject-menu").options[index].text;
	document.getElementById("teacher-menu").selectedIndex = "-1";
	document.getElementById("room-menu").selectedIndex = "-1";
	document.getElementById("class-menu").selectedIndex = "-1";
	document.getElementById("batch-menu").selectedIndex = "-1";
	
	
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
function classChange(){
	var index = document.getElementById("class-menu").selectedIndex; /*Setting the select tag*/
	var classShortName = document.getElementById("class-menu").options[index].text;
	type = "class";
	id = classShortName;
	getSupportObject();//fills supportObject correctly depending on type and id;
	document.getElementById("teacher-menu").selectedIndex = "-1";
	document.getElementById("room-menu").selectedIndex = "-1";
	document.getElementById("subject-menu").selectedIndex = "-1";
	document.getElementById("batch-menu").selectedIndex = "-1";
	/*Clear previous timetable or message*/
	var tdTimetable = document.getElementById("mainTimeTable");
	if(tdTimetable.childNodes[1] != null)
		tdTimetable.removeChild(tdTimetable.childNodes[1]);

	/*Data needed for empty table*/
	var configrow = search(config, "configId", configId);
	var days = 6;
	var NoOfSlots = configrow["nSlots"];
	/*Depending on the no of batches in a class*/
	row = searchMultipleRows(batchClass, "classId", supportObject["classId"]); 
	var slottablePerDay = row.length; 
	var dayBegin = configrow["dayBegin"];
	var timePerSlot = configrow["slotDuration"];
	
	var table = createTable(days, NoOfSlots, slottablePerDay, dayBegin, timePerSlot);
	 /*Attaching the created empty table*/
	var div = document.createElement("div");
	div.setAttribute("id" , "timeTable");
	div.style.display = "none";
	div.appendChild(table);
	tdTimetable.appendChild(div);
	$("#timeTable").slideDown("fast");
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
						batchName = "-" + batchRow["batchName"];
					}
					var tr = document.createElement("tr");
 					// Note: inside i=days * j=NoOfSlots loop
					tr.innerHTML = 
							"<td>"+
								"<div class= \"box\" >"+
										"<span class = \"subjectentry\">" + 
											subjectRow["subjectShortName"] + 
										"</span>"+
										"<span class = \"batchentry\">"+ 
											batchName + 
										"</span>"+
										"<span class=\"delete\" >"+
											"x"+
										"</span>"+
								"</div>"+
								"<div class = \"animate" + i + "\">" +
									"<div class = \"box\">"+
										"<span class = \"roomentry\" >" 
												+ roomRow["roomShortName"] + 
										"</span>"+
										"<span class =\"teacherentry\">" +
												teacherRow["teacherShortName"] + 
										"</span>"+
									"</div>"+
								"</div>"+
						"</td>";
					
					if(eachSlot > 1) {
						for(var p = 1; p < eachSlot; p++) {
							document.getElementById("cell"+ i + (j + p)+ k).style.display = "none";
							enabledSlots[i - 1][j + p] = k + 1;
						}
						document.getElementById("cell"+ i + j + k).setAttribute("colspan", eachSlot);	
					}
					slottable.appendChild(tr);
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
				}	
			}
			var k = enabledSlots[i - 1][j];
			slottable = document.getElementById("slottable"+i+j+k);
			// Note: inside i=days * j=NoOfSlots loop, batches !=0
			slottable.innerHTML = 	
				"<tr>"+
					"<td>" +
						getEligibleSubjects(i, j, k) +
					"</td>"+
				"</tr>"+
				"<tr>"+
					"<td>"+
						"<select id=\"room"+ i + j + k + "\""+
							"onchange=\"roomSelected(this)\" "+
							"style=\"display:none;\" />"+
					"</td>"+
				"</tr>"+
				"<tr>"+
					"<td>"+
						"<select id=\"batch"+ i + j + k +"\""+
							"style=\"display:none;\"/>"+
					"</td>"+
				"</tr>"+
				"<tr>"+
					"<td>"+
						"<select id=\"teacher"+ i + j + k + "\""+
							"style=\"display:none;\"/>"+
					"</td>"+
				"</tr>";
		
			var rowspan = document.getElementById(""+ i).getAttribute("rowspan");
			if(rowspan == null)
				rowspan = ""+1;
			if(parseInt(rowspan) <= slotRows.length ) {
				document.getElementById(""+ i).setAttribute("rowspan", slotRows.length + parseInt(batches));
			}
		}
	}
	for(var i = 1; i <= 6; i++) {/*hiding extra part initially*/
		$(".animate"+i).hide();
	}

}

function roomChange(){
	document.getElementById("teacher-menu").selectedIndex = "-1";
	document.getElementById("subject-menu").selectedIndex = "-1";
	document.getElementById("class-menu").selectedIndex = "-1";
	document.getElementById("batch-menu").selectedIndex = "-1";
}

function batchChange(){
	document.getElementById("teacher-menu").selectedIndex = "-1";
	document.getElementById("room-menu").selectedIndex = "-1";
	document.getElementById("class-menu").selectedIndex = "-1";
	document.getElementById("subject-menu").selectedIndex = "-1";
}

function teacherChange(){
	document.getElementById("subject-menu").selectedIndex = "-1";
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
	var selectTag = document.getElementById("subject-menu");/*Filling all select tags Menu*/
	for (i in subject) {
		selectTag.appendChild(createOptionTag(subject[i]["subjectShortName"], 
							subject[i]["subjectShortName"], "subjectChange()"));		
	}
	selectTag.setAttribute("onchange", "subjectChange()");
	sortSelect(selectTag);
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
	selectTag.setAttribute("onchange", "classChange()");
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

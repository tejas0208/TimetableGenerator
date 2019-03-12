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
 * Copyright 2017 Abhijit A. M.(abhijit13@gmail.com)
 */

var index1;
var rowcount; /*Number of rows in a table in a particular config*/
function resetConfigurationHeader() {
	var i, Len, Options;
	Options = document.getElementById("configuration-menu");
	Len = Options.options.length;
	for(i = 0; i < Len; i++) {
		if(Options.options[i].value = "selectOne") {
			Options.options[i].selected = true;
			break;
		}
	}
}
function onClose(){
	var Name;
	if(type == "class") {
		if(classTable.length > 0) {
			index = document.getElementById("class-menu").selectedIndex;
			Name = document.getElementById("class-menu").options[index].text;
			PrintTitle(Name);
		}
	}
	else if(type == "room") {
		if(roomTable.length > 0) {
			Name = document.getElementById("room-menu").options[index1].text;
			PrintTitle(Name);
		}
	}
	else if(type == "teacher") {
		if(teacherTable.length > 0) {
			Name = document.getElementById("teacher-menu").options[index1].text;
			PrintTitle(Name);
		}
	}
	return;
}
function PrintTitle(Name) {
	document.getElementById("title").innerHTML =
		"<h2> " + search(dept, "deptId", currentDeptId)["deptName"] +
		"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
		"Timetable for " +
		"<span class=\"currTitle\"> Class: " + Name + " </span> </h2>";
}

function formClose(formName) {
	document.getElementById(formName).style.display = "none";
}
var currentFormName;
function formOpen(formName) {
	if (currentFormName)
		formClose(currentFormName);
	var form = document.getElementById(formName);
	document.getElementById("configurationDiv").appendChild(form);
	form.style.display = "block";
	currentFormName = formName;
}
function insertHeaderRow(tableName) {
	var table = document.getElementById(tableName);
	/* Set to empty. Required for recursive calls*/
	table.innerHTML = "";

	var tr = document.createElement("tr");
	tr.setAttribute("class", "headerRow");
	table.appendChild(tr);

	for(var j = 1; j < arguments.length - 1; j++) {
		var th = document.createElement("th");
		tr.appendChild(th);
		var div1 = document.createElement("label");
		var tc = document.createTextNode(arguments[j]);
		div1.appendChild(tc);
		th.appendChild(div1);
		if(j != 1){
			columnName = arguments[j];
			var i = document.createElement("span");
			i.setAttribute("class", "up-down-arrow");
			addEl(i,tableName,columnName,j-2,1);
			/*Due to closure problem of listener function, need to call another
			function to add eventListener(passing the last value of i).*/
			div1.appendChild(i);
			var i = document.createElement("span");
			i.setAttribute("class", "minbutton");
			addEl(i, tableName,columnName, j-2, -1);
			div1.appendChild(i);
		}
	}

	th = document.createElement("th");
	th.setAttribute("colspan", arguments[j]);
	th.setAttribute("text-align", "center");
	tr.appendChild(th);
	tc = document.createTextNode("Actions");
	th.appendChild(tc);
	return table;
}
function addEl(i,tableName,columnName,jindex,sortFlag){
	i.addEventListener("click", function(){sortAsc(tableName, columnName, jindex,
	sortFlag);});
}
function sortAsc(tableName,columnName,jindex,sortFlag){
	if(tableName == "teacherTable" || tableName == "roomTable" ||tableName ==
"subjectTable" ||tableName == "classTable"){
		if(tableName == "classTable")
			tb = "classTable";
		else
			tb = tableName.split("Table")[0];
		sortTb = this[tb];	//reference to teacher,room,subject.
		sortTb.sort(function(a, b){
			var x,y;
			var var1 = parseInt(a[Object.keys(a)[jindex]]);
			var var2 = parseInt(b[Object.keys(b)[jindex]]);
			if(!isNaN(var1) && !isNaN(var2)){
				x = var1;
				y = var2;
			}
			else{
				x = a[Object.keys(a)[jindex]].toLowerCase();
				//accessing key values using index number.
				y = b[Object.keys(b)[jindex]].toLowerCase();
			}
			if(x < y)
				//return ((sortTeachersOnFullName == 1? 1 : -1) * (-1));
				return -1*sortFlag;
			if(x > y)
				//return ((sortTeachersOnFullName == 1? 1 : -1) * (1));
				return 1*sortFlag;
			return 0;
		});
		if(tableName == "classTable")
			tb = "class";
		strhere = tb+"Form";
		tocall = this[strhere];
		tocall();
	}
	else{
		if(tableName == "sbtTable")
			tb = "subjectBatchTeacher";
		else if(tableName == "sctTable")
			tb = "subjectClassTeacher";
		else
			tb = tableName.split("Table")[0];
			sortAllTables(tb, jindex, sortFlag);
	}
}
function sortID(tbname, jindex, sortFlag){
	tableName = this[tbname];
	tableName.sort(function(a,b){
		var x = parseInt(a[Object.keys(a)[jindex]]);
		var y = parseInt(b[Object.keys(b)[jindex]]);
		if(x < y)
			return -1*sortFlag;
		if(x > y)
			return 1*sortFlag;
		return 0;
	});
}
function sortStr(tbname, jindex, sortFlag){
	tableName = this[tbname];
	tableName.sort(function(a,b){
		var x =a[Object.keys(a)[jindex]].toLowerCase();
		var y =b[Object.keys(b)[jindex]].toLowerCase();
		if(x < y)
			return -1*sortFlag;
		if(x > y)
			return 1*sortFlag;
		return 0;
	});
}
function sortAttributeWise(tbname, jindex, sortFlag, search_table, req_attr,
sort_attr){
	tableName = this[tbname];
	tableName.sort(function(a,b){
		var x = search(search_table, req_attr, a[req_attr])[sort_attr].toLowerCase();
		var y = search(search_table, req_attr, b[req_attr])[sort_attr].toLowerCase();
		if(x < y)
			return -1*sortFlag;
		if(x > y)
			return 1*sortFlag;
		return 0;
	});
}
function sortAllTables(tb, jindex, sortFlag){
	switch(tb){
		case "subjectClassTeacher":
			switch(jindex){
				case 0:sortID("subjectClassTeacher", jindex, sortFlag);break;
				case 1:sortAttributeWise("subjectClassTeacher", jindex, sortFlag,
				classTable, "classId","className");break;
				case 2:sortAttributeWise("subjectClassTeacher", jindex, sortFlag,
				subject, "subjectId", "subjectName");break;
				case 3:sortAttributeWise("subjectClassTeacher", jindex, sortFlag, teacher,
				"teacherId", "teacherName");break;
			}
			sctForm();
		break;
		case "subjectBatchTeacher":
			switch(jindex){
				case 0:sortID("subjectBatchTeacher", jindex, sortFlag);
					break;
				case 1:sortAttributeWise("subjectBatchTeacher", jindex, sortFlag, batch,
				"batchId", "batchName");break;
				case 2:sortAttributeWise("subjectBatchTeacher", jindex, sortFlag, subject,
				"subjectId", "subjectName");break;
				case 3:sortAttributeWise("subjectBatchTeacher", jindex, sortFlag, teacher,
				"teacherId", "teacherName");break;
			}
			sbtForm();
			break;
		case "batch":sortBatch(jindex, sortFlag);break;
		case "batchCanOverlap":
			switch(jindex){
				case 0 :callForFirstTime = 0;
					sortID("batchCanOverlapArr",jindex,sortFlag);
					break;
				case 1 :callForFirstTime = 0;
					sortStr("batchCanOverlapArr",jindex,sortFlag);
					break;
			}
			batchCanOverlapForm();
			break;
		case "overlappingSBT":
			switch(jindex){
				case 0:	callForFirstTime2 = 0;
					sortID("overlappingSbtArr",jindex,sortFlag);
					break;
				case 1: callForFirstTime2 = 0;
					sortStr("overlappingSbtArr",jindex,sortFlag);
					break;
				case 2: callForFirstTime2 = 0;
					sortStr("overlappingSbtArr",jindex,sortFlag);
					break;
			}
			 overlappingSBTForm();
			 break;
		case "classRoom":
			switch(jindex){
				case 0:sortID("classRoom",jindex,sortFlag);break;
				case 1:sortAttributeWise("classRoom", jindex, sortFlag, classTable,
				"classId", "classShortName");break;
				case 2:sortAttributeWise("classRoom", jindex, sortFlag, room, "roomId",
				"roomName");break;
			}
			classRoomForm();
			break;
		case "batchRoom":
			switch(jindex){
				case 0:sortID("batchRoom", jindex, sortFlag);break;
				case 1:sortAttributeWise("batchRoom", jindex, sortFlag, batch, "batchId",
				"batchName");break;
				case 2:sortAttributeWise("batchRoom", jindex, sortFlag, room, "roomId",
				"roomShortName");break;
			}
			batchRoomForm();
			break;
		case "subjectRoom":
			switch(jindex){
				case 0:sortID("subjectRoom", jindex, sortFlag);break;
				case 1:sortAttributeWise("subjectRoom", jindex, sortFlag, subject,
				"subjectId", "subjectName");break;
				case 2:sortAttributeWise("subjectRoom", jindex, sortFlag, room,
				"roomId", "roomShortName");break;
			}
			subjectRoomForm();
			break;
		case "config":
			switch(jindex){
				case 0:sortStr("config", 1, sortFlag);break;
				case 1:(function(){
					config.sort(function(a, b){
						var x = a[Object.keys(a)[2]];
						var y = b[Object.keys(b)[2]];
						var dt1 = new Date('1970/01/01 ' + x);
						var dt2 = new Date('1970/01/01 ' + y);
						return (dt1-dt2)*sortFlag;
					})
				})();
					break;
				case 2:sortID("config", jindex+1, sortFlag);break;
				case 3:sortID("config", jindex+1, sortFlag);break;
				case 4:sortAttributeWise("config", jindex+1, sortFlag, dept,
				"deptId", "deptShortName");break;
			}
			configForm();
			break;
	}
}
 function sortBatch(jindex, sortFlag){
	if(jindex == 3){
		batch.sort(function(a, b){
			currBatchId = search(batch,  "batchName",  a["batchName"])["batchId"];
			currBatchClassId = search(batchClass,  "batchId",  currBatchId)["classId"];
			x = search(classTable, "classId", currBatchClassId)["classShortName"];
			currBatchId = search(batch, "batchName", b["batchName"])["batchId"];
			currBatchClassId = search(batchClass, "batchId", currBatchId)["classId"];
			y = search(classTable, "classId", currBatchClassId)["classShortName"];
			if(x < y)
				return -1*sortFlag;
			if(x > y)
				return 1*sortFlag;
			return 0;
		});
	}
	else{
		batch.sort(function(a, b){
			var x, y;
			var var1 = parseInt(a[Object.keys(a)[jindex]]);
			var var2 = parseInt(b[Object.keys(b)[jindex]]);
			if(!isNaN(var1) && !isNaN(var2)){
				x = var1;
				y = var2;
			}
			else{
				x = a[Object.keys(a)[jindex]].toLowerCase();
				y = b[Object.keys(b)[jindex]].toLowerCase();
			}
			if(x < y)
				return -1*sortFlag;
			if(x > y)
				return 1*sortFlag;
			return 0;
		});
	}
	batchForm();
}
function insertHeaderRowTeacher(tableName) {
	var table = document.getElementById(tableName);
	/* Set to empty. Required for recursive calls*/
	table.innerHTML = "";

	var tr = document.createElement("tr");
	tr.setAttribute("class", "headerRow");
	table.appendChild(tr);
	var th = document.createElement("th");
	tr.appendChild(th);
	var tc = document.createTextNode(arguments[1]);
	th.appendChild(tc);
	var switchCaseTeacher;
	for(var j = 2; j < arguments.length - 2; j++) {
		th = document.createElement("th");
		var a = document.createElement("a");
		a.setAttribute("href", "javascript:void(0)");
		switchCaseTeacher = arguments[j];
		switch(switchCaseTeacher) {
			case arguments[2]:
				a.setAttribute("onClick", "sortTeacherOnFullName()");
				break;
			case arguments[3]:
				a.setAttribute("onClick", "sortTeacherOnShortName()");
				break;
			case arguments[4]:
				a.setAttribute("onClick", "sortTeacherOnMinHrs()");
				break;
			case arguments[5]:
				a.setAttribute("onClick", "sortTeacherOnMaxHrs()");
				break;
		}
		th.appendChild(a);
		tr.appendChild(th);
		tc = document.createTextNode(arguments[j]);
		a.appendChild(tc);
	}

	th = document.createElement("th");
	tr.appendChild(th);
	tc = document.createTextNode(arguments[j]);
	th.appendChild(tc);

	th = document.createElement("th");
	th.setAttribute("colspan", 2);
	th.setAttribute("text-align", "center");
	tr.appendChild(th);
	tc = document.createTextNode("Actions");
	th.appendChild(tc);
	return table;
}
function insertAddButton(row, onClickFunction, colspan) {
	var cell = insertCell(row);
	cell.setAttribute("colspan", colspan);
	cell.setAttribute("align","center");

	var button = document.createElement("button");
	button.value = "Add";
	button.name = "addbutton";
	cell.appendChild(button);

	var textNode = document.createTextNode("Add");
	button.appendChild(textNode);

	button.setAttribute("onclick", onClickFunction);
	return cell;
}
function insertDeleteButton(row, id, onClickFunction){
	var cell = insertCell(row);
	cell.setAttribute("align","center");
	var button = document.createElement("button");
	cell.appendChild(button);
	button.value = "Delete";
	button.name = id;
	var textNode = document.createTextNode("Delete");
	button.appendChild(textNode);
	button.setAttribute("onclick", onClickFunction);
	button.setAttribute("id", id);
	return cell;
}
function insertUpdateButton(row, id, onClickFunction) {
	var cell = insertCell(row);
	cell.setAttribute("align","center");
	var button = document.createElement("button");
	cell.appendChild(button);
	button.value = "Update";
	button.name = id;
	var textNode = document.createTextNode("Update");
	button.appendChild(textNode);
	if(currentFormName != "inputSCTForm" && currentFormName != "inputSBTForm") {
		button.disabled = true;
		button.onclick = function() {updateDefault(this.id);};
	}
	button.setAttribute("onclick", onClickFunction);
	button.setAttribute("id", id);
}
function insertTextColumn(row, id, text) {
	var cell = insertCell(row);
	var centerTag = document.createElement("center");
	centerTag.setAttribute("id", id);
	centerTag.setAttribute("class", "formText");
	centerTag.setAttribute("value", text);
	var centerText = document.createTextNode(text);
	centerTag.appendChild(centerText);
	cell.appendChild(centerTag);
	return cell;
}
function insertSelectTag(row, id, table, valueId, displayId) {
	var cell = insertCell(row);
	cell.setAttribute("align","center");
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id", id);
	var tag = createOptionTag(-1, "", false);
	selectTag.appendChild(tag);
	for (k in table) {
		var tag = createOptionTag(table[k][valueId], table[k][displayId], false);
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	return selectTag;
}
function insertInputBox(row, type, id, size, placeholder, value, title, minValue) {
	var cell = insertCell(row);
	inputTag = document.createElement("input");
	inputTag.setAttribute("type", type);	
	inputTag.setAttribute("id", id);	
	inputTag.setAttribute("size", size);	
	inputTag.setAttribute("placeholder", placeholder);
	inputTag.setAttribute("value", value);
	inputTag.setAttribute("required", "required");	
	if(title !== undefined)
		inputTag.setAttribute("title", title);
	if(minValue !== undefined) {
		inputTag.setAttribute("min", minValue);	
	}
	cell.appendChild(inputTag);
	inputTag.onchange = function() {enableUpdateButton(this.id);};
   	inputTag.onkeypress = function() {enableUpdateButton(this.id);};
   	inputTag.onpaste    = function() {enableUpdateButton(this.id);};
   	inputTag.oninput    = function() {enableUpdateButton(this.id);};
}
function insertRow(table, count) {
	row = table.insertRow(count);
	row.setAttribute("class", "inputFormRow");
	row.setAttribute("id", count);
	return row;
}
function highlightRowAfterAdd(formType) {
	var rows = formType.getElementsByTagName('tr');
	for (var i = 0; i < rows.length; i++) {
		if(formType.getAttribute('id') == "inputBatchForm" && rows[i].getAttribute('id') == 3) {
			rows[i].setAttribute("style", "background-color : green");
			continue;
		}
		if (((formType.getAttribute('id') != "inputBatchCanOverlapForm") &&
			(rows[i].getAttribute('id') == 2) && formType.getAttribute('id') != "inputBatchForm")
			||
			((rows[i].getAttribute('id') == 3) &&
			(formType.getAttribute('id') == "inputoverlappingSBTForm"))
			) {	if(((formType.getAttribute('id') == "inputBatchForm") || (formType.getAttribute('id') == "inputClassForm") 					|| (formType.getAttribute('id') == "inputSubjectForm") || (formType.getAttribute('id') == "inputRoomForm") 					|| (formType.getAttribute('id') == "inputTeacherForm") || (formType.getAttribute('id') == 					"inputConfigForm"))) {
					rows[i + 1].setAttribute("style", "background-color : green");
					break;
				}
				rows[i].setAttribute("style", "background-color : green");
        }
        if(formType.getAttribute('id') == "inputBatchCanOverlapForm" &&
			rows[i].getAttribute('id') == (rows.length - 2)) {
				rows[i].setAttribute("style", "background-color : green");
		}
	}
}
function insertCell(row) {
	var cell = row.insertCell(-1);
	cell.setAttribute("class", "inputFormCell");
	return cell;
}
function validateAlNumFields(input, inputName) {
	var regex = new RegExp("^[a-zA-Z]+[a-zA-Z0-9_~!@#=$ ^%&*:()'+.,<>/-]*$");
	if(regex.test(input)) {
		return true;
	}
	else {
		alert('The \"'+ inputName + '\" can contain only letters, digits, ' +
			'special characters except \'\"\' and should start only with an alphabet');
		return false;
	}
}
function batchForm() {
	formOpen("inputBatchForm");

	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("batchTable","  ","Id", "Name", "Strength", "Class", "1");
	/* ---- Adding "Add Batch Row" -----------------------*/
	row = insertRow(table, 1);
	insertTextColumn(row, "", " ");
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);
	insertInputBox(row, "text", "batchNameAdd", "32", "Enter Batch Name", "", "Batch Name (Short)");
	insertInputBox(row, "number", "batchCountAdd", "3", "Strength", "", "Batch Strength", "1");
	insertSelectTag(row, "batchClassAdd", classTable, "classId", "classShortName");

	cell = insertAddButton(row, "batchInsert()", 1);

	/* ---- Adding Search Box -----------*/
	var searchrow = insertRow(table, 2);
	insertTextColumn(searchrow, "", " ");	
	insertTextColumn(searchrow, "blankID", "");
	insertInputBox(searchrow, "text", "myInput1", 32, "Search for batchnames..", "", "Batch Name (Short)");
	searchrow.addEventListener("keyup", function() {Searchrow("batchTable", "batchName_", "myInput1")});

	searchrow.setAttribute("class","noMod");
	/* Add the existing batch entries */
	tr = document.getElementById("batchTable").rows[0];
	var ncells = tr.cells.length;
	var count = 3;
	for (i in batch) {
		currBatch = batch[i];
		var row = insertRow(table, count);
		
		insertInputBox(row, "checkbox", "bfCheckBox" + count, "2", "", "", "", "");

		insertTextColumn(row, "bfCenter_" + count, currBatch["batchId"]);

		insertInputBox(row, "text", "batchName_" + count, "32",
					"Batch Name", currBatch["batchName"], "Batch Name (Short)");
		insertInputBox(row, "number", "batchCount_" + count, "3",
					"Strength", currBatch["batchCount"],  "Batch Strength", "1");

		var cell = insertCell(row);
		cell.setAttribute("align","center");
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","classShortName_" + count);
		var tag = createOptionTag("None", "None", true);
		selectTag.appendChild(tag);
		for (k in classTable) {
			currBatchId = search(batch, "batchName", currBatch["batchName"])["batchId"];
			currBatchClassId = search(batchClass, "batchId", currBatchId)["classId"];
			if(classTable[k]["classId"] == currBatchClassId)
				var tag = createOptionTag(classTable[k]["classShortName"],
							classTable[k]["classShortName"], true);
			else
				var tag = createOptionTag(classTable[k]["classShortName"],
							classTable[k]["classShortName"], false);
			selectTag.appendChild(tag);
		}
		cell.appendChild(selectTag);

		//insertUpdateButton(row, "bUpdateButton_" + count, "batchUpdate(" + count + ")");
		insertDeleteButton(row, "bDeleteButton_" + count, "batchDelete(" + count + ")");

		count++;
	}
	rowcount = count;
}
function batchInsert() {
	var batchName, batchCount;
	batchName = document.getElementById("batchNameAdd");
	batchCount = document.getElementById("batchCountAdd");
	classId = document.getElementById("batchClassAdd");
	//Checking parameters
	if(checkParameterValidity(batchName, batchCount, classId) == false ) {
		return;	
	}
	if(alreadyValueNotPresentInDB(batch,  "batchName", 
				batchName.value) == false) {
		return;	
	}
	if(classId.value == -1) {
		alert("Please select a class for the batch");
		return;
	}
	batchName = batchName.value;
	if(!validateAlNumFields(batchName,"Batch Name"))
		return;
	batchCount = batchCount.value;
	classId = classId.value;
	className = search(classTable, "classId", classId)["classShortName"]
	newClassCount = search(classTable, "classShortName", className)["classCount"];
	if(parseInt(batchCount) > parseInt(newClassCount)) {
		alert("Error: Batch strength exceeds class strength." +
			"\n\tStrength of "+ className + " is " + newClassCount + ".");
		return;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//batchChange(false);	/* TODO: Check this call */
				newbatch = {};
				newbatch["batchName"] = batchName;
				newbatch["batchId"] = response["batchId"];
				newbatch["snapshotId"] = currentSnapshotId;
				newbatch["batchCount"] = batchCount;
				batch.unshift(newbatch);
				batchClass = getOneTable("batchClass", false).batchClass;
				loadSelectMenus();
				fillTable2(true);
				batchForm();
				var formType = document.getElementById("inputBatchForm");
				highlightRowAfterAdd(formType);
			} else {
				alert("batchInsert " + batchName + " Failed");
				console.log("batchInsert " + batchName + " Failed. Error: " + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchInsert&batchName=" + batchName + "&batchCount=" +
				batchCount + "&snapshotId=" + currentSnapshotId +"&classId=" + classId);

}
function batchClassUpdate(i, currBatchId, currBatchClassId) {
	var row = i;
	var xhttp = new XMLHttpRequest();
	/*xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("bUpdateButton_" + i).childNodes[0].nodeValue = "Updated";
				document.getElementById("bDeleteButton_" + i).disabled = false;
				document.getElementById("bUpdateButton_" + i).disabled = false;
				var index = response["bcId"];
				if(index != -1) {// insert was done
					newBatchClass = {};
					newBatchClass["bcId"] = index;
					newBatchClass["batchId"] = currBatchId;
					newBatchClass["classId"] = currBatchClassId;
					batchClass.unshift(newBatchClass);
				} else {
					var index = searchIndex(batchClass, "batchId", currBatchId);
					batchClass[index]["classId"] = currBatchClassId;
				}
			}
			else {
				alert("Batch " + currBatchId + ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("bDeleteButton_" + i).disabled = false;
				document.getElementById("bUpdateButton_" + i).disabled = false;
			}
		}
	}*/
	xhttp.open("POST", "timetable.php", false); // synchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchClassUpdate&batchId=" + currBatchId + "&classId=" +
				currBatchClassId + "&snapshotId=" + currentSnapshotId);
	response = JSON.parse(xhttp.responseText);
	if(response["Success"] == "True") {
		//document.getElementById("bUpdateButton_" + i).childNodes[0].nodeValue = "Updated";
		document.getElementById("bDeleteButton_" + i).disabled = false;
		//document.getElementById("bUpdateButton_" + i).disabled = false;
		var index = response["bcId"];
		if(index != -1) {// insert was done
			newBatchClass = {};
			newBatchClass["bcId"] = index;
			newBatchClass["batchId"] = currBatchId;
			newBatchClass["classId"] = currBatchClassId;
			batchClass.unshift(newBatchClass);
		} else {
			var index = searchIndex(batchClass, "batchId", currBatchId);
			batchClass[index]["classId"] = currBatchClassId;
		}
	}
	else {
		alert("Batch " + currBatchId + ": Update Failed.\nError:\n" + response["Error"]);
		document.getElementById("bDeleteButton_" + i).disabled = false;
		//document.getElementById("bUpdateButton_" + i).disabled = false;
	}
}
function batchUpdate(i) {
	var row = i;
	var batchName, batchCount;
	batchName = document.getElementById("batchName_" + row).value;
	batchCount = document.getElementById("batchCount_" + row).value;
	batchId = document.getElementById("bfCenter_" + row).childNodes[0].nodeValue;
	//document.getElementById("bUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("bDeleteButton_" + row).disabled = true;
	//document.getElementById("bUpdateButton_" + row).disabled = true;

	newClassName = document.getElementById("classShortName_" + row).value;
	newClassId = search(classTable, "classShortName", newClassName)["classId"];
	//currBatchId = search(batch, "batchName", batch[row-2]["batchName"])["batchId"];
	currBatchId = batchId;
	currBatchClassId = search(batchClass, "batchId", currBatchId)["classId"];
	currBatchClassShortName = search(classTable, "classId", currBatchClassId)["classShortName"];
	//alert(currBatchId + " " + currBatchClassId + " " + currBatchClassShortName + " " + newClassName);
	if(newClassId != currBatchClassId) {
		//alert(currBatchId);
		batchClassUpdate(row, currBatchId, newClassId);
	}

	// Check undo/redo stack for clashing batchId
	ret = urCheck("batchId", batchId);
	if(ret === false)
		return;

	row = i - 3;
	//var batchOrigName = batch[row]["batchName"];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//document.getElementById("bUpdateButton_" + i).childNodes[0].nodeValue = "Updated";
				document.getElementById("bDeleteButton_" + i).disabled = false;
				//document.getElementById("bUpdateButton_" + i).disabled = false;
				batch[row]["batchName"] = batchName; /* new name inserted in array */
				batch[row]["batchCount"] = batchCount;
				loadSelectMenus();
				fillTable2(true);
				batchForm();
			}
			else {
				//document.getElementById("bUpdateButton_" + i).childNodes[0].nodeValue = "Update";
				alert("Batch " + batchName + ": Update Failed");
				console.log("Batch " + batchName + ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("bDeleteButton_" + i).disabled = false;
				//document.getElementById("bUpdateButton_" + i).disabled = false;
				batchForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchUpdate&batchName=" + batchName + "&batchCount=" + batchCount +
				"&batchId=" + batchId + "&snapshotId=" + currentSnapshotId);

}
function batchDelete(i) {
	var row = i;
	var batchName;
	var batchId;
	var formType = document.getElementById("inputBatchForm");
	highlightRowWhenDelete(formType, row);
	var sure = confirm("Warning: Deleting Batch will delete all related " +
					  "subject-teacher mappings, timetable entries, etc.\n" +
					  "This can not be undone. \n" +
					  "Are you sure?");
	if(sure != true) {
		unhighlightRowWhenDeleteCancel(formType, row);
		return -1;
	}
	//batchName = document.getElementById("batchName_" + row).value;
	batchId = document.getElementById("bfCenter_" + row).childNodes[0].nodeValue;

	// Check undo/redo stack for clashing batchId
	ret = urCheck("batchId", batchId);
	if(ret === false)
		return;

	document.getElementById("bDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("bDeleteButton_" + row).disabled = true;
	//document.getElementById("bUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("bDeleteButton_" + row).value = "Delete";
				batch.splice(row - 3, 1);
				if(type == "batch") {
					var index2 = document.getElementById("batch-menu").selectedIndex;
					var currBatchName = document.getElementById("batch-menu").options[index2].text;
				}
				loadSelectMenus();
				if(type == "batch" && currBatchName == batchName) {
					var j;
					if(row == rowcount - 1)
						j = 3;
					else
						j = row + 1;
					var batchOptions = document.getElementById("batch-menu");
					if(batchOptions.options.length != 1) {
						batchName = document.getElementById("batchName_" + j).value;
						for(var i = 0; i < batchOptions.options.length; i++) {
							if(batchOptions.options[i].value == batchName) {
								batchOptions.options[i].selected = true;
								break;
							}
						}
						batchChange(true);
					}
					else { /*No timetable to be loaded*/
						$("#mainTimeTable").append("<center><B>No TimeTable to be loaded </B><br>" +
							"Please select option from above catgories</center>");
						document.getElementById("title").innerHTML =  "<h2> Timetable for Computer Engg and IT (Effective 15 Jan 2018)</h2>";
					}
				}
				else
					fillTable2(true);
				batchForm();
			} else {
				alert("Batch " + batchName + ": Deletion Failed");
				console.log("Batch " + batchName + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("bDeleteButton_" + row).value = "Delete"
				//document.getElementById("bUpdateButton_" + row).disabled = false;
				document.getElementById("bDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchDelete&batchId=" + batchId + "&snapshotId=" + currentSnapshotId);
}

var overlaps = [];
function findInArray(overlaps, id) {
	var i, j;
	for(i = 0; i < overlaps.length; i++) {
		for(j = 0; j < overlaps[i].length; j++) {
				if(overlaps[i][j] == id)
					return i;
		}
	}
	return -1;
}
batchCanOverlapArr = [];
var callForFirstTime = 1;
function fillBatchCanOverlapArr(){
	/*forming overlaps array*/
	var count = -1;
	overlaps = [];
	for (i in batchCanOverlap) {
		curr = batchCanOverlap[i];
		/* debug */
		b1 = search(batch, "batchId", curr["batchId"])["batchName"];
		b2 = search(batch, "batchId", curr["batchOverlapId"])["batchName"];

		index1 = findInArray(overlaps, curr["batchId"]);
		index2 = findInArray(overlaps, curr["batchOverlapId"]);
		//alert("index1 = " + index1 + " index2 = " + index2);
		if(index1 != -1 && index2 != -1)
			if(index1 != index2)
				alert("ERROR: index mismatch");
			else
				;//already exists
		else if(index1 != -1) {
			//alert("index1 = " + index1 + " index2 = " + index2);
			overlaps[index1].push(curr["batchOverlapId"]);
		}
		else if	(index2 != -1) {
			//alert("index1 = " + index1 + " index2 = " + index2);
			overlaps[index2].push(curr["batchId"]);
		}
		else {
			overlaps[++count] = [];
			overlaps[count].push(curr["batchId"]);
			overlaps[count].push(curr["batchOverlapId"]);
		}
	}
	/*need to form an array*/
	count = 2;
	for(i = 0; i < overlaps.length; i++) {
		batchCanOverlapArr[i] = {};
		curr = overlaps[i];
		currText = "";
		for(j = 0; j < overlaps[i].length; j++) {
			currText += search(batch, "batchId", overlaps[i][j])["batchName"] + ",";
		}
		//alert("currText = " + currText);
		batchCanOverlapArr[i]['SN'] = count - 1;
		batchCanOverlapArr[i]['OverlapsAllowed'] = currText;
		count++;
	}
}
function batchCanOverlapForm() {
	if(callForFirstTime == 1)
		fillBatchCanOverlapArr();
	formOpen("inputBatchCanOverlapForm");
	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("batchCanOverlapTable","  ", "SN", "Select Batches Which Can Overlap", 1);
	/* ---- Adding "Add Batch Row" -----------------------*/
	row = insertRow(table, 1);
	insertTextColumn(row, "", " ");
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);
	selectTag = insertSelectTag(row, "batchCanOverlapAdd", batch, "batchId", "batchName");
	selectTag.setAttribute("id","batchCanOverlapAdd");
	selectTag.setAttribute("multiple","multiple");
	selectTag.setAttribute("width", "100%");
	/* Remove the -1 entry */
	document.getElementById("batchCanOverlapAdd").removeChild(
		document.getElementById("batchCanOverlapAdd")[0]);
	$("#batchCanOverlapAdd").select2({
		tokenSeparators: [','],
		width: '90%',
	});
	$("#batchCanOverlapAdd").on("change", filterBatchCanOverlapSelect);
	cell = insertAddButton(row, "batchCanOverlapInsert()", 1);
	/* Add the existing batch entries */
	tr = document.getElementById("batchCanOverlapTable").rows[0];
	var ncells = tr.cells.length;//4
	//alert(overlaps[0]); gives as output all the batch id(1,2,3,4) that overlaps with each other.
	count = 2;
	for(i = 0; i < batchCanOverlapArr.length; i++) {
		curr = batchCanOverlapArr[i];
		var row = insertRow(table, count);
		insertInputBox(row, "checkbox", "bcoCheckBox" + count, "2", "", "", "", "");
		insertTextColumn(row, "center1_" + count,curr['SN']);
		insertTextColumn(row, "center1_" + count, curr['OverlapsAllowed']);

		insertDeleteButton(row, "batchCanOverlapDeleteButton_" + count,
							"batchCanOverlapDelete(" + count + ")");
		count++;

	}
}
/*Want to make an array that consist of batchCanOverlapForm*/
function batchCanOverlapDelete(i) {
	var row = i - 2;
	var formType = document.getElementById("inputBatchCanOverlapForm");
	highlightRowWhenDelete(formType, row + 2);
	var sure = confirm("Warning: Are you sure?");
	if(sure != true) {
		unhighlightRowWhenDeleteCancel(formType, row + 2);
		return -1;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("batchCanOverlapDeleteButton_" + i).value = "Delete"
				overlaps.splice(row, 1);
				batchCanOverlap = getOneTable("batchCanOverlap", false).batchCanOverlap;
				fillTable2(true);
				batchCanOverlapForm();
			} else {
				alert("BatchCanOverlap " + JSON.stringify(overlaps[row]) +
						": Deletion Failed");
				console.log("BatchCanOverlap " + JSON.stringify(overlaps[row]) +
						": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("batchCanOverlapDeleteButton_" + i).value = "Delete"
				document.getElementById("batchCanOverlapUpdateButton_" + i).disabled = false;
				document.getElementById("batchCanOverlapDeleteButton_" +
						i).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	//alert("Asking to delete " + JSON.stringify(overlaps[row]));
	xhttp.send("reqType=batchCanOverlapDelete&batches=" + JSON.stringify(overlaps[row]) +
				"&snapshotId=" + currentSnapshotId);


}
function filterBatchCanOverlapSelect() {
	var batchNames;
	save = $("#batchCanOverlapAdd").val(); 
	batchNames = "" + $("#batchCanOverlapAdd").val(); // to convert object to a string
	nEntries = batchNames.split(',');
	if(nEntries.length < 1) {
		return;
	}
	selectTag = document.getElementById("batchCanOverlapAdd");
	entry = nEntries[0];
	classEntry = search(batchClass, "batchId", entry)["classId"];
	for(i = 0; i < selectTag.childNodes.length; i++) {
		currOption = selectTag.childNodes[i];
		currClass = search(batchClass, "batchId", currOption.value)["classId"];
		if(currClass != classEntry) {
			selectTag.remove(i);
			i--;
		}
	}
	$("#batchCanOverlapAdd").val(save); // to convert object to a string
}
function batchCanOverlapInsert() {
	var batchNames;
	batchNames = "" + $("#batchCanOverlapAdd").val(); // to convert object to a string
	nEntries = batchNames.split(',');
	/* Remove the -1 entry */
	if(nEntries.length < 2) {
		alert("minimum 2 entries required");
		return;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//batchChange(false);	/* TODO: Check this call */
				batchCanOverlap = getOneTable("batchCanOverlap", false).batchCanOverlap;
				fillTable2(true);
				batchCanOverlapForm();
				var formType = document.getElementById("inputBatchCanOverlapForm");
				highlightRowAfterAdd(formType);
			} else {
				alert("batchInsert " + batchNames + " Failed. \n" +
					  "Possibly the batches are already part of some overlapping batchgroup.");
				console.log("batchInsert " + batchNames + " Failed. \n" +
					  "Possibly the batches are already part of some overlapping batchgroup.\n" +
					  "Server's Error: " + response["Error"]);

			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchCanOverlapInsert&batches=" + nEntries +
				"&snapshotId=" + currentSnapshotId);

}
function batchRoomForm() {
	formOpen("inputBatchRoomForm");
	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("batchRoomTable","  ", "ID", "Batch", "Room", 2);

	/* ---- Adding "Add batchRoom Row" -----------------------*/
	row = insertRow(table, 1);
	insertTextColumn(row, "", " ");
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);

	selectTag = insertSelectTag(row, "brBatchAdd", batch, "batchId", "batchName");
	$("#brBatchAdd").select2({
		placeholder: "Insert Batch Name",
		width: '90%'
	});

	selectTag = insertSelectTag(row, "brRoomAdd", room, "roomId", "roomShortName");
	$("#brRoomAdd").select2({
		placeholder: "Room Name",
		width: '80%'
	});

	cell = insertAddButton(row, "batchRoomInsert()", 2);

	/* Add the existing batchRoom entries */
	tr = document.getElementById("batchRoomTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;
	for (i in batchRoom) {
		currBatchRoom = batchRoom[i];
		var row = insertRow(table, count);

		insertInputBox(row, "checkbox", "brCheckBox" + count, "2", "", "", "", "");

		insertTextColumn(row, "brCenter_" + count, currBatchRoom["brId"]);

		var cell = insertCell(row);
		cell.setAttribute("align","center");
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","batch_"+count);
		for (k in batch) {
			if(batch[k]["batchId"] == currBatchRoom["batchId"])
				var tag = createOptionTag(batch[k]["batchId"], batch[k]["batchName"], true);
			else
				var tag = createOptionTag(batch[k]["batchId"], batch[k]["batchName"], false);
			selectTag.appendChild(tag);
		}
		cell.appendChild(selectTag);
		var id = "batch_" + count;
		updateDefault(id);
		selectTag.onchange = function() {enableUpdateButton(this.id);};

		var cell = insertCell(row);
		cell.setAttribute("align","center");
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","room_"+count);
		for (k in room) {
			if(room[k]["batches"] == 1) /* don't show batchable rooms here */
				continue;
			if(room[k]["roomId"] == currBatchRoom["roomId"])
				var tag = createOptionTag(room[k]["roomId"], room[k]["roomName"], true);
			else
				var tag = createOptionTag(room[k]["roomId"], room[k]["roomName"], false);
			selectTag.appendChild(tag);
		}
		cell.appendChild(selectTag);
		var id = "room_" + count;
		updateDefault(id);
		selectTag.onchange = function() {enableUpdateButton(this.id);};

		insertUpdateButton(row, "batchRoomUpdateButton_" + count,
							"batchRoomUpdate(" + count + ")");
		insertDeleteButton(row, "batchRoomDeleteButton_" + count,
							"batchRoomDelete(" + count + ")");
		count++;
	}
}
function batchRoomInsert() {
	var batchId, roomId,  brId;
	batchId = document.getElementById("brBatchAdd").value;
	roomId = document.getElementById("brRoomAdd").value;
	/* parameter checking */
	if(selectTagsValueEmpty(batchId, roomId) == true) {
		return;
	}
	roomShortName = search(room, "roomId", roomId)["roomShortName"];
	batchName = search(batch, "batchId", batchId)["batchName"];

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//batchRoomChange(false);	/* TODO: Check this call */
				newBatchRoom = {};
				newBatchRoom["roomId"] = roomId;
				newBatchRoom["batchId"] = batchId;
				newBatchRoom["brId"] = response["brId"];
				batchRoom.unshift(newBatchRoom);
				fillTable2(true);
				batchRoomForm();
				var formType = document.getElementById("inputBatchRoomForm");
				highlightRowAfterAdd(formType);
			} else {
				alert("Insert batch: "
						+ batchName + " Failed.");
				console.log("Insert batch: "
						+ batchName + " Failed. \nError From Server: \n" + response["Error"]);

			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchRoomInsert&roomId=" + roomId + "&batchId=" +
				batchId + "&snapshotId=" + currentSnapshotId);

}

function batchRoomUpdate(i) {
	var row = i;
	var batchId, roomId,  brId;
	batchId = document.getElementById("batch_" + row).value;
	roomId = document.getElementById("room_" + row).value;
	/* parameter checking */
	if(selectTagsValueEmpty(batchId, roomId) == true) {
		return;
	}
	brId = document.getElementById("brCenter_" + row).childNodes[0].nodeValue;
	document.getElementById("batchRoomUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("batchRoomDeleteButton_" + row).disabled = true;
	document.getElementById("batchRoomUpdateButton_" + row).disabled = true;
	/* debug */
	roomShortName = search(room, "roomId", roomId)["roomShortName"];
	batchName = search(batch, "batchId", batchId)["batchName"];

	row = i - 2;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			//alert("batchRoom Row " + row + "Updated");
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("batchRoomUpdateButton_" +
						i).childNodes[0].nodeValue = "Updated";
				document.getElementById("batchRoomDeleteButton_" + i).disabled = false;
				document.getElementById("batchRoomUpdateButton_" + i).disabled = false;
				batchRoom[row]["roomId"] = roomId;
				batchRoom[row]["batchId"] = batchId;
				fillTable2(true);
				batchRoomForm();
			}
			else {
				document.getElementById("batchRoomUpdateButton_" +
						i).childNodes[0].nodeValue = "Update";
				alert("brId = " + brId + ": Update Failed for Subject: " +
									roomShortName + + " batch: " + batchName);
				console.log("brId = " + brId + ": Update Failed for Subject: " +
									roomShortName + + " batch: " + batchName
									+ "\nError:\n" + response["Error"]);

				document.getElementById("batchRoomDeleteButton_" + i).disabled = false;
				document.getElementById("batchRoomUpdateButton_" + i).disabled = false;
				batchRoomForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchRoomUpdate&roomId=" + roomId + "&batchId=" + batchId +
				"&brId=" + brId + "&snapshotId=" + currentSnapshotId);

}
function batchRoomDelete(i) {
	var row = i;
	var brId;
	var formType = document.getElementById("inputBatchRoomForm");
	highlightRowWhenDelete(formType, row);
	var sure = confirm("This will delete all related timetable entries also\n"
				+ "This can not be undone. \nAre you sure?");
	if(sure != true) {
		unhighlightRowWhenDeleteCancel(formType, row);
		return -1;
	}
	brId = document.getElementById("brCenter_" + row).childNodes[0].nodeValue;
	document.getElementById("batchRoomDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("batchRoomDeleteButton_" + row).disabled = true;
	document.getElementById("batchRoomUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("batchRoomDeleteButton_" + row).value = "Delete"
				batchRoom.splice(i - 2, 1);
				fillTable2(true);
				batchRoomForm();
			} else {
				alert("batchRoom " + brId + ": Deletion Failed.");
				console.log("batchRoom " + brId + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("batchRoomDeleteButton_" + row).value = "Delete"
				document.getElementById("batchRoomUpdateButton_" + row).disabled = false;
				document.getElementById("batchRoomDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // synchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchRoomDelete&brId=" + brId + "&snapshotId=" + currentSnapshotId);
}
function classForm() {
	formOpen("inputClassForm");

	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("classTable","  ", "SN", "Name", "Short Name", "Semester", "Strength", 2);

	/* ---- Adding "Add Class Row" -----------------------*/
	row = insertRow(table, 1);
	insertTextColumn(row, "", " ");
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);
	insertInputBox(row, "text", "classNameAdd", "32", "Enter Class Name", "","Class Name");
	insertInputBox(row, "text", "classShortNameAdd", "8", "Enter Short Name", "", "Class ShortName");
	insertInputBox(row, "number", "semesterAdd", "3", "Semester", "", "Semester", "1");
	insertInputBox(row, "number", "classCountAdd", "3", "Strength", "", "Strength: No. of Students", "1");
	cell = insertAddButton(row, "classInsert()", 2);

	/* ---- Adding Search Box ----------- */
	var searchrow = insertRow(table, 2);
	insertTextColumn(searchrow, "", " ");	
	insertTextColumn(searchrow, "blankID", "");
	insertInputBox(searchrow, "text", "myInput2", 32, "Search for class names..", "", "Class Name");
	searchrow.addEventListener("keyup", function() {Searchrow("classTable", "className_", "myInput2")});

	searchrow.setAttribute("class","noMod");
	/* Add the existing class entries */
	tr = document.getElementById("classTable").rows[0];
	var ncells = tr.cells.length;
	var count = 3;

	for (i in classTable) {
		currClass = classTable[i];
		var row = insertRow(table, count);

		insertInputBox(row, "checkbox", "cCheckBox" + count, "2", "", "", "", "");

		insertTextColumn(row, "cCenter_" + count, currClass["classId"]);

		insertInputBox(row, "text", "className_" + count, "32",
					"Class Name", currClass["className"], "Class Name");
		insertInputBox(row, "text", "classShortName_" + count, "8",
					"Class Short Name", currClass["classShortName"],  "Class ShortName");
		insertInputBox(row, "number", "semester_" + count, "3",
					"Semester", currClass["semester"], "Semester", "1" );
		insertInputBox(row, "number", "classCount_" + count, "3",
					"Strength", currClass["classCount"], "Strength: No. of Students", "1" );

		insertUpdateButton(row, "cUpdateButton_" + count,
							"classUpdate(" + count + ")");
		insertDeleteButton(row, "cDeleteButton_" + count,
							"classDelete(" + count + ")");

		count++;
	}
	rowcount = count;
}
function classInsert() {
	var row = i;
	var className, classShortName, semester, classCount;
	className = document.getElementById("classNameAdd");
	classShortName = document.getElementById("classShortNameAdd");
	semester = document.getElementById("semesterAdd");
	classCount = document.getElementById("classCountAdd");

	//Checking Parameter
	if(checkParameterValidity(className, classShortName, 
		semester, classCount) == false ) {
		return;	
	}
	if(alreadyValueNotPresentInDB(classTable,  "classShortName", 
				classShortName.value) == false) {
		return;	
	}

	className = className.value;
	if(!validateAlNumFields(className, "Class Name"))
		return;
	classShortName = classShortName.value;
	if(!validateAlNumFields(classShortName, "Class Short Name"))
		return;
	semester = semester.value;
	classCount = classCount.value;

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//classChange(false);	/* TODO: Check this call */
				newclass = {};
				newclass["className"] = className;
				newclass["classShortName"] = classShortName;
				newclass["semester"] = semester;
				newclass["classCount"] = classCount;
				newclass["snapshotId"] = currentSnapshotId;
				newclass["classId"] = response["classId"];
				classTable.unshift(newclass);
				loadSelectMenus();
				fillTable2(true);
				classForm();
				var formType = document.getElementById("inputClassForm");
				highlightRowAfterAdd(formType);
			} else {
				alert("classInsert " + classShortName + " Failed");
				console.log("classInsert " + classShortName + " Failed. Error: " + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=classInsert&className=" + className + "&classShortName=" +
				classShortName + "&semester=" + semester + "&classCount=" +
				classCount + "&snapshotId=" + currentSnapshotId);

}

function classUpdate(i) {
	var row = i;
	var className, classShortName, semester, classCount;
	classId = document.getElementById("cCenter_" + row).childNodes[0].nodeValue;

	className = document.getElementById("className_" + row);
	classShortName = document.getElementById("classShortName_" + row);
	semester = document.getElementById("semester_" + row);
	classCount = document.getElementById("classCount_" + row);

	//Checking Parameter
	if(checkParameterValidity(className, classShortName, 
		semester, classCount) == false ) {
		return;	
	}
	if(alreadyValueNotPresentInDB(classTable,  "classShortName", 
				classShortName.value, "classId", classId) == false) {
		return;	
	}

	className = className.value;
	if(!validateAlNumFields(className, "Class Name"))
		return;
	classShortName = classShortName.value;
	if(!validateAlNumFields(classShortName, "Class Short Name"))
		return;

	// Check undo/redo stack for clashing classId
	ret = urCheck("classId", classId);
	if(ret === false)
		return;

	semester = semester.value;
	classCount = classCount.value;
	document.getElementById("cUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("cDeleteButton_" + row).disabled = true;
	document.getElementById("cUpdateButton_" + row).disabled = true;

	row = i - 3;
	var classOrigShortName = classTable[row]["classShortName"];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
			//alert("class Row " + row + "Updated");
				document.getElementById("cUpdateButton_" + i).childNodes[0].nodeValue = "Updated";
				document.getElementById("cDeleteButton_" + i).disabled = false;
				document.getElementById("cUpdateButton_" + i).disabled = false;
				classTable[row]["className"] = className;
				classTable[row]["classShortName"] = classShortName;
				classTable[row]["semester"] = semester;
				classTable[row]["classCount"] = classCount;
				loadSelectMenus();
				if(type == "class")
					currTableId = classShortName;
				fillTable2(true);
				classForm();
			}
			else {
				document.getElementById("cUpdateButton_" + i).childNodes[0].nodeValue = "Update";
				alert("Class " + classShortName + ": Update Failed.");
				console.log("Class " + classShortName + ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("cDeleteButton_" + i).disabled = false;
				document.getElementById("cUpdateButton_" + i).disabled = false;
				classForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=classUpdate&className=" + className + "&classShortName=" +
			classShortName + "&semester=" + semester + "&classCount=" + classCount +
			"&classId=" + classId + "&snapshotId=" + currentSnapshotId);
}
function classDelete(i) {
	var row = i;
	var classShortName;
	var classId;
	var formType = document.getElementById("inputClassForm");
	highlightRowWhenDelete(formType, row);
	var sure = confirm("Warning: Deleting Class will delete all related " +
			  "subject-teacher mappings, timetable entries, etc.\n" +
			  "This can not be undone. \n" +
			  "Are you sure?");
	if(sure != true) {
		unhighlightRowWhenDeleteCancel(formType, row);
		return -1;
		}
	//classShortName = document.getElementById("classShortName_" + row).value;
	classId = document.getElementById("cCenter_" + row).childNodes[0].nodeValue;

	// Check undo/redo stack for clashing classId
	ret = urCheck("classId", classId);
	if(ret === false)
		return;

	document.getElementById("cDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("cDeleteButton_" + row).disabled = true;
	document.getElementById("cUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("cDeleteButton_" + row).value = "Delete";
				classTable.splice(row - 3, 1);
				if(type == "class") {
					var index2 = document.getElementById("class-menu").selectedIndex;
					var classname = document.getElementById("class-menu").options[index2].text;
				}
				loadSelectMenus();
				if(type == "class" && classname == classShortName) {
					var j;
					if(row == rowcount - 1)
						j = 2;
					else
						j = row + 1;
					var classOptions = document.getElementById("class-menu");
					if(classOptions.options.length != 1) {
						classShortName = document.getElementById("classShortName_" + j).value;
						for(var i = 0; i < classOptions.options.length; i++) {
							if(classOptions.options[i].value == classShortName) {
								classOptions.options[i].selected = true;
								break;
							}
						}
						classChange(true);
					}
					else { /*No timetable to be loaded*/
						$("#mainTimeTable").append("<center><B>No TimeTable to be loaded </B><br>" +
							"Please select option from above catgories</center>");
						document.getElementById("title").innerHTML =  "<h2> Timetable for " +
						search(dept, "deptId", currentDeptId)["deptName"] + "</h2>";
					}
				}
				else
					fillTable2(true);
				classForm();
			} else {
				alert("Class " + classShortName + ": Deletion Failed.");
				console.log("Class " + classShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("cDeleteButton_" + row).value = "Delete"
				document.getElementById("cUpdateButton_" + row).disabled = false;
				document.getElementById("cDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=classDelete&classId=" + classId + "&snapshotId=" + currentSnapshotId);
}
function classRoomForm() {
	formOpen("inputClassRoomForm");
	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("classRoomTable","  ", "ID", "Class", "Room", 2);

	/* ---- Adding "Add classRoom Row" -----------------------*/
	row = insertRow(table, 1);
	insertTextColumn(row, "", " ");
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);

	selectTag = insertSelectTag(row, "crClassAdd", classTable,"classId", "classShortName");
	$("#crClassAdd").select2({
		placeholder: "Insert Class Name",
		width: '90%'
	});

	selectTag = insertSelectTag(row, "crRoomAdd", room, "roomId", "roomShortName");
	$("#crRoomAdd").select2({
		placeholder: "Room Name",
		width: '80%'
	});

	cell = insertAddButton(row, "classRoomInsert()", 2);

	/* Add the existing classRoom entries */
	tr = document.getElementById("classRoomTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;
	for (i in classRoom) {
		currClassRoom = classRoom[i];
		var row = insertRow(table, count);

		insertInputBox(row, "checkbox", "crfCheckBox" + count, "2", "", "", "", ""); 

		insertTextColumn(row, "crfCenter_" + count, currClassRoom["crId"]);

		var cell = insertCell(row);
		cell.setAttribute("align","center");
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","class_"+count);
		for (k in classTable) {
			if(classTable[k]["classId"] == currClassRoom["classId"])
				var tag = createOptionTag(classTable[k]["classId"], classTable[k]["classShortName"], true);
			else
				var tag = createOptionTag(classTable[k]["classId"], classTable[k]["classShortName"], false);
			selectTag.appendChild(tag);
		}
		cell.appendChild(selectTag);
		//$("#class_"+i).select2();
		var id = "class_" + count;
		updateDefault(id);
		selectTag.onchange = function() {enableUpdateButton(this.id);};

		var cell = insertCell(row);
		cell.setAttribute("align","center");
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","room_"+count);
		for (k in room) {
			if(room[k]["batches"] == 1) /* don't show batchable rooms here */
				continue;
			if(room[k]["roomId"] == currClassRoom["roomId"])
				var tag = createOptionTag(room[k]["roomId"], room[k]["roomName"], true);
			else
				var tag = createOptionTag(room[k]["roomId"], room[k]["roomName"], false);
			selectTag.appendChild(tag);
		}
		cell.appendChild(selectTag);
		//$("#room_"+i).select2();
		var id = "room_" + count;
		updateDefault(id);
		selectTag.onchange = function() {enableUpdateButton(this.id);};

		insertUpdateButton(row, "classRoomUpdateButton_" + count,
							"classRoomUpdate(" + count + ")");
		insertDeleteButton(row, "classRoomDeleteButton_" + count,
							"classRoomDelete(" + count + ")");
		count++;
	}
}

function classRoomInsert() {
	var classId, roomId,  crId;
	classId = document.getElementById("crClassAdd").value;
	roomId = document.getElementById("crRoomAdd").value;
	/* parameter checking */
	if(selectTagsValueEmpty(classId, roomId) == true) {
		return;
	}
	roomShortName = search(room, "roomId", roomId)["roomShortName"];
	classShortName= search(classTable, "classId", classId)["classShortName"];

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//classRoomChange(false);	/* TODO: Check this call */
				newClassRoom = {};
				newClassRoom["roomId"] = roomId;
				newClassRoom["classId"] = classId;
				newClassRoom["crId"] = response["crId"];
				classRoom.unshift(newClassRoom);
				fillTable2(true);
				classRoomForm();
				var formType = document.getElementById("inputClassRoomForm");
				highlightRowAfterAdd(formType);
			} else {
				alert("Insert class: "
					+ classShortName + " Failed.");
				console.log("Insert class: "
					+ classShortName + " Failed. \nError From Server: \n" +
					response["Error"]);

			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=classRoomInsert&roomId=" + roomId + "&classId=" +
				classId + "&snapshotId=" + currentSnapshotId);

}

function selectTagsValueEmpty() {
	for(i = 0 ; i < arguments.length; i++) {
		if(arguments[i] == -1) {
			alert("Please fill all fields");
			return true;
		}
	}
	return false;
}
function classRoomUpdate(i) {
	var row = i;
	var classId, roomId,  crId;
	classId = document.getElementById("class_" + row).value;
	roomId = document.getElementById("room_" + row).value;
	/* parameter checking */
	if(selectTagsValueEmpty(classId, roomId) == true) {
		return;
	}
	crId = document.getElementById("crfCenter_" + row).childNodes[0].nodeValue;
	document.getElementById("classRoomUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("classRoomDeleteButton_" + row).disabled = true;
	document.getElementById("classRoomUpdateButton_" + row).disabled = true;
	/* debug */
	roomShortName = search(room, "roomId", roomId)["roomShortName"];
	classShortName= search(classTable, "classId", classId)["classShortName"];

	row = i - 2;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			//alert("classRoom Row " + row + "Updated");
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("classRoomUpdateButton_" +
						i).childNodes[0].nodeValue = "Updated";
				document.getElementById("classRoomDeleteButton_" + i).disabled = false;
				document.getElementById("classRoomUpdateButton_" + i).disabled = false;
				classRoom[row]["roomId"] = roomId;
				classRoom[row]["classId"] = classId;
				fillTable2(true);
				classRoomForm();
			}
			else {
				document.getElementById("classRoomUpdateButton_" +
						i).childNodes[0].nodeValue = "Update";
				alert("crId = " + crId + ": Update Failed for Subject: " +
									roomShortName + + " class: " + classShortName);
				console.log("crId = " + crId + ": Update Failed for Subject: " +
									roomShortName + + " class: " + classShortName
									+ "\nError:\n" + response["Error"]);
				document.getElementById("classRoomDeleteButton_" + i).disabled = false;
				document.getElementById("classRoomUpdateButton_" + i).disabled = false;
				classRoomForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=classRoomUpdate&roomId=" + roomId + "&classId=" +
				classId + "&crId=" + crId + "&snapshotId=" + currentSnapshotId);

}
function classRoomDelete(i) {
	var row = i;
	var crId;
	var formType = document.getElementById("inputClassRoomForm");
	highlightRowWhenDelete(formType, row);
	var sure = confirm("This will delete all related timetable entries also\n"
				+ "This can not be undone. \nAre you sure?");
	if(sure != true) {
		unhighlightRowWhenDeleteCancel(formType, row);
		return -1;
	}
	crId = document.getElementById("crfCenter_" + row).childNodes[0].nodeValue;
	document.getElementById("classRoomDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("classRoomDeleteButton_" + row).disabled = true;
	document.getElementById("classRoomUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("classRoomDeleteButton_" + row).value = "Delete"
				classRoom.splice(i - 2, 1);
				fillTable2(true);
				classRoomForm();
			} else {
				alert("classRoom " + crId + ": Deletion Failed.");
				console.log("classRoom " + crId + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("classRoomDeleteButton_" + row).value = "Delete"
				document.getElementById("classRoomUpdateButton_" + row).disabled = false;
				document.getElementById("classRoomDeleteButton_" +
						row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=classRoomDelete&crId=" + crId + "&snapshotId=" + currentSnapshotId);
}
function configForm() {
	formOpen("inputConfigForm");
	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("configTable", "configId", "Config Name", "Day Begins",
						"Slot Duration(Mins)", "No of Slots Per Day", "Dept", "Owner", 2);
	var count = 1;
	if(config.length < 1) {
		var row = insertRow(table, count);
		cell = insertTextColumn(row, "info", "Please create the first configuration before proceeding");
		/*cell = row.insertCell(-1);
		textNode = document.createTextNode("Please create the first configuration before proceeding");
		cell.appendChild(textNode);  */
		cell.setAttribute("colspan", "6");
		count++;
	}
	/* ---- Adding "Add Config Row" -----------------------*/
	var row = insertRow(table, count);
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);
	insertInputBox(row, "text", "configNameAdd", "32", "Enter Config Name", "", "Configuration Name");
	insertInputBox(row, "time", "dayBeginAdd", "8", "Day Begins At", "", "Day Begin Time");
	document.getElementById("dayBeginAdd").setAttribute("pattern", 
							"^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$");
	insertInputBox(row, "number", "slotDurationAdd", "3", "Each Slot Minutes", "", "Slot Duration (in Secs)", "1");
	insertInputBox(row, "number", "nSlotsAdd", "3", "No of Slots Per Day", "", "No of Slots Per Day", "1");
	insertSelectTag(row, "deptIdAdd", dept, "deptId", "deptName");
	/* TODO: This will be replaced by the current user Id when we implement users */
	insertSelectTag(row, "inchargeAdd", [[1]], "0", "0");

	cell = insertAddButton(row, "configInsert()", 1);
	
	/* ---- Adding Search Box -----------*/
	var searchrow = insertRow(table, 2);	
	insertTextColumn(searchrow, "blankID", "");
	insertInputBox(searchrow, "text", "myInput7", 32, "Search for names..", "", "Configuration Name");
	searchrow.addEventListener("keyup", function() {Searchrow("configTable", "configName_", "myInput7")});

	searchrow.setAttribute("class","noMod");
	/* Add the existing config entries */
	tr = document.getElementById("configTable").rows[0];
	var ncells = tr.cells.length;
	var count = 3;
	
	for (i in config) {
		currConfig = config[i];
		JSON.stringify(currConfig);
		var row = insertRow(table, count);

		insertTextColumn(row, "cfCenter_" + count, currConfig["configId"]);

		insertInputBox(row, "text", "configName_" + count, "32",
					"Config Name", currConfig["configName"]);
		insertInputBox(row, "time", "dayBegin_" + count, "8",
					"Day Begins At", currConfig["dayBegin"]);

		var slotDurationMin = parseInt(currConfig["slotDuration"]);
		slotDurationMin = slotDurationMin / 60;
		insertInputBox(row, "number", "slotDuration_" + count, "3",
					"Slot Duration(Mins)", slotDurationMin);
		insertInputBox(row, "number", "nSlots_" + count, "3",
					"No. of Slots per Day", currConfig["nSlots"]);
		insertInputBox(row, "text", "deptId_" + count, "8",
					"Dept Id", search(dept, "deptId", currConfig["deptId"])["deptShortName"]);
		insertInputBox(row, "text", "incharge_" + count, "8",
					"Incharge", currConfig["incharge"]);

		/*insertUpdateButton(row, "configUpdateButton_" + count,
							"configUpdate(" + count + ")"); */
		insertDeleteButton(row, "configDeleteButton_" + count,
							"configDelete(" + count + ")");

		count++;
	}
}
function checkParameters(configName, dayBegin, slotDuration, nSlots, deptId, incharge) {
	return true;
}
function configInsert() {
	var configName, dayBegin, slotDuration, nSlots, deptId, incharge;
	configName = document.getElementById("configNameAdd");
	dayBegin = document.getElementById("dayBeginAdd");
	slotDuration = document.getElementById("slotDurationAdd");
	nSlots = document.getElementById("nSlotsAdd");
	deptId = document.getElementById("deptIdAdd").value;
	incharge = document.getElementById("inchargeAdd").value;
	
	//Checking Parameter
	if(checkParameterValidity(configName, dayBegin, 
		slotDuration, nSlots) == false ) {
		return;	
	}
	if(selectTagsValueEmpty(deptId, incharge) == true) {
		return;
	}
	if(alreadyValueNotPresentInDB(config,  "configName", 
					configName.value) == false) {
		return;	
	}
	
	configName = configName.value;
	if(!validateAlNumFields(configName, "config Name"))
		return;
	dayBegin = dayBeginAdd.value;
	slotDuration = slotDuration.value;
	nSlots = nSlots.value;

	//Converting minutes to seconds
	slotDuration = slotDuration * 60;

	if(checkParameters(configName, dayBegin, slotDuration, nSlots, deptId, incharge) === false)
		return;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//configChange(false);	/* TODO: Check this call */
				newconfig = {};
				newconfig["configName"] = configName;
				newconfig["dayBegin"] = dayBegin;
				newconfig["slotDuration"] = slotDuration;
				newconfig["nSlots"] = nSlots;
				newconfig["deptId"] = deptId;
				newconfig["incharge"] = incharge;
				newconfig["configId"] = response["configId"];
				config.unshift(newconfig);
				//fillTable2(true);
				/* TODO: should we call load() or something else */
				formClose("inputConfigForm");
				getDeptConfigSnapshot();
			} else {
				alert("configInsert " + configName + " Failed.");
				console.log("configInsert " + configName + " Failed. Error: " + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=configInsert&configName=" + configName + "&dayBegin=" +
			dayBegin + "&slotDuration=" + slotDuration + "&nSlots=" + nSlots + "&deptId=" + deptId + "&incharge=" + incharge);

}

function configUpdate(i) {
	var row = i;
	var configName, dayBegin, slotDuration, nSlots, deptId;
	configName = document.getElementById("configName_" + row).value;
	dayBegin = document.getElementById("dayBegin_" + row).value;
	slotDuration = document.getElementById("slotDuration_" + row).value;
	nSlots = document.getElementById("nSlots_" + row).value;
	deptId = document.getElementById("deptId_" + row).value;
	incharge = document.getElementById("inchargeAdd").value;
	document.getElementById("configUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("configDeleteButton_" + row).disabled = true;
	document.getElementById("configUpdateButton_" + row).disabled = true;

	//Converting minutes to seconds
	slotDuration = slotDuration * 60;

	row = i - 3;
	var configOrigName = config[row]["configName"];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			//alert("config Row " + row + "Updated");
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("configUpdateButton_" + i).childNodes[0].nodeValue = "Updated";
				document.getElementById("configDeleteButton_" + i).disabled = false;
				document.getElementById("configUpdateButton_" + i).disabled = false;
				config[row]["configName"] = configName;
				config[row]["dayBegin"] = dayBegin;
				config[row]["slotDuration"] = slotDuration;
				config[row]["nSlots"] = nSlots;
				config[row]["deptId"] = deptId;
				config[row]["incharge"] = incharge;
				fillTable2(true);
				configForm();
			}
			else {
				document.getElementById("configUpdateButton_" + i).childNodes[0].nodeValue = "Update";
				alert("Config " + dayBegin + ": Update Failed.");
				console.log("Config " + dayBegin + ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("configDeleteButton_" + i).disabled = false;
				document.getElementById("configUpdateButton_" + i).disabled = false;
				configForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=configUpdate&configName=" + configName + "&dayBegin=" +
				dayBegin + "&slotDuration=" + slotDuration + "&nSlots=" + nSlots + "&deptId=" + deptId +
				"&configOrigName=" + configOrigName + "&incharge=" + incharge);

}
function configDelete(i) {
	var row = i;
	var configName, dayBegin, slotDuration, nSlots, deptId;
	var sure = confirm("Warning: Deleting Config will delete all related " +
						  "config-teacher mappings, timetable entries, etc.\n" +
						  "This can not be undone. \n" +
						  "Are you sure?");
	if(sure != true)
		return;
	var configId = document.getElementById("cfCenter_" + row).childNodes[0].nodeValue;
	document.getElementById("configDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("configDeleteButton_" + row).disabled = true;
	//document.getElementById("configUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("configDeleteButton_" + row).value = "Delete";
				//We have displayed new entry row at last(i - 1)
				config.splice(i - 3, 1);
				fillTable2(true);
				configForm();
			} else {
				alert("Config " + configId + ": Deletion Failed.");
				console.log("Config " + configId + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("configDeleteButton_" + row).value = "Delete"
				document.getElementById("configUpdateButton_" + row).disabled = false;
				document.getElementById("configDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=configDelete&configId=" + configId);
}
/*Global variables declared*/
overlappingSbtArr = [];
callForFirstTime2 = 1;
function fillOverlappingSBTArr(){
	var count = 2;
	var index = 0;
	for (i in overlappingSBT) {
		currOverlappingSBT = overlappingSBT[i];
		overlappingSbtArr[index] = {};
		overlappingSbtArr[index]['osbtId'] = currOverlappingSBT["osbtId"];
		k = currOverlappingSBT["sbtId1"];
		currSBT = search(subjectBatchTeacher, "sbtId", k);
		var subjectShortName = search(subject, "subjectId", currSBT["subjectId"])["subjectShortName"];
		var batchName = search(batch, "batchId", currSBT["batchId"])["batchName"];
		var teacherShortName = search(teacher, "teacherId", currSBT["teacherId"])["teacherShortName"];
		if(typeof teacherShortName == "undefined")
			teacherShortName = "Not Defined";
		var sbtString = "" + subjectShortName + " : " + batchName + " : " + teacherShortName;
		overlappingSbtArr[index]['sbt1'] = sbtString;
		k = currOverlappingSBT["sbtId2"];
		currSBT = search(subjectBatchTeacher, "sbtId", k);
		var subjectShortName = search(subject, "subjectId", currSBT["subjectId"])["subjectShortName"];
		var batchName = search(batch, "batchId", currSBT["batchId"])["batchName"];
		var teacherShortName = search(teacher, "teacherId", currSBT["teacherId"])["teacherShortName"];
		if(typeof teacherShortName == "undefined")
			teacherShortName = "Not Defined";
		var sbtString = "" + subjectShortName + " : " + batchName + " : " + teacherShortName;
		overlappingSbtArr[index]['sbt2'] = sbtString;
		count++;
		index++;
	}
}
function overlappingSBTForm() {
	formOpen("inputoverlappingSBTForm");

	if(callForFirstTime2 == 1)
		fillOverlappingSBTArr();
	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("overlappingSBTTable", "  ","ID", "Sub-Batch-Teacher1",
						"Sub-Batch-Teacher2", 2);

	/* ---- Adding "Add overlappingSBT Row" -----------------------*/
	row = insertRow(table, 1);
	insertTextColumn(row, "", " ");
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);

	var cell = insertCell(row);
	cell.setAttribute("align","center");
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","sbtAdd1");
	var tag = createOptionTag("-1", "", false);
	selectTag.appendChild(tag);
	for (k in subjectBatchTeacher) {
		var currSBT = subjectBatchTeacher[k];
		var subjectShortName = search(subject, "subjectId", currSBT["subjectId"])["subjectShortName"];
		var batchName = search(batch, "batchId", currSBT["batchId"])["batchName"];
		var teacherShortName = search(teacher, "teacherId", currSBT["teacherId"])["teacherShortName"];
		if(typeof teacherShortName == "undefined")
			teacherShortName = "Not Defined";
		var sbtString = "" + subjectShortName + " - " + batchName + " - " + teacherShortName;
		var tag = createOptionTag(subjectBatchTeacher[k]["sbtId"], sbtString, false);
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	$("#sbtAdd1").select2({
		placeholder: "SBT Name",
		width: '90%'
	});
	$("#sbtAdd1").on("change", makesbtAdd2);

	var cell = insertCell(row);
	cell.setAttribute("align","center");
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","sbtAdd2");
	cell.appendChild(selectTag);
	var tag = createOptionTag("-1", "Select an entry in the first box", false);
	selectTag.appendChild(tag);
	$("#sbtAdd2").select2({
		placeholder: "Matching SBT",
		dropdownAutoWidth : true,
		width: '90%'
	});

	cell = insertAddButton(row, "overlappingSBTInsert()", 1);

	/* Add the existing overlappingSBT entries */
	tr = document.getElementById("overlappingSBTTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i=0;i<overlappingSbtArr.length;i++) {
		var row = insertRow(table, count);
		insertInputBox(row, "checkbox", "osbtCheckBox" + count, "2", "", "", "", ""); 
		insertTextColumn(row, "osbtCenter_" + count, overlappingSbtArr[i]['osbtId']);
		var cell = insertCell(row);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "sbtId1_" + count);
		var centerText = document.createTextNode(overlappingSbtArr[i]['sbt1']);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);
		var cell = insertCell(row);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "sbtId2_" + count);
		var centerText = document.createTextNode(overlappingSbtArr[i]['sbt2']);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);

		insertDeleteButton(row, "overlappingSBTDeleteButton_" + count,
							"overlappingSBTDelete(" + count + ")");
		count++;
	}
}
function makesbtAdd2() {
	var count = 0;
	selectTag = document.getElementById("sbtAdd2");

	sbtId1 = document.getElementById("sbtAdd1").value;
	selectedSBT = search(subjectBatchTeacher, "sbtId", sbtId1);
	var selectedSubjectId= selectedSBT["subjectId"];
	var selectedBatchId = selectedSBT["batchId"];
	var selectedTeacherId = selectedSBT["teacherId"];

	while(selectTag.hasChildNodes()) {
		selectTag.removeChild(selectTag.childNodes[0]);
	}
	for (k in subjectBatchTeacher) {
		var currSBT = subjectBatchTeacher[k];
		if(currSBT["teacherId"] != selectedTeacherId || currSBT["subjectId"] != selectedSubjectId)
			continue;
		if(currSBT["teacherId"] == selectedTeacherId && currSBT["subjectId"] == selectedSubjectId
			&& currSBT["batchId"] == selectedBatchId)
			continue;
		var subjectShortName = search(subject, "subjectId", currSBT["subjectId"])["subjectShortName"];
		var batchName = search(batch, "batchId", currSBT["batchId"])["batchName"];
		var teacherShortName = search(teacher, "teacherId", currSBT["teacherId"])["teacherShortName"];
		if(typeof teacherShortName == "undefined")
			teacherShortName = "Not Defined";
		var sbtString = "" + subjectShortName + " - " + batchName + "- " + teacherShortName;
		var tag = createOptionTag(subjectBatchTeacher[k]["sbtId"], sbtString, false);
		selectTag.appendChild(tag);
		count++;
	}
	if(count == 0)
		selectTag.innerHTML = "<option> No matching Subject-Batches </option>";
	selectTag.style.width = "90%";
}
function overlappingSBTInsert() {
	var sbtId2, teacherId, osbtId;
	sbtId1 = document.getElementById("sbtAdd1").value;
	sbtId2 = document.getElementById("sbtAdd2").value;
	if(selectTagsValueEmpty(sbtId1, sbtId2) == true) {
		return;
	}
	/* debug */
	currSBT = search(subjectBatchTeacher, "sbtId", sbtId1);
	var subjectShortName = search(subject, "subjectId", currSBT["subjectId"])["subjectShortName"];
	var batchName = search(batch, "batchId", currSBT["batchId"])["batchName"];
	var teacherShortName = search(teacher, "teacherId", currSBT["teacherId"])["teacherShortName"];
	if(typeof teacherShortName == "undefined")
		teacherShortName = "Not Defined";
	var sbtString = "" + subjectShortName + " - " + batchName + " - " + teacherShortName;

	currSBT = search(subjectBatchTeacher, "sbtId", sbtId2);
	var subjectShortName = search(subject, "subjectId", currSBT["subjectId"])["subjectShortName"];
	var batchName = search(batch, "batchId", currSBT["batchId"])["batchName"];
	var teacherShortName = search(teacher, "teacherId", currSBT["teacherId"])["teacherShortName"];
	if(typeof teacherShortName == "undefined")
		teacherShortName = "Not Defined";
	sbtString = "" + subjectShortName + " - " + batchName + " - " + teacherShortName;
	/* end Debug */

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//overlappingSBTChange(false);	/* TODO: Check this call */
				newoverlappingSBT = {};
				newoverlappingSBT["sbtId1"] = sbtId1;
				newoverlappingSBT["sbtId2"] = sbtId2;
				newoverlappingSBT["osbtId"] = response["osbtId1"];
				overlappingSBT.unshift(newoverlappingSBT);
				newoverlappingSBT = {};
				newoverlappingSBT["sbtId1"] = sbtId2;
				newoverlappingSBT["sbtId2"] = sbtId1;
				newoverlappingSBT["osbtId"] = response["osbtId2"];
				overlappingSBT.unshift(newoverlappingSBT);
				fillTable2(true);
				overlappingSBTForm();
				var formType = document.getElementById("inputoverlappingSBTForm");
				highlightRowAfterAdd(formType);
			} else {
				alert("Insert " + sbtString + " Failed.");
				console.log("Insert " + sbtString + " Failed. \nError From Server: \n" +
					response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=overlappingSBTInsert&sbtId2=" + sbtId2 + "&sbtId1=" +
				sbtId1 + "&snapshotId=" + currentSnapshotId);

}

function overlappingSBTDelete(i) {
	var row = i;
	var a, j = 0;
	var b = new Array();
	var temp = overlappingSBT.slice();
	var osbtId;
	var formType = document.getElementById("inputoverlappingSBTForm");
	osbtId = document.getElementById("osbtCenter_" + row).childNodes[0].nodeValue;
	var sbtId1 = search(overlappingSBT, "osbtId", osbtId)["sbtId1"];
	var sbtId2 = search(overlappingSBT, "osbtId", osbtId)["sbtId2"];
	for(a in temp) {
		if(temp[a]["sbtId1"] == sbtId1 ||
			temp[a]["sbtId2"] == sbtId1 ||
			temp[a]["sbtId1"] == sbtId2 ||
			temp[a]["sbtId2"] == sbtId2)  {
			var y = parseInt(a);
			b[j] = y + 2;
			j++;
		}
	}
	
	// for highlighting the required rows
	
	for(j = 0;j < b.length;j++) {
		highlightRowWhenDelete(formType,b[j]);	
	}
	var sure = confirm("This will delete all related timetable entries also\n"
				+ "This can not be undone. \nAre you sure?");
	if(sure != true) {
		for(j = 0;j < b.length;j++) {
			unhighlightRowWhenDeleteCancel(formType,b[j]);	
		}
		return -1;
	}
	
	document.getElementById("overlappingSBTDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("overlappingSBTDeleteButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("overlappingSBTDeleteButton_" + row).value = "Delete";
				deleted = true;
				while(deleted) {
					deleted = false;
					for(x in overlappingSBT) {
						if(overlappingSBT[x]["sbtId1"] == sbtId1 ||
							overlappingSBT[x]["sbtId2"] == sbtId1 ||
							overlappingSBT[x]["sbtId1"] == sbtId2 ||
							overlappingSBT[x]["sbtId2"] == sbtId2)  {
								overlappingSBT.splice(x, 1);
								deleted = true;
						}
					}
				}
				fillTable2(true);
				overlappingSBTForm();
			} else {
				alert("overlappingSBT " + osbtId + ": Deletion Failed.");
				console.log("overlappingSBT " + osbtId + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("overlappingSBTDeleteButton_" +
						row).value = "Delete"
				document.getElementById("overlappingSBTDeleteButton_" +
						row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=overlappingSBTDelete&osbtId=" + osbtId + "&snapshotId=" + currentSnapshotId);
}
function roomForm() {
	formOpen("inputRoomForm");

	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("roomTable", "  ", "ID", "Name", "Short Name", "Strength", 2);

	/* ---- Adding "Add Room Row" -----------------------*/
	row = insertRow(table, 1);
	insertTextColumn(row, "", " ");
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);
	insertInputBox(row, "text", "roomNameAdd", "32", "Enter Room Name", "", "Room Name");
	insertInputBox(row, "text", "roomShortNameAdd", "8", "Enter Short Name", "", "Room ShortName");
	insertInputBox(row, "number", "roomCountAdd", "3", "Room Size", "", "Room Size", "1");
	cell = insertAddButton(row, "roomInsert()", 2);
	
	/* ---- Adding Search Box -----------*/
	var searchrow = insertRow(table, 2);
	insertTextColumn(searchrow, "", " ");	
	insertTextColumn(searchrow, "blankID", "");
	insertInputBox(searchrow, "text", "myInput3", 32, "Search for room names..", "", "Room Name");
	searchrow.addEventListener("keyup", function() {Searchrow("roomTable", "roomName_", "myInput3")});

	searchrow.setAttribute("class","noMod");
	/* Add the existing room entries */
	tr = document.getElementById("roomTable").rows[0];
	var ncells = tr.cells.length;
	var count = 3;

	for (i in room) {
		currRoom = room[i];
		var row = insertRow(table, count);
		
		insertInputBox(row, "checkbox", "rCheckBox" + count, "2", "", "", "", ""); 

		insertTextColumn(row, "rCenter_" + count, currRoom["roomId"]);

		insertInputBox(row, "text", "roomName_" + count, "32",
					"Room Name", currRoom["roomName"], "Room Name");
		insertInputBox(row, "text", "roomShortName_" + count, "8",
					"Short Name", currRoom["roomShortName"], "Room ShortName");
		insertInputBox(row, "number", "roomCount_" + count, "3",
					"Capacity", currRoom["roomCount"], "Room Size", "1");

		insertUpdateButton(row, "rUpdateButton_" + count,
							"roomUpdate(" + count + ")");
		insertDeleteButton(row, "rDeleteButton_" + count,
							"roomDelete(" + count + ")");
		count++;
	}
	rowcount = count;
}
function roomInsert() {
	var row = i;
	var roomName, roomShortName, roomCount;
	roomName = document.getElementById("roomNameAdd");
	roomShortName = document.getElementById("roomShortNameAdd");
	roomCount = document.getElementById("roomCountAdd");

	//Checking Parameter
	if(checkParameterValidity(roomName, roomShortName, 
			roomCount) == false ) {
		return;	
	}
	if(alreadyValueNotPresentInDB(room,  "roomShortName", 
				roomShortName.value) == false) {
		return;	
	}

	roomName = roomName.value;
	if(!validateAlNumFields(roomName,"Room Name"))
		return;
	roomShortName = roomShortName.value;
	if(!validateAlNumFields(roomShortName,"Room Short Name"))
		return;
	roomCount = roomCount.value;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//roomChange(false);	/* TODO: Check this call */
				newroom = {};
				newroom["roomName"] = roomName;
				newroom["roomShortName"] = roomShortName;
				newroom["roomCount"] = roomCount;
				newroom["snapshotId"] = currentSnapshotId;
				newroom["roomId"] = response["roomId"];
				room.unshift(newroom);
				loadSelectMenus();
				fillTable2(true);
				roomForm();
				var formType = document.getElementById("inputRoomForm");
				highlightRowAfterAdd(formType);
			} else {
				alert("roomInsert " + roomShortName + " Failed.");
				console.log("roomInsert " + roomShortName + " Failed. Error: " + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=roomInsert&roomName=" + roomName + "&roomShortName=" +
			roomShortName + "&roomCount=" + roomCount + "&snapshotId=" + currentSnapshotId);
}

function roomUpdate(i) {
	var row = i;
	var roomName, roomShortName, roomCount;
	roomName = document.getElementById("roomName_" + row);
	roomShortName = document.getElementById("roomShortName_" + row);
	roomCount = document.getElementById("roomCount_" + row);
	roomId = document.getElementById("rCenter_" + row).childNodes[0].nodeValue;
	
	//Checking Parameter
	if(checkParameterValidity(roomName, roomShortName, 
			roomCount) == false ) {
		return;	
	}
	if(alreadyValueNotPresentInDB(room,  "roomShortName", 
				roomShortName.value, "roomId", roomId) == false) {
		return;	
	}

	
	roomName = roomName.value;
	if(!validateAlNumFields(roomName,"Room Name"))
		return;
	roomShortName = roomShortName.value;
	if(!validateAlNumFields(roomShortName,"Room Short Name"))
		return;
	roomCount = roomCount.value;

	// Check undo/redo stack for clashing roomId
	ret = urCheck("roomId", roomId);
	if(ret === false)
		return;
	
	document.getElementById("rUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("rDeleteButton_" + row).disabled = true;
	document.getElementById("rUpdateButton_" + row).disabled = true;

	row = i - 3;
	//var roomOrigShortName = room[row]["roomShortName"];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
			//alert("room Row " + row + "Updated");
				document.getElementById("rUpdateButton_" + i).childNodes[0].nodeValue = "Updated";
				document.getElementById("rDeleteButton_" + i).disabled = false;
				document.getElementById("rUpdateButton_" + i).disabled = false;
				room[row]["roomName"] = roomName;
				room[row]["roomShortName"] = roomShortName;
				room[row]["roomCount"] = roomCount;
				loadRoomMenu();
				fillTable2(true);
				roomForm();
			}
			else {
				document.getElementById("rUpdateButton_" + i).childNodes[0].nodeValue = "Update";
				alert("Room " + roomShortName + ": Update Failed.");
				console.log("Room " + roomShortName + ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("rDeleteButton_" + i).disabled = false;
				document.getElementById("rUpdateButton_" + i).disabled = false;
				roomForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=roomUpdate&roomName=" + roomName + "&roomShortName=" +
			roomShortName + "&roomCount=" + roomCount + "&roomId=" +
			roomId + "&snapshotId=" + currentSnapshotId);

}
function roomDelete(i) {
	var row = i;
	var roomShortName;
	var roomId;
	var formType = document.getElementById("inputRoomForm");
	highlightRowWhenDelete(formType, row);
	var sure = confirm("Warning: Deleting Room will delete all related " +
			  "subject-teacher mappings, timetable entries, etc.\n" +
			  "This can not be undone. \n" +
			  "Are you sure?");
	if(sure != true) {
		unhighlightRowWhenDeleteCancel(formType, row);
		return -1;
	}
	//roomShortName = document.getElementById("roomShortName_" + row).value;
	roomId = document.getElementById("rCenter_" + row).childNodes[0].nodeValue;

	// Check undo/redo stack for clashing roomId
	ret = urCheck("roomId", roomId);
	if(ret === false)
		return;

	document.getElementById("rDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("rDeleteButton_" + row).disabled = true;
	document.getElementById("rUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("rDeleteButton_" + row).value = "Delete";
				room.splice(row - 3, 1);
				if(type == "room") {
					var index2 = document.getElementById("room-menu").selectedIndex;
					var roomname = document.getElementById("room-menu").options[index2].text;
				}
				loadSelectMenus();
				if(type == "room" && roomname == roomShortName) {
					var j;
					if(row == rowcount - 1)
						j = 2;
					else
						j = row + 1;
					var roomOptions = document.getElementById("room-menu");
					if(roomOptions.options.length != 1) {
						roomShortName = document.getElementById("roomShortName_" + j).value;
						for(var i = 0; i < roomOptions.options.length; i++) {
							if(roomOptions.options[i].value == roomShortName) {
								roomOptions.options[i].selected = true;
								break;
							}
						}
						roomChange(true);
					}
					else { /*No timetable to be loaded*/
						$("#mainTimeTable").append("<center><B>No TimeTable to be loaded </B><br>" +
							"Please select option from above catgories</center>");
						document.getElementById("title").innerHTML =  "<h2> Timetable for " +
						search(dept, "deptId", currentDeptId)["deptName"] + "</h2>";
					}
				}
				else {
					loadNewSnapshot();
					fillTable2(true);
				}
				roomForm();
			} else {
				alert("Room " + roomShortName + ": Deletion Failed.");
				console.log("Room " + roomShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("rDeleteButton_" + row).value = "Delete"
				document.getElementById("rUpdateButton_" + row).disabled = false;
				document.getElementById("rDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=roomDelete&roomId=" + roomId + "&snapshotId=" + currentSnapshotId);
}
function sbtPossible() {
	if(teacher.length < 1) {
		return 0;
	}	
	if(batch.length < 1) {
		return 0;
	}
	found = 0;
	for(s in subject) {
		if(subject[s]["batches"] == "1") {
			found = 1;
		}
	}
	if(found == 0) {
		return 0;
	}
	return 1;
}
var c;
function sbtForm() {
	if(!sbtPossible()) {
		alert("This form is not available. Enter at least one batchable Subject, " +
			  "One Teacher and One Batch using appropriate Forms");
		return;
	}
	formOpen("inputSBTForm");

	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("sbtTable","  ", "ID", "Batch", "Subject", "Teacher", 2);

	/* ---- Adding "Add sbt Row" -----------------------*/
	row = insertRow(table, 1);
	insertTextColumn(row, "", " ");
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);

	insertSelectTag(row, "batchAdd", batch, "batchId", "batchName");
	$("#batchAdd").select2({
		placeholder: "Insert Batch Name",
		width: '90%'
	});

	var cell = insertCell(row);
	cell.setAttribute("align","center");
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","subjectAdd");
	var tag = createOptionTag(-1, "", false);
	selectTag.appendChild(tag);
	for (k in subject) {
		if(subject[k]["batches"] == 0) /* don't show NON-batchable subjects here */
			continue;
		var tag = createOptionTag(subject[k]["subjectId"], subject[k]["subjectName"], false);
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	$("#subjectAdd").select2({
		placeholder: "Subject Name",
		width: '90%'
	});

	insertSelectTag(row, "teacherAdd", teacher, "teacherId", "teacherName");
	$("#teacherAdd").select2({
		placeholder: "Teacher Name",
		width: '90%'
	});

	cell = insertAddButton(row, "sbtInsert()", 2);

	/* Add the existing sbt entries */
	tr = document.getElementById("sbtTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in subjectBatchTeacher) {
		currSBT = subjectBatchTeacher[i];
		var row = insertRow(table, count);

		insertInputBox(row, "checkbox", "sbtCheckBox" + count, "2", "", "", "", ""); 

		insertTextColumn(row, "sbtCenter_" + count, currSBT["sbtId"]);

		insertTextColumn(row, "sbtBatch_" + count,
				search(batch, "batchId", currSBT["batchId"])["batchName"]);

		insertTextColumn(row, "sbtSubject_" + count,
				search(subject, "subjectId", currSBT["subjectId"])["subjectName"]);

		insertTextColumn(row, "sbtTeacher_" + count,
				search(teacher, "teacherId", currSBT["teacherId"])["teacherName"]);
		insertUpdateButton(row, "sbtUpdateButton_" + count,
							"sbtUpdate(" + count +")");
		insertDeleteButton(row, "sbtDeleteButton_" + count,
							"sbtDelete(" + count + ")");
		count++;
	}
	c = 0;
}
function sbtInsert() {
	var batchId, subjectId, teacheId, sbtId;
	batchId = document.getElementById("batchAdd").value;
	subjectId = document.getElementById("subjectAdd").value;
	teacherId = document.getElementById("teacherAdd").value;
	if(selectTagsValueEmpty(batchId, subjectId, teacherId) == true) {
		return;
	}
	/* debug */
	teacherShortName = search(teacher, "teacherId", teacherId)["teacherShortName"];
	subjectShortName = search(subject, "subjectId", subjectId)["subjectShortName"];
	batchName= search(batch, "batchId", batchId)["batchName"];

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//sbtChange(false);	/* TODO: Check this call */
				newSBT = {};
				newSBT["teacherId"] = teacherId;
				newSBT["subjectId"] = subjectId;
				newSBT["batchId"] = batchId;
				newSBT["sbtId"] = response["sbtId"];
				subjectBatchTeacher.unshift(newSBT);
				fillTable2(true);
				sbtForm();
				var formType = document.getElementById("inputSBTForm");
				highlightRowAfterAdd(formType);
			} else {
				alert("Insert teacher:" + teacherShortName + " subject: " + subjectShortName + " batch: "
						+ batchName + " Failed.");
				console.log("Insert teacher:" + teacherShortName + " subject: " + subjectShortName + " batch: "
						+ batchName + " Failed. \nError From Server: \n" + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=sbtInsert&subjectId=" + subjectId + "&teacherId=" +
			teacherId + "&batchId=" + batchId + "&snapshotId=" + currentSnapshotId);

}
function newSubjectBatchTeacher(i){
	var a = document.getElementById("teacher"+i);
	newTeacherName = a.options[a.selectedIndex].text;
	document.getElementById("sbtUpdateButton_" + i).childNodes[0].nodeValue = "Confirm";
	document.getElementById("sbtDeleteButton_" + i).disabled = true;
	document.getElementById("sbtUpdateButton_" + i).disabled = false;
}
function sbtUpdate(i) {
	if(document.getElementById("sbtUpdateButton_" + i).childNodes[0].nodeValue == "Update") {
		c++;
		if(c != 1){
			sbtForm();
		}
		var row = i;
		oldTeacherName = document.getElementById("sbtTeacher_" + row).childNodes[0].nodeValue;
		sbtId = document.getElementById("sbtCenter_" + row).childNodes[0].nodeValue;
		osbtList = searchMultipleRows(overlappingSBT, "sbtId1", sbtId);
		if(osbtList.length > 0) {
			alert("Update on entries with overlapping batches is not upported yet");
			return;
		}
		teacherRow = document.getElementById("sbtTeacher_" + row);
		while (teacherRow.firstChild) {
			teacherRow.removeChild(teacherRow.firstChild);
		}
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id", "teacher" + row);
		var tag = createOptionTag(-1, "", false);
		selectTag.appendChild(tag);
		for(k in teacher) {
			var tag = createOptionTag(teacher[k]["teacherId"], teacher[k]["teacherName"], false);
			selectTag.appendChild(tag);
		}
		selectTag.setAttribute("onchange", "newSubjectBatchTeacher(" + row + ")");
		teacherRow.appendChild(selectTag);
		$("#teacher" + row).select2({
			width: 'resolve'
		});
	}
	else if(document.getElementById("sbtUpdateButton_" + i).childNodes[0].nodeValue == "Confirm") {
		var sure = confirm("Warning: Changing Teacher will delete all overlaps \n" +
				  "This can not be undone. \n" +
				  "Are you sure?");
		if(sure != true)
			return;
		teacherRow = document.getElementById("sbtTeacher_" + i);
		while (teacherRow.firstChild) {
			teacherRow.removeChild(teacherRow.firstChild);
		}
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "teacher" + i);
		centerTag.setAttribute("class", "formText");
		centerTag.setAttribute("value", newTeacherName);
		var centerText = document.createTextNode(newTeacherName);
		centerTag.appendChild(centerText);
		teacherRow.appendChild(centerTag);
		document.getElementById("sbtUpdateButton_" + i).childNodes[0].nodeValue = "Update";
		document.getElementById("sbtDeleteButton_" + i).disabled = false;
		document.getElementById("sbtUpdateButton_" + i).disabled = false;
		var batchId, subjectId, teacheId, sbtId;
		batchName = document.getElementById("sbtBatch_" + i).childNodes[0].nodeValue;
		subjectName = document.getElementById("sbtSubject_" + i).childNodes[0].nodeValue;
		batchId = search(batch, "batchName", batchName)["batchId"];
		subjectId = search(subject, "subjectName", subjectName)["subjectId"];
		sbtId = document.getElementById("sbtCenter_" +i).childNodes[0].nodeValue;
		oldTeacherId = search(teacher, "teacherName", oldTeacherName)["teacherId"];
		newTeacherId = search(teacher, "teacherName", newTeacherName)["teacherId"];
		// Check undo/redo stack for clashing subjectId || batchId || teacherId
		ret = urCheck("subjectId", subjectId, "batchId", batchId, "teacherId", oldTeacherId);
		if(ret === false)
			return;
		/* debug */
		row = i - 2;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if(this.readyState == 4 && this.status == 200) {
				response = JSON.parse(this.responseText);
				if(response["Success"] == "True") {
					document.getElementById("sbtUpdateButton_" + i).childNodes[0].nodeValue = "Updated";
					document.getElementById("sbtDeleteButton_" + i).disabled = false;
					document.getElementById("sbtUpdateButton_" + i).disabled = false;
					subjectBatchTeacher[row]["teacherId"] = newTeacherId;
						subjectBatchTeacher[row]["subjectId"] = subjectId;
					subjectBatchTeacher[row]["batchId"] = batchId;
					row = searchMultipleRows (timeTable, "teacherId", oldTeacherId, "batchId", batchId,
								"subjectId", subjectId, "snapshotId", currentSnapshotId);
					var j;
					for(k in row) {
						j = searchIndex(timeTable, "teacherId", oldTeacherId, "batchId", batchId,
							"subjectId", subjectId, "snapshotId", currentSnapshotId,
							"slotNo", row[k]["slotNo"], "day", row[k]["day"]);
						currSubject = search(subject, "subjectId", subjectId);
						if(teacherBusyInThisSlot(row[k]["day"], row[k]["slotNo"], currSubject, newTeacherId, 0)) {
							timeTable.splice(j, 1);
						}
						else{
							timeTable[j]["teacherId"] = newTeacherId;
						}
					}
					fillTable2(true);
					sbtForm();
				}
				else {
					document.getElementById("sbtUpdateButton_" + i).childNodes[0].nodeValue = "Update";
					alert("sbtId = " + sbtId + ": Update Failed for Teacher: " + oldTeacherName
									+ " Subject: " + subjectName + " batch: " + batchName
										+ "\nError:\n" + response["Error"]
											+"\nsearching teacherId of " + newTeacherName
												+ " returns " + teacherId
													+" Problem with database values");
					document.getElementById("sbtDeleteButton_" + i).disabled = false;
					document.getElementById("sbtUpdateButton_" + i).disabled = false;
					sbtForm();
				}
			}
		}
		xhttp.open("POST", "timetable.php", false); // asynchronous
		xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhttp.send("reqType=sbtUpdate&subjectId=" + subjectId + "&newTeacherId=" +
			newTeacherId + "&oldTeacherId=" + oldTeacherId + "&batchId=" + batchId + "&sbtId=" + sbtId +
			"&snapshotId=" + currentSnapshotId);
	}
}
function sbtDelete(i) {
	var row = i;
	var batchId, subjectId, teacheId, sbtId;
	var sbtRow;
	var formType = document.getElementById("inputSBTForm");
	highlightRowWhenDelete(formType, row);
	var sure = confirm("This will delete all related timetable entries also\n"
				+ "This can not be undone. \nAre you sure?");
	if(sure != true) {
		unhighlightRowWhenDeleteCancel(formType, row);
		return -1;
	}
	sbtId = document.getElementById("sbtCenter_" + row).childNodes[0].nodeValue;
	sbtRow =  search(subjectBatchTeacher, "sbtId", sbtId);
	subjectId = sbtRow["subjectId"];
	batchId = sbtRow["batchId"];
	teacherId = sbtRow["teacherId"];

	// Check undo/redo stack for clashing subjectId || batchId || teacherId
	ret = urCheck("subjectId", subjectId, "batchId", batchId, "teacherId", teacherId);
	if(ret === false)
		return;

	document.getElementById("sbtDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("sbtDeleteButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("sbtDeleteButton_" + row).value = "Delete"
				subjectBatchTeacher.splice(i - 2, 1);
				getTimetable(currentSnapshotName);
				for(var k = 0; k < overlappingSBT.length; k++) {
					if(overlappingSBT[k]["sbtId1"] == sbtId ||
						overlappingSBT[k]["sbtId2"] == sbtId)  {
						overlappingSBT.splice(k--, 1);
					}
				}
				fillTable2(true);
				sbtForm();
			} else {
				alert("sbt " + sbtId + ": Deletion Failed.\nError:\n" + response["Error"]);
				console.log("sbt " + sbtId + ": Deletion Failed.");
				document.getElementById("sbtDeleteButton_" + row).value = "Delete"
				document.getElementById("sbtDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
				document.getElementById("sbtDeleteButton_" + row).disabled = false;
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // synchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=sbtDelete&sbtId=" + sbtId + "&snapshotId=" + currentSnapshotId
				+ "&subjectId=" + subjectId + "&batchId=" + batchId + "&teacherId=" + teacherId);
}
function sctPossible() {
	if(teacher.length < 1) {
		return 0;
	}	
	if(classTable.length < 1) {
		return 0;
	}
	found = 0;
	for(s in subject) {
		if(subject[s]["batches"] == "0") {
			found = 1;
		}
	}
	if(found == 0) {
		return 0;
	}
	return 1;
}
function sctForm() {
	if(!sctPossible()) {
		alert("This form is not available. Enter at least one Subject not having batches, " +
			  "One Teacher and One Class using appropriate Forms");
		return;
	}
	formOpen("inputSCTForm");
	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("sctTable","  ", "ID", "Class", "Subject", "Teacher", 2);

	/* ---- Adding "Add sct Row" -----------------------*/
	row = insertRow(table, 1);
	insertTextColumn(row, "", " ");
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);

	insertSelectTag(row, "classAdd", classTable, "classId", "className");
	$("#classAdd").select2({
		placeholder: "Insert Class Name",
		width: '98%'
	});

	var cell = insertCell(row);
	cell.setAttribute("align","center");
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","subjectAdd");
	var tag = createOptionTag(-1, "", false);
	selectTag.appendChild(tag);
	for (k in subject) {
		if(subject[k]["batches"] == 1) /* don't show batchable subjects here */
			continue;
		var tag = createOptionTag(subject[k]["subjectId"], subject[k]["subjectName"], false);
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	$("#subjectAdd").select2({
		placeholder: "Subject Name",
		width: '90%'
	});

	insertSelectTag(row, "teacherAdd", teacher, "teacherId", "teacherName");
	$("#teacherAdd").select2({
		placeholder: "Teacher Name",
		width: '90%'
	});

	cell = insertAddButton(row, "sctInsert()", 2);

	/* Add the existing sct entries */
	tr = document.getElementById("sctTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;
	for (i in subjectClassTeacher) {
		currSCT = subjectClassTeacher[i];

		var row = insertRow(table, count);
	
		insertInputBox(row, "checkbox", "sctCheckBox" + count, "2", "", "", "", "");

		insertTextColumn(row, "sctCenter_" + count, currSCT["sctId"]);

		insertTextColumn(row, "sctBatch_" + count,
				search(classTable, "classId", currSCT["classId"])["className"]);

		insertTextColumn(row, "sctSubject_" + count,
				search(subject, "subjectId", currSCT["subjectId"])["subjectName"]);
		insertTextColumn(row, "sctTeacher_" + count,
				search(teacher, "teacherId", currSCT["teacherId"])["teacherName"]);
		/*insertInputBox(row, "text", "sctTeacher_" + count, "32",
					"Teacher Name", search(teacher, "teacherId", currSCT["teacherId"])["teacherName"]);*/
		insertUpdateButton(row, "sctUpdateButton_" + count,
							"sctUpdate(" + count +")");
		insertDeleteButton(row, "sctDeleteButton_" + count,
							"sctDelete(" + count + ")");
		count++;
	}
	c = 0;
}
function sctInsert() {
	var classId, subjectId, teacheId, sctId;
	classId = document.getElementById("classAdd").value;
	subjectId = document.getElementById("subjectAdd").value;
	teacherId = document.getElementById("teacherAdd").value;
	if(selectTagsValueEmpty(classId, subjectId, teacherId) == true) {
		return;
	}
	/* debug */
	teacherShortName = search(teacher, "teacherId", teacherId)["teacherShortName"];
	subjectShortName = search(subject, "subjectId", subjectId)["subjectShortName"];
	classShortName= search(classTable, "classId", classId)["classShortName"];

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//sctChange(false);	/* TODO: Check this call */
				newSCT = {};
				newSCT["teacherId"] = teacherId;
				newSCT["subjectId"] = subjectId;
				newSCT["classId"] = classId;
				newSCT["sctId"] = response["sctId"];
				subjectClassTeacher.unshift(newSCT);
				fillTable2(true);
				sctForm();
				var formType = document.getElementById("inputSCTForm");
				highlightRowAfterAdd(formType);
			} else {
				alert("Insert teacher:" + teacherShortName + " subject: " + subjectShortName + " class: "
						+ classShortName + " Failed.");
				console.log("Insert teacher:" + teacherShortName + " subject: " + subjectShortName + " class: "
						+ classShortName + " Failed. \nError From Server: \n" + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=sctInsert&subjectId=" + subjectId + "&teacherId=" +
			teacherId + "&classId=" + classId + "&snapshotId=" + currentSnapshotId);

}
var newTeacherName;
var oldTeacherName;
function newSubjectClassTeacher(i){
	var a = document.getElementById("sctTeacherId_" + i);
	newTeacherName = a.options[a.selectedIndex].text;
	document.getElementById("sctUpdateButton_" + i).childNodes[0].nodeValue = "Confirm";
	document.getElementById("sctDeleteButton_" + i).disabled = true;
	document.getElementById("sctUpdateButton_" + i).disabled = false;
}
function sctUpdate(i) {
	/* Change the teacher's column to a select2 box */
	if(document.getElementById("sctUpdateButton_" + i).childNodes[0].nodeValue == "Update") {
		c++;
		if(c != 1){
			sctForm();
			c = 1;
		}
		var row = i;
		oldTeacherName = document.getElementById("sctTeacher_" + row).childNodes[0].nodeValue;
		teacherRow = document.getElementById("sctTeacher_" + row);
		while (teacherRow.firstChild) {
			teacherRow.removeChild(teacherRow.firstChild);
		}
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id", "sctTeacherId_" + row);
		var tag = createOptionTag(-1, "", false);
		selectTag.appendChild(tag);
		for(k in teacher) {
			var tag = createOptionTag(teacher[k]["teacherId"], teacher[k]["teacherName"], false);
			selectTag.appendChild(tag);
		}
		selectTag.setAttribute("onchange", "newSubjectClassTeacher(" + row + ")");
		teacherRow.appendChild(selectTag);
		$("#sctTeacherId_" + row).select2({
			width: 'resolve'
		});
	}
	else if(document.getElementById("sctUpdateButton_" + i).childNodes[0].nodeValue == "Confirm") {
		var sure = confirm("Warning: Changing Teacher will delete all overlaps \n" +
				  "This can not be undone. \n" +
				  "Are you sure?");
		if(sure != true)
			return;
		teacherRow = document.getElementById("sctTeacher_" + i);
		while (teacherRow.firstChild) {
			teacherRow.removeChild(teacherRow.firstChild);
		}

		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "sctTeacherId_" + i);
		centerTag.setAttribute("class", "formText");
		centerTag.setAttribute("value", newTeacherName);
		var centerText = document.createTextNode(newTeacherName);
		centerTag.appendChild(centerText);
		teacherRow.appendChild(centerTag);

		document.getElementById("sctUpdateButton_" + i).childNodes[0].nodeValue = "Update";
		document.getElementById("sctDeleteButton_" + i).disabled = false;
		document.getElementById("sctUpdateButton_" + i).disabled = false;

		var classId, subjectId, teacherId, sctId;
		className = document.getElementById("sctBatch_" + i).childNodes[0].nodeValue;
		subjectName = document.getElementById("sctSubject_" + i).childNodes[0].nodeValue;
		sctId = document.getElementById("sctCenter_" + i).childNodes[0].nodeValue;
		oldTeacherId = search(teacher, "teacherName", oldTeacherName)["teacherId"];
		newTeacherId = search(teacher, "teacherName", newTeacherName)["teacherId"];
		classId = search(classTable, "className", className)["classId"];
		subjectId = search(subject, "subjectName", subjectName)["subjectId"];
		// Check undo/redo stack for clashing subjectId || classId || teacherId
		ret = urCheck("subjectId", subjectId, "classId", classId, "teacherId", oldTeacherId);
		if(ret === false)
			return;

		row = i - 2;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if(this.readyState == 4 && this.status == 200) {
				response = JSON.parse(this.responseText);
				if(response["Success"] == "True") {
					document.getElementById("sctUpdateButton_" + i).childNodes[0].nodeValue = "Update";
					document.getElementById("sctDeleteButton_" + i).disabled = false;
					document.getElementById("sctUpdateButton_" + i).disabled = false;
					subjectClassTeacher[row]["teacherId"] = newTeacherId;
					subjectClassTeacher[row]["subjectId"] = subjectId;
					subjectClassTeacher[row]["classId"] = classId;
					row = searchMultipleRows (timeTable, "teacherId", oldTeacherId, "classId", classId,
								"subjectId", subjectId, "snapshotId", currentSnapshotId);
					var j;
					for(k in row) {
						j = searchIndex(timeTable, "teacherId", oldTeacherId, "classId", classId,
								"subjectId", subjectId, "snapshotId", currentSnapshotId,
								"slotNo", row[k]["slotNo"], "day", row[k]["day"]);
						currSubject = search(subject, "subjectId", subjectId);
						if(teacherBusyInThisSlot(row[k]["day"], row[k]["slotNo"], currSubject, newTeacherId, 0)) {
							timeTable.splice(j, 1);
						}
						else{
							timeTable[j]["teacherId"] = newTeacherId;
						}
					}
					fillTable2(true);
					sctForm();
				}
				else {
					document.getElementById("sctUpdateButton_" + i).childNodes[0].nodeValue = "Update";
						alert("sctId = " + sctId + ": Update Failed for Teacher: " + oldTeacherName
							+ " Subject: " + subjectName + " class: " + className
									+ "\nError:\n" + response["Error"]
										+"\nsearching teacherId of " + newTeacherName
											+ " returns " + teacherId
												+" Problem with database values");
					document.getElementById("sctDeleteButton_" + i).disabled = false;
					document.getElementById("sctUpdateButton_" + i).disabled = false;
					sctForm();
				}
			}
		}
		xhttp.open("POST", "timetable.php", false); // asynchronous
		xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhttp.send("reqType=sctUpdate&subjectId=" + subjectId + "&newTeacherId=" +
			newTeacherId + "&oldTeacherId=" + oldTeacherId + "&classId=" + classId + "&sctId=" + sctId +
			"&snapshotId=" + currentSnapshotId);
	}
}
function sctDelete(i) {
	var row = i;
	var classId, subjectId, teacheId, sctId;
	var sctRow;
	var formType = document.getElementById("inputSCTForm");
	highlightRowWhenDelete(formType, row);
	var sure = confirm("This will delete all related timetable entries also\n"
				+ "This can not be undone. \nAre you sure?");
	if(sure != true) {
		unhighlightRowWhenDeleteCancel(formType, row);
		return -1;
	}
	sctId = document.getElementById("sctCenter_" + row).childNodes[0].nodeValue;
	sctRow =  search(subjectClassTeacher, "sctId", sctId);
	subjectId = sctRow["subjectId"];
	classId = sctRow["classId"];
	teacherId = sctRow["teacherId"];

	// Check undo/redo stack for clashing subjectId || classId || teacherId
	ret = urCheck("subjectId", subjectId, "classId", classId, "teacherId", teacherId);
	if(ret === false)
		return;

	document.getElementById("sctDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("sctDeleteButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("sctDeleteButton_" + row).value = "Delete"
				subjectClassTeacher.splice(i - 2, 1);
				getTimetable(currentSnapshotName);
				fillTable2(true);
				sctForm();
			} else {
				alert("sct " + sctId + ": Deletion Failed.");
				console.log("sct " + sctId + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("sctDeleteButton_" + row).value = "Delete"
				document.getElementById("sctDeleteButton_" + row).disabled = false;
				document.getElementById("sctDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=sctDelete&sctId=" + sctId + "&snapshotId=" + currentSnapshotId + "&subjectId=" +
				subjectId + "&teacherId=" + teacherId + "&classId=" + classId);
}
function subjectForm() {
	formOpen("inputSubjectForm");
	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("subjectTable", "  ", "ID", "Name", "Short Name", "Each Entry #Slots",
				"#Entries", "Batches?", 2);
	/* ---- Adding "Add Subject Row" -----------------------*/
	row = insertRow(table, 1);
	insertTextColumn(row, "", " ");
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);
	insertInputBox(row, "text", "subjectNameAdd", "32", "Enter Subject Name", "", "Subject Name");
	insertInputBox(row, "text", "subjectShortNameAdd", "8", "Enter Short Name", "", "Subject ShortName");
	insertInputBox(row, "number", "eachSlotAdd", "3", "Each Entry #Slots", "", "Hours for Each Slot", "1");
	insertInputBox(row, "number", "nSlotsAdd", "3", "#Entries", "", "No. of Slots", "1");

	insertSelectTag(row, "batchesAdd", [["Yes"], ["No"]], "0", "0");

	cell = insertAddButton(row, "subjectInsert()", 2);
	
	/* ---- Adding Search Box -----------*/
	var searchrow = insertRow(table, 2);
	insertTextColumn(searchrow, "", " ");	
	insertTextColumn(searchrow, "blankID", "");
	insertInputBox(searchrow, "text", "myInput4", 32, "Search for subject names..", "", "Subject Name");
	searchrow.addEventListener("keyup", function() {Searchrow("subjectTable", "subjectName_", "myInput4")});

	searchrow.setAttribute("class","noMod");
	/* Add the existing subject entries */
	tr = document.getElementById("subjectTable").rows[0];
	var ncells = tr.cells.length;
	var count = 3;

	for (i in subject) {
		currSubject = subject[i];
		var row = insertRow(table, count);
		
		insertInputBox(row, "checkbox", "sCheckBox" + count, "2", "", "", "", ""); 		

		insertTextColumn(row, "sCenter_" + count, currSubject["subjectId"]);

		insertInputBox(row, "text", "subjectName_" + count, "32",
					"Subject Name", currSubject["subjectName"], "Subject Name");
		insertInputBox(row, "text", "subjectShortName_" + count, "8",
					"Short Name", currSubject["subjectShortName"], "Subject ShortName");
		insertTextColumn(row, "eachSlot_" + count, currSubject["eachSlot"], "Hours for Each Slot", "1" );
		/*insertInputBox(row, "number", "eachSlot_" + count, "3",
					"Each Entry #Slots", currSubject["eachSlot"]); */
		insertInputBox(row, "number", "nSlots_" + count, "3",
					"#Entries", currSubject["nSlots"], "No. of Slots", "1");

		insertTextColumn(row, "batches_" + count, currSubject["batches"] == "1"? "Yes": "No");
		/*var cell = insertCell(row);
		cell.setAttribute("align","center");
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","batches_"+count);
		batches = [0, 1];
		for (k in batches) {
			if(currSubject["batches"] == batches[k])
				var tag = createOptionTag(batches[k], batches[k], true);
			else
				var tag = createOptionTag(batches[k], batches[k], false);
			selectTag.appendChild(tag);
		}
		cell.appendChild(selectTag); */

		insertUpdateButton(row, "sUpdateButton_" + count,
							"subjectUpdate(" + count + ")");
		insertDeleteButton(row, "sDeleteButton_" + count,
							"subjectDelete(" + count + ")");
		count++;
	}
}
function subjectInsert() {
	var subjectName, subjectShortName, eachSlot, nSlots, batches;
	subjectName = document.getElementById("subjectNameAdd");
	subjectShortName = document.getElementById("subjectShortNameAdd");
	eachSlot = document.getElementById("eachSlotAdd");
	nSlots = document.getElementById("nSlotsAdd");
	batches = document.getElementById("batchesAdd");
	
	//Checking Parameter

	if(checkParameterValidity(subjectName, subjectShortName, 
		eachSlot, nSlots, batches) == false ) {
		return;	
	}
	if(alreadyValueNotPresentInDB(subject, "subjectName", subjectName.value) == false) {
		return;
	}
	if(alreadyValueNotPresentInDB(subject,  "subjectShortName", 
				subjectShortName.value) == false) {
		return;	
	}
	subjectName = subjectName.value;
	if(!validateAlNumFields(subjectName,"Subject Name"))
		return;
	subjectShortName = subjectShortName.value;
	if(!validateAlNumFields(subjectShortName,"Subject Short Name"))
		return;
	eachSlot = eachSlot.value;
	nSlots = nSlots.value;
	batches = batches.value;
	if(batches == -1 || batches == "No") {
		batches = 0;
	}
	else
		batches = 1;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//subjectChange(false);	/* TODO: Check this call */
				newsubject = {};
				newsubject["subjectName"] = subjectName;
				newsubject["subjectShortName"] = subjectShortName;
				newsubject["eachSlot"] = eachSlot;
				newsubject["nSlots"] = nSlots;
				newsubject["batches"] = batches;
				newsubject["snapshotId"] = currentSnapshotId;
				newsubject["subjectId"] = response["subjectId"];
				subject.unshift(newsubject);
				fillTable2(true);
				subjectForm();
				var formType = document.getElementById("inputSubjectForm");
				highlightRowAfterAdd(formType);
			} else {
				alert("subjectInsert " + subjectShortName + " Failed.");
				console.log("subjectInsert " + subjectShortName + " Failed. Error: " +
					response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=subjectInsert&subjectName=" + subjectName + "&subjectShortName=" +
			subjectShortName + "&eachSlot=" + eachSlot + "&nSlots=" + nSlots +
			"&batches=" + batches + "&snapshotId=" + currentSnapshotId);
}

function subjectUpdate(i) {
	var row = i;
	var subjectName, subjectShortName, eachSlot, nSlots, batches;
	subjectId = document.getElementById("sCenter_" + row).childNodes[0].nodeValue;
	subjectName = document.getElementById("subjectName_" + row);
	subjectShortName = document.getElementById("subjectShortName_" + row);
	eachSlot = document.getElementById("eachSlot_" + row).innerHTML;
	nSlots = document.getElementById("nSlots_" + row);
	batches = document.getElementById("batches_" + row).innerHTML;
	if(batches == "Yes")
		batches = 1;
	else 
		batches = 0;
	//Checking Parameter
	if(checkParameterValidity(subjectName, subjectShortName, 
			nSlots) == false ) {
		return;	
	}
	if(alreadyValueNotPresentInDB(subject, "subjectName", subjectName.value, 
		"subjectId", subjectId) == false) {
		return;
	}
	if(alreadyValueNotPresentInDB(subject,  "subjectShortName", 
				subjectShortName.value, "subjectId", subjectId) == false) {
		return;	
	}
	
	subjectName = subjectName.value;
	if(!validateAlNumFields(subjectName,"Subject Name"))
		return;
	subjectShortName = subjectShortName.value;
	if(!validateAlNumFields(subjectShortName,"Subject Short Name"))
		return;
	nSlots = nSlots.value;

	// Check undo/redo stack for clashing subjectId
	ret = urCheck("subjectId", subjectId);
	if(ret === false)
		return;

	document.getElementById("sUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("sDeleteButton_" + row).disabled = true;
	document.getElementById("sUpdateButton_" + row).disabled = true;

	row = i - 3;
	//var subjectOrigShortName = subject[row]["subjectShortName"];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			//alert("subject Row " + row + "Updated");
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("sUpdateButton_" + i).childNodes[0].nodeValue = "Updated";
				document.getElementById("sDeleteButton_" + i).disabled = false;
				document.getElementById("sUpdateButton_" + i).disabled = false;
				subject[row]["subjectName"] = subjectName;
				subject[row]["subjectShortName"] = subjectShortName;
				subject[row]["eachSlot"] = eachSlot;
				subject[row]["nSlots"] = nSlots;
				subject[row]["batches"] = batches;
				fillTable2(true);
				subjectForm();
			}
			else {
				document.getElementById("sUpdateButton_" + i).childNodes[0].nodeValue = "Update";
				alert("Subject " + subjectShortName + ": Update Failed.");
				console.log("Subject " + subjectShortName + ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("sDeleteButton_" + i).disabled = false;
				document.getElementById("sUpdateButton_" + i).disabled = false;
				subjectForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=subjectUpdate&subjectName=" + subjectName + "&subjectShortName=" +
				subjectShortName + "&eachSlot=" + eachSlot + "&nSlots=" + nSlots + "&batches=" + batches +
				"&subjectId=" + subjectId + "&snapshotId=" + currentSnapshotId);

}
function subjectDelete(i) {
	var row = i;
	var subjectShortName;
	var subjectId;
	var formType = document.getElementById("inputSubjectForm");
	highlightRowWhenDelete(formType, row);
	var sure = confirm("Warning: Deleting Subject will delete all related " +
						  "subject-teacher mappings, timetable entries, etc.\n" +
						  "This can not be undone. \n" +
						  "Are you sure?");
	if(sure != true) {
		unhighlightRowWhenDeleteCancel(formType, row);
		return -1;
	}
	subjectId = document.getElementById("sCenter_" + row).childNodes[0].nodeValue;
	//subjectShortName = document.getElementById("subjectShortName_" + row).value;

	// Check undo/redo stack for clashing subjectId
	ret = urCheck("subjectId", subjectId);
	if(ret === false)
		return;

	document.getElementById("sDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("sDeleteButton_" + row).disabled = true;
	document.getElementById("sUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("sDeleteButton_" + row).value = "Delete"
				subject.splice(i - 3, 1);
				fillTable2(true);
				subjectForm();
			} else {
				alert("Subject " + subjectShortName + ": Deletion Failed.");
				console.log("Subject " + subjectShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("sDeleteButton_" + row).value = "Delete"
				document.getElementById("sUpdateButton_" + row).disabled = false;
				document.getElementById("sDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=subjectDelete&subjectId=" + subjectId + "&snapshotId=" + currentSnapshotId);
	//console.log(subjectId);
}
function subjectRoomForm() {
	formOpen("inputSubjectRoomForm");
	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("subjectRoomTable","  ", "ID", "Subject", "Room", 2);

	/* ---- Adding "Add subjectRoom Row" -----------------------*/
	row = insertRow(table, 1);
	insertTextColumn(row, "", " ");
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);

	insertSelectTag(row, "srSubjectAdd", subject,"subjectId", "subjectName");
	$("#srSubjectAdd").select2({
		placeholder: "Insert Subject Name",
		width: '92%'
	});

	insertSelectTag(row, "srRoomAdd", room, "roomId", "roomShortName");
	$("#srRoomAdd").select2({
		placeholder: "Room Name",
		width: '92%'
	});

	cell = insertAddButton(row, "subjectRoomInsert()", 2);

	/* Add the existing subjectRoom entries */
	tr = document.getElementById("subjectRoomTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;
	for (i in subjectRoom) {
		currSubjectRoom = subjectRoom[i];
		var row = insertRow(table, count);

		insertInputBox(row, "checkbox", "srCheckBox" + count, "2", "", "", "", "");

		insertTextColumn(row, "srCenter_" + count, currSubjectRoom["srId"]);

		var cell = insertCell(row);
		cell.setAttribute("align","center");
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","subject_"+count);
		for (k in subject) {
			if(subject[k]["subjectId"] == currSubjectRoom["subjectId"])
				var tag = createOptionTag(subject[k]["subjectId"], subject[k]["subjectName"], true);
			else
				var tag = createOptionTag(subject[k]["subjectId"], subject[k]["subjectName"], false);
			selectTag.appendChild(tag);
		}
		cell.appendChild(selectTag);
		//$("#subject_"+i).select2();
		var id = "subject_" + count;
		updateDefault(id);
		selectTag.onchange = function() {enableUpdateButton(this.id);};

		var cell = insertCell(row);
		cell.setAttribute("align","center");
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","room_"+count);
		for (k in room) {
			if(room[k]["subjectes"] == 1) /* don't show subjectable rooms here */
				continue;
			if(room[k]["roomId"] == currSubjectRoom["roomId"])
				var tag = createOptionTag(room[k]["roomId"], room[k]["roomName"], true);
			else
				var tag = createOptionTag(room[k]["roomId"], room[k]["roomName"], false);
			selectTag.appendChild(tag);
		}
		cell.appendChild(selectTag);
		//$("#room_"+i).select2();
		var id = "room_" + count;
		updateDefault(id);
		selectTag.onchange = function() {enableUpdateButton(this.id);};

		insertUpdateButton(row, "subjectRoomUpdateButton_" + count,
							"subjectRoomUpdate(" + count + ")");
		insertDeleteButton(row, "subjectRoomDeleteButton_" + count,
							"subjectRoomDelete(" + count + ")");
		count++;
	}
}
function subjectRoomInsert() {
	var subjectId, roomId,  srId;
	subjectId = document.getElementById("srSubjectAdd").value;
	roomId = document.getElementById("srRoomAdd").value;
	/* parameter checking */
	if(selectTagsValueEmpty(subjectId, roomId) == true) {
		return;
	}
	roomShortName = search(room, "roomId", roomId)["roomShortName"];
	subjectName= search(subject, "subjectId", subjectId)["subjectName"];

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//subjectRoomChange(false);	/* TODO: Check this call */
				newSubjectRoom = {};
				newSubjectRoom["roomId"] = roomId;
				newSubjectRoom["subjectId"] = subjectId;
				newSubjectRoom["srId"] = response["srId"];
				subjectRoom.unshift(newSubjectRoom);
				fillTable2(true);
				subjectRoomForm();
				var formType = document.getElementById("inputSubjectRoomForm");
				highlightRowAfterAdd(formType);
			} else {
				alert("Insert subject: "
						+ subjectName + " Failed.");
				console.log("Insert subject: "
						+ subjectName + " Failed. \nError From Server: \n" + response["Error"]);

			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=subjectRoomInsert&roomId=" + roomId + "&subjectId=" +
				subjectId + "&snapshotId=" + currentSnapshotId);

}

function subjectRoomUpdate(i) {
	var row = i;
	var subjectId, roomId,  srId;
	subjectId = document.getElementById("subject_" + row).value;
	roomId = document.getElementById("room_" + row).value;
	/* parameter checking */
	if(selectTagsValueEmpty(subjectId, roomId) == true) {
		return;
	}
	srId = document.getElementById("srCenter_" + row).childNodes[0].nodeValue;
	document.getElementById("subjectRoomUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("subjectRoomDeleteButton_" + row).disabled = true;
	document.getElementById("subjectRoomUpdateButton_" + row).disabled = true;
	/* debug */
	roomShortName = search(room, "roomId", roomId)["roomShortName"];
	subjectName= search(subject, "subjectId", subjectId)["subjectName"];
	row = i - 2;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			//alert("subjectRoom Row " + row + "Updated");
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("subjectRoomUpdateButton_" + i).childNodes[0].nodeValue = "Updated";
				document.getElementById("subjectRoomDeleteButton_" + i).disabled = false;
				document.getElementById("subjectRoomUpdateButton_" + i).disabled = false;
				subjectRoom[row]["roomId"] = roomId;
				subjectRoom[row]["subjectId"] = subjectId;
				fillTable2(true);
				subjectRoomForm();
			}
			else {
				document.getElementById("subjectRoomUpdateButton_" + i).childNodes[0].nodeValue = "Update";
				alert("srId = " + srId + ": Update Failed for Subject: " +
									roomShortName + + " subject: " + subjectName);
				console.log("srId = " + srId + ": Update Failed for Subject: " +
									roomShortName + + " subject: " + subjectName
									+ "\nError:\n" + response["Error"]);

				document.getElementById("subjectRoomDeleteButton_" + i).disabled = false;
				document.getElementById("subjectRoomUpdateButton_" + i).disabled = false;
				subjectRoomForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=subjectRoomUpdate&roomId=" + roomId + "&subjectId=" +
				subjectId + "&srId=" + srId + "&snapshotId=" + currentSnapshotId);

}
function subjectRoomDelete(i) {
	var row = i;
	var srId;
	var formType = document.getElementById("inputSubjectRoomForm");
	highlightRowWhenDelete(formType, row);
	var sure = confirm("This will delete all related timetable entries also\n"
				+ "This can not be undone. \nAre you sure?");
	if(sure != true) {
		unhighlightRowWhenDeleteCancel(formType, row);
		return -1;
	}
	srId = document.getElementById("srCenter_" + row).childNodes[0].nodeValue;
	document.getElementById("subjectRoomDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("subjectRoomDeleteButton_" + row).disabled = true;
	document.getElementById("subjectRoomUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("subjectRoomDeleteButton_" + row).value = "Delete"
				subjectRoom.splice(i - 2, 1);
				fillTable2(true);
				subjectRoomForm();
			} else {
				alert("subjectRoom " + srId + ": Deletion Failed.");
				console.log("subjectRoom " + srId + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("subjectRoomDeleteButton_" + row).value = "Delete"
				document.getElementById("subjectRoomUpdateButton_" + row).disabled = false;
				document.getElementById("subjectRoomDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=subjectRoomDelete&srId=" + srId + "&snapshotId=" + currentSnapshotId);
}

function enableUpdateButton(id) {
	count = id.substring(id.indexOf("_")+1);
	var x = document.getElementById(id);
	var z = 0;
	if(x.defaultValue != x.value) {
		if(currentFormName == "inputClassForm")
			document.getElementById("cUpdateButton_" + count).disabled = false;
		else if(currentFormName == "inputTeacherForm")
			document.getElementById("tUpdateButton_" + count).disabled = false;
		else if(currentFormName == "inputSubjectForm")
			document.getElementById("sUpdateButton_" + count).disabled = false;
		else if(currentFormName == "inputRoomForm")
			document.getElementById("rUpdateButton_" + count).disabled = false;
		else if(currentFormName == "inputSubjectRoomForm")
			document.getElementById("subjectRoomUpdateButton_" + count).disabled = false;
		else if(currentFormName == "inputClassRoomForm")
			document.getElementById("classRoomUpdateButton_" + count).disabled = false;
		else if(currentFormName == "inputBatchRoomForm")
			document.getElementById("batchRoomUpdateButton_" + count).disabled = false;
		
	}	
}

function updateDefault(id) {
	var x = document.getElementById(id);
	x.defaultValue = x.value;
}

function teacherForm() {
	formOpen("inputTeacherForm");
	/* ---- Adding Header Row -----------------------*/

	var table = insertHeaderRow("teacherTable","  ","ID", "Full Name", "Short Name",
					"Min Hrs", "Max Hrs", "Dept", 2);
	/* ---- Adding "Add Teacher Row" -----------------------*/
	row = insertRow(table, 1);
	insertTextColumn(row, "", " ");
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);
	insertInputBox(row, "text", "teacherNameAdd", "32", "Enter Teacher Name", "", "Teacher's Name");
	insertInputBox(row, "text", "teacherShortNameAdd", "8", "Enter Short Name", "", "Teacher's Short Name");
	insertInputBox(row, "number", "minHrsAdd", "3", "Min Hrs of Work", "", "Minimum Working Hours", "0");
	insertInputBox(row, "number", "maxHrsAdd", "3", "Max Hrs of Work", "", "Maximum Working Hours", "0");

	var cell = insertCell(row);
	cell.setAttribute("align","center");
	currDeptId = 1; /* TODO: This should reflect the current dept under consideration */
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","deptAdd");
	for (k in dept) {
		if(dept[k]["deptId"] == currDeptId)
			var tag = createOptionTag(dept[k]["deptShortName"], dept[k]["deptShortName"], true);
		else 
			var tag = createOptionTag(dept[k]["deptShortName"], dept[k]["deptShortName"]);
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);

	cell = insertAddButton(row, "teacherInsert()", 2);
	
	/* ---- Adding Search Box -----------*/
	var searchrow = insertRow(table, 2);
	insertTextColumn(searchrow, "", " ");	
	insertTextColumn(searchrow, "blankID ", "");
	insertInputBox(searchrow, "text", "myInput5", 32, "Search for teacher names..", "", "Teacher's Name");
	searchrow.addEventListener("keyup", function() {Searchrow("teacherTable", "teacherName_", "myInput5")});

	searchrow.setAttribute("class","noMod");
	/* Add the existing teacher entries */
	tr = document.getElementById("teacherTable").rows[0];
	var ncells = tr.cells.length;
	var count = 3;

	for (i in teacher) {
		currTeacher = teacher[i];
		var row = insertRow(table, count);

		insertInputBox(row, "checkbox", "tCheckBox" + count, "2", "", "", "", ""); 

		insertTextColumn(row, "tCenter_" + count, currTeacher["teacherId"]);

		insertInputBox(row, "text", "teacherName_" + count, "32",
					"Teacher Name", currTeacher["teacherName"], "Teacher's Name");
		insertInputBox(row, "text", "teacherShortName_" + count, "8",
					"Short Name", currTeacher["teacherShortName"], "Teacher's Short Name");
		insertInputBox(row, "number", "minHrs_" + count, "32",
					"Min Hrs of Work", currTeacher["minHrs"],"Minimum Working Hours", "0");
		insertInputBox(row, "number", "maxHrs_" + count, "32",
					"Max Hrs of Work", currTeacher["maxHrs"],"Maximum Working Hours", "0");

		var cell = insertCell(row);
		cell.setAttribute("align","center");
		currDeptId = currTeacher["deptId"];
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","dept_"+count);
		for (k in dept) {
			if(dept[k]["deptId"] == currDeptId)
				var tag = createOptionTag(dept[k]["deptShortName"], dept[k]["deptShortName"], true);
			else 
				var tag = createOptionTag(dept[k]["deptShortName"], dept[k]["deptShortName"]);
			selectTag.appendChild(tag);
		}
		cell.appendChild(selectTag);
		id = "dept_" + count;
		updateDefault(id);
		selectTag.onchange = function() {enableUpdateButton(this.id);};

		insertUpdateButton(row, "tUpdateButton_" + count,
							"teacherUpdate(" + count + ")");
		insertDeleteButton(row, "tDeleteButton_" + count,
							"teacherDelete(" + count + ")");
		count++;
	}
	rowcount = count;
}
function Searchrow (x, y, z) {
  // Declare variables
  var input, filter, table, tr, td, 
  input = document.getElementById(z);
  filter = input.value.toUpperCase();
  table = document.getElementById(x);
  tr = table.getElementsByTagName("tr");
  //Loop through all table rows, and hide those who don't match the search query
  for (i = 3; i < tr.length; i++) {
    cellValue = document.getElementById(y + i).value.toUpperCase();
    if (cellValue) {
	if (cellValue.indexOf(filter) > -1){
		tr[i].style.display = "";
	}
	else{
		if(tr[i].className == "noMod")
			;
		else
			tr[i].style.display = "none";
	}
    }
  }
}
function getDeptId(deptShortName) {
	for (i in dept) {
		if(dept[i]["deptShortName"] == deptShortName)
			return dept[i]["deptId"];
	}
	return -1;
}
/*This function checks DOM validity for input n select
* Like require, pattern, number, time attributes
*require attribute is added in insertInputBox()
*/
function checkParameterValidity() {
	for(var i = 0; i < arguments.length; i++) {
		if(arguments[i].checkValidity() == false) {
        		alert(arguments[i].validationMessage + " "+ arguments[i].title);
        		return false;
    		}
	}
	return true;
}

function checkMinMaxHrs(minhrs, maxhrs){
	if(parseInt(minhrs.value) > parseInt(maxhrs.value)) {
		alert("Min Work hours must be less than Max Work Hour");
		return false;
	}
	return true;
}

function checkMinMaxBounds(minHrs, maxHrs) {
	//Get number of slots and duration of each slot
	var configrow = search(config, "configId", currentConfigId);
	var nSlotsPerDay = parseInt(configrow["nSlots"]);
	var slotDuration = parseInt(configrow["slotDuration"]);
	var minSeconds = parseInt(minHrs.value) * 3600;
	var maxSeconds = parseInt(maxHrs.value) * 3600;
	//No of days per week
	var days = 6;
	var limit = nSlotsPerDay * slotDuration * days;

	if(minSeconds > limit) {
		alert("Min work should be <= " + limit / 3600);
		return false;
	}
	if(maxSeconds > limit) {
		alert("Max work should be <= " + limit / 3600);
		return false;
	}
	return true;
}
/*If same field value alreay available in DB
*	return false
* tableIdCol n idValue is used while Updating
*
*/
function alreadyValueNotPresentInDB(table, tableColName, colValue, tableIdCol, idValue) {
	var row = search(table, tableColName, colValue);
	if(row !== -1) {/*Some row found with same value*/
		if(tableIdCol === undefined) {
			alert("The "+tableColName+" : "+colValue+" is Already Used.\nChoose another value");
			return false;
		}
		else if(row[tableIdCol] != idValue) {/*tableIdCol defined, while updating*/
			alert("The "+tableColName+" : "+colValue+" is Already Used.\nChoose another value");
			return false;
		}
	}
	return true;
}

function teacherInsert() {
	var teacherName, teacherShortName, minHrs, maxHrs, dept;
	teacherName = document.getElementById("teacherNameAdd");
	teacherShortName = document.getElementById("teacherShortNameAdd");
	minHrs = document.getElementById("minHrsAdd");
	maxHrs = document.getElementById("maxHrsAdd");
	dept = document.getElementById("deptAdd");
	//Checking Parameter
	if(checkParameterValidity(teacherName, teacherShortName, 
		minHrs, maxHrs, dept) == false ) {
		return;	
	}
	if(checkMinMaxHrs(minHrs, maxHrs) == false) {
		return;
	}
	if(checkMinMaxBounds(minHrs, maxHrs) == false) {
		return;
	}
	if(alreadyValueNotPresentInDB(teacher,  "teacherShortName",
				teacherShortName.value) == false) {
		return;	
	}
	teacherName = teacherName.value;
	if(!validateAlNumFields(teacherName,"Full Name"))
		return;
	teacherShortName = teacherShortName.value;
	if(!validateAlNumFields(teacherShortName,"Short Name"))
		return;
	minHrs = minHrs.value;
	maxHrs = maxHrs.value;
	dept = dept.value;
	
	var deptId = getDeptId(dept);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//teacherChange(false);	/* TODO: Check this call */
				newteacher = {};
				newteacher["teacherName"] = teacherName;
				newteacher["teacherShortName"] = teacherShortName;
				newteacher["minHrs"] = minHrs;
				newteacher["teacherId"] = response["teacherId"];
				newteacher["maxHrs"] = maxHrs;
				newteacher["deptId"] = deptId;
				newteacher["snapshotId"] = currentSnapshotId;
				teacher.unshift(newteacher);
				loadSelectMenus();
				teacherForm();
				var formType = document.getElementById("inputTeacherForm");
				highlightRowAfterAdd(formType);
			} else {
				alert("teacherInsert " + teacherShortName + " Failed.");
				console.log("teacherInsert " + teacherShortName + " Failed. Error: " + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=teacherInsert&teacherName=" + teacherName + "&teacherShortName=" +
			teacherShortName + "&minHrs=" + minHrs + "&maxHrs=" + maxHrs +
			"&deptId=" + deptId + "&snapshotId=" + currentSnapshotId);

}

function teacherUpdate(i) {
	var row = i;
	var teacherName, teacherShortName, minHrs, maxHrs, dept, teacherId;
	teacherId = document.getElementById("tCenter_" + row).childNodes[0].nodeValue;
	teacherName = document.getElementById("teacherName_" + row);
	teacherShortName = document.getElementById("teacherShortName_" + row);
	minHrs = document.getElementById("minHrs_" + row);
	maxHrs = document.getElementById("maxHrs_" + row);
	dept = document.getElementById("dept_" + row);
	//Checking Parameter
	if(checkParameterValidity(teacherName, teacherShortName, 
		minHrs, maxHrs, dept) == false ) {
		return;	
	}
	if(checkMinMaxHrs(minHrs, maxHrs) == false) {
		return;
	}
	if(checkMinMaxBounds(minHrs, maxHrs) == false) {
		return;
	}
	if(alreadyValueNotPresentInDB(teacher,  "teacherShortName",
				teacherShortName.value, "teacherId", teacherId) == false) {
		return;	
	}
	
	teacherName = teacherName.value;
	if(!validateAlNumFields(teacherName,"Teacher Name"))
		return;
	teacherShortName = teacherShortName.value;
	if(!validateAlNumFields(teacherShortName,"Teacher Short Name"))
		return;

	// Check undo/redo stack for clashing teacherId
	ret = urCheck("teacherId", teacherId);
	if(ret === false)
		return;

	minHrs = minHrs.value;
	maxHrs = maxHrs.value;
	dept = dept.value;
	document.getElementById("tUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("tDeleteButton_" + row).disabled = true;
	document.getElementById("tUpdateButton_" + row).disabled = true;

	row = i - 3;
	//var teacherOrigShortName = teacher[row]["teacherShortName"];
	var deptId = getDeptId(dept);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			//alert("teacher Row " + row + "Updated");
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("tUpdateButton_" + i).childNodes[0].nodeValue = "Updated";
				document.getElementById("tDeleteButton_" + i).disabled = false;
				document.getElementById("tUpdateButton_" + i).disabled = false;
				teacher[row]["teacherName"] = teacherName;
				teacher[row]["teacherShortName"] = teacherShortName;
				teacher[row]["minHrs"] = minHrs;
				teacher[row]["maxHrs"] = maxHrs;
				teacher[row]["deptId"] = deptId;
				if(type == "teacher")
					currTableId = teacherShortName;
				loadSelectMenus();
				fillTable2(true);
				teacherForm();
			}
			else {
				document.getElementById("tUpdateButton_" + i).childNodes[0].nodeValue = "Update";
				alert("Teacher " + teacherShortName + ": Update Failed.");
				console.log("Teacher " + teacherShortName + ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("tDeleteButton_" + i).disabled = false;
				document.getElementById("tUpdateButton_" + i).disabled = false;
				teacherForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=teacherUpdate&teacherName=" + teacherName + "&teacherShortName=" +
			teacherShortName + "&minHrs=" + minHrs + "&maxHrs=" + maxHrs + "&deptId=" + deptId +
			"&teacherId=" + teacherId + "&snapshotId=" + currentSnapshotId);

}
function teacherDelete(i) {
	var row = i;
	var teacherShortName;
	var teacherId;
	var formType = document.getElementById("inputTeacherForm");
	highlightRowWhenDelete(formType, row)
	var sure = confirm("Warning: Deleting teacher will delete all related " +
			  "subject-teacher mappings, timetable entries, etc.\n" +
			  "This can not be undone. \n" +
			  "Are you sure?");
	if(sure != true) {
		unhighlightRowWhenDeleteCancel(formType, row);
		return -1;
	}
	teacherId = document.getElementById("tCenter_" + row).childNodes[0].nodeValue;

	// Check undo/redo stack for clashing teacherId
	ret = urCheck("teacherId", teacherId);
	if(ret === false)
		return;

	document.getElementById("tDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("tDeleteButton_" + row).disabled = true;
	document.getElementById("tUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("tDeleteButton_" + row).value = "Delete";
				teacher.splice(row - 3, 1);
				timeTableList = [];
				sctList = [];
				sbtList = [];
				timeTablelength = timeTable.length;
				sctLength = subjectClassTeacher.length;
				sbtLength = subjectBatchTeacher.length;
				for(j = 0; j < timeTablelength; j++) {
					tempTimeTable = timeTable[j];
					if(tempTimeTable["teacherId"] == teacherId) {
						timeTableList.push(j);
					}
					if(j == timeTablelength - 1) {
						for(xy = timeTableList.length - 1; xy >= 0; xy--) {
							timeTable.splice(timeTableList[xy], 1);
						}
					}
				}
				for(k = 0; k < sctLength; k++) {
					tempSct = subjectClassTeacher[k];
					if(tempSct["teacherId"] == teacherId)
						sctList.push(k);
					if(k == sctLength - 1) {
						for(xy = sctList.length - 1; xy >= 0; xy--) {
							subjectClassTeacher.splice(sctList[xy], 1);
						}
					}
				}
				for(l = 0; l < sbtLength; l++) {
					tempSbt = subjectBatchTeacher[l];
						if(tempSbt["teacherId"] == teacherId)
							sbtList.push(l);
						if(l == sbtLength - 1) {
							for(xy = sbtList.length - 1; xy >= 0; xy--) {
								subjectBatchTeacher.splice(sbtList[xy], 1);
							}
						}
				}
				if(type == "teacher") {
					var index2 = document.getElementById("teacher-menu").selectedIndex;
					var teachername = document.getElementById("teacher-menu").options[index2].text;
				}
				loadSelectMenus();
				if(type == "teacher" && teachername == teacherShortName) {
					var j;
					if(row == rowcount - 1)
						j = 2;
					else
						j = row + 1;
					var teacherOptions = document.getElementById("teacher-menu");
					if(teacherOptions.options.length != 1) {
						teacherShortName = document.getElementById("teacherShortName_" + j).value;
						for(var i = 0; i < teacherOptions.options.length; i++) {
							if(teacherOptions.options[i].value == teacherShortName) {
								teacherOptions.options[i].selected = true;
								break;
							}
						}
						teacherChange(true);
					}
					else { /*No timetable to be loaded*/
						$("#mainTimeTable").append("<center><B>No TimeTable to be loaded </B><br>" +
							"Please select option from above catgories</center>");
						document.getElementById("title").innerHTML =  "<h2> Timetable for Computer Engg and IT (Effective 15 Jan 2018)</h2>";
					}
				}
				else
					fillTable2(true);
				teacherForm();
			} else {
				alert("Teacher " + teacherShortName + ": Deletion Failed.");
				console.log("Teacher " + teacherShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("tDeleteButton_" + row).value = "Delete"
				document.getElementById("tUpdateButton_" + row).disabled = false;
				document.getElementById("tDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=teacherDelete&teacherId=" + teacherId + "&snapshotId=" + currentSnapshotId);
}

function deleteSelectedFromsubjectTable() {
	var i, j, k, p, r, idx, x;
	var del = new Array();
	var del2 = new Array();
	var formType = document.getElementById("inputSubjectForm");
	for(i = 3, j = 0; i < subject.length+2; i++) {
		var c = document.getElementById("sCheckBox" + i);
		if(c.checked) {
			highlightRowWhenDelete(formType, i);
			idx = subject[i-3]['subjectId'];
			console.log(idx);
			del2[j] = i;
			del[j] = idx;
			j++;
		}
	}
	var sure = confirm("Warning: Deleting Subject will delete all related " +
							  "subject-teacher mappings, timetable entries, etc.\n" +
							  "This can not be undone. \n" +
							  "Are you sure?");
	if(sure != true) {
		for(k = 0; k < j; k++) {
			unhighlightRowWhenDeleteCancel(formType, del2[k]);
		}
		return -1;
	}
	for(k = 0; k < j;k++) {
		row = del2[k];
		document.getElementById("sDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
		document.getElementById("sDeleteButton_" + row).disabled = true;
		document.getElementById("sUpdateButton_" + row).disabled = true;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				for(k = 0,p = 0; k < j;k++,p++) {
					row = del2[k] - p;
					document.getElementById("sDeleteButton_" + row).value = "Delete"
					subject.splice(row - 3, 1);
				}
				fillTable2(true);
				subjectForm();
			} else {
				for(k = 0,p = 0; k < j;k++,p++) {
					row = del2[k] - p;
					alert("Subject " + subjectShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
					document.getElementById("sDeleteButton_" + row).value = "Delete"
					document.getElementById("sUpdateButton_" + row).disabled = false;
					document.getElementById("sDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
				}
			}
		}
	}
			
	var sub = { arr : del };
	sub = JSON.stringify(sub);
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=mSubjectDelete&subjectId=" + sub + "&snapshotId=" + currentSnapshotId);	
}

function deleteSelectedFromclassTable() {
	var i, j, k, p, r,idx;
	var del = new Array();
	var del2 = new Array();
	var formType = document.getElementById("inputClassForm");
	for(i = 3, j = 0; i < classTable.length+2; i++) {
		var c = document.getElementById("cCheckBox" + i);
		if(c.checked) {
			idx = classTable[i-3]['classId'];
			del2[j] = idx;
			console.log(idx); 
			highlightRowWhenDelete(formType, i);
			del[j] = i;
			j++;
		}
	}
	var sure = confirm("Warning: Deleting Subject will delete all related " +
							  "subject-teacher mappings, timetable entries, etc.\n" +
							  "This can not be undone. \n" +
							  "Are you sure?");
	if(sure != true) {
		for(k = 0; k < j; k++) {
			unhighlightRowWhenDeleteCancel(formType, del[k]);
		}
		return -1;
	}
	for(k = 0; k < j; k++) {
		row = del[k];
		document.getElementById("cDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
		document.getElementById("cDeleteButton_" + row).disabled = true;
		document.getElementById("cUpdateButton_" + row).disabled = true;
	}

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				for(k = 0,p = 0; k < j;k++,p++) {
					row = del[k] - p;
					document.getElementById("cDeleteButton_" + row).value = "Delete"
					classTable.splice(row - 3, 1);
					loadSelectMenus();
				}
				fillTable2(true);
				classForm();
			} else {
				for(k = 0,p = 0; k < j;k++,p++) {
					row = del[k] - p;
					alert("Class " + classShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
					document.getElementById("cDeleteButton_" + row).value = "Delete"
					document.getElementById("cUpdateButton_" + row).disabled = false;
					document.getElementById("cDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
				}
			}
		}
	}
	var cls = { arr : del2 };
	cls = JSON.stringify(cls);
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=mClassDelete&classId=" + cls + "&snapshotId=" + currentSnapshotId);

										
}

function deleteSelectedFromteacherTable() {
	var i, j, k, p, r,idx,row;
	var del = new Array();
	var del2 = new Array();
	var formType = document.getElementById("inputTeacherForm");
	for(i = 3, j = 0; i < teacher.length+2; i++) {
		var c = document.getElementById("tCheckBox" + i);
		if(c.checked) {
			idx = teacher[i-3]['teacherId'];
			del2[j] = idx;
			console.log(idx);
			highlightRowWhenDelete(formType, i);
			del[j] = i;
			j++;
		}
	}
	var sure = confirm("Warning: Deleting Subject will delete all related " +
							  "subject-teacher mappings, timetable entries, etc.\n" +
							  "This can not be undone. \n" +
							  "Are you sure?");
	if(sure != true) {
		for(k = 0; k < j; k++) {
			unhighlightRowWhenDeleteCancel(formType, del[k]);
		}
		return -1;
	}
	for(k = 0; k < j; k++) {
		row = del[k];
		document.getElementById("tDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
		document.getElementById("tDeleteButton_" + row).disabled = true;
		document.getElementById("tUpdateButton_" + row).disabled = true;		
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				for(k = 0, p = 0; k < j; k++, p++) {
					row = del[k] - p;
					document.getElementById("tDeleteButton_" + row).value = "Delete"
					teacher.splice(row - 3, 1);
					loadSelectMenus();
				}
				fillTable2(true);
				teacherForm();
			} else {
				for(k = 0,p = 0; k < j;k++,p++) {
					row = del[k] - p;
					alert("Teacher " + teacherShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
					document.getElementById("tDeleteButton_" + row).value = "Delete"
					document.getElementById("tUpdateButton_" + row).disabled = false;
					document.getElementById("tDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
				}
			}
		}
	}
	var tec = { arr : del2 };
	tec = JSON.stringify(tec);
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=mTeacherDelete&teacherId=" + tec + "&snapshotId=" + currentSnapshotId);
										
}

function deleteSelectedFrombatchTable() {
	var i, j, k, p, r, idx, row;
	var del = new Array();
	var del2 = new Array();
	var formType = document.getElementById("inputBatchForm");
	for(i = 3, j = 0; i < batch.length+2; i++) {
		var c = document.getElementById("bfCheckBox" + i);
		if(c.checked) {
			idx = batch[i-3]['batchId'];
			del2[j] = idx;
			console.log(idx);
			highlightRowWhenDelete(formType, i);
			del[j] = i;
			j++;
		}
	}
	var sure = confirm("Warning: Deleting Subject will delete all related " +
							  "subject-teacher mappings, timetable entries, etc.\n" +
							  "This can not be undone. \n" +
							  "Are you sure?");
	if(sure != true) {
		for(k = 0; k < j; k++) {
			unhighlightRowWhenDeleteCancel(formType, del[k]);
		}
		return -1;
	}
	for(k = 0; k < j; k++) {
		row = del[k];
		document.getElementById("bDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
		document.getElementById("bDeleteButton_" + row).disabled = true;	
	}
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				for(k = 0, p = 0; k < j; k++, p++) {
					row = del[k] - p;
					document.getElementById("bDeleteButton_" + row).value = "Delete"
					batch.splice(row - 3, 1);
					loadSelectMenus();
				}
				fillTable2(true);
				batchForm();
			} else {
				for(k = 0,p = 0; k < j;k++,p++) {
					row = del[k]- p;
					alert("Batch " + batchName + ": Deletion Failed.\nError:\n" + response["Error"]);
					document.getElementById("bDeleteButton_" + row).value = "Delete"
					//document.getElementById("bUpdateButton_" + row).disabled = false;
					document.getElementById("bDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
				}
			}
		}
	}
	var bat = { arr : del2 };
	bat = JSON.stringify(bat);
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=mBatchDelete&batchId=" + bat + "&snapshotId=" + currentSnapshotId);	
											
}

function deleteSelectedFromroomTable() {
	var i, j, k, p, r,row,idx;
	var del = new Array();
	var del2 = new Array();
	var formType = document.getElementById("inputRoomForm");
	for(i = 3, j = 0; i < room.length+2; i++) {
		var c = document.getElementById("rCheckBox" + i);
		if(c.checked) {
			idx = room[i-3]['roomId'];
			del2[j] = idx;
			console.log(idx);
			highlightRowWhenDelete(formType, i);
			del[j] = i;
			j++;
		}
	}
	var sure = confirm("Warning: Deleting Subject will delete all related " +
							  "subject-teacher mappings, timetable entries, etc.\n" +
							  "This can not be undone. \n" +
							  "Are you sure?");
	if(sure != true) {
		for(k = 0; k < j; k++) {
			unhighlightRowWhenDeleteCancel(formType, del[k]);
		}
		return -1;
	}
	for(k = 0, p = 0; k < j; k++, p++) {
		row = del[k];
		document.getElementById("rDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
		document.getElementById("rDeleteButton_" + row).disabled = true;
		document.getElementById("rUpdateButton_" + row).disabled = true;	
	}
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				for(k = 0, p = 0; k < j; k++, p++) {
				row = del[k] - p;
				document.getElementById("rDeleteButton_" + row).value = "Delete"
				room.splice(row - 3, 1);
				}
				loadSelectMenus();
				fillTable2(true);
				roomForm();
			} else {
				for(k = 0,p = 0; k < j;k++,p++) {
					row = del[k] - p;
					alert("Room " + roomShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
					document.getElementById("rDeleteButton_" + row).value = "Delete"
					document.getElementById("rUpdateButton_" + row).disabled = false;
					document.getElementById("rDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
				}
			}
		}
	}
	var rom = { arr : del2 };
	rom = JSON.stringify(rom);
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=mRoomDelete&roomId=" + rom + "&snapshotId=" + currentSnapshotId);
												
}

function deleteSelectedFrombatchRoomTable() {
	var i, j, k, p, r, idx, row;
	var del = new Array();
	var del2 = new Array();
	var formType = document.getElementById("inputBatchRoomForm");
	for(i = 2, j = 0; i < batchRoom.length+2; i++) {
		var c = document.getElementById("brCheckBox" + i);
		if(c.checked) {
			idx = batchRoom[i-2]['brId'];
			del2[j] = idx;
			console.log(idx);
			highlightRowWhenDelete(formType, i);
			del[j] = i;
			j++;
		}
	}
	var sure = confirm("Warning: Deleting Subject will delete all related " +
							  "subject-teacher mappings, timetable entries, etc.\n" +
							  "This can not be undone. \n" +
							  "Are you sure?");
	if(sure != true) {
		for(k = 0; k < j; k++) {
			unhighlightRowWhenDeleteCancel(formType, del[k]);
		}
		return -1;
	}
	for(k = 0; k < j; k++) {
		row = del[k];
		document.getElementById("batchRoomDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
		document.getElementById("batchRoomDeleteButton_" + row).disabled = true;
		document.getElementById("batchRoomUpdateButton_" + row).disabled = true;		
	}
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				for(k = 0, p = 0; k < j; k++, p++) {
					row = del[k] - p;
					document.getElementById("batchRoomDeleteButton_" + row).value = "Delete"
					batchRoom.splice(row - 2, 1);
				}
				fillTable2(true);
				batchRoomForm();
			} else {
				for(k = 0,p = 0; k < j;k++,p++) {
					row = del[k] - p;
					alert("batchRoom " + brId + ": Deletion Failed.\nError:\n" + response["Error"]);
					document.getElementById("batchRoomDeleteButton_" + row).value = "Delete"
					document.getElementById("batchRoomUpdateButton_" + row).disabled = false;
					document.getElementById("batchRoomDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
				}
			}
		}
	}
	var brt = { arr : del2 };
	brt = JSON.stringify(brt);
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=mBatchRoomDelete&brId=" + brt + "&snapshotId=" + currentSnapshotId);		
											
}

function deleteSelectedFromclassRoomTable() {
	var i, j, k, p, r, idx, row;
	var del2 = new Array();
	var del = new Array();
	var formType = document.getElementById("inputClassRoomForm");
	for(i = 2, j = 0; i < classRoom.length+2; i++) {
		var c = document.getElementById("crfCheckBox" + i);
		if(c.checked) {
			idx = classRoom[i-2]['crId'];
			del2[j] = idx;
			console.log(idx);
			highlightRowWhenDelete(formType, i);
			del[j] = i;
			j++;
		}
	}
	var sure = confirm("Warning: Deleting Subject will delete all related " +
							  "subject-teacher mappings, timetable entries, etc.\n" +
							  "This can not be undone. \n" +
							  "Are you sure?");
	if(sure != true) {
		for(k = 0; k < j; k++) {
			unhighlightRowWhenDeleteCancel(formType, del[k]);
		}
		return -1;
	}
	for(k = 0; k < j; k++) {
		row = del[k];
		document.getElementById("classRoomDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
		document.getElementById("classRoomDeleteButton_" + row).disabled = true;
		document.getElementById("classRoomUpdateButton_" + row).disabled = true;		
	}
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				for(k = 0, p = 0; k < j; k++, p++) {
					row = del[k] - p;
					document.getElementById("classRoomDeleteButton_" + row).value = "Delete"
					classRoom.splice(row - 2, 1);
				}
				fillTable2(true);
				classRoomForm();
			} else {
				for(k = 0,p = 0; k < j;k++,p++) {
					row = del[k] - p;
					alert("classRoom " + crId + ": Deletion Failed.\nError:\n" + response["Error"]);
					document.getElementById("classRoomDeleteButton_" + row).value = "Delete"
					document.getElementById("classRoomUpdateButton_" + row).disabled = false;
					document.getElementById("classRoomDeleteButton_" +
							row).childNodes[0].nodeValue = "Can't Delete";
				}
			}
		}
	}
	var crt = { arr : del2 };
	crt = JSON.stringify(crt);
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=mClassRoomDelete&crId=" + crt + "&snapshotId=" + currentSnapshotId);		
										
}

function deleteSelectedFromsubjectRoomTable() {
	var i, j, k, p, r;
	var del = new Array();
	var del2 = new Array();
	var formType = document.getElementById("inputSubjectRoomForm");
	for(i = 2, j = 0; i < subjectRoom.length+2; i++) {
		var c = document.getElementById("srCheckBox" + i);
		if(c.checked) {
			idx = subjectRoom[i-2]['srId'];
			del2[j] = idx;
			console.log(idx);
			highlightRowWhenDelete(formType, i);
			del[j] = i;
			j++;
		}
	}
	
	var sure = confirm("Warning: Deleting Subject will delete all related " +
							  "subject-teacher mappings, timetable entries, etc.\n" +
							  "This can not be undone. \n" +
							  "Are you sure?");
	if(sure != true) {
		for(k = 0; k < j; k++) {
			unhighlightRowWhenDeleteCancel(formType, del[k]);
		}
		return -1;
	}
	
	for(k = 0; k < j; k++) {
		row = del[k];		
		document.getElementById("subjectRoomDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
		document.getElementById("subjectRoomDeleteButton_" + row).disabled = true;
		document.getElementById("subjectRoomUpdateButton_" + row).disabled = true;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				for(k = 0, p = 0; k < j; k++, p++) {
					row = del[k] - p;
					document.getElementById("subjectRoomDeleteButton_" + row).value = "Delete"
					subjectRoom.splice(row - 2, 1);
				}
				fillTable2(true);
				subjectRoomForm();
			} else {
				for(k = 0,p = 0; k < j;k++,p++) {
					row = del[k] - p;
					alert("subjectRoom " + srId + ": Deletion Failed.\nError:\n" + response["Error"]);
					document.getElementById("subjectRoomDeleteButton_" + row).value = "Delete"
					document.getElementById("subjectRoomUpdateButton_" + row).disabled = false;
					document.getElementById("subjectRoomDeleteButton_" + row).childNodes[0].nodeValue = "Can't 																Delete";
				}
			}
		}
	}
	var srt = { arr : del2 };
	srt = JSON.stringify(srt);
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=mSubjectRoomDelete&srId=" + srt + "&snapshotId=" + currentSnapshotId);
											
}

function deleteSelectedFromsbtTable() {
	var i, j, k, p, r;
	var sbtId,sbtRow,subjectId,batchId,teacherId;
	var del = new Array();
	var del2 = new Array();
	var srdel = new Array();
	var sdel = new Array();
	var bdel = new Array();
	var tdel = new Array();
	var formType = document.getElementById("inputSBTForm");
	for(i = 2, j = 0; i < subjectBatchTeacher.length+2; i++) {
		var c = document.getElementById("sbtCheckBox" + i);
		if(c.checked) {
			sbtId = subjectBatchTeacher[i - 2]['sbtId'];
			del2[j] = sbtId;
			sbtRow =  search(subjectBatchTeacher, "sbtId", sbtId);
			srdel[j] = sbtRow;
			subjectId = sbtRow["subjectId"];
			sdel[j] = subjectId;
			batchId = sbtRow["batchId"];
			bdel[j] = batchId;
			teacherId = sbtRow["teacherId"];
			tdel[j] = teacherId;
			highlightRowWhenDelete(formType, i);
			del[j] = i;
			j++;
		}
	}
	
	var sure = confirm("Warning: Deleting Subject will delete all related " +
							  "subject-teacher mappings, timetable entries, etc.\n" +
							  "This can not be undone. \n" +
							  "Are you sure?");
	if(sure != true) {
		for(k = 0; k < j; k++) {
			unhighlightRowWhenDeleteCancel(formType, del[k]);
		}
		return -1;
	}
	
	for(k = 0; k < j; k++) {
		row = del[k];
		document.getElementById("sbtDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
		document.getElementById("sbtDeleteButton_" + row).disabled = true;
	}
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				for(k = 0, p = 0; k < j; k++, p++) {
					row = del[k] - p;
					sbtId = del2[k];
					document.getElementById("sbtDeleteButton_" + row).value = "Delete"
					subjectBatchTeacher.splice(row - 2, 1);
					getTimetable(currentSnapshotName);
					for(var x = 0; x < overlappingSBT.length; x++) {
						if(overlappingSBT[x]["sbtId1"] == sbtId ||
							overlappingSBT[x]["sbtId2"] == sbtId)  {
							overlappingSBT.splice(x--, 1);
						}
					}
				}
				fillTable2(true);
				sbtForm();
			} else {
				for(k = 0,p = 0; k < j;k++,p++) {
					row = del[k] - p;
					alert("sbt " + sbtId + ": Deletion Failed.\nError:\n" + response["Error"]);
					document.getElementById("sbtDeleteButton_" + row).value = "Delete"
					document.getElementById("sbtDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
					document.getElementById("sbtDeleteButton_" + row).disabled = false;
				}
			}
		}
	}
	var sbt = { arr : del2 };
	sbt = JSON.stringify(sbt);
	var sub = { arr : sdel };
	sub = JSON.stringify(sub);
	var bat = { arr : bdel };
	bat = JSON.stringify(bat);
	var tec = { arr : tdel };
	tec = JSON.stringify(tec);
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=mSbtDelete&sbtId=" + sbt + "&snapshotId=" + currentSnapshotId
				+ "&subjectId=" + sub + "&batchId=" + bat + "&teacherId=" + tec);
	
											
}

function deleteSelectedFromsctTable() {
	var i, j, k, p, r;
	var classId, subjectId, teacheId, sctId;
	var sctRow;
	var del = new Array();
	var del2 = new Array();
	var srdel = new Array();
	var sdel = new Array();
	var cdel = new Array();
	var tdel = new Array();
	var formType = document.getElementById("inputSCTForm");
	for(i = 2, j = 0; i < subjectClassTeacher.length+2; i++) {
		var c = document.getElementById("sctCheckBox" + i);
		if(c.checked) {
			sctId = subjectClassTeacher[i - 2]['sctId'];
			del2[j] = sctId;
			sctRow =  search(subjectClassTeacher, "sctId", sctId);
			srdel[j] = sctRow;
			subjectId = sctRow["subjectId"];
			sdel[j] = subjectId;
			classId = sctRow["classId"];
			cdel[j] = classId;
			teacherId = sctRow["teacherId"];
			tdel[j] = teacherId;
			highlightRowWhenDelete(formType, i);
			del[j] = i;
			j++;
		}
	}
	
	var sure = confirm("Warning: Deleting Subject will delete all related " +
							  "subject-teacher mappings, timetable entries, etc.\n" +
							  "This can not be undone. \n" +
							  "Are you sure?");
	if(sure != true) {
		for(k = 0; k < j; k++) {
			unhighlightRowWhenDeleteCancel(formType, del[k]);
		}
		return -1;
	}
	
	for(k = 0; k < j; k++) {
		row = del[k];
		document.getElementById("sctDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
		document.getElementById("sctDeleteButton_" + row).disabled = true;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				for(k = 0, p = 0; k < j; k++, p++) {
					row = del[k] - p;
					document.getElementById("sctDeleteButton_" + row).value = "Delete"
					subjectClassTeacher.splice(row - 2, 1);
					getTimetable(currentSnapshotName);
				}
				fillTable2(true);
				sctForm();
			} else {
				for(k = 0, p = 0; k < j; k++, p++) {
					row = del[k] - p;
					alert("sct " + sctId + ": Deletion Failed.\nError:\n" + response["Error"]);
					document.getElementById("sctDeleteButton_" + row).value = "Delete"
					document.getElementById("sctDeleteButton_" + row).disabled = false;
					document.getElementById("sctDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
				}
			}
		}
	}
	
	var sct = { arr : del2 };
	sct = JSON.stringify(sct);
	var sub = { arr : sdel };
	sub = JSON.stringify(sub);
	var cls = { arr : cdel };
	cls = JSON.stringify(cls);
	var tec = { arr : tdel };
	tec = JSON.stringify(tec);
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=mSctDelete&sctId=" + sct + "&snapshotId=" + currentSnapshotId + "&subjectId=" +
				sub + "&teacherId=" + tec + "&classId=" + cls);

	
											
}


function deleteSelectedFrombatchCanOverlapTable() {
	var i, j, k, p, r;
	var del = new Array();
	var bco = new Array();
	var formType = document.getElementById("inputBatchCanOverlapForm");
	for(i = 2, j = 0; i < overlaps.length+2; i++) {
		var c = document.getElementById("bcoCheckBox" + i);
		if(c.checked) {
			highlightRowWhenDelete(formType, i);
			del[j] = i;
			j++;
		}
	}
	
	var sure = confirm("Warning: Deleting Subject will delete all related " +
							  "subject-teacher mappings, timetable entries, etc.\n" +
							  "This can not be undone. \n" +
							  "Are you sure?");
	if(sure != true) {
		for(k = 0; k < j; k++) {
			unhighlightRowWhenDeleteCancel(formType, del[k]);
		}
		return -1;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			//alert(this.responseText);
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				for(k = 0, p = 0; k < j; k++, p++) {
					row = del[k] - p;
					//console.log(row);
					document.getElementById("batchCanOverlapDeleteButton_" + row).value = "Delete"
					overlaps.splice(row - 2, 1);
					}
					batchCanOverlap = getOneTable("batchCanOverlap", false).batchCanOverlap;
					fillTable2(true);
					batchCanOverlapForm();
			} else {
				for(k = 0, p = 0; k < j; k++, p++) {
					row = del[k] - p;
					alert("BatchCanOverlap " + JSON.stringify(overlaps[row]) +
						": Deletion Failed.\nError:\n" + response["Error"]);
					document.getElementById("batchCanOverlapDeleteButton_" + row).value = "Delete"
					document.getElementById("batchCanOverlapUpdateButton_" + row).disabled = false;
					document.getElementById("batchCanOverlapDeleteButton_" +
							row).childNodes[0].nodeValue = "Can't Delete";
				}
			}
		}
	}
	k = 0;
	
	for(i = 0 ; i < del.length;i++) {
		bco[i] = overlaps[del[k] - 2];
		k++ 
	}
	bco = {arr:bco};
	bco = JSON.stringify(bco);
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	//alert("Asking to delete " + JSON.stringify(overlaps[row]));
	xhttp.send("reqType=mBatchCanOverlapDelete&batches=" + bco + "&snapshotId=" + currentSnapshotId);
											
}

function deleteSelectedFromoverlappingSBTTable() {
	var i, j, k, p, r, x, z = 0, a, idx;
	var b = new Array();
	var del = new Array();
	var del2 = new Array();
	var sb1 = new Array();
	var sb2 = new Array();
	var temp = overlappingSBT.slice();
	var formType = document.getElementById("inputoverlappingSBTForm");
	for(i = 2, j = 0; i < overlappingSBT.length+2; i++) {
		var c = document.getElementById("osbtCheckBox" + i);
		if(c.checked) {
			idx = overlappingSBT[i-2]['osbtId'];
			sbtId1 = search(overlappingSBT, "osbtId", idx)["sbtId1"];
			sb1[j] = sbtId1;
			sbtId2 = search(overlappingSBT, "osbtId", idx)["sbtId2"];
			sb2[j] = sbtId2;
			del[j] = idx;
			del2[j] = i;
			j++;
			for(a in temp) {
				if(temp[a]["sbtId1"] == sbtId1 ||
				temp[a]["sbtId2"] == sbtId1 ||
				temp[a]["sbtId1"] == sbtId2 ||
				temp[a]["sbtId2"] == sbtId2)  {
				var y = parseInt(a);
				b[z] = y + 2;
				z++;
				}
			}
		}
	}
	// for highlighting Selected rows
	for(z = 0;z < b.length;z++) {
		highlightRowWhenDelete(formType, b[z]);
		
	}
		
	var sure = confirm("Warning: Deleting Subject will delete all related " +
							  "subject-teacher mappings, timetable entries, etc.\n" +
							  "This can not be undone. \n" +
							  "Are you sure?");
	if(sure != true) {
		for(z = 0;z < b.length;z++) {
			unhighlightRowWhenDeleteCancel(formType, b[z]);
		}
		return -1;
	}	
	for(k = 0; k < j; k++) {
		row = b[k];
		document.getElementById("overlappingSBTDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
		document.getElementById("overlappingSBTDeleteButton_" + row).disabled = true;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				for(k = 0, p = 0; k < j; k++, p++) {
					row = del2[k];
					sbtId1 = sb1[k];
					sbtId2 = sb2[k];
					document.getElementById("overlappingSBTDeleteButton_" + row).value = "Delete";
					deleted = true;
					while(deleted) {
						deleted = false;
						for(x in overlappingSBT) {
							if(overlappingSBT[x]["sbtId1"] == sbtId1 ||
								overlappingSBT[x]["sbtId2"] == sbtId1 ||
								overlappingSBT[x]["sbtId1"] == sbtId2 ||
								overlappingSBT[x]["sbtId2"] == sbtId2)  {
									overlappingSBT.splice(x, 1);
									deleted = true;
							}
						}
					}
				}
				fillTable2(true);
				overlappingSBTForm();
			} else {
				for(k = 0, p = 0; k < j; k++, p++) {
					row = del2[k];
					alert("overlappingSBT " + osbtId + ": Deletion Failed.\nError:\n" + response["Error"]);
					document.getElementById("overlappingSBTDeleteButton_" +
							row).value = "Delete"
					document.getElementById("overlappingSBTDeleteButton_" +
							row).childNodes[0].nodeValue = "Can't Delete";
				}
			}
		}
	}
	var osbt = { arr : del };
	osbt = JSON.stringify(osbt);
	var sbt1 = { arr : sb1 };
	sbt1 = JSON.stringify(sbt1);
	var sbt2 = { arr : sb2 };
	sbt2 = JSON.stringify(sbt2);
	xhttp.open("POST", "timetable.php", true); // synchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=mOverlappingSBTDelete&osbtId=" + osbt + "&snapshotId=" + currentSnapshotId + "&sbtId1=" + sbt1 + 					"&sbtId2=" + sbt2);
											
}

function highlightRowWhenDelete(formType, i) {
	var rows = formType.getElementsByTagName('tr');
	rows[i+1].setAttribute("style", "background-color : red");
}


function unhighlightRowWhenDeleteCancel(formType, i) {
	var rows = formType.getElementsByTagName('tr');
	rows[i+1].setAttribute("style", "background-color : inherit;");

}

function snapshotForm() {
	formOpen("inputSnapshotForm");

	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("snapshotTable", "ID", "Snapshot Name", 1);

	/* Add the existing snapshot entries */
	tr = document.getElementById("snapshotTable").rows[0];
	var ncells = tr.cells.length;
	var count = 1;

	for (i in snapshot) {
		currSnapshot = snapshot[i];
		var row = insertRow(table, count);

		insertTextColumn(row, "sstCenter_" + count, currSnapshot["snapshotId"]);
		insertTextColumn(row, "snapshotName_" + count, currSnapshot["snapshotName"]);
		insertDeleteButton(row, "sstDeleteButton_" + count,
							"snapshotDelete(" + count + ")");

			count++;
	}
}
function snapshotDelete(i) {
	var row = i;
	var snapshotName, snapshotId;
	var sure = confirm("Warning: Deleting the snapshot will delete all related " +
				  "rooms, classes, teachers, subjects, batches, timetable entries, etc.\n" +
				  "This can not be undone. \n" +
				  "Are you sure?");
	if(sure != true)
		return;
	snapshotId = document.getElementById("sstCenter_" + row).childNodes[0].nodeValue;
	document.getElementById("sstDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("sstDeleteButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("sstDeleteButton_" + row).value = "Delete"
				snapshot.splice(i - 1, 1);
				var snapshotChangeNeeded = 0;
				if(currentSnapshotId === snapshotId) {
					snapshotChangeNeeded = 1;
				}
				/* If there is atleast one snapshot left after deletion*/
				if(snapshot.length > 1) {
					if(snapshotChangeNeeded) {
						loadSnapshotMenu();
						document.getElementById("fetch-snapshot-menu").selectedIndex = 1;
						dirtyTimeTable = 0;//Set dirty bit to zero so that the save snapshot alert won't pop up
						snapshotChange();
					}
					else {
						loadSnapshotMenu();
					}
				}
				else {
					load();
				}
				snapshotForm();
			} else {
				alert("Snapshot " + snapshotName + ": Deletion Failed.");
				console.log("Snapshot " + snapshotName + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("sstDeleteButton_" + row).value = "Delete"
				document.getElementById("sstDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=snapshotDelete&snapshotId=" + snapshotId);
}


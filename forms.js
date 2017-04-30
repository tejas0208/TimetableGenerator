function formClose(formName) {
	document.getElementById(formName).style.height = "0%";
	document.getElementById("outerTable").style.display = "table";
	document.getElementById(formName).style.display = "none";
}
var currentFormName;
function formOpen(formName) {
	document.getElementById(formName).style.height = "auto";
	document.getElementById(formName).style.display = "block";
	document.getElementById("outerTable").style.display = "none";
	currentFormName = formName;
}
function insertHeaderRow(tableName) {
	var table = document.getElementById(tableName);
	/* Set to empty. Required for recursive calls*/
	table.innerHTML = "";

	var tr = document.createElement("tr");
	table.appendChild(tr);

	for(var j = 1; j < arguments.length - 1; j++) {
		var th = document.createElement("th");
		tr.appendChild(th);
		var tc = document.createTextNode(arguments[j]);
		th.appendChild(tc);
	}

	th = document.createElement("th");
	th.setAttribute("colspan", arguments[j]);
	th.setAttribute("text-align", "center");
	tr.appendChild(th);
	tc = document.createTextNode("Actions");
	th.appendChild(tc);
	return table;
}
function insertAddButton(row, onClickFunction, colspan) {
	var cell = row.insertCell(-1);
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
	cell = row.insertCell(-1);
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
	cell = row.insertCell(-1);
	cell.setAttribute("align","center");
	var button = document.createElement("button");
	cell.appendChild(button);
	button.value = "Update";
	button.name = id;
	var textNode = document.createTextNode("Update");
	button.appendChild(textNode);
	button.setAttribute("onclick", onClickFunction);
	button.setAttribute("id", id);
}
function insertTextColumn(row, id, text) {
	var cell = row.insertCell(-1);
	var centerTag = document.createElement("center");
	centerTag.setAttribute("id", id);
	centerTag.setAttribute("class", "formText");
	var centerText = document.createTextNode(text);
	centerTag.appendChild(centerText);
	cell.appendChild(centerTag);
	return cell;
}
function insertSelectTag(row, id, table, valueId, displayId) {
	/*var selectTag = document.createElement("select");
	selectTag.setAttribute("id","subjectAdd");
	var tag = createOptionTag(-1, "", false);
	selectTag.appendChild(tag);
	for (k in subject) {
		if(subject[k]["batches"] == 0)
			continue;
		var tag = createOptionTag(subject[k]["subjectId"], subject[k]["subjectName"], false);
		selectTag.appendChild(tag);
	} */

	cell = row.insertCell(-1);
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
function insertInputBox(row, type, id, size, placeholder, value) {
	cell = row.insertCell(-1);
	inputTag = document.createElement("input");
	inputTag.setAttribute("type", type);	
	inputTag.setAttribute("id", id);	
	inputTag.setAttribute("size", size);	
	inputTag.setAttribute("placeholder", placeholder);
	inputTag.setAttribute("value", value);	
	cell.appendChild(inputTag);
}
function batchForm() {
	formOpen("inputBatchForm");

	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("batchTable", "Id", "Name", "Strength", "Class", "1");
	/* Two ways of adding elements are used: createElement + appendChild  and
	 * insertRow + insertCell
	 */

	/* ---- Adding "Add Batch Row" -----------------------*/
	row = table.insertRow(1);
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);
	insertInputBox(row, "text", "batchNameAdd", "32", "Enter Batch Name", "");
	insertInputBox(row, "number", "batchCountAdd", "3", "Strength", "");
	insertSelectTag(row, "batchClassAdd", classTable, "classId", "classShortName");

	cell = insertAddButton(row, "batchInsert()", 1);

	/* Add the existing batch entries */
	tr = document.getElementById("batchTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;
	for (i in batch) {
		currBatch = batch[i];
		var row = table.insertRow(count);

		insertTextColumn(row, "center_" + count, currBatch["batchId"]);

		insertInputBox(row, "text", "batchName_" + count, "32",
					"Batch Name", currBatch["batchName"]);
		insertInputBox(row, "number", "batchCount_" + count, "3",
					"Strength", currBatch["batchCount"]);

		cell = row.insertCell(-1);
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
}
function batchInsert() {
	var batchName, batchCount;
	batchName = document.getElementById("batchNameAdd").value;
	batchCount = document.getElementById("batchCountAdd").value;
	classId = document.getElementById("batchClassAdd").value;

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
			} else {
				alert("batchInsert " + batchName + " Failed. Error: " + response["Error"]);
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
	batchId = document.getElementById("center_" + row).childNodes[0].nodeValue;
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

	row = i - 2;
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
				alert("Batch " + batchName + ": Update Failed.\nError:\n" + response["Error"]);
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
	var batchName, batchCount;
	var sure = confirm("Warning: Deleting Batch will delete all related " +
						  "subject-teacher mappings, timetable entries, etc.\n" +
						  "This can not be undone. \n" +
						  "Are you sure?");
	if(sure != true)
		return;
	//batchName = document.getElementById("batchName_" + row).value;
	batchId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	document.getElementById("bDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("bDeleteButton_" + row).disabled = true;
	//document.getElementById("bUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("bDeleteButton_" + row).value = "Delete"
				batch.splice(i - 2, 1);
				loadSelectMenus();
				fillTable2(true);
				batchForm();
			} else {
				alert("Batch " + batchName + ": Deletion Failed.\nError:\n" + response["Error"]);
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

function batchCanOverlapForm() {
	formOpen("inputBatchCanOverlapForm");

	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("batchCanOverlapTable", "SN", "Select Batches Which Can Overlap", 1);

	/* Two ways of adding elements are used: createElement + appendChild  and
	 * insertRow + insertCell
	 */

	/* ---- Adding "Add Batch Row" -----------------------*/
	row = table.insertRow(1);
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
		width: 'resolve',
	});
	$("#batchCanOverlapAdd").on("change", filterBatchCanOverlapSelect); 
	
	cell = insertAddButton(row, "batchCanOverlapInsert()", 1);

	/* Add the existing batch entries */
	tr = document.getElementById("batchCanOverlapTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;
	/* This code assumes that we can ALWAYS find mutually exclusive,
	 * sets of overlapping batches from batchCanOverlap table
	 */
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
			//alert("Pushing " + b2 + "at index " + index1);
			overlaps[index1].push(curr["batchOverlapId"]);
		}
		else if	(index2 != -1) {
			//alert("Pushing " + b1 + "at index " + index2);
			overlaps[index2].push(curr["batchId"]);
		}
		else { // both indices -1, so entry didnt exist
			//alert("Pushing " + b1 + " and " + b2 + " at index " + (count + 1));
			overlaps[++count] = [];
			overlaps[count].push(curr["batchId"]);
			overlaps[count].push(curr["batchOverlapId"]);
		}
	}

	var count = 2;
	for(i = 0; i < overlaps.length; i++) {
		curr = overlaps[i];
		currText = "";
		for(j = 0; j < overlaps[i].length; j++) {
			currText += search(batch, "batchId", overlaps[i][j])["batchName"] + ",";
		}
		//alert("currText = " + currText);
		var row = table.insertRow(count);
		//var cell = row.insertCell(0);
		//cell.innerHTML = "<center> " + (count - 1) + "</center>";
		insertTextColumn(row, "center1_" + count, count - 1);//currBatchRoom["brId"]);
		insertTextColumn(row, "center1_" + count, currText);//currBatchRoom["brId"]);
		//cell = row.insertCell(-1);
		//cell.innerHTML = currText;

		insertDeleteButton(row, "batchCanOverlapDeleteButton_" + count,
							"batchCanOverlapDelete(" + count + ")");

	}
}
function batchCanOverlapDelete(i) {
	var row = i - 2;
	var sure = confirm("Warning: Are you sure?");
	if(sure != true)
		return;
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
			} else {
				alert("batchInsert " + batchNames + " Failed. \n" +
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
	var table = insertHeaderRow("batchRoomTable", "ID", "Batch", "Room", 2);

	/* ---- Adding "Add batchRoom Row" -----------------------*/
	row = table.insertRow(1);
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);

	selectTag = insertSelectTag(row, "brBatchAdd", batch, "batchId", "batchName");
	$("#brBatchAdd").select2({
		placeholder: "Insert Batch Name",
		width: 'resolve'
	});

	selectTag = insertSelectTag(row, "brRoomAdd", room, "roomId", "roomShortName");
	$("#brRoomAdd").select2({
		placeholder: "Room Name",
		width: 'resolve'
	});

	cell = insertAddButton(row, "batchRoomInsert()", 2);

	/* Add the existing batchRoom entries */
	tr = document.getElementById("batchRoomTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;
	for (i in batchRoom) {
		currBatchRoom = batchRoom[i];
		var row = table.insertRow(count);

		insertTextColumn(row, "center_" + count, currBatchRoom["brId"]);

		cell = row.insertCell(-1);
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

		cell = row.insertCell(-1);
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
	/* debug */
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
			} else {
				alert("Insert batch: "
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
	brId = document.getElementById("center_" + row).childNodes[0].nodeValue;
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
	var batchId, roomId,  brId;
	var sure = confirm("This will delete all related timetable entries also\n"
					+ "This can not be undone. \nAre you sure?");
	if(sure != true)
		return;
	brId = document.getElementById("center_" + row).childNodes[0].nodeValue;
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
				alert("batchRoom " + brId + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("batchRoomDeleteButton_" + row).value = "Delete"
				document.getElementById("batchRoomUpdateButton_" + row).disabled = false;
				document.getElementById("batchRoomDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchRoomDelete&brId=" + brId + "&snapshotId=" + currentSnapshotId);
}
function classForm() {
	formOpen("inputClassForm");

	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("classTable", "SN", "Name", "Short Name", "Semester", "Strength", 2);

	/* ---- Adding "Add Class Row" -----------------------*/
	row = table.insertRow(1);
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);
	insertInputBox(row, "text", "classNameAdd", "32", "Enter Class Name", "");
	insertInputBox(row, "text", "classShortNameAdd", "8", "Enter Short Name", "");
	insertInputBox(row, "number", "semesterAdd", "3", "Semester", "");
	insertInputBox(row, "number", "classCountAdd", "3", "Strength", "");
	cell = insertAddButton(row, "classInsert()", 2);

	/* Add the existing class entries */
	tr = document.getElementById("classTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in classTable) {
		currClass = classTable[i];
		var row = table.insertRow(count);

		insertTextColumn(row, "center_" + count, currClass["classId"]);

		insertInputBox(row, "text", "className_" + count, "32",
					"Class Name", currClass["className"]);
		insertInputBox(row, "text", "classShortName_" + count, "8",
					"Class Short Name", currClass["classShortName"]);
		insertInputBox(row, "number", "semester_" + count, "3",
					"Semester", currClass["semester"]);
		insertInputBox(row, "number", "classCount_" + count, "3",
					"Strength", currClass["classCount"]);

		insertUpdateButton(row, "cUpdateButton_" + count,
							"classUpdate(" + count + ")");
		insertDeleteButton(row, "cDeleteButton_" + count,
							"classDelete(" + count + ")");

		count++;
	}
}
function classInsert() {
	var row = i;
	var className, classShortName, semester, classCount;
	className = document.getElementById("classNameAdd").value;
	classShortName = document.getElementById("classShortNameAdd").value;
	semester = document.getElementById("semesterAdd").value;
	classCount = document.getElementById("classCountAdd").value;

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
			} else {
				alert("classInsert " + classShortName + " Failed. Error: " + response["Error"]);
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
	classId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	className = document.getElementById("className_" + row).value;
	classShortName = document.getElementById("classShortName_" + row).value;
	semester = document.getElementById("semester_" + row).value;
	classCount = document.getElementById("classCount_" + row).value;
	document.getElementById("cUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("cDeleteButton_" + row).disabled = true;
	document.getElementById("cUpdateButton_" + row).disabled = true;

	row = i - 2;
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
				fillTable2(true);
				classForm();
			}
			else {
				document.getElementById("cUpdateButton_" + i).childNodes[0].nodeValue = "Update";
				alert("Class " + classShortName + ": Update Failed.\nError:\n" + response["Error"]);
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
	var className, classShortName, semester, classCount;
	var sure = confirm("Warning: Deleting Class will delete all related " +
				  "subject-teacher mappings, timetable entries, etc.\n" +
				  "This can not be undone. \n" +
				  "Are you sure?");
	if(sure != true)
		return;
	//classShortName = document.getElementById("classShortName_" + row).value;
	classId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	document.getElementById("cDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("cDeleteButton_" + row).disabled = true;
	document.getElementById("cUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("cDeleteButton_" + row).value = "Delete"
				classTable.splice(i - 2, 1);
				loadSelectMenus();
				fillTable2(true);
				classForm();
			} else {
				alert("Class " + classShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
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
	var table = insertHeaderRow("classRoomTable", "ID", "Class", "Room", 2);

	/* ---- Adding "Add classRoom Row" -----------------------*/
	row = table.insertRow(1);
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);

	selectTag = insertSelectTag(row, "crClassAdd", classTable,"classId", "classShortName");
	$("#crClassAdd").select2({
		placeholder: "Insert Class Name",
		width: 'resolve'
	});

	selectTag = insertSelectTag(row, "crRoomAdd", room, "roomId", "roomShortName");
	$("#crRoomAdd").select2({
		placeholder: "Room Name",
		width: 'resolve'
	});

	cell = insertAddButton(row, "classRoomInsert()", 2);

	/* Add the existing classRoom entries */
	tr = document.getElementById("classRoomTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;
	for (i in classRoom) {
		currClassRoom = classRoom[i];
		var row = table.insertRow(count);

		insertTextColumn(row, "center_" + count, currClassRoom["crId"]);

		cell = row.insertCell(-1);
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

		cell = row.insertCell(-1);
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
	/* debug */
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
			} else {
				alert("Insert class: "
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

function classRoomUpdate(i) {
	var row = i;
	var classId, roomId,  crId;
	classId = document.getElementById("class_" + row).value;
	roomId = document.getElementById("room_" + row).value;
	crId = document.getElementById("center_" + row).childNodes[0].nodeValue;
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
	var classId, roomId,  crId;
	var sure = confirm("This will delete all related timetable entries also\n"
					+ "This can not be undone. \nAre you sure?");
	if(sure != true)
		return;
	crId = document.getElementById("center_" + row).childNodes[0].nodeValue;
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
				alert("classRoom " + crId + ": Deletion Failed.\nError:\n" + response["Error"]);
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
						"Slot Duration(Secs)", "No of Slots Per Day", "Dept", "Owner", 2);
	var count = 1;
	if(config.length < 1) {
		row = table.insertRow(count);
		cell = insertTextColumn(row, "info", "Please create the first configuration before proceeding");
		/*cell = row.insertCell(-1);
		textNode = document.createTextNode("Please create the first configuration before proceeding");
		cell.appendChild(textNode);  */
		cell.setAttribute("colspan", "6");
		count++;
	}
	/* ---- Adding "Add Config Row" -----------------------*/
	row = table.insertRow(count);
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);
	insertInputBox(row, "text", "configNameAdd", "32", "Enter Config Name", "");
	insertInputBox(row, "time", "dayBeginAdd", "8", "Day Begins At", "");
	insertInputBox(row, "number", "slotDurationAdd", "3", "Each Slot Minutes", "");
	insertInputBox(row, "number", "nSlotsAdd", "3", "No of Slots Per Day", "");
	insertSelectTag(row, "deptIdAdd", dept, "deptId", "deptName");
	/* TODO: This will be replaced by the current user Id when we implement users */
	insertSelectTag(row, "inchargeAdd", [[1]], "0", "0");

	cell = insertAddButton(row, "configInsert()", 1);

	/* Add the existing config entries */
	tr = document.getElementById("configTable").rows[0];
	var ncells = tr.cells.length;

	for (i in config) {
		currConfig = config[i];
		JSON.stringify(currConfig);
		var row = table.insertRow(count);

		insertTextColumn(row, "center_" + count, currConfig["configId"]);

		insertInputBox(row, "text", "configName_" + count, "32",
					"Config Name", currConfig["configName"]);
		insertInputBox(row, "time", "dayBegin_" + count, "8",
					"Day Begins At", currConfig["dayBegin"]);
		insertInputBox(row, "number", "slotDuration_" + count, "3",
					"Slot Duration(Secs)", currConfig["slotDuration"]);
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
	configName = document.getElementById("configNameAdd").value;
	dayBegin = document.getElementById("dayBeginAdd").value;
	slotDuration = document.getElementById("slotDurationAdd").value;
	nSlots = document.getElementById("nSlotsAdd").value;
	deptId = document.getElementById("deptIdAdd").value;
	incharge = document.getElementById("inchargeAdd").value;
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
				alert("configInsert " + configName + " Failed. Error: " + response["Error"]);
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

	row = i - 2;
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
				alert("Config " + dayBegin + ": Update Failed.\nError:\n" + response["Error"]);
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
	var configId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	document.getElementById("configDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("configDeleteButton_" + row).disabled = true;
	document.getElementById("configUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("configDeleteButton_" + row).value = "Delete"
				config.splice(i - 2, 1);
				fillTable2(true);
				configForm();
			} else {
				alert("Config " + configId + ": Deletion Failed.\nError:\n" + response["Error"]);
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
function overlappingSBTForm() {
	formOpen("inputoverlappingSBTForm");

	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("overlappingSBTTable", "ID", "Sub-Batch-Teacher1",
						"Sub-Batch-Teacher2", 2);

	/* ---- Adding "Add overlappingSBT Row" -----------------------*/
	row = table.insertRow(1);
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);

	cell = row.insertCell(-1);
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
		width: 'resolve'
	});
	$("#sbtAdd1").on("change", makesbtAdd2);

	cell = row.insertCell(-1);
	cell.setAttribute("align","center");
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","sbtAdd2");
	cell.appendChild(selectTag);
	var tag = createOptionTag("-1", "Select an entry in the first box", false);
	selectTag.appendChild(tag);
	$("#sbtAdd2").select2({
		placeholder: "Matching SBT",
		dropdownAutoWidth : true,
		width: 'resolve'
	});

	cell = insertAddButton(row, "overlappingSBTInsert()", 1);

	/* Add the existing overlappingSBT entries */
	tr = document.getElementById("overlappingSBTTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in overlappingSBT) {
		currOverlappingSBT = overlappingSBT[i];
		var row = table.insertRow(count);

		insertTextColumn(row, "center_" + count, currOverlappingSBT["osbtId"]);

		k = currOverlappingSBT["sbtId1"];
		currSBT = search(subjectBatchTeacher, "sbtId", k);
		cell = row.insertCell(-1);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "sbtId1_" + count);
		var subjectShortName = search(subject, "subjectId", currSBT["subjectId"])["subjectShortName"];
		var batchName = search(batch, "batchId", currSBT["batchId"])["batchName"];
		var teacherShortName = search(teacher, "teacherId", currSBT["teacherId"])["teacherShortName"];
		if(typeof teacherShortName == "undefined")
			teacherShortName = "Not Defined";
		var sbtString = "" + subjectShortName + " : " + batchName + " : " + teacherShortName;
		var centerText = document.createTextNode(sbtString);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);
		//$("#batch_" + i).select2();


		k = currOverlappingSBT["sbtId2"];
		currSBT = search(subjectBatchTeacher, "sbtId", k);
		cell = row.insertCell(-1);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "sbtId2_" + count);
		var subjectShortName = search(subject, "subjectId", currSBT["subjectId"])["subjectShortName"];
		var batchName = search(batch, "batchId", currSBT["batchId"])["batchName"];
		var teacherShortName = search(teacher, "teacherId", currSBT["teacherId"])["teacherShortName"];
		if(typeof teacherShortName == "undefined")
			teacherShortName = "Not Defined";
		var sbtString = "" + subjectShortName + " : " + batchName + " : " + teacherShortName;
		var centerText = document.createTextNode(sbtString);
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
	selectTag.style.width = "100%";
}
function overlappingSBTInsert() {
	var sbtId2, teacherId, osbtId;
	sbtId1 = document.getElementById("sbtAdd1").value;
	sbtId2 = document.getElementById("sbtAdd2").value;
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
			} else {
				alert("Insert " + sbtString + " Failed. \nError From Server: \n" +
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
	var osbtId;
	var sure = confirm("This will delete all related timetable entries also\n"
					+ "This can not be undone. \nAre you sure?");
	if(sure != true)
		return;
	osbtId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	sbtId1 = search(overlappingSBT, "osbtId", osbtId)["sbtId1"];
	sbtId2 = search(overlappingSBT, "osbtId", osbtId)["sbtId2"];
	document.getElementById("overlappingSBTDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("overlappingSBTDeleteButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("overlappingSBTDeleteButton_" + row).value = "Delete"
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
				alert("overlappingSBT " + osbtId + ": Deletion Failed.\nError:\n" + response["Error"]);
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
	var table = insertHeaderRow("roomTable", "ID", "Name", "Short Name", "Strength", 2);

	/* ---- Adding "Add Room Row" -----------------------*/
	row = table.insertRow(1);
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);
	insertInputBox(row, "text", "roomNameAdd", "32", "Enter Room Name", "");
	insertInputBox(row, "text", "roomShortNameAdd", "8", "Enter Short Name", "");
	insertInputBox(row, "number", "roomCountAdd", "3", "Room Size", "");
	cell = insertAddButton(row, "roomInsert()", 2);

	/* Add the existing room entries */
	tr = document.getElementById("roomTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in room) {
		currRoom = room[i];
		var row = table.insertRow(count);

		insertTextColumn(row, "center_" + count, currRoom["roomId"]);

		insertInputBox(row, "text", "roomName_" + count, "32",
					"Room Name", currRoom["roomName"]);
		insertInputBox(row, "text", "roomShortName_" + count, "8",
					"Short Name", currRoom["roomShortName"]);
		insertInputBox(row, "number", "roomCount_" + count, "3",
					"Capacity", currRoom["roomCount"]);

		insertUpdateButton(row, "rUpdateButton_" + count,
							"roomUpdate(" + count + ")");
		insertDeleteButton(row, "rDeleteButton_" + count,
							"roomDelete(" + count + ")");
		count++;
	}
}
function roomInsert() {
	var row = i;
	var roomName, roomShortName, roomCount;
	roomName = document.getElementById("roomNameAdd").value;
	roomShortName = document.getElementById("roomShortNameAdd").value;
	roomCount = document.getElementById("roomCountAdd").value;

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
			} else {
				alert("roomInsert " + roomShortName + " Failed. Error: " + response["Error"]);
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
	roomName = document.getElementById("roomName_" + row).value;
	roomShortName = document.getElementById("roomShortName_" + row).value;
	roomCount = document.getElementById("roomCount_" + row).value;
	roomId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	document.getElementById("rUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("rDeleteButton_" + row).disabled = true;
	document.getElementById("rUpdateButton_" + row).disabled = true;

	row = i - 2;
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
				alert("Room " + roomShortName + ": Update Failed.\nError:\n" + response["Error"]);
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
	var roomName, roomShortName, roomCount;
	var sure = confirm("Warning: Deleting Room will delete all related " +
				  "subject-teacher mappings, timetable entries, etc.\n" +
				  "This can not be undone. \n" +
				  "Are you sure?");
	if(sure != true)
		return;
	//roomShortName = document.getElementById("roomShortName_" + row).value;
	roomId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	document.getElementById("rDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("rDeleteButton_" + row).disabled = true;
	document.getElementById("rUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("rDeleteButton_" + row).value = "Delete"
				room.splice(i - 2, 1);
				loadSelectMenus();
				fillTable2(true);
				roomForm();
			} else {
				alert("Room " + roomShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
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
function sbtForm() {
	if(!sbtPossible()) {
		alert("This form is not available. Enter at least one batchable Subject, " +
			  "One Teacher and One Batch using appropriate Forms");
		return;
	}
	formOpen("inputSBTForm");

	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("sbtTable", "ID", "Batch", "Subject", "Teacher", 2);

	/* ---- Adding "Add sbt Row" -----------------------*/
	row = table.insertRow(1);
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);

	insertSelectTag(row, "batchAdd", batch, "batchId", "batchName");
	$("#batchAdd").select2({
		placeholder: "Insert Batch Name",
		width: 'resolve'
	});

	cell = row.insertCell(-1);
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
		width: 'resolve'
	});

	insertSelectTag(row, "teacherAdd", teacher, "teacherId", "teacherName");
	$("#teacherAdd").select2({
		placeholder: "Teacher Name",
		width: 'resolve'
	});

	cell = insertAddButton(row, "sbtInsert()", 1);

	/* Add the existing sbt entries */
	tr = document.getElementById("sbtTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in subjectBatchTeacher) {
		currSBT = subjectBatchTeacher[i];
		var row = table.insertRow(count);

		insertTextColumn(row, "center_" + count, currSBT["sbtId"]);

		insertTextColumn(row, "sbtBatch_" + count,
				search(batch, "batchId", currSBT["batchId"])["batchName"]);

		insertTextColumn(row, "sbtSubject_" + count,
				search(subject, "subjectId", currSBT["subjectId"])["subjectName"]);

		insertTextColumn(row, "sbtSubject_" + count,
				search(teacher, "teacherId", currSBT["teacherId"])["teacherName"]);

		insertDeleteButton(row, "sbtDeleteButton_" + count,
							"sbtDelete(" + count + ")");
		count++;
	}
}
function sbtInsert() {
	var batchId, subjectId, teacheId, sbtId;
	batchId = document.getElementById("batchAdd").value;
	subjectId = document.getElementById("subjectAdd").value;
	teacherId = document.getElementById("teacherAdd").value;
	if(batchId == -1 || subjectId == -1 || teacherId == -1) {
		alert("Enter all values " + batchId + " " + subjectId + " " + teacherId);
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
			} else {
				alert("Insert teacher:" + teacherShortName + " subject: " + subjectShortName + " batch: "
						+ batchName + " Failed. \nError From Server: \n" + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=sbtInsert&subjectId=" + subjectId + "&teacherId=" +
			teacherId + "&batchId=" + batchId + "&snapshotId=" + currentSnapshotId);

}

function sbtUpdate(i) {
	var row = i;
	var batchId, subjectId, teacheId, sbtId;
	batchId = document.getElementById("sbtBatch_" + row).value;
	subjectId = document.getElementById("sbtSubject_" + row).value;
	teacherId = document.getElementById("sbtTeacher_" + row).value;
	sbtId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	//document.getElementById("sbtUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("sbtDeleteButton_" + row).disabled = true;
	document.getElementById("sbtUpdateButton_" + row).disabled = true;
	/* debug */
	teacherShortName = search(teacher, "teacherId", teacherId)["teacherShortName"];
	subjectShortName = search(subject, "subjectId", subjectId)["subjectShortName"];
	batchName= search(batch, "batchId", batchId)["batchName"];

	row = i - 2;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			//alert("sbt Row " + row + "Updated");
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("sbtUpdateButton_" + i).childNodes[0].nodeValue = "Updated";
				document.getElementById("sbtDeleteButton_" + i).disabled = false;
				document.getElementById("sbtUpdateButton_" + i).disabled = false;
				subjectBatchTeacher[row]["teacherId"] = teacherId;
				subjectBatchTeacher[row]["subjectId"] = subjectId;
				subjectBatchTeacher[row]["batchId"] = batchId;
				fillTable2(true);
				sbtForm();
			}
			else {
				document.getElementById("sbtUpdateButton_" + i).childNodes[0].nodeValue = "Update";
				alert("sbtId = " + sbtId + ": Update Failed for Teacher: " + teacherShortName
								+ " Subject: " + subjectShortName + + " batch: " + batchName
									+ "\nError:\n" + response["Error"]);
				document.getElementById("sbtDeleteButton_" + i).disabled = false;
				document.getElementById("sbtUpdateButton_" + i).disabled = false;
				sbtForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=sbtUpdate&subjectId=" + subjectId + "&teacherId=" +
			teacherId + "&batchId=" + batchId + "&sbtId=" + sbtId + "&snapshotId=" + currentSnapshotId);

}
function sbtDelete(i) {
	var row = i;
	var batchId, subjectId, teacheId, sbtId;
	var sure = confirm("This will delete all related timetable entries also\n"
					+ "This can not be undone. \nAre you sure?");
	if(sure != true)
		return;
	sbtId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	sbtRow =  search(subjectBatchTeacher, "sbtId", sbtId);
	subjectId = sbtRow["subjectId"];
	batchId = sbtRow["batchId"];
	teacherId = sbtRow["teacherId"];
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
				fillTable2(true);
				sbtForm();
			} else {
				alert("sbt " + sbtId + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("sbtDeleteButton_" + row).value = "Delete"
				document.getElementById("sbtDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
				document.getElementById("sbtDeleteButton_" + row).disabled = false;
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
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
		alert("This form is not available. Enter at least Subject not having batches, " +
			  "One Teacher and One Class using appropriate Forms");
		return;
	}
	formOpen("inputSCTForm");
	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("sctTable", "ID", "Class", "Subject", "Teacher", 1);

	/* ---- Adding "Add sct Row" -----------------------*/
	row = table.insertRow(1);
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);

	insertSelectTag(row, "classAdd", classTable, "classId", "className");
	$("#classAdd").select2({
		placeholder: "Insert Class Name",
		width: 'resolve'
	});

	cell = row.insertCell(-1);
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
		width: 'resolve'
	});

	insertSelectTag(row, "teacherAdd", teacher, "teacherId", "teacherName");
	$("#teacherAdd").select2({
		placeholder: "Teacher Name",
		width: 'resolve'
	});

	cell = insertAddButton(row, "sctInsert()", 1);

	/* Add the existing sct entries */
	tr = document.getElementById("sctTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in subjectClassTeacher) {
		currSCT = subjectClassTeacher[i];
		var row = table.insertRow(count);

		insertTextColumn(row, "center_" + count, currSCT["sctId"]);

		insertTextColumn(row, "sctBatch_" + count,
				search(classTable, "classId", currSCT["classId"])["className"]);

		insertTextColumn(row, "sctSubject_" + count,
				search(subject, "subjectId", currSCT["subjectId"])["subjectName"]);

		insertTextColumn(row, "sctSubject_" + count,
				search(teacher, "teacherId", currSCT["teacherId"])["teacherName"]);

		insertDeleteButton(row, "sctDeleteButton_" + count,
							"sctDelete(" + count + ")");
		count++;
	}
}
function sctInsert() {
	var classId, subjectId, teacheId, sctId;
	classId = document.getElementById("classAdd").value;
	subjectId = document.getElementById("subjectAdd").value;
	teacherId = document.getElementById("teacherAdd").value;
	if(classId == -1 || subjectId == -1 || teacherId == -1) {
		alert("Enter All Values");
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
			} else {
				alert("Insert teacher:" + teacherShortName + " subject: " + subjectShortName + " class: "
						+ classShortName + " Failed. \nError From Server: \n" + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=sctInsert&subjectId=" + subjectId + "&teacherId=" +
			teacherId + "&classId=" + classId + "&snapshotId=" + currentSnapshotId);

}

function sctUpdate(i) {
	var row = i;
	var classId, subjectId, teacheId, sctId;
	classId = document.getElementById("sctClass_" + row).value;
	subjectId = document.getElementById("sctSubject_" + row).value;
	teacherId = document.getElementById("sctTeacher_" + row).value;
	sctId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	document.getElementById("sctUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("sctDeleteButton_" + row).disabled = true;
	document.getElementById("sctUpdateButton_" + row).disabled = true;
	/* debug */
	teacherShortName = search(teacher, "teacherId", teacherId)["teacherShortName"];
	subjectShortName = search(subject, "subjectId", subjectId)["subjectShortName"];
	classShortName= search(classTable, "classId", classId)["classShortName"];

	row = i - 2;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			//alert("sct Row " + row + "Updated");
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("sctUpdateButton_" + i).childNodes[0].nodeValue = "Updated";
				document.getElementById("sctDeleteButton_" + i).disabled = false;
				document.getElementById("sctUpdateButton_" + i).disabled = false;
				subjectClassTeacher[row]["teacherId"] = teacherId;
				subjectClassTeacher[row]["subjectId"] = subjectId;
				subjectClassTeacher[row]["classId"] = classId;
				fillTable2(true);
				sctForm();
			}
			else {
				document.getElementById("sctUpdateButton_" + i).childNodes[0].nodeValue = "Update";
				alert("sctId = " + sctId + ": Update Failed for Teacher: " + teacherShortName
								+ " Subject: " + subjectShortName + + " class: " + classShortName
									+ "\nError:\n" + response["Error"]);
				document.getElementById("sctDeleteButton_" + i).disabled = false;
				document.getElementById("sctUpdateButton_" + i).disabled = false;
				sctForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=sctUpdate&subjectId=" + subjectId + "&teacherId=" +
			teacherId + "&classId=" + classId + "&sctId=" + sctId +
			"&snapshotId=" + currentSnapshotId);

}
function sctDelete(i) {
	var row = i;
	var classId, subjectId, teacheId, sctId;
	var sure = confirm("This will delete all related timetable entries also\n"
					+ "This can not be undone. \nAre you sure?");
	if(sure != true)
		return;
	sctId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	sctRow =  search(subjectClassTeacher, "sctId", sctId);
	subjectId = sctRow["subjectId"];
	classId = sctRow["classId"];
	teacherId = sctRow["teacherId"];
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
				alert("sct " + sctId + ": Deletion Failed.\nError:\n" + response["Error"]);
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
	var table = insertHeaderRow("subjectTable", "ID", "Name", "Short Name", "Each Entry #Slots",
				"#Entries", "Batches?", 2);
	/* ---- Adding "Add Subject Row" -----------------------*/
	row = table.insertRow(1);
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);
	insertInputBox(row, "text", "subjectNameAdd", "32", "Enter Subject Name", "");
	insertInputBox(row, "text", "subjectShortNameAdd", "8", "Enter Short Name", "");
	insertInputBox(row, "number", "eachSlotAdd", "3", "Each Entry #Slots", "");
	insertInputBox(row, "number", "nSlotsAdd", "3", "#Entries", "");

	insertSelectTag(row, "batchesAdd", [[0], [1]], "0", "0");

	cell = insertAddButton(row, "subjectInsert()", 2);

	/* Add the existing subject entries */
	tr = document.getElementById("subjectTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in subject) {
		currSubject = subject[i];
		var row = table.insertRow(count);

		insertTextColumn(row, "center_" + count, currSubject["subjectId"]);

		insertInputBox(row, "text", "subjectName_" + count, "32",
					"Subject Name", currSubject["subjectName"]);
		insertInputBox(row, "text", "subjectShortName_" + count, "8",
					"Short Name", currSubject["subjectShortName"]);
		insertInputBox(row, "number", "eachSlot_" + count, "3",
					"Each Entry #Slots", currSubject["eachSlot"]);
		insertInputBox(row, "number", "nSlots_" + count, "3",
					"#Entries", currSubject["nSlots"]);

		cell = row.insertCell(-1);
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
		cell.appendChild(selectTag);

		insertUpdateButton(row, "sUpdateButton_" + count,
							"subjectUpdate(" + count + ")");
		insertDeleteButton(row, "sDeleteButton_" + count,
							"subjectDelete(" + count + ")");
		count++;
	}
}
function subjectInsert() {
	var subjectName, subjectShortName, eachSlot, nSlots, batches;
	subjectName = document.getElementById("subjectNameAdd").value;
	subjectShortName = document.getElementById("subjectShortNameAdd").value;
	eachSlot = document.getElementById("eachSlotAdd").value;
	nSlots = document.getElementById("nSlotsAdd").value;
	batches = document.getElementById("batchesAdd").value;

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
			} else {
				alert("subjectInsert " + subjectShortName + " Failed. Error: " +
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
	subjectId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	subjectName = document.getElementById("subjectName_" + row).value;
	subjectShortName = document.getElementById("subjectShortName_" + row).value;
	eachSlot = document.getElementById("eachSlot_" + row).value;
	nSlots = document.getElementById("nSlots_" + row).value;
	batches = document.getElementById("batches_" + row).value;
	document.getElementById("sUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("sDeleteButton_" + row).disabled = true;
	document.getElementById("sUpdateButton_" + row).disabled = true;

	row = i - 2;
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
				alert("Subject " + subjectShortName + ": Update Failed.\nError:\n" + response["Error"]);
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
	var subjectName, subjectShortName, eachSlot, nSlots, batches;
	var sure = confirm("Warning: Deleting Subject will delete all related " +
						  "subject-teacher mappings, timetable entries, etc.\n" +
						  "This can not be undone. \n" +
						  "Are you sure?");
	if(sure != true)
		return;
	subjectId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	//subjectShortName = document.getElementById("subjectShortName_" + row).value;
	document.getElementById("sDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("sDeleteButton_" + row).disabled = true;
	document.getElementById("sUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("sDeleteButton_" + row).value = "Delete"
				subject.splice(i - 2, 1);
				fillTable2(true);
				subjectForm();
			} else {
				alert("Subject " + subjectShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("sDeleteButton_" + row).value = "Delete"
				document.getElementById("sUpdateButton_" + row).disabled = false;
				document.getElementById("sDeleteButton_" + row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=subjectDelete&subjectId=" + subjectId + "&snapshotId=" + currentSnapshotId);
}
function subjectRoomForm() {
	formOpen("inputSubjectRoomForm");
	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("subjectRoomTable", "ID", "Subject", "Room", 2);

	/* ---- Adding "Add subjectRoom Row" -----------------------*/
	row = table.insertRow(1);
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);

	insertSelectTag(row, "crSubjectAdd", subject,"subjectId", "subjectName");
	$("#crSubjectAdd").select2({
		placeholder: "Insert Subject Name",
		width: 'resolve'
	});

	insertSelectTag(row, "crRoomAdd", room, "roomId", "roomShortName");
	$("#crRoomAdd").select2({
		placeholder: "Room Name",
		width: 'resolve'
	});

	cell = insertAddButton(row, "subjectRoomInsert()", 2);

	/* Add the existing subjectRoom entries */
	tr = document.getElementById("subjectRoomTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;
	for (i in subjectRoom) {
		currSubjectRoom = subjectRoom[i];
		var row = table.insertRow(count);

		insertTextColumn(row, "center_" + count, currSubjectRoom["srId"]);

		cell = row.insertCell(-1);
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

		cell = row.insertCell(-1);
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

		insertUpdateButton(row, "subjectRoomUpdateButton_" + count,
							"subjectRoomUpdate(" + count + ")");
		insertDeleteButton(row, "subjectRoomDeleteButton_" + count,
							"subjectRoomDelete(" + count + ")");
		count++;
	}
}
function subjectRoomInsert() {
	var subjectId, roomId,  srId;
	subjectId = document.getElementById("crSubjectAdd").value;
	roomId = document.getElementById("crRoomAdd").value;
	/* debug */
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
			} else {
				alert("Insert subject: "
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
	srId = document.getElementById("center_" + row).childNodes[0].nodeValue;
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
	var subjectId, roomId,  srId;
	var sure = confirm("This will delete all related timetable entries also\n"
					+ "This can not be undone. \nAre you sure?");
	if(sure != true)
		return;
	srId = document.getElementById("center_" + row).childNodes[0].nodeValue;
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
				alert("subjectRoom " + srId + ": Deletion Failed.\nError:\n" + response["Error"]);
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
function teacherForm() {
	formOpen("inputTeacherForm");
	/* ---- Adding Header Row -----------------------*/
	var table = insertHeaderRow("teacherTable", "ID", "Full Name", "Short Name",
					"Min Hrs", "Max Hrs", "Dept", 2);
	/* ---- Adding "Add Teacher Row" -----------------------*/
	row = table.insertRow(1);
	insertTextColumn(row, "", "New");//currBatchRoom["brId"]);
	insertInputBox(row, "text", "teacherNameAdd", "32", "Enter Teacher Name", "");
	insertInputBox(row, "text", "teacherShortNameAdd", "8", "Enter Short Name", "");
	insertInputBox(row, "number", "minHrsAdd", "3", "Min Hrs of Work", "");
	insertInputBox(row, "number", "maxHrsAdd", "3", "Max Hrs of Work", "");

	cell = row.insertCell(-1);
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

	/* Add the existing teacher entries */
	tr = document.getElementById("teacherTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in teacher) {
		currTeacher = teacher[i];
		var row = table.insertRow(count);

		insertTextColumn(row, "center_" + count, currTeacher["teacherId"]);

		insertInputBox(row, "text", "teacherName_" + count, "32",
					"Teacher Name", currTeacher["teacherName"]);
		insertInputBox(row, "text", "teacherShortName_" + count, "8",
					"Short Name", currTeacher["teacherShortName"]);
		insertInputBox(row, "number", "minHrs_" + count, "32",
					"Min Hrs of Work", currTeacher["minHrs"]);
		insertInputBox(row, "number", "maxHrs_" + count, "32",
					"Max Hrs of Work", currTeacher["maxHrs"]);

		cell = row.insertCell(-1);
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

		insertUpdateButton(row, "tUpdateButton_" + count,
							"teacherUpdate(" + count + ")");
		insertDeleteButton(row, "tDeleteButton_" + count,
							"teacherDelete(" + count + ")");
		count++;
	}
}
function getDeptId(deptShortName) {
	count = 1;
	for (i in dept) {
		if(dept[i]["deptShortName"] == deptShortName)
			return count;
		count++;
	}
	return -1;
}
function teacherInsert() {
	var teacherName, teacherShortName, minHrs, maxHrs, dept;
	teacherName = document.getElementById("teacherNameAdd").value;
	teacherShortName = document.getElementById("teacherShortNameAdd").value;
	minHrs = document.getElementById("minHrsAdd").value;
	maxHrs = document.getElementById("maxHrsAdd").value;
	dept = document.getElementById("deptAdd").value;

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
			} else {
				alert("teacherInsert " + teacherShortName + " Failed. Error: " + response["Error"]);
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
	teacherId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	teacherName = document.getElementById("teacherName_" + row).value;
	teacherShortName = document.getElementById("teacherShortName_" + row).value;
	minHrs = document.getElementById("minHrs_" + row).value;
	maxHrs = document.getElementById("maxHrs_" + row).value;
	dept = document.getElementById("dept_" + row).value;
	document.getElementById("tUpdateButton_" + row).childNodes[0].nodeValue = "Updating";
	document.getElementById("tDeleteButton_" + row).disabled = true;
	document.getElementById("tUpdateButton_" + row).disabled = true;

	row = i - 2;
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
				teacher[row]["dept"] = deptId;
				loadSelectMenus();
				teacherForm();
			}
			else {
				document.getElementById("tUpdateButton_" + i).childNodes[0].nodeValue = "Update";
				alert("Teacher " + teacherShortName + ": Update Failed.\nError:\n" + response["Error"]);
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
	var teacherName, teacherShortName, minHrs, maxHrs, dept;
	var sure = confirm("Warning: Deleting teacher will delete all related " +
				  "subject-teacher mappings, timetable entries, etc.\n" +
				  "This can not be undone. \n" +
				  "Are you sure?");
	if(sure != true)
		return;
	teacherId = document.getElementById("center_" + row).childNodes[0].nodeValue;
	//teacherShortName = document.getElementById("teacherShortName_" + row).value;
	document.getElementById("tDeleteButton_" + row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("tDeleteButton_" + row).disabled = true;
	document.getElementById("tUpdateButton_" + row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("tDeleteButton_" + row).value = "Delete"
				teacher.splice(i - 2, 1);
				loadSelectMenus();
				fillTable2(true);
				teacherForm();
			} else {
				alert("Teacher " + teacherShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
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

function batchFormClose() {
    document.getElementById("inputBatchForm").style.height = "0%";
    document.getElementById("outerTable").style.display = "table";
    document.getElementById("inputBatchForm").style.display= "none";
}
function batchForm() {
    document.getElementById("inputBatchForm").style.height = "auto";
    document.getElementById("inputBatchForm").style.display= "block";
    document.getElementById("outerTable").style.display = "none";
	var table = document.getElementById("batchTable");
	table.innerHTML = ""; /* Required for recursive calls on delete */

	/* Two ways of adding elements are used: createElement+appendChild  and
	 * insertRow+insertCell 
	 */

	/* ---- Adding Header Row -----------------------*/
	var tr = document.createElement("tr"); table.appendChild(tr);

	var th = document.createElement("th"); tr.appendChild(th);
	var tc = document.createTextNode("Id"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Name"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Strength"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Class"); th.appendChild(tc);

	th = document.createElement("th"); th.setAttribute("colspan","2");
	tr.appendChild(th); tc = document.createTextNode("Actions"); th.appendChild(tc);

	/* ---- Adding "Add Batch Row" -----------------------*/
	row = table.insertRow(1);
	cell = row.insertCell(0);
	cell.innerHTML = "<center> New</center>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"batchNameAdd\" size=\"32\" placeholder=\"Name\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"batchCountAdd\" size=\"3\" placeholder=\"Strengh\"> </input>";

	cell = row.insertCell(-1);
	/*var selectTag = document.createElement("select");
	selectTag.setAttribute("id","classAdd");
	var tag = createOptionTag("None", "None", false);		
	selectTag.appendChild(tag);
	for (k in classTable) {
		var tag = createOptionTag(classTable[k]["classShortName"], classTable[k]["classShortName"], false);		
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag); */

	cell = row.insertCell(-1);
	cell.setAttribute("colspan","2");
	var button = document.createElement("button"); cell.appendChild(button);
	button.value = "Add"; button.name = "addbutton";
	var textNode = document.createTextNode("Add");
	button.appendChild(textNode);
	button.setAttribute("onclick","batchInsert()");


	/* Add the existing batch entries */
	tr = document.getElementById("batchTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;
	for (i in batch) {
		currBatch = batch[i];	
		var row = table.insertRow(count);

		var cell = row.insertCell(0);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "center_"+count);
		var centerText = document.createTextNode(currBatch["batchId"]);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);

		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"batchName_"+count+"\" size=\"32\" value=\""+currBatch["batchName"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"batchCount_"+count+"\" size=\"3\" value=\""+currBatch["batchCount"]+"\"> </input>";

		cell = row.insertCell(-1);
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","classShortName_"+count);
		var tag = createOptionTag("None", "None", true);		
		selectTag.appendChild(tag);
		for (k in classTable) {
			currBatchId = search(batch, "batchName", currBatch["batchName"])["batchId"];
			currBatchClassId = search(batchClass, "batchId", currBatchId)["classId"];
			if(classTable[k]["classId"] == currBatchClassId) 
				var tag = createOptionTag(classTable[k]["classShortName"], classTable[k]["classShortName"], true);		
			else
				var tag = createOptionTag(classTable[k]["classShortName"], classTable[k]["classShortName"], false);		
			selectTag.appendChild(tag);
		}
		cell.appendChild(selectTag);

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Update"; button.name = "bUpdateButton_"+count;
		var textNode = document.createTextNode("Update");
		button.appendChild(textNode);
		button.setAttribute("onclick","batchUpdate("+count+")");
		button.setAttribute("id","bUpdateButton_"+count);

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Delete"; button.name = "bDeleteButton_"+count;
		var textNode = document.createTextNode("Delete");
		button.appendChild(textNode);
		button.setAttribute("onclick","batchDelete("+count+")");
		button.setAttribute("id","bDeleteButton_"+count);

		count++;
	}
}
function batchInsert() {
	var batchName, batchCount;
	batchName = document.getElementById("batchNameAdd").value;	
	batchCount = document.getElementById("batchCountAdd").value;	

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
				loadBatchMenu();
				fillTable2(true);
				batchForm();
			} else {
				alert("batchInsert " + batchName + " Failed. Error: " + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchInsert&batchName="+batchName+"&batchCount="+batchCount+"&snapshotId="+currentSnapshotId);
	
}
function batchClassUpdate(i, currBatchId, currBatchClassId) {
	var row = i;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("bUpdateButton_"+i).childNodes[0].nodeValue = "Updated";
				document.getElementById("bDeleteButton_"+i).disabled = false;
				document.getElementById("bUpdateButton_"+i).disabled = false;
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
				alert("Batch " + currBatchId+ ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("bDeleteButton_"+i).disabled = false;
				document.getElementById("bUpdateButton_"+i).disabled = false;
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchClassUpdate&batchId="+currBatchId+"&classId="+currBatchClassId);
	
}
function batchUpdate(i) {
	var row = i;
	var batchName, batchCount;
	batchName = document.getElementById("batchName_"+row).value;	
	batchCount = document.getElementById("batchCount_"+row).value;	
	batchId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	document.getElementById("bUpdateButton_"+row).childNodes[0].nodeValue = "Updating";
	document.getElementById("bDeleteButton_"+row).disabled = true;
	document.getElementById("bUpdateButton_"+row).disabled = true;

	newClassName = document.getElementById("classShortName_"+row).value;
	newClassId = search(classTable, "classShortName", newClassName)["classId"];
	//currBatchId = search(batch, "batchName", batch[row-2]["batchName"])["batchId"];
	currBatchId = batchId;
	currBatchClassId = search(batchClass, "batchId", currBatchId)["classId"];
	currBatchClassShortName = search(classTable, "classId", currBatchClassId)["classShortName"];
	//alert(currBatchId + " " + currBatchClassId + " " + currBatchClassShortName + " " + newClassName);
	if(newClassId != currBatchClassId)
		batchClassUpdate(row, currBatchId, newClassId);

	row = i - 2;
	//var batchOrigName = batch[row]["batchName"];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("bUpdateButton_"+i).childNodes[0].nodeValue = "Updated";
				document.getElementById("bDeleteButton_"+i).disabled = false;
				document.getElementById("bUpdateButton_"+i).disabled = false;
				batch[row]["batchName"] = batchName; /* new name inserted in array */
				batch[row]["batchCount"] = batchCount;
				loadBatchMenu();
				fillTable2(true);
				batchForm();
			}
			else {
				document.getElementById("bUpdateButton_"+i).childNodes[0].nodeValue = "Update";
				alert("Batch " + batchName + ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("bDeleteButton_"+i).disabled = false;
				document.getElementById("bUpdateButton_"+i).disabled = false;
				batchForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchUpdate&batchName="+batchName+"&batchCount="+batchCount+
				"&batchId="+batchId);
	
}
function batchDelete(i) {
	var row = i;
	var batchName, batchCount;
	var sure = confirm("Warning: Deleting Batch will delete all related "+
						  "subject-teacher mappings, timetable entries, etc.\n"+
						  "This can not be undone. \n"+
						  "Are you sure?");
	if(sure != true)
		return;
	//batchName = document.getElementById("batchName_"+row).value;
	batchId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	document.getElementById("bDeleteButton_"+row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("bDeleteButton_"+row).disabled = true;
	document.getElementById("bUpdateButton_"+row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("bDeleteButton_"+row).value = "Delete"
				batch.splice(i - 2, 1);
				loadBatchMenu();
				fillTable2(true);
				batchForm();
			} else {
				alert("Batch " + batchName + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("bDeleteButton_"+row).value = "Delete"
				document.getElementById("bUpdateButton_"+row).disabled = false;
				document.getElementById("bDeleteButton_"+row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchDelete&batchId="+batchId);
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
    document.getElementById("inputBatchCanOverlapForm").style.height = "auto";
    document.getElementById("inputBatchCanOverlapForm").style.display= "block";
    document.getElementById("outerTable").style.display = "none";
	var table = document.getElementById("batchCanOverlapTable");
	table.innerHTML = ""; /* Required for recursive calls on delete */

	/* Two ways of adding elements are used: createElement+appendChild  and
	 * insertRow+insertCell 
	 */

	/* ---- Adding Header Row -----------------------*/
	var tr = document.createElement("tr"); table.appendChild(tr);

	var th = document.createElement("th"); tr.appendChild(th);
	var tc = document.createTextNode("SN"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Select batches which can overlap"); th.appendChild(tc);

	th = document.createElement("th"); th.setAttribute("colspan","2");
	tr.appendChild(th); tc = document.createTextNode("Actions"); th.appendChild(tc);

	/* ---- Adding "Add Batch Row" -----------------------*/
	row = table.insertRow(1);
	cell = row.insertCell(0);
	cell.innerHTML = "<center> New</center>";

	cell = row.insertCell(-1);
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","batchCanOverlapAdd");
	selectTag.setAttribute("multiple","multiple");
	selectTag.setAttribute("width", "100%");
	var tag = createOptionTag("None", "None", false);		
	selectTag.appendChild(tag);
	for (k in batch) {
		var tag = createOptionTag(batch[k]["batchId"], batch[k]["batchName"], false);		
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	cell.setAttribute("width", "100%");
	$("#batchCanOverlapAdd").select2({
		tokenSeparators: [',']});

	cell = row.insertCell(-1);
	cell.setAttribute("colspan","2");
	var button = document.createElement("button"); cell.appendChild(button);
	button.value = "Add"; button.name = "addbutton";
	var textNode = document.createTextNode("Add");
	button.appendChild(textNode);
	button.setAttribute("onclick","batchCanOverlapInsert()");


	/* Add the existing batch entries */
	tr = document.getElementById("batchCanOverlapTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;
	/* This code assumes that we can ALWAYS find mutually exclusive,
	 * sets of overlapping batches from batchCanOverlap table
	 */
	var count = -1; 
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
				alert("index mismatch");
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
		//alert(JSON.stringify(overlaps));
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
		var cell = row.insertCell(0);
		cell.innerHTML = "<center> " + (count - 1) + "</center>";
		cell = row.insertCell(-1);
		cell.innerHTML = currText;

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Delete"; button.name = "bDeleteButton_"+count;
		var textNode = document.createTextNode("Delete");
		button.appendChild(textNode);
		button.setAttribute("onclick","batchCanOverlapDelete("+count+")");
		button.setAttribute("id","batchCanOverlapDeleteButton_"+count);
		count++;
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
				document.getElementById("batchCanOverlapDeleteButton_"+i).value = "Delete"
				overlaps.splice(row, 1);
				/* below, we can also call getOneTable alternatively */
				/*alert("batchCanOverlap: " + JSON.stringify(batchCanOverlap));
				for(k = 0; k < overlaps[row].length; k++) {
					x = overlaps[row][k];
					for(z in batchCanOverlap) {
						if(batchCanOverlap[z]["batchId"] == x || batchCanOverlap[z]["batchOverlapId"] == x) {
							batchCanOverlap.splice(z, 1);
							alert("batchCanOverlap: " + JSON.stringify(batchCanOverlap));
						}
					}
				}*/
				batchCanOverlap = getOneTable("batchCanOverlap", false).batchCanOverlap;
				fillTable2(true);
				batchCanOverlapForm();
			} else {
				alert("BatchCanOverlap " + JSON.stringify(overlaps[row]) + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("batchCanOverlapDeleteButton_"+i).value = "Delete"
				document.getElementById("batchCanOverlapUpdateButton_"+i).disabled = false;
				document.getElementById("batchCanOverlapDeleteButton_"+i).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	//alert("Asking to delete " + JSON.stringify(overlaps[row]));
	xhttp.send("reqType=batchCanOverlapDelete&batches="+JSON.stringify(overlaps[row]));

	
}
function batchCanOverlapFormClose() {
    document.getElementById("inputBatchCanOverlapForm").style.height = "0%";
    document.getElementById("outerTable").style.display = "table";
    document.getElementById("inputBatchCanOverlapForm").style.display= "none";
}
function batchCanOverlapInsert() {
	var batchNames; 
	batchNames = "" + $("#batchCanOverlapAdd").val(); // to convert object to a string
	nEntries = batchNames.split(',');
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
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchCanOverlapInsert&batches="+batchNames);
	
}

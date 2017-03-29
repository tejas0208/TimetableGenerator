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
	var tc = document.createTextNode("SN"); th.appendChild(tc);

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
		cell.innerHTML = "<center> " + (count - 1) + "</center>";
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
		button.value = "Delete"; button.name = "bDeleteeButton_"+count;
		var textNode = document.createTextNode("Delete");
		button.appendChild(textNode);
		button.setAttribute("onclick","batchDelete("+count+")");
		button.setAttribute("id","bDeleteeButton_"+count);

		count++;
	}
}
function batchInsert() {
	var row = i;
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
				newbatch["batchCount"] = batchCount;
				batch.unshift(newbatch);
				batchForm();
			} else {
				alert("batchInsert " + batchName + " Failed. Error: " + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchInsert&batchName="+batchName+"&batchCount="+batchCount);
	
}
function batchClassUpdate(i, currBatchId, currBatchClassId) {
	var row = i;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("bUpdateButton_"+i).childNodes[0].nodeValue = "Updated";
				document.getElementById("bDeleteeButton_"+i).disabled = false;
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
				document.getElementById("bDeleteeButton_"+i).disabled = false;
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
	document.getElementById("bUpdateButton_"+row).childNodes[0].nodeValue = "Updating";
	document.getElementById("bDeleteeButton_"+row).disabled = true;
	document.getElementById("bUpdateButton_"+row).disabled = true;

	newClassName = document.getElementById("classShortName_"+row).value;
	newClassId = search(classTable, "classShortName", newClassName)["classId"];
	currBatchId = search(batch, "batchName", batch[row-2]["batchName"])["batchId"];
	currBatchClassId = search(batchClass, "batchId", currBatchId)["classId"];
	currBatchClassShortName = search(classTable, "classId", currBatchClassId)["classShortName"];
	//alert(currBatchId + " " + currBatchClassId + " " + currBatchClassShortName + " " + newClassName);
	if(newClassId != currBatchClassId)
		batchClassUpdate(row, currBatchId, newClassId);

	row = i - 2;
	var batchOrigName = batch[row]["batchName"];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("bUpdateButton_"+i).childNodes[0].nodeValue = "Updated";
				document.getElementById("bDeleteeButton_"+i).disabled = false;
				document.getElementById("bUpdateButton_"+i).disabled = false;
				batch[row]["batchName"] = batchName; /* new name inserted in array */
				batch[row]["batchCount"] = batchCount;
				batchForm();
			}
			else {
				document.getElementById("bUpdateButton_"+i).childNodes[0].nodeValue = "Update";
				alert("Batch " + batchName + ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("bDeleteeButton_"+i).disabled = false;
				document.getElementById("bUpdateButton_"+i).disabled = false;
				batchForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchUpdate&batchName="+batchName+"&batchCount="+batchCount+
				"&batchOrigName="+batchOrigName);
	
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
	batchName = document.getElementById("batchName_"+row).value;
	document.getElementById("bDeleteeButton_"+row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("bDeleteeButton_"+row).disabled = true;
	document.getElementById("bUpdateButton_"+row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("bDeleteeButton_"+row).value = "Delete"
				batch.splice(i - 2, 1);
				batchForm();
			} else {
				alert("Batch " + batchName + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("bDeleteeButton_"+row).value = "Delete"
				document.getElementById("bUpdateButton_"+row).disabled = false;
				document.getElementById("bDeleteeButton_"+row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchDelete&batchName="+batchName);
}

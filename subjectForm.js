function subjectFormClose() {
    document.getElementById("inputSubjectForm").style.height = "0%";
    document.getElementById("outerTable").style.display = "table";
   document.getElementById("inputSubjectForm").style.display= "none";
}
function subjectForm() {
    document.getElementById("inputSubjectForm").style.height = "auto";
   document.getElementById("inputSubjectForm").style.display= "block";
    document.getElementById("outerTable").style.display = "none";
	var table = document.getElementById("subjectTable");
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
	tc = document.createTextNode("Short Name"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("EachSlot"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("#Slots"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Batches?"); th.appendChild(tc);

	th = document.createElement("th"); th.setAttribute("colspan","2");
	tr.appendChild(th); tc = document.createTextNode("Actions"); th.appendChild(tc);

	/* ---- Adding "Add Subject Row" -----------------------*/
	row = table.insertRow(1);
	cell = row.insertCell(0);
	cell.innerHTML = "<center> New</center>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"subjectNameAdd\" size=\"32\" placeholder=\"Name\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"subjectShortNameAdd\" size=\"8\" placeholder=\"Short Name\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"eachSlotAdd\" size=\"3\" placeholder=\"Each Slot\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"nSlotsAdd\" size=\"3\" placeholder=\"N Slots\"> </input>";

	cell = row.insertCell(-1);
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","batchesAdd");
	batches = [0, 1];
	for (k in batches) {
		var tag = createOptionTag(batches[k], batches[k]);		
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);

	cell = row.insertCell(-1);
	cell.setAttribute("colspan","2");
	var button = document.createElement("button"); cell.appendChild(button);
	button.value = "Add"; button.name = "addbutton";
	var textNode = document.createTextNode("Add");
	button.appendChild(textNode);
	button.setAttribute("onclick","subjectInsert()");


	/* Add the existing subject entries */
	tr = document.getElementById("subjectTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in subject) {
		currSubject = subject[i];	
		var row = table.insertRow(count);

		var cell = row.insertCell(0);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "center_"+count);
		var centerText = document.createTextNode(currSubject["subjectId"]);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);

		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"subjectName_"+count+"\" size=\"32\" value=\""+currSubject["subjectName"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"subjectShortName_"+count+"\" size=\"8\" value=\""+currSubject["subjectShortName"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"eachSlot_"+count+"\" size=\"3\" value=\""+currSubject["eachSlot"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"nSlots_"+count+"\" size=\"3\" value=\""+currSubject["nSlots"]+"\"> </input>";

		cell = row.insertCell(-1);
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

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Update"; button.name = "sUpdateButton_"+count;
		var textNode = document.createTextNode("Update");
		button.appendChild(textNode);
		button.setAttribute("onclick","subjectUpdate("+count+")");
		button.setAttribute("id","sUpdateButton_"+count);

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Delete"; button.name = "sDeleteButton_"+count;
		var textNode = document.createTextNode("Delete");
		button.appendChild(textNode);
		button.setAttribute("onclick","subjectDelete("+count+")");
		button.setAttribute("id","sDeleteButton_"+count);

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
				alert("subjectInsert " + subjectShortName + " Failed. Error: " + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=subjectInsert&subjectName="+subjectName+"&subjectShortName="+
			subjectShortName+"&eachSlot="+eachSlot+"&nSlots="+nSlots+
			"&batches="+batches+"&snapshotId="+currentSnapshotId);
}

function subjectUpdate(i) {
	var row = i;
	var subjectName, subjectShortName, eachSlot, nSlots, batches;
	subjectId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	subjectName = document.getElementById("subjectName_"+row).value;	
	subjectShortName = document.getElementById("subjectShortName_"+row).value;	
	eachSlot = document.getElementById("eachSlot_"+row).value;	
	nSlots = document.getElementById("nSlots_"+row).value;	
	batches = document.getElementById("batches_"+row).value;	
	document.getElementById("sUpdateButton_"+row).childNodes[0].nodeValue = "Updating";
	document.getElementById("sDeleteButton_"+row).disabled = true;
	document.getElementById("sUpdateButton_"+row).disabled = true;

	row = i - 2;
	//var subjectOrigShortName = subject[row]["subjectShortName"];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			//alert("subject Row " + row + "Updated");		
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("sUpdateButton_"+i).childNodes[0].nodeValue = "Updated";
				document.getElementById("sDeleteButton_"+i).disabled = false;
				document.getElementById("sUpdateButton_"+i).disabled = false;
				subject[row]["subjectName"] = subjectName;
				subject[row]["subjectShortName"] = subjectShortName;
				subject[row]["eachSlot"] = eachSlot;
				subject[row]["nSlots"] = nSlots;
				subject[row]["batches"] = batches;
				fillTable2(true);
				subjectForm();
			}
			else {
				document.getElementById("sUpdateButton_"+i).childNodes[0].nodeValue = "Update";
				alert("Subject " + subjectShortName + ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("sDeleteButton_"+i).disabled = false;
				document.getElementById("sUpdateButton_"+i).disabled = false;
				subjectForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=subjectUpdate&subjectName="+subjectName+"&subjectShortName="+
				subjectShortName+"&eachSlot="+eachSlot+"&nSlots="+nSlots+"&batches="+batches+
				"&subjectId="+subjectId);
	
}
function subjectDelete(i) {
	var row = i;
	var subjectName, subjectShortName, eachSlot, nSlots, batches;
	var sure = confirm("Warning: Deleting Subject will delete all related "+
						  "subject-teacher mappings, timetable entries, etc.\n"+
						  "This can not be undone. \n"+
						  "Are you sure?");
	if(sure != true)
		return;
	subjectId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	//subjectShortName = document.getElementById("subjectShortName_"+row).value;
	document.getElementById("sDeleteButton_"+row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("sDeleteButton_"+row).disabled = true;
	document.getElementById("sUpdateButton_"+row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("sDeleteButton_"+row).value = "Delete"
				subject.splice(i - 2, 1);
				fillTable2(true);
				subjectForm();
			} else {
				alert("Subject " + subjectShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("sDeleteButton_"+row).value = "Delete"
				document.getElementById("sUpdateButton_"+row).disabled = false;
				document.getElementById("sDeleteButton_"+row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=subjectDelete&subjectId="+subjectId);
}

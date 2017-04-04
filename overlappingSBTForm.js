function overlappingSBTFormClose() {
    document.getElementById("inputoverlappingSBTForm").style.height = "0%";
    document.getElementById("outerTable").style.display = "table";
    document.getElementById("inputoverlappingSBTForm").style.display= "none";
}
function overlappingSBTForm() {
    document.getElementById("inputoverlappingSBTForm").style.height = "auto";
    document.getElementById("inputoverlappingSBTForm").style.display = "block";
    document.getElementById("outerTable").style.display = "none";
	var table = document.getElementById("overlappingSBTTable");
	table.innerHTML = ""; /* Required for recursive calls on delete */

	/* Two ways of adding elements are used: createElement+appendChild  and
	 * insertRow+insertCell 
	 */

	/* ---- Adding Header Row -----------------------*/
	var tr = document.createElement("tr"); table.appendChild(tr);

	var th = document.createElement("th"); tr.appendChild(th);
	var tc = document.createTextNode("ID"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Sub-Batch-Teacher1"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Sub-Batch-Teacher2"); th.appendChild(tc);

	th = document.createElement("th"); th.setAttribute("colspan","2");
	tr.appendChild(th); tc = document.createTextNode("Actions"); th.appendChild(tc);

	/* ---- Adding "Add overlappingSBT Row" -----------------------*/
	row = table.insertRow(1);
	cell = row.insertCell(0);
	cell.innerHTML = "<center> New</center>";

	/*cell = row.insertCell(-1);
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","batchAdd2");
	cell.appendChild(selectTag);
	$("#clasAdd2").select2({
		data: teacher
	}); */

	cell = row.insertCell(-1);
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","sbtAdd1");
	for (k in subjectBatchTeacher) {
		var currSBT = subjectBatchTeacher[k];
		var subjectShortName = search(subject, "subjectId", currSBT["subjectId"])["subjectShortName"];
		var batchName = search(batch, "batchId", currSBT["batchId"])["batchName"];
		var teacherShortName = search(teacher, "teacherId", currSBT["teacherId"])["teacherShortName"];
		if(typeof teacherShortName == "undefined")
			teacherShortName = "Not Defined";
		var sbtString = "Sub: " + subjectShortName + " Batch: " + batchName + " Teacher: " + teacherShortName;
		var tag = createOptionTag(subjectBatchTeacher[k]["sbtId"], sbtString, false);
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	$("#sbtAdd1").select2({
		placeholder: "SBT Name"
	});

	cell = row.insertCell(-1);
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","sbtAdd2");
	for (k in subjectBatchTeacher) {
		var currSBT = subjectBatchTeacher[k];
		var subjectShortName = search(subject, "subjectId", currSBT["subjectId"])["subjectShortName"];
		var batchName = search(batch, "batchId", currSBT["batchId"])["batchName"];
		var teacherShortName = search(teacher, "teacherId", currSBT["teacherId"])["teacherShortName"];
		if(typeof teacherShortName == "undefined")
			teacherShortName = "Not Defined";
		var sbtString = "Sub: " + subjectShortName + " Batch: " + batchName + " Teacher: " + teacherShortName;
		var tag = createOptionTag(subjectBatchTeacher[k]["sbtId"], sbtString, false);
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	$("#sbtAdd2").select2({
		placeholder: "SBT Name"
	});

	cell = row.insertCell(-1);
	cell.setAttribute("colspan","2");
	var button = document.createElement("button"); cell.appendChild(button);
	button.value = "Add"; button.name = "addbutton";
	var textNode = document.createTextNode("Add");
	button.appendChild(textNode);
	button.setAttribute("onclick","overlappingSBTInsert()");


	/* Add the existing overlappingSBT entries */
	tr = document.getElementById("overlappingSBTTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in overlappingSBT) {
		curroverlappingSBT = overlappingSBT[i];
		var row = table.insertRow(count);
		var cell = row.insertCell(0);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "center_"+count);
		var centerText = document.createTextNode(curroverlappingSBT["osbtId"]);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);
		//cell.innerHTML = "<center> " + (count - 1) + "</center>";

		k = curroverlappingSBT["sbtId1"];
		cell = row.insertCell(-1);
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","batch_"+count);
		var subjectShortName = search(subject, subjectBatchTeacher[k]["subjectId"])["subjectShortName"];
		var batchName = search(batch, subjectBatchTeacher[k]["batchId"])["batchName"];
		var teacherShortName = search(teacher, subjectBatchTeacher[k]["teacherId"])["teacherShortName"];
		if(typeof teacherShortName == "undefined")
			teacherShortName = "Not Defined";
		var sbtString = "Sub: " + subjectShortName + " Batch: " + batchName + " Teacher: " + teacherShortName;
		cell.innerHTML = sbtString;
		//$("#batch_"+i).select2();


		k = curroverlappingSBT["sbtId2"];
		cell = row.insertCell(-1);
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","batch_"+count);
		var subjectShortName = search(subject, subjectBatchTeacher[k]["subjectId"])["subjectShortName"];
		var batchName = search(batch, subjectBatchTeacher[k]["batchId"])["batchName"];
		var teacherShortName = search(teacher, subjectBatchTeacher[k]["teacherId"])["teacherShortName"];
		if(typeof teacherShortName == "undefined")
			teacherShortName = "Not Defined";
		var sbtString = "Sub: " + subjectShortName + " Batch: " + batchName + " Teacher: " + teacherShortName;
		cell.innerHTML = sbtString;
		//$("#batch_"+i).select2();

		/*cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Update"; button.name = "overlappingSBTUpdateButton_"+count;
		var textNode = document.createTextNode("Update");
		button.appendChild(textNode);
		button.setAttribute("onclick","overlappingSBTUpdate("+count+")");
		button.setAttribute("id","overlappingSBTUpdateButton_"+count); */

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Delete"; button.name = "overlappingSBTDeleteButton_"+count;
		var textNode = document.createTextNode("Delete");
		button.appendChild(textNode);
		button.setAttribute("onclick","overlappingSBTDelete("+count+")");
		button.setAttribute("id","overlappingSBTDeleteButton_"+count);

		count++;
	}
}
function overlappingSBTInsert() {
	var sbtId2, teacheId, osbtId;
	sbtId2 = document.getElementById("sbtAdd1").value;	
	sbtId1 = document.getElementById("sbtAdd2").value;	
	/* debug */
	currSBT = subjectBatchTeacher[sbtId1];
	var subjectShortName = search(subject, "subjectId", currSBT["subjectId"])["subjectShortName"];
	var batchName = search(batch, "batchId", currSBT["batchId"])["batchName"];
	var teacherShortName = search(teacher, "teacherId", currSBT["teacherId"])["teacherShortName"];
	if(typeof teacherShortName == "undefined")
		teacherShortName = "Not Defined";
	var sbtString = "Sub: " + subjectShortName + " Batch: " + batchName + " Teacher: " + teacherShortName;
	currSBT = subjectBatchTeacher[sbtId2];
	var subjectShortName = search(subject, "subjectId", currSBT["subjectId"])["subjectShortName"];
	var batchName = search(batch, "batchId", currSBT["batchId"])["batchName"];
	var teacherShortName = search(teacher, "teacherId", currSBT["teacherId"])["teacherShortName"];
	if(typeof teacherShortName == "undefined")
		teacherShortName = "Not Defined";
	var sbtString = sbtString + " AND " + subjectShortName + " " + batchName + " " + teacherShortName;
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
				newoverlappingSBT["osbtId"] = response["osbtId"];
				overlappingSBT.unshift(newoverlappingSBT);
				fillTable2(true);
				overlappingSBTForm();
			} else {
				alert("Insert " + sbtString + " Failed. \nError From Server: \n" + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=overlappingSBTInsert&sbtId2="+sbtId2+"&sbtId1="+ sbtId1);
	
}

function overlappingSBTUpdate(i) {
	var row = i;
	var sbtId2, teacheId, osbtId;
	sbtId2 = document.getElementById("subject_"+row).value;	
	sbtId1 = document.getElementById("teacher_"+row).value;	
	osbtId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	document.getElementById("overlappingSBTUpdateButton_"+row).childNodes[0].nodeValue = "Updating";
	document.getElementById("overlappingSBTDeleteButton_"+row).disabled = true;
	document.getElementById("overlappingSBTUpdateButton_"+row).disabled = true;
	/* debug */
	currSBT = subjectBatchTeacher[sbtId1];
	var subjectShortName = search(subject, "subjectId", currSBT["subjectId"])["subjectShortName"];
	var batchName = search(batch, "batchId", currSBT["batchId"])["batchName"];
	var teacherShortName = search(teacher, "teacherId", currSBT["teacherId"])["teacherShortName"];
	if(typeof teacherShortName == "undefined")
		teacherShortName = "Not Defined";
	var sbtString = "Sub: " + subjectShortName + " Batch: " + batchName + " Teacher: " + teacherShortName;
	currSBT = subjectBatchTeacher[sbtId2];
	var subjectShortName = search(subject, "subjectId", currSBT["subjectId"])["subjectShortName"];
	var batchName = search(batch, "batchId", currSBT["batchId"])["batchName"];
	var teacherShortName = search(teacher, "teacherId", currSBT["teacherId"])["teacherShortName"];
	if(typeof teacherShortName == "undefined")
		teacherShortName = "Not Defined";
	var sbtString = sbtString + " AND " + "Sub: " + subjectShortName + " Batch: " + 
			batchName + " Teacher: " + teacherShortName;

	row = i - 2;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			//alert("overlappingSBT Row " + row + "Updated");		
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("overlappingSBTUpdateButton_"+i).childNodes[0].nodeValue = "Updated";
				document.getElementById("overlappingSBTDeleteButton_"+i).disabled = false;
				document.getElementById("overlappingSBTUpdateButton_"+i).disabled = false;
				overlappingSBT[row]["sbtId1"] = sbtId1;
				overlappingSBT[row]["sbtId2"] = sbtId2;
				fillTable2(true);
				overlappingSBTForm();
			}
			else {
				document.getElementById("overlappingSBTUpdateButton_"+i).childNodes[0].nodeValue = "Update";
				alert("osbtId = " + osbtId + ": Update Failed " + + "\nError:\n" + response["Error"]);
				document.getElementById("overlappingSBTDeleteButton_"+i).disabled = false;
				document.getElementById("overlappingSBTUpdateButton_"+i).disabled = false;
				overlappingSBTForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=overlappingSBTUpdate&sbtId2="+sbtId2+"&sbtId1="+ sbtId1+"&osbtId="+osbtId);
	
}
function overlappingSBTDelete(i) {
	var row = i;
	var osbtId;
	var sure = confirm("This will delete all related timetable entries also\n"
					  +"This can not be undone. \nAre you sure?");
	if(sure != true)
		return;
	osbtId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	document.getElementById("overlappingSBTDeleteButton_"+row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("overlappingSBTDeleteButton_"+row).disabled = true;
	document.getElementById("overlappingSBTUpdateButton_"+row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("overlappingSBTDeleteButton_"+row).value = "Delete"
				overlappingSBT.splice(i - 2, 1);
				fillTable2(true);
				overlappingSBTForm();
			} else {
				alert("overlappingSBT " + osbtId + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("overlappingSBTDeleteButton_"+row).value = "Delete"
				document.getElementById("overlappingSBTUpdateButton_"+row).disabled = false;
				document.getElementById("overlappingSBTDeleteButton_"+row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=overlappingSBTDelete&osbtId="+osbtId);
}

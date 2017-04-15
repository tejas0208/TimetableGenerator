function sctFormClose() {
	document.getElementById("inputSCTForm").style.height = "0%";
	document.getElementById("outerTable").style.display = "table";
	document.getElementById("inputSCTForm").style.display= "none";
}
function sctForm() {
	document.getElementById("inputSCTForm").style.height = "auto";
	document.getElementById("inputSCTForm").style.display = "block";
	document.getElementById("outerTable").style.display = "none";
	var table = document.getElementById("sctTable");
	table.innerHTML = ""; /* Required for recursive calls on delete */

	/* Two ways of adding elements are used: createElement + appendChild and
	 * insertRow + insertCell 
	 */

	/* ---- Adding Header Row -----------------------*/
	var tr = document.createElement("tr"); table.appendChild(tr);

	var th = document.createElement("th"); tr.appendChild(th);
	var tc = document.createTextNode("ID"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Class"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Subject"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Teacher"); th.appendChild(tc);

	th = document.createElement("th"); th.setAttribute("colspan","2");
	tr.appendChild(th); tc = document.createTextNode("Actions"); th.appendChild(tc);

	/* ---- Adding "Add sct Row" -----------------------*/
	row = table.insertRow(1);
	cell = row.insertCell(0);
	cell.innerHTML = "<center> New</center>";

	/*cell = row.insertCell(-1);
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","classAdd2");
	cell.appendChild(selectTag);
	$("#clasAdd2").select2({
		data: teacher
	}); */

	cell = row.insertCell(-1);
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","classAdd");
	var tag = createOptionTag(-1, "", false);		
	selectTag.appendChild(tag);
	for (k in classTable) {
		var tag = createOptionTag(classTable[k]["classId"], classTable[k]["className"], false);
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	$("#classAdd").select2({
		placeholder: "Insert Class Name"
	});

	cell = row.insertCell(-1);
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
		placeholder: "Subject Name"
	});

	cell = row.insertCell(-1);
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","teacherAdd");
	var tag = createOptionTag(-1, "", false);		
	selectTag.appendChild(tag);
	for (k in teacher) {
		var tag = createOptionTag(teacher[k]["teacherId"], teacher[k]["teacherName"], false);		
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	$("#teacherAdd").select2({
		placeholder: "Teacher Name"
	});

	cell = row.insertCell(-1);
	cell.setAttribute("colspan","2");
	var button = document.createElement("button"); cell.appendChild(button);
	button.value = "Add"; button.name = "addbutton";
	var textNode = document.createTextNode("Add");
	button.appendChild(textNode);
	button.setAttribute("onclick","sctInsert()");


	/* Add the existing sct entries */
	tr = document.getElementById("sctTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in subjectClassTeacher) {
		currSCT = subjectClassTeacher[i];
		var row = table.insertRow(count);
		var cell = row.insertCell(0);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "center_" + count);
		centerTag.setAttribute("class", "formText");
		var centerText = document.createTextNode(currSCT["sctId"]);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);
		//cell.innerHTML = "<center> " + (count - 1) + "</center>";

		cell = row.insertCell(-1);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "sctClass_" + count);
		centerTag.setAttribute("class", "formText");
		var text = search(classTable, "classId", currSCT["classId"])["className"];
		var centerText = document.createTextNode(text);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);
			
		cell = row.insertCell(-1);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "sctSubject_" + count);
		centerTag.setAttribute("class", "formText");
		var text = search(subject, "subjectId", currSCT["subjectId"])["subjectName"];
		var centerText = document.createTextNode(text);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);

		cell = row.insertCell(-1);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "sctTeacher_" + count);
		centerTag.setAttribute("class", "formText");
		var text = search(teacher, "teacherId", currSCT["teacherId"])["teacherName"];
		var centerText = document.createTextNode(text);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);
	
		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Delete"; button.name = "sctDeleteButton_" + count;
		var textNode = document.createTextNode("Delete");
		button.appendChild(textNode);
		button.setAttribute("onclick","sctDelete(" + count + ")");
		button.setAttribute("id","sctDeleteButton_" + count);

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
				document.getElementById("sctDeleteButton_"+i).disabled = false;
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

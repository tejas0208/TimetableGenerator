function sbtFormClose() {
    document.getElementById("inputSBTForm").style.height = "0%";
    document.getElementById("outerTable").style.display = "table";
    document.getElementById("inputSBTForm").style.display= "none";
}
function sbtForm() {
    document.getElementById("inputSBTForm").style.height = "auto";
    document.getElementById("inputSBTForm").style.display = "block";
    document.getElementById("outerTable").style.display = "none";
	var table = document.getElementById("sbtTable");
	table.innerHTML = ""; /* Required for recursive calls on delete */

	/* Two ways of adding elements are used: createElement+appendChild  and
	 * insertRow+insertCell 
	 */

	/* ---- Adding Header Row -----------------------*/
	var tr = document.createElement("tr"); table.appendChild(tr);

	var th = document.createElement("th"); tr.appendChild(th);
	var tc = document.createTextNode("ID"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Batch"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Subject"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Teacher"); th.appendChild(tc);

	th = document.createElement("th"); th.setAttribute("colspan","2");
	tr.appendChild(th); tc = document.createTextNode("Actions"); th.appendChild(tc);

	/* ---- Adding "Add sbt Row" -----------------------*/
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
	selectTag.setAttribute("id","batchAdd");
	for (k in batch) {
		var tag = createOptionTag(batch[k]["batchId"], batch[k]["batchName"], false);
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	$("#batchAdd").select2({
		placeholder: "Insert Batch Name"
	});

	cell = row.insertCell(-1);
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","subjectAdd");
	for (k in subject) {
		if(subject[k]["batches"] == 0) /* don't show NON-batchable subjects here */
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
	for (k in teacher) {
		var tag = createOptionTag(teacher[k]["teacherId"], teacher[k]["teacherShortName"], false);		
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
	button.setAttribute("onclick","sbtInsert()");


	/* Add the existing sbt entries */
	tr = document.getElementById("sbtTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in subjectBatchTeacher) {
		currSBT = subjectBatchTeacher[i];
		var row = table.insertRow(count);
		var cell = row.insertCell(0);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "center_"+count);
		var centerText = document.createTextNode(currSBT["sbtId"]);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);
		//cell.innerHTML = "<center> " + (count - 1) + "</center>";

		cell = row.insertCell(-1);
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","batch_"+count);
		for (k in batch) {
			if(batch[k]["batchId"] == currSBT["batchId"])
				var tag = createOptionTag(batch[k]["batchId"], batch[k]["batchName"], true);		
			else
				var tag = createOptionTag(batch[k]["batchId"], batch[k]["batchName"], false);		
			selectTag.appendChild(tag);
		}
		cell.appendChild(selectTag);
		//$("#batch_"+i).select2();

		cell = row.insertCell(-1);
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","subject_"+count);
		for (k in subject) {
			if(subject[k]["batches"] == 0) /* don't show NON-batchable subjects here */
				continue;
			if(subject[k]["subjectId"] == currSBT["subjectId"])
				var tag = createOptionTag(subject[k]["subjectId"], subject[k]["subjectName"], true);		
			else
				var tag = createOptionTag(subject[k]["subjectId"], subject[k]["subjectName"], false);		
			selectTag.appendChild(tag);
		}
		cell.appendChild(selectTag);
		//$("#subject_"+i).select2();


		cell = row.insertCell(-1);
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","teacher_"+ count);
		for (k in teacher) {
			if(teacher[k]["teacherId"] == currSBT["teacherId"])
				var tag = createOptionTag(teacher[k]["teacherId"], teacher[k]["teacherShortName"], true);		
			else
				var tag = createOptionTag(teacher[k]["teacherId"], teacher[k]["teacherShortName"], false);		
			selectTag.appendChild(tag);
		}
		cell.appendChild(selectTag);
		//$("#teacher_"+i).select2();

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Update"; button.name = "sbtUpdateButton_"+count;
		var textNode = document.createTextNode("Update");
		button.appendChild(textNode);
		button.setAttribute("onclick","sbtUpdate("+count+")");
		button.setAttribute("id","sbtUpdateButton_"+count);

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Delete"; button.name = "sbtDeleteButton_"+count;
		var textNode = document.createTextNode("Delete");
		button.appendChild(textNode);
		button.setAttribute("onclick","sbtDelete("+count+")");
		button.setAttribute("id","sbtDeleteButton_"+count);

		count++;
	}
}
function sbtInsert() {
	var batchId, subjectId, teacheId, sbtId;
	batchId = document.getElementById("batchAdd").value;	
	subjectId = document.getElementById("subjectAdd").value;	
	teacherId = document.getElementById("teacherAdd").value;	
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
	xhttp.send("reqType=sbtInsert&subjectId="+subjectId+"&teacherId="+
			teacherId+"&batchId="+batchId);
	
}

function sbtUpdate(i) {
	var row = i;
	var batchId, subjectId, teacheId, sbtId;
	batchId = document.getElementById("batch_"+row).value;	
	subjectId = document.getElementById("subject_"+row).value;	
	teacherId = document.getElementById("teacher_"+row).value;	
	sbtId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	document.getElementById("sbtUpdateButton_"+row).childNodes[0].nodeValue = "Updating";
	document.getElementById("sbtDeleteButton_"+row).disabled = true;
	document.getElementById("sbtUpdateButton_"+row).disabled = true;
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
				document.getElementById("sbtUpdateButton_"+i).childNodes[0].nodeValue = "Updated";
				document.getElementById("sbtDeleteButton_"+i).disabled = false;
				document.getElementById("sbtUpdateButton_"+i).disabled = false;
				subjectBatchTeacher[row]["teacherId"] = teacherId;
				subjectBatchTeacher[row]["subjectId"] = subjectId;
				subjectBatchTeacher[row]["batchId"] = batchId;
				fillTable2(true);
				sbtForm();
			}
			else {
				document.getElementById("sbtUpdateButton_"+i).childNodes[0].nodeValue = "Update";
				alert("sbtId = " + sbtId + ": Update Failed for Teacher: " + teacherShortName 
								 + " Subject: " + subjectShortName + + " batch: " + batchName 
									+ "\nError:\n" + response["Error"]);
				document.getElementById("sbtDeleteButton_"+i).disabled = false;
				document.getElementById("sbtUpdateButton_"+i).disabled = false;
				sbtForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=sbtUpdate&subjectId="+subjectId+"&teacherId="+
			teacherId+"&batchId="+batchId+"&sbtId="+sbtId);
	
}
function sbtDelete(i) {
	var row = i;
	var batchId, subjectId, teacheId, sbtId;
	var sure = confirm("This will delete all related timetable entries also\n"
					  +"This can not be undone. \nAre you sure?");
	if(sure != true)
		return;
	sbtId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	document.getElementById("sbtDeleteButton_"+row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("sbtDeleteButton_"+row).disabled = true;
	document.getElementById("sbtUpdateButton_"+row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("sbtDeleteButton_"+row).value = "Delete"
				subjectBatchTeacher.splice(i - 2, 1);
				fillTable2(true);
				sbtForm();
			} else {
				alert("sbt " + sbtId + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("sbtDeleteButton_"+row).value = "Delete"
				document.getElementById("sbtUpdateButton_"+row).disabled = false;
				document.getElementById("sbtDeleteButton_"+row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=sbtDelete&sbtId="+sbtId);
}

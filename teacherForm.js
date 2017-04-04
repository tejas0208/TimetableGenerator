function teacherFormClose() {
    document.getElementById("inputTeacherForm").style.height = "0%";
    document.getElementById("outerTable").style.display = "table";
    document.getElementById("inputTeacherForm").style.display= "none";
}
function teacherForm() {
    document.getElementById("inputTeacherForm").style.height = "auto";
    document.getElementById("inputTeacherForm").style.display = "block";
    document.getElementById("outerTable").style.display = "none";
	var table = document.getElementById("teacherTable");
	table.innerHTML = ""; /* Required for recursive calls on delete */

	/* Two ways of adding elements are used: createElement+appendChild  and
	 * insertRow+insertCell 
	 */

	/* ---- Adding Header Row -----------------------*/
	var tr = document.createElement("tr"); table.appendChild(tr);

	var th = document.createElement("th"); tr.appendChild(th);
	var tc = document.createTextNode("Id"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Full Name"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Short Name"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Min Hrs"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Max Hrs"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Dept"); th.appendChild(tc);

	th = document.createElement("th"); th.setAttribute("colspan","2");
	tr.appendChild(th); tc = document.createTextNode("Actions"); th.appendChild(tc);

	/* ---- Adding "Add Teacher Row" -----------------------*/
	row = table.insertRow(1);
	cell = row.insertCell(0);
	cell.innerHTML = "<center> New</center>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"teacherNameAdd\" placeholder=\"Full Name\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"teacherShortNameAdd\" size=\"8\" placeholder=\"Short Name\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"minHrsAdd\" size=\"3\" placeholder=\"Min Hrs\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"maxHrsAdd\" size=\"3\" placeholder=\"Max Hrs\"> </input>";

	cell = row.insertCell(-1);
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

	cell = row.insertCell(-1);
	cell.setAttribute("colspan","2");
	var button = document.createElement("button"); cell.appendChild(button);
	button.value = "Add"; button.name = "addbutton";
	var textNode = document.createTextNode("Add");
	button.appendChild(textNode);
	button.setAttribute("onclick","teacherInsert()");


	/* Add the existing teacher entries */
	tr = document.getElementById("teacherTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in teacher) {
		currTeacher = teacher[i];	
		var row = table.insertRow(count);

		var cell = row.insertCell(0);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "center_"+count);
		var centerText = document.createTextNode(currTeacher["teacherId"]);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);
	
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"teacherName_"+count+"\" value=\""+currTeacher["teacherName"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"teacherShortName_"+count+"\" size=\"8\" value=\""+currTeacher["teacherShortName"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"minHrs_"+count+"\" size=\"3\" value=\""+currTeacher["minHrs"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"maxHrs_"+count+"\" size=\"3\" value=\""+currTeacher["maxHrs"]+"\"> </input>";

		cell = row.insertCell(-1);
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

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Update"; button.name = "tUpdateButton_"+count;
		var textNode = document.createTextNode("Update");
		button.appendChild(textNode);
		button.setAttribute("onclick","teacherUpdate("+count+")");
		button.setAttribute("id","tUpdateButton_"+count);

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Delete"; button.name = "tDeleteButton_"+count;
		var textNode = document.createTextNode("Delete");
		button.appendChild(textNode);
		button.setAttribute("onclick","teacherDelete("+count+")");
		button.setAttribute("id","tDeleteButton_"+count);

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
	var row = i;
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
				loadTeacherMenu();
				teacherForm();
			} else {
				alert("teacherInsert " + teacherShortName + " Failed. Error: " + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=teacherInsert&teacherName="+teacherName+"&teacherShortName="+
			teacherShortName+"&minHrs="+minHrs+"&maxHrs="+maxHrs+"&deptId="+deptId+"&snapshotId="+currentSnapshotId);
	
}

function teacherUpdate(i) {
	var row = i;
	var teacherName, teacherShortName, minHrs, maxHrs, dept, teacherId;
	teacherId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	teacherName = document.getElementById("teacherName_"+row).value;	
	teacherShortName = document.getElementById("teacherShortName_"+row).value;	
	minHrs = document.getElementById("minHrs_"+row).value;	
	maxHrs = document.getElementById("maxHrs_"+row).value;	
	dept = document.getElementById("dept_"+row).value;	
	document.getElementById("tUpdateButton_"+row).childNodes[0].nodeValue = "Updating";
	document.getElementById("tDeleteButton_"+row).disabled = true;
	document.getElementById("tUpdateButton_"+row).disabled = true;

	row = i - 2;
	//var teacherOrigShortName = teacher[row]["teacherShortName"];
	var deptId = getDeptId(dept);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			//alert("teacher Row " + row + "Updated");		
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("tUpdateButton_"+i).childNodes[0].nodeValue = "Updated";
				document.getElementById("tDeleteButton_"+i).disabled = false;
				document.getElementById("tUpdateButton_"+i).disabled = false;
				teacher[row]["teacherName"] = teacherName;
				teacher[row]["teacherShortName"] = teacherShortName;
				teacher[row]["minHrs"] = minHrs;
				teacher[row]["maxHrs"] = maxHrs;
				teacher[row]["dept"] = deptId;
				loadTeacherMenu();
				teacherForm();
			}
			else {
				document.getElementById("tUpdateButton_"+i).childNodes[0].nodeValue = "Update";
				alert("Teacher " + teacherShortName + ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("tDeleteButton_"+i).disabled = false;
				document.getElementById("tUpdateButton_"+i).disabled = false;
				teacherForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=teacherUpdate&teacherName="+teacherName+"&teacherShortName="+
			teacherShortName+"&minHrs="+minHrs+"&maxHrs="+maxHrs+"&deptId="+deptId+
			"&teacherId="+teacherId);
	
}
function teacherDelete(i) {
	var row = i;
	var teacherName, teacherShortName, minHrs, maxHrs, dept;
	var sure = confirm("Warning: Deleting teacher will delete all related "+
				  "subject-teacher mappings, timetable entries, etc.\n"+
				  "This can not be undone. \n"+
				  "Are you sure?");
	if(sure != true)
		return;
	teacherId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	//teacherShortName = document.getElementById("teacherShortName_"+row).value;
	document.getElementById("tDeleteButton_"+row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("tDeleteButton_"+row).disabled = true;
	document.getElementById("tUpdateButton_"+row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("tDeleteButton_"+row).value = "Delete"
				teacher.splice(i - 2, 1);
				loadTeacherMenu();
				fillTable2(true);
				teacherForm();
			} else {
				alert("Teacher " + teacherShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("tDeleteButton_"+row).value = "Delete"
				document.getElementById("tUpdateButton_"+row).disabled = false;
				document.getElementById("tDeleteButton_"+row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=teacherDelete&teacherId="+teacherId);
}

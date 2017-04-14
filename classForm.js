function classFormClose() {
    document.getElementById("inputClassForm").style.height = "0%";
    document.getElementById("outerTable").style.display = "table";
    document.getElementById("inputClassForm").style.display= "none";
}
function classForm() {
    document.getElementById("inputClassForm").style.height = "auto";
    document.getElementById("inputClassForm").style.display= "block";
    document.getElementById("outerTable").style.display = "none";
	var table = document.getElementById("classTable");
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
	tc = document.createTextNode("Short Name"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("semester"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Strength"); th.appendChild(tc);

	th = document.createElement("th"); th.setAttribute("colspan","2");
	tr.appendChild(th); tc = document.createTextNode("Actions"); th.appendChild(tc);

	/* ---- Adding "Add Class Row" -----------------------*/
	row = table.insertRow(1);
	cell = row.insertCell(0);
	cell.innerHTML = "<center> New</center>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"classNameAdd\" size=\"32\" placeholder=\"Write Name\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"classShortNameAdd\" size=\"8\" placeholder=\"Short Name\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"semesterAdd\" size=\"3\" placeholder=\"semester\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"classCountAdd\" size=\"3\" placeholder=\"Strength\"> </input>";

	cell = row.insertCell(-1);
	cell.setAttribute("colspan","2");
	var button = document.createElement("button"); cell.appendChild(button);
	button.value = "Add"; button.name = "addbutton";
	var textNode = document.createTextNode("Add");
	button.appendChild(textNode);
	button.setAttribute("onclick","classInsert()");


	/* Add the existing class entries */
	tr = document.getElementById("classTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in classTable) {
		currClass = classTable[i];	
		var row = table.insertRow(count);

		var cell = row.insertCell(0);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "center_"+count);
		var centerText = document.createTextNode(currClass["classId"]);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);

		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"className_"+count+"\" size=\"32\" value=\""+currClass["className"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"classShortName_"+count+"\" size=\"8\" value=\""+currClass["classShortName"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"semester_"+count+"\" size=\"3\" value=\""+currClass["semester"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"classCount_"+count+"\" size=\"3\" value=\""+currClass["classCount"]+"\"> </input>";

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Update"; button.name = "cUpdateButton_"+count;
		var textNode = document.createTextNode("Update");
		button.appendChild(textNode);
		button.setAttribute("onclick","classUpdate("+count+")");
		button.setAttribute("id","cUpdateButton_"+count);

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Delete"; button.name = "cDeleteButton_"+count;
		var textNode = document.createTextNode("Delete");
		button.appendChild(textNode);
		button.setAttribute("onclick","classDelete("+count+")");
		button.setAttribute("id","cDeleteButton_"+count);

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
	xhttp.send("reqType=classInsert&className="+className+"&classShortName="+classShortName+
			"&semester="+semester+"&classCount="+classCount+"&snapshotId="+currentSnapshotId);
	
}

function classUpdate(i) {
	var row = i;
	var className, classShortName, semester, classCount;
	classId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	className = document.getElementById("className_"+row).value;	
	classShortName = document.getElementById("classShortName_"+row).value;	
	semester = document.getElementById("semester_"+row).value;	
	classCount = document.getElementById("classCount_"+row).value;	
	document.getElementById("cUpdateButton_"+row).childNodes[0].nodeValue = "Updating";
	document.getElementById("cDeleteButton_"+row).disabled = true;
	document.getElementById("cUpdateButton_"+row).disabled = true;

	row = i - 2;
	var classOrigShortName = classTable[row]["classShortName"];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
			//alert("class Row " + row + "Updated");		
				document.getElementById("cUpdateButton_"+i).childNodes[0].nodeValue = "Updated";
				document.getElementById("cDeleteButton_"+i).disabled = false;
				document.getElementById("cUpdateButton_"+i).disabled = false;
				classTable[row]["className"] = className;
				classTable[row]["classShortName"] = classShortName;
				classTable[row]["semester"] = semester;
				classTable[row]["classCount"] = classCount;
				loadSelectMenus();
				fillTable2(true);
				classForm();
			}
			else {
				document.getElementById("cUpdateButton_"+i).childNodes[0].nodeValue = "Update";
				alert("Class " + classShortName + ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("cDeleteButton_"+i).disabled = false;
				document.getElementById("cUpdateButton_"+i).disabled = false;
				classForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=classUpdate&className="+className+"&classShortName="+
			classShortName+"&semester="+semester+"&classCount="+classCount+
			"&classId="+classId+"&snapshotId="+currentSnapshotId);
	
}
function classDelete(i) {
	var row = i;
	var className, classShortName, semester, classCount;
	var sure = confirm("Warning: Deleting Class will delete all related "+
				  "subject-teacher mappings, timetable entries, etc.\n"+
				  "This can not be undone. \n"+
				  "Are you sure?");
	if(sure != true)
		return;
	//classShortName = document.getElementById("classShortName_"+row).value;
	classId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	document.getElementById("cDeleteButton_"+row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("cDeleteButton_"+row).disabled = true;
	document.getElementById("cUpdateButton_"+row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("cDeleteButton_"+row).value = "Delete"
				classTable.splice(i - 2, 1);
				loadSelectMenus();
				fillTable2(true);
				classForm();
			} else {
				alert("Class " + classShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("cDeleteButton_"+row).value = "Delete"
				document.getElementById("cUpdateButton_"+row).disabled = false;
				document.getElementById("cDeleteButton_"+row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=classDelete&classId="+classId+"&snapshotId="+currentSnapshotId);
}

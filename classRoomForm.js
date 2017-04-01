function classRoomFormClose() {
    document.getElementById("inputClassRoomForm").style.height = "0%";
    document.getElementById("outerTable").style.display = "table";
    document.getElementById("inputClassRoomForm").style.display= "none";
}
function classRoomForm() {
    document.getElementById("inputClassRoomForm").style.height = "auto";
    document.getElementById("inputClassRoomForm").style.display = "block";
    document.getElementById("outerTable").style.display = "none";
	var table = document.getElementById("classRoomTable");
	table.innerHTML = ""; /* Required for recursive calls on delete */

	/* Two ways of adding elements are used: createElement+appendChild  and
	 * insertRow+insertCell 
	 */

	/* ---- Adding Header Row -----------------------*/
	var tr = document.createElement("tr"); table.appendChild(tr);

	var th = document.createElement("th"); tr.appendChild(th);
	var tc = document.createTextNode("ID"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Class"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Room"); th.appendChild(tc);

	th = document.createElement("th"); th.setAttribute("colspan","2");
	tr.appendChild(th); tc = document.createTextNode("Actions"); th.appendChild(tc);

	/* ---- Adding "Add classRoom Row" -----------------------*/
	row = table.insertRow(1);
	cell = row.insertCell(0);
	cell.innerHTML = "<center> New</center>";

	cell = row.insertCell(-1);
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","crClassAdd");
	for (k in classTable) {
		var tag = createOptionTag(classTable[k]["classId"], classTable[k]["classShortName"], false);
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	$("#crClassAdd").select2({
		placeholder: "Insert Class Name"
	});

	cell = row.insertCell(-1);
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","crRoomAdd");
	for (k in room) {
		var tag = createOptionTag(room[k]["roomId"], room[k]["roomShortName"], false);		
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	$("#crRoomAdd").select2({
		placeholder: "Room Name"
	});
	
	cell = row.insertCell(-1);
	cell.setAttribute("colspan","2");
	var button = document.createElement("button"); cell.appendChild(button);
	button.value = "Add"; button.name = "addbutton";
	var textNode = document.createTextNode("Add");
	button.appendChild(textNode);
	button.setAttribute("onclick","classRoomInsert()");


	/* Add the existing classRoom entries */
	tr = document.getElementById("classRoomTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;
	alert('classRoom = ' + JSON.stringify(classRoom));
	for (i in classRoom) {
		currClassRoom = classRoom[i];
		var row = table.insertRow(count);
		var cell = row.insertCell(0);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "center_"+count);
		var centerText = document.createTextNode(currClassRoom["crId"]);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);
		//cell.innerHTML = "<center> " + (count - 1) + "</center>";

		cell = row.insertCell(-1);
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


		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Update"; button.name = "classRoomUpdateButton_"+count;
		var textNode = document.createTextNode("Update");
		button.appendChild(textNode);
		button.setAttribute("onclick","classRoomUpdate("+count+")");
		button.setAttribute("id","classRoomUpdateButton_"+count);

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Delete"; button.name = "classRoomDeleteButton_"+count;
		var textNode = document.createTextNode("Delete");
		button.appendChild(textNode);
		button.setAttribute("onclick","classRoomDelete("+count+")");
		button.setAttribute("id","classRoomDeleteButton_"+count);

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
function classRoomInsert() {
	var classId, roomId,  crId;
	classId = document.getElementById("crClassAdd").value;	
	roomId = document.getElementById("crRoomAdd").value;
	alert(classId + " " + roomId);
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
				classRoomForm();
			} else {
				alert("Insert class: " 
						+ classShortName + " Failed. \nError From Server: \n" + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=classRoomInsert&roomId="+roomId+"&classId="+classId);
	
}

function classRoomUpdate(i) {
	var row = i;
	var classId, roomId,  crId;
	classId = document.getElementById("class_"+row).value;	
	roomId = document.getElementById("room_"+row).value;	
	crId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	document.getElementById("classRoomUpdateButton_"+row).childNodes[0].nodeValue = "Updating";
	document.getElementById("classRoomDeleteButton_"+row).disabled = true;
	document.getElementById("classRoomUpdateButton_"+row).disabled = true;
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
				document.getElementById("classRoomUpdateButton_"+i).childNodes[0].nodeValue = "Updated";
				document.getElementById("classRoomDeleteButton_"+i).disabled = false;
				document.getElementById("classRoomUpdateButton_"+i).disabled = false;
				classRoom[row]["roomId"] = roomId;
				classRoom[row]["classId"] = classId;
				classRoomForm();
			}
			else {
				document.getElementById("classRoomUpdateButton_"+i).childNodes[0].nodeValue = "Update";
				alert("crId = " + crId + ": Update Failed for Subject: " + 
									roomShortName + + " class: " + classShortName 
									+ "\nError:\n" + response["Error"]);
				document.getElementById("classRoomDeleteButton_"+i).disabled = false;
				document.getElementById("classRoomUpdateButton_"+i).disabled = false;
				classRoomForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=classRoomUpdate&roomId="+roomId+"&classId="+classId+"&crId="+crId);
	
}
function classRoomDelete(i) {
	var row = i;
	var classId, roomId,  crId;
	var sure = confirm("This will delete all related timetable entries also\n"
					  +"This can not be undone. \nAre you sure?");
	if(sure != true)
		return;
	crId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	document.getElementById("classRoomDeleteButton_"+row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("classRoomDeleteButton_"+row).disabled = true;
	document.getElementById("classRoomUpdateButton_"+row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("classRoomDeleteButton_"+row).value = "Delete"
				classRoom.splice(i - 2, 1);
				classRoomForm();
			} else {
				alert("classRoom " + crId + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("classRoomDeleteButton_"+row).value = "Delete"
				document.getElementById("classRoomUpdateButton_"+row).disabled = false;
				document.getElementById("classRoomDeleteButton_"+row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=classRoomDelete&crId="+crId);
}

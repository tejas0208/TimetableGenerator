function subjectRoomFormClose() {
    document.getElementById("inputSubjectRoomForm").style.height = "0%";
    document.getElementById("outerTable").style.display = "table";
    document.getElementById("inputSubjectRoomForm").style.display= "none";
}
function subjectRoomForm() {
    document.getElementById("inputSubjectRoomForm").style.height = "auto";
    document.getElementById("inputSubjectRoomForm").style.display = "block";
    document.getElementById("outerTable").style.display = "none";
	var table = document.getElementById("subjectRoomTable");
	table.innerHTML = ""; /* Required for recursive calls on delete */

	/* Two ways of adding elements are used: createElement+appendChild  and
	 * insertRow+insertCell 
	 */

	/* ---- Adding Header Row -----------------------*/
	var tr = document.createElement("tr"); table.appendChild(tr);

	var th = document.createElement("th"); tr.appendChild(th);
	var tc = document.createTextNode("ID"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Subject"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Room"); th.appendChild(tc);

	th = document.createElement("th"); th.setAttribute("colspan","2");
	tr.appendChild(th); tc = document.createTextNode("Actions"); th.appendChild(tc);

	/* ---- Adding "Add subjectRoom Row" -----------------------*/
	row = table.insertRow(1);
	cell = row.insertCell(0);
	cell.innerHTML = "<center> New</center>";

	cell = row.insertCell(-1);
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","crSubjectAdd");
	for (k in subject) {
		var tag = createOptionTag(subject[k]["subjectId"], subject[k]["subjectName"], false);
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	$("#crSubjectAdd").select2({
		placeholder: "Insert Subject Name"
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
	button.setAttribute("onclick","subjectRoomInsert()");


	/* Add the existing subjectRoom entries */
	tr = document.getElementById("subjectRoomTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;
	alert('subjectRoom = ' + JSON.stringify(subjectRoom));
	for (i in subjectRoom) {
		currSubjectRoom = subjectRoom[i];
		var row = table.insertRow(count);
		var cell = row.insertCell(0);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "center_"+count);
		var centerText = document.createTextNode(currSubjectRoom["srId"]);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);
		//cell.innerHTML = "<center> " + (count - 1) + "</center>";

		cell = row.insertCell(-1);
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


		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Update"; button.name = "subjectRoomUpdateButton_"+count;
		var textNode = document.createTextNode("Update");
		button.appendChild(textNode);
		button.setAttribute("onclick","subjectRoomUpdate("+count+")");
		button.setAttribute("id","subjectRoomUpdateButton_"+count);

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Delete"; button.name = "subjectRoomDeleteButton_"+count;
		var textNode = document.createTextNode("Delete");
		button.appendChild(textNode);
		button.setAttribute("onclick","subjectRoomDelete("+count+")");
		button.setAttribute("id","subjectRoomDeleteButton_"+count);

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
function subjectRoomInsert() {
	var subjectId, roomId,  srId;
	subjectId = document.getElementById("crSubjectAdd").value;	
	roomId = document.getElementById("crRoomAdd").value;
	alert(subjectId + " " + roomId);
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
				subjectRoomForm();
			} else {
				alert("Insert subject: " 
						+ subjectName + " Failed. \nError From Server: \n" + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=subjectRoomInsert&roomId="+roomId+"&subjectId="+subjectId);
	
}

function subjectRoomUpdate(i) {
	var row = i;
	var subjectId, roomId,  srId;
	subjectId = document.getElementById("subject_"+row).value;	
	roomId = document.getElementById("room_"+row).value;	
	srId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	document.getElementById("subjectRoomUpdateButton_"+row).childNodes[0].nodeValue = "Updating";
	document.getElementById("subjectRoomDeleteButton_"+row).disabled = true;
	document.getElementById("subjectRoomUpdateButton_"+row).disabled = true;
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
				document.getElementById("subjectRoomUpdateButton_"+i).childNodes[0].nodeValue = "Updated";
				document.getElementById("subjectRoomDeleteButton_"+i).disabled = false;
				document.getElementById("subjectRoomUpdateButton_"+i).disabled = false;
				subjectRoom[row]["roomId"] = roomId;
				subjectRoom[row]["subjectId"] = subjectId;
				subjectRoomForm();
			}
			else {
				document.getElementById("subjectRoomUpdateButton_"+i).childNodes[0].nodeValue = "Update";
				alert("srId = " + srId + ": Update Failed for Subject: " + 
									roomShortName + + " subject: " + subjectName 
									+ "\nError:\n" + response["Error"]);
				document.getElementById("subjectRoomDeleteButton_"+i).disabled = false;
				document.getElementById("subjectRoomUpdateButton_"+i).disabled = false;
				subjectRoomForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=subjectRoomUpdate&roomId="+roomId+"&subjectId="+subjectId+"&srId="+srId);
	
}
function subjectRoomDelete(i) {
	var row = i;
	var subjectId, roomId,  srId;
	var sure = confirm("This will delete all related timetable entries also\n"
					  +"This can not be undone. \nAre you sure?");
	if(sure != true)
		return;
	srId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	document.getElementById("subjectRoomDeleteButton_"+row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("subjectRoomDeleteButton_"+row).disabled = true;
	document.getElementById("subjectRoomUpdateButton_"+row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("subjectRoomDeleteButton_"+row).value = "Delete"
				subjectRoom.splice(i - 2, 1);
				subjectRoomForm();
			} else {
				alert("subjectRoom " + srId + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("subjectRoomDeleteButton_"+row).value = "Delete"
				document.getElementById("subjectRoomUpdateButton_"+row).disabled = false;
				document.getElementById("subjectRoomDeleteButton_"+row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=subjectRoomDelete&srId="+srId);
}

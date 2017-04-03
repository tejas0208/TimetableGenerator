function roomFormClose() {
    document.getElementById("inputRoomForm").style.height = "0%";
    document.getElementById("outerTable").style.display = "table";
    document.getElementById("inputRoomForm").style.display= "none";
}
function roomForm() {
    document.getElementById("inputRoomForm").style.height = "auto";
    document.getElementById("inputRoomForm").style.display= "block";
    document.getElementById("outerTable").style.display = "none";
	var table = document.getElementById("roomTable");
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
	tc = document.createTextNode("Strength"); th.appendChild(tc);

	th = document.createElement("th"); th.setAttribute("colspan","2");
	tr.appendChild(th); tc = document.createTextNode("Actions"); th.appendChild(tc);

	/* ---- Adding "Add Room Row" -----------------------*/
	row = table.insertRow(1);
	cell = row.insertCell(0);
	cell.innerHTML = "<center> New</center>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"roomNameAdd\" size=\"32\" placeholder=\"Write Name\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"roomShortNameAdd\" size=\"8\" placeholder=\"Short Name\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"roomCountAdd\" size=\"3\" placeholder=\"Strength\"> </input>";

	cell = row.insertCell(-1);
	cell.setAttribute("colspan","2");
	var button = document.createElement("button"); cell.appendChild(button);
	button.value = "Add"; button.name = "addbutton";
	var textNode = document.createTextNode("Add");
	button.appendChild(textNode);
	button.setAttribute("onclick","roomInsert()");


	/* Add the existing room entries */
	tr = document.getElementById("roomTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in room) {
		currRoom = room[i];	
		var row = table.insertRow(count);
		var cell = row.insertCell(0);
		cell.innerHTML = "<center> " + (count - 1) + "</center>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"roomName_"+count+"\" size=\"32\" value=\""+currRoom["roomName"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"roomShortName_"+count+"\" size=\"8\" value=\""+currRoom["roomShortName"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"roomCount_"+count+"\" size=\"3\" value=\""+currRoom["roomCount"]+"\"> </input>";

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Update"; button.name = "rUpdateButton_"+count;
		var textNode = document.createTextNode("Update");
		button.appendChild(textNode);
		button.setAttribute("onclick","roomUpdate("+count+")");
		button.setAttribute("id","rUpdateButton_"+count);

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Delete"; button.name = "rDeleteButton_"+count;
		var textNode = document.createTextNode("Delete");
		button.appendChild(textNode);
		button.setAttribute("onclick","roomDelete("+count+")");
		button.setAttribute("id","rDeleteButton_"+count);

		count++;
	}
}
function roomInsert() {
	var row = i;
	var roomName, roomShortName, roomCount;
	roomName = document.getElementById("roomNameAdd").value;	
	roomShortName = document.getElementById("roomShortNameAdd").value;	
	roomCount = document.getElementById("roomCountAdd").value;	

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//roomChange(false);	/* TODO: Check this call */
				newroom = {};
				newroom["roomName"] = roomName;
				newroom["roomShortName"] = roomShortName;
				newroom["roomCount"] = roomCount;
				newroom["roomId"] = response["roomId"];
				room.unshift(newroom);
				roomForm();
			} else {
				alert("roomInsert " + roomShortName + " Failed. Error: " + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=roomInsert&roomName="+roomName+"&roomShortName="+
			roomShortName+"&roomCount="+roomCount);
	
}

function roomUpdate(i) {
	var row = i;
	var roomName, roomShortName, roomCount;
	roomName = document.getElementById("roomName_"+row).value;	
	roomShortName = document.getElementById("roomShortName_"+row).value;	
	roomCount = document.getElementById("roomCount_"+row).value;	
	document.getElementById("rUpdateButton_"+row).childNodes[0].nodeValue = "Updating";
	document.getElementById("rDeleteButton_"+row).disabled = true;
	document.getElementById("rUpdateButton_"+row).disabled = true;

	row = i - 2;
	var roomOrigShortName = room[row]["roomShortName"];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
			//alert("room Row " + row + "Updated");		
				document.getElementById("rUpdateButton_"+i).childNodes[0].nodeValue = "Updated";
				document.getElementById("rDeleteButton_"+i).disabled = false;
				document.getElementById("rUpdateButton_"+i).disabled = false;
				room[row]["roomName"] = roomName;
				room[row]["roomShortName"] = roomShortName;
				room[row]["roomCount"] = roomCount;
				roomForm();
			}
			else {
				document.getElementById("rUpdateButton_"+i).childNodes[0].nodeValue = "Update";
				alert("Room " + roomShortName + ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("rDeleteButton_"+i).disabled = false;
				document.getElementById("rUpdateButton_"+i).disabled = false;
				roomForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=roomUpdate&roomName="+roomName+"&roomShortName="+
			roomShortName+"&roomCount="+roomCount+
			"&roomOrigShortName="+roomOrigShortName);
	
}
function roomDelete(i) {
	var row = i;
	var roomName, roomShortName, roomCount;
	var sure = confirm("Warning: Deleting Room will delete all related "+
				  "subject-teacher mappings, timetable entries, etc.\n"+
				  "This can not be undone. \n"+
				  "Are you sure?");
	if(sure != true)
		return;
	roomShortName = document.getElementById("roomShortName_"+row).value;
	document.getElementById("rDeleteButton_"+row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("rDeleteButton_"+row).disabled = true;
	document.getElementById("rUpdateButton_"+row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("rDeleteButton_"+row).value = "Delete"
				room.splice(i - 2, 1);
				roomForm();
			} else {
				alert("Room " + roomShortName + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("rDeleteButton_"+row).value = "Delete"
				document.getElementById("rUpdateButton_"+row).disabled = false;
				document.getElementById("rDeleteButton_"+row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=roomDelete&roomShortName="+roomShortName);
}
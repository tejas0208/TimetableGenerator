function batchRoomFormClose() {
    document.getElementById("inputBatchRoomForm").style.height = "0%";
    document.getElementById("outerTable").style.display = "table";
    document.getElementById("inputBatchRoomForm").style.display= "none";
}
function batchRoomForm() {
    document.getElementById("inputBatchRoomForm").style.height = "auto";
    document.getElementById("inputBatchRoomForm").style.display = "block";
    document.getElementById("outerTable").style.display = "none";
	var table = document.getElementById("batchRoomTable");
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
	tc = document.createTextNode("Room"); th.appendChild(tc);

	th = document.createElement("th"); th.setAttribute("colspan","2");
	tr.appendChild(th); tc = document.createTextNode("Actions"); th.appendChild(tc);

	/* ---- Adding "Add batchRoom Row" -----------------------*/
	row = table.insertRow(1);
	cell = row.insertCell(0);
	cell.innerHTML = "<center> New</center>";

	cell = row.insertCell(-1);
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id","crBatchAdd");
	for (k in batch) {
		var tag = createOptionTag(batch[k]["batchId"], batch[k]["batchName"], false);
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	$("#crBatchAdd").select2({
		placeholder: "Insert Batch Name"
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
	button.setAttribute("onclick","batchRoomInsert()");


	/* Add the existing batchRoom entries */
	tr = document.getElementById("batchRoomTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;
	alert('batchRoom = ' + JSON.stringify(batchRoom));
	for (i in batchRoom) {
		currBatchRoom = batchRoom[i];
		var row = table.insertRow(count);
		var cell = row.insertCell(0);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "center_"+count);
		var centerText = document.createTextNode(currBatchRoom["brId"]);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);
		//cell.innerHTML = "<center> " + (count - 1) + "</center>";

		cell = row.insertCell(-1);
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","batch_"+count);
		for (k in batch) {
			if(batch[k]["batchId"] == currBatchRoom["batchId"])
				var tag = createOptionTag(batch[k]["batchId"], batch[k]["batchName"], true);		
			else
				var tag = createOptionTag(batch[k]["batchId"], batch[k]["batchName"], false);		
			selectTag.appendChild(tag);
		}
		cell.appendChild(selectTag);
		//$("#batch_"+i).select2();

		cell = row.insertCell(-1);
		var selectTag = document.createElement("select");
		selectTag.setAttribute("id","room_"+count);
		for (k in room) {
			if(room[k]["batches"] == 1) /* don't show batchable rooms here */
				continue;
			if(room[k]["roomId"] == currBatchRoom["roomId"])
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
		button.value = "Update"; button.name = "batchRoomUpdateButton_"+count;
		var textNode = document.createTextNode("Update");
		button.appendChild(textNode);
		button.setAttribute("onclick","batchRoomUpdate("+count+")");
		button.setAttribute("id","batchRoomUpdateButton_"+count);

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Delete"; button.name = "batchRoomDeleteButton_"+count;
		var textNode = document.createTextNode("Delete");
		button.appendChild(textNode);
		button.setAttribute("onclick","batchRoomDelete("+count+")");
		button.setAttribute("id","batchRoomDeleteButton_"+count);

		count++;
	}
}
function batchRoomInsert() {
	var batchId, roomId,  brId;
	batchId = document.getElementById("crBatchAdd").value;	
	roomId = document.getElementById("crRoomAdd").value;
	alert(batchId + " " + roomId);
	/* debug */
	roomShortName = search(room, "roomId", roomId)["roomShortName"];
	batchName= search(batch, "batchId", batchId)["batchName"];

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//batchRoomChange(false);	/* TODO: Check this call */
				newBatchRoom = {};
				newBatchRoom["roomId"] = roomId;
				newBatchRoom["batchId"] = batchId;
				newBatchRoom["brId"] = response["brId"];
				batchRoom.unshift(newBatchRoom);
				fillTable2(true);
				batchRoomForm();
			} else {
				alert("Insert batch: " 
						+ batchName + " Failed. \nError From Server: \n" + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchRoomInsert&roomId="+roomId+"&batchId="+batchId);
	
}

function batchRoomUpdate(i) {
	var row = i;
	var batchId, roomId,  brId;
	batchId = document.getElementById("batch_"+row).value;	
	roomId = document.getElementById("room_"+row).value;	
	brId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	document.getElementById("batchRoomUpdateButton_"+row).childNodes[0].nodeValue = "Updating";
	document.getElementById("batchRoomDeleteButton_"+row).disabled = true;
	document.getElementById("batchRoomUpdateButton_"+row).disabled = true;
	/* debug */
	roomShortName = search(room, "roomId", roomId)["roomShortName"];
	batchName= search(batch, "batchId", batchId)["batchName"];

	row = i - 2;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			//alert("batchRoom Row " + row + "Updated");		
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("batchRoomUpdateButton_"+i).childNodes[0].nodeValue = "Updated";
				document.getElementById("batchRoomDeleteButton_"+i).disabled = false;
				document.getElementById("batchRoomUpdateButton_"+i).disabled = false;
				batchRoom[row]["roomId"] = roomId;
				batchRoom[row]["batchId"] = batchId;
				fillTable2(true);
				batchRoomForm();
			}
			else {
				document.getElementById("batchRoomUpdateButton_"+i).childNodes[0].nodeValue = "Update";
				alert("brId = " + brId + ": Update Failed for Subject: " + 
									roomShortName + + " batch: " + batchName 
									+ "\nError:\n" + response["Error"]);
				document.getElementById("batchRoomDeleteButton_"+i).disabled = false;
				document.getElementById("batchRoomUpdateButton_"+i).disabled = false;
				batchRoomForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchRoomUpdate&roomId="+roomId+"&batchId="+batchId+"&brId="+brId);
	
}
function batchRoomDelete(i) {
	var row = i;
	var batchId, roomId,  brId;
	var sure = confirm("This will delete all related timetable entries also\n"
					  +"This can not be undone. \nAre you sure?");
	if(sure != true)
		return;
	brId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	document.getElementById("batchRoomDeleteButton_"+row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("batchRoomDeleteButton_"+row).disabled = true;
	document.getElementById("batchRoomUpdateButton_"+row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("batchRoomDeleteButton_"+row).value = "Delete"
				batchRoom.splice(i - 2, 1);
				fillTable2(true);
				batchRoomForm();
			} else {
				alert("batchRoom " + brId + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("batchRoomDeleteButton_"+row).value = "Delete"
				document.getElementById("batchRoomUpdateButton_"+row).disabled = false;
				document.getElementById("batchRoomDeleteButton_"+row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=batchRoomDelete&brId="+brId);
}

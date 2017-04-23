function configFormClose() {
    document.getElementById("inputConfigForm").style.height = "0%";
    document.getElementById("outerTable").style.display = "table";
	document.getElementById("inputConfigForm").style.display= "none";
}
function configForm() {
	document.getElementById("inputConfigForm").style.height = "auto";
	document.getElementById("inputConfigForm").style.display= "block";
    document.getElementById("outerTable").style.display = "none";
	var table = document.getElementById("configTable");
	table.innerHTML = ""; /* Required for recursive calls on delete */

	/* Two ways of adding elements are used: createElement+appendChild  and
	 * insertRow+insertCell 
	 */

	/* ---- Adding Header Row -----------------------*/
	var tr = document.createElement("tr"); table.appendChild(tr);

	var th = document.createElement("th"); tr.appendChild(th);
	var tc = document.createTextNode("configId"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Config Name"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Day Begins"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Slot Duration"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("No of Slots"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("dept"); th.appendChild(tc);

	th = document.createElement("th"); tr.appendChild(th);
	tc = document.createTextNode("Owner"); th.appendChild(tc);

	th = document.createElement("th"); th.setAttribute("colspan","2");
	tr.appendChild(th); tc = document.createTextNode("Actions"); th.appendChild(tc);

	/* ---- Adding "Add Config Row" -----------------------*/
	row = table.insertRow(1);
	cell = row.insertCell(0);
	cell.innerHTML = "<center> New</center>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"configNameAdd\" size=\"32\" placeholder=\"Name\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"dayBeginAdd\" size=\"8\" placeholder=\"day Begin\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"slotDurationAdd\" size=\"3\" placeholder=\"Each Slot\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"nSlotsAdd\" size=\"3\" placeholder=\"N Slots\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"deptIdAdd\" size=\"3\" placeholder=\"Department\"> </input>";
	cell = row.insertCell(-1);
	cell.innerHTML = "<input type=\"text\" id=\"inchargeAdd\" size=\"3\" placeholder=\"Incharge\"> </input>";

	cell = row.insertCell(-1);
	cell.setAttribute("colspan","2");
	var button = document.createElement("button"); cell.appendChild(button);
	button.value = "Add"; button.name = "addbutton";
	var textNode = document.createTextNode("Add");
	button.appendChild(textNode);
	button.setAttribute("onclick","configInsert()");


	/* Add the existing config entries */
	tr = document.getElementById("configTable").rows[0];
	var ncells = tr.cells.length;
	var count = 2;

	for (i in config) {
		currConfig = config[i];	
		JSON.stringify(currConfig);
		var row = table.insertRow(count);
		var cell = row.insertCell(0);
		var centerTag = document.createElement("center");
		centerTag.setAttribute("id", "center_"+count);
		var centerText = document.createTextNode(currConfig["configId"]);
		centerTag.appendChild(centerText);
		cell.appendChild(centerTag);

		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"configName_"+count+"\" size=\"32\" value=\""+currConfig["configName"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"dayBegin_"+count+"\" size=\"8\" value=\""+currConfig["dayBegin"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"slotDuration_"+count+"\" size=\"3\" value=\""+currConfig["slotDuration"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"nSlots_"+count+"\" size=\"3\" value=\""+currConfig["nSlots"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"deptId_"+count+"\" size=\"3\" value=\""+currConfig["deptId"]+"\"> </input>";
		cell = row.insertCell(-1);
		cell.innerHTML = "<input type=\"text\" id=\"incharge_"+count+"\" size=\"3\" value=\""+currConfig["incharge"]+"\"> </input>";

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Update"; button.name = "configUpdateButton_"+count;
		var textNode = document.createTextNode("Update");
		button.appendChild(textNode);
		button.setAttribute("onclick","configUpdate("+count+")");
		button.setAttribute("id","configUpdateButton_"+count);

		cell = row.insertCell(-1);
		var button = document.createElement("button");
		cell.appendChild(button);
		button.value = "Delete"; button.name = "configDeleteButton_"+count;
		var textNode = document.createTextNode("Delete");
		button.appendChild(textNode);
		button.setAttribute("onclick","configDelete("+count+")");
		button.setAttribute("id","configDeleteButton_"+count);

		count++;
	}
}
function configInsert() {
	var configName, dayBegin, slotDuration, nSlots, deptId, incharge;
	configName = document.getElementById("configNameAdd").value;	
	dayBegin = document.getElementById("dayBeginAdd").value;	
	slotDuration = document.getElementById("slotDurationAdd").value;	
	nSlots = document.getElementById("nSlotsAdd").value;	
	deptId = document.getElementById("deptIdAdd").value;	
	incharge = document.getElementById("inchargeAdd").value;	

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				//configChange(false);	/* TODO: Check this call */
				newconfig = {};
				newconfig["configName"] = configName;
				newconfig["dayBegin"] = dayBegin;
				newconfig["slotDuration"] = slotDuration;
				newconfig["nSlots"] = nSlots;
				newconfig["deptId"] = deptId;
				newconfig["incharge"] = incharge;
				newconfig["configId"] = response["configId"];
				config.unshift(newconfig);
				fillTable2(true);
				configForm();
			} else {
				alert("configInsert " + configName + " Failed. Error: " + response["Error"]);
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=configInsert&configName="+configName+"&dayBegin="+
			dayBegin+"&slotDuration="+slotDuration+"&nSlots="+nSlots+"&deptId="+deptId+"&incharge="+incharge);
	
}

function configUpdate(i) {
	var row = i;
	var configName, dayBegin, slotDuration, nSlots, deptId;
	configName = document.getElementById("configName_"+row).value;	
	dayBegin = document.getElementById("dayBegin_"+row).value;	
	slotDuration = document.getElementById("slotDuration_"+row).value;	
	nSlots = document.getElementById("nSlots_"+row).value;	
	deptId = document.getElementById("deptId_"+row).value;	
	incharge = document.getElementById("inchargeAdd").value;	
	document.getElementById("configUpdateButton_"+row).childNodes[0].nodeValue = "Updating";
	document.getElementById("configDeleteButton_"+row).disabled = true;
	document.getElementById("configUpdateButton_"+row).disabled = true;

	row = i - 2;
	var configOrigName = config[row]["configName"];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			//alert("config Row " + row + "Updated");		
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("configUpdateButton_"+i).childNodes[0].nodeValue = "Updated";
				document.getElementById("configDeleteButton_"+i).disabled = false;
				document.getElementById("configUpdateButton_"+i).disabled = false;
				config[row]["configName"] = configName;
				config[row]["dayBegin"] = dayBegin;
				config[row]["slotDuration"] = slotDuration;
				config[row]["nSlots"] = nSlots;
				config[row]["deptId"] = deptId;
				config[row]["incharge"] = incharge;
				fillTable2(true);
				configForm();
			}
			else {
				document.getElementById("configUpdateButton_"+i).childNodes[0].nodeValue = "Update";
				alert("Config " + dayBegin + ": Update Failed.\nError:\n" + response["Error"]);
				document.getElementById("configDeleteButton_"+i).disabled = false;
				document.getElementById("configUpdateButton_"+i).disabled = false;
				configForm();
			}
		}
	}
	xhttp.open("POST", "timetable.php", false); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=configUpdate&configName="+configName+"&dayBegin="+
				dayBegin+"&slotDuration="+slotDuration+"&nSlots="+nSlots+"&deptId="+deptId+
				"&configOrigName="+configOrigName+"&incharge="+incharge);
	
}
function configDelete(i) {
	var row = i;
	var configName, dayBegin, slotDuration, nSlots, deptId;
	var sure = confirm("Warning: Deleting Config will delete all related "+
						  "config-teacher mappings, timetable entries, etc.\n"+
						  "This can not be undone. \n"+
						  "Are you sure?");
	if(sure != true)
		return;
	var configId = document.getElementById("center_"+row).childNodes[0].nodeValue;
	document.getElementById("configDeleteButton_"+row).childNodes[0].nodeValue = "Deleting";
	document.getElementById("configDeleteButton_"+row).disabled = true;
	document.getElementById("configUpdateButton_"+row).disabled = true;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if(this.readyState == 4 && this.status == 200) {
			response = JSON.parse(this.responseText);
			if(response["Success"] == "True") {
				document.getElementById("configDeleteButton_"+row).value = "Delete"
				config.splice(i - 2, 1);
				fillTable2(true);
				configForm();
			} else {
				alert("Config " + configId + ": Deletion Failed.\nError:\n" + response["Error"]);
				document.getElementById("configDeleteButton_"+row).value = "Delete"
				document.getElementById("configUpdateButton_"+row).disabled = false;
				document.getElementById("configDeleteButton_"+row).childNodes[0].nodeValue = "Can't Delete";
			}
		}
	}
	xhttp.open("POST", "timetable.php", true); // asynchronous
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send("reqType=configDelete&configId="+configId);
}

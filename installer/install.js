function checkRequirements(){
		var xhttp=new XMLHttpRequest();
	xhttp.open("POST","toggle.php",false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("checkRequirements=true");
	var response=xhttp.responseText;
	if(response==true){
		button=document.getElementById("setDatabase");
		button.setAttribute("class","list-group-item enabled");
		button=document.getElementById("checkRequirements");
		button.setAttribute("class","list-group-item disabled");
		setUpDatabase();
	}else{
		document.getElementById("check").innerHTML="Please install the following libraries & Restart the server."+"<br><hr>"+response+"<br><br>";
		para=document.getElementById("check");
		var button = document.createElement("button");
		para.appendChild(button);
		button.value = "Next";
		var textNode = document.createTextNode("Next");
		button.appendChild(textNode);
		button.setAttribute("class","btn btn-primary");
		button.setAttribute("onclick","checkRequirements()");
	}
}
checkRequirements();
function setUpDatabase(){
	var xhttp=new XMLHttpRequest();
	xhttp.open("POST","toggle.php",false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("setUpDatabase=true");
	var response=xhttp.responseText;
	if(response==true){
		button=document.getElementById("setDatabase");
		button.setAttribute("class","list-group-item disabled");
		button=document.getElementById("departmentConfig");
		button.setAttribute("class","list-group-item enabled");
		departmentConfig();
	}else{
		document.getElementById("check").innerHTML=response;
	}
}
function createConfig(){
	var address=document.getElementById("address").value;
	var name=document.getElementById("name").value;
	var username=document.getElementById("username").value;
	var password=document.getElementById("password").value;
	var type=document.getElementById("type").value;
	var dbport=document.getElementById("port").value;
	if(dbport<1){
		return;
	}
	if(address=="" || name=="" || username=="" || password=="" || type=="" || dbport==""){
		return;
	}
	var xhttp=new XMLHttpRequest();
	xhttp.open("POST","toggle.php",false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("createConfig=true"+"&dbhost="+address+"&dbname="+name+"&dbuser="+username+"&dbpass="+password+"&dbtype="+type+"&dbport="+dbport);
	var response=xhttp.responseText;
	document.getElementById("check").innerHTML="Create config.php file in Taasika code folder, and paste this text in it"+"<br><hr>"+response+"<br><br>";
	para=document.getElementById("check");
	var button = document.createElement("button");
	para.appendChild(button);
	button.value = "Next";
	var textNode = document.createTextNode("Next");
	button.appendChild(textNode);
	button.setAttribute("class","btn btn-primary");
	button.setAttribute("onclick","checkConfigFile()");
}
function checkConfigFile(){
	var xhttp=new XMLHttpRequest();
	xhttp.open("POST","toggle.php",false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("checkConfig=true");
	var response=xhttp.responseText;
	if(response==true){
		button=document.getElementById("setDatabase");
		button.setAttribute("class","list-group-item disabled");
		button=document.getElementById("departmentConfig");
		button.setAttribute("class","list-group-item enabled");
		departmentConfig();
	}else{
		alert("Error:Create config file to proceed");
	}
}
function departmentConfig(){
	var xhttp=new XMLHttpRequest();
	xhttp.open("POST","toggle.php",false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("departmentConfig=true");
	var response=xhttp.responseText;
	if(response==false){
		button=document.getElementById("departmentConfig");
		button.setAttribute("class","list-group-item disabled");
		button=document.getElementById("userConfig");
		button.setAttribute("class","list-group-item enabled");
		userConfig();
	}else{
		document.getElementById("check").innerHTML=response;
	}
}

function checkDepartment(){
	var deptName=document.getElementById("deptName").value;
	var deptShortName=document.getElementById("deptShortName").value;
	if(deptName=="" || deptShortName==""){
		return;
	}
	var xhttp=new XMLHttpRequest();
	xhttp.open("POST","toggle.php",false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("createDept=true"+"&deptName="+deptName+"&deptShortName="+deptShortName);
	var response=xhttp.responseText;
	if(response==true){
		button=document.getElementById("departmentConfig");
		button.setAttribute("class","list-group-item disabled");
		button=document.getElementById("userConfig");
		button.setAttribute("class","list-group-item enabled");
		userConfig();
	}
}
function userConfig(){
	var xhttp=new XMLHttpRequest();
	xhttp.open("POST","toggle.php",false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("userConfig=true");
	var response=xhttp.responseText;
	if(response==true){
		button=document.getElementById("userConfig");
		button.setAttribute("class","list-group-item disabled");
		button=document.getElementById("defaultConfig");
		button.setAttribute("class","list-group-item enabled");
		defaultConfig();
	}
	else{
		document.getElementById("check").innerHTML=response;
	}
}
function createUser(){
	var name=document.getElementById("name").value;
	var password=document.getElementById("password").value;
	if(name=="" || password==""){
		return;
	}
	var xhttp=new XMLHttpRequest();
	xhttp.open("POST","toggle.php",false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("createUser=true"+"&userName="+name+"&password="+password);
	var response=xhttp.responseText;
	if(response==true){
		button=document.getElementById("userConfig");
		button.setAttribute("class","list-group-item disabled");
		button=document.getElementById("defaultConfig");
		button.setAttribute("class","list-group-item enabled");
		defaultConfig();
	}
}
function defaultConfig(){
	var xhttp=new XMLHttpRequest();
	xhttp.open("POST","toggle.php",false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("defaultConfig=true");
	var response=xhttp.responseText;
	if(response==true){
		button=document.getElementById("defaultConfig");
		button.setAttribute("class","list-group-item disabled");
		location.replace("../timetable.php");
	}else{
		document.getElementById("check").innerHTML=response;
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "toggle.php", false);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("getTable=true&tableName=dept");
		var response=xhttp.responseText;
		database = JSON.parse(xhttp.responseText);
		dept = database.dept;
		insertSelectTag("deptId","deptIdAdd", dept, "deptId", "deptName");
		var xhttp = new XMLHttpRequest();
		xhttp.open("POST", "toggle.php", false);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("getTable=true&tableName=user");
		var response=xhttp.responseText;
		database = JSON.parse(xhttp.responseText);
		user = database.user;
		insertSelectTag("inchargeId","inchargeAdd", user,"userId", "userName");
	}
}
function configInsert(){
	var configName, dayBegin, slotDuration, nSlots, deptId, incharge;
	configName = document.getElementById("configNameAdd").value;
	dayBegin = document.getElementById("dayBeginAdd").value;
	slotDuration = document.getElementById("slotDurationAdd").value;
	nSlots = document.getElementById("nSlotsAdd").value;
	deptId = document.getElementById("deptIdAdd").value;
	incharge = document.getElementById("inchargeAdd").value;
	var xhttp=new XMLHttpRequest();
	xhttp.open("POST","toggle.php",false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("configInsert=true"+"&configName="+configName+"&dayBegin="+dayBegin+"&slotDuration="+slotDuration+"&nSlots="+nSlots+"&deptId="+deptId+"&incharge="+incharge);
	var response=xhttp.responseText;
	if(response==true){
		button=document.getElementById("defaultConfig");
		button.setAttribute("class","list-group-item disabled");
		location.replace("../timetable.php");
	}else{
		console.log(response);
	}
}

function createOptionTag(value, textString, selected) {
	var option = document.createElement("option");
	option.setAttribute("value", value);
	if(selected)
		option.selected = true;
	var text = document.createTextNode(textString);
	option.appendChild(text);
	return option;
}
function insertSelectTag(td,id, table, valueId, displayId) {
	var cell=document.getElementById(td);
	var selectTag = document.createElement("select");
	selectTag.setAttribute("id", id);
	var tag = createOptionTag(-1, "", false);
	selectTag.appendChild(tag);
	for (k in table) {
		var tag = createOptionTag(table[k][valueId], table[k][displayId], false);
		selectTag.appendChild(tag);
	}
	cell.appendChild(selectTag);
	return selectTag;
}

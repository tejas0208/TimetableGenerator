function subjectCheck(i, j, k) {
	var subjectVal = (search(subject, "subjectId", clipboard["subjectId"]))["subjectShortName"];
	var configrow = search(config, "configId", currentConfigId);
	var nSlotsPerDay = configrow["nSlots"];
	var currSubject = search(subject, "subjectId", clipboard["subjectId"]);
	
	if (clipboard["batchId"] === null || clipboard["batchId"] === "null") {
		if (allEntriesAlreadyDoneForSubject(currSubject, "classId", clipboard["classId"], search(classTable, "classId", clipboard["classId"])["classShortName"], 1))
			return (subjectVal + " Done");

		if (subjectCantFitInRemainingSlots(currSubject, j, nSlotsPerDay, search(classTable, "classId", clipboard["classId"])["classShortName"])) 
			return (subjectVal + " Len=" + currSubject["eachSlot"]);
		
		if (teacherBusyInThisSlot(i, j, currSubject, clipboard["teacherId"], 1)) 
			return (subjectVal + " Teacher Busy");
		
		if (roomBusyOnRoomPageInThisSlot(i, j, currSubject)) 
			return (subjectVal + " Room Busy");
		
		if (classBusyInThisSlot(i, j, currSubject, clipboard["classId"], 1)) 
			return (subjectVal + " Class Busy");

		var sctEntry = search(subjectClassTeacher, "subjectId", clipboard["subjectId"], "classId", clipboard["classId"], "teacherId", clipboard["teacherId"]);

		if (roomSmallOnRoomPageForThisClassOrBatch(sctEntry, "classId", search(classTable, "classId", clipboard["classId"])["classCount"])) 
			return (subjectVal + " Too Big");
	}
	else if (clipboard["batchId"] !== null && clipboard["batchId"] !== "null") {
		if (allEntriesAlreadyDoneForSubject(currSubject, "batchId", clipboard["batchId"], search(batch, "batchId", clipboard["batchId"])["batchName"], 1)) 
			return (subjectVal + " Done");

		if (subjectCantFitInRemainingSlots(currSubject, j, nSlotsPerDay, search(batch, "batchId", clipboard["batchId"])["batchName"])) 
			return (subjectVal + " Len=" + currSubject["eachSlot"]);
		
		if (teacherBusyInThisSlot(i, j, currSubject, clipboard["teacherId"], 1)) 
			return (subjectVal + " Teacher Busy");
		
		if (roomBusyOnRoomPageInThisSlot(i, j, currSubject)) 
			return (subjectVal + " Room Busy");
		
		if (BatchBusyInThisSlot(i, j, currSubject, clipboard["classId"], clipboard["batchId"], 1)) 
			return (subjectVal + " Batch Busy");

		var sbtEntry = search(subjectBatchTeacher, "subjectId", clipboard["subjectId"], "batchId", clipboard["batchId"], "teacherId", clipboard["teacherId"]);

		if (overlappingBatchBusyInThisSlot(i, j, sbtEntry, clipboard["batchId"], 1)) 
			return (subjectVal + " Overlapping Batch Busy");
		
		if (roomSmallOnRoomPageForThisClassOrBatch(sbtEntry, "batchId", search(batch, "batchId", clipboard["batchId"])["batchCount"])) 
			return (subjectVal + " Too Big");
	}
	return subjectValid(i, j, k);
}

function subjectValid(iid, jid, kid) {
	var subjectRow = search(subject, "subjectId", clipboard["subjectId"]);
	var batches = subjectRow["batches"];
	switch (type) {
		case "class":
			if (batches === "0") {
				var capacity = parseInt(supportObject["classCount"]);
				return roomCheck(parseInt(iid), parseInt(jid), parseInt(kid), capacity, subjectRow);
			} else {
				var allowBatches = batchCheck(parseInt(iid), parseInt(jid), parseInt(kid), subjectRow);
				if (allowBatches !== "true")
					return allowBatches;
				else {
					var batchRow = search(batch, "batchId", clipboard["batchId"]);
					var capacity = parseInt(batchRow["batchCount"]);
					return roomCheck(parseInt(iid), parseInt(jid), parseInt(kid), capacity, subjectRow);
				}
			}
			break;
		case "teacher":
			if (batches === "0") {
				return classCheck(parseInt(iid), parseInt(jid), parseInt(kid), subjectRow);
			} else {
				var allowBatches = batchCheck(parseInt(iid), parseInt(jid), parseInt(kid), subjectRow);
				if (allowBatches !== "true")
					return allowBatches;
				else {
					var batchRow = search(batch, "batchId", clipboard["batchId"]);
					var capacity = parseInt(batchRow["batchCount"]);
					return roomCheck(parseInt(iid), parseInt(jid), parseInt(kid), capacity, subjectRow);
				}
			}
			break;
		case "batch":
			var classRow = search(classTable, "classId", clipboard["classId"]);
			var capacity = parseInt(classRow["classCount"]);
			return roomCheck(parseInt(iid), parseInt(jid), parseInt(kid), capacity, subjectRow);
			break;
		case "room":
			if (subjectRow["batches"] == "0") {
				return classCheck(parseInt(iid), parseInt(jid), parseInt(kid), subjectRow);
			} else {
				return batchCheck(parseInt(iid), parseInt(jid), parseInt(kid), subjectRow);
			}
			break;
		default:
			alert("ERROR: subjectSelected: should not have come here.");
			break;
	}
}

function roomCheck(i, j, k, capacity, subjectRow) {
	var eachSlot = parseInt(subjectRow["eachSlot"]);
	var roomVal = (search(room, "roomId", clipboard["roomId"]))["roomShortName"];
	for (var z = 0; z < eachSlot; z++) {
		var found = search(timeTable, "day", i, "slotNo", "" + (parseInt(j) + z),
			"roomId", clipboard["roomId"], "snapshotId", clipboard["snapshotId"]);
		if (found !== -1) {
			return (roomVal + " Busy");
		}
		if ((search(room, "roomId", clipboard["roomId"])["roomCount"] + roomSizeDelta) < capacity) {
			return (roomVal + " Small");
		}
	}
	return "true";
}

function batchCheck(i, j, k, subjectRow, batchVal) {
	console.log("getEligibleBatches: i = " + i + " j = " + j + " k = " + k +
		"subject = " + subjectRow["subjectShortName"]);
	var currBatch = search(batch, "batchId", clipboard["batchId"]);
	var batchVal = search(batch, "batchId", clipboard["batchId"])["batchName"];

	if (allEntriesAlreadyDoneForSubject(subjectRow, "batchId", clipboard["batchId"], batchVal, 0)) {
		return (batchVal + " Done");
	}
	if (teacherBusyInThisSlot(i, j, subjectRow, clipboard["teacherId"], 0)) {
		return (batchVal + " Teacher Busy");
	}
	if (BatchBusyInThisSlot(i, j, subjectRow, clipboard["classId"], clipboard["batchId"], 0)) {
		return (batchVal + " Batch Busy");
	}

	var sbtEntry = search(subjectBatchTeacher, "subjectId", clipboard["subjectId"], "batchId", clipboard["batchId"], "teacherId", clipboard["teacherId"]);

	if (overlappingBatchBusyInThisSlot(i, j, sbtEntry, clipboard["batchId"], 0)) {
		return (batchVal + " Overlapping Batch Busy");
	}
	return "true";
}

function classCheck(i, j, k, subjectRow, classVal) {
	var classVal = search(classTable, "classId", clipboard["classId"])["classShortName"];
	if (allEntriesAlreadyDoneForSubject(subjectRow, "classId", clipboard["classId"], classVal, 0)) {
		return (classVal + " Full");
	}
	if (classBusyInThisSlot(i, j, subjectRow, clipboard["classId"], 0)) {
		return (classVal + " Busy");
	}
	return "true";
}
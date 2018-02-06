var cutSrcEl = null;
var paste_flag = false;
var cut_or_copy = false; //false -> cut, true -> copy
var clipboard = null; //deep copy of copied element.
$(function () {
	$.contextMenu({
		selector: '.cell',
		className: 'data-title',
		autoHide: true,
		animation: {
			duration: 150,
			show: 'slideDown',
			hide: 'slideUp'
		},
		items: {
			"cut": {
				name: "Cut",
				icon: "cut",
				disabled: function (itemKey, opt, rootMenu, originalEvent) {
					if ((document.getElementById(opt.$trigger.attr("id"))) === cutSrcEl)
						return true;

					[i, j, k] = makeIJKFromId(opt.$trigger.attr("id"));

					if (helperTable[i - 1][j][k] !== null && helperTable[i - 1][j][k] !== 0 && parseInt(helperTable[i - 1][j][k]["isFixed"]) === 0)
						return false;
					else
						return true;
				},
				callback: function (itemKey, opt, rootMenu, originalEvent) {
					if (paste_flag == true) {
						contextMenuReset();
					}
					cutStartHandler(document.getElementById(opt.$trigger.attr("id")));
					paste_flag = true;
					cut_or_copy = false; //cut
				}
			},
			copy: {
				name: "Copy",
				icon: "copy",
				disabled: function (itemKey, opt, rootMenu, originalEvent) {
					if ((document.getElementById(opt.$trigger.attr("id"))) === cutSrcEl)
						return true;

				  	[i, j, k] = makeIJKFromId(opt.$trigger.attr("id"));
					if (helperTable[i - 1][j][k] !== null && helperTable[i - 1][j][k] !== 0 && parseInt(helperTable[i - 1][j][k]["isFixed"]) === 0)
						return false;
					else
						return true;
				},
				callback: function (itemKey, opt, rootMenu, originalEvent) {
					if (paste_flag == true) {
						contextMenuReset();
					}
					cutStartHandler(document.getElementById(opt.$trigger.attr("id")));
					paste_flag = true;
					cut_or_copy = true; //copy
				}
			},
			"paste": {
				name: "Paste",
				icon: "paste",
				disabled: function (itemKey, opt, rootMenu, originalEvent) {
					if ((document.getElementById(opt.$trigger.attr("id"))) === cutSrcEl)
						return true;
					if (paste_flag == true) {
						var temp;
						if (cut_or_copy == false) //cut
							temp = cut_pasteCheck(document.getElementById(opt.$trigger.attr("id")));
						else if (cut_or_copy == true) //copy
							temp = copy_pasteCheck(document.getElementById(opt.$trigger.attr("id")));
						console.log(temp);
						if (temp === "true") {
							$('.data-title').attr('data-menutitle', "Paste Valid");
							return false;
						} else {
							$('.data-title').attr('data-menutitle', "Paste Invalid: " + temp);
							return true;
						}
					} else
						return true;
				},
				callback: function (itemKey, opt, rootMenu, originalEvent) {
					if (cut_or_copy == false) {
						cut_pasteHandler(document.getElementById(opt.$trigger.attr("id")));
						cutEndHandler(document.getElementById(opt.$trigger.attr("id")));
					} else if (cut_or_copy == true) {
						copy_pasteHandler(document.getElementById(opt.$trigger.attr("id")));
						cutEndHandler(document.getElementById(opt.$trigger.attr("id")));
					}
				}
			},
			"sep1": "---------",
			"delete": {
				name: "Delete",
				icon: "delete",
				disabled: function (itemKey, opt, rootMenu, originalEvent) {
					if ((document.getElementById(opt.$trigger.attr("id"))) === cutSrcEl)
						return true;
					else {
					   [i, j, k] = makeIJKFromId(opt.$trigger.attr("id"));
						if (helperTable[i - 1][j][k] !== null && helperTable[i - 1][j][k] !== 0)
							return false;
						else
							return true;
					}
				},
				callback: function (itemKey, opt, rootMenu, originalEvent) {
					deleteEntry(document.getElementById(opt.$trigger.attr("id")));
					$('.data-title').attr('data-menutitle', "Menu");
				}
			},
			"sep2": "---------",
			"cancel": {
				name: "Cancel",
				icon: "context-menu-icon context-menu-icon-quit",
				disabled: function () {
					if (paste_flag === true)
						return false;
					else
						return true;
				},
				callback: function () {
					contextMenuReset();
				}
			}
		}
	});

	$('.cell').on('click', function (e) {
		console.log('clicked', this);
	})
	$('.data-title').attr('data-menutitle', "Menu");
});

function cutStartHandler(element) {
	element.style.opacity = '0.4';
	cutSrcEl = element;
	[i, j, k] = makeIJKFromId(element.id);
	console.log("cutStartHandler: i = " + i + " j = " + j + " k = " + k);
	clipboard = jQuery.extend(true, {}, helperTable[i - 1][j][k]);
	document.querySelector('#' + makeIdFromIJK(i, j, k) + '.delete').style.pointerEvents = 'none';
}

function temporaryDeleteFromTimetable(i, j, k, helperTableObject) {
	if (helperTableObject !== null && helperTableObject !== 0) {
		var batchId, classId, teacherId, roomId, isFixed;
		var index_arr = [];
		var clone_arr = [];
		roomId = helperTableObject["roomId"];
		teacherId = helperTableObject["teacherId"];
		classId = helperTableObject["classId"];
		batchId = helperTableObject["batchId"];
		isFixed = helperTableObject["isFixed"];
		subjectId = helperTableObject["subjectId"];
		var subjRow = search(subject, "subjectId", subjectId);
		var count = 0;
		for (var m = 0; m < subjRow["eachSlot"]; m++) {
			var index = searchIndex(timeTable, "day", i, "slotNo", "" + (parseInt(j) + m),
				"subjectId", subjectId, "batchId", batchId,
				"classId", classId, "snapshotId", currentSnapshotId);
			if (index != -1) {
				index_arr[count] = index;
				clone_arr[count++] = timeTable.splice(index, 1);
			} else {
				console.log("ERROR: Deleting TT Entry for Paste Checking: Couldn't find index");
			}
		}
		if (batchId !== null && batchId !== "null") {
			var sbt = search(subjectBatchTeacher, "subjectId", subjectId,
				"batchId", batchId, "teacherId", teacherId);
			var osbt;
			if (sbt !== -1) {
				var osbt = searchMultipleRows(overlappingSBT, "sbtId1", sbt["sbtId"]);
				if (osbt !== -1) {
					for (var i in osbt) {
						var batchId = search(subjectBatchTeacher, "sbtId", osbt[i]["sbtId2"])["batchId"];
						var classId = search(batchClass, "batchId", batchId)["classId"];
						for (var j = 0; j < subjRow["eachSlot"]; j++) {
							var index = searchIndex(timeTable, "day", day, "slotNo", (parseInt(SlotNo) + j),
								"subjectId", subjRow["subjectId"], "batchId", batchId,
								"classId", classId, "snapshotId", currentSnapshotId);
							if (index != -1) {
								clone_arr[count] = timeTable.splice(index, 1);
								index_arr[count++] = index;
							}
						}
					}
				}
			}
		}
		return {
			index: index_arr,
			clone: clone_arr
		};
	}
	return null;
}

function temporaryDelete_ReinsertIntoTimetable(indexCloneObj) {
	for (var n = 0; n < indexCloneObj.index.length; n++)
			timeTable.splice(indexCloneObj.index[n], 0, indexCloneObj.clone[n][0]);
	return;
}

function copy_pasteCheck(element) {
	[i, j, k] = makeIJKFromId(element.id);
	var contentAtIJK = helperTable[i - 1][j][k];

	if (contentAtIJK === null)
		return subjectCheck(parseInt(i), parseInt(j), parseInt(k));

	if (contentAtIJK === 0) {
		if (type == "class") {
			for (var z = helperTable[0][0].length - 1; z >= 0; z--) {
				if (helperTable[i - 1][j][z] === null)
					return subjectCheck(parseInt(i), parseInt(j), parseInt(z));
				if (helperTable[i - 1][j][z] !== null && helperTable[i - 1][j][z] !== 0) {
					k = z;
					contentAtIJK = helperTable[i - 1][j][k];
					break;
				}
			}
		}
	}

	if (contentAtIJK !== null && contentAtIJK !== 0) {
		var indexCloneObj = temporaryDeleteFromTimetable(parseInt(i), parseInt(j), parseInt(k), contentAtIJK);
		var result = subjectCheck(parseInt(i), parseInt(j), parseInt(k));
		temporaryDelete_ReinsertIntoTimetable(indexCloneObj);
		return result;
	}
}

function copy_pasteHandler(element) {
	var roomRow = search(room, "roomId", clipboard["roomId"]);
	var subjectRow = search(subject, "subjectId", clipboard["subjectId"]);
	var teacherId = clipboard["teacherId"];
	var classId = clipboard["classId"];
	var batchId = clipboard["batchId"];

	[i, j, k] = makeIJKFromId(element.getAttribute("id"));
	if (helperTable[i - 1][j][k] !== null && helperTable[i - 1][j][k] !== 0)
		deleteEntry(element);

	[i, j, k] = makeIJKFromId(element.getAttribute("id"));
	makeTimeTableEntry(i, j, roomRow["roomId"], classId, subjectRow["subjectId"],
		teacherId, batchId, currentSnapshotId, 0, parseInt(subjectRow["eachSlot"]));

	var crEntry = new createClassRoomEntry(classId, roomRow["roomId"]);
	if (batchId !== null)
		var brEntry = new createBatchRoomEntry(batchId, roomRow["roomId"]);
	var srEntry = new createSubjectRoomEntry(subjectRow["subjectId"], roomRow["roomId"]);

	if (search(classRoom, "classId", classId) === -1)
		classRoom.push(crEntry);
	if (batchId !== null && search(batchRoom, "batchId", batchId) === -1)
		batchRoom.push(brEntry);
	if (search(subjectRoom, "subjectId", subjectRow["subjectId"]) === -1)
		subjectRoom.push(srEntry);

	fillTable2(true);
}

function cut_pasteCheck(element) {
	console.log("pasteCheck: Entered ");

	if (cutSrcEl === null) {
		return copy_pasteCheck(element);
	} else if (cutSrcEl !== null) {
		[isrc, jsrc, ksrc] = makeIJKFromId(cutSrcEl.id);
		isrc = parseInt(isrc);
		jsrc = parseInt(jsrc);
		ksrc = parseInt(ksrc);
		var indexCloneObjSrc = temporaryDeleteFromTimetable(isrc, jsrc, ksrc, helperTable[isrc - 1][jsrc][ksrc]);
		var result = copy_pasteCheck(element);
		temporaryDelete_ReinsertIntoTimetable(indexCloneObjSrc);
		return result;
	}
}

function cut_pasteHandler(element) {
	console.log("cut_pasteHandler: Entered ");
	if(cutSrcEl !== null)
		deleteEntry(cutSrcEl);
	copy_pasteHandler(element);
}

function cutEndHandler() {
	if (cutSrcEl !== null) {
		cutSrcEl.style.opacity = 1;
		[i, j, k] = makeIJKFromId(cutSrcEl.id);
		if (document.querySelector('#' + makeIdFromIJK(i, j, k) + '.delete') !== null)
			document.querySelector('#' + makeIdFromIJK(i, j, k) + '.delete').style.pointerEvents = 'auto';
	}
	cutSrcEl = null;
	$('.data-title').attr('data-menutitle', "Menu");
}

function contextMenuReset() {
	if (cutSrcEl !== null)
		cutEndHandler();
	cutSrcEl = null;
	paste_flag = false;
	clipboard = null;
}

function pasteShortcut() {
	if(selectedCell === null)
			return;
	
	if(selectedCell === cutSrcEl) {
		selectedCell.style.borderColor = "red";
		setTimeout(function(){
			selectedCell.style.borderColor = "green";
		},300);
		return;
	}
	
	if(paste_flag === true) {
		var temp;
		if (cut_or_copy == false) { //cut
			temp = cut_pasteCheck(selectedCell);
			if(temp === "true") {
				cut_pasteHandler(selectedCell);
				cutEndHandler(selectedCell);
				return;
			}
		}
		else if (cut_or_copy == true) { //copy
			temp = copy_pasteCheck(selectedCell);
			if(temp === "true") {
				copy_pasteHandler(selectedCell);
				cutEndHandler(selectedCell);
				return;
			}
		}		
	}	
	selectedCell.style.borderColor = "red";
	setTimeout(function(){
		selectedCell.style.borderColor = "green";
	},300);
	return;
}

function copyShortcut() {
	if(selectedCell === null)
			return;
		
	if(selectedCell === cutSrcEl) {
		selectedCell.style.borderColor = "red";
		setTimeout(function(){
			selectedCell.style.borderColor = "green";
		},300);
		return;
	}
					
	[i, j, k] = makeIJKFromId(selectedCell.id);
	if (helperTable[i - 1][j][k] !== null && helperTable[i - 1][j][k] !== 0 && parseInt(helperTable[i - 1][j][k]["isFixed"]) === 0) {
		if (paste_flag == true) {
			contextMenuReset();
		}
		cutStartHandler(selectedCell);
		paste_flag = true;
		cut_or_copy = true;
	}
	else{
		selectedCell.style.borderColor = "red";
		setTimeout(function(){
			selectedCell.style.borderColor = "green";
		},300);
		return;
	}
}

function cutShortcut() {
	if(selectedCell === null)
			return;
		
	if(selectedCell === cutSrcEl) {
		selectedCell.style.borderColor = "red";
		setTimeout(function(){
			selectedCell.style.borderColor = "green";
		},300);
		return;
	}
					
	[i, j, k] = makeIJKFromId(selectedCell.id);
	if (helperTable[i - 1][j][k] !== null && helperTable[i - 1][j][k] !== 0 && parseInt(helperTable[i - 1][j][k]["isFixed"]) === 0) {
		if (paste_flag == true) {
			contextMenuReset();
		}
		cutStartHandler(selectedCell);
		paste_flag = true;
		cut_or_copy = false;
	}
	else{
		selectedCell.style.borderColor = "red";
		setTimeout(function(){
			selectedCell.style.borderColor = "green";
		},300);
		return;
	}
}

function deleteShortcut() {
	if(selectedCell === null)
			return;
	
	if(selectedCell === cutSrcEl) {
		selectedCell.style.borderColor = "red";
		setTimeout(function(){
			selectedCell.style.borderColor = "green";
		},300);
		return;
	}
	
	[i, j, k] = makeIJKFromId(selectedCell.id);
	if (helperTable[i - 1][j][k] !== null && helperTable[i - 1][j][k] !== 0) {
		deleteEntry(selectedCell);
	}
	else{
		selectedCell.style.borderColor = "red";
		setTimeout(function(){
			selectedCell.style.borderColor = "green";
		},300);
		return;
	}
}
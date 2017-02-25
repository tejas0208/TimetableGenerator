USE timeTable;
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="FM-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Maths1"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-DSY"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (1, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 9, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="AB"),
			(SELECT teacherId from teacher WHERE teacherShortName="Appsci1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (2, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 6, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="AB"),
			(SELECT teacherId from teacher WHERE teacherShortName="Appsci1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="FM-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Maths1"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-DSY"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem4"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="TCS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Gauri"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (3, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 7, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 8, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 9, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 7, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 8, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 9, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="FM-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Maths1"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-DSY"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 3, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem4"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 4, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sawant"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (4, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 8, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 9, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 8, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 9, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 3, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem4"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 4, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="TCS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Gauri"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (5, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 6, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 8, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="AB"),
			(SELECT teacherId from teacher WHERE teacherShortName="Appsci1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);

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
			(1, 6, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 7, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="DC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Aparna"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 8, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sawant"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
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
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 2, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 3, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 4, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 2, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 3, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 4, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S1"), 
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
			(2, 7, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 8, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 9, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 7, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 8, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 9, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S4"), 
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
			(3, 6, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sawant"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
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
			(4, 6, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
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
			(5, 7, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="DC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Aparna"), 
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
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="FM-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Maths1"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-DSY"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 4, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 5, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="DC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Gaikwad"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (1, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 7, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 8, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 9, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 7, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 8, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 9, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="FM-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Maths1"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-DSY"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 3, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 4, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 5, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 3, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 4, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 5, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (2, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 7, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 8, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sawant"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 9, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="TCS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Gosavi"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 10, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AB"),
			(SELECT teacherId from teacher WHERE teacherShortName="Appsci1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="FM-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Maths1"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-DSY"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem4"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 5, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AB"),
			(SELECT teacherId from teacher WHERE teacherShortName="Appsci1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (3, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 7, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="TCS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Gosavi"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 8, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sawant"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 9, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="DC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Gaikwad"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="FM-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Maths1"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-DSY"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 3, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem4"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 5, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="DC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Gaikwad"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (4, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sawant"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 8, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="TCS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Gosavi"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AB"),
			(SELECT teacherId from teacher WHERE teacherShortName="Appsci1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 3, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem4"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 4, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 5, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 6, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 4, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 5, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 6, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 7, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 8, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 9, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 7, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 8, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 9, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 1, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Nishchay"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 2, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="DM"),
			(SELECT teacherId from teacher WHERE teacherShortName="Archana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-DM1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 2, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD"),
			(SELECT teacherId from teacher WHERE teacherShortName="Nikita"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CBD1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 2, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CG"),
			(SELECT teacherId from teacher WHERE teacherShortName="VKP"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CG1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (1, 3, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 4, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vandana"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 5, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 6, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="FOSS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-FOSS1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 7, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="FOSS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-FOSS1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 1, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Nishchay"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 2, 
			(SELECT roomId from room WHERE roomShortName="DBMSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 3, 
			(SELECT roomId from room WHERE roomShortName="DBMSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 4, 
			(SELECT roomId from room WHERE roomShortName="DBMSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 2, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 3, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 4, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 2, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vandana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 3, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vandana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 4, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vandana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (2, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 6, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 7, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vandana"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 9, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CG"),
			(SELECT teacherId from teacher WHERE teacherShortName="VKP"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CG1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 10, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD"),
			(SELECT teacherId from teacher WHERE teacherShortName="Nikita"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CBD1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 1, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Nishchay"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 2, 
			(SELECT roomId from room WHERE roomShortName="DBMSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="DBMSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="DBMSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 2, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 2, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (3, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 6, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vandana"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 7, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="FOSS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-FOSS1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 7, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="DM"),
			(SELECT teacherId from teacher WHERE teacherShortName="Archana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-DM1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 8, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CG"),
			(SELECT teacherId from teacher WHERE teacherShortName="VKP"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CG1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem6"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 10, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CPES"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CPES1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 4, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (4, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 6, 
			(SELECT roomId from room WHERE roomShortName="DBMSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="DBMSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 8, 
			(SELECT roomId from room WHERE roomShortName="DBMSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 6, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 8, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 6, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 8, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 6, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vandana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vandana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 8, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vandana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 6, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 8, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem6"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 10, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CPES"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CPES1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 1, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="FOSS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-FOSS1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 2, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="FOSS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-FOSS1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 3, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="FOSS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-FOSS1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 1, 
			(SELECT roomId from room WHERE roomShortName="ASL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jibi"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CBD1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 2, 
			(SELECT roomId from room WHERE roomShortName="ASL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jibi"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CBD1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 3, 
			(SELECT roomId from room WHERE roomShortName="ASL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jibi"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CBD1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 1, 
			(SELECT roomId from room WHERE roomShortName="Cogni-5"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CPES-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CPES1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 2, 
			(SELECT roomId from room WHERE roomShortName="Cogni-5"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CPES-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CPES1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 3, 
			(SELECT roomId from room WHERE roomShortName="Cogni-5"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CPES-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CPES1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 1, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CG-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="VKP"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CG1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 2, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CG-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="VKP"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CG1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 3, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CG-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="VKP"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CG1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 1, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="DM-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Archana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-DM1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 2, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="DM-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Archana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-DM1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 3, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="DM-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Archana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-DM1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 4, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="DM"),
			(SELECT teacherId from teacher WHERE teacherShortName="Archana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-DM1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 4, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD"),
			(SELECT teacherId from teacher WHERE teacherShortName="Nikita"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CBD1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 4, 
			(SELECT roomId from room WHERE roomShortName="ASL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CPES"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-CPES1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (5, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 6, 
			(SELECT roomId from room WHERE roomShortName="DBMSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 7, 
			(SELECT roomId from room WHERE roomShortName="DBMSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 8, 
			(SELECT roomId from room WHERE roomShortName="DBMSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 6, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Archana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 7, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Archana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 8, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SE-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Archana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 6, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 7, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 8, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="OS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 6, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vandana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 7, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vandana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 8, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CASP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vandana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-CE-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem6"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 2, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="DM"),
			(SELECT teacherId from teacher WHERE teacherShortName="Archana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-DM1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 2, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD"),
			(SELECT teacherId from teacher WHERE teacherShortName="Nikita"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CBD2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 2, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD"),
			(SELECT teacherId from teacher WHERE teacherShortName="Nikita"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CBD1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 3, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 4, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (1, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 6, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="FOSS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-FOSS1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 6, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CPES"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CPES1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 7, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="FOSS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-FOSS1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 6, 
			(SELECT roomId from room WHERE roomShortName="ASL"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jibi"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CBD1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 7, 
			(SELECT roomId from room WHERE roomShortName="ASL"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jibi"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CBD1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 8, 
			(SELECT roomId from room WHERE roomShortName="ASL"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jibi"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CBD1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 6, 
			(SELECT roomId from room WHERE roomShortName="FOSS2"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="DM-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Archana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-DM1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 7, 
			(SELECT roomId from room WHERE roomShortName="FOSS2"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="DM-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Archana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-DM1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 8, 
			(SELECT roomId from room WHERE roomShortName="FOSS2"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="DM-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Archana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-DM1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 2, 
			(SELECT roomId from room WHERE roomShortName="Cogni-34"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="VKP"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 3, 
			(SELECT roomId from room WHERE roomShortName="Cogni-34"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="VKP"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 4, 
			(SELECT roomId from room WHERE roomShortName="Cogni-34"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="VKP"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 2, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 3, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 4, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 2, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="JVA"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 3, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="JVA"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 4, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="JVA"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (2, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 6, 
			(SELECT roomId from room WHERE roomShortName="Cogni-34"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 7, 
			(SELECT roomId from room WHERE roomShortName="Cogni-34"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 8, 
			(SELECT roomId from room WHERE roomShortName="Cogni-34"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 6, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Mane"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 7, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Mane"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 8, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Mane"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 6, 
			(SELECT roomId from room WHERE roomShortName="Cogni-4"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="JVA"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 7, 
			(SELECT roomId from room WHERE roomShortName="Cogni-4"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="JVA"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 8, 
			(SELECT roomId from room WHERE roomShortName="Cogni-4"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="JVA"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 6, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 7, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 8, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD"),
			(SELECT teacherId from teacher WHERE teacherShortName="Nikita"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CBD1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 2, 
			(SELECT roomId from room WHERE roomShortName="Cogni-34"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="VKP"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="Cogni-34"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="VKP"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="Cogni-34"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="VKP"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 2, 
			(SELECT roomId from room WHERE roomShortName="Cogni-4"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="Cogni-4"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="Cogni-4"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 2, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Mane"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Mane"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Mane"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 2, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 5, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (3, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 7, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="FOSS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-FOSS1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 7, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="DM"),
			(SELECT teacherId from teacher WHERE teacherShortName="Archana"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-DM1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem6"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 10, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CPES"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CPES1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 2, 
			(SELECT roomId from room WHERE roomShortName="Cogni-34"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 3, 
			(SELECT roomId from room WHERE roomShortName="Cogni-34"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 4, 
			(SELECT roomId from room WHERE roomShortName="Cogni-34"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 2, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="JVA"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 3, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="JVA"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 4, 
			(SELECT roomId from room WHERE roomShortName="Cogni-3"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="JVA"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 2, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 3, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 4, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 2, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 3, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 4, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-T3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 5, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (4, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC"),
			(SELECT teacherId from teacher WHERE teacherShortName="JVA"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 8, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC"),
			(SELECT teacherId from teacher WHERE teacherShortName="JVA"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem6"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 10, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CPES"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CPES1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 1, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="FOSS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-FOSS1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 2, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="FOSS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-FOSS1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 3, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="FOSS-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Abhijit"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-FOSS1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 1, 
			(SELECT roomId from room WHERE roomShortName="Cogni-5"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CPES-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CPES1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 2, 
			(SELECT roomId from room WHERE roomShortName="Cogni-5"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CPES-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CPES1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 3, 
			(SELECT roomId from room WHERE roomShortName="Cogni-5"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CPES-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CPES1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 1, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Nikita"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CBD2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 2, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Nikita"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CBD2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 3, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Nikita"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CBD2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 4, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD"),
			(SELECT teacherId from teacher WHERE teacherShortName="Nikita"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CBD1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 4, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CBD"),
			(SELECT teacherId from teacher WHERE teacherShortName="Nikita"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CBD2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 4, 
			(SELECT roomId from room WHERE roomShortName="ASL"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CPES"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="TYBT-IT-CPES1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 5, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="SDP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Snehal"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (5, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 7, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AnC"),
			(SELECT teacherId from teacher WHERE teacherShortName="JVA"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 8, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="LP"),
			(SELECT teacherId from teacher WHERE teacherShortName="SNG"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="TYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem6"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (1, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 7, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="EC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Rahul"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 8, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem8"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti2"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem8"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti2"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 10, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 11, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="IPR"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti3"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (2, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 7, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-WST1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 8, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-WST1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem8"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti2"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 10, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-CSFLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 10, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-CSFLP2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 10, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="NLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-NLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 2, 
			(SELECT roomId from room WHERE roomShortName="Cogni-5"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="EC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Rahul"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-EC1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="Cogni-5"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="EC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Rahul"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-EC1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 2, 
			(SELECT roomId from room WHERE roomShortName="ASL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-CSFLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="ASL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-CSFLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="NLP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-NLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 5, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="NLP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-NLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (3, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 7, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-WST2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 8, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-WST2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 9, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-WST5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 10, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-WST5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 3, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-CSFLP2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 4, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-CSFLP2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 3, 
			(SELECT roomId from room WHERE roomShortName="Cogni-5"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="EC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Rahul"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-EC2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 4, 
			(SELECT roomId from room WHERE roomShortName="Cogni-5"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="EC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Rahul"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-EC2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 5, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (4, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-WST3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 8, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-WST3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-CSFLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-CSFLP2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 9, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="NLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-NLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 10, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="EC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Rahul"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 5, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (5, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 7, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-WST4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 8, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Khadse"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-WST4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-CSFLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-CSFLP2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 9, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="NLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="BT-CE-NLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 10, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="EC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Rahul"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (1, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 7, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="EC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Rahul"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-EC1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 8, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem8"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti2"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem8"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti2"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (2, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 8, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="IPR"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti3"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem8"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti2"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 10, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-CSFLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 10, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-CSFLP2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 10, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="NLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-NLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 2, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jignesh"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-WST5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jignesh"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-WST5"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="NLP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-NLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 5, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="NLP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-NLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="ASL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="EC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Rahul"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-EC1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 5, 
			(SELECT roomId from room WHERE roomShortName="ASL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="EC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Rahul"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-EC1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-CSFLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 5, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-CSFLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (3, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 7, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jignesh"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 8, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="EC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Rahul"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-EC2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 9, 
			(SELECT roomId from room WHERE roomShortName="GML"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="EC-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Rahul"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-EC2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 8, 
			(SELECT roomId from room WHERE roomShortName="SSL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-CSFLP2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 9, 
			(SELECT roomId from room WHERE roomShortName="Ssl"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-CSFLP2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 2, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jignesh"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-WST1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 3, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jignesh"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-WST1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 4, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jignesh"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-WST2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 5, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jignesh"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-WST2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (4, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jignesh"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-CSFLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-CSFLP2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 9, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="NLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-NLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 10, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="EC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Rahul"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 2, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jignesh"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-WST3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 3, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jignesh"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-WST3"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 4, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jignesh"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-WST4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 5, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jignesh"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-WST4"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (5, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 7, 
			(SELECT roomId from room WHERE roomShortName="ISL"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="WST-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jignesh"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-CSFLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="CSFLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="Ghumbre"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-CSFLP2"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 9, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="NLP"),
			(SELECT teacherId from teacher WHERE teacherShortName="YBL"), 
			(SELECT batchId from batch WHERE batchName="BT-IT-NLP1"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 10, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="BT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="EC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Rahul"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 5, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CVBD"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jibi"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (1, 6, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 7, 
			(SELECT roomId from room WHERE roomShortName="DML"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="DMML"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vahida"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 8, 
			(SELECT roomId from room WHERE roomShortName="DML"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SIC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Mane"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(1, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MOOC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti4"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 4, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ES"),
			(SELECT teacherId from teacher WHERE teacherShortName="Dixit"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (2, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 6, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="AA"),
			(SELECT teacherId from teacher WHERE teacherShortName="GSN"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 7, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="DMML"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vahida"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(2, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SIC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Mane"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MOOC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti4"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CVBD"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jibi"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (3, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 6, 
			(SELECT roomId from room WHERE roomShortName="DML"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PG-Lab-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vahida"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 7, 
			(SELECT roomId from room WHERE roomShortName="DML"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PG-Lab-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vahida"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 8, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="DMML"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vahida"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(3, 9, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="AA"),
			(SELECT teacherId from teacher WHERE teacherShortName="GSN"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 4, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ES"),
			(SELECT teacherId from teacher WHERE teacherShortName="Dixit"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (4, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 6, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MOOC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti4"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="DML"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="SIC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Mane"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(4, 8, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="AA"),
			(SELECT teacherId from teacher WHERE teacherShortName="GSN"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 4, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ES"),
			(SELECT teacherId from teacher WHERE teacherShortName="Dixit"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES (5, 5, NULL, 1, TRUE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 6, 
			(SELECT roomId from room WHERE roomShortName="DML"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PG-Lab-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vahida"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 7, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PG-Lab-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vahida"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			(5, 8, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="FYMT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="CVBD"),
			(SELECT teacherId from teacher WHERE teacherShortName="Jibi"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			1,
			FALSE);

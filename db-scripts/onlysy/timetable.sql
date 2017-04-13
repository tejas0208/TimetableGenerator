USE timeTable;
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(1, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="FM-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Maths1"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-DSY"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, classId, batchId, snapshotId, isFixed) VALUES 
				(1, 5, 
				(SELECT classId from class where classShortName="SYBT-CE"),
				NULL,  
				(SELECT snapshotId from snapshot where snapshotName="default"),
				TRUE);
INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES
				((SELECT ttId FROM timeTable WHERE day = 1 AND slotNo = 5 AND 
				classId = (SELECT classId from class WHERE classShortName="SYBT-CE")  
				AND isFixed = TRUE), "LUNCH", 1);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(1, 9, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="AB"),
			(SELECT teacherId from teacher WHERE teacherShortName="Appsci1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, classId, batchId, snapshotId, isFixed) VALUES 
				(2, 5, 
				(SELECT classId from class where classShortName="SYBT-CE"),
				NULL,  
				(SELECT snapshotId from snapshot where snapshotName="default"),
				TRUE);
INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES
				((SELECT ttId FROM timeTable WHERE day = 2 AND slotNo = 5 AND 
				classId = (SELECT classId from class WHERE classShortName="SYBT-CE")  
				AND isFixed = TRUE), "LUNCH", 1);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(2, 6, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="AB"),
			(SELECT teacherId from teacher WHERE teacherShortName="Appsci1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="FM-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Maths1"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-DSY"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem4"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="TCS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Gauri"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, classId, batchId, snapshotId, isFixed) VALUES 
				(3, 5, 
				(SELECT classId from class where classShortName="SYBT-CE"),
				NULL,  
				(SELECT snapshotId from snapshot where snapshotName="default"),
				TRUE);
INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES
				((SELECT ttId FROM timeTable WHERE day = 3 AND slotNo = 5 AND 
				classId = (SELECT classId from class WHERE classShortName="SYBT-CE")  
				AND isFixed = TRUE), "LUNCH", 1);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 7, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S1"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 8, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S1"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 9, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S1"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 7, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S3"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 8, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S3"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 9, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S3"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(4, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="FM-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Maths1"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-DSY"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(4, 3, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem4"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(4, 4, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sawant"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, classId, batchId, snapshotId, isFixed) VALUES 
				(4, 5, 
				(SELECT classId from class where classShortName="SYBT-CE"),
				NULL,  
				(SELECT snapshotId from snapshot where snapshotName="default"),
				TRUE);
INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES
				((SELECT ttId FROM timeTable WHERE day = 4 AND slotNo = 5 AND 
				classId = (SELECT classId from class WHERE classShortName="SYBT-CE")  
				AND isFixed = TRUE), "LUNCH", 1);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S2"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(4, 8, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S2"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(4, 9, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S2"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S4"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(4, 8, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S4"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(4, 9, 
			(SELECT roomId from room WHERE roomShortName="FOSS1"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sheetal"), 
			(SELECT batchId from batch WHERE batchName="SYBT-CE-S4"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 3, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem4"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 4, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="TCS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Gauri"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, classId, batchId, snapshotId, isFixed) VALUES 
				(5, 5, 
				(SELECT classId from class where classShortName="SYBT-CE"),
				NULL,  
				(SELECT snapshotId from snapshot where snapshotName="default"),
				TRUE);
INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES
				((SELECT ttId FROM timeTable WHERE day = 5 AND slotNo = 5 AND 
				classId = (SELECT classId from class WHERE classShortName="SYBT-CE")  
				AND isFixed = TRUE), "LUNCH", 1);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 6, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 8, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="AB"),
			(SELECT teacherId from teacher WHERE teacherShortName="Appsci1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(1, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="FM-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Maths1"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-DSY"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(1, 4, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(1, 5, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="DC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Gaikwad"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, classId, batchId, snapshotId, isFixed) VALUES 
				(1, 6, 
				(SELECT classId from class where classShortName="SYBT-IT"),
				NULL,  
				(SELECT snapshotId from snapshot where snapshotName="default"),
				TRUE);
INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES
				((SELECT ttId FROM timeTable WHERE day = 1 AND slotNo = 6 AND 
				classId = (SELECT classId from class WHERE classShortName="SYBT-IT")  
				AND isFixed = TRUE), "LUNCH", 1);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(1, 7, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S3"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(1, 8, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S3"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(1, 9, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S3"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(1, 7, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S4"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(1, 8, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S4"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(1, 9, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S4"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(2, 3, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S1"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(2, 4, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S1"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(2, 5, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S1"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(2, 3, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S2"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(2, 4, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S2"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(2, 5, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S2"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, classId, batchId, snapshotId, isFixed) VALUES 
				(2, 6, 
				(SELECT classId from class where classShortName="SYBT-IT"),
				NULL,  
				(SELECT snapshotId from snapshot where snapshotName="default"),
				TRUE);
INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES
				((SELECT ttId FROM timeTable WHERE day = 2 AND slotNo = 6 AND 
				classId = (SELECT classId from class WHERE classShortName="SYBT-IT")  
				AND isFixed = TRUE), "LUNCH", 1);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(2, 7, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(2, 8, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sawant"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(2, 9, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="TCS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Gosavi"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(2, 10, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AB"),
			(SELECT teacherId from teacher WHERE teacherShortName="Appsci1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="FM-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Maths1"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-DSY"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 3, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem4"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 4, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 5, 
			(SELECT roomId from room WHERE roomShortName="AC-203"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AB"),
			(SELECT teacherId from teacher WHERE teacherShortName="Appsci1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, classId, batchId, snapshotId, isFixed) VALUES 
				(3, 6, 
				(SELECT classId from class where classShortName="SYBT-IT"),
				NULL,  
				(SELECT snapshotId from snapshot where snapshotName="default"),
				TRUE);
INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES
				((SELECT ttId FROM timeTable WHERE day = 3 AND slotNo = 6 AND 
				classId = (SELECT classId from class WHERE classShortName="SYBT-IT")  
				AND isFixed = TRUE), "LUNCH", 1);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 7, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="TCS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Gosavi"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(3, 8, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sawant"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(4, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="FM-II"),
			(SELECT teacherId from teacher WHERE teacherShortName="Maths1"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-DSY"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(4, 3, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem4"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, classId, batchId, snapshotId, isFixed) VALUES 
				(4, 6, 
				(SELECT classId from class where classShortName="SYBT-IT"),
				NULL,  
				(SELECT snapshotId from snapshot where snapshotName="default"),
				TRUE);
INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES
				((SELECT ttId FROM timeTable WHERE day = 4 AND slotNo = 6 AND 
				classId = (SELECT classId from class WHERE classShortName="SYBT-IT")  
				AND isFixed = TRUE), "LUNCH", 1);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(4, 7, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT"),
			(SELECT teacherId from teacher WHERE teacherShortName="Sawant"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(4, 8, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="TCS"),
			(SELECT teacherId from teacher WHERE teacherShortName="Gosavi"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 2, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="AB"),
			(SELECT teacherId from teacher WHERE teacherShortName="Appsci1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 3, 
			(SELECT roomId from room WHERE roomShortName="SH"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="ILOE-Sem4"),
			(SELECT teacherId from teacher WHERE teacherShortName="Insti1"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 4, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S1"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 5, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S1"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 6, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Uma"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S1"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 4, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S2"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 5, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S2"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 6, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S2"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 7, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S4"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 8, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S4"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 9, 
			(SELECT roomId from room WHERE roomShortName="PL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S4"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 7, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S3"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 8, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S3"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 9, 
			(SELECT roomId from room WHERE roomShortName="DSL"),
			(SELECT classId from class WHERE classShortName="SYBT-IT"), 
			(SELECT subjectId from subject WHERE subjectShortName="MPT-Lab"),
			(SELECT teacherId from teacher WHERE teacherShortName="Kumbhar"), 
			(SELECT batchId from batch WHERE batchName="SYBT-IT-S3"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);

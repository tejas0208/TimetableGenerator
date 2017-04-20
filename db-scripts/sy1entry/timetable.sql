USE timeTable;
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(5, 6, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(1, 4, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(1, 5, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="DC"),
			(SELECT teacherId from teacher WHERE teacherShortName="Aparna"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);
INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			(2, 7, 
			(SELECT roomId from room WHERE roomShortName="AC-202"),
			(SELECT classId from class WHERE classShortName="SYBT-CE"), 
			(SELECT subjectId from subject WHERE subjectShortName="PPL"),
			(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"), 
			(SELECT batchId from batch WHERE batchName="NONE"), 
			(SELECT snapshotId from snapshot where snapshotName="default"),
			FALSE);

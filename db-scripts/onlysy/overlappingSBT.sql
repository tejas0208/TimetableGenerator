USE timeTable;
INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "FM-II" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "SYBT-CE-DSY" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName = "Maths1" and snapshotId = 1)),
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "FM-II" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "SYBT-IT-DSY" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName= "Maths1" and snapshotId = 1)),
			1
		);
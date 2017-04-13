USE timeTable;
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-CE-S1"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-CE-S1"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Sheetal"),
		1
	);

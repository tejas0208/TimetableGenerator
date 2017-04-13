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
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-CE-S2"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-CE-S2"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Sheetal"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-CE-S3"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-CE-S3"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Sheetal"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-CE-S4"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-CE-S4"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Sheetal"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-IT-S1"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-IT-S1"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Uma"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-IT-S2"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-IT-S2"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Uma"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-IT-S3"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-IT-S3"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Vaibhav"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-IT-S4"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-IT-S4"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Vaibhav"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="FM-II"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-CE-DSY"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Maths1"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="FM-II"),
		(SELECT batchId FROM batch WHERE batchName="SYBT-IT-DSY"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Maths1"),
		1
	);

USE timeTable;
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="C-S1"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="C-S1"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Sheetal"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="C-S2"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="C-S2"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Sheetal"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="C-S3"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="C-S3"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Sheetal"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="C-S4"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="C-S4"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Sheetal"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="I-S1"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="I-S1"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Uma"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="I-S2"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="I-S2"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Uma"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="I-S3"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="I-S3"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Vaibhav"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="MPT-Lab"),
		(SELECT batchId FROM batch WHERE batchName="I-S4"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Kumbhar"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="PPL-Lab"),
		(SELECT batchId FROM batch WHERE batchName="I-S4"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Vaibhav"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="FM-II"),
		(SELECT batchId FROM batch WHERE batchName="C-DSY"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Maths1"),
		1
	);
INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId, snapshotId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName="FM-II"),
		(SELECT batchId FROM batch WHERE batchName="I-DSY"),
		(SELECT teacherId FROM teacher WHERE teacherShortName="Maths1"),
		1
	);

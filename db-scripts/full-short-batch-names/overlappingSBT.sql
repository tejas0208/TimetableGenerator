USE timeTable;
INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "FM-II" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "SY-C-DSY" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName = "Maths1" and snapshotId = 1)),
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "FM-II" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "SY-I-DSY" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName= "Maths1" and snapshotId = 1)),
			1
		);
INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "FM-II" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "SY-I-DSY" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName= "Maths1" and snapshotId = 1)),
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "FM-II" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "SY-C-DSY" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName = "Maths1" and snapshotId = 1)),
			1
		);
INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "CBD-Lab" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "C-CBD1" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName = "Jibi" and snapshotId = 1)),
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "CBD-Lab" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "I-CBD1" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName= "Jibi" and snapshotId = 1)),
			1
		);
INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "CBD-Lab" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "I-CBD1" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName= "Jibi" and snapshotId = 1)),
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "CBD-Lab" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "C-CBD1" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName = "Jibi" and snapshotId = 1)),
			1
		);
INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "CPES-Lab" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "C-CPES1" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName = "Sheetal" and snapshotId = 1)),
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "CPES-Lab" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "I-CPES1" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName= "Sheetal" and snapshotId = 1)),
			1
		);
INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "CPES-Lab" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "I-CPES1" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName= "Sheetal" and snapshotId = 1)),
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "CPES-Lab" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "C-CPES1" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName = "Sheetal" and snapshotId = 1)),
			1
		);
INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "FOSS-Lab" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "C-FOSS1" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName = "Abhijit" and snapshotId = 1)),
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "FOSS-Lab" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "I-FOSS1" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName= "Abhijit" and snapshotId = 1)),
			1
		);
INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "FOSS-Lab" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "I-FOSS1" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName= "Abhijit" and snapshotId = 1)),
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = (SELECT subjectId from subject where subjectShortName = "FOSS-Lab" and snapshotId = 1) AND batchId = (SELECT batchId from batch where batchName = "C-FOSS1" and snapshotId = 1) AND teacherId = (SELECT teacherId from teacher where teacherShortName = "Abhijit" and snapshotId = 1)),
			1
		);

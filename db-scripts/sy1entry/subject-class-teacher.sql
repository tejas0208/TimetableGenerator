USE timeTable;
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="PPL"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="DC"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Aparna"),
				1
			);

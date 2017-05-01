USE timeTable;
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="AB"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Appsci1"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="TCS"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Gauri"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="MPT"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Sawant"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="PPL"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="ILOE-Sem4"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Insti1"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="DC"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Aparna"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="AB"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Appsci1"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="TCS"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Gosavi"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="MPT"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Sawant"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="PPL"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="ILOE-Sem4"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Insti2"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="DC"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Gaikwad"),
				1
			);

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
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="OS"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Nishchay"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="CASP"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Vandana"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="SE"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Tanuja"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="ILOE-Sem6"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Insti3"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="LP"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Ghotkar"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="AnC"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Aghav"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="SDP"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Snehal"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="ILOE-Sem6"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Insti3"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="FCP"), 
				(SELECT classId FROM class WHERE classShortName="FYBT1"),
				(SELECT teacherId from teacher WHERE teacherShortName="Vibhavari"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="FCP"), 
				(SELECT classId FROM class WHERE classShortName="FYBT2"),
				(SELECT teacherId from teacher WHERE teacherShortName="Jagdish"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="FCP"), 
				(SELECT classId FROM class WHERE classShortName="FYBT3"),
				(SELECT teacherId from teacher WHERE teacherShortName="Rajani"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="FCP"), 
				(SELECT classId FROM class WHERE classShortName="FYBT4"),
				(SELECT teacherId from teacher WHERE teacherShortName="Gosavi"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="FCP"), 
				(SELECT classId FROM class WHERE classShortName="FYBT5"),
				(SELECT teacherId from teacher WHERE teacherShortName="Aparna"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="AA"), 
				(SELECT classId FROM class WHERE classShortName="FYMT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Soma"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="SIC"), 
				(SELECT classId FROM class WHERE classShortName="FYMT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Mane"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="DMML"), 
				(SELECT classId FROM class WHERE classShortName="FYMT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Vahida"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="CVBD"), 
				(SELECT classId FROM class WHERE classShortName="FYMT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Jibi"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="ES"), 
				(SELECT classId FROM class WHERE classShortName="FYMT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Dixit"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="MOOC"), 
				(SELECT classId FROM class WHERE classShortName="FYMT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Gosavi"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="ILOE-Sem8"), 
				(SELECT classId FROM class WHERE classShortName="BT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Insti2"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="ILOE-Sem8"), 
				(SELECT classId FROM class WHERE classShortName="BT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Insti2"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="WST"), 
				(SELECT classId FROM class WHERE classShortName="BT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Khadse"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="IPR"), 
				(SELECT classId FROM class WHERE classShortName="BT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Insti3"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="IPR"), 
				(SELECT classId FROM class WHERE classShortName="BT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Insti3"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="WST"), 
				(SELECT classId FROM class WHERE classShortName="BT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Jignesh"),
				1
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="PG-Lab-II"), 
				(SELECT classId FROM class WHERE classShortName="FYMT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Vahida"),
				1
			);

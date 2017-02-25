USE timeTable;
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="AB"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Appsci1")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="TCS"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Gauri")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="MPT"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Sawant")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="PPL"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="ILOE-Sem4"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Insti1")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="DC"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Aparna")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="AB"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Appsci1")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="TCS"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Gosavi")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="MPT"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Sawant")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="PPL"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Vaibhav")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="ILOE-Sem4"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Insti2")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="DC"), 
				(SELECT classId FROM class WHERE classShortName="SYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Gaikwad")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="OS"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Nishchay")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="CASP"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Vandana")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="SE"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Tanuja")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="ILOE-Sem6"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Insti3")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="LP"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Ghotkar")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="AnC"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Aghav")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="SDP"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Snehal")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="ILOE-Sem6"), 
				(SELECT classId FROM class WHERE classShortName="TYBT-IT"),
				(SELECT teacherId from teacher WHERE teacherShortName="Insti3")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="FCP"), 
				(SELECT classId FROM class WHERE classShortName="FYBT1"),
				(SELECT teacherId from teacher WHERE teacherShortName="Vibhavari")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="FCP"), 
				(SELECT classId FROM class WHERE classShortName="FYBT2"),
				(SELECT teacherId from teacher WHERE teacherShortName="Jagdish")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="FCP"), 
				(SELECT classId FROM class WHERE classShortName="FYBT3"),
				(SELECT teacherId from teacher WHERE teacherShortName="Rajani")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="FCP"), 
				(SELECT classId FROM class WHERE classShortName="FYBT4"),
				(SELECT teacherId from teacher WHERE teacherShortName="Gosavi")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="FCP"), 
				(SELECT classId FROM class WHERE classShortName="FYBT5"),
				(SELECT teacherId from teacher WHERE teacherShortName="Aparna")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="AA"), 
				(SELECT classId FROM class WHERE classShortName="FYMT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Soma")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="SIC"), 
				(SELECT classId FROM class WHERE classShortName="FYMT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Mane")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="DMML"), 
				(SELECT classId FROM class WHERE classShortName="FYMT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Vahida")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="CVBD"), 
				(SELECT classId FROM class WHERE classShortName="FYMT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Jibi")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="ES"), 
				(SELECT classId FROM class WHERE classShortName="FYMT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Dixit")
			);
INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName="MOOC"), 
				(SELECT classId FROM class WHERE classShortName="FYMT-CE"),
				(SELECT teacherId from teacher WHERE teacherShortName="Gosavi")
			);

USE timeTable;
INSERT INTO config(dayBegin, slotDuration, nSlots, dept, incharge) VALUES ("0800", 3600, 8, 1, 1);

INSERT INTO teacher(teacherName, teacherShortName, deptId, minHrs, maxHrs) VALUES ("Abhijit A.M.", "Abhijit", 1, 16, 20);
INSERT INTO teacher(teacherName, teacherShortName, deptId, minHrs, maxHrs) VALUES ("Vahida Attar", "Vahida", 1, 16, 20);
INSERT INTO teacher(teacherName, teacherShortName, deptId, minHrs, maxHrs) VALUES ("Vandana Inamdar.", "Vandana", 1, 16, 20);
INSERT INTO teacher(teacherName, teacherShortName, deptId, minHrs, maxHrs) VALUES ("Shirish Gosavi", "Shirish", 1, 16, 20);
INSERT INTO teacher(teacherName, teacherShortName, deptId, minHrs, maxHrs) VALUES ("Jignesh Mangukiya", "Jignesh", 1, 16, 20);

INSERT INTO dept(deptName) VALUES ("Computer Engg and I.T.");
INSERT INTO dept(deptName) VALUES ("Instrumentation");
INSERT INTO dept(deptName) VALUES ("Electrical Engg");
INSERT INTO dept(deptName) VALUES ("Mechanical Engg");

INSERT INTO user(userName, password) VALUES ("abhijit.comp", "a");
INSERT INTO user(userName, password) VALUES ("hod.comp", "a");


INSERT INTO class(className, classShortName) VALUES ("S.Y.B.Tech. Comp. Engg", "SYBT-CE");
INSERT INTO class(className, classShortName) VALUES ("S.Y.B.Tech. Information TEchnology", "SYBT-IT");
INSERT INTO class(className, classShortName) VALUES ("F.Y. M.Tech. Information TEchnology", "FYMT-IT");

INSERT INTO batch(batchName, batchCount) VALUES ("SYBT-CE-S1", 20);
INSERT INTO batch(batchName, batchCount) VALUES ("SYBT-CE-S2", 20);
INSERT INTO batch(batchName, batchCount) VALUES ("SYBT-CE-S3", 20);

INSERT INTO batchClass(batchID, classID) VALUES (1, 1);
INSERT INTO batchClass(batchID, classID) VALUES (2, 1);
INSERT INTO batchClass(batchID, classID) VALUES (3, 1);

INSERT INTO room(roomName, roomCount) VALUES  ("AC 101", 100);
INSERT INTO room(roomName, roomCount) VALUES  ("AC 102", 100);
INSERT INTO room(roomName, roomCount) VALUES  ("AC 103", 100);
INSERT INTO room(roomName, roomCount) VALUES  ("AC 104", 100);

INSERT INTO subject(subjectName, subjectShortName, totalHrs, eachSlot, courseCode) VALUES ("Data Structures and Algorithms", "DSA", 4, 1, "CT-09012");
INSERT INTO subject(subjectName, subjectShortName, totalHrs, eachSlot, courseCode) VALUES ("Design and Analysis of Algorithms", "DAA", 2, 1, "CT-09013");
INSERT INTO subject(subjectName, subjectShortName, totalHrs, eachSlot, courseCode) VALUES ("Database Management Systems", "DBMS", 3, 1, "CT-08012");
INSERT INTO subject(subjectName, subjectShortName, totalHrs, eachSlot, courseCode) VALUES ("Database Management Systems Laboratoty", "DBMS-Lab", 2, 2, "CT-07012");
INSERT INTO subject(subjectName, subjectShortName, totalHrs, eachSlot, courseCode) VALUES ("Data Structures and Algorithms Laboratory", "DSA-Lab", 4, 2, "CT-06012");


INSERT INTO subjectBatch(subjectId, batchId) VALUES ((SELECT s.subjectId FROM subject s WHERE s.subjectName = "Data Structures and Algorithms"), (SELECT b.batchId FROM batch b WHERE b.batchName = "SYBT-CE-S1"));
INSERT INTO subjectBatch(subjectId, batchId) VALUES ((SELECT s.subjectId FROM subject s WHERE s.subjectName = "Data Structures and Algorithms"), (SELECT b.batchId FROM batch b WHERE b.batchName = "SYBT-CE-S2"));
INSERT INTO subjectBatch(subjectId, batchId) VALUES ((SELECT s.subjectId FROM subject s WHERE s.subjectName = "Data Structures and Algorithms"), (SELECT b.batchId FROM batch b WHERE b.batchName = "SYBT-CE-S2"));
/*INSERT INTO subjectBatch(subjectId, batchId) VALUES ((SELECT s.subjectId FROM subject s WHERE s.subjectName = "Data Structures and Algorithms"), (SELECT b.batchId FROM batch b WHERE b.batchName = "S1" and b.classId=2));
INSERT INTO subjectBatch(subjectId, batchId) VALUES ((SELECT s.subjectId FROM subject s WHERE s.subjectName = "Data Structures and Algorithms"), (SELECT b.batchId FROM batch b WHERE b.batchName = "S2" and b.classId=2));
INSERT INTO subjectBatch(subjectId, batchId) VALUES ((SELECT s.subjectId FROM subject s WHERE s.subjectName = "Data Structures and Algorithms"), (SELECT b.batchId FROM batch b WHERE b.batchName = "S3" and b.classId=2));
 */

INSERT INTO subjectTeacher(subjectId, teacherId) VALUES ((SELECT s.subjectId FROM subject s WHERE s.subjectName = "Data Structures and Algorithms"), ( SELECT t.teacherId FROM teacher t WHERE t.teacherName = "Abhijit A.M."));
INSERT INTO subjectTeacher(subjectId, teacherId) VALUES ((SELECT s.subjectId FROM subject s WHERE s.subjectName = "Design and Analysis of Algorithms"), ( SELECT t.teacherId FROM teacher t WHERE t.teacherName = "Shirish Gosavi"));
INSERT INTO subjectTeacher(subjectId, teacherId) VALUES ((SELECT s.subjectId FROM subject s WHERE s.subjectName = "Database Management Systems"), ( SELECT t.teacherId FROM teacher t WHERE t.teacherName = "Vahida Attar"));

INSERT INTO classRoom(classId, roomId) VALUES ((SELECT c.classId FROM class c WHERE c.classShortName = "SYBT-CE"), (SELECT r.roomId FROM room r WHERE r.roomName = "AC 101"));
INSERT INTO classRoom(classId, roomId) VALUES ((SELECT c.classId FROM class c WHERE c.classShortName = "SYBT-IT"), (SELECT r.roomId FROM room r WHERE r.roomName = "AC 102"));
INSERT INTO classRoom(classId, roomId) VALUES ((SELECT c.classId FROM class c WHERE c.classShortName = "FYMT-CE"), (SELECT r.roomId FROM room r WHERE r.roomName = "AC 103"));


INSERT INTO timeTable (roomId, slotNo, day, classId, subjectId, teacherId, batchId, configId) VALUES (
	(SELECT r.roomId from room r where r.roomName = "AC 101"),
	1, 1, 
	(SELECT c.classId from class c where c.classShortName = "SYBT-CE"),
	(SELECT s.subjectId from subject s where s.subjectShortName = "DSA"),
	(SELECT t.teacherId from teacher t where t.teacherShortName = "Abhijit"),
	NULL,
	1);
	

/*

CREATE TABLE batchRoom
(
brId	int auto_increment,
batchId	int,
roomId	int,
primary key (brId)
);

CREATE TABLE timeTable
(
ttId	int auto_increment,
roomId	int,
starttime time,
endtime	time,
day smallint,
classId	int,
batchId	int,
teacherId	int,
configId	int,
primary key(ttId)
);
*/

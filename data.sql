USE timetable;
INSERT INTO config(daybegin, slotduration, nslots, dept, incharge) VALUES ("0800", 60, 8, 1, 1);

INSERT INTO teacher(teachername, teachershortname, deptid, minhrs, maxhrs) VALUES ("Abhijit A.M.", "Abhijit", 1, 16, 20);
INSERT INTO teacher(teachername, teachershortname, deptid, minhrs, maxhrs) VALUES ("Vahida Attar", "Vahida", 1, 16, 20);
INSERT INTO teacher(teachername, teachershortname, deptid, minhrs, maxhrs) VALUES ("Vandana Inamdar.", "Vandana", 1, 16, 20);
INSERT INTO teacher(teachername, teachershortname, deptid, minhrs, maxhrs) VALUES ("Shirish Gosavi", "Shirish", 1, 16, 20);
INSERT INTO teacher(teachername, teachershortname, deptid, minhrs, maxhrs) VALUES ("Jignesh Mangukiya", "Jignesh", 1, 16, 20);

INSERT INTO dept(deptname) VALUES ("Computer Engg and I.T.");
INSERT INTO dept(deptname) VALUES ("Instrumentation");
INSERT INTO dept(deptname) VALUES ("Electrical Engg");
INSERT INTO dept(deptname) VALUES ("Mechanical Engg");

INSERT INTO user(username, password) VALUES ("abhijit.comp", "a");
INSERT INTO user(username, password) VALUES ("hod.comp", "a");


INSERT INTO class(classname, classshortname) VALUES ("S.Y.B.Tech. Comp. Engg", "SYBT-CE");
INSERT INTO class(classname, classshortname) VALUES ("S.Y.B.Tech. Information TEchnology", "SYBT-IT");
INSERT INTO class(classname, classshortname) VALUES ("F.Y. M.Tech. Information TEchnology", "FYMT-IT");

INSERT INTO batch(classid, batchname, batchcount) VALUES (1, "S1", 20);
INSERT INTO batch(classid, batchname, batchcount) VALUES (1, "S2", 20);
INSERT INTO batch(classid, batchname, batchcount) VALUES (1, "S3", 20);
INSERT INTO batch(classid, batchname, batchcount) VALUES (2, "S1", 20);
INSERT INTO batch(classid, batchname, batchcount) VALUES (2, "S2", 20);
INSERT INTO batch(classid, batchname, batchcount) VALUES (2, "S3", 20);


INSERT INTO room(roomname, roomcount) VALUES  ("AC 101", 100);
INSERT INTO room(roomname, roomcount) VALUES  ("AC 102", 100);
INSERT INTO room(roomname, roomcount) VALUES  ("AC 103", 100);
INSERT INTO room(roomname, roomcount) VALUES  ("AC 104", 100);

INSERT INTO subject(subjectname, subjectshortname, totalhrs, eachslot, coursecode) VALUES ("Data Structures and Algorithms", "DSA", 4, 1, "CT-09012");
INSERT INTO subject(subjectname, subjectshortname, totalhrs, eachslot, coursecode) VALUES ("Design and Analysis of Algorithms", "DAA", 2, 1, "CT-09013");
INSERT INTO subject(subjectname, subjectshortname, totalhrs, eachslot, coursecode) VALUES ("Database Management Systems", "DBMS", 3, 1, "CT-08012");
INSERT INTO subject(subjectname, subjectshortname, totalhrs, eachslot, coursecode) VALUES ("Database Management Systems Laboratoty", "DBMS-Lab", 2, 2, "CT-07012");
INSERT INTO subject(subjectname, subjectshortname, totalhrs, eachslot, coursecode) VALUES ("Data Structures and Algorithms Laboratory", "DSA-Lab", 4, 2, "CT-06012");


INSERT INTO subject_batch(subjectid, batchid) VALUES ((SELECT s.subjectid FROM subject s WHERE s.subjectname = "Data Structures and Algorithms"), (SELECT b.batchid FROM batch b WHERE b.batchname = "S1" and b.classid=1));
INSERT INTO subject_batch(subjectid, batchid) VALUES ((SELECT s.subjectid FROM subject s WHERE s.subjectname = "Data Structures and Algorithms"), (SELECT b.batchid FROM batch b WHERE b.batchname = "S2" and b.classid=1));
INSERT INTO subject_batch(subjectid, batchid) VALUES ((SELECT s.subjectid FROM subject s WHERE s.subjectname = "Data Structures and Algorithms"), (SELECT b.batchid FROM batch b WHERE b.batchname = "S3" and b.classid=1));
INSERT INTO subject_batch(subjectid, batchid) VALUES ((SELECT s.subjectid FROM subject s WHERE s.subjectname = "Data Structures and Algorithms"), (SELECT b.batchid FROM batch b WHERE b.batchname = "S1" and b.classid=2));
INSERT INTO subject_batch(subjectid, batchid) VALUES ((SELECT s.subjectid FROM subject s WHERE s.subjectname = "Data Structures and Algorithms"), (SELECT b.batchid FROM batch b WHERE b.batchname = "S2" and b.classid=2));
INSERT INTO subject_batch(subjectid, batchid) VALUES ((SELECT s.subjectid FROM subject s WHERE s.subjectname = "Data Structures and Algorithms"), (SELECT b.batchid FROM batch b WHERE b.batchname = "S3" and b.classid=2));


INSERT INTO subject_teacher(subjectid, teacherid) VALUES ((SELECT s.subjectid FROM subject s WHERE s.subjectname = "Data Structures and Algorithms"), ( SELECT t.teacherid FROM teacher t WHERE t.teachername = "Abhijit A.M."));
INSERT INTO subject_teacher(subjectid, teacherid) VALUES ((SELECT s.subjectid FROM subject s WHERE s.subjectname = "Design and Analysis of Algorithms"), ( SELECT t.teacherid FROM teacher t WHERE t.teachername = "Shirish Gosavi"));
INSERT INTO subject_teacher(subjectid, teacherid) VALUES ((SELECT s.subjectid FROM subject s WHERE s.subjectname = "Database Management Systems"), ( SELECT t.teacherid FROM teacher t WHERE t.teachername = "Vahida Attar"));

INSERT INTO class_room(classid, roomid) VALUES ((SELECT c.classid FROM class c WHERE c.classshortname = "SYBT-CE"), (SELECT r.roomid FROM room r WHERE r.roomname = "AC 101"));
INSERT INTO class_room(classid, roomid) VALUES ((SELECT c.classid FROM class c WHERE c.classshortname = "SYBT-IT"), (SELECT r.roomid FROM room r WHERE r.roomname = "AC 102"));
INSERT INTO class_room(classid, roomid) VALUES ((SELECT c.classid FROM class c WHERE c.classshortname = "FYMT-CE"), (SELECT r.roomid FROM room r WHERE r.roomname = "AC 103"));


INSERT INTO timetable (roomid, slotno, day, classid, subjectid, teacherid, batchid, configid) VALUES (
	(SELECT r.roomid from room r where r.roomname = "AC 101"),
	1, 1, 
	(SELECT c.classid from class c where c.classshortname = "SYBT-CE"),
	(SELECT s.subjectid from subject s where s.subjectshortname = "DSA"),
	(SELECT t.teacherid from teacher t where t.teachershortname = "Abhijit"),
	NULL,
	1);
	

/*

CREATE TABLE batch_room
(
brid	int auto_increment,
batchid	int,
roomid	int,
primary key (brid)
);

CREATE TABLE timetable
(
ttid	int auto_increment,
roomid	int,
starttime time,
endtime	time,
day smallint,
classid	int,
batchid	int,
teacherid	int,
configid	int,
primary key(ttid)
);
*/

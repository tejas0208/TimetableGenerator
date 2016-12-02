DROP DATABASE IF EXISTS timeTable;
CREATE DATABASE timeTable;
USE timeTable;

CREATE TABLE config
(
configId int AUTO_INCREMENT PRIMARY KEY,
dayBegin time,
slotDuration int,/* in seconds */	
nSlots	int,
dept	varchar(256),
incharge	int
);

CREATE TABLE user
(
userid	int  AUTO_INCREMENT PRIMARY KEY,
userName varchar(256) NOT NULL,
password varchar(256) NOT NULL
);

CREATE TABLE role
(
roleId	int  AUTO_INCREMENT PRIMARY KEY,
roleName varchar(256) NOT NULL
);

CREATE TABLE capability
(
capId int  AUTO_INCREMENT PRIMARY KEY,
capName	varchar(256) NOT NULL,
roleId	int
);

CREATE TABLE teacher
(
teacherId	int  AUTO_INCREMENT PRIMARY KEY,
teacherName	varchar(256) NOT NULL,
teacherShortName	varchar(16) NOT NULL,
minHrs	int,
maxHrs int,
deptId	int	
);

CREATE TABLE dept 
(
deptId	int  AUTO_INCREMENT PRIMARY KEY,
deptName	varchar(256) NOT NULL
);

CREATE TABLE class
(
classId	int  AUTO_INCREMENT PRIMARY KEY,
className	varchar(256) NOT NULL,
classShortName	varchar(32) NOT NULL,
semester	int	NOT NULL
);

CREATE TABLE batch
(
batchId	int AUTO_INCREMENT PRIMARY KEY,
batchName	varchar(32) NOT NULL,
batchCount	int
);

CREATE TABLE batchClass 
(
bcId int AUTO_INCREMENT PRIMARY KEY,
batchId int NOT NULL, 
classId int NOT NULL,
FOREIGN KEY (batchId) REFERENCES batch(batchId),
FOREIGN KEY (classId) REFERENCES class(classId)
);

CREATE TABLE room
(
roomId	int AUTO_INCREMENT PRIMARY KEY,
roomName	varchar(32) NOT NULL,
roomShortName	varchar(16) NOT NULL,
roomCount	int
);

CREATE TABLE subject
(
subjectId	int AUTO_INCREMENT PRIMARY KEY,
subjectName	varchar(32) NOT NULL,
subjectShortName	varchar(16) NOT NULL,
totalHrs	int,
eachSlot	int,
/*courseCode	varchar(32) NOT NULL, */
batches	boolean
);

CREATE TABLE subjectBatch
(
sbId	int AUTO_INCREMENT PRIMARY KEY,
subjectId	int,
batchId	int NOT NULL,
FOREIGN KEY (batchId) REFERENCES batch(batchId),
FOREIGN KEY (subjectId) REFERENCES subject(subjectId)
);

CREATE Table classSubject 
(
csId	int AUTO_INCREMENT PRIMARY KEY,
classId	int NOT NULL,
subjectId	int NOT NULL,
FOREIGN KEY (classId) REFERENCES class(classId),
FOREIGN KEY (subjectId) REFERENCES subject(subjectId)
);

CREATE TABLE subjectTeacher
(
stId	int AUTO_INCREMENT PRIMARY KEY,
subjectId	int NOT NULL,
teacherId	int NOT NULL,
FOREIGN KEY (teacherId) REFERENCES teacher(teacherId),
FOREIGN KEY (subjectId) REFERENCES subject(subjectId)
);

CREATE TABLE classRoom
(
crId	int AUTO_INCREMENT PRIMARY KEY,
classId	int NOT NULL,
roomId	int NOT NULL,
FOREIGN KEY (classId) REFERENCES class(classId),
FOREIGN KEY (roomId) REFERENCES room(roomId)
);

CREATE TABLE batchRoom
(
brId	int AUTO_INCREMENT PRIMARY KEY,
batchId	int NOT NULL,
roomId	int NOT NULL,
FOREIGN KEY (batchId) REFERENCES batch(batchId),
FOREIGN KEY (roomId) REFERENCES room(roomId)
);

CREATE TABLE timeTable
(
ttId	int AUTO_INCREMENT PRIMARY KEY,
day smallint, 
slotNo	int,
roomId	int,
classId	int,
subjectId int,
teacherId	int,
batchId	int,
configId	int,
isBreak	boolean
);

/* create views */
CREATE VIEW timeTableReadable AS
SELECT tt.ttId, tt.day, tt.slotNo, r.roomShortName, c.classShortName, s.subjectShortName, t.teacherShortName, b.batchName, tt.isBreak
FROM  timeTable tt, room r, class c, subject s, teacher t, batch b
WHERE tt.classId = c.classId AND
	tt.subjectId = s.subjectId AND
	tt.batchId = b.batchId AND 
	tt.roomId = r.roomId AND
	tt.teacherId = t.teacherId AND
	tt.isBreak = FALSE
UNION 
SELECT tt.ttId, tt.day, tt.slotNo, r.roomShortName, c.classShortName, s.subjectShortName, t.teacherShortName, null, tt.isBreak
FROM  timeTable tt, room r, class c, subject s, teacher t, batch b
WHERE tt.classId = c.classId AND
	tt.subjectId = s.subjectId AND
	tt.roomId = r.roomId AND
	tt.teacherId = t.teacherId AND
	tt.batchid = null AND
	tt.isBreak = FALSE
UNION 
SELECT tt.ttId, tt.day, tt.slotNo, null, null, null, null, null, TRUE 
FROM  timeTable tt
WHERE tt.isBreak = TRUE
ORDER by ttId;



CREATE VIEW subjectBatchReadable AS
SELECT s.subjectShortName,b.batchName from subject s, batch b, subjectBatch sb
WHERE	sb.subjectId = s.subjectId AND
	sb.batchid = b.batchId
ORDER by subjectShortName;


CREATE VIEW classSubjectReadable AS
SELECT s.subjectShortName, c.classShortName from subject s, class c, classSubject cb
WHERE	cb.subjectId = s.subjectId AND
	cb.classId = c.classId
ORDER by subjectShortName;

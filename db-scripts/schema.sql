DROP DATABASE IF EXISTS timeTable;
CREATE DATABASE timeTable DEFAULT CHARSET=utf8;
USE timeTable;

CREATE TABLE config
(
configId int AUTO_INCREMENT PRIMARY KEY,
dayBegin time,
slotDuration int,/* in seconds */	
nSlots	int,
deptId	int,
incharge	int
);

CREATE TABLE user
(
userid	int  AUTO_INCREMENT PRIMARY KEY,
userName varchar(128) NOT NULL,
password varchar(128) NOT NULL,
CONSTRAINT c_userName UNIQUE(userName)
);

CREATE TABLE role
(
roleId	int  AUTO_INCREMENT PRIMARY KEY,
roleName varchar(128) NOT NULL,
CONSTRAINT c_roleName UNIQUE(roleName)
);

CREATE TABLE capability
(
capId int  AUTO_INCREMENT PRIMARY KEY,
capName	varchar(128) NOT NULL,
roleId	int,
CONSTRAINT c_capName UNIQUE(capName)
);

CREATE TABLE teacher
(
teacherId	int  AUTO_INCREMENT PRIMARY KEY,
teacherName	varchar(256) NOT NULL,
teacherShortName	varchar(16) NOT NULL,
minHrs	int,
maxHrs int,
deptId	int,
CONSTRAINT c_teacherShortName UNIQUE(teacherShortName)
);

CREATE TABLE dept 
(
deptId	int  AUTO_INCREMENT PRIMARY KEY,
deptName	varchar(128) NOT NULL,
CONSTRAINT c_deptName UNIQUE(deptName)
);

CREATE TABLE class
(
classId	int  AUTO_INCREMENT PRIMARY KEY,
className	varchar(256) NOT NULL,
classShortName	varchar(32) NOT NULL,
semester	int	NOT NULL,
CONSTRAINT c_classShortName UNIQUE(classShortName)
);

CREATE TABLE batch
(
batchId	int AUTO_INCREMENT PRIMARY KEY,
batchName	varchar(32) NOT NULL,
batchCount	int,
CONSTRAINT c_batchName UNIQUE(batchName)
);

CREATE TABLE batchClass 
(
bcId int AUTO_INCREMENT PRIMARY KEY,
batchId int NOT NULL, 
classId int NOT NULL,
FOREIGN KEY (batchId) REFERENCES batch(batchId),
FOREIGN KEY (classId) REFERENCES class(classId)
);

CREATE VIEW batchClassReadable 
AS
SELECT b.batchName, c.classShortName 
FROM batch b, class c, batchClass bc
WHERE b.batchId = bc.batchId AND
      c.classId = bc.classId;

CREATE TABLE room
(
roomId	int AUTO_INCREMENT PRIMARY KEY,
roomName	varchar(32) NOT NULL,
roomShortName	varchar(16) NOT NULL,
roomCount	int,
CONSTRAINT c_roomShortName UNIQUE(roomShortName)
);

CREATE TABLE subject
(
subjectId	int AUTO_INCREMENT PRIMARY KEY,
subjectName	varchar(32) NOT NULL,
subjectShortName	varchar(16) NOT NULL,
totalHrs	int,
eachSlot	int,
/*courseCode	varchar(32) NOT NULL, */
batches	boolean,
CONSTRAINT c_subjectShortName UNIQUE(subjectShortName)
);

CREATE TABLE subjectBatch
(
sbId	int AUTO_INCREMENT PRIMARY KEY,
subjectId	int,
batchId	int NOT NULL,
FOREIGN KEY (batchId) REFERENCES batch(batchId),
FOREIGN KEY (subjectId) REFERENCES subject(subjectId)
);

CREATE VIEW subjectBatchReadable AS
SELECT s.subjectShortName,b.batchName from subject s, batch b, subjectBatch sb
WHERE	sb.subjectId = s.subjectId AND
	sb.batchid = b.batchId
ORDER by subjectShortName;


CREATE Table classSubject 
(
csId	int AUTO_INCREMENT PRIMARY KEY,
classId	int NOT NULL,
subjectId	int NOT NULL,
FOREIGN KEY (classId) REFERENCES class(classId),
FOREIGN KEY (subjectId) REFERENCES subject(subjectId)
);

CREATE VIEW classSubjectReadable AS
SELECT s.subjectShortName, c.classShortName from subject s, class c, classSubject cb
WHERE	cb.subjectId = s.subjectId AND
	cb.classId = c.classId
ORDER by subjectShortName;

CREATE TABLE subjectTeacher
(
stId	int AUTO_INCREMENT PRIMARY KEY,
subjectId	int NOT NULL,
teacherId	int NOT NULL,
FOREIGN KEY (teacherId) REFERENCES teacher(teacherId),
FOREIGN KEY (subjectId) REFERENCES subject(subjectId)
);

CREATE VIEW subjectTeacherReadalbe AS
SELECT s.subjectShortName, t.teacherShortName from subject s, teacher t, subjectTeacher st
WHERE	s.subjectId = st.subjectId AND
	t.teacherId = st.teacherId
ORDER BY subjectShortName;

CREATE TABLE classRoom
(
crId	int AUTO_INCREMENT PRIMARY KEY,
classId	int NOT NULL,
roomId	int NOT NULL,
FOREIGN KEY (classId) REFERENCES class(classId),
FOREIGN KEY (roomId) REFERENCES room(roomId)
);

CREATE VIEW classRoomReadable AS
SELECT c.classShortName, r.roomname from class c, room r, classRoom cr
WHERE	c.classId = cr.classId AND
	r.roomId = cr.roomId
ORDER BY classShortName;

CREATE TABLE batchRoom
(
brId	int AUTO_INCREMENT PRIMARY KEY,
batchId	int NOT NULL,
roomId	int NOT NULL,
FOREIGN KEY (batchId) REFERENCES batch(batchId),
FOREIGN KEY (roomId) REFERENCES room(roomId)
);

CREATE VIEW batchRoomReadable AS 
SELECT b.batchName, r.roomName from batch b, room r, batchRoom br
WHERE	b.batchId = br.batchId AND
	r.roomId = br.roomId
ORDER BY batchName;
	
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

/*  Requirements on every new entry or an update
same day slot teacher --> room same, subject same, class can be different (combined classes), batches can be different, break must be false


same day slot class --> roomid same not allowed (duplicate entry) + different room must for different batch, subject same ok for lab course as batch will be scheduled + different subject also ok for a batch of different lab,   teacherid must be different, batchId must be different, break must be false

same day slot subject --> must be a lab, batchId must be present, roomId must be different, classId can be different (different classe's batch scheduled), teacherId must be different, break must be false

same day slot  batch --> not allowed. batch will be always in one place any given time.

any day, any slot, break true --> room NULL, subject NULL,  class not NULL, teacher ??, batch may or may not be NULL, 
*/
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



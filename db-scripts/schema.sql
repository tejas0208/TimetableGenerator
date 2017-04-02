DROP DATABASE IF EXISTS timeTable;
CREATE DATABASE timeTable DEFAULT CHARSET=utf8;
USE timeTable;

CREATE TABLE config
(
configId int AUTO_INCREMENT PRIMARY KEY,
dayBegin time	COMMENT 'Day Begins At',
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

CREATE TABLE dept 
(
deptId	int  AUTO_INCREMENT PRIMARY KEY,
deptName	varchar(128) NOT NULL,
deptShortName	varchar(32) NOT NULL,
CONSTRAINT c_deptName UNIQUE(deptName)
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

CREATE VIEW teacherReadable
AS
SELECT  t.teacherId, t.teacherName, t.teacherShortName,t.minHrs, t.maxHrs, d.deptShortName
FROM teacher t, dept d 
WHERE t.deptId = d.deptId;


CREATE TABLE class
(
classId	int  AUTO_INCREMENT PRIMARY KEY,
className	varchar(256) NOT NULL,
classShortName	varchar(32) NOT NULL,
semester	int	NOT NULL,
classCount	int NOT NULL,
CONSTRAINT c_classShortName UNIQUE(classShortName)
);

CREATE TABLE batch
(
batchId	int AUTO_INCREMENT PRIMARY KEY,
batchName	varchar(32) NOT NULL,
batchCount	int,
CONSTRAINT c_batchName UNIQUE(batchName)
);

CREATE TABLE batchCanOverlap
(
bo int AUTO_INCREMENT PRIMARY KEY,
batchId	int NOT NULL,
batchOverlapId int NOT NULL,
FOREIGN KEY(batchId) REFERENCES batch(batchId) ON DELETE CASCADE,
FOREIGN KEY(batchOverlapId) REFERENCES batch(batchId) ON DELETE CASCADE,
CONSTRAINT c_overlaps UNIQUE(batchId, batchOverlapId)
);

CREATE VIEW batchCanOverlapReadable
AS
SELECT b.batchName as "b1Name", b1.batchName  as "b2Name"
FROM batch b, batch b1, batchCanOverlap bo
WHERE b.batchId  = bo.batchId AND
	  b1.batchId = bo.batchOverlapId;

CREATE TABLE batchClass 
(
bcId int AUTO_INCREMENT PRIMARY KEY,
batchId int NOT NULL, 
classId int NOT NULL,
FOREIGN KEY (batchId) REFERENCES batch(batchId) ON DELETE CASCADE,
FOREIGN KEY (classId) REFERENCES class(classId) ON DELETE CASCADE,
CONSTRAINT c_batchClass UNIQUE(batchId, classId)
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
CONSTRAINT c_roomShortName UNIQUE(roomShortName),
CONSTRAINT c_roomName UNIQUE(roomName)
);

CREATE TABLE subject
(
subjectId	int AUTO_INCREMENT PRIMARY KEY,
subjectName	varchar(64) NOT NULL,
subjectShortName	varchar(16) NOT NULL,
eachSlot	int,
nSlots	int,
/*courseCode	varchar(32) NOT NULL, */
batches	boolean,
CONSTRAINT c_subjectShortName UNIQUE(subjectShortName)
);

CREATE TABLE subjectBatchTeacher
(
sbtId	int AUTO_INCREMENT PRIMARY KEY,
subjectId	int NOT NULL,
batchId	int NOT NULL,
teacherId int,
FOREIGN KEY (batchId) REFERENCES batch(batchId) ON DELETE CASCADE,
FOREIGN KEY (subjectId) REFERENCES subject(subjectId) ON DELETE CASCADE,
FOREIGN KEY (teacherId) REFERENCES teacher(teacherId) ON DELETE CASCADE,
CONSTRAINT c_subjectBatchTeacheer UNIQUE(subjectId, batchId, teacherId)
);

CREATE VIEW subjectBatchTeacherReadable AS
SELECT s.subjectShortName,b.batchName, t.teacherShortName from subject s, batch b, subjectBatchTeacher sbt, teacher t
WHERE	sbt.subjectId = s.subjectId AND
	sbt.batchid = b.batchId AND
	sbt.teacherId = t.teacherId
ORDER by subjectShortName;

CREATE TABLE overlappingSBT
(
osbtId int AUTO_INCREMENT PRIMARY KEY,
sbtId1	int NOT NULL,
sbtId2	int NOT NULL,
FOREIGN KEY (sbtId1) REFERENCES subjectBatchTeacher(sbtId) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (sbtId2) REFERENCES subjectBatchTeacher(sbtId) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT c_overlappingSBT	UNIQUE(sbtId1, sbtId2)
);

CREATE VIEW overlappingSBTReadable AS
SELECT s1.subjectShortName as subject1, b1.batchName as batch1, t1.teacherShortName as teacher1,
		s2.subjectShortName as subject2, b2.batchName as batch2, t2.teacherShortName as teacher2 
FROM
		subject s1, subject s2, batch b1, batch b2, teacher t1, teacher t2,  
		overlappingSBT sbto, subjectBatchTeacher sbt1, subjectBatchTeacher sbt2 
WHERE	sbto.sbtId1 = sbt1.sbtId AND sbto.sbtId2 = sbt2.sbtId AND
		sbt1.subjectId = s1.subjectId AND sbt1.batchId = b1.batchId AND sbt1.teacherId = t1.teacherId AND
		sbt2.subjectId = s2.subjectId AND sbt2.batchId = b2.batchId AND sbt2.teacherId = t2.teacherId;
	 
CREATE TABLE subjectClassTeacher 
(
sctId	int AUTO_INCREMENT PRIMARY KEY,
subjectId	int NOT NULL,
classId		int NOT NULL,
teacherId	int,
FOREIGN KEY (subjectId) REFERENCES subject(subjectId) ON DELETE CASCADE,
FOREIGN KEY (classId) REFERENCES class(classId) ON DELETE CASCADE,
FOREIGN KEY (teacherId) REFERENCES teacher(teacherId) ON DELETE CASCADE,
CONSTRAINT c_subjectClassTeacheer UNIQUE(subjectId, classId)
);

CREATE VIEW subjectClassTeacherReadable AS
SELECT  c.classShortName, s.subjectShortName, t.teacherShortName 
FROM subject s, class c, teacher t, subjectClassTeacher sct
WHERE	s.subjectId = sct.subjectId AND
	t.teacherId = sct.teacherId AND
	c.classId = sct.classId 
ORDER BY subjectShortName;

CREATE TABLE classRoom
(
crId	int AUTO_INCREMENT PRIMARY KEY,
classId	int NOT NULL,
roomId	int NOT NULL,
FOREIGN KEY (classId) REFERENCES class(classId) ON DELETE CASCADE,
FOREIGN KEY (roomId) REFERENCES room(roomId) ON DELETE CASCADE,
CONSTRAINT c_classRoom UNIQUE(classId)
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
FOREIGN KEY (batchId) REFERENCES batch(batchId) ON DELETE CASCADE,
FOREIGN KEY (roomId) REFERENCES room(roomId) ON DELETE CASCADE,
CONSTRAINT c_batchRoom UNIQUE(batchId)
);

CREATE VIEW batchRoomReadable AS 
SELECT b.batchName, r.roomName from batch b, room r, batchRoom br
WHERE	b.batchId = br.batchId AND
	r.roomId = br.roomId
ORDER BY batchName;

CREATE TABLE subjectRoom
(
srId	int AUTO_INCREMENT PRIMARY KEY,
subjectId	int NOT NULL,
roomId	int NOT NULL,
FOREIGN KEY (subjectId) REFERENCES subject(subjectId) ON DELETE CASCADE,
FOREIGN KEY (roomId) REFERENCES room(roomId) ON DELETE CASCADE,
CONSTRAINT c_subjectRoom UNIQUE(subjectId)
);

CREATE VIEW subjectRoomReadable AS 
SELECT s.subjectShortName, r.roomName from subject s, room r, subjectRoom sr
WHERE	s.subjectId = sr.subjectId AND
	r.roomId = sr.roomId
ORDER BY subjectShortName;


CREATE TABLE snapshot 
(
snapshotId	int AUTO_INCREMENT PRIMARY KEY,
snapshotName	varchar(128),
snapshotCreator	int, 
FOREIGN KEY (snapshotCreator) REFERENCES user(userId) ON DELETE CASCADE,
createTime	time,
modifyTime	time,
CONSTRAINT c_snapshotName UNIQUE(snapshotName)
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
snapshotId int,
isFixed boolean,
FOREIGN KEY (roomId) REFERENCES room(roomId) ON DELETE CASCADE,
FOREIGN KEY (classId) REFERENCES class(classId) ON DELETE CASCADE,
FOREIGN KEY (batchId) REFERENCES batch(batchId) ON DELETE CASCADE,
FOREIGN KEY (subjectId) REFERENCES subject(subjectId) ON DELETE CASCADE,
FOREIGN KEY (teacherId) REFERENCES teacher(teacherId) ON DELETE CASCADE,
FOREIGN KEY (configId) REFERENCES config(configId) ON DELETE CASCADE,
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE
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
SELECT tt.ttId, tt.day, tt.slotNo, r.roomShortName, c.classShortName, 
		s.subjectShortName, t.teacherShortName, b.batchName, sn.snapshotName, tt.isFixed
FROM  timeTable tt, room r, class c, subject s, teacher t, batch b, snapshot sn
WHERE tt.classId = c.classId AND
	tt.subjectId = s.subjectId AND
	tt.batchId = b.batchId AND 
	tt.roomId = r.roomId AND
	tt.teacherId = t.teacherId AND
	tt.snapshotId = sn.snapshotId AND
	tt.isFixed = FALSE
UNION 
SELECT tt.ttId, tt.day, tt.slotNo, r.roomShortName, c.classShortName, 
			s.subjectShortName, t.teacherShortName, null, sn.snapshotName, tt.isFixed
FROM  timeTable tt, room r, class c, subject s, teacher t, batch b, snapshot sn
WHERE tt.classId = c.classId AND
	tt.subjectId = s.subjectId AND
	tt.roomId = r.roomId AND
	tt.teacherId = t.teacherId AND
	tt.batchid = null AND
	tt.snapshotId = sn.snapshotId AND
	tt.isFixed = FALSE
UNION 
SELECT tt.ttId, tt.day, tt.slotNo, null, c.classShortName, null, null, null, sn.snapshotName, TRUE 
FROM  timeTable tt, class c, snapshot sn
WHERE tt.isFixed = TRUE AND
	  tt.classId = c.classId AND
	  tt.snapshotId = sn.snapshotId
ORDER by ttId;

CREATE TABLE fixedEntries(
feId int AUTO_INCREMENT PRIMARY KEY,
ttId int NOT NULL UNIQUE,
feText	varchar(128),
FOREIGN KEY (ttId) REFERENCES timeTable(ttId) ON DELETE CASCADE
);

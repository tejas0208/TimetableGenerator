DROP DATABASE IF EXISTS timeTable;
CREATE DATABASE timeTable DEFAULT CHARSET=utf8;
USE timeTable;

CREATE TABLE dept 
(
deptId	int  AUTO_INCREMENT PRIMARY KEY COMMENT 'Department Id',
deptName	varchar(128) NOT NULL COMMENT 'Department Name',
deptShortName	varchar(32) NOT NULL COMMENT 'Department Short Name',
CONSTRAINT c_deptName UNIQUE(deptName)
);

CREATE TABLE user
(
userId	int  AUTO_INCREMENT PRIMARY KEY COMMENT 'User Id',
userName varchar(128) NOT NULL COMMENT 'User\'s Full Name',
password varchar(128) NOT NULL COMMENT 'User\'s Passsword',
CONSTRAINT c_userName UNIQUE(userName)
);


CREATE TABLE config
(
configId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Configuration Id',
configName	varchar(128) NOT NULL COMMENT 'Configuration Name',
dayBegin time	COMMENT 'Day Begins at Time',
slotDuration int COMMENT 'Duration of each slot in seconds',/* in seconds */	
nSlots	int COMMENT 'No of slots in a day',
deptId	int COMMENT 'Department of this config',
incharge	int COMMENT 'Incharge user of this config',
FOREIGN KEY (incharge) REFERENCES user(userId) ON DELETE CASCADE
);

CREATE TABLE snapshot 
(
snapshotId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'Snapshot Id',
snapshotName	varchar(128) COMMENT 'Name of the Snapshot',
snapshotCreator	int COMMENT 'User who created this snapshot',  
createTime	time COMMENT 'Time of creation of this snapshot',
modifyTime	time COMMENT 'Time of modification of this snapshot',
configId	int COMMENT 'Configuration Id for this snapshot',
FOREIGN KEY (snapshotCreator) REFERENCES user(userId) ON DELETE CASCADE,
FOREIGN KEY (configId) REFERENCES config(configId) ON DELETE CASCADE,
CONSTRAINT c_snapshotName UNIQUE(snapshotName)
);


CREATE TABLE role
(
roleId	int  AUTO_INCREMENT PRIMARY KEY COMMENT 'Role Id',
roleName varchar(128) NOT NULL COMMENT 'Name of the Role',
CONSTRAINT c_roleName UNIQUE(roleName)
);

CREATE TABLE capability
(
capId int  AUTO_INCREMENT PRIMARY KEY COMMENT 'Capability Id',
capName	varchar(128) NOT NULL COMMENT 'Capability Name',
roleId	int COMMENT 'Role Id' ,
CONSTRAINT c_capName UNIQUE(capName)
);

CREATE TABLE teacher
(
teacherId	int  AUTO_INCREMENT PRIMARY KEY COMMENT 'Teacher Id',
teacherName	varchar(256) NOT NULL COMMENT 'Teacher\'s Full Name',
teacherShortName	varchar(16) NOT NULL COMMENT 'Teacher\'s Short Name',
minHrs	int COMMENT 'Min Hrs of Work for Teacher',
maxHrs int COMMENT 'Max hrs of work for Teacher',
deptId	int COMMENT 'Department of the Teacher',
CONSTRAINT c_teacherShortName UNIQUE(teacherShortName)
);

CREATE VIEW teacherReadable
AS
SELECT  t.teacherId, t.teacherName, t.teacherShortName,t.minHrs, t.maxHrs, d.deptShortName
FROM teacher t, dept d 
WHERE t.deptId = d.deptId;


CREATE TABLE class
(
classId	int  AUTO_INCREMENT PRIMARY KEY COMMENT 'Class Id',
className	varchar(256) NOT NULL COMMENT 'Class\'s Full Name',
classShortName	varchar(32) NOT NULL COMMENT 'Class\'s Short Name',
semester	int	NOT NULL COMMENT 'Current Semester No',
classCount	int NOT NULL COMMENT 'No. of Students in Class',
CONSTRAINT c_classShortName UNIQUE(classShortName)
);

CREATE TABLE batch
(
batchId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'Batch Id',
batchName	varchar(32) NOT NULL COMMENT 'Batch Name',
batchCount	int COMMENT 'No. of Students in Batch',
CONSTRAINT c_batchName UNIQUE(batchName)
);

CREATE TABLE batchCanOverlap
(
bo int AUTO_INCREMENT PRIMARY KEY COMMENT 'BatchOverlap Id',
batchId	int NOT NULL COMMENT 'Batch Id',
batchOverlapId int NOT NULL COMMENT 'Batch Which Can Overlap',
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
bcId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Batch Class Id',
batchId int NOT NULL COMMENT 'Batch Id',  
classId int NOT NULL COMMENT 'Class Id',
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
roomId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'Room Id',
roomName	varchar(32) NOT NULL COMMENT 'Room Name',
roomShortName	varchar(16) NOT NULL COMMENT 'Room Short Name',
roomCount	int COMMENT 'Capacity of Room',
CONSTRAINT c_roomShortName UNIQUE(roomShortName),
CONSTRAINT c_roomName UNIQUE(roomName)
);

CREATE TABLE subject
(
subjectId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'Subject Id',
subjectName	varchar(64) NOT NULL COMMENT 'Subject Full Name',
subjectShortName	varchar(16) NOT NULL COMMENT 'Subject Short Name',
eachSlot	int COMMENT 'No. of Slots for Each Entry',
nSlots	int COMMENT 'Total No. of Entries for this Subjeect',
/*courseCode	varchar(32) NOT NULL, */
batches	boolean COMMENT 'Schedule in Batches?',
CONSTRAINT c_subjectShortName UNIQUE(subjectShortName)
);

CREATE TABLE subjectBatchTeacher
(
sbtId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'SBT Id',
subjectId	int NOT NULL COMMENT 'Subject Id',
batchId	int NOT NULL COMMENT 'Batch Id',
teacherId int COMMENT 'Teacher Id',
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
osbtId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Id: Subject-Batch Pairs that must overlap',
sbtId1	int NOT NULL COMMENT 'Sub-Batch Id 1',
sbtId2	int NOT NULL COMMENT 'Sub-Batch Id 2',
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
sctId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'Subject Class Teacher Mapping Id',
subjectId	int NOT NULL COMMENT 'Subject Id',
classId		int NOT NULL COMMENT 'Class Id',
teacherId	int COMMENT 'Teacher Id',
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
crId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'Class Room Mapping Id',
classId	int NOT NULL COMMENT 'Class Id',
roomId	int NOT NULL COMMENT 'Room Id',
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
brId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'Batch Room Mapping Id',
batchId	int NOT NULL COMMENT 'Batch Id',
roomId	int NOT NULL COMMENT 'Room Id',
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
srId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'Subject Room Preference Id',
subjectId	int NOT NULL COMMENT 'Subject Id',
roomId	int NOT NULL COMMENT 'Room Id',
FOREIGN KEY (subjectId) REFERENCES subject(subjectId) ON DELETE CASCADE,
FOREIGN KEY (roomId) REFERENCES room(roomId) ON DELETE CASCADE,
CONSTRAINT c_subjectRoom UNIQUE(subjectId)
);

CREATE VIEW subjectRoomReadable AS 
SELECT s.subjectShortName, r.roomName from subject s, room r, subjectRoom sr
WHERE	s.subjectId = sr.subjectId AND
	r.roomId = sr.roomId
ORDER BY subjectShortName;


CREATE TABLE timeTable
(
ttId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'TimeTable Id',
day smallint COMMENT 'Day of Week', 
slotNo	int COMMENT 'Slot No.',
roomId	int COMMENT 'Room Id',
classId	int COMMENT 'Class Id',
subjectId int COMMENT 'Subject Id',
teacherId	int COMMENT 'Teacher Id',
batchId	int COMMENT 'Batch Id',
snapshotId int NOT NULL COMMENT 'Snapshot Id',
isFixed boolean COMMENT 'Is Lunch/Fixed Slot?',
FOREIGN KEY (roomId) REFERENCES room(roomId) ON DELETE CASCADE,
FOREIGN KEY (classId) REFERENCES class(classId) ON DELETE CASCADE,
FOREIGN KEY (batchId) REFERENCES batch(batchId) ON DELETE CASCADE,
FOREIGN KEY (subjectId) REFERENCES subject(subjectId) ON DELETE CASCADE,
FOREIGN KEY (teacherId) REFERENCES teacher(teacherId) ON DELETE CASCADE,
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

CREATE TABLE fixedEntry (
feId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Fixed Entry Id',
ttId int NOT NULL UNIQUE COMMENT 'Timetable Entry Id',
fixedText	varchar(128) COMMENT 'Description',
FOREIGN KEY (ttId) REFERENCES timeTable(ttId) ON DELETE CASCADE
);

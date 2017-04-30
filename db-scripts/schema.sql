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
snapshotId int COMMENT 'Snapshot Id for this Teacher',
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,
CONSTRAINT c_teacherShortName UNIQUE(teacherShortName, snapshotId)
);

CREATE VIEW teacherReadable
AS
SELECT  t.teacherId, t.teacherName, t.teacherShortName, t.minHrs, t.maxHrs, d.deptShortName, s.snapshotName
FROM teacher t, dept d, snapshot s
WHERE t.deptId = d.deptId AND
	  t.snapshotId = s.snapshotId
ORDER BY snapshotName, teacherShortName;

CREATE TABLE class
(
classId	int  AUTO_INCREMENT PRIMARY KEY COMMENT 'Class Id',
className	varchar(256) NOT NULL COMMENT 'Class\'s Full Name',
classShortName	varchar(32) NOT NULL COMMENT 'Class\'s Short Name',
semester	int	NOT NULL COMMENT 'Current Semester No',
classCount	int NOT NULL COMMENT 'No. of Students in Class',
snapshotId int COMMENT 'Snapshot Id for this Class',
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,
CONSTRAINT c_classShortName UNIQUE(classShortName, snapshotId)
);

CREATE TABLE batch
(
batchId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'Batch Id',
batchName	varchar(32) NOT NULL COMMENT 'Batch Name',
batchCount	int COMMENT 'No. of Students in Batch',
snapshotId int COMMENT 'Snapshot Id for this Batch',
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,
CONSTRAINT c_batchName UNIQUE(batchName, snapshotId)
);

CREATE TABLE batchCanOverlap
(
boId int AUTO_INCREMENT PRIMARY KEY COMMENT 'BatchOverlap Id',
batchId	int NOT NULL COMMENT 'Batch Id',
batchOverlapId int NOT NULL COMMENT 'Batch Which Can Overlap',
snapshotId int COMMENT 'Snapshot Id for this BO',
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,
FOREIGN KEY(batchId) REFERENCES batch(batchId) ON DELETE CASCADE,
FOREIGN KEY(batchOverlapId) REFERENCES batch(batchId) ON DELETE CASCADE,
CONSTRAINT c_overlaps UNIQUE(batchId, batchOverlapId, snapshotId)
);

CREATE VIEW batchCanOverlapReadable
AS
SELECT bo.boId, b1.batchId as "b1Id", b1.batchName as "b1Name",
				b2.batchId as "b2Id", b2.batchName  as "b2Name",
				s.snapShotName
FROM batch b1, batch b2, batchCanOverlap bo, snapshot s
WHERE b1.batchId  = bo.batchId AND
	  b2.batchId = bo.batchOverlapId AND
	  bo.snapshotId = s.snapshotId
ORDER BY snapshotName, b1Name, b2Name;

CREATE TABLE batchClass 
(
bcId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Batch Class Id',
batchId int NOT NULL COMMENT 'Batch Id',  
classId int NOT NULL COMMENT 'Class Id',
snapshotId int COMMENT 'Snapshot Id for this batchClass',
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,
FOREIGN KEY (batchId) REFERENCES batch(batchId) ON DELETE CASCADE,
FOREIGN KEY (classId) REFERENCES class(classId) ON DELETE CASCADE,
CONSTRAINT c_batchClass UNIQUE(batchId, classId, snapshotId)
);

CREATE VIEW batchClassReadable 
AS
SELECT bc.bcId, b.batchId, b.batchName, b.batchCount, 
	c.classId, c.classShortName, c.classCount, s.snapshotName
FROM batch b, class c, batchClass bc, snapshot s
WHERE b.batchId = bc.batchId AND
      c.classId = bc.classId AND
	  bc.snapshotId = s.snapshotId
ORDER BY snapshotName, classShortName, batchName;

CREATE TABLE room
(
roomId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'Room Id',
roomName	varchar(32) NOT NULL COMMENT 'Room Name',
roomShortName	varchar(16) NOT NULL COMMENT 'Room Short Name',
roomCount	int COMMENT 'Capacity of Room',
snapshotId int COMMENT 'Snapshot Id for this Room',
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,
CONSTRAINT c_roomShortName UNIQUE(roomShortName, snapshotId),
CONSTRAINT c_roomName UNIQUE(roomName, snapshotId)
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
snapshotId int COMMENT 'Snapshot Id for this Subject',
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,
CONSTRAINT c_subjectShortName UNIQUE(subjectShortName, snapshotId)
);

CREATE TABLE subjectBatchTeacher
(
sbtId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'SBT Id',
subjectId	int NOT NULL COMMENT 'Subject Id',
batchId	int NOT NULL COMMENT 'Batch Id',
teacherId int COMMENT 'Teacher Id',
snapshotId int COMMENT 'Snapshot Id for this SBT',
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,
FOREIGN KEY (batchId) REFERENCES batch(batchId) ON DELETE CASCADE,
FOREIGN KEY (subjectId) REFERENCES subject(subjectId) ON DELETE CASCADE,
FOREIGN KEY (teacherId) REFERENCES teacher(teacherId) ON DELETE CASCADE,
CONSTRAINT c_subjectBatchTeacheer UNIQUE(subjectId, batchId, snapshotId)
);

CREATE VIEW subjectBatchTeacherReadable AS
SELECT sbt.sbtId, s.subjectId, s.subjectShortName,
		b.batchId, b.batchName, t.teacherId, t.teacherShortName , ss.snapshotName
FROM subject s, batch b, subjectBatchTeacher sbt, teacher t, snapshot ss
WHERE	sbt.subjectId = s.subjectId AND
	sbt.batchId = b.batchId AND
	sbt.teacherId = t.teacherId AND
	sbt.snapshotId = ss.snapshotId
ORDER by snapshotName , subjectShortName, batchName, teacherShortName;

CREATE TABLE overlappingSBT
(
osbtId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Id: Subject-Batch Pairs that must overlap',
sbtId1	int NOT NULL COMMENT 'Sub-Batch Id 1',
sbtId2	int NOT NULL COMMENT 'Sub-Batch Id 2',
snapshotId int COMMENT 'Snapshot Id for this OSBT',
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,
FOREIGN KEY (sbtId1) REFERENCES subjectBatchTeacher(sbtId) ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY (sbtId2) REFERENCES subjectBatchTeacher(sbtId) ON DELETE CASCADE ON UPDATE CASCADE,
CONSTRAINT c_overlappingSBT	UNIQUE(sbtId1, sbtId2, snapshotId)
);

CREATE VIEW overlappingSBTReadable AS
SELECT sbto.osbtId as osbtId,
		s1.subjectId as subjectId1, s1.subjectShortName as subject1,
		b1.batchId as batchId1, b1.batchName as batch1,
		t1.teacherId as teacherId1, t1.teacherShortName as teacher1,
		s2.subjectId as subjectId2, s2.subjectShortName as subject2,
		b2.batchId as batchId2, b2.batchName as batch2,
		t2.teacherId as teacherId2, t2.teacherShortName as teacher2,
		ss.snapshotName
FROM
		subject s1, subject s2, batch b1, batch b2, teacher t1, teacher t2,  
		overlappingSBT sbto, subjectBatchTeacher sbt1, subjectBatchTeacher sbt2, snapshot ss
WHERE	sbto.sbtId1 = sbt1.sbtId AND sbto.sbtId2 = sbt2.sbtId AND
		sbt1.subjectId = s1.subjectId AND sbt1.batchId = b1.batchId AND sbt1.teacherId = t1.teacherId AND
		sbt2.subjectId = s2.subjectId AND sbt2.batchId = b2.batchId AND sbt2.teacherId = t2.teacherId AND
		sbto.snapshotId = ss.snapshotId
ORDER BY snapshotName, subject1, subject2;
	 
CREATE TABLE subjectClassTeacher 
(
sctId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'Subject Class Teacher Mapping Id',
subjectId	int NOT NULL COMMENT 'Subject Id',
classId		int NOT NULL COMMENT 'Class Id',
teacherId	int COMMENT 'Teacher Id',
snapshotId int COMMENT 'Snapshot Id for this SCT',
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,
FOREIGN KEY (subjectId) REFERENCES subject(subjectId) ON DELETE CASCADE,
FOREIGN KEY (classId) REFERENCES class(classId) ON DELETE CASCADE,
FOREIGN KEY (teacherId) REFERENCES teacher(teacherId) ON DELETE CASCADE,
CONSTRAINT c_subjectClassTeacheer UNIQUE(subjectId, classId, snapshotId)
);

CREATE VIEW subjectClassTeacherReadable AS
SELECT  sct.sctId, c.classId, c.classShortName, s.subjectId, s.subjectShortName,
		t.teacherId, t.teacherShortName, ss.snapshotName
FROM subject s, class c, teacher t, subjectClassTeacher sct, snapshot ss
WHERE	s.subjectId = sct.subjectId AND
	t.teacherId = sct.teacherId AND
	c.classId = sct.classId  AND
	sct.snapshotId = ss.snapshotId
ORDER BY snapshotName, subjectShortName, classShortName, teacherShortName;

CREATE TABLE classRoom
(
crId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'Class Room Mapping Id',
classId	int NOT NULL COMMENT 'Class Id',
roomId	int NOT NULL COMMENT 'Room Id',
snapshotId int COMMENT 'Snapshot Id for this Class-Room',
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,
FOREIGN KEY (classId) REFERENCES class(classId) ON DELETE CASCADE,
FOREIGN KEY (roomId) REFERENCES room(roomId) ON DELETE CASCADE,
CONSTRAINT c_classRoom UNIQUE(classId, snapshotId)
);

CREATE VIEW classRoomReadable AS
SELECT cr.crId, c.classId, c.classShortName, r.roomId, r.roomShortName, s.snapshotName
FROM class c, room r, classRoom cr, snapshot s
WHERE	c.classId = cr.classId AND
	r.roomId = cr.roomId AND
	cr.snapshotId = s.snapshotId
ORDER BY snapshotName, classShortName, roomShortName;

CREATE TABLE batchRoom
(
brId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'Batch Room Mapping Id',
batchId	int NOT NULL COMMENT 'Batch Id',
roomId	int NOT NULL COMMENT 'Room Id',
snapshotId int COMMENT 'Snapshot Id for this Batch-Room',
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,
FOREIGN KEY (batchId) REFERENCES batch(batchId) ON DELETE CASCADE,
FOREIGN KEY (roomId) REFERENCES room(roomId) ON DELETE CASCADE,
CONSTRAINT c_batchRoom UNIQUE(batchId, snapshotId)
);

CREATE VIEW batchRoomReadable AS 
SELECT br.brId, b.batchId, b.batchName, r.roomId, r.roomShortName, s.snapshotName
FROM batch b, room r, batchRoom br, snapshot s
WHERE	b.batchId = br.batchId AND
	r.roomId = br.roomId AND
	br.snapshotId = s.snapshotId
ORDER BY snapshotName, batchName, roomShortName;

CREATE TABLE subjectRoom
(
srId	int AUTO_INCREMENT PRIMARY KEY COMMENT 'Subject Room Preference Id',
subjectId	int NOT NULL COMMENT 'Subject Id',
roomId	int NOT NULL COMMENT 'Room Id',
snapshotId int COMMENT 'Snapshot Id for this Subject-Room',
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,
FOREIGN KEY (subjectId) REFERENCES subject(subjectId) ON DELETE CASCADE,
FOREIGN KEY (roomId) REFERENCES room(roomId) ON DELETE CASCADE,
CONSTRAINT c_subjectRoom UNIQUE(subjectId, snapshotId)
);

CREATE VIEW subjectRoomReadable AS 
SELECT sr.srId, s.subjectId, s.subjectShortName, r.roomId, 
		r.roomShortName , ss.snapshotName
FROM subject s, room r, subjectRoom sr, snapshot ss
WHERE	s.subjectId = sr.subjectId AND
	r.roomId = sr.roomId AND
	r.snapshotId = ss.snapshotId
ORDER BY snapshotName, subjectShortName, roomShortName;


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
isFixed boolean COMMENT 'Is Lunch/Fixed Slot?',
snapshotId int NOT NULL COMMENT 'Snapshot Id',
FOREIGN KEY (roomId) REFERENCES room(roomId) ON DELETE CASCADE,
FOREIGN KEY (classId) REFERENCES class(classId) ON DELETE CASCADE,
FOREIGN KEY (batchId) REFERENCES batch(batchId) ON DELETE CASCADE,
FOREIGN KEY (subjectId) REFERENCES subject(subjectId) ON DELETE CASCADE,
FOREIGN KEY (teacherId) REFERENCES teacher(teacherId) ON DELETE CASCADE,
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE
);


/*  Requirements on every new entry or an update
same day slot teacher --> room same, subject same, class can be different (combined classes), batches can be different, break must be false


same day slot class --> roomId same not allowed (duplicate entry) + different room must for different batch, subject same ok for lab course as batch will be scheduled + different subject also ok for a batch of different lab,   teacherId must be different, batchId must be different, break must be false

same day slot subject --> must be a lab, batchId must be present, roomId must be different, classId can be different (different classe's batch scheduled), teacherId must be different, break must be false

same day slot  batch --> not allowed. batch will be always in one place any given time.

any day, any slot, break true --> room NULL, subject NULL,  class not NULL, teacher ??, batch may or may not be NULL, 
*/
/* create views : ttId	day slotNo	roomId	classId	subjectId teacherId	batchId	isFixed snapshotId  */
CREATE VIEW timeTableReadable AS
SELECT tt.ttId, tt.day, tt.slotNo, r.roomShortName, c.classShortName, 
		s.subjectShortName, t.teacherShortName, b.batchName, tt.isFixed, sn.snapshotName
FROM  timeTable tt, room r, class c, subject s, teacher t, batch b, snapshot sn
WHERE tt.classId = c.classId AND
	tt.subjectId = s.subjectId AND
	tt.batchId = b.batchId AND 
	tt.batchId IS NOT null AND 
	tt.roomId = r.roomId AND
	tt.teacherId = t.teacherId AND
	tt.snapshotId = sn.snapshotId AND
	tt.isFixed = FALSE
UNION 
SELECT tt.ttId, tt.day, tt.slotNo, r.roomShortName, c.classShortName, 
			s.subjectShortName, t.teacherShortName, null, tt.isFixed, sn.snapshotName
FROM  timeTable tt, room r, class c, subject s, teacher t, snapshot sn
WHERE tt.classId = c.classId AND
	tt.subjectId = s.subjectId AND
	tt.roomId = r.roomId AND
	tt.teacherId = t.teacherId AND
	tt.batchId IS null AND
	tt.snapshotId = sn.snapshotId AND
	tt.isFixed = FALSE
UNION 
SELECT tt.ttId, tt.day, tt.slotNo, null, c.classShortName, 
			null, null, null, TRUE, sn.snapshotName
FROM  timeTable tt, class c, snapshot sn
WHERE tt.isFixed = TRUE AND
	  tt.classId = c.classId AND
	  tt.snapshotId = sn.snapshotId
ORDER by ttId;

CREATE TABLE fixedEntry (
feId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Fixed Entry Id',
ttId int NOT NULL COMMENT 'Timetable Entry Id',
fixedText	varchar(128) COMMENT 'Description',
snapshotId int COMMENT 'Snapshot Id for this fixedEntry',
FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,
FOREIGN KEY (ttId) REFERENCES timeTable(ttId) ON DELETE CASCADE,
CONSTRAINT c_fixedEntry UNIQUE(ttId, snapshotId)
);

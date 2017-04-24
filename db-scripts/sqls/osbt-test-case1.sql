drop database timeTable; create database timeTable; use timeTable;

CREATE TABLE `dept` (
  `deptId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Department Id',
  `deptName` varchar(128) NOT NULL COMMENT 'Department Name',
  `deptShortName` varchar(32) NOT NULL COMMENT 'Department Short Name',
  PRIMARY KEY (`deptId`),
  UNIQUE KEY `c_deptName` (`deptName`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;


INSERT INTO dept(deptId, deptName, deptShortName) VALUES 
("1","Computer Engineering and I.T.","CEIT"),
("2","Electronics and Telecommunication Engineering","ENTC"),
("3","Instrumentationn Engineering","INSTRU");




CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User Id',
  `userName` varchar(128) NOT NULL COMMENT 'User''s Full Name',
  `password` varchar(128) NOT NULL COMMENT 'User''s Passsword',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `c_userName` (`userName`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


INSERT INTO user(userId, userName, password) VALUES 
("1","abhijit","abhijit");




CREATE TABLE `config` (
  `configId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Configuration Id',
  `configName` varchar(128) NOT NULL COMMENT 'Configuration Name',
  `dayBegin` time DEFAULT NULL COMMENT 'Day Begins at Time',
  `slotDuration` int(11) DEFAULT NULL COMMENT 'Duration of each slot in seconds',
  `nSlots` int(11) DEFAULT NULL COMMENT 'No of slots in a day',
  `deptId` int(11) DEFAULT NULL COMMENT 'Department of this config',
  `incharge` int(11) DEFAULT NULL COMMENT 'Incharge user of this config',
  PRIMARY KEY (`configId`),
  KEY `incharge` (`incharge`),
  CONSTRAINT `config_ibfk_1` FOREIGN KEY (`incharge`) REFERENCES `user` (`userId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;


INSERT INTO config(configId, configName, dayBegin, slotDuration, nSlots, deptId, incharge) VALUES 
("1","defaultConfig","08:00:00","3600","11","1","1");




CREATE TABLE `snapshot` (
  `snapshotId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Snapshot Id',
  `snapshotName` varchar(128) DEFAULT NULL COMMENT 'Name of the Snapshot',
  `snapshotCreator` int(11) DEFAULT NULL COMMENT 'User who created this snapshot',
  `createTime` time DEFAULT NULL COMMENT 'Time of creation of this snapshot',
  `modifyTime` time DEFAULT NULL COMMENT 'Time of modification of this snapshot',
  `configId` int(11) DEFAULT NULL COMMENT 'Configuration Id for this snapshot',
  PRIMARY KEY (`snapshotId`),
  UNIQUE KEY `c_snapshotName` (`snapshotName`),
  KEY `snapshotCreator` (`snapshotCreator`),
  KEY `configId` (`configId`),
  CONSTRAINT `snapshot_ibfk_1` FOREIGN KEY (`snapshotCreator`) REFERENCES `user` (`userId`) ON DELETE CASCADE,
  CONSTRAINT `snapshot_ibfk_2` FOREIGN KEY (`configId`) REFERENCES `config` (`configId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


INSERT INTO snapshot(snapshotId, snapshotName, snapshotCreator, createTime, modifyTime, configId) VALUES 
("1","default","1","08:00:00","08:00:00","1"),
("2","one","1","00:10:00","00:20:00","1");




CREATE TABLE `teacher` (
  `teacherId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Teacher Id',
  `teacherName` varchar(256) NOT NULL COMMENT 'Teacher''s Full Name',
  `teacherShortName` varchar(16) NOT NULL COMMENT 'Teacher''s Short Name',
  `minHrs` int(11) DEFAULT NULL COMMENT 'Min Hrs of Work for Teacher',
  `maxHrs` int(11) DEFAULT NULL COMMENT 'Max hrs of work for Teacher',
  `deptId` int(11) DEFAULT NULL COMMENT 'Department of the Teacher',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Teacher',
  PRIMARY KEY (`teacherId`),
  UNIQUE KEY `c_teacherShortName` (`teacherShortName`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  CONSTRAINT `teacher_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;


INSERT INTO teacher(teacherId, teacherName, teacherShortName, minHrs, maxHrs, deptId, snapshotId) VALUES 
("1","V. K. Khatavkar","Vaibhav","10","24","1","1"),
("2","S. S. Kumbhar","Kumbhar","10","24","1","1"),
("3","Sheetal Rathod","Sheetal","16","24","1","1"),
("4","A. Biswas","Aparna","16","24","1","1"),
("5","V. K. Khatavkar","Vaibhav","10","24","1","2"),
("6","S. S. Kumbhar","Kumbhar","10","24","1","2"),
("7","Sheetal Rathod","Sheetal","16","24","1","2"),
("8","A. Biswas","Aparna","16","24","1","2");




CREATE TABLE `class` (
  `classId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Class Id',
  `className` varchar(256) NOT NULL COMMENT 'Class''s Full Name',
  `classShortName` varchar(32) NOT NULL COMMENT 'Class''s Short Name',
  `semester` int(11) NOT NULL COMMENT 'Current Semester No',
  `classCount` int(11) NOT NULL COMMENT 'No. of Students in Class',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Class',
  PRIMARY KEY (`classId`),
  UNIQUE KEY `c_classShortName` (`classShortName`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;


INSERT INTO class(classId, className, classShortName, semester, classCount, snapshotId) VALUES 
("1","S.Y. B.Tech. Computer Engineering","SYBT-CE","4","80","1"),
("2","sy IT ","SYBT-IT","4","80","1"),
("3","S.Y. B.Tech. Computer Engineering","SYBT-CE","4","80","2"),
("4","sy IT ","SYBT-IT","4","80","2");




CREATE TABLE `batch` (
  `batchId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Batch Id',
  `batchName` varchar(32) NOT NULL COMMENT 'Batch Name',
  `batchCount` int(11) DEFAULT NULL COMMENT 'No. of Students in Batch',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Batch',
  PRIMARY KEY (`batchId`),
  UNIQUE KEY `c_batchName` (`batchName`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  CONSTRAINT `batch_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


INSERT INTO batch(batchId, batchName, batchCount, snapshotId) VALUES 
("1","syc-1","22","1"),
("2","syc-2","22","1"),
("3","syc-1","22","2"),
("4","syc-2","22","2"),
("5","syit-1","20","1"),
("6","syit-2","20","1");




CREATE TABLE `subject` (
  `subjectId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Subject Id',
  `subjectName` varchar(64) NOT NULL COMMENT 'Subject Full Name',
  `subjectShortName` varchar(16) NOT NULL COMMENT 'Subject Short Name',
  `eachSlot` int(11) DEFAULT NULL COMMENT 'No. of Slots for Each Entry',
  `nSlots` int(11) DEFAULT NULL COMMENT 'Total No. of Entries for this Subjeect',
  `batches` tinyint(1) DEFAULT NULL COMMENT 'Schedule in Batches?',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Subject',
  PRIMARY KEY (`subjectId`),
  UNIQUE KEY `c_subjectShortName` (`subjectShortName`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  CONSTRAINT `subject_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;


INSERT INTO subject(subjectId, subjectName, subjectShortName, eachSlot, nSlots, batches, snapshotId) VALUES 
("1","Principles of Programming language","PPL","1","3","0","1"),
("2","Data Communication","DC","1","3","0","1"),
("3","Microprocessor techniques lab","MPT-Lab","3","1","1","1"),
("4","Principles of Programming language lab","PPL-Lab","3","1","1","1"),
("5","Principles of Programming language","PPL","1","3","0","2"),
("6","Data Communication","DC","1","3","0","2"),
("7","Microprocessor techniques lab","MPT-Lab","3","1","1","2"),
("8","Principles of Programming language lab","PPL-Lab","3","1","1","2");




CREATE TABLE `batchCanOverlap` (
  `boId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'BatchOverlap Id',
  `batchId` int(11) NOT NULL COMMENT 'Batch Id',
  `batchOverlapId` int(11) NOT NULL COMMENT 'Batch Which Can Overlap',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this BO',
  PRIMARY KEY (`boId`),
  UNIQUE KEY `c_overlaps` (`batchId`,`batchOverlapId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `batchOverlapId` (`batchOverlapId`),
  CONSTRAINT `batchCanOverlap_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  CONSTRAINT `batchCanOverlap_ibfk_2` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  CONSTRAINT `batchCanOverlap_ibfk_3` FOREIGN KEY (`batchOverlapId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;


INSERT INTO batchCanOverlap(boId, batchId, batchOverlapId, snapshotId) VALUES 
("1","1","2","1"),
("2","2","1","1"),
("3","3","4","2"),
("4","4","3","2");




CREATE TABLE `batchClass` (
  `bcId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Batch Class Id',
  `batchId` int(11) NOT NULL COMMENT 'Batch Id',
  `classId` int(11) NOT NULL COMMENT 'Class Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this batchClass',
  PRIMARY KEY (`bcId`),
  UNIQUE KEY `c_batchClass` (`batchId`,`classId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `classId` (`classId`),
  CONSTRAINT `batchClass_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  CONSTRAINT `batchClass_ibfk_2` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  CONSTRAINT `batchClass_ibfk_3` FOREIGN KEY (`classId`) REFERENCES `class` (`classId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


INSERT INTO batchClass(bcId, batchId, classId, snapshotId) VALUES 
("1","1","1","1"),
("2","2","1","1"),
("3","3","3","2"),
("4","4","3","2"),
("5","5","2","1"),
("6","6","2","1");




CREATE TABLE `room` (
  `roomId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Room Id',
  `roomName` varchar(32) NOT NULL COMMENT 'Room Name',
  `roomShortName` varchar(16) NOT NULL COMMENT 'Room Short Name',
  `roomCount` int(11) DEFAULT NULL COMMENT 'Capacity of Room',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Room',
  PRIMARY KEY (`roomId`),
  UNIQUE KEY `c_roomShortName` (`roomShortName`,`snapshotId`),
  UNIQUE KEY `c_roomName` (`roomName`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  CONSTRAINT `room_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;


INSERT INTO room(roomId, roomName, roomShortName, roomCount, snapshotId) VALUES 
("1","AC-202","AC-202","100","1"),
("2","AC-203","AC-203","100","1"),
("3","FOSS Lab-1","FOSS1","25","1"),
("4","AC-202","AC-202","100","2"),
("5","AC-203","AC-203","100","2"),
("6","FOSS Lab-1","FOSS1","25","2");




CREATE TABLE `classRoom` (
  `crId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Class Room Mapping Id',
  `classId` int(11) NOT NULL COMMENT 'Class Id',
  `roomId` int(11) NOT NULL COMMENT 'Room Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Class-Room',
  PRIMARY KEY (`crId`),
  UNIQUE KEY `c_classRoom` (`classId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `roomId` (`roomId`),
  CONSTRAINT `classRoom_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  CONSTRAINT `classRoom_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `class` (`classId`) ON DELETE CASCADE,
  CONSTRAINT `classRoom_ibfk_3` FOREIGN KEY (`roomId`) REFERENCES `room` (`roomId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


INSERT INTO classRoom(crId, classId, roomId, snapshotId) VALUES 
("1","1","2","1"),
("2","3","5","2");




CREATE TABLE `batchRoom` (
  `brId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Batch Room Mapping Id',
  `batchId` int(11) NOT NULL COMMENT 'Batch Id',
  `roomId` int(11) NOT NULL COMMENT 'Room Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Batch-Room',
  PRIMARY KEY (`brId`),
  UNIQUE KEY `c_batchRoom` (`batchId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `roomId` (`roomId`),
  CONSTRAINT `batchRoom_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  CONSTRAINT `batchRoom_ibfk_2` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  CONSTRAINT `batchRoom_ibfk_3` FOREIGN KEY (`roomId`) REFERENCES `room` (`roomId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


INSERT INTO batchRoom(brId, batchId, roomId, snapshotId) VALUES 
("1","1","3","1"),
("2","3","6","2");




CREATE TABLE `subjectRoom` (
  `srId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Subject Room Preference Id',
  `subjectId` int(11) NOT NULL COMMENT 'Subject Id',
  `roomId` int(11) NOT NULL COMMENT 'Room Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Subject-Room',
  PRIMARY KEY (`srId`),
  UNIQUE KEY `c_subjectRoom` (`subjectId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `roomId` (`roomId`),
  CONSTRAINT `subjectRoom_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  CONSTRAINT `subjectRoom_ibfk_2` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`subjectId`) ON DELETE CASCADE,
  CONSTRAINT `subjectRoom_ibfk_3` FOREIGN KEY (`roomId`) REFERENCES `room` (`roomId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;


INSERT INTO subjectRoom(srId, subjectId, roomId, snapshotId) VALUES 
("1","1","1","1"),
("2","2","2","1"),
("3","5","4","2"),
("4","6","5","2");




CREATE TABLE `subjectBatchTeacher` (
  `sbtId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'SBT Id',
  `subjectId` int(11) NOT NULL COMMENT 'Subject Id',
  `batchId` int(11) NOT NULL COMMENT 'Batch Id',
  `teacherId` int(11) DEFAULT NULL COMMENT 'Teacher Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this SBT',
  PRIMARY KEY (`sbtId`),
  UNIQUE KEY `c_subjectBatchTeacheer` (`subjectId`,`batchId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `batchId` (`batchId`),
  KEY `teacherId` (`teacherId`),
  CONSTRAINT `subjectBatchTeacher_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  CONSTRAINT `subjectBatchTeacher_ibfk_2` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  CONSTRAINT `subjectBatchTeacher_ibfk_3` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`subjectId`) ON DELETE CASCADE,
  CONSTRAINT `subjectBatchTeacher_ibfk_4` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`teacherId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;


INSERT INTO subjectBatchTeacher(sbtId, subjectId, batchId, teacherId, snapshotId) VALUES 
("1","3","1","2","1"),
("2","4","1","3","1"),
("3","3","2","4","1"),
("4","4","2","3","1"),
("5","7","3","6","2"),
("6","8","3","7","2"),
("7","7","4","8","2"),
("8","8","4","7","2"),
("9","3","5","2","1");




CREATE TABLE `subjectClassTeacher` (
  `sctId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Subject Class Teacher Mapping Id',
  `subjectId` int(11) NOT NULL COMMENT 'Subject Id',
  `classId` int(11) NOT NULL COMMENT 'Class Id',
  `teacherId` int(11) DEFAULT NULL COMMENT 'Teacher Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this SCT',
  PRIMARY KEY (`sctId`),
  UNIQUE KEY `c_subjectClassTeacheer` (`subjectId`,`classId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `classId` (`classId`),
  KEY `teacherId` (`teacherId`),
  CONSTRAINT `subjectClassTeacher_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  CONSTRAINT `subjectClassTeacher_ibfk_2` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`subjectId`) ON DELETE CASCADE,
  CONSTRAINT `subjectClassTeacher_ibfk_3` FOREIGN KEY (`classId`) REFERENCES `class` (`classId`) ON DELETE CASCADE,
  CONSTRAINT `subjectClassTeacher_ibfk_4` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`teacherId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;


INSERT INTO subjectClassTeacher(sctId, subjectId, classId, teacherId, snapshotId) VALUES 
("1","1","1","1","1"),
("2","2","1","4","1"),
("3","1","2","1","1"),
("4","5","3","5","2"),
("5","6","3","8","2"),
("6","5","4","5","2"),
("8","2","2","4","1");




CREATE TABLE `overlappingSBT` (
  `osbtId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id: Subject-Batch Pairs that must overlap',
  `sbtId1` int(11) NOT NULL COMMENT 'Sub-Batch Id 1',
  `sbtId2` int(11) NOT NULL COMMENT 'Sub-Batch Id 2',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this OSBT',
  PRIMARY KEY (`osbtId`),
  UNIQUE KEY `c_overlappingSBT` (`sbtId1`,`sbtId2`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `sbtId2` (`sbtId2`),
  CONSTRAINT `overlappingSBT_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  CONSTRAINT `overlappingSBT_ibfk_2` FOREIGN KEY (`sbtId1`) REFERENCES `subjectBatchTeacher` (`sbtId`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `overlappingSBT_ibfk_3` FOREIGN KEY (`sbtId2`) REFERENCES `subjectBatchTeacher` (`sbtId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;


INSERT INTO overlappingSBT(osbtId, sbtId1, sbtId2, snapshotId) VALUES 
("9","1","9","1"),
("8","2","4","1");




CREATE TABLE `timeTable` (
  `ttId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'TimeTable Id',
  `day` smallint(6) DEFAULT NULL COMMENT 'Day of Week',
  `slotNo` int(11) DEFAULT NULL COMMENT 'Slot No.',
  `roomId` int(11) DEFAULT NULL COMMENT 'Room Id',
  `classId` int(11) DEFAULT NULL COMMENT 'Class Id',
  `subjectId` int(11) DEFAULT NULL COMMENT 'Subject Id',
  `teacherId` int(11) DEFAULT NULL COMMENT 'Teacher Id',
  `batchId` int(11) DEFAULT NULL COMMENT 'Batch Id',
  `isFixed` tinyint(1) DEFAULT NULL COMMENT 'Is Lunch/Fixed Slot?',
  `snapshotId` int(11) NOT NULL COMMENT 'Snapshot Id',
  PRIMARY KEY (`ttId`),
  KEY `roomId` (`roomId`),
  KEY `classId` (`classId`),
  KEY `batchId` (`batchId`),
  KEY `subjectId` (`subjectId`),
  KEY `teacherId` (`teacherId`),
  KEY `snapshotId` (`snapshotId`),
  CONSTRAINT `timeTable_ibfk_1` FOREIGN KEY (`roomId`) REFERENCES `room` (`roomId`) ON DELETE CASCADE,
  CONSTRAINT `timeTable_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `class` (`classId`) ON DELETE CASCADE,
  CONSTRAINT `timeTable_ibfk_3` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  CONSTRAINT `timeTable_ibfk_4` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`subjectId`) ON DELETE CASCADE,
  CONSTRAINT `timeTable_ibfk_5` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`teacherId`) ON DELETE CASCADE,
  CONSTRAINT `timeTable_ibfk_6` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8;


INSERT INTO timeTable(ttId, day, slotNo, roomId, classId, subjectId, teacherId, batchId, isFixed, snapshotId) VALUES 
("92","1","0","5","3","5","5",NULL,"0","2"),
("93","1","1","5","3","5","5",NULL,"0","2"),
("94","1","2","5","3","5","5",NULL,"0","2"),
("95","1","3","5","3","6","8",NULL,"0","2"),
("96","1","4","5","3","6","8",NULL,"0","2"),
("97","1","5","5","3","6","8",NULL,"0","2"),
("98","1","6","4","3","7","8","4","0","2"),
("99","1","7","4","3","7","8","4","0","2"),
("100","1","8","4","3","7","8","4","0","2"),
("101","2","6","4","3","8","7","4","0","2"),
("102","2","7","4","3","8","7","4","0","2"),
("103","2","8","4","3","8","7","4","0","2"),
("122","1","0","2","1","1","1",NULL,"0","1"),
("123","1","1","2","1","1","1",NULL,"0","1"),
("124","1","2","2","1","1","1",NULL,"0","1"),
("125","1","3","2","1","2","4",NULL,"0","1"),
("126","1","4","2","1","2","4",NULL,"0","1"),
("127","1","5","2","1","2","4",NULL,"0","1"),
("128","2","0","3","1","4","3","1","0","1"),
("129","2","1","3","1","4","3","1","0","1"),
("130","2","2","3","1","4","3","1","0","1"),
("131","2","0","3","1","4","3","2","0","1"),
("132","2","1","3","1","4","3","2","0","1"),
("133","2","2","3","1","4","3","2","0","1");




CREATE TABLE `fixedEntry` (
  `feId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Fixed Entry Id',
  `ttId` int(11) NOT NULL COMMENT 'Timetable Entry Id',
  `fixedText` varchar(128) DEFAULT NULL COMMENT 'Description',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this fixedEntry',
  PRIMARY KEY (`feId`),
  UNIQUE KEY `c_fixedEntry` (`ttId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  CONSTRAINT `fixedEntry_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  CONSTRAINT `fixedEntry_ibfk_2` FOREIGN KEY (`ttId`) REFERENCES `timeTable` (`ttId`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;






CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `teacherReadable` AS select `t`.`teacherId` AS `teacherId`,`t`.`teacherName` AS `teacherName`,`t`.`teacherShortName` AS `teacherShortName`,`t`.`minHrs` AS `minHrs`,`t`.`maxHrs` AS `maxHrs`,`d`.`deptShortName` AS `deptShortName`,`s`.`snapshotName` AS `snapshotName` from ((`teacher` `t` join `dept` `d`) join `snapshot` `s`) where ((`t`.`deptId` = `d`.`deptId`) and (`t`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`t`.`teacherShortName`;



CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `batchCanOverlapReadable` AS select `bo`.`boId` AS `boId`,`b`.`batchName` AS `b1Name`,`b1`.`batchName` AS `b2Name`,`s`.`snapshotName` AS `snapShotName` from (((`batch` `b` join `batch` `b1`) join `batchCanOverlap` `bo`) join `snapshot` `s`) where ((`b`.`batchId` = `bo`.`batchId`) and (`b1`.`batchId` = `bo`.`batchOverlapId`) and (`bo`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`b`.`batchName`,`b1`.`batchName`;



CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `subjectClassTeacherReadable` AS select `sct`.`sctId` AS `sctId`,`c`.`classShortName` AS `classShortName`,`s`.`subjectShortName` AS `subjectShortName`,`t`.`teacherShortName` AS `teacherShortName`,`ss`.`snapshotName` AS `snapshotName` from ((((`subject` `s` join `class` `c`) join `teacher` `t`) join `subjectClassTeacher` `sct`) join `snapshot` `ss`) where ((`s`.`subjectId` = `sct`.`subjectId`) and (`t`.`teacherId` = `sct`.`teacherId`) and (`c`.`classId` = `sct`.`classId`) and (`sct`.`snapshotId` = `ss`.`snapshotId`)) order by `ss`.`snapshotName`,`s`.`subjectShortName`,`c`.`classShortName`,`t`.`teacherShortName`;



CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `subjectBatchTeacherReadable` AS select `sbt`.`sbtId` AS `sbtId`,`s`.`subjectShortName` AS `subjectShortName`,`b`.`batchName` AS `batchName`,`t`.`teacherShortName` AS `teacherShortName`,`ss`.`snapshotName` AS `snapshotName` from ((((`subject` `s` join `batch` `b`) join `subjectBatchTeacher` `sbt`) join `teacher` `t`) join `snapshot` `ss`) where ((`sbt`.`subjectId` = `s`.`subjectId`) and (`sbt`.`batchId` = `b`.`batchId`) and (`sbt`.`teacherId` = `t`.`teacherId`) and (`sbt`.`snapshotId` = `ss`.`snapshotId`)) order by `ss`.`snapshotName`,`s`.`subjectShortName`,`b`.`batchName`,`t`.`teacherShortName`;



CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `batchClassReadable` AS select `bc`.`bcId` AS `bcId`,`b`.`batchName` AS `batchName`,`c`.`classShortName` AS `classShortName`,`s`.`snapshotName` AS `snapshotName` from (((`batch` `b` join `class` `c`) join `batchClass` `bc`) join `snapshot` `s`) where ((`b`.`batchId` = `bc`.`batchId`) and (`c`.`classId` = `bc`.`classId`) and (`bc`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`c`.`classShortName`,`b`.`batchName`;



CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `overlappingSBTReadable` AS select `sbto`.`osbtId` AS `osbtId`,`s1`.`subjectShortName` AS `subject1`,`b1`.`batchName` AS `batch1`,`t1`.`teacherShortName` AS `teacher1`,`s2`.`subjectShortName` AS `subject2`,`b2`.`batchName` AS `batch2`,`t2`.`teacherShortName` AS `teacher2`,`ss`.`snapshotName` AS `snapshotName` from (((((((((`subject` `s1` join `subject` `s2`) join `batch` `b1`) join `batch` `b2`) join `teacher` `t1`) join `teacher` `t2`) join `overlappingSBT` `sbto`) join `subjectBatchTeacher` `sbt1`) join `subjectBatchTeacher` `sbt2`) join `snapshot` `ss`) where ((`sbto`.`sbtId1` = `sbt1`.`sbtId`) and (`sbto`.`sbtId2` = `sbt2`.`sbtId`) and (`sbt1`.`subjectId` = `s1`.`subjectId`) and (`sbt1`.`batchId` = `b1`.`batchId`) and (`sbt1`.`teacherId` = `t1`.`teacherId`) and (`sbt2`.`subjectId` = `s2`.`subjectId`) and (`sbt2`.`batchId` = `b2`.`batchId`) and (`sbt2`.`teacherId` = `t2`.`teacherId`) and (`sbto`.`snapshotId` = `ss`.`snapshotId`)) order by `ss`.`snapshotName`,`s1`.`subjectShortName`,`s2`.`subjectShortName`;



CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `timeTableReadable` AS select `tt`.`ttId` AS `ttId`,`tt`.`day` AS `day`,`tt`.`slotNo` AS `slotNo`,`r`.`roomShortName` AS `roomShortName`,`c`.`classShortName` AS `classShortName`,`s`.`subjectShortName` AS `subjectShortName`,`t`.`teacherShortName` AS `teacherShortName`,`b`.`batchName` AS `batchName`,`tt`.`isFixed` AS `isFixed`,`sn`.`snapshotName` AS `snapshotName` from ((((((`timeTable` `tt` join `room` `r`) join `class` `c`) join `subject` `s`) join `teacher` `t`) join `batch` `b`) join `snapshot` `sn`) where ((`tt`.`classId` = `c`.`classId`) and (`tt`.`subjectId` = `s`.`subjectId`) and (`tt`.`batchId` = `b`.`batchId`) and (`tt`.`batchId` is not null) and (`tt`.`roomId` = `r`.`roomId`) and (`tt`.`teacherId` = `t`.`teacherId`) and (`tt`.`snapshotId` = `sn`.`snapshotId`) and (`tt`.`isFixed` = FALSE)) union select `tt`.`ttId` AS `ttId`,`tt`.`day` AS `day`,`tt`.`slotNo` AS `slotNo`,`r`.`roomShortName` AS `roomShortName`,`c`.`classShortName` AS `classShortName`,`s`.`subjectShortName` AS `subjectShortName`,`t`.`teacherShortName` AS `teacherShortName`,NULL AS `NULL`,`tt`.`isFixed` AS `isFixed`,`sn`.`snapshotName` AS `snapshotName` from (((((`timeTable` `tt` join `room` `r`) join `class` `c`) join `subject` `s`) join `teacher` `t`) join `snapshot` `sn`) where ((`tt`.`classId` = `c`.`classId`) and (`tt`.`subjectId` = `s`.`subjectId`) and (`tt`.`roomId` = `r`.`roomId`) and (`tt`.`teacherId` = `t`.`teacherId`) and isnull(`tt`.`batchId`) and (`tt`.`snapshotId` = `sn`.`snapshotId`) and (`tt`.`isFixed` = FALSE)) union select `tt`.`ttId` AS `ttId`,`tt`.`day` AS `day`,`tt`.`slotNo` AS `slotNo`,NULL AS `NULL`,`c`.`classShortName` AS `classShortName`,NULL AS `NULL`,NULL AS `NULL`,NULL AS `NULL`,TRUE AS `TRUE`,`sn`.`snapshotName` AS `snapshotName` from ((`timeTable` `tt` join `class` `c`) join `snapshot` `sn`) where ((`tt`.`isFixed` = TRUE) and (`tt`.`classId` = `c`.`classId`) and (`tt`.`snapshotId` = `sn`.`snapshotId`)) order by `ttId`;



CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `classRoomReadable` AS select `cr`.`crId` AS `crId`,`c`.`classShortName` AS `classShortName`,`r`.`roomShortName` AS `roomShortName`,`s`.`snapshotName` AS `snapshotName` from (((`class` `c` join `room` `r`) join `classRoom` `cr`) join `snapshot` `s`) where ((`c`.`classId` = `cr`.`classId`) and (`r`.`roomId` = `cr`.`roomId`) and (`cr`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`c`.`classShortName`,`r`.`roomShortName`;



CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `batchRoomReadable` AS select `br`.`brId` AS `brId`,`b`.`batchName` AS `batchName`,`r`.`roomShortName` AS `roomShortName`,`s`.`snapshotName` AS `snapshotName` from (((`batch` `b` join `room` `r`) join `batchRoom` `br`) join `snapshot` `s`) where ((`b`.`batchId` = `br`.`batchId`) and (`r`.`roomId` = `br`.`roomId`) and (`br`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`b`.`batchName`,`r`.`roomShortName`;



CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `subjectRoomReadable` AS select `sr`.`srId` AS `srId`,`s`.`subjectShortName` AS `subjectShortName`,`r`.`roomShortName` AS `roomShortName`,`ss`.`snapshotName` AS `snapshotName` from (((`subject` `s` join `room` `r`) join `subjectRoom` `sr`) join `snapshot` `ss`) where ((`s`.`subjectId` = `sr`.`subjectId`) and (`r`.`roomId` = `sr`.`roomId`) and (`r`.`snapshotId` = `ss`.`snapshotId`)) order by `ss`.`snapshotName`,`s`.`subjectShortName`,`r`.`roomShortName`;


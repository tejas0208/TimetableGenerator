-- phpMyAdmin SQL Dump
-- version 4.6.5.2deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 17, 2017 at 09:32 PM
-- Server version: 5.7.17-1
-- PHP Version: 7.0.14-2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `timeTable`
--

-- --------------------------------------------------------

--
-- Table structure for table `batch`
--

CREATE TABLE `batch` (
  `batchId` int(11) NOT NULL COMMENT 'Batch Id',
  `batchName` varchar(32) NOT NULL COMMENT 'Batch Name',
  `batchCount` int(11) DEFAULT NULL COMMENT 'No. of Students in Batch',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Batch'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `batch`
--

INSERT INTO `batch` (`batchId`, `batchName`, `batchCount`, `snapshotId`) VALUES
(1, 'SYBT-CE-S1', 22, 1),
(2, 'SYBT-CE-S2', 22, 1),
(4, 'SYBT-CE-S3', 22, 1);

-- --------------------------------------------------------

--
-- Table structure for table `batchCanOverlap`
--

CREATE TABLE `batchCanOverlap` (
  `boId` int(11) NOT NULL COMMENT 'BatchOverlap Id',
  `batchId` int(11) NOT NULL COMMENT 'Batch Id',
  `batchOverlapId` int(11) NOT NULL COMMENT 'Batch Which Can Overlap',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this BO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `batchCanOverlap`
--

INSERT INTO `batchCanOverlap` (`boId`, `batchId`, `batchOverlapId`, `snapshotId`) VALUES
(1, 1, 2, 1),
(2, 2, 1, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `batchCanOverlapReadable`
-- (See below for the actual view)
--
CREATE TABLE `batchCanOverlapReadable` (
`boId` int(11)
,`b1Name` varchar(32)
,`b2Name` varchar(32)
,`snapShotName` varchar(128)
);

-- --------------------------------------------------------

--
-- Table structure for table `batchClass`
--

CREATE TABLE `batchClass` (
  `bcId` int(11) NOT NULL COMMENT 'Batch Class Id',
  `batchId` int(11) NOT NULL COMMENT 'Batch Id',
  `classId` int(11) NOT NULL COMMENT 'Class Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this batchClass'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `batchClass`
--

INSERT INTO `batchClass` (`bcId`, `batchId`, `classId`, `snapshotId`) VALUES
(1, 1, 1, 1),
(2, 2, 1, 1),
(3, 4, 1, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `batchClassReadable`
-- (See below for the actual view)
--
CREATE TABLE `batchClassReadable` (
`bcId` int(11)
,`batchName` varchar(32)
,`classShortName` varchar(32)
,`snapshotName` varchar(128)
);

-- --------------------------------------------------------

--
-- Table structure for table `batchRoom`
--

CREATE TABLE `batchRoom` (
  `brId` int(11) NOT NULL COMMENT 'Batch Room Mapping Id',
  `batchId` int(11) NOT NULL COMMENT 'Batch Id',
  `roomId` int(11) NOT NULL COMMENT 'Room Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Batch-Room'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `batchRoom`
--

INSERT INTO `batchRoom` (`brId`, `batchId`, `roomId`, `snapshotId`) VALUES
(1, 1, 3, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `batchRoomReadable`
-- (See below for the actual view)
--
CREATE TABLE `batchRoomReadable` (
`brId` int(11)
,`batchName` varchar(32)
,`roomShortName` varchar(16)
,`snapshotName` varchar(128)
);

-- --------------------------------------------------------

--
-- Table structure for table `capability`
--

CREATE TABLE `capability` (
  `capId` int(11) NOT NULL COMMENT 'Capability Id',
  `capName` varchar(128) NOT NULL COMMENT 'Capability Name',
  `roleId` int(11) DEFAULT NULL COMMENT 'Role Id'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE `class` (
  `classId` int(11) NOT NULL COMMENT 'Class Id',
  `className` varchar(256) NOT NULL COMMENT 'Class''s Full Name',
  `classShortName` varchar(32) NOT NULL COMMENT 'Class''s Short Name',
  `semester` int(11) NOT NULL COMMENT 'Current Semester No',
  `classCount` int(11) NOT NULL COMMENT 'No. of Students in Class',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Class'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`classId`, `className`, `classShortName`, `semester`, `classCount`, `snapshotId`) VALUES
(1, 'S.Y. B.Tech. Computer Engineering', 'SYBT-CE', 4, 80, 1),
(2, 'SY Info Tech', 'SYIT', 4, 90, 1);

-- --------------------------------------------------------

--
-- Table structure for table `classRoom`
--

CREATE TABLE `classRoom` (
  `crId` int(11) NOT NULL COMMENT 'Class Room Mapping Id',
  `classId` int(11) NOT NULL COMMENT 'Class Id',
  `roomId` int(11) NOT NULL COMMENT 'Room Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Class-Room'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `classRoom`
--

INSERT INTO `classRoom` (`crId`, `classId`, `roomId`, `snapshotId`) VALUES
(1, 1, 2, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `classRoomReadable`
-- (See below for the actual view)
--
CREATE TABLE `classRoomReadable` (
`crId` int(11)
,`classShortName` varchar(32)
,`roomShortName` varchar(16)
,`snapshotName` varchar(128)
);

-- --------------------------------------------------------

--
-- Table structure for table `config`
--

CREATE TABLE `config` (
  `configId` int(11) NOT NULL COMMENT 'Configuration Id',
  `configName` varchar(128) NOT NULL COMMENT 'Configuration Name',
  `dayBegin` time DEFAULT NULL COMMENT 'Day Begins at Time',
  `slotDuration` int(11) DEFAULT NULL COMMENT 'Duration of each slot in seconds',
  `nSlots` int(11) DEFAULT NULL COMMENT 'No of slots in a day',
  `deptId` int(11) DEFAULT NULL COMMENT 'Department of this config',
  `incharge` int(11) DEFAULT NULL COMMENT 'Incharge user of this config'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `config`
--

INSERT INTO `config` (`configId`, `configName`, `dayBegin`, `slotDuration`, `nSlots`, `deptId`, `incharge`) VALUES
(1, 'defaultConfig', '08:00:00', 3600, 11, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `dept`
--

CREATE TABLE `dept` (
  `deptId` int(11) NOT NULL COMMENT 'Department Id',
  `deptName` varchar(128) NOT NULL COMMENT 'Department Name',
  `deptShortName` varchar(32) NOT NULL COMMENT 'Department Short Name'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `dept`
--

INSERT INTO `dept` (`deptId`, `deptName`, `deptShortName`) VALUES
(1, 'Computer Engineering and I.T.', 'CEIT'),
(2, 'Electronics and Telecommunication Engineering', 'ENTC'),
(3, 'Instrumentationn Engineering', 'INSTRU');

-- --------------------------------------------------------

--
-- Table structure for table `dump`
--

CREATE TABLE `dump` (
  `tid` int(11) DEFAULT NULL,
  `day` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `fixedEntry`
--

CREATE TABLE `fixedEntry` (
  `feId` int(11) NOT NULL COMMENT 'Fixed Entry Id',
  `ttId` int(11) NOT NULL COMMENT 'Timetable Entry Id',
  `fixedText` varchar(128) DEFAULT NULL COMMENT 'Description',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this fixedEntry'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `overlappingSBT`
--

CREATE TABLE `overlappingSBT` (
  `osbtId` int(11) NOT NULL COMMENT 'Id: Subject-Batch Pairs that must overlap',
  `sbtId1` int(11) NOT NULL COMMENT 'Sub-Batch Id 1',
  `sbtId2` int(11) NOT NULL COMMENT 'Sub-Batch Id 2',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this OSBT'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Stand-in structure for view `overlappingSBTReadable`
-- (See below for the actual view)
--
CREATE TABLE `overlappingSBTReadable` (
`osbtId` int(11)
,`subject1` varchar(16)
,`batch1` varchar(32)
,`teacher1` varchar(16)
,`subject2` varchar(16)
,`batch2` varchar(32)
,`teacher2` varchar(16)
,`snapshotName` varchar(128)
);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `roleId` int(11) NOT NULL COMMENT 'Role Id',
  `roleName` varchar(128) NOT NULL COMMENT 'Name of the Role'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE `room` (
  `roomId` int(11) NOT NULL COMMENT 'Room Id',
  `roomName` varchar(32) NOT NULL COMMENT 'Room Name',
  `roomShortName` varchar(16) NOT NULL COMMENT 'Room Short Name',
  `roomCount` int(11) DEFAULT NULL COMMENT 'Capacity of Room',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Room'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`roomId`, `roomName`, `roomShortName`, `roomCount`, `snapshotId`) VALUES
(1, 'AC-202', 'AC-202', 100, 1),
(2, 'AC-203', 'AC-203', 100, 1),
(3, 'FOSS Lab-1', 'FOSS1', 25, 1);

-- --------------------------------------------------------

--
-- Table structure for table `slots`
--

CREATE TABLE `slots` (
  `slotNo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `snapshot`
--

CREATE TABLE `snapshot` (
  `snapshotId` int(11) NOT NULL COMMENT 'Snapshot Id',
  `snapshotName` varchar(128) DEFAULT NULL COMMENT 'Name of the Snapshot',
  `snapshotCreator` int(11) DEFAULT NULL COMMENT 'User who created this snapshot',
  `createTime` time DEFAULT NULL COMMENT 'Time of creation of this snapshot',
  `modifyTime` time DEFAULT NULL COMMENT 'Time of modification of this snapshot',
  `configId` int(11) DEFAULT NULL COMMENT 'Configuration Id for this snapshot'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `snapshot`
--

INSERT INTO `snapshot` (`snapshotId`, `snapshotName`, `snapshotCreator`, `createTime`, `modifyTime`, `configId`) VALUES
(1, 'default', 1, '08:00:00', '08:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `subjectId` int(11) NOT NULL COMMENT 'Subject Id',
  `subjectName` varchar(64) NOT NULL COMMENT 'Subject Full Name',
  `subjectShortName` varchar(16) NOT NULL COMMENT 'Subject Short Name',
  `eachSlot` int(11) DEFAULT NULL COMMENT 'No. of Slots for Each Entry',
  `nSlots` int(11) DEFAULT NULL COMMENT 'Total No. of Entries for this Subjeect',
  `batches` tinyint(1) DEFAULT NULL COMMENT 'Schedule in Batches?',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Subject'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`subjectId`, `subjectName`, `subjectShortName`, `eachSlot`, `nSlots`, `batches`, `snapshotId`) VALUES
(1, 'Principles of Programming language', 'PPL', 1, 3, 0, 1),
(2, 'Data Communication', 'DC', 1, 3, 0, 1),
(3, 'Microprocessor techniques lab', 'MPT-Lab', 3, 1, 1, 1),
(4, 'Principles of Programming language lab', 'PPL-Lab', 3, 1, 1, 1),
(5, 'DSA Lab', 'dsa-lab', 2, 2, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `subjectBatchTeacher`
--

CREATE TABLE `subjectBatchTeacher` (
  `sbtId` int(11) NOT NULL COMMENT 'SBT Id',
  `subjectId` int(11) NOT NULL COMMENT 'Subject Id',
  `batchId` int(11) NOT NULL COMMENT 'Batch Id',
  `teacherId` int(11) DEFAULT NULL COMMENT 'Teacher Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this SBT'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `subjectBatchTeacher`
--

INSERT INTO `subjectBatchTeacher` (`sbtId`, `subjectId`, `batchId`, `teacherId`, `snapshotId`) VALUES
(1, 3, 1, 2, 1),
(3, 3, 2, 4, 1),
(7, 3, 4, 4, 1),
(2, 4, 1, 3, 1),
(5, 5, 2, 3, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `subjectBatchTeacherReadable`
-- (See below for the actual view)
--
CREATE TABLE `subjectBatchTeacherReadable` (
`sbtId` int(11)
,`subjectShortName` varchar(16)
,`batchName` varchar(32)
,`teacherShortName` varchar(16)
,`snapshotName` varchar(128)
);

-- --------------------------------------------------------

--
-- Table structure for table `subjectClassTeacher`
--

CREATE TABLE `subjectClassTeacher` (
  `sctId` int(11) NOT NULL COMMENT 'Subject Class Teacher Mapping Id',
  `subjectId` int(11) NOT NULL COMMENT 'Subject Id',
  `classId` int(11) NOT NULL COMMENT 'Class Id',
  `teacherId` int(11) DEFAULT NULL COMMENT 'Teacher Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this SCT'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `subjectClassTeacher`
--

INSERT INTO `subjectClassTeacher` (`sctId`, `subjectId`, `classId`, `teacherId`, `snapshotId`) VALUES
(1, 1, 1, 1, 1),
(2, 2, 1, 4, 1),
(3, 2, 2, 4, 1),
(4, 1, 2, 1, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `subjectClassTeacherReadable`
-- (See below for the actual view)
--
CREATE TABLE `subjectClassTeacherReadable` (
`sctId` int(11)
,`classShortName` varchar(32)
,`subjectShortName` varchar(16)
,`teacherShortName` varchar(16)
,`snapshotName` varchar(128)
);

-- --------------------------------------------------------

--
-- Table structure for table `subjectRoom`
--

CREATE TABLE `subjectRoom` (
  `srId` int(11) NOT NULL COMMENT 'Subject Room Preference Id',
  `subjectId` int(11) NOT NULL COMMENT 'Subject Id',
  `roomId` int(11) NOT NULL COMMENT 'Room Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Subject-Room'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `subjectRoom`
--

INSERT INTO `subjectRoom` (`srId`, `subjectId`, `roomId`, `snapshotId`) VALUES
(1, 1, 1, 1),
(2, 2, 2, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `subjectRoomReadable`
-- (See below for the actual view)
--
CREATE TABLE `subjectRoomReadable` (
`srId` int(11)
,`subjectShortName` varchar(16)
,`roomShortName` varchar(16)
,`snapshotName` varchar(128)
);

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE `teacher` (
  `teacherId` int(11) NOT NULL COMMENT 'Teacher Id',
  `teacherName` varchar(256) NOT NULL COMMENT 'Teacher''s Full Name',
  `teacherShortName` varchar(16) NOT NULL COMMENT 'Teacher''s Short Name',
  `minHrs` int(11) DEFAULT NULL COMMENT 'Min Hrs of Work for Teacher',
  `maxHrs` int(11) DEFAULT NULL COMMENT 'Max hrs of work for Teacher',
  `deptId` int(11) DEFAULT NULL COMMENT 'Department of the Teacher',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Teacher'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`teacherId`, `teacherName`, `teacherShortName`, `minHrs`, `maxHrs`, `deptId`, `snapshotId`) VALUES
(1, 'V. K. Khatavkar', 'Vaibhav', 10, 24, 1, 1),
(2, 'S. S. Kumbhar', 'Kumbhar', 10, 24, 1, 1),
(3, 'Sheetal Rathod', 'Sheetal', 16, 24, 1, 1),
(4, 'A. Biswas', 'Aparna', 16, 24, 1, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `teacherReadable`
-- (See below for the actual view)
--
CREATE TABLE `teacherReadable` (
`teacherId` int(11)
,`teacherName` varchar(256)
,`teacherShortName` varchar(16)
,`minHrs` int(11)
,`maxHrs` int(11)
,`deptShortName` varchar(32)
,`snapshotName` varchar(128)
);

-- --------------------------------------------------------

--
-- Table structure for table `timeTable`
--

CREATE TABLE `timeTable` (
  `ttId` int(11) NOT NULL COMMENT 'TimeTable Id',
  `day` smallint(6) DEFAULT NULL COMMENT 'Day of Week',
  `slotNo` int(11) DEFAULT NULL COMMENT 'Slot No.',
  `roomId` int(11) DEFAULT NULL COMMENT 'Room Id',
  `classId` int(11) DEFAULT NULL COMMENT 'Class Id',
  `subjectId` int(11) DEFAULT NULL COMMENT 'Subject Id',
  `teacherId` int(11) DEFAULT NULL COMMENT 'Teacher Id',
  `batchId` int(11) DEFAULT NULL COMMENT 'Batch Id',
  `isFixed` tinyint(1) DEFAULT NULL COMMENT 'Is Lunch/Fixed Slot?',
  `snapshotId` int(11) NOT NULL COMMENT 'Snapshot Id'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `timeTable`
--

INSERT INTO `timeTable` (`ttId`, `day`, `slotNo`, `roomId`, `classId`, `subjectId`, `teacherId`, `batchId`, `isFixed`, `snapshotId`) VALUES
(94, 5, 6, 1, 1, 1, 1, NULL, 0, 1),
(95, 1, 4, 1, 1, 1, 1, NULL, 0, 1),
(96, 1, 0, 2, 1, 2, 4, NULL, 0, 1),
(97, 1, 1, 2, 1, 2, 4, NULL, 0, 1),
(98, 3, 7, 3, 1, 4, 3, 1, 0, 1),
(99, 3, 8, 3, 1, 4, 3, 1, 0, 1),
(100, 3, 9, 3, 1, 4, 3, 1, 0, 1),
(101, 3, 3, 1, 1, 3, 4, 2, 0, 1),
(102, 3, 4, 1, 1, 3, 4, 2, 0, 1),
(103, 3, 5, 1, 1, 3, 4, 2, 0, 1),
(104, 1, 5, 1, 1, 5, 3, 2, 0, 1),
(105, 1, 6, 1, 1, 5, 3, 2, 0, 1),
(106, 1, 2, 1, 1, 5, 3, 2, 0, 1),
(107, 1, 3, 1, 1, 5, 3, 2, 0, 1),
(108, 3, 4, 3, 1, 3, 2, 1, 0, 1),
(109, 3, 5, 3, 1, 3, 2, 1, 0, 1),
(110, 3, 6, 3, 1, 3, 2, 1, 0, 1);

--
-- Triggers `timeTable`
--
DELIMITER $$
CREATE TRIGGER `check_slot_in_range` BEFORE INSERT ON `timeTable` FOR EACH ROW BEGIN
	DECLARE t_nSlots int; 
	DECLARE t_finished int default 0;
	DECLARE t_slotNo int;
	DECLARE t_roomId int;
	DECLARE t_classId int;
	DECLARE t_subjectId int;
	DECLARE t_batchId int;

	DECLARE teacher_slots CURSOR FOR SELECT slotNo, roomId, classId, subjectId, batchId FROM timeTable where NEW.teacherId=teacherId and NEW.day=day;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET t_finished = 1;
 
	select nSlots into t_nSlots from config where configId=1; 
	IF NEW.slotNo > t_nSlots or NEW.slotNo < 0 
	THEN
		
		SIGNAL SQLSTATE VALUE '45000' SET MESSAGE_TEXT = 'SLOT BIGGER THAN ALLOWED OR LESS THAN ZERO';
	END IF;
	

	OPEN teacher_slots;
	FETCH teacher_slots INTO t_slotNo, t_roomId, t_classId, t_subjectId, t_batchId;
	WHILE t_finished != 1 DO
		IF t_slotNo = NEW.slotNo and  (t_subjectId != NEW.subjectId or t_roomId != NEW.roomId)
		THEN
			SIGNAL SQLSTATE VALUE '40000'	SET MESSAGE_TEXT = 'SLOTS OVERLAP FOR TEACHER';
		END IF;
		FETCH teacher_slots INTO t_slotNo, t_roomId, t_classId, t_subjectId, t_batchId;
	END WHILE;
	CLOSE teacher_slots;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `timeTableReadable`
-- (See below for the actual view)
--
CREATE TABLE `timeTableReadable` (
`ttId` int(11)
,`day` smallint(6)
,`slotNo` int(11)
,`roomShortName` varchar(16)
,`classShortName` varchar(32)
,`subjectShortName` varchar(16)
,`teacherShortName` varchar(16)
,`batchName` varchar(32)
,`isFixed` bigint(20)
,`snapshotName` varchar(128)
);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `userId` int(11) NOT NULL COMMENT 'User Id',
  `userName` varchar(128) NOT NULL COMMENT 'User''s Full Name',
  `password` varchar(128) NOT NULL COMMENT 'User''s Passsword'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `userName`, `password`) VALUES
(1, 'abhijit', 'abhijit');

-- --------------------------------------------------------

--
-- Structure for view `batchCanOverlapReadable`
--
DROP TABLE IF EXISTS `batchCanOverlapReadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `batchCanOverlapReadable`  AS  select `bo`.`boId` AS `boId`,`b`.`batchName` AS `b1Name`,`b1`.`batchName` AS `b2Name`,`s`.`snapshotName` AS `snapShotName` from (((`batch` `b` join `batch` `b1`) join `batchCanOverlap` `bo`) join `snapshot` `s`) where ((`b`.`batchId` = `bo`.`batchId`) and (`b1`.`batchId` = `bo`.`batchOverlapId`) and (`bo`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`b`.`batchName`,`b1`.`batchName` ;

-- --------------------------------------------------------

--
-- Structure for view `batchClassReadable`
--
DROP TABLE IF EXISTS `batchClassReadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `batchClassReadable`  AS  select `bc`.`bcId` AS `bcId`,`b`.`batchName` AS `batchName`,`c`.`classShortName` AS `classShortName`,`s`.`snapshotName` AS `snapshotName` from (((`batch` `b` join `class` `c`) join `batchClass` `bc`) join `snapshot` `s`) where ((`b`.`batchId` = `bc`.`batchId`) and (`c`.`classId` = `bc`.`classId`) and (`bc`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`c`.`classShortName`,`b`.`batchName` ;

-- --------------------------------------------------------

--
-- Structure for view `batchRoomReadable`
--
DROP TABLE IF EXISTS `batchRoomReadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `batchRoomReadable`  AS  select `br`.`brId` AS `brId`,`b`.`batchName` AS `batchName`,`r`.`roomShortName` AS `roomShortName`,`s`.`snapshotName` AS `snapshotName` from (((`batch` `b` join `room` `r`) join `batchRoom` `br`) join `snapshot` `s`) where ((`b`.`batchId` = `br`.`batchId`) and (`r`.`roomId` = `br`.`roomId`) and (`br`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`b`.`batchName`,`r`.`roomShortName` ;

-- --------------------------------------------------------

--
-- Structure for view `classRoomReadable`
--
DROP TABLE IF EXISTS `classRoomReadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `classRoomReadable`  AS  select `cr`.`crId` AS `crId`,`c`.`classShortName` AS `classShortName`,`r`.`roomShortName` AS `roomShortName`,`s`.`snapshotName` AS `snapshotName` from (((`class` `c` join `room` `r`) join `classRoom` `cr`) join `snapshot` `s`) where ((`c`.`classId` = `cr`.`classId`) and (`r`.`roomId` = `cr`.`roomId`) and (`cr`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`c`.`classShortName`,`r`.`roomShortName` ;

-- --------------------------------------------------------

--
-- Structure for view `overlappingSBTReadable`
--
DROP TABLE IF EXISTS `overlappingSBTReadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `overlappingSBTReadable`  AS  select `sbto`.`osbtId` AS `osbtId`,`s1`.`subjectShortName` AS `subject1`,`b1`.`batchName` AS `batch1`,`t1`.`teacherShortName` AS `teacher1`,`s2`.`subjectShortName` AS `subject2`,`b2`.`batchName` AS `batch2`,`t2`.`teacherShortName` AS `teacher2`,`ss`.`snapshotName` AS `snapshotName` from (((((((((`subject` `s1` join `subject` `s2`) join `batch` `b1`) join `batch` `b2`) join `teacher` `t1`) join `teacher` `t2`) join `overlappingSBT` `sbto`) join `subjectBatchTeacher` `sbt1`) join `subjectBatchTeacher` `sbt2`) join `snapshot` `ss`) where ((`sbto`.`sbtId1` = `sbt1`.`sbtId`) and (`sbto`.`sbtId2` = `sbt2`.`sbtId`) and (`sbt1`.`subjectId` = `s1`.`subjectId`) and (`sbt1`.`batchId` = `b1`.`batchId`) and (`sbt1`.`teacherId` = `t1`.`teacherId`) and (`sbt2`.`subjectId` = `s2`.`subjectId`) and (`sbt2`.`batchId` = `b2`.`batchId`) and (`sbt2`.`teacherId` = `t2`.`teacherId`) and (`sbto`.`snapshotId` = `ss`.`snapshotId`)) order by `ss`.`snapshotName`,`s1`.`subjectShortName`,`s2`.`subjectShortName` ;

-- --------------------------------------------------------

--
-- Structure for view `subjectBatchTeacherReadable`
--
DROP TABLE IF EXISTS `subjectBatchTeacherReadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `subjectBatchTeacherReadable`  AS  select `sbt`.`sbtId` AS `sbtId`,`s`.`subjectShortName` AS `subjectShortName`,`b`.`batchName` AS `batchName`,`t`.`teacherShortName` AS `teacherShortName`,`ss`.`snapshotName` AS `snapshotName` from ((((`subject` `s` join `batch` `b`) join `subjectBatchTeacher` `sbt`) join `teacher` `t`) join `snapshot` `ss`) where ((`sbt`.`subjectId` = `s`.`subjectId`) and (`sbt`.`batchId` = `b`.`batchId`) and (`sbt`.`teacherId` = `t`.`teacherId`) and (`sbt`.`snapshotId` = `ss`.`snapshotId`)) order by `ss`.`snapshotName`,`s`.`subjectShortName`,`b`.`batchName`,`t`.`teacherShortName` ;

-- --------------------------------------------------------

--
-- Structure for view `subjectClassTeacherReadable`
--
DROP TABLE IF EXISTS `subjectClassTeacherReadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `subjectClassTeacherReadable`  AS  select `sct`.`sctId` AS `sctId`,`c`.`classShortName` AS `classShortName`,`s`.`subjectShortName` AS `subjectShortName`,`t`.`teacherShortName` AS `teacherShortName`,`ss`.`snapshotName` AS `snapshotName` from ((((`subject` `s` join `class` `c`) join `teacher` `t`) join `subjectClassTeacher` `sct`) join `snapshot` `ss`) where ((`s`.`subjectId` = `sct`.`subjectId`) and (`t`.`teacherId` = `sct`.`teacherId`) and (`c`.`classId` = `sct`.`classId`) and (`sct`.`snapshotId` = `ss`.`snapshotId`)) order by `ss`.`snapshotName`,`s`.`subjectShortName`,`c`.`classShortName`,`t`.`teacherShortName` ;

-- --------------------------------------------------------

--
-- Structure for view `subjectRoomReadable`
--
DROP TABLE IF EXISTS `subjectRoomReadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `subjectRoomReadable`  AS  select `sr`.`srId` AS `srId`,`s`.`subjectShortName` AS `subjectShortName`,`r`.`roomShortName` AS `roomShortName`,`ss`.`snapshotName` AS `snapshotName` from (((`subject` `s` join `room` `r`) join `subjectRoom` `sr`) join `snapshot` `ss`) where ((`s`.`subjectId` = `sr`.`subjectId`) and (`r`.`roomId` = `sr`.`roomId`) and (`r`.`snapshotId` = `ss`.`snapshotId`)) order by `ss`.`snapshotName`,`s`.`subjectShortName`,`r`.`roomShortName` ;

-- --------------------------------------------------------

--
-- Structure for view `teacherReadable`
--
DROP TABLE IF EXISTS `teacherReadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `teacherReadable`  AS  select `t`.`teacherId` AS `teacherId`,`t`.`teacherName` AS `teacherName`,`t`.`teacherShortName` AS `teacherShortName`,`t`.`minHrs` AS `minHrs`,`t`.`maxHrs` AS `maxHrs`,`d`.`deptShortName` AS `deptShortName`,`s`.`snapshotName` AS `snapshotName` from ((`teacher` `t` join `dept` `d`) join `snapshot` `s`) where ((`t`.`deptId` = `d`.`deptId`) and (`t`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`t`.`teacherShortName` ;

-- --------------------------------------------------------

--
-- Structure for view `timeTableReadable`
--
DROP TABLE IF EXISTS `timeTableReadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `timeTableReadable`  AS  select `tt`.`ttId` AS `ttId`,`tt`.`day` AS `day`,`tt`.`slotNo` AS `slotNo`,`r`.`roomShortName` AS `roomShortName`,`c`.`classShortName` AS `classShortName`,`s`.`subjectShortName` AS `subjectShortName`,`t`.`teacherShortName` AS `teacherShortName`,`b`.`batchName` AS `batchName`,`tt`.`isFixed` AS `isFixed`,`sn`.`snapshotName` AS `snapshotName` from ((((((`timeTable` `tt` join `room` `r`) join `class` `c`) join `subject` `s`) join `teacher` `t`) join `batch` `b`) join `snapshot` `sn`) where ((`tt`.`classId` = `c`.`classId`) and (`tt`.`subjectId` = `s`.`subjectId`) and (`tt`.`batchId` = `b`.`batchId`) and (`tt`.`batchId` is not null) and (`tt`.`roomId` = `r`.`roomId`) and (`tt`.`teacherId` = `t`.`teacherId`) and (`tt`.`snapshotId` = `sn`.`snapshotId`) and (`tt`.`isFixed` = FALSE)) union select `tt`.`ttId` AS `ttId`,`tt`.`day` AS `day`,`tt`.`slotNo` AS `slotNo`,`r`.`roomShortName` AS `roomShortName`,`c`.`classShortName` AS `classShortName`,`s`.`subjectShortName` AS `subjectShortName`,`t`.`teacherShortName` AS `teacherShortName`,NULL AS `NULL`,`tt`.`isFixed` AS `isFixed`,`sn`.`snapshotName` AS `snapshotName` from (((((`timeTable` `tt` join `room` `r`) join `class` `c`) join `subject` `s`) join `teacher` `t`) join `snapshot` `sn`) where ((`tt`.`classId` = `c`.`classId`) and (`tt`.`subjectId` = `s`.`subjectId`) and (`tt`.`roomId` = `r`.`roomId`) and (`tt`.`teacherId` = `t`.`teacherId`) and isnull(`tt`.`batchId`) and (`tt`.`snapshotId` = `sn`.`snapshotId`) and (`tt`.`isFixed` = FALSE)) union select `tt`.`ttId` AS `ttId`,`tt`.`day` AS `day`,`tt`.`slotNo` AS `slotNo`,NULL AS `NULL`,`c`.`classShortName` AS `classShortName`,NULL AS `NULL`,NULL AS `NULL`,NULL AS `NULL`,TRUE AS `TRUE`,`sn`.`snapshotName` AS `snapshotName` from ((`timeTable` `tt` join `class` `c`) join `snapshot` `sn`) where ((`tt`.`isFixed` = TRUE) and (`tt`.`classId` = `c`.`classId`) and (`tt`.`snapshotId` = `sn`.`snapshotId`)) order by `ttId` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `batch`
--
ALTER TABLE `batch`
  ADD PRIMARY KEY (`batchId`),
  ADD UNIQUE KEY `c_batchName` (`batchName`,`snapshotId`),
  ADD KEY `snapshotId` (`snapshotId`);

--
-- Indexes for table `batchCanOverlap`
--
ALTER TABLE `batchCanOverlap`
  ADD PRIMARY KEY (`boId`),
  ADD UNIQUE KEY `c_overlaps` (`batchId`,`batchOverlapId`,`snapshotId`),
  ADD KEY `snapshotId` (`snapshotId`),
  ADD KEY `batchOverlapId` (`batchOverlapId`);

--
-- Indexes for table `batchClass`
--
ALTER TABLE `batchClass`
  ADD PRIMARY KEY (`bcId`),
  ADD UNIQUE KEY `c_batchClass` (`batchId`,`classId`,`snapshotId`),
  ADD KEY `snapshotId` (`snapshotId`),
  ADD KEY `classId` (`classId`);

--
-- Indexes for table `batchRoom`
--
ALTER TABLE `batchRoom`
  ADD PRIMARY KEY (`brId`),
  ADD UNIQUE KEY `c_batchRoom` (`batchId`,`snapshotId`),
  ADD KEY `snapshotId` (`snapshotId`),
  ADD KEY `roomId` (`roomId`);

--
-- Indexes for table `capability`
--
ALTER TABLE `capability`
  ADD PRIMARY KEY (`capId`),
  ADD UNIQUE KEY `c_capName` (`capName`);

--
-- Indexes for table `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`classId`),
  ADD UNIQUE KEY `c_classShortName` (`classShortName`,`snapshotId`),
  ADD KEY `snapshotId` (`snapshotId`);

--
-- Indexes for table `classRoom`
--
ALTER TABLE `classRoom`
  ADD PRIMARY KEY (`crId`),
  ADD UNIQUE KEY `c_classRoom` (`classId`,`snapshotId`),
  ADD KEY `snapshotId` (`snapshotId`),
  ADD KEY `roomId` (`roomId`);

--
-- Indexes for table `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`configId`),
  ADD KEY `incharge` (`incharge`);

--
-- Indexes for table `dept`
--
ALTER TABLE `dept`
  ADD PRIMARY KEY (`deptId`),
  ADD UNIQUE KEY `c_deptName` (`deptName`);

--
-- Indexes for table `fixedEntry`
--
ALTER TABLE `fixedEntry`
  ADD PRIMARY KEY (`feId`),
  ADD UNIQUE KEY `c_fixedEntry` (`ttId`,`snapshotId`),
  ADD KEY `snapshotId` (`snapshotId`);

--
-- Indexes for table `overlappingSBT`
--
ALTER TABLE `overlappingSBT`
  ADD PRIMARY KEY (`osbtId`),
  ADD UNIQUE KEY `c_overlappingSBT` (`sbtId1`,`sbtId2`,`snapshotId`),
  ADD KEY `snapshotId` (`snapshotId`),
  ADD KEY `sbtId2` (`sbtId2`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`roleId`),
  ADD UNIQUE KEY `c_roleName` (`roleName`);

--
-- Indexes for table `room`
--
ALTER TABLE `room`
  ADD PRIMARY KEY (`roomId`),
  ADD UNIQUE KEY `c_roomShortName` (`roomShortName`,`snapshotId`),
  ADD UNIQUE KEY `c_roomName` (`roomName`,`snapshotId`),
  ADD KEY `snapshotId` (`snapshotId`);

--
-- Indexes for table `snapshot`
--
ALTER TABLE `snapshot`
  ADD PRIMARY KEY (`snapshotId`),
  ADD UNIQUE KEY `c_snapshotName` (`snapshotName`),
  ADD KEY `snapshotCreator` (`snapshotCreator`),
  ADD KEY `configId` (`configId`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`subjectId`),
  ADD UNIQUE KEY `c_subjectShortName` (`subjectShortName`,`snapshotId`),
  ADD KEY `snapshotId` (`snapshotId`);

--
-- Indexes for table `subjectBatchTeacher`
--
ALTER TABLE `subjectBatchTeacher`
  ADD PRIMARY KEY (`sbtId`),
  ADD UNIQUE KEY `c_subjectBatchTeacheer` (`subjectId`,`batchId`,`teacherId`,`snapshotId`),
  ADD KEY `snapshotId` (`snapshotId`),
  ADD KEY `batchId` (`batchId`),
  ADD KEY `teacherId` (`teacherId`);

--
-- Indexes for table `subjectClassTeacher`
--
ALTER TABLE `subjectClassTeacher`
  ADD PRIMARY KEY (`sctId`),
  ADD UNIQUE KEY `c_subjectClassTeacheer` (`subjectId`,`classId`,`snapshotId`),
  ADD KEY `snapshotId` (`snapshotId`),
  ADD KEY `classId` (`classId`),
  ADD KEY `teacherId` (`teacherId`);

--
-- Indexes for table `subjectRoom`
--
ALTER TABLE `subjectRoom`
  ADD PRIMARY KEY (`srId`),
  ADD UNIQUE KEY `c_subjectRoom` (`subjectId`,`snapshotId`),
  ADD KEY `snapshotId` (`snapshotId`),
  ADD KEY `roomId` (`roomId`);

--
-- Indexes for table `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`teacherId`),
  ADD UNIQUE KEY `c_teacherShortName` (`teacherShortName`,`snapshotId`),
  ADD KEY `snapshotId` (`snapshotId`);

--
-- Indexes for table `timeTable`
--
ALTER TABLE `timeTable`
  ADD PRIMARY KEY (`ttId`),
  ADD KEY `roomId` (`roomId`),
  ADD KEY `classId` (`classId`),
  ADD KEY `batchId` (`batchId`),
  ADD KEY `subjectId` (`subjectId`),
  ADD KEY `teacherId` (`teacherId`),
  ADD KEY `snapshotId` (`snapshotId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `c_userName` (`userName`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `batch`
--
ALTER TABLE `batch`
  MODIFY `batchId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Batch Id', AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `batchCanOverlap`
--
ALTER TABLE `batchCanOverlap`
  MODIFY `boId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'BatchOverlap Id', AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `batchClass`
--
ALTER TABLE `batchClass`
  MODIFY `bcId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Batch Class Id', AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `batchRoom`
--
ALTER TABLE `batchRoom`
  MODIFY `brId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Batch Room Mapping Id', AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `capability`
--
ALTER TABLE `capability`
  MODIFY `capId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Capability Id';
--
-- AUTO_INCREMENT for table `class`
--
ALTER TABLE `class`
  MODIFY `classId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Class Id', AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `classRoom`
--
ALTER TABLE `classRoom`
  MODIFY `crId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Class Room Mapping Id', AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `config`
--
ALTER TABLE `config`
  MODIFY `configId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Configuration Id', AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `dept`
--
ALTER TABLE `dept`
  MODIFY `deptId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Department Id', AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `fixedEntry`
--
ALTER TABLE `fixedEntry`
  MODIFY `feId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Fixed Entry Id';
--
-- AUTO_INCREMENT for table `overlappingSBT`
--
ALTER TABLE `overlappingSBT`
  MODIFY `osbtId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id: Subject-Batch Pairs that must overlap';
--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `roleId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Role Id';
--
-- AUTO_INCREMENT for table `room`
--
ALTER TABLE `room`
  MODIFY `roomId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Room Id', AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `snapshot`
--
ALTER TABLE `snapshot`
  MODIFY `snapshotId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Snapshot Id', AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `subjectId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Subject Id', AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `subjectBatchTeacher`
--
ALTER TABLE `subjectBatchTeacher`
  MODIFY `sbtId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'SBT Id', AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT for table `subjectClassTeacher`
--
ALTER TABLE `subjectClassTeacher`
  MODIFY `sctId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Subject Class Teacher Mapping Id', AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `subjectRoom`
--
ALTER TABLE `subjectRoom`
  MODIFY `srId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Subject Room Preference Id', AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `teacher`
--
ALTER TABLE `teacher`
  MODIFY `teacherId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Teacher Id', AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `timeTable`
--
ALTER TABLE `timeTable`
  MODIFY `ttId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'TimeTable Id', AUTO_INCREMENT=111;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User Id', AUTO_INCREMENT=2;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `batch`
--
ALTER TABLE `batch`
  ADD CONSTRAINT `batch_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE;

--
-- Constraints for table `batchCanOverlap`
--
ALTER TABLE `batchCanOverlap`
  ADD CONSTRAINT `batchCanOverlap_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `batchCanOverlap_ibfk_2` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `batchCanOverlap_ibfk_3` FOREIGN KEY (`batchOverlapId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE;

--
-- Constraints for table `batchClass`
--
ALTER TABLE `batchClass`
  ADD CONSTRAINT `batchClass_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `batchClass_ibfk_2` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `batchClass_ibfk_3` FOREIGN KEY (`classId`) REFERENCES `class` (`classId`) ON DELETE CASCADE;

--
-- Constraints for table `batchRoom`
--
ALTER TABLE `batchRoom`
  ADD CONSTRAINT `batchRoom_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `batchRoom_ibfk_2` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `batchRoom_ibfk_3` FOREIGN KEY (`roomId`) REFERENCES `room` (`roomId`) ON DELETE CASCADE;

--
-- Constraints for table `class`
--
ALTER TABLE `class`
  ADD CONSTRAINT `class_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE;

--
-- Constraints for table `classRoom`
--
ALTER TABLE `classRoom`
  ADD CONSTRAINT `classRoom_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `classRoom_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `class` (`classId`) ON DELETE CASCADE,
  ADD CONSTRAINT `classRoom_ibfk_3` FOREIGN KEY (`roomId`) REFERENCES `room` (`roomId`) ON DELETE CASCADE;

--
-- Constraints for table `config`
--
ALTER TABLE `config`
  ADD CONSTRAINT `config_ibfk_1` FOREIGN KEY (`incharge`) REFERENCES `user` (`userId`) ON DELETE CASCADE;

--
-- Constraints for table `fixedEntry`
--
ALTER TABLE `fixedEntry`
  ADD CONSTRAINT `fixedEntry_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fixedEntry_ibfk_2` FOREIGN KEY (`ttId`) REFERENCES `timeTable` (`ttId`) ON DELETE CASCADE;

--
-- Constraints for table `overlappingSBT`
--
ALTER TABLE `overlappingSBT`
  ADD CONSTRAINT `overlappingSBT_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `overlappingSBT_ibfk_2` FOREIGN KEY (`sbtId1`) REFERENCES `subjectBatchTeacher` (`sbtId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `overlappingSBT_ibfk_3` FOREIGN KEY (`sbtId2`) REFERENCES `subjectBatchTeacher` (`sbtId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `room`
--
ALTER TABLE `room`
  ADD CONSTRAINT `room_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE;

--
-- Constraints for table `snapshot`
--
ALTER TABLE `snapshot`
  ADD CONSTRAINT `snapshot_ibfk_1` FOREIGN KEY (`snapshotCreator`) REFERENCES `user` (`userId`) ON DELETE CASCADE,
  ADD CONSTRAINT `snapshot_ibfk_2` FOREIGN KEY (`configId`) REFERENCES `config` (`configId`) ON DELETE CASCADE;

--
-- Constraints for table `subject`
--
ALTER TABLE `subject`
  ADD CONSTRAINT `subject_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE;

--
-- Constraints for table `subjectBatchTeacher`
--
ALTER TABLE `subjectBatchTeacher`
  ADD CONSTRAINT `subjectBatchTeacher_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectBatchTeacher_ibfk_2` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectBatchTeacher_ibfk_3` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`subjectId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectBatchTeacher_ibfk_4` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`teacherId`) ON DELETE CASCADE;

--
-- Constraints for table `subjectClassTeacher`
--
ALTER TABLE `subjectClassTeacher`
  ADD CONSTRAINT `subjectClassTeacher_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectClassTeacher_ibfk_2` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`subjectId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectClassTeacher_ibfk_3` FOREIGN KEY (`classId`) REFERENCES `class` (`classId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectClassTeacher_ibfk_4` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`teacherId`) ON DELETE CASCADE;

--
-- Constraints for table `subjectRoom`
--
ALTER TABLE `subjectRoom`
  ADD CONSTRAINT `subjectRoom_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectRoom_ibfk_2` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`subjectId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectRoom_ibfk_3` FOREIGN KEY (`roomId`) REFERENCES `room` (`roomId`) ON DELETE CASCADE;

--
-- Constraints for table `teacher`
--
ALTER TABLE `teacher`
  ADD CONSTRAINT `teacher_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE;

--
-- Constraints for table `timeTable`
--
ALTER TABLE `timeTable`
  ADD CONSTRAINT `timeTable_ibfk_1` FOREIGN KEY (`roomId`) REFERENCES `room` (`roomId`) ON DELETE CASCADE,
  ADD CONSTRAINT `timeTable_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `class` (`classId`) ON DELETE CASCADE,
  ADD CONSTRAINT `timeTable_ibfk_3` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `timeTable_ibfk_4` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`subjectId`) ON DELETE CASCADE,
  ADD CONSTRAINT `timeTable_ibfk_5` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`teacherId`) ON DELETE CASCADE,
  ADD CONSTRAINT `timeTable_ibfk_6` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 25, 2017 at 02:47 PM
-- Server version: 5.5.27
-- PHP Version: 5.4.7

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `timetable`
--

-- --------------------------------------------------------

--
-- Table structure for table `batch`
--

CREATE TABLE IF NOT EXISTS `batch` (
  `batchId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Batch Id',
  `batchName` varchar(32) NOT NULL COMMENT 'Batch Name',
  `batchCount` int(11) DEFAULT NULL COMMENT 'No. of Students in Batch',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Batch',
  PRIMARY KEY (`batchId`),
  UNIQUE KEY `c_batchName` (`batchName`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=75 ;

--
-- Dumping data for table `batch`
--

INSERT INTO `batch` (`batchId`, `batchName`, `batchCount`, `snapshotId`) VALUES
(1, 'FYBT-A1', 20, 1),
(2, 'FYBT-B1', 20, 1),
(3, 'FYBT-C1', 20, 1),
(4, 'FYBT-D1', 20, 1),
(5, 'FYBT-A2', 20, 1),
(6, 'FYBT-B2', 20, 1),
(7, 'FYBT-C2', 20, 1),
(8, 'FYBT-D2', 20, 1),
(9, 'FYBT-A3', 20, 1),
(10, 'FYBT-B3', 20, 1),
(11, 'FYBT-C3', 20, 1),
(12, 'FYBT-D3', 20, 1),
(13, 'FYBT-A4', 20, 1),
(14, 'FYBT-B4', 20, 1),
(15, 'FYBT-C4', 20, 1),
(16, 'FYBT-D4', 20, 1),
(17, 'FYBT-A5', 20, 1),
(18, 'FYBT-B5', 20, 1),
(19, 'FYBT-C5', 20, 1),
(20, 'FYBT-D5', 20, 1),
(21, 'SYBT-CE-S1', 22, 1),
(22, 'SYBT-CE-S2', 22, 1),
(23, 'SYBT-CE-S3', 22, 1),
(24, 'SYBT-CE-S4', 22, 1),
(25, 'SYBT-CE-DSY', 15, 1),
(26, 'SYBT-IT-S1', 22, 1),
(27, 'SYBT-IT-S2', 22, 1),
(28, 'SYBT-IT-S3', 22, 1),
(29, 'SYBT-IT-S4', 22, 1),
(30, 'SYBT-IT-DSY', 15, 1),
(31, 'TYBT-CE-T1', 20, 1),
(32, 'TYBT-CE-T2', 20, 1),
(33, 'TYBT-CE-T3', 20, 1),
(34, 'TYBT-CE-T4', 20, 1),
(35, 'TYBT-CE-T5', 20, 1),
(36, 'TYBT-IT-T1', 20, 1),
(37, 'TYBT-IT-T2', 20, 1),
(38, 'TYBT-IT-T3', 20, 1),
(39, 'TYBT-IT-T4', 20, 1),
(40, 'TYBT-IT-T5', 20, 1),
(41, 'FYMT-CE1', 20, 1),
(42, 'FYMT-IS1', 20, 1),
(43, 'SYMT-CE1', 20, 1),
(44, 'BT-CE-CSFLP1', 20, 1),
(45, 'BT-CE-CSFLP2', 20, 1),
(46, 'BT-CE-EC1', 20, 1),
(47, 'BT-CE-EC2', 20, 1),
(48, 'BT-CE-NLP1', 20, 1),
(49, 'BT-CE-WST1', 20, 1),
(50, 'BT-CE-WST2', 20, 1),
(51, 'BT-CE-WST3', 20, 1),
(52, 'BT-CE-WST4', 20, 1),
(53, 'BT-CE-WST5', 20, 1),
(54, 'BT-IT-CSFLP1', 20, 1),
(55, 'BT-IT-CSFLP2', 20, 1),
(56, 'BT-IT-EC1', 20, 1),
(57, 'BT-IT-EC2', 20, 1),
(58, 'BT-IT-NLP1', 20, 1),
(59, 'BT-IT-WST1', 20, 1),
(60, 'BT-IT-WST2', 20, 1),
(61, 'BT-IT-WST3', 20, 1),
(62, 'BT-IT-WST4', 20, 1),
(63, 'BT-IT-WST5', 20, 1),
(64, 'TYBT-CE-FOSS1', 20, 1),
(65, 'TYBT-CE-CBD1', 20, 1),
(66, 'TYBT-CE-CG1', 20, 1),
(67, 'TYBT-CE-CPES1', 20, 1),
(68, 'TYBT-CE-DM1', 20, 1),
(69, 'TYBT-IT-CBD1', 20, 1),
(70, 'TYBT-IT-CBD2', 20, 1),
(71, 'TYBT-IT-CG1', 20, 1),
(72, 'TYBT-IT-CPES1', 20, 1),
(73, 'TYBT-IT-DM1', 20, 1),
(74, 'TYBT-IT-FOSS1', 20, 1);

-- --------------------------------------------------------

--
-- Table structure for table `batchcanoverlap`
--

CREATE TABLE IF NOT EXISTS `batchcanoverlap` (
  `boId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'BatchOverlap Id',
  `batchId` int(11) NOT NULL COMMENT 'Batch Id',
  `batchOverlapId` int(11) NOT NULL COMMENT 'Batch Which Can Overlap',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this BO',
  PRIMARY KEY (`boId`),
  UNIQUE KEY `c_overlaps` (`batchId`,`batchOverlapId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `batchOverlapId` (`batchOverlapId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=281 ;

--
-- Dumping data for table `batchcanoverlap`
--

INSERT INTO `batchcanoverlap` (`boId`, `batchId`, `batchOverlapId`, `snapshotId`) VALUES
(1, 1, 2, 1),
(2, 1, 3, 1),
(3, 1, 4, 1),
(4, 2, 1, 1),
(5, 2, 3, 1),
(6, 2, 4, 1),
(7, 3, 1, 1),
(8, 3, 2, 1),
(9, 3, 4, 1),
(10, 4, 1, 1),
(11, 4, 2, 1),
(12, 4, 3, 1),
(13, 5, 6, 1),
(14, 5, 7, 1),
(15, 5, 8, 1),
(16, 6, 5, 1),
(17, 6, 7, 1),
(18, 6, 8, 1),
(19, 7, 5, 1),
(20, 7, 6, 1),
(21, 7, 8, 1),
(22, 8, 5, 1),
(23, 8, 6, 1),
(24, 8, 7, 1),
(25, 9, 10, 1),
(26, 9, 11, 1),
(27, 9, 12, 1),
(28, 10, 9, 1),
(29, 10, 11, 1),
(30, 10, 12, 1),
(31, 11, 9, 1),
(32, 11, 10, 1),
(33, 11, 12, 1),
(34, 12, 9, 1),
(35, 12, 10, 1),
(36, 12, 11, 1),
(37, 13, 14, 1),
(38, 13, 15, 1),
(39, 13, 16, 1),
(40, 14, 13, 1),
(41, 14, 15, 1),
(42, 14, 16, 1),
(43, 15, 13, 1),
(44, 15, 14, 1),
(45, 15, 16, 1),
(46, 16, 13, 1),
(47, 16, 14, 1),
(48, 16, 15, 1),
(49, 17, 18, 1),
(50, 17, 19, 1),
(51, 17, 20, 1),
(52, 18, 17, 1),
(53, 18, 19, 1),
(54, 18, 20, 1),
(55, 19, 17, 1),
(56, 19, 18, 1),
(57, 19, 20, 1),
(58, 20, 17, 1),
(59, 20, 18, 1),
(60, 20, 19, 1),
(61, 21, 22, 1),
(62, 21, 23, 1),
(63, 21, 24, 1),
(64, 21, 25, 1),
(65, 22, 21, 1),
(66, 22, 23, 1),
(67, 22, 24, 1),
(68, 22, 25, 1),
(69, 23, 21, 1),
(70, 23, 22, 1),
(71, 23, 24, 1),
(72, 23, 25, 1),
(73, 24, 21, 1),
(74, 24, 22, 1),
(75, 24, 23, 1),
(76, 24, 25, 1),
(77, 25, 21, 1),
(78, 25, 22, 1),
(79, 25, 23, 1),
(80, 25, 24, 1),
(81, 26, 27, 1),
(82, 26, 28, 1),
(83, 26, 29, 1),
(84, 26, 30, 1),
(85, 27, 26, 1),
(86, 27, 28, 1),
(87, 27, 29, 1),
(88, 27, 30, 1),
(89, 28, 26, 1),
(90, 28, 27, 1),
(91, 28, 29, 1),
(92, 28, 30, 1),
(93, 29, 26, 1),
(94, 29, 27, 1),
(95, 29, 28, 1),
(96, 29, 30, 1),
(97, 30, 26, 1),
(98, 30, 27, 1),
(99, 30, 28, 1),
(100, 30, 29, 1),
(101, 31, 32, 1),
(102, 31, 33, 1),
(103, 31, 34, 1),
(104, 31, 35, 1),
(105, 31, 36, 1),
(106, 32, 31, 1),
(107, 32, 33, 1),
(108, 32, 34, 1),
(109, 32, 35, 1),
(110, 32, 36, 1),
(111, 33, 31, 1),
(112, 33, 32, 1),
(113, 33, 34, 1),
(114, 33, 35, 1),
(115, 33, 36, 1),
(116, 34, 31, 1),
(117, 34, 32, 1),
(118, 34, 33, 1),
(119, 34, 35, 1),
(120, 34, 36, 1),
(121, 35, 31, 1),
(122, 35, 32, 1),
(123, 35, 33, 1),
(124, 35, 34, 1),
(125, 35, 36, 1),
(126, 36, 31, 1),
(127, 36, 32, 1),
(128, 36, 33, 1),
(129, 36, 34, 1),
(130, 36, 35, 1),
(131, 37, 38, 1),
(132, 37, 39, 1),
(133, 37, 40, 1),
(134, 37, 41, 1),
(135, 38, 37, 1),
(136, 38, 39, 1),
(137, 38, 40, 1),
(138, 38, 41, 1),
(139, 39, 37, 1),
(140, 39, 38, 1),
(141, 39, 40, 1),
(142, 39, 41, 1),
(143, 40, 37, 1),
(144, 40, 38, 1),
(145, 40, 39, 1),
(146, 40, 41, 1),
(147, 41, 37, 1),
(148, 41, 38, 1),
(149, 41, 39, 1),
(150, 41, 40, 1),
(151, 44, 45, 1),
(152, 44, 46, 1),
(153, 44, 47, 1),
(154, 44, 48, 1),
(155, 45, 44, 1),
(156, 45, 46, 1),
(157, 45, 47, 1),
(158, 45, 48, 1),
(159, 46, 44, 1),
(160, 46, 45, 1),
(161, 46, 47, 1),
(162, 46, 48, 1),
(163, 47, 44, 1),
(164, 47, 45, 1),
(165, 47, 46, 1),
(166, 47, 48, 1),
(167, 48, 44, 1),
(168, 48, 45, 1),
(169, 48, 46, 1),
(170, 48, 47, 1),
(171, 49, 50, 1),
(172, 49, 51, 1),
(173, 49, 52, 1),
(174, 49, 53, 1),
(175, 50, 49, 1),
(176, 50, 51, 1),
(177, 50, 52, 1),
(178, 50, 53, 1),
(179, 51, 49, 1),
(180, 51, 50, 1),
(181, 51, 52, 1),
(182, 51, 53, 1),
(183, 52, 49, 1),
(184, 52, 50, 1),
(185, 52, 51, 1),
(186, 52, 53, 1),
(187, 53, 49, 1),
(188, 53, 50, 1),
(189, 53, 51, 1),
(190, 53, 52, 1),
(191, 54, 55, 1),
(192, 54, 56, 1),
(193, 54, 57, 1),
(194, 54, 58, 1),
(195, 55, 54, 1),
(196, 55, 56, 1),
(197, 55, 57, 1),
(198, 55, 58, 1),
(199, 56, 54, 1),
(200, 56, 55, 1),
(201, 56, 57, 1),
(202, 56, 58, 1),
(203, 57, 54, 1),
(204, 57, 55, 1),
(205, 57, 56, 1),
(206, 57, 58, 1),
(207, 58, 54, 1),
(208, 58, 55, 1),
(209, 58, 56, 1),
(210, 58, 57, 1),
(211, 59, 60, 1),
(212, 59, 61, 1),
(213, 59, 62, 1),
(214, 59, 63, 1),
(215, 60, 59, 1),
(216, 60, 61, 1),
(217, 60, 62, 1),
(218, 60, 63, 1),
(219, 61, 59, 1),
(220, 61, 60, 1),
(221, 61, 62, 1),
(222, 61, 63, 1),
(223, 62, 59, 1),
(224, 62, 60, 1),
(225, 62, 61, 1),
(226, 62, 63, 1),
(227, 63, 59, 1),
(228, 63, 60, 1),
(229, 63, 61, 1),
(230, 63, 62, 1),
(231, 64, 65, 1),
(232, 64, 66, 1),
(233, 64, 67, 1),
(234, 64, 68, 1),
(235, 65, 64, 1),
(236, 65, 66, 1),
(237, 65, 67, 1),
(238, 65, 68, 1),
(239, 66, 64, 1),
(240, 66, 65, 1),
(241, 66, 67, 1),
(242, 66, 68, 1),
(243, 67, 64, 1),
(244, 67, 65, 1),
(245, 67, 66, 1),
(246, 67, 68, 1),
(247, 68, 64, 1),
(248, 68, 65, 1),
(249, 68, 66, 1),
(250, 68, 67, 1),
(251, 69, 70, 1),
(252, 69, 71, 1),
(253, 69, 72, 1),
(254, 69, 73, 1),
(255, 69, 74, 1),
(256, 70, 69, 1),
(257, 70, 71, 1),
(258, 70, 72, 1),
(259, 70, 73, 1),
(260, 70, 74, 1),
(261, 71, 69, 1),
(262, 71, 70, 1),
(263, 71, 72, 1),
(264, 71, 73, 1),
(265, 71, 74, 1),
(266, 72, 69, 1),
(267, 72, 70, 1),
(268, 72, 71, 1),
(269, 72, 73, 1),
(270, 72, 74, 1),
(271, 73, 69, 1),
(272, 73, 70, 1),
(273, 73, 71, 1),
(274, 73, 72, 1),
(275, 73, 74, 1),
(276, 74, 69, 1),
(277, 74, 70, 1),
(278, 74, 71, 1),
(279, 74, 72, 1),
(280, 74, 73, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `batchcanoverlapreadable`
--
CREATE TABLE IF NOT EXISTS `batchcanoverlapreadable` (
`boId` int(11)
,`b1Id` int(11)
,`b1Name` varchar(32)
,`b2Id` int(11)
,`b2Name` varchar(32)
,`snapShotName` varchar(128)
);
-- --------------------------------------------------------

--
-- Table structure for table `batchclass`
--

CREATE TABLE IF NOT EXISTS `batchclass` (
  `bcId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Batch Class Id',
  `batchId` int(11) NOT NULL COMMENT 'Batch Id',
  `classId` int(11) NOT NULL COMMENT 'Class Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this batchClass',
  PRIMARY KEY (`bcId`),
  UNIQUE KEY `c_batchClass` (`batchId`,`classId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `classId` (`classId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=75 ;

--
-- Dumping data for table `batchclass`
--

INSERT INTO `batchclass` (`bcId`, `batchId`, `classId`, `snapshotId`) VALUES
(1, 1, 7, 1),
(2, 2, 7, 1),
(3, 3, 7, 1),
(4, 4, 7, 1),
(5, 5, 8, 1),
(6, 6, 8, 1),
(7, 7, 8, 1),
(8, 8, 8, 1),
(9, 9, 9, 1),
(10, 10, 9, 1),
(11, 11, 9, 1),
(12, 12, 9, 1),
(13, 13, 10, 1),
(14, 14, 10, 1),
(15, 15, 10, 1),
(16, 16, 10, 1),
(17, 17, 11, 1),
(18, 18, 11, 1),
(19, 19, 11, 1),
(20, 20, 11, 1),
(21, 21, 1, 1),
(22, 22, 1, 1),
(23, 23, 1, 1),
(24, 24, 1, 1),
(25, 25, 1, 1),
(26, 26, 2, 1),
(27, 27, 2, 1),
(28, 28, 2, 1),
(29, 29, 2, 1),
(30, 30, 2, 1),
(31, 31, 3, 1),
(32, 32, 3, 1),
(33, 33, 3, 1),
(34, 34, 3, 1),
(35, 35, 3, 1),
(36, 36, 4, 1),
(37, 37, 4, 1),
(38, 38, 4, 1),
(39, 39, 4, 1),
(40, 40, 4, 1),
(41, 41, 12, 1),
(42, 42, 13, 1),
(43, 43, 14, 1),
(44, 44, 5, 1),
(45, 45, 5, 1),
(46, 46, 5, 1),
(47, 47, 5, 1),
(48, 48, 5, 1),
(49, 49, 5, 1),
(50, 50, 5, 1),
(51, 51, 5, 1),
(52, 52, 5, 1),
(53, 53, 5, 1),
(54, 54, 6, 1),
(55, 55, 6, 1),
(56, 56, 6, 1),
(57, 57, 6, 1),
(58, 58, 6, 1),
(59, 59, 6, 1),
(60, 60, 6, 1),
(61, 61, 6, 1),
(62, 62, 6, 1),
(63, 63, 6, 1),
(64, 64, 3, 1),
(65, 65, 3, 1),
(66, 66, 3, 1),
(67, 67, 3, 1),
(68, 68, 3, 1),
(69, 69, 4, 1),
(70, 70, 4, 1),
(71, 71, 4, 1),
(72, 72, 4, 1),
(73, 73, 4, 1),
(74, 74, 4, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `batchclassreadable`
--
CREATE TABLE IF NOT EXISTS `batchclassreadable` (
`bcId` int(11)
,`batchId` int(11)
,`batchName` varchar(32)
,`batchCount` int(11)
,`classId` int(11)
,`classShortName` varchar(32)
,`classCount` int(11)
,`snapshotName` varchar(128)
);
-- --------------------------------------------------------

--
-- Table structure for table `batchroom`
--

CREATE TABLE IF NOT EXISTS `batchroom` (
  `brId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Batch Room Mapping Id',
  `batchId` int(11) NOT NULL COMMENT 'Batch Id',
  `roomId` int(11) NOT NULL COMMENT 'Room Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Batch-Room',
  PRIMARY KEY (`brId`),
  UNIQUE KEY `c_batchRoom` (`batchId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `roomId` (`roomId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `batchroom`
--

INSERT INTO `batchroom` (`brId`, `batchId`, `roomId`, `snapshotId`) VALUES
(1, 21, 6, 1),
(2, 22, 7, 1),
(3, 37, 12, 1),
(4, 31, 5, 1),
(5, 64, 15, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `batchroomreadable`
--
CREATE TABLE IF NOT EXISTS `batchroomreadable` (
`brId` int(11)
,`batchId` int(11)
,`batchName` varchar(32)
,`roomId` int(11)
,`roomShortName` varchar(16)
,`snapshotName` varchar(128)
);
-- --------------------------------------------------------

--
-- Table structure for table `capability`
--

CREATE TABLE IF NOT EXISTS `capability` (
  `capId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Capability Id',
  `capName` varchar(128) NOT NULL COMMENT 'Capability Name',
  `roleId` int(11) DEFAULT NULL COMMENT 'Role Id',
  PRIMARY KEY (`capId`),
  UNIQUE KEY `c_capName` (`capName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `class`
--

CREATE TABLE IF NOT EXISTS `class` (
  `classId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Class Id',
  `className` varchar(256) NOT NULL COMMENT 'Class''s Full Name',
  `classShortName` varchar(32) NOT NULL COMMENT 'Class''s Short Name',
  `semester` int(11) NOT NULL COMMENT 'Current Semester No',
  `classCount` int(11) NOT NULL COMMENT 'No. of Students in Class',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Class',
  PRIMARY KEY (`classId`),
  UNIQUE KEY `c_classShortName` (`classShortName`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `class`
--

INSERT INTO `class` (`classId`, `className`, `classShortName`, `semester`, `classCount`, `snapshotId`) VALUES
(1, 'S.Y. B.Tech. Computer Engineering', 'SYBT-CE', 4, 80, 1),
(2, 'S.Y. B.Tech. Information Technology', 'SYBT-IT', 4, 80, 1),
(3, 'T.Y. B.Tech. Computer Engineering', 'TYBT-CE', 6, 80, 1),
(4, 'T.Y. B.Tech. Information Technology', 'TYBT-IT', 6, 80, 1),
(5, 'B.Tech. Computer Engineering', 'BT-CE', 8, 80, 1),
(6, 'B.Tech. Information Technology', 'BT-IT', 8, 80, 1),
(7, 'First Year B.Tech. Div 1', 'FYBT1', 2, 80, 1),
(8, 'First Year B.Tech. Div 2', 'FYBT2', 2, 80, 1),
(9, 'First Year B.Tech. Div 3', 'FYBT3', 2, 80, 1),
(10, 'First Year B.Tech. Div 4', 'FYBT4', 2, 80, 1),
(11, 'First Year B.Tech. Div 5', 'FYBT5', 2, 80, 1),
(12, 'F.Y. M.Tech. Computer Engineering', 'FYMT-CE', 2, 80, 1),
(13, 'F.Y. M.Tech. Information Security', 'FYMT-IS', 2, 80, 1),
(14, 'S.Y. M.Tech. Computer Engineering', 'SYMT-CE', 2, 80, 1);

-- --------------------------------------------------------

--
-- Table structure for table `classroom`
--

CREATE TABLE IF NOT EXISTS `classroom` (
  `crId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Class Room Mapping Id',
  `classId` int(11) NOT NULL COMMENT 'Class Id',
  `roomId` int(11) NOT NULL COMMENT 'Room Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Class-Room',
  PRIMARY KEY (`crId`),
  UNIQUE KEY `c_classRoom` (`classId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `roomId` (`roomId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `classroom`
--

INSERT INTO `classroom` (`crId`, `classId`, `roomId`, `snapshotId`) VALUES
(1, 1, 1, 1),
(2, 2, 2, 1),
(3, 12, 2, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `classroomreadable`
--
CREATE TABLE IF NOT EXISTS `classroomreadable` (
`crId` int(11)
,`classId` int(11)
,`classShortName` varchar(32)
,`roomId` int(11)
,`roomShortName` varchar(16)
,`snapshotName` varchar(128)
);
-- --------------------------------------------------------

--
-- Table structure for table `config`
--

CREATE TABLE IF NOT EXISTS `config` (
  `configId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Configuration Id',
  `configName` varchar(128) NOT NULL COMMENT 'Configuration Name',
  `dayBegin` time DEFAULT NULL COMMENT 'Day Begins at Time',
  `slotDuration` int(11) DEFAULT NULL COMMENT 'Duration of each slot in seconds',
  `nSlots` int(11) DEFAULT NULL COMMENT 'No of slots in a day',
  `deptId` int(11) DEFAULT NULL COMMENT 'Department of this config',
  `incharge` int(11) DEFAULT NULL COMMENT 'Incharge user of this config',
  PRIMARY KEY (`configId`),
  KEY `incharge` (`incharge`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `config`
--

INSERT INTO `config` (`configId`, `configName`, `dayBegin`, `slotDuration`, `nSlots`, `deptId`, `incharge`) VALUES
(1, 'defaultConfig', '08:00:00', 3600, 11, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `dept`
--

CREATE TABLE IF NOT EXISTS `dept` (
  `deptId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Department Id',
  `deptName` varchar(128) NOT NULL COMMENT 'Department Name',
  `deptShortName` varchar(32) NOT NULL COMMENT 'Department Short Name',
  PRIMARY KEY (`deptId`),
  UNIQUE KEY `c_deptName` (`deptName`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

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

CREATE TABLE IF NOT EXISTS `dump` (
  `tid` int(11) DEFAULT NULL,
  `day` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `fixedentry`
--

CREATE TABLE IF NOT EXISTS `fixedentry` (
  `feId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Fixed Entry Id',
  `ttId` int(11) NOT NULL COMMENT 'Timetable Entry Id',
  `fixedText` varchar(128) DEFAULT NULL COMMENT 'Description',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this fixedEntry',
  PRIMARY KEY (`feId`),
  UNIQUE KEY `c_fixedEntry` (`ttId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=356 ;

--
-- Dumping data for table `fixedentry`
--

INSERT INTO `fixedentry` (`feId`, `ttId`, `fixedText`, `snapshotId`) VALUES
(1, 2, 'LUNCH', 1),
(3, 4, 'LUNCH', 1),
(8, 9, 'LUNCH', 1),
(18, 19, 'LUNCH', 1),
(27, 28, 'LUNCH', 1),
(33, 34, 'LUNCH', 1),
(46, 47, 'LUNCH', 1),
(55, 56, 'LUNCH', 1),
(60, 61, 'LUNCH', 1),
(80, 81, 'LUNCH', 1),
(88, 89, 'LUNCH', 1),
(100, 101, 'LUNCH', 1),
(108, 109, 'LUNCH', 1),
(141, 142, 'LUNCH', 1),
(160, 161, 'LUNCH', 1),
(178, 179, 'LUNCH', 1),
(205, 206, 'LUNCH', 1),
(223, 224, 'LUNCH', 1),
(241, 242, 'LUNCH', 1),
(245, 246, 'LUNCH', 1),
(251, 252, 'LUNCH', 1),
(264, 265, 'LUNCH', 1),
(274, 275, 'LUNCH', 1),
(282, 283, 'LUNCH', 1),
(289, 290, 'LUNCH', 1),
(292, 293, 'LUNCH', 1),
(306, 307, 'LUNCH', 1),
(316, 317, 'LUNCH', 1),
(326, 327, 'LUNCH', 1),
(333, 334, 'LUNCH', 1),
(338, 339, 'LUNCH', 1),
(344, 345, 'LUNCH', 1),
(350, 351, 'LUNCH', 1),
(355, 356, 'LUNCH', 1);

-- --------------------------------------------------------

--
-- Table structure for table `overlappingsbt`
--

CREATE TABLE IF NOT EXISTS `overlappingsbt` (
  `osbtId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Id: Subject-Batch Pairs that must overlap',
  `sbtId1` int(11) NOT NULL COMMENT 'Sub-Batch Id 1',
  `sbtId2` int(11) NOT NULL COMMENT 'Sub-Batch Id 2',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this OSBT',
  PRIMARY KEY (`osbtId`),
  UNIQUE KEY `c_overlappingSBT` (`sbtId1`,`sbtId2`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `sbtId2` (`sbtId2`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `overlappingsbt`
--

INSERT INTO `overlappingsbt` (`osbtId`, `sbtId1`, `sbtId2`, `snapshotId`) VALUES
(1, 1, 2, 1),
(2, 2, 1, 1),
(3, 70, 71, 1),
(4, 71, 70, 1),
(5, 78, 79, 1),
(6, 79, 78, 1),
(7, 102, 103, 1),
(8, 103, 102, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `overlappingsbtreadable`
--
CREATE TABLE IF NOT EXISTS `overlappingsbtreadable` (
`osbtId` int(11)
,`subjectId1` int(11)
,`subject1` varchar(16)
,`batchId1` int(11)
,`batch1` varchar(32)
,`teacherId1` int(11)
,`teacher1` varchar(16)
,`subjectId2` int(11)
,`subject2` varchar(16)
,`batchId2` int(11)
,`batch2` varchar(32)
,`teacherId2` int(11)
,`teacher2` varchar(16)
,`snapshotName` varchar(128)
);
-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE IF NOT EXISTS `role` (
  `roleId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Role Id',
  `roleName` varchar(128) NOT NULL COMMENT 'Name of the Role',
  PRIMARY KEY (`roleId`),
  UNIQUE KEY `c_roleName` (`roleName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `room`
--

CREATE TABLE IF NOT EXISTS `room` (
  `roomId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Room Id',
  `roomName` varchar(32) NOT NULL COMMENT 'Room Name',
  `roomShortName` varchar(16) NOT NULL COMMENT 'Room Short Name',
  `roomCount` int(11) DEFAULT NULL COMMENT 'Capacity of Room',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Room',
  PRIMARY KEY (`roomId`),
  UNIQUE KEY `c_roomShortName` (`roomShortName`,`snapshotId`),
  UNIQUE KEY `c_roomName` (`roomName`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=22 ;

--
-- Dumping data for table `room`
--

INSERT INTO `room` (`roomId`, `roomName`, `roomShortName`, `roomCount`, `snapshotId`) VALUES
(1, 'AC-202', 'AC-202', 100, 1),
(2, 'AC-203', 'AC-203', 100, 1),
(3, 'AC-204', 'AC-204', 100, 1),
(4, 'SH ENTC EXTN', 'SH', 80, 1),
(5, 'DBMS Lab', 'DBMSL', 20, 1),
(6, 'FOSS Lab-1', 'FOSS1', 25, 1),
(7, 'FOSS Lab-2', 'FOSS2', 25, 1),
(8, 'Linux Lab', 'LL', 20, 1),
(9, 'Graphics and Multimedia Lab', 'GML', 20, 1),
(10, 'Digital Systems Lab', 'DSL', 15, 1),
(11, 'Programming Lab', 'PL', 21, 1),
(12, 'System Software Lab', 'SSL', 24, 1),
(13, 'Advanced Software Lab', 'ASL', 21, 1),
(14, 'Information Security Lab', 'ISL', 22, 1),
(15, 'Cognizant Lab-1', 'Cogni-1', 20, 1),
(16, 'Cognizant Lab-2', 'Cogni-2', 20, 1),
(17, 'Cognizant Lab-3', 'Cogni-3', 20, 1),
(18, 'Cognizant Lab-34', 'Cogni-34', 20, 1),
(19, 'Cognizant Lab-4', 'Cogni-4', 20, 1),
(20, 'Cognizant Lab-5', 'Cogni-5', 20, 1),
(21, 'Data Mining Lab', 'DML', 15, 1);

-- --------------------------------------------------------

--
-- Table structure for table `slots`
--

CREATE TABLE IF NOT EXISTS `slots` (
  `slotNo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `snapshot`
--

CREATE TABLE IF NOT EXISTS `snapshot` (
  `snapshotId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Snapshot Id',
  `snapshotName` varchar(128) DEFAULT NULL COMMENT 'Name of the Snapshot',
  `snapshotCreator` int(11) DEFAULT NULL COMMENT 'User who created this snapshot',
  `createTime` time DEFAULT NULL COMMENT 'Time of creation of this snapshot',
  `modifyTime` time DEFAULT NULL COMMENT 'Time of modification of this snapshot',
  `configId` int(11) DEFAULT NULL COMMENT 'Configuration Id for this snapshot',
  PRIMARY KEY (`snapshotId`),
  UNIQUE KEY `c_snapshotName` (`snapshotName`),
  KEY `snapshotCreator` (`snapshotCreator`),
  KEY `configId` (`configId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `snapshot`
--

INSERT INTO `snapshot` (`snapshotId`, `snapshotName`, `snapshotCreator`, `createTime`, `modifyTime`, `configId`) VALUES
(1, 'default', 1, '08:00:00', '08:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE IF NOT EXISTS `subject` (
  `subjectId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Subject Id',
  `subjectName` varchar(64) NOT NULL COMMENT 'Subject Full Name',
  `subjectShortName` varchar(16) NOT NULL COMMENT 'Subject Short Name',
  `eachSlot` int(11) DEFAULT NULL COMMENT 'No. of Slots for Each Entry',
  `nSlots` int(11) DEFAULT NULL COMMENT 'Total No. of Entries for this Subjeect',
  `batches` tinyint(1) DEFAULT NULL COMMENT 'Schedule in Batches?',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Subject',
  PRIMARY KEY (`subjectId`),
  UNIQUE KEY `c_subjectShortName` (`subjectShortName`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=71 ;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`subjectId`, `subjectName`, `subjectShortName`, `eachSlot`, `nSlots`, `batches`, `snapshotId`) VALUES
(1, 'Fundamentals of Mathematics-II', 'FM-II', 1, 3, 1, 1),
(2, 'Electronics and Computer Workshop', 'ECW', 2, 1, 1, 1),
(3, 'Fundamentals of Computer Programming', 'FCP', 1, 3, 0, 1),
(4, 'Fundamentals of Computer Programming Laboratory', 'FCP-Lab', 2, 2, 1, 1),
(5, 'Applied Biology', 'AB', 1, 3, 0, 1),
(6, 'Theory of Computer Science', 'TCS', 1, 3, 0, 1),
(7, 'Microprocessor techniques', 'MPT', 1, 3, 0, 1),
(8, 'Principles of Programming language', 'PPL', 1, 3, 0, 1),
(9, 'Data Communication', 'DC', 1, 3, 0, 1),
(10, 'Institute Level Open Elective Sem4', 'ILOE-Sem4', 1, 3, 0, 1),
(11, 'Microprocessor techniques lab', 'MPT-Lab', 3, 1, 1, 1),
(12, 'Principles of Programming language lab', 'PPL-Lab', 3, 1, 1, 1),
(13, 'Numerical Methods', 'NM', 1, 3, 0, 1),
(14, 'Liberal Learning Course-1', 'LLC1', 1, 3, 0, 1),
(15, 'Professional Science Course', 'PSC', 1, 3, 0, 1),
(16, 'Liberal Learning Course2', 'LLC2', 1, 3, 0, 1),
(17, 'open elective 3 yr-Information Systems', 'OE', 1, 3, 0, 1),
(18, 'Operating Systems', 'OS', 1, 3, 0, 1),
(19, 'Operating Systems Lab', 'OS-Lab', 3, 1, 1, 1),
(20, 'Computer Aided Signal Processing', 'CASP', 1, 3, 0, 1),
(21, 'Software Engineering', 'SE', 1, 3, 0, 1),
(22, 'Computer Aided Signal Processing Laboratory', 'CASP-Lab', 3, 1, 1, 1),
(23, 'Software Engineering Laboratory', 'SE-Lab', 3, 1, 1, 1),
(24, 'Free and Open Source Software Development', 'FOSS', 1, 3, 1, 1),
(25, 'Computer Graphics', 'CG', 1, 3, 1, 1),
(26, 'Cloud and Big Data', 'CBD', 1, 3, 1, 1),
(27, 'Concurrent Programming in Embedded Systems', 'CPES', 1, 3, 1, 1),
(28, 'Data Mining', 'DM', 1, 3, 1, 1),
(29, 'Free and Open Source Software Development Laboratory', 'FOSS-Lab', 3, 1, 1, 1),
(30, 'Cloud and Big Data Laboratory', 'CBD-Lab', 3, 1, 1, 1),
(31, 'Concurrent Programming in Embedded Systems  Laboratory', 'CPES-Lab', 3, 1, 1, 1),
(32, 'Computer Graphics Laboratory', 'CG-Lab', 3, 1, 1, 1),
(33, 'Data Mining  Laboratory', 'DM-Lab', 3, 1, 1, 1),
(34, 'Open Elective Third Year', 'OE-TY', 1, 3, 0, 1),
(35, 'Language processors', 'LP', 1, 3, 0, 1),
(36, 'Algorithm and complexity', 'AnC', 1, 3, 0, 1),
(37, 'Software development process lab', 'SDP-Lab', 3, 1, 1, 1),
(38, 'Software development process', 'SDP', 1, 3, 0, 1),
(39, 'Language processors Laboratory', 'LP-Lab', 3, 1, 1, 1),
(40, 'Algorithm and complexity lab', 'AnC-Lab', 3, 1, 1, 1),
(41, 'Liberal Learning Course3', 'LLC3', 1, 3, 0, 1),
(42, 'open elective final yr', 'OE-BTECH', 1, 3, 0, 1),
(43, 'Cyber Security Forensics and Legal Perspective', 'CSFLP', 1, 3, 0, 1),
(44, 'Cyber Security Forensics and Legal Perspective lab', 'CSFLP-Lab', 2, 1, 1, 1),
(45, 'E-Commerce', 'EC', 1, 3, 0, 1),
(46, 'E-Commerce lab', 'EC-Lab', 2, 1, 1, 1),
(47, 'Natural Language Processing', 'NLP', 1, 3, 0, 1),
(48, 'Natural Language Processing lab', 'NLP-Lab', 2, 1, 1, 1),
(49, 'Web Systems and Technologies', 'WST', 1, 3, 0, 1),
(50, 'Web Systems and Technologies  Laboratory', 'WST-Lab', 2, 1, 1, 1),
(51, 'Project Work', 'Project', 1, 3, 0, 1),
(52, 'Intellectual Property Rights', 'IPR', 1, 3, 0, 1),
(53, 'Advanced Algorithms', 'AA', 1, 3, 0, 1),
(54, 'Security in computing', 'SIC', 1, 3, 0, 1),
(55, 'Data Mining and Machine Learning', 'DMML', 1, 3, 0, 1),
(56, 'DE-Cloud Virtualization and Big Data', 'CVBD', 1, 3, 0, 1),
(57, 'DE-Advanced Graph Theory', 'AGT', 1, 3, 0, 1),
(58, 'DE-Embedded system', 'ES', 1, 3, 0, 1),
(59, 'PG lab II', 'PG-Lab-II', 2, 2, 0, 1),
(60, 'Institute Level Open Elective Sem6', 'ILOE-Sem6', 1, 3, 0, 1),
(61, 'Massively Open Onlie Course', 'MOOC', 1, 3, 0, 1),
(62, 'Institute Level Open Elective Sem8', 'ILOE-Sem8', 1, 3, 0, 1),
(63, 'Bioinformatics', 'BI', 1, 3, 0, 1),
(64, 'Internet of Things', 'IOT', 1, 3, 0, 1),
(65, 'Applied Cyber Security', 'ACS', 1, 3, 0, 1),
(66, 'Web Technology', 'WT', 1, 3, 0, 1),
(67, 'Wireless and Mobile Security', 'WMS', 1, 3, 0, 1),
(68, 'Network Security', 'NS', 1, 3, 0, 1),
(69, 'Advanced Database and Information Retrieval', 'ADIR', 1, 3, 0, 1),
(70, 'Cloud Computing and Security', 'CCS', 1, 3, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `subjectbatchteacher`
--

CREATE TABLE IF NOT EXISTS `subjectbatchteacher` (
  `sbtId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'SBT Id',
  `subjectId` int(11) NOT NULL COMMENT 'Subject Id',
  `batchId` int(11) NOT NULL COMMENT 'Batch Id',
  `teacherId` int(11) DEFAULT NULL COMMENT 'Teacher Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this SBT',
  PRIMARY KEY (`sbtId`),
  UNIQUE KEY `c_subjectBatchTeacheer` (`subjectId`,`batchId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `batchId` (`batchId`),
  KEY `teacherId` (`teacherId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=139 ;

--
-- Dumping data for table `subjectbatchteacher`
--

INSERT INTO `subjectbatchteacher` (`sbtId`, `subjectId`, `batchId`, `teacherId`, `snapshotId`) VALUES
(1, 1, 25, 39, 1),
(2, 1, 30, 39, 1),
(3, 2, 1, 5, 1),
(4, 2, 5, 5, 1),
(5, 2, 9, 5, 1),
(6, 2, 13, 5, 1),
(7, 2, 17, 28, 1),
(8, 2, 2, 28, 1),
(9, 2, 6, 28, 1),
(10, 2, 10, 28, 1),
(11, 2, 14, 33, 1),
(12, 2, 18, 33, 1),
(13, 2, 3, 33, 1),
(14, 2, 7, 33, 1),
(15, 2, 11, 19, 1),
(16, 2, 15, 19, 1),
(17, 2, 19, 19, 1),
(18, 2, 4, 19, 1),
(19, 2, 8, 5, 1),
(20, 2, 12, 5, 1),
(21, 2, 16, 5, 1),
(22, 2, 20, 28, 1),
(23, 4, 1, 6, 1),
(24, 4, 5, 22, 1),
(25, 4, 9, 22, 1),
(26, 4, 13, 6, 1),
(27, 4, 17, 38, 1),
(28, 4, 2, 6, 1),
(29, 4, 6, 38, 1),
(30, 4, 10, 6, 1),
(31, 4, 14, 37, 1),
(32, 4, 18, 37, 1),
(33, 4, 3, 37, 1),
(34, 4, 7, 9, 1),
(35, 4, 11, 9, 1),
(36, 4, 15, 32, 1),
(37, 4, 19, 32, 1),
(38, 4, 4, 32, 1),
(39, 4, 8, 23, 1),
(40, 4, 12, 23, 1),
(41, 4, 16, 6, 1),
(42, 4, 20, 23, 1),
(43, 11, 21, 16, 1),
(44, 12, 21, 35, 1),
(45, 11, 22, 16, 1),
(46, 12, 22, 35, 1),
(47, 11, 23, 16, 1),
(48, 12, 23, 35, 1),
(49, 11, 24, 16, 1),
(50, 12, 24, 35, 1),
(51, 11, 26, 16, 1),
(52, 12, 26, 25, 1),
(53, 11, 27, 16, 1),
(54, 12, 27, 25, 1),
(55, 11, 28, 16, 1),
(56, 12, 28, 14, 1),
(57, 11, 29, 16, 1),
(58, 12, 29, 14, 1),
(59, 19, 31, 2, 1),
(60, 40, 36, 17, 1),
(61, 40, 37, 17, 1),
(62, 40, 38, 3, 1),
(63, 40, 39, 3, 1),
(64, 40, 40, 3, 1),
(65, 22, 31, 11, 1),
(66, 22, 32, 11, 1),
(67, 22, 33, 36, 1),
(68, 22, 34, 36, 1),
(69, 22, 35, 36, 1),
(70, 30, 65, 1, 1),
(71, 30, 69, 1, 1),
(72, 30, 70, 33, 1),
(73, 26, 65, 1, 1),
(74, 26, 69, 1, 1),
(75, 26, 70, 33, 1),
(76, 32, 66, 18, 1),
(77, 25, 66, 18, 1),
(78, 31, 67, 35, 1),
(79, 31, 72, 35, 1),
(80, 27, 67, 35, 1),
(81, 27, 72, 35, 1),
(82, 44, 44, 8, 1),
(83, 44, 45, 8, 1),
(84, 44, 54, 8, 1),
(85, 44, 55, 8, 1),
(86, 43, 44, 8, 1),
(87, 43, 45, 8, 1),
(88, 43, 54, 8, 1),
(89, 43, 55, 8, 1),
(90, 33, 68, 19, 1),
(91, 33, 73, 19, 1),
(92, 28, 68, 19, 1),
(93, 28, 73, 19, 1),
(94, 46, 46, 29, 1),
(95, 46, 47, 29, 1),
(96, 46, 56, 29, 1),
(97, 46, 57, 29, 1),
(98, 45, 46, 29, 1),
(99, 45, 47, 29, 1),
(100, 45, 56, 29, 1),
(101, 45, 57, 29, 1),
(102, 29, 64, 2, 1),
(103, 29, 74, 2, 1),
(104, 24, 64, 2, 1),
(105, 24, 74, 2, 1),
(106, 39, 36, 7, 1),
(107, 39, 37, 7, 1),
(108, 39, 38, 7, 1),
(109, 39, 39, 7, 1),
(110, 39, 40, 10, 1),
(111, 48, 48, 10, 1),
(112, 48, 58, 10, 1),
(113, 47, 48, 10, 1),
(114, 47, 58, 10, 1),
(115, 19, 32, 2, 1),
(116, 19, 33, 2, 1),
(117, 19, 34, 10, 1),
(118, 19, 35, 10, 1),
(119, 37, 36, 18, 1),
(120, 37, 37, 18, 1),
(121, 37, 38, 13, 1),
(122, 37, 39, 36, 1),
(123, 37, 40, 36, 1),
(124, 23, 31, 20, 1),
(125, 23, 32, 20, 1),
(126, 23, 33, 20, 1),
(127, 23, 34, 20, 1),
(128, 23, 35, 19, 1),
(129, 50, 49, 13, 1),
(130, 50, 50, 13, 1),
(131, 50, 51, 13, 1),
(132, 50, 52, 13, 1),
(133, 50, 53, 13, 1),
(134, 50, 59, 28, 1),
(135, 50, 60, 28, 1),
(136, 50, 61, 28, 1),
(137, 50, 62, 28, 1),
(138, 50, 63, 28, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `subjectbatchteacherreadable`
--
CREATE TABLE IF NOT EXISTS `subjectbatchteacherreadable` (
`sbtId` int(11)
,`subjectId` int(11)
,`subjectShortName` varchar(16)
,`batchId` int(11)
,`batchName` varchar(32)
,`teacherId` int(11)
,`teacherShortName` varchar(16)
,`snapshotName` varchar(128)
);
-- --------------------------------------------------------

--
-- Table structure for table `subjectclassteacher`
--

CREATE TABLE IF NOT EXISTS `subjectclassteacher` (
  `sctId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Subject Class Teacher Mapping Id',
  `subjectId` int(11) NOT NULL COMMENT 'Subject Id',
  `classId` int(11) NOT NULL COMMENT 'Class Id',
  `teacherId` int(11) DEFAULT NULL COMMENT 'Teacher Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this SCT',
  PRIMARY KEY (`sctId`),
  UNIQUE KEY `c_subjectClassTeacheer` (`subjectId`,`classId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `classId` (`classId`),
  KEY `teacherId` (`teacherId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=39 ;

--
-- Dumping data for table `subjectclassteacher`
--

INSERT INTO `subjectclassteacher` (`sctId`, `subjectId`, `classId`, `teacherId`, `snapshotId`) VALUES
(1, 5, 1, 40, 1),
(2, 6, 1, 31, 1),
(3, 7, 1, 24, 1),
(4, 8, 1, 14, 1),
(5, 10, 1, 41, 1),
(6, 9, 1, 23, 1),
(7, 5, 2, 40, 1),
(8, 6, 2, 9, 1),
(9, 7, 2, 24, 1),
(10, 8, 2, 14, 1),
(11, 10, 2, 42, 1),
(12, 9, 2, 5, 1),
(13, 18, 3, 30, 1),
(14, 20, 3, 11, 1),
(15, 21, 3, 20, 1),
(16, 60, 3, 43, 1),
(17, 35, 4, 7, 1),
(18, 36, 4, 3, 1),
(19, 38, 4, 36, 1),
(20, 60, 4, 43, 1),
(21, 3, 7, 22, 1),
(22, 3, 8, 32, 1),
(23, 3, 9, 26, 1),
(24, 3, 10, 9, 1),
(25, 3, 11, 23, 1),
(26, 53, 12, 6, 1),
(27, 54, 12, 17, 1),
(28, 55, 12, 4, 1),
(29, 56, 12, 1, 1),
(30, 58, 12, 27, 1),
(31, 61, 12, 9, 1),
(32, 62, 6, 42, 1),
(33, 62, 5, 42, 1),
(34, 49, 5, 13, 1),
(35, 52, 6, 43, 1),
(36, 52, 5, 43, 1),
(37, 49, 6, 28, 1),
(38, 59, 12, 4, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `subjectclassteacherreadable`
--
CREATE TABLE IF NOT EXISTS `subjectclassteacherreadable` (
`sctId` int(11)
,`classId` int(11)
,`classShortName` varchar(32)
,`subjectId` int(11)
,`subjectShortName` varchar(16)
,`teacherId` int(11)
,`teacherShortName` varchar(16)
,`snapshotName` varchar(128)
);
-- --------------------------------------------------------

--
-- Table structure for table `subjectroom`
--

CREATE TABLE IF NOT EXISTS `subjectroom` (
  `srId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Subject Room Preference Id',
  `subjectId` int(11) NOT NULL COMMENT 'Subject Id',
  `roomId` int(11) NOT NULL COMMENT 'Room Id',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Subject-Room',
  PRIMARY KEY (`srId`),
  UNIQUE KEY `c_subjectRoom` (`subjectId`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`),
  KEY `roomId` (`roomId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `subjectroom`
--

INSERT INTO `subjectroom` (`srId`, `subjectId`, `roomId`, `snapshotId`) VALUES
(1, 8, 1, 1),
(2, 18, 2, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `subjectroomreadable`
--
CREATE TABLE IF NOT EXISTS `subjectroomreadable` (
`srId` int(11)
,`subjectId` int(11)
,`subjectShortName` varchar(16)
,`roomId` int(11)
,`roomShortName` varchar(16)
,`snapshotName` varchar(128)
);
-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE IF NOT EXISTS `teacher` (
  `teacherId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Teacher Id',
  `teacherName` varchar(256) NOT NULL COMMENT 'Teacher''s Full Name',
  `teacherShortName` varchar(16) NOT NULL COMMENT 'Teacher''s Short Name',
  `minHrs` int(11) DEFAULT NULL COMMENT 'Min Hrs of Work for Teacher',
  `maxHrs` int(11) DEFAULT NULL COMMENT 'Max hrs of work for Teacher',
  `deptId` int(11) DEFAULT NULL COMMENT 'Department of the Teacher',
  `snapshotId` int(11) DEFAULT NULL COMMENT 'Snapshot Id for this Teacher',
  PRIMARY KEY (`teacherId`),
  UNIQUE KEY `c_teacherShortName` (`teacherShortName`,`snapshotId`),
  KEY `snapshotId` (`snapshotId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=45 ;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`teacherId`, `teacherName`, `teacherShortName`, `minHrs`, `maxHrs`, `deptId`, `snapshotId`) VALUES
(1, 'Jibi Abraham', 'Jibi', 12, 24, 1, 1),
(2, 'Abhijit A.M.', 'Abhijit', 16, 24, 1, 1),
(3, 'Jagannath Aghav', 'Aghav', 12, 24, 1, 1),
(4, 'V. Z. Attar', 'Vahida', 10, 24, 1, 1),
(5, 'S. K. Gaikwad', 'Gaikwad', 16, 24, 1, 1),
(6, 'S. N. Ghosh', 'Soma', 16, 24, 1, 1),
(7, 'S. N. Ghotkar', 'Ghotkar', 16, 24, 1, 1),
(8, 'S. U. Ghumbre', 'Ghumbre', 10, 24, 1, 1),
(9, 'S. P. Gosavi', 'Gosavi', 14, 24, 1, 1),
(10, 'Y. V. Haribhakta', 'Haribhakta', 14, 24, 1, 1),
(11, 'V. S. Inamdar', 'Vandana', 10, 24, 1, 1),
(12, 'A. D. Joshi', 'Joshi', 0, 0, 1, 1),
(13, 'V. M. Khadse', 'Khadse', 16, 24, 1, 1),
(14, 'V. K. Khatavkar', 'Vaibhav', 10, 24, 1, 1),
(15, 'D. D. Kshirsagar', 'Kshirsagar', 0, 0, 1, 1),
(16, 'S. S. Kumbhar', 'Kumbhar', 10, 24, 1, 1),
(17, 'S. B. Mane', 'Mane', 14, 24, 1, 1),
(18, 'V. K. Pachghare', 'Pachghare', 14, 24, 1, 1),
(19, 'A. B. Patil', 'Archana', 16, 24, 1, 1),
(20, 'T. R. Pattanshetti', 'Tanuja', 16, 24, 1, 1),
(21, 'S. T. Sawant', 'Suraj', 0, 0, 1, 1),
(22, 'V. V. Kamble', 'Vibhavari', 16, 24, 1, 1),
(23, 'A. Biswas', 'Aparna', 16, 24, 1, 1),
(24, 'A. A. Sawant', 'Sawant', 6, 24, 1, 1),
(25, 'Uma Gajendragadkar', 'Uma', 3, 24, 1, 1),
(26, 'Rajni Moona', 'Rajani', 15, 24, 1, 1),
(27, 'S. P. Dixit', 'Dixit', 3, 24, 1, 1),
(28, 'Jignesh Mangukiya', 'Jignesh', 16, 24, 1, 1),
(29, 'Rahul B. Adhav', 'Rahul', 16, 24, 1, 1),
(30, 'Nishchay Mhatre', 'Nishchay', 3, 24, 1, 1),
(31, 'Gauri', 'Gauri', 3, 24, 1, 1),
(32, 'Jadgish Kamble', 'Jagdish', 16, 24, 1, 1),
(33, 'Nikita Mahajan', 'Nikita', 16, 24, 1, 1),
(34, 'Madhuri Aher', 'Madhuri', 0, 0, 1, 1),
(35, 'Sheetal Rathod', 'Sheetal', 16, 24, 1, 1),
(36, 'Kulkarni Snehal', 'Snehal', 16, 24, 1, 1),
(37, 'Asmita Manna', 'Asmita', 16, 24, 1, 1),
(38, 'Rohini Sarode', 'Rohini', 16, 24, 1, 1),
(39, 'Maths Teacher1', 'Maths1', 16, 24, 1, 1),
(40, 'Applied Science Teacher1', 'Appsci1', 16, 24, 1, 1),
(41, 'Institute Faculty 1', 'Insti1', 16, 24, 1, 1),
(42, 'Institute Faculty 2', 'Insti2', 16, 24, 1, 1),
(43, 'Institute Faculty 3', 'Insti3', 16, 24, 1, 1),
(44, 'Institute Faculty 4', 'Insti4', 16, 24, 1, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `teacherreadable`
--
CREATE TABLE IF NOT EXISTS `teacherreadable` (
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
-- Table structure for table `timetable`
--

CREATE TABLE IF NOT EXISTS `timetable` (
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
  KEY `snapshotId` (`snapshotId`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=360 ;

--
-- Dumping data for table `timetable`
--

INSERT INTO `timetable` (`ttId`, `day`, `slotNo`, `roomId`, `classId`, `subjectId`, `teacherId`, `batchId`, `isFixed`, `snapshotId`) VALUES
(1, 1, 2, 4, 1, 1, 39, 25, 0, 1),
(2, 1, 5, NULL, 1, NULL, NULL, NULL, 1, 1),
(3, 1, 9, 4, 1, 5, 40, NULL, 0, 1),
(4, 2, 5, NULL, 1, NULL, NULL, NULL, 1, 1),
(5, 2, 6, 4, 1, 5, 40, NULL, 0, 1),
(6, 3, 2, 4, 1, 1, 39, 25, 0, 1),
(7, 3, 3, 4, 1, 10, 41, NULL, 0, 1),
(8, 3, 4, 4, 1, 6, 31, NULL, 0, 1),
(9, 3, 5, NULL, 1, NULL, NULL, NULL, 1, 1),
(10, 3, 7, 11, 1, 12, 35, 21, 0, 1),
(11, 3, 8, 11, 1, 12, 35, 21, 0, 1),
(12, 3, 9, 11, 1, 12, 35, 21, 0, 1),
(13, 3, 7, 10, 1, 11, 16, 23, 0, 1),
(14, 3, 8, 10, 1, 11, 16, 23, 0, 1),
(15, 3, 9, 10, 1, 11, 16, 23, 0, 1),
(16, 4, 2, 4, 1, 1, 39, 25, 0, 1),
(17, 4, 3, 4, 1, 10, 41, NULL, 0, 1),
(18, 4, 4, 4, 1, 7, 24, NULL, 0, 1),
(19, 4, 5, NULL, 1, NULL, NULL, NULL, 1, 1),
(20, 4, 7, 10, 1, 11, 16, 22, 0, 1),
(21, 4, 8, 10, 1, 11, 16, 22, 0, 1),
(22, 4, 9, 10, 1, 11, 16, 22, 0, 1),
(23, 4, 7, 6, 1, 12, 35, 24, 0, 1),
(24, 4, 8, 6, 1, 12, 35, 24, 0, 1),
(25, 4, 9, 6, 1, 12, 35, 24, 0, 1),
(26, 5, 3, 4, 1, 10, 41, NULL, 0, 1),
(27, 5, 4, 4, 1, 6, 31, NULL, 0, 1),
(28, 5, 5, NULL, 1, NULL, NULL, NULL, 1, 1),
(29, 5, 6, 4, 1, 8, 14, NULL, 0, 1),
(30, 5, 8, 4, 1, 5, 40, NULL, 0, 1),
(31, 1, 2, 4, 2, 1, 39, 30, 0, 1),
(32, 1, 4, 4, 2, 8, 14, NULL, 0, 1),
(33, 1, 5, 4, 2, 9, 5, NULL, 0, 1),
(34, 1, 6, NULL, 2, NULL, NULL, NULL, 1, 1),
(35, 1, 7, 11, 2, 12, 25, 28, 0, 1),
(36, 1, 8, 11, 2, 12, 25, 28, 0, 1),
(37, 1, 9, 11, 2, 12, 25, 28, 0, 1),
(38, 1, 7, 10, 2, 11, 16, 29, 0, 1),
(39, 1, 8, 10, 2, 11, 16, 29, 0, 1),
(40, 1, 9, 10, 2, 11, 16, 29, 0, 1),
(41, 2, 3, 10, 2, 11, 16, 26, 0, 1),
(42, 2, 4, 10, 2, 11, 16, 26, 0, 1),
(43, 2, 5, 10, 2, 11, 16, 26, 0, 1),
(44, 2, 3, 11, 2, 12, 14, 27, 0, 1),
(45, 2, 4, 11, 2, 12, 14, 27, 0, 1),
(46, 2, 5, 11, 2, 12, 14, 27, 0, 1),
(47, 2, 6, NULL, 2, NULL, NULL, NULL, 1, 1),
(48, 2, 7, 4, 2, 8, 14, NULL, 0, 1),
(49, 2, 8, 4, 2, 7, 24, NULL, 0, 1),
(50, 2, 9, 4, 2, 6, 9, NULL, 0, 1),
(51, 2, 10, 4, 2, 5, 40, NULL, 0, 1),
(52, 3, 2, 4, 2, 1, 39, 30, 0, 1),
(53, 3, 3, 4, 2, 10, 41, NULL, 0, 1),
(54, 3, 4, 2, 2, 8, 14, NULL, 0, 1),
(55, 3, 5, 2, 2, 5, 40, NULL, 0, 1),
(56, 3, 6, NULL, 2, NULL, NULL, NULL, 1, 1),
(57, 3, 7, 4, 2, 6, 9, NULL, 0, 1),
(58, 3, 8, 4, 2, 7, 24, NULL, 0, 1),
(59, 4, 2, 4, 2, 1, 39, 30, 0, 1),
(60, 4, 3, 4, 2, 10, 41, NULL, 0, 1),
(61, 4, 6, NULL, 2, NULL, NULL, NULL, 1, 1),
(62, 4, 7, 4, 2, 7, 24, NULL, 0, 1),
(63, 4, 8, 4, 2, 6, 9, NULL, 0, 1),
(64, 5, 2, 4, 2, 5, 40, NULL, 0, 1),
(65, 5, 3, 4, 2, 10, 41, NULL, 0, 1),
(66, 5, 4, 11, 2, 12, 25, 26, 0, 1),
(67, 5, 5, 11, 2, 12, 25, 26, 0, 1),
(68, 5, 6, 11, 2, 12, 25, 26, 0, 1),
(69, 5, 4, 10, 2, 11, 16, 27, 0, 1),
(70, 5, 5, 10, 2, 11, 16, 27, 0, 1),
(71, 5, 6, 10, 2, 11, 16, 27, 0, 1),
(72, 5, 7, 11, 2, 12, 14, 29, 0, 1),
(73, 5, 8, 11, 2, 12, 14, 29, 0, 1),
(74, 5, 9, 11, 2, 12, 14, 29, 0, 1),
(75, 5, 7, 10, 2, 11, 16, 28, 0, 1),
(76, 5, 8, 10, 2, 11, 16, 28, 0, 1),
(77, 5, 9, 10, 2, 11, 16, 28, 0, 1),
(78, 1, 2, 2, 3, 28, 19, 68, 0, 1),
(79, 1, 2, 1, 3, 26, 33, 65, 0, 1),
(80, 1, 2, 9, 3, 25, 18, 66, 0, 1),
(81, 1, 3, NULL, 3, NULL, NULL, NULL, 1, 1),
(82, 1, 5, 1, 3, 21, 20, NULL, 0, 1),
(83, 2, 2, 5, 3, 23, 20, 33, 0, 1),
(84, 2, 3, 5, 3, 23, 20, 33, 0, 1),
(85, 2, 4, 5, 3, 23, 20, 33, 0, 1),
(86, 2, 2, 11, 3, 19, 10, 31, 0, 1),
(87, 2, 3, 11, 3, 19, 10, 31, 0, 1),
(88, 2, 4, 11, 3, 19, 10, 31, 0, 1),
(89, 2, 5, NULL, 3, NULL, NULL, NULL, 1, 1),
(90, 2, 6, 1, 3, 21, 20, NULL, 0, 1),
(91, 2, 7, 1, 3, 20, 11, NULL, 0, 1),
(92, 2, 9, 9, 3, 25, 18, 66, 0, 1),
(93, 2, 10, 1, 3, 26, 33, 65, 0, 1),
(94, 3, 1, 1, 3, 18, 30, NULL, 0, 1),
(95, 3, 2, 5, 3, 23, 20, 32, 0, 1),
(96, 3, 3, 5, 3, 23, 20, 32, 0, 1),
(97, 3, 4, 5, 3, 23, 20, 32, 0, 1),
(98, 3, 2, 6, 3, 19, 2, 34, 0, 1),
(99, 3, 3, 6, 3, 19, 2, 34, 0, 1),
(100, 3, 4, 6, 3, 19, 2, 34, 0, 1),
(101, 3, 5, NULL, 3, NULL, NULL, NULL, 1, 1),
(102, 3, 6, 1, 3, 20, 11, NULL, 0, 1),
(103, 3, 7, 6, 3, 24, 2, 64, 0, 1),
(104, 3, 7, 1, 3, 28, 19, 68, 0, 1),
(105, 3, 8, 1, 3, 25, 18, 66, 0, 1),
(106, 3, 9, 1, 3, 60, 25, NULL, 0, 1),
(107, 3, 10, 9, 3, 27, 35, 67, 0, 1),
(108, 4, 4, 1, 3, 21, 20, NULL, 0, 1),
(109, 4, 5, NULL, 3, NULL, NULL, NULL, 1, 1),
(110, 4, 6, 5, 3, 23, 20, 34, 0, 1),
(111, 4, 7, 5, 3, 23, 20, 34, 0, 1),
(112, 4, 8, 5, 3, 23, 20, 34, 0, 1),
(113, 4, 6, 6, 3, 19, 2, 32, 0, 1),
(114, 4, 7, 6, 3, 19, 2, 32, 0, 1),
(115, 4, 8, 6, 3, 19, 2, 32, 0, 1),
(116, 4, 6, 11, 3, 19, 10, 35, 0, 1),
(117, 4, 7, 11, 3, 19, 10, 35, 0, 1),
(118, 4, 8, 11, 3, 19, 10, 35, 0, 1),
(119, 4, 6, 9, 3, 22, 36, 33, 0, 1),
(120, 4, 7, 9, 3, 22, 36, 33, 0, 1),
(121, 4, 8, 9, 3, 22, 36, 33, 0, 1),
(122, 4, 9, 1, 3, 60, 25, NULL, 0, 1),
(123, 4, 10, 9, 3, 27, 35, 67, 0, 1),
(124, 5, 1, 6, 3, 29, 2, 64, 0, 1),
(125, 5, 2, 6, 3, 29, 2, 64, 0, 1),
(126, 5, 3, 6, 3, 29, 2, 64, 0, 1),
(127, 5, 1, 13, 3, 30, 1, 65, 0, 1),
(128, 5, 2, 13, 3, 30, 1, 65, 0, 1),
(129, 5, 3, 13, 3, 30, 1, 65, 0, 1),
(130, 5, 1, 20, 3, 31, 35, 67, 0, 1),
(131, 5, 2, 20, 3, 31, 35, 67, 0, 1),
(132, 5, 3, 20, 3, 31, 35, 67, 0, 1),
(133, 5, 1, 9, 3, 32, 18, 66, 0, 1),
(134, 5, 2, 9, 3, 32, 18, 66, 0, 1),
(135, 5, 3, 9, 3, 32, 18, 66, 0, 1),
(136, 5, 1, 12, 3, 33, 19, 68, 0, 1),
(137, 5, 2, 12, 3, 33, 19, 68, 0, 1),
(138, 5, 3, 12, 3, 33, 19, 68, 0, 1),
(139, 5, 4, 6, 3, 28, 19, 68, 0, 1),
(140, 5, 4, 1, 3, 26, 33, 65, 0, 1),
(141, 5, 4, 13, 3, 27, 35, 67, 0, 1),
(142, 5, 5, NULL, 3, NULL, NULL, NULL, 1, 1),
(143, 5, 6, 5, 3, 23, 20, 31, 0, 1),
(144, 5, 7, 5, 3, 23, 20, 31, 0, 1),
(145, 5, 8, 5, 3, 23, 20, 31, 0, 1),
(146, 5, 6, 17, 3, 23, 19, 35, 0, 1),
(147, 5, 7, 17, 3, 23, 19, 35, 0, 1),
(148, 5, 8, 17, 3, 23, 19, 35, 0, 1),
(149, 5, 6, 6, 3, 19, 2, 33, 0, 1),
(150, 5, 7, 6, 3, 19, 2, 33, 0, 1),
(151, 5, 8, 6, 3, 19, 2, 33, 0, 1),
(152, 5, 6, 12, 3, 22, 11, 34, 0, 1),
(153, 5, 7, 12, 3, 22, 11, 34, 0, 1),
(154, 5, 8, 12, 3, 22, 11, 34, 0, 1),
(155, 5, 9, 1, 3, 60, 25, NULL, 0, 1),
(156, 1, 2, 2, 4, 28, 19, 73, 0, 1),
(157, 1, 2, 1, 4, 26, 33, 70, 0, 1),
(158, 1, 2, 1, 4, 26, 33, 69, 0, 1),
(159, 1, 3, 2, 4, 35, 7, NULL, 0, 1),
(160, 1, 4, 2, 4, 38, 36, NULL, 0, 1),
(161, 1, 5, NULL, 4, NULL, NULL, NULL, 1, 1),
(162, 1, 6, 1, 4, 24, 2, 74, 0, 1),
(163, 1, 7, 1, 4, 24, 2, 74, 0, 1),
(164, 1, 6, 13, 4, 30, 1, 69, 0, 1),
(165, 1, 7, 13, 4, 30, 1, 69, 0, 1),
(166, 1, 8, 13, 4, 30, 1, 69, 0, 1),
(167, 1, 6, 7, 4, 33, 19, 73, 0, 1),
(168, 1, 7, 7, 4, 33, 19, 73, 0, 1),
(169, 1, 8, 7, 4, 33, 19, 73, 0, 1),
(170, 2, 2, 18, 4, 37, 18, 36, 0, 1),
(171, 2, 3, 18, 4, 37, 18, 36, 0, 1),
(172, 2, 4, 18, 4, 37, 18, 36, 0, 1),
(173, 2, 2, 9, 4, 39, 7, 40, 0, 1),
(174, 2, 3, 9, 4, 39, 7, 40, 0, 1),
(175, 2, 4, 9, 4, 39, 7, 40, 0, 1),
(176, 2, 2, 17, 4, 40, 3, 37, 0, 1),
(177, 2, 3, 17, 4, 40, 3, 37, 0, 1),
(178, 2, 4, 17, 4, 40, 3, 37, 0, 1),
(179, 2, 5, NULL, 4, NULL, NULL, NULL, 1, 1),
(180, 2, 6, 18, 4, 37, 36, 38, 0, 1),
(181, 2, 7, 18, 4, 37, 36, 38, 0, 1),
(182, 2, 8, 18, 4, 37, 36, 38, 0, 1),
(183, 2, 6, 17, 4, 40, 17, 39, 0, 1),
(184, 2, 7, 17, 4, 40, 17, 39, 0, 1),
(185, 2, 8, 17, 4, 40, 17, 39, 0, 1),
(186, 2, 6, 19, 4, 40, 3, 40, 0, 1),
(187, 2, 7, 19, 4, 40, 3, 40, 0, 1),
(188, 2, 8, 19, 4, 40, 3, 40, 0, 1),
(189, 2, 6, 9, 4, 39, 7, 36, 0, 1),
(190, 2, 7, 9, 4, 39, 7, 36, 0, 1),
(191, 2, 8, 9, 4, 39, 7, 36, 0, 1),
(192, 2, 9, 1, 4, 26, 33, 69, 0, 1),
(193, 3, 2, 18, 4, 37, 18, 37, 0, 1),
(194, 3, 3, 18, 4, 37, 18, 37, 0, 1),
(195, 3, 4, 18, 4, 37, 18, 37, 0, 1),
(196, 3, 2, 19, 4, 37, 13, 40, 0, 1),
(197, 3, 3, 19, 4, 37, 13, 40, 0, 1),
(198, 3, 4, 19, 4, 37, 13, 40, 0, 1),
(199, 3, 2, 17, 4, 40, 17, 38, 0, 1),
(200, 3, 3, 17, 4, 40, 17, 38, 0, 1),
(201, 3, 4, 17, 4, 40, 17, 38, 0, 1),
(202, 3, 2, 9, 4, 39, 7, 39, 0, 1),
(203, 3, 3, 9, 4, 39, 7, 39, 0, 1),
(204, 3, 4, 9, 4, 39, 7, 39, 0, 1),
(205, 3, 5, 1, 4, 35, 7, NULL, 0, 1),
(206, 3, 6, NULL, 4, NULL, NULL, NULL, 1, 1),
(207, 3, 7, 6, 4, 24, 2, 74, 0, 1),
(208, 3, 7, 1, 4, 28, 19, 73, 0, 1),
(209, 3, 9, 1, 4, 60, 25, NULL, 0, 1),
(210, 3, 10, 9, 4, 27, 35, 72, 0, 1),
(211, 4, 2, 18, 4, 37, 36, 39, 0, 1),
(212, 4, 3, 18, 4, 37, 36, 39, 0, 1),
(213, 4, 4, 18, 4, 37, 36, 39, 0, 1),
(214, 4, 2, 17, 4, 40, 3, 36, 0, 1),
(215, 4, 3, 17, 4, 40, 3, 36, 0, 1),
(216, 4, 4, 17, 4, 40, 3, 36, 0, 1),
(217, 4, 2, 9, 4, 39, 7, 37, 0, 1),
(218, 4, 3, 9, 4, 39, 7, 37, 0, 1),
(219, 4, 4, 9, 4, 39, 7, 37, 0, 1),
(220, 4, 2, 11, 4, 39, 10, 38, 0, 1),
(221, 4, 3, 11, 4, 39, 10, 38, 0, 1),
(222, 4, 4, 11, 4, 39, 10, 38, 0, 1),
(223, 4, 5, 1, 4, 38, 36, NULL, 0, 1),
(224, 4, 6, NULL, 4, NULL, NULL, NULL, 1, 1),
(225, 4, 7, 1, 4, 36, 3, NULL, 0, 1),
(226, 4, 8, 1, 4, 36, 3, NULL, 0, 1),
(227, 4, 9, 1, 4, 60, 25, NULL, 0, 1),
(228, 4, 10, 9, 4, 27, 35, 72, 0, 1),
(229, 5, 1, 6, 4, 29, 2, 74, 0, 1),
(230, 5, 2, 6, 4, 29, 2, 74, 0, 1),
(231, 5, 3, 6, 4, 29, 2, 74, 0, 1),
(232, 5, 1, 20, 4, 31, 35, 72, 0, 1),
(233, 5, 2, 20, 4, 31, 35, 72, 0, 1),
(234, 5, 3, 20, 4, 31, 35, 72, 0, 1),
(235, 5, 1, 11, 4, 30, 33, 70, 0, 1),
(236, 5, 2, 11, 4, 30, 33, 70, 0, 1),
(237, 5, 3, 11, 4, 30, 33, 70, 0, 1),
(238, 5, 4, 1, 4, 26, 33, 69, 0, 1),
(239, 5, 4, 1, 4, 26, 33, 70, 0, 1),
(240, 5, 4, 13, 4, 27, 35, 72, 0, 1),
(241, 5, 5, 1, 4, 38, 36, NULL, 0, 1),
(242, 5, 6, NULL, 4, NULL, NULL, NULL, 1, 1),
(243, 5, 7, 1, 4, 36, 3, NULL, 0, 1),
(244, 5, 8, 1, 4, 35, 7, NULL, 0, 1),
(245, 5, 9, 1, 4, 60, 25, NULL, 0, 1),
(246, 1, 6, NULL, 5, NULL, NULL, NULL, 1, 1),
(247, 1, 7, 2, 5, 45, 29, 46, 0, 1),
(248, 1, 8, 2, 5, 62, 42, NULL, 0, 1),
(249, 1, 9, 2, 5, 62, 42, NULL, 0, 1),
(250, 1, 10, 2, 5, 49, 13, NULL, 0, 1),
(251, 1, 11, 2, 5, 52, 43, NULL, 0, 1),
(252, 2, 6, NULL, 5, NULL, NULL, NULL, 1, 1),
(253, 2, 7, 14, 5, 50, 13, 49, 0, 1),
(254, 2, 8, 14, 5, 50, 13, 49, 0, 1),
(255, 2, 9, 2, 5, 62, 42, NULL, 0, 1),
(256, 2, 10, 2, 5, 43, 8, 44, 0, 1),
(257, 2, 10, 2, 5, 43, 8, 45, 0, 1),
(258, 2, 10, 1, 5, 47, 10, 48, 0, 1),
(259, 3, 2, 20, 5, 46, 29, 46, 0, 1),
(260, 3, 3, 20, 5, 46, 29, 46, 0, 1),
(261, 3, 2, 13, 5, 44, 8, 44, 0, 1),
(262, 3, 3, 13, 5, 44, 8, 44, 0, 1),
(263, 3, 4, 11, 5, 48, 10, 48, 0, 1),
(264, 3, 5, 11, 5, 48, 10, 48, 0, 1),
(265, 3, 6, NULL, 5, NULL, NULL, NULL, 1, 1),
(266, 3, 7, 14, 5, 50, 13, 50, 0, 1),
(267, 3, 8, 14, 5, 50, 13, 50, 0, 1),
(268, 3, 9, 14, 5, 50, 13, 53, 0, 1),
(269, 3, 10, 14, 5, 50, 13, 53, 0, 1),
(270, 4, 3, 12, 5, 44, 8, 45, 0, 1),
(271, 4, 4, 12, 5, 44, 8, 45, 0, 1),
(272, 4, 3, 20, 5, 46, 29, 47, 0, 1),
(273, 4, 4, 20, 5, 46, 29, 47, 0, 1),
(274, 4, 5, 2, 5, 49, 13, NULL, 0, 1),
(275, 4, 6, NULL, 5, NULL, NULL, NULL, 1, 1),
(276, 4, 7, 14, 5, 50, 13, 51, 0, 1),
(277, 4, 8, 14, 5, 50, 13, 51, 0, 1),
(278, 4, 9, 2, 5, 43, 8, 44, 0, 1),
(279, 4, 9, 2, 5, 43, 8, 45, 0, 1),
(280, 4, 9, 4, 5, 47, 10, 48, 0, 1),
(281, 4, 10, 2, 5, 45, 29, 46, 0, 1),
(282, 5, 5, 2, 5, 49, 13, NULL, 0, 1),
(283, 5, 6, NULL, 5, NULL, NULL, NULL, 1, 1),
(284, 5, 7, 14, 5, 50, 13, 52, 0, 1),
(285, 5, 8, 14, 5, 50, 13, 52, 0, 1),
(286, 5, 9, 2, 5, 43, 8, 44, 0, 1),
(287, 5, 9, 2, 5, 43, 8, 45, 0, 1),
(288, 5, 9, 4, 5, 47, 10, 48, 0, 1),
(289, 5, 10, 2, 5, 45, 29, 46, 0, 1),
(290, 1, 6, NULL, 6, NULL, NULL, NULL, 1, 1),
(291, 1, 8, 2, 6, 62, 42, NULL, 0, 1),
(292, 1, 9, 2, 6, 62, 42, NULL, 0, 1),
(293, 2, 6, NULL, 6, NULL, NULL, NULL, 1, 1),
(294, 2, 8, 2, 6, 52, 43, NULL, 0, 1),
(295, 2, 9, 2, 6, 62, 42, NULL, 0, 1),
(296, 2, 10, 2, 6, 43, 8, 54, 0, 1),
(297, 2, 10, 2, 6, 43, 8, 55, 0, 1),
(298, 2, 10, 1, 6, 47, 10, 58, 0, 1),
(299, 3, 2, 14, 6, 50, 28, 63, 0, 1),
(300, 3, 3, 14, 6, 50, 28, 63, 0, 1),
(301, 3, 4, 11, 6, 48, 10, 58, 0, 1),
(302, 3, 5, 11, 6, 48, 10, 58, 0, 1),
(303, 3, 4, 13, 6, 46, 29, 56, 0, 1),
(304, 3, 5, 13, 6, 46, 29, 56, 0, 1),
(305, 3, 4, 14, 6, 44, 8, 54, 0, 1),
(306, 3, 5, 14, 6, 44, 8, 54, 0, 1),
(307, 3, 6, NULL, 6, NULL, NULL, NULL, 1, 1),
(308, 3, 7, 2, 6, 49, 28, NULL, 0, 1),
(309, 3, 8, 9, 6, 46, 29, 57, 0, 1),
(310, 3, 9, 9, 6, 46, 29, 57, 0, 1),
(311, 3, 8, 12, 6, 44, 8, 55, 0, 1),
(312, 3, 9, 12, 6, 44, 8, 55, 0, 1),
(313, 4, 2, 14, 6, 50, 28, 59, 0, 1),
(314, 4, 3, 14, 6, 50, 28, 59, 0, 1),
(315, 4, 4, 14, 6, 50, 28, 60, 0, 1),
(316, 4, 5, 14, 6, 50, 28, 60, 0, 1),
(317, 4, 6, NULL, 6, NULL, NULL, NULL, 1, 1),
(318, 4, 7, 2, 6, 49, 28, NULL, 0, 1),
(319, 4, 9, 2, 6, 43, 8, 54, 0, 1),
(320, 4, 9, 2, 6, 43, 8, 55, 0, 1),
(321, 4, 9, 4, 6, 47, 10, 58, 0, 1),
(322, 4, 10, 2, 6, 45, 29, 56, 0, 1),
(323, 5, 2, 14, 6, 50, 28, 61, 0, 1),
(324, 5, 3, 14, 6, 50, 28, 61, 0, 1),
(325, 5, 4, 14, 6, 50, 28, 62, 0, 1),
(326, 5, 5, 14, 6, 50, 28, 62, 0, 1),
(327, 5, 6, NULL, 6, NULL, NULL, NULL, 1, 1),
(328, 5, 7, 14, 6, 50, 28, NULL, 0, 1),
(329, 5, 9, 2, 6, 43, 8, 54, 0, 1),
(330, 5, 9, 2, 6, 43, 8, 55, 0, 1),
(331, 5, 9, 4, 6, 47, 10, 58, 0, 1),
(332, 5, 10, 2, 6, 45, 29, 56, 0, 1),
(333, 1, 5, 2, 12, 56, 1, NULL, 0, 1),
(334, 1, 6, NULL, 12, NULL, NULL, NULL, 1, 1),
(335, 1, 7, 21, 12, 55, 4, NULL, 0, 1),
(336, 1, 8, 21, 12, 54, 17, NULL, 0, 1),
(337, 1, 9, 2, 12, 61, 44, NULL, 0, 1),
(338, 2, 4, 2, 12, 58, 27, NULL, 0, 1),
(339, 2, 5, NULL, 12, NULL, NULL, NULL, 1, 1),
(340, 2, 6, 2, 12, 53, 6, NULL, 0, 1),
(341, 2, 7, 2, 12, 55, 4, NULL, 0, 1),
(342, 2, 9, 2, 12, 54, 17, NULL, 0, 1),
(343, 3, 3, 2, 12, 61, 44, NULL, 0, 1),
(344, 3, 4, 1, 12, 56, 1, NULL, 0, 1),
(345, 3, 5, NULL, 12, NULL, NULL, NULL, 1, 1),
(346, 3, 6, 21, 12, 59, 4, NULL, 0, 1),
(347, 3, 7, 21, 12, 59, 4, NULL, 0, 1),
(348, 3, 8, 2, 12, 55, 4, NULL, 0, 1),
(349, 3, 9, 2, 12, 53, 6, NULL, 0, 1),
(350, 4, 4, 2, 12, 58, 27, NULL, 0, 1),
(351, 4, 5, NULL, 12, NULL, NULL, NULL, 1, 1),
(352, 4, 6, 2, 12, 61, 44, NULL, 0, 1),
(353, 4, 7, 21, 12, 54, 17, NULL, 0, 1),
(354, 4, 8, 2, 12, 53, 6, NULL, 0, 1),
(355, 5, 4, 2, 12, 58, 27, NULL, 0, 1),
(356, 5, 5, NULL, 12, NULL, NULL, NULL, 1, 1),
(357, 5, 6, 21, 12, 59, 4, NULL, 0, 1),
(358, 5, 7, 21, 12, 59, 4, NULL, 0, 1),
(359, 5, 8, 2, 12, 56, 1, NULL, 0, 1);

-- --------------------------------------------------------

--
-- Stand-in structure for view `timetablereadable`
--
CREATE TABLE IF NOT EXISTS `timetablereadable` (
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

CREATE TABLE IF NOT EXISTS `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User Id',
  `userName` varchar(128) NOT NULL COMMENT 'User''s Full Name',
  `password` varchar(128) NOT NULL COMMENT 'User''s Passsword',
  PRIMARY KEY (`userId`),
  UNIQUE KEY `c_userName` (`userName`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`userId`, `userName`, `password`) VALUES
(1, 'abhijit', 'abhijit');

-- --------------------------------------------------------

--
-- Structure for view `batchcanoverlapreadable`
--
DROP TABLE IF EXISTS `batchcanoverlapreadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `batchcanoverlapreadable` AS select `bo`.`boId` AS `boId`,`b1`.`batchId` AS `b1Id`,`b1`.`batchName` AS `b1Name`,`b2`.`batchId` AS `b2Id`,`b2`.`batchName` AS `b2Name`,`s`.`snapshotName` AS `snapShotName` from (((`batch` `b1` join `batch` `b2`) join `batchcanoverlap` `bo`) join `snapshot` `s`) where ((`b1`.`batchId` = `bo`.`batchId`) and (`b2`.`batchId` = `bo`.`batchOverlapId`) and (`bo`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`b1`.`batchName`,`b2`.`batchName`;

-- --------------------------------------------------------

--
-- Structure for view `batchclassreadable`
--
DROP TABLE IF EXISTS `batchclassreadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `batchclassreadable` AS select `bc`.`bcId` AS `bcId`,`b`.`batchId` AS `batchId`,`b`.`batchName` AS `batchName`,`b`.`batchCount` AS `batchCount`,`c`.`classId` AS `classId`,`c`.`classShortName` AS `classShortName`,`c`.`classCount` AS `classCount`,`s`.`snapshotName` AS `snapshotName` from (((`batch` `b` join `class` `c`) join `batchclass` `bc`) join `snapshot` `s`) where ((`b`.`batchId` = `bc`.`batchId`) and (`c`.`classId` = `bc`.`classId`) and (`bc`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`c`.`classShortName`,`b`.`batchName`;

-- --------------------------------------------------------

--
-- Structure for view `batchroomreadable`
--
DROP TABLE IF EXISTS `batchroomreadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `batchroomreadable` AS select `br`.`brId` AS `brId`,`b`.`batchId` AS `batchId`,`b`.`batchName` AS `batchName`,`r`.`roomId` AS `roomId`,`r`.`roomShortName` AS `roomShortName`,`s`.`snapshotName` AS `snapshotName` from (((`batch` `b` join `room` `r`) join `batchroom` `br`) join `snapshot` `s`) where ((`b`.`batchId` = `br`.`batchId`) and (`r`.`roomId` = `br`.`roomId`) and (`br`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`b`.`batchName`,`r`.`roomShortName`;

-- --------------------------------------------------------

--
-- Structure for view `classroomreadable`
--
DROP TABLE IF EXISTS `classroomreadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `classroomreadable` AS select `cr`.`crId` AS `crId`,`c`.`classId` AS `classId`,`c`.`classShortName` AS `classShortName`,`r`.`roomId` AS `roomId`,`r`.`roomShortName` AS `roomShortName`,`s`.`snapshotName` AS `snapshotName` from (((`class` `c` join `room` `r`) join `classroom` `cr`) join `snapshot` `s`) where ((`c`.`classId` = `cr`.`classId`) and (`r`.`roomId` = `cr`.`roomId`) and (`cr`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`c`.`classShortName`,`r`.`roomShortName`;

-- --------------------------------------------------------

--
-- Structure for view `overlappingsbtreadable`
--
DROP TABLE IF EXISTS `overlappingsbtreadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `overlappingsbtreadable` AS select `sbto`.`osbtId` AS `osbtId`,`s1`.`subjectId` AS `subjectId1`,`s1`.`subjectShortName` AS `subject1`,`b1`.`batchId` AS `batchId1`,`b1`.`batchName` AS `batch1`,`t1`.`teacherId` AS `teacherId1`,`t1`.`teacherShortName` AS `teacher1`,`s2`.`subjectId` AS `subjectId2`,`s2`.`subjectShortName` AS `subject2`,`b2`.`batchId` AS `batchId2`,`b2`.`batchName` AS `batch2`,`t2`.`teacherId` AS `teacherId2`,`t2`.`teacherShortName` AS `teacher2`,`ss`.`snapshotName` AS `snapshotName` from (((((((((`subject` `s1` join `subject` `s2`) join `batch` `b1`) join `batch` `b2`) join `teacher` `t1`) join `teacher` `t2`) join `overlappingsbt` `sbto`) join `subjectbatchteacher` `sbt1`) join `subjectbatchteacher` `sbt2`) join `snapshot` `ss`) where ((`sbto`.`sbtId1` = `sbt1`.`sbtId`) and (`sbto`.`sbtId2` = `sbt2`.`sbtId`) and (`sbt1`.`subjectId` = `s1`.`subjectId`) and (`sbt1`.`batchId` = `b1`.`batchId`) and (`sbt1`.`teacherId` = `t1`.`teacherId`) and (`sbt2`.`subjectId` = `s2`.`subjectId`) and (`sbt2`.`batchId` = `b2`.`batchId`) and (`sbt2`.`teacherId` = `t2`.`teacherId`) and (`sbto`.`snapshotId` = `ss`.`snapshotId`)) order by `ss`.`snapshotName`,`s1`.`subjectShortName`,`s2`.`subjectShortName`;

-- --------------------------------------------------------

--
-- Structure for view `subjectbatchteacherreadable`
--
DROP TABLE IF EXISTS `subjectbatchteacherreadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `subjectbatchteacherreadable` AS select `sbt`.`sbtId` AS `sbtId`,`s`.`subjectId` AS `subjectId`,`s`.`subjectShortName` AS `subjectShortName`,`b`.`batchId` AS `batchId`,`b`.`batchName` AS `batchName`,`t`.`teacherId` AS `teacherId`,`t`.`teacherShortName` AS `teacherShortName`,`ss`.`snapshotName` AS `snapshotName` from ((((`subject` `s` join `batch` `b`) join `subjectbatchteacher` `sbt`) join `teacher` `t`) join `snapshot` `ss`) where ((`sbt`.`subjectId` = `s`.`subjectId`) and (`sbt`.`batchId` = `b`.`batchId`) and (`sbt`.`teacherId` = `t`.`teacherId`) and (`sbt`.`snapshotId` = `ss`.`snapshotId`)) order by `ss`.`snapshotName`,`s`.`subjectShortName`,`b`.`batchName`,`t`.`teacherShortName`;

-- --------------------------------------------------------

--
-- Structure for view `subjectclassteacherreadable`
--
DROP TABLE IF EXISTS `subjectclassteacherreadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `subjectclassteacherreadable` AS select `sct`.`sctId` AS `sctId`,`c`.`classId` AS `classId`,`c`.`classShortName` AS `classShortName`,`s`.`subjectId` AS `subjectId`,`s`.`subjectShortName` AS `subjectShortName`,`t`.`teacherId` AS `teacherId`,`t`.`teacherShortName` AS `teacherShortName`,`ss`.`snapshotName` AS `snapshotName` from ((((`subject` `s` join `class` `c`) join `teacher` `t`) join `subjectclassteacher` `sct`) join `snapshot` `ss`) where ((`s`.`subjectId` = `sct`.`subjectId`) and (`t`.`teacherId` = `sct`.`teacherId`) and (`c`.`classId` = `sct`.`classId`) and (`sct`.`snapshotId` = `ss`.`snapshotId`)) order by `ss`.`snapshotName`,`s`.`subjectShortName`,`c`.`classShortName`,`t`.`teacherShortName`;

-- --------------------------------------------------------

--
-- Structure for view `subjectroomreadable`
--
DROP TABLE IF EXISTS `subjectroomreadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `subjectroomreadable` AS select `sr`.`srId` AS `srId`,`s`.`subjectId` AS `subjectId`,`s`.`subjectShortName` AS `subjectShortName`,`r`.`roomId` AS `roomId`,`r`.`roomShortName` AS `roomShortName`,`ss`.`snapshotName` AS `snapshotName` from (((`subject` `s` join `room` `r`) join `subjectroom` `sr`) join `snapshot` `ss`) where ((`s`.`subjectId` = `sr`.`subjectId`) and (`r`.`roomId` = `sr`.`roomId`) and (`r`.`snapshotId` = `ss`.`snapshotId`)) order by `ss`.`snapshotName`,`s`.`subjectShortName`,`r`.`roomShortName`;

-- --------------------------------------------------------

--
-- Structure for view `teacherreadable`
--
DROP TABLE IF EXISTS `teacherreadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `teacherreadable` AS select `t`.`teacherId` AS `teacherId`,`t`.`teacherName` AS `teacherName`,`t`.`teacherShortName` AS `teacherShortName`,`t`.`minHrs` AS `minHrs`,`t`.`maxHrs` AS `maxHrs`,`d`.`deptShortName` AS `deptShortName`,`s`.`snapshotName` AS `snapshotName` from ((`teacher` `t` join `dept` `d`) join `snapshot` `s`) where ((`t`.`deptId` = `d`.`deptId`) and (`t`.`snapshotId` = `s`.`snapshotId`)) order by `s`.`snapshotName`,`t`.`teacherShortName`;

-- --------------------------------------------------------

--
-- Structure for view `timetablereadable`
--
DROP TABLE IF EXISTS `timetablereadable`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `timetablereadable` AS select `tt`.`ttId` AS `ttId`,`tt`.`day` AS `day`,`tt`.`slotNo` AS `slotNo`,`r`.`roomShortName` AS `roomShortName`,`c`.`classShortName` AS `classShortName`,`s`.`subjectShortName` AS `subjectShortName`,`t`.`teacherShortName` AS `teacherShortName`,`b`.`batchName` AS `batchName`,`tt`.`isFixed` AS `isFixed`,`sn`.`snapshotName` AS `snapshotName` from ((((((`timetable` `tt` join `room` `r`) join `class` `c`) join `subject` `s`) join `teacher` `t`) join `batch` `b`) join `snapshot` `sn`) where ((`tt`.`classId` = `c`.`classId`) and (`tt`.`subjectId` = `s`.`subjectId`) and (`tt`.`batchId` = `b`.`batchId`) and (`tt`.`batchId` is not null) and (`tt`.`roomId` = `r`.`roomId`) and (`tt`.`teacherId` = `t`.`teacherId`) and (`tt`.`snapshotId` = `sn`.`snapshotId`) and (`tt`.`isFixed` = 0)) union select `tt`.`ttId` AS `ttId`,`tt`.`day` AS `day`,`tt`.`slotNo` AS `slotNo`,`r`.`roomShortName` AS `roomShortName`,`c`.`classShortName` AS `classShortName`,`s`.`subjectShortName` AS `subjectShortName`,`t`.`teacherShortName` AS `teacherShortName`,NULL AS `NULL`,`tt`.`isFixed` AS `isFixed`,`sn`.`snapshotName` AS `snapshotName` from (((((`timetable` `tt` join `room` `r`) join `class` `c`) join `subject` `s`) join `teacher` `t`) join `snapshot` `sn`) where ((`tt`.`classId` = `c`.`classId`) and (`tt`.`subjectId` = `s`.`subjectId`) and (`tt`.`roomId` = `r`.`roomId`) and (`tt`.`teacherId` = `t`.`teacherId`) and isnull(`tt`.`batchId`) and (`tt`.`snapshotId` = `sn`.`snapshotId`) and (`tt`.`isFixed` = 0)) union select `tt`.`ttId` AS `ttId`,`tt`.`day` AS `day`,`tt`.`slotNo` AS `slotNo`,NULL AS `NULL`,`c`.`classShortName` AS `classShortName`,NULL AS `NULL`,NULL AS `NULL`,NULL AS `NULL`,1 AS `TRUE`,`sn`.`snapshotName` AS `snapshotName` from ((`timetable` `tt` join `class` `c`) join `snapshot` `sn`) where ((`tt`.`isFixed` = 1) and (`tt`.`classId` = `c`.`classId`) and (`tt`.`snapshotId` = `sn`.`snapshotId`)) order by `ttId`;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `batch`
--
ALTER TABLE `batch`
  ADD CONSTRAINT `batch_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE;

--
-- Constraints for table `batchcanoverlap`
--
ALTER TABLE `batchcanoverlap`
  ADD CONSTRAINT `batchcanoverlap_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `batchcanoverlap_ibfk_2` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `batchcanoverlap_ibfk_3` FOREIGN KEY (`batchOverlapId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE;

--
-- Constraints for table `batchclass`
--
ALTER TABLE `batchclass`
  ADD CONSTRAINT `batchclass_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `batchclass_ibfk_2` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `batchclass_ibfk_3` FOREIGN KEY (`classId`) REFERENCES `class` (`classId`) ON DELETE CASCADE;

--
-- Constraints for table `batchroom`
--
ALTER TABLE `batchroom`
  ADD CONSTRAINT `batchroom_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `batchroom_ibfk_2` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `batchroom_ibfk_3` FOREIGN KEY (`roomId`) REFERENCES `room` (`roomId`) ON DELETE CASCADE;

--
-- Constraints for table `class`
--
ALTER TABLE `class`
  ADD CONSTRAINT `class_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE;

--
-- Constraints for table `classroom`
--
ALTER TABLE `classroom`
  ADD CONSTRAINT `classroom_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `classroom_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `class` (`classId`) ON DELETE CASCADE,
  ADD CONSTRAINT `classroom_ibfk_3` FOREIGN KEY (`roomId`) REFERENCES `room` (`roomId`) ON DELETE CASCADE;

--
-- Constraints for table `config`
--
ALTER TABLE `config`
  ADD CONSTRAINT `config_ibfk_1` FOREIGN KEY (`incharge`) REFERENCES `user` (`userId`) ON DELETE CASCADE;

--
-- Constraints for table `fixedentry`
--
ALTER TABLE `fixedentry`
  ADD CONSTRAINT `fixedentry_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `fixedentry_ibfk_2` FOREIGN KEY (`ttId`) REFERENCES `timetable` (`ttId`) ON DELETE CASCADE;

--
-- Constraints for table `overlappingsbt`
--
ALTER TABLE `overlappingsbt`
  ADD CONSTRAINT `overlappingsbt_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `overlappingsbt_ibfk_2` FOREIGN KEY (`sbtId1`) REFERENCES `subjectbatchteacher` (`sbtId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `overlappingsbt_ibfk_3` FOREIGN KEY (`sbtId2`) REFERENCES `subjectbatchteacher` (`sbtId`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Constraints for table `subjectbatchteacher`
--
ALTER TABLE `subjectbatchteacher`
  ADD CONSTRAINT `subjectbatchteacher_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectbatchteacher_ibfk_2` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectbatchteacher_ibfk_3` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`subjectId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectbatchteacher_ibfk_4` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`teacherId`) ON DELETE CASCADE;

--
-- Constraints for table `subjectclassteacher`
--
ALTER TABLE `subjectclassteacher`
  ADD CONSTRAINT `subjectclassteacher_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectclassteacher_ibfk_2` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`subjectId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectclassteacher_ibfk_3` FOREIGN KEY (`classId`) REFERENCES `class` (`classId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectclassteacher_ibfk_4` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`teacherId`) ON DELETE CASCADE;

--
-- Constraints for table `subjectroom`
--
ALTER TABLE `subjectroom`
  ADD CONSTRAINT `subjectroom_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectroom_ibfk_2` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`subjectId`) ON DELETE CASCADE,
  ADD CONSTRAINT `subjectroom_ibfk_3` FOREIGN KEY (`roomId`) REFERENCES `room` (`roomId`) ON DELETE CASCADE;

--
-- Constraints for table `teacher`
--
ALTER TABLE `teacher`
  ADD CONSTRAINT `teacher_ibfk_1` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE;

--
-- Constraints for table `timetable`
--
ALTER TABLE `timetable`
  ADD CONSTRAINT `timetable_ibfk_1` FOREIGN KEY (`roomId`) REFERENCES `room` (`roomId`) ON DELETE CASCADE,
  ADD CONSTRAINT `timetable_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `class` (`classId`) ON DELETE CASCADE,
  ADD CONSTRAINT `timetable_ibfk_3` FOREIGN KEY (`batchId`) REFERENCES `batch` (`batchId`) ON DELETE CASCADE,
  ADD CONSTRAINT `timetable_ibfk_4` FOREIGN KEY (`subjectId`) REFERENCES `subject` (`subjectId`) ON DELETE CASCADE,
  ADD CONSTRAINT `timetable_ibfk_5` FOREIGN KEY (`teacherId`) REFERENCES `teacher` (`teacherId`) ON DELETE CASCADE,
  ADD CONSTRAINT `timetable_ibfk_6` FOREIGN KEY (`snapshotId`) REFERENCES `snapshot` (`snapshotId`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

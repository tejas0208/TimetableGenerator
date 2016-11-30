DROP DATABASE IF EXISTS timetable;
CREATE DATABASE timetable;
USE timetable;

CREATE TABLE config
(
configid int auto_increment primary key,
daybegin time,
slotduration int,
nslots	int,
dept	varchar(256),
incharge	int
);

CREATE TABLE user
(
userid	int  auto_increment primary key,
username varchar(256) not null,
password varchar(256) not null
);

CREATE TABLE role
(
roleid	int  auto_increment primary key,
rolename varchar(256) not null
);

CREATE TABLE capability
(
capid int  auto_increment primary key,
capname	varchar(256) not null,
roleid	int
);

CREATE TABLE teacher
(
teacherid	int  auto_increment primary key,
teachername	varchar(256) not null,
teachershortname	varchar(16) not null,
deptid	int,	
minhrs	int,
maxhrs int
);

CREATE TABLE dept 
(
deptid	int  auto_increment primary key,
deptname	varchar(256) not null
);

CREATE TABLE class
(
classid	int  auto_increment primary key,
classname	varchar(256) not null,
classshortname	varchar(32) not null
);

CREATE TABLE batch
(
batchid	int auto_increment primary key,
classid int,
batchname	varchar(32) not null,
batchcount	int
);

CREATE TABLE room
(
roomid	int auto_increment primary key,
roomname	varchar(32) not null,
roomcount	int
);

CREATE TABLE subject
(
subjectid	int auto_increment primary key,
subjectname	varchar(32) not null,
subjectshortname	varchar(8) not null,
totalhrs	int,
eachslot	int,
coursecode	varchar(32) not null
);

CREATE TABLE subject_batch
(
sbid	int auto_increment primary key,
subjectid	int,
batchid	int
);

CREATE TABLE subject_teacher
(
stid	int auto_increment primary key,
subjectid	int,
teacherid	int
);

CREATE TABLE class_room
(
crid	int auto_increment primary key,
classid	int,
roomid	int
);

CREATE TABLE batch_room
(
brid	int auto_increment primary key,
batchid	int,
roomid	int
);

CREATE TABLE timetable
(
ttid	int auto_increment primary key,
roomid	int,
slotno	int,
day smallint, 
classid	int,
subjectid int,
teacherid	int,
batchid	int,
configid	int
);	

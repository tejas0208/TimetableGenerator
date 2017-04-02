use timeTable;
drop table if exists slots;
create table slots 
(
slotNo int 
);
drop table if exists dump; 
create table dump
(tid int,
day int
);

DELIMITER $$
DROP TRIGGER IF EXISTS check_slot_in_range;
CREATE TRIGGER check_slot_in_range BEFORE INSERT ON timeTable
FOR EACH ROW
BEGIN
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
	IF NEW.slotNo > t_nSlots or NEW.slotNo < 0 /*@maxslot  */
	THEN
		/*insert into DUMMY (maxslots, currslots) VALUES (@maxslot, New.slotNo); */
		SIGNAL SQLSTATE VALUE '45000' SET MESSAGE_TEXT = 'SLOT BIGGER THAN ALLOWED OR LESS THAN ZERO';
	END IF;
	/*insert into dump(tid,day) values (NEW.teacherId, NEW.day);
	insert into slots(slotNo) select slotNo from timeTable where NEW.teacherId=teacherId and NEW.day=day;  */

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
END;
$$
/*insert into timeTable (day,slotNo,roomId,classId,subjectId,teacherId,batchId,configId,isFixed)  values (1,11,1,1,1,1,1,1,0); 
insert into timeTable (day,slotNo,roomId,classId,subjectId,teacherId,batchId,configId,isFixed)  values (1,10,1,1,1,1,1,1,0); */
$$
select * from slots;
$$

/*select * from timeTable where slotNo>=11;
delete from timeTable where slotNo>=11;
SELECT 'printing dummy';
select * from DUMMY; */

	/*IF NEW.slotNo  > COUNT(SELECT nSlots FROM config WHERE configId=1)*/
	/*SELECT nSlots into maxslot FROM config where configId=1 LIMIT 1; */
	/*call maxSlots(maxslot); */
	/*select nSlots into @maxslot from config where configId=1; */
	/*SET @maxslot := (SELECT nSlots from config where configId=1);  */
	/*SET @maxslot := (SELECT COUNT(*) from config); */
/*
DELIMITER $$
DROP PROCEDURE IF EXISTS maxSlots;
CREATE PROCEDURE maxSlots(OUT maxslot int)
BEGIN
	SELECT nSlots into maxslot FROM config where configid=1 LIMIT 1;
	SELECT maxslot;
END;
$$
*/

/*
 DROP TABLE IF EXISTS DUMMY;
CREATE TABLE DUMMY 
(
maxslots int,
currslots int
);

*/

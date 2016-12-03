CREATE TRIGGER check_available 
BEFORE INSERT ON Checkout 
FOR EACH ROW 
BEGIN
  SELECT IF (COUNT(new.ItemID) > Items.NumAvailable) THEN
    DECLARE dummy INT;
        SELECT 'No more items to check out!' INTO dummy 
  FROM new NATURAL JOIN Items WHERE NEW.ItemID = Items.ItemID
  END IF;
END

/*----------------------------------------------------------------------------------*/
DELIMITER $$
CREATE TRIGGER reservation_bi BEFORE INSERT ON reservation FOR EACH ROW
BEGIN
DECLARE found_count,dummy INT;
SELECT COUNT(1) INTO found_count FROM flights WHERE numflight=new.numflight;
IF found_count = 0 THEN
    SELECT 'Cannot Insert This Reservation Because Flight Number is Invalid'
    INTO dummy FROM reservation WHERE numflight=new.numflight;
END IF;

END; $$
DELIMITER ;


/*----------------------------------------------------------------------------------*/
/* Example 6-18. Using a nonexistent column name to force an error to the calling program */
DELIMITER $$
CREATE TRIGGER reservation_bi BEFORE INSERT ON reservation FOR EACH ROW
BEGIN

DECLARE found_count,dummy INT;

SELECT COUNT(1) INTO found_count FROM flights WHERE numflight=new.numflight;
IF found_count = 0 THEN
    SELECT 'Cannot Insert This Reservation Because Flight Number is Invalid'
    INTO dummy FROM reservation WHERE numflight=new.numflight;
END IF;

END; $$
DELIMITER ;
    CREATE PROCEDURE sp_update_employee_dob2
        (p_employee_id INT, p_dob DATE)
    BEGIN
        IF datediff(curdate(),p_dob)<(16*365) THEN
            UPDATE `Error: employee is too young; Employee must be 16 years or older`
                SET x=1;
        ELSE
            UPDATE employees
               SET date_of_birth=dob
            WHERE employee_id=p_dob;
       END IF;
    END;

/* Example 6-19. Standard procedure to emulate SIGNAL */
    CREATE PROCEDURE `my_signal`(in_errortext VARCHAR(255))
    BEGIN
        SET @sql=CONCAT('UPDATE `',in_errortext,'` SET x=1');
        PREPARE my_signal_stmt FROM @sql;
        EXECUTE my_signal_stmt;
        DEALLOCATE PREPARE my_signal_stmt;
    END;

/*Example 6-20. Using our SIGNAL emulation procedure to raise an error */
    CREATE PROCEDURE sp_update_employee_dob2
        (p_employee_id INT, p_dob DATE)
    BEGIN
        IF datediff(curdate(),p_dob)<(16*365) THEN
            CALL my_signal('Error: employee is too young; Employee must be 16 years or older')
        ELSE
            UPDATE employees
               SET date_of_birth=dob
            WHERE employee_id=p_dob;
       END IF;
    END;

/*----------------------------------------------------------------------------------*/

CREATE TABLE person (
    id              INT         NOT NULL AUTO_INCREMENT PRIMARY KEY
,   first_name      VARCHAR(64) NOT NULL    
,   last_name       VARCHAR(64) NOT NULL
,   initials        VARCHAR(8)
)
DELIMITER go
CREATE PROCEDURE p_validate_initials(
    IN      p_first_name    VARCHAR(64)
,   INOUT   p_initials      VARCHAR(64) 
)
DETERMINISTIC                                                                   -- same arguments yield same result, always
NO SQL                                                                          -- does not execute SQL statements, only procedural logic
_main: BEGIN

    DECLARE WARN_CORRECTED_INITIALS CONDITION FOR SQLSTATE '01000';
    DECLARE ERR_INITIALS_DONT_MATCH_FIRSTNAME CONDITION FOR SQLSTATE '45000';
    DECLARE ERR_INITIALS_ILLFORMATTED CONDITION FOR SQLSTATE '45000';

    IF      p_first_name IS NULL THEN
        LEAVE _main;                                                            -- nothing to validate
    ELSEIF   p_initials IS NULL THEN                                            -- initials are NULL, correct:
        SET p_initials := CONCAT(LEFT(p_first_name, 1), '.');                   -- take the first letter of first_name
        SIGNAL WARN_CORRECTED_INITIALS                                          -- warn about the corrective measure
        SET MESSAGE_TEXT = 'Corrected NULL value for initials to match value for first_name.';
    ELSEIF   BINARY LEFT(p_first_name, 1) != LEFT(p_initials, 1) THEN           -- initials don't match first_name
        SIGNAL ERR_INITIALS_DONT_MATCH_FIRSTNAME                                -- raise an error
        SET MESSAGE_TEXT = 'The first letter of the value for initials does not match the first letter of the value for first_name';
    END IF;
    IF NOT p_initials REGEXP '^([A-Z][.])+$' THEN                               -- if initials don't match the correct pattern
        SIGNAL ERR_INITIALS_ILLFORMATTED                                        -- raise an error
        SET MESSAGE_TEXT = 'The value for initials must consist of upper case letters separated by periods.';
    END IF;
END;
go
DELIMITER ;

set @initials := null;

call p_validate_initials('Roland', @initials);


/*----------------------------------------------------------------------------------*/

DELIMITER $$
CREATE TRIGGER example_before_insert_allow_only_one_active
     BEFORE INSERT ON example_tbl FOR EACH ROW
     BEGIN
          IF NEW.active = 1 AND (SELECT COUNT(id) FROM example_tbl 
               WHERE active=1 AND foreign_key_id=NEW.foreign_key_id) > 0
          THEN
               SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Cannot add or update row: only one active row allowed per type';
          END IF;
     END;
$$
CREATE TRIGGER example_before_update_allow_only_one_active
     BEFORE UPDATE ON example_tbl  FOR EACH ROW
     BEGIN
          IF NEW.active = 1 AND (SELECT COUNT(id) FROM example_tbl
               WHERE id<>NEW.id AND active=1 AND foreign_key_id=NEW.foreign_key_id) > 0
          THEN
               SIGNAL SQLSTATE '45000'
                    SET MESSAGE_TEXT = 'Cannot add or update row: only one active row allowed per type';
          END IF;
     END;
$$

UPDATE example_tbl SET active=1 WHERE id=2;

DELIMITER $$

CREATE TRIGGER example_before_insert_allow_only_one_active
     BEFORE INSERT ON example_tbl FOR EACH ROW
     BEGIN
          IF NEW.active = 1 AND (SELECT COUNT(id) FROM example_tbl
               WHERE active=1 AND foreign_key_id=NEW.foreign_key_id) > 0
          THEN
               CALL `'Cannot add or update row: only one active row allowed per type'`;
          END IF;
     END;
$$

CREATE TRIGGER example_before_update_allow_only_one_active
     BEFORE UPDATE ON example_tbl  FOR EACH ROW
     BEGIN
          IF NEW.active = 1 AND (SELECT COUNT(id) FROM example_tbl
               WHERE id<>NEW.id AND active=1 AND foreign_key_id=NEW.foreign_key_id) > 0
          THEN
               CALL `'Cannot add or update row: only one active row allowed per type'`;
          END IF;
     END;
$$

UPDATE example_tbl SET active=1 WHERE id=2;

/*----------------------------------------------------------------------------------*/
-- make sure that `person` can be created
DROP VIEW   IF EXISTS `person`;
DROP TABLE  IF EXISTS `person`;

-- table whose data must be validated
CREATE TABLE `person`
(
	`id`  mediumint UNSIGNED NOT NULL AUTO_INCREMENT,
	`name`  char(50) NOT NULL,
	`email`  char(80) NOT NULL,
	PRIMARY KEY (`id`)
)
	ENGINE = Aria;
-- validate email
CREATE TRIGGER `person_validate_insert`
	BEFORE INSERT
	ON `person`
	FOR EACH ROW
BEGIN
	IF NEW.`email` NOT LIKE '%_@%_.__%' THEN
		SIGNAL SQLSTATE VALUE '45000'
			SET MESSAGE_TEXT = '[table:person] - `email` column is not valid';
	END IF;
END;
INSERT INTO `person`        (`name`, `email`) VALUES         ('Emiliano Zapata', 'zapata@revolucion.mx');
INSERT INTO `person`         (`name`, `email`) VALUES         ('John Doe', 'misterdoe@nowhere');

/*----------------------------------------------------------------------------------*/
CREATE TABLE test1(a1 INT);
CREATE TABLE test2(a2 INT);
CREATE TABLE test3(a3 INT NOT NULL AUTO_INCREMENT PRIMARY KEY);
CREATE TABLE test4(
  a4 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  b4 INT DEFAULT 0
);

delimiter |

CREATE TRIGGER testref BEFORE INSERT ON test1
  FOR EACH ROW
  BEGIN
    INSERT INTO test2 SET a2 = NEW.a1;
    DELETE FROM test3 WHERE a3 = NEW.a1;
    UPDATE test4 SET b4 = b4 + 1 WHERE a4 = NEW.a1;
  END;
|

delimiter ;

INSERT INTO test3 (a3) VALUES
  (NULL), (NULL), (NULL), (NULL), (NULL),
  (NULL), (NULL), (NULL), (NULL), (NULL);

INSERT INTO test4 (a4) VALUES
  (0), (0), (0), (0), (0), (0), (0), (0), (0), (0);




/*----------------------------------------------------------------------------------*/

-- SCHEMA

DROP TABLE IF EXISTS customer;
CREATE TABLE IF NOT EXISTS customer (
	id INT NOT NULL auto_increment,
	age INT NOT NULL,
	name varchar(128) not null,
	email varchar(128) not null,
	PRIMARY KEY (id),
	UNIQUE KEY email (email)
	-- CONSTRAINT chk_age CHECK (age > 18) -- MySQL ignores constraints
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



-- STORED PROCEDURES

DROP PROCEDURE IF EXISTS validate_customer;
DELIMITER $$
CREATE PROCEDURE validate_customer(
	IN age INT,
	IN email VARCHAR(128)
)
DETERMINISTIC
NO SQL
BEGIN
	IF age < 18 THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Age must be gte 18';
	END IF;
	IF NOT (SELECT email REGEXP '$[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$') THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Wrong email';
    END IF;
END$$
DELIMITER ;



-- TRIGGERS

DELIMITER $$
CREATE TRIGGER validate_customer_insert
BEFORE INSERT ON customer FOR EACH ROW
BEGIN
	CALL validate_customer(NEW.age, NEW.email);
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER validate_customer_update
BEFORE UPDATE ON customer FOR EACH ROW
BEGIN
	CALL validate_customer(NEW.age, NEW.email);
END$$
DELIMITER ;

-- RUN THEM ALL :)

INSERT INTO customer VALUES (NULL, 10, "Alex", "alex@example.com"); -- Error Code: 1644: Age must be gte 18
INSERT INTO customer VALUES (NULL, 20, "Alex", "alex"); -- Error Code: 1644: Wrong email
SELECT * FROM customer; -- Will be empty



/*----------------------------------------------------------------------------------*/

SELECT a,b,a+b INTO OUTFILE '/tmp/result.txt'
  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"'
  LINES TERMINATED BY '\n'
  FROM test_table;


/*----------------------------------------------------------------------------------*/

CREATE PROCEDURE dorepeat(p1 INT)
BEGIN
  SET @x = 0;
  REPEAT SET @x = @x + 1; UNTIL @x > p1 END REPEAT;
END;
delimiter //

CREATE PROCEDURE dorepeat(p1 INT)
    -> BEGIN
    ->   SET @x = 0;
    ->   REPEAT SET @x = @x + 1; UNTIL @x > p1 END REPEAT;
    -> END
    -> //
Query OK, 0 rows affected (0.00 sec)

delimiter ;

CALL dorepeat(1000);
Query OK, 0 rows affected (0.00 sec)

SELECT @x;
+------+
| @x   |
+------+
| 1001 |
+------+
1 row in set (0.00 sec)

CREATE FUNCTION hello (s CHAR(20))
RETURNS CHAR(50) DETERMINISTIC
    -> RETURN CONCAT('Hello, ',s,'!');
Query OK, 0 rows affected (0.00 sec)

SELECT hello('world');
+----------------+
| hello('world') |
+----------------+
| Hello, world!  |
+----------------+
1 row in set (0.00 sec)

/*----------------------------------------------------------------------------------*/

DELIMITER $$
CREATE PROCEDURE my_procedure_Local_Variables()
BEGIN   /* declare local variables */   
DECLARE a INT DEFAULT 10;   
DECLARE b, c INT;    /* using the local variables */   
SET a = a + 100;   
SET b = 2;   
SET c = a + b;    
BEGIN      /* local variable in nested block */      
DECLARE c INT;             
SET c = 5;       
/* local variable c takes precedence over the one of the          
same name declared in the enclosing block. */       
SELECT a, b, c;   
END;    
SELECT a, b, c;
END$$
CALL my_procedure_Local_Variables();

-- user variables example
DELIMITER $$
CREATE PROCEDURE my_procedure_User_Variables()
BEGIN   
SET @x = 15;       
SET @y = 10;       
SELECT @x, @y, @x-@y;   
END$$
CALL my_procedure_User_Variables() ;


DELIMITER $$
CREATE PROCEDURE `hr`.`my_proc_CASE` 
(INOUT no_employees INT, IN salary INT)
BEGIN
CASE
WHEN (salary>10000) 
THEN (SELECT COUNT(job_id) INTO no_employees 
FROM jobs 
WHERE min_salary>10000);
WHEN (salary<10000) 
THEN (SELECT COUNT(job_id) INTO no_employees 
FROM jobs 
WHERE min_salary<10000);
ELSE (SELECT COUNT(job_id) INTO no_employees 
FROM jobs WHERE min_salary=10000);
END CASE;
END$$

/*----------------------------------------------------------------------------------*/

create procedure helloworld() Select 'hello test';
CALL helloworld();
DELIMITER $$
CREATE
PROCEDURE `restaurent`.`anoter_test`(IN restaurant_name VARCHAR(255))
BEGIN
SELECT * FROM `restaurents` WHERE `restaurents`.`name` = restaurant_name;
END$$
DELIMITER ;


DECLARE count_student INT(5) default 0;
SELECT count(*) INTO count_student FROM student_table;
IF count_student > 5 THEN
       SELECT * FROM student_table;
ELSE
SELECT 'Very less student';
END IF;

CASE
WHEN i >2 THEN
SELECT 'it is two';
WHEN i  < 2 THEN
Select 'it is less then 2';
ELSE
SELECT 'no eyse';
END CASE;

/*----------------------------------------------------------------------------------*/
DELIMITER //
 
CREATE PROCEDURE `var_proc` (IN paramstr VARCHAR(20))
BEGIN
    DECLARE a, b INT DEFAULT 5;
    DECLARE str VARCHAR(50);
    DECLARE today TIMESTAMP DEFAULT CURRENT_DATE;
    DECLARE v1, v2, v3 TINYINT;    
 
    INSERT INTO table1 VALUES (a);
    SET str = 'I am a string';
    SELECT CONCAT(str,paramstr), today FROM table2 WHERE b >=5; 
END //
DELIMITER //
 
CREATE PROCEDURE `proc_IF` (IN param1 INT)
BEGIN
    DECLARE variable1 INT;
    SET variable1 = param1 + 1;
     
    IF variable1 = 0 THEN
        SELECT variable1;
    END IF;
 
    IF param1 = 0 THEN
        SELECT 'Parameter value = 0';
    ELSE
        SELECT 'Parameter value <> 0';
    END IF;
END //
DELIMITER //
 
CREATE PROCEDURE `proc_CASE` (IN param1 INT)
BEGIN
    DECLARE variable1 INT;
    SET variable1 = param1 + 1;
     
    CASE variable1
        WHEN 0 THEN
            INSERT INTO table1 VALUES (param1);
        WHEN 1 THEN
            INSERT INTO table1 VALUES (variable1); 
        ELSE
            INSERT INTO table1 VALUES (99);
    END CASE;
 
END //
DELIMITER //
 
CREATE PROCEDURE `proc_CASE` (IN param1 INT)
BEGIN
    DECLARE variable1 INT;
    SET variable1 = param1 + 1;
     
    CASE
        WHEN variable1 = 0 THEN
            INSERT INTO table1 VALUES (param1);
        WHEN variable1 = 1 THEN
            INSERT INTO table1 VALUES (variable1); 
        ELSE
            INSERT INTO table1 VALUES (99);
    END CASE;
 
END //

DELIMITER //
 
CREATE PROCEDURE `proc_WHILE` (IN param1 INT)
BEGIN
    DECLARE variable1, variable2 INT;
    SET variable1 = 0;
     
    WHILE variable1 < param1 DO
        INSERT INTO table1 VALUES (param1);
        SELECT COUNT(*) INTO variable2 FROM table1;
        SET variable1 = variable1 + 1;
    END WHILE;
END //

-- cursors
ELIMITER //
 
CREATE PROCEDURE `proc_CURSOR` (OUT param1 INT)
BEGIN
    DECLARE a, b, c INT;
    DECLARE cur1 CURSOR FOR SELECT col1 FROM table1;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET b = 1;
    OPEN cur1;
 
    SET b = 0;
    SET c = 0;
    
    WHILE b = 0 DO
        FETCH cur1 INTO a;
        IF b = 0 THEN
            SET c = c + a;
    END IF;  
    END WHILE;
 
    CLOSE cur1;
    SET param1 = c;
 
END //


/*----------------------------------------------------------------------------------*/

SELECT @total_count:=COUNT(*), @total_price:=SUM(quantity*price) FROM items ...
 SELECT weight INTO @x FROM p_status where tcount=['value'] LIMIT 1;


/*----------------------------------------------------------------------------------*/
CREATE PROCEDURE GetCustomerLevel(
    in  p_customerNumber int(11), 
    out p_customerLevel  varchar(10))
BEGIN
    DECLARE creditlim double;
 
    SELECT creditlimit INTO creditlim
    FROM customers
    WHERE customerNumber = p_customerNumber;
 
    IF creditlim > 50000 THEN
 SET p_customerLevel = 'PLATINUM';
    ELSEIF (creditlim <= 50000 AND creditlim >= 10000) THEN
        SET p_customerLevel = 'GOLD';
    ELSEIF creditlim < 10000 THEN
        SET p_customerLevel = 'SILVER';
    END IF;
 
END$$

/*----------------------------------------------------------------------------------*/

SELECT myvalue INTO @myvar FROM mytable WHERE anothervalue = 1;
SELECT a, b INTO @a, @b FROM mytable LIMIT 1;
/*----------------------------------------------------------------------------------*/


DECLARE pUSR_ID BIGINT;
DECLARE pPRJ_ID BIGINT;
DECLARE pUSR_LAN_ID BIGINT;

SELECT USR_ID, USR_Login, USR_Password, USR_Archived, USR_Deleted, 
  USR_ID, USR_PRJ_ID, USR_LAN_ID INTO pUSR_ID, pPRJ_ID, pUSR_LAN_ID
FROM tblUsers
WHERE USR_Login = 'foobar';
/*----------------------------------------------------------------------------------*/
DECLARE var_sort_id INT;
SELECT MAX(sortid) AS maxsortid INTO var_sort_id FROM vtiger_role2picklist WHERE roleid = 'H5' AND picklistid = 47;

SET pickvalue = (SELECT id FROM vtiger_picklistvalues_seq);
SET sort_id = (SELECT max(sortid) FROM vtiger_role2picklist WHERE roleid = 'H5' AND picklistid = 47);
/*----------------------------------------------------------------------------------*/
-- something wrong here
DELIMITER $$
DROP TRIGGER IF EXISTS cfmaj$$
CREATE TRIGGER cfmaj AFTER INSERT ON vtiger_cf_608
FOR EACH ROW
BEGIN
DECLARE sortid,pickvalue INT;
SET @pickvalue = (SELECT id FROM vtiger_picklistvalues_seq),
@sort_id = (SELECT max(sortid) FROM vtiger_role2picklist WHERE roleid = 'H5' AND picklistid = 47); 
UPDATE vtiger_cf_608_seq SET id = id+1;
UPDATE vtiger_picklistvalues_seq SET id = id+1;
INSERT INTO vtiger_role2picklist (roleid,picklistvalueid,picklistid,sortid) VALUES ('H5',@pickvalue,47,@sort_id);
END;
$$
DELIMITER ;
/*----------------------------------------------------------------------------------*/
DROP TRIGGER TRG1 IF EXISTS;
DELIMITER $$
 CREATE TRIGGER TRG1
 AFTER INSERT ON investigation
 FOR EACH ROW BEGIN
      DECLARE cst smallint;
      SELECT Cost FROM inv_cost WHERE Username = NEW.Username AND MachineType = NEW.MachineType INTO cst;
      UPDATE test SET Balance = Balance - cst WHERE Username = New.Username;
 END$$
 DELIMITER ;
/*----------------------------------------------------------------------------------*/
DELIMITER $$
 
CREATE PROCEDURE build_email_list (INOUT email_list varchar(4000))
BEGIN
 DECLARE v_finished INTEGER DEFAULT 0;
        DECLARE v_email varchar(100) DEFAULT "";
 
 -- declare cursor for employee email
 DEClARE email_cursor CURSOR FOR 
 SELECT email FROM employees;
 
 -- declare NOT FOUND handler
 DECLARE CONTINUE HANDLER 
        FOR NOT FOUND SET v_finished = 1;
 
 OPEN email_cursor;

 get_email: LOOP
	 FETCH email_cursor INTO v_email;
	 IF v_finished = 1 THEN 
	 LEAVE get_email;
	 END IF;
	 -- build email list
	 SET email_list = CONCAT(v_email,";",email_list);
 END LOOP get_email;

 CLOSE email_cursor;
END$$
DELIMITER ;
/*----------------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------------*/

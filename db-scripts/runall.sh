#!/bin/bash
echo "---------------schema-----------------"
mysql -u root -proot < schema.sql

echo "---------------class-----------------"
cat class.csv  | bash class.sh  > class.sql
mysql -u root -proot < class.sql

echo "---------------subject-----------------"
cat subject.csv  | bash subject.sh  > subject.sql
mysql -u root -proot < subject.sql

echo "---------------class-subject-----------------"
cat class-subject.csv  | bash class-subject.sh  > class-subject.sql
mysql -u root -proot < class-subject.sql

echo "---------------batch-----------------"
cat batch.csv  | bash batch.sh  > batch.sql
mysql -u root -proot < batch.sql

echo "---------------subject-batch-----------------"
cat subject-batch.csv  | bash subject-batch.sh  > subject-batch.sql
mysql -u root -proot < subject-batch.sql

echo "---------------teacher-----------------"
cat teacher.csv  | bash teacher.sh  > teacher.sql
mysql -u root -proot < teacher.sql

echo "---------------room-----------------"
cat room.csv  | bash room.sh  > room.sql
mysql -u root -proot < room.sql

echo "---------------dept -----------------"
mysql -u root -proot < dept.sql 

#this one, config needs changes, as it used deptId
echo "---------------config-----------------"
mysql -u root -proot < config.sql


echo "---------------timetable-----------------"
cat timetable.csv  | bash timetable.sh  > timetable.sql
mysql -u root -proot < timetable.sql

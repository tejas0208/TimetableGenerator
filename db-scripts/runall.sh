#!/bin/bash
echo "---------------schema-----------------"
mysql -u root -proot < schema.sql

echo "---------------triggers-----------------"
mysql -u root -proot <	triggers.sql 

echo "---------------dept -----------------"
mysql -u root -proot < dept.sql 

#this one, config needs changes, as it used deptId
echo "---------------config-----------------"
mysql -u root -proot < config.sql

echo "---------------snapshot ----------------"
mysql -u root -proot < snapshot.sql

echo "---------------class-----------------"
cat class.csv  | bash class.sh  > class.sql
mysql -u root -proot < class.sql

echo "---------------subject-----------------"
cat subject.csv  | bash subject.sh  > subject.sql
mysql -u root -proot < subject.sql

echo "---------------teacher-----------------"
cat teacher.csv  | bash teacher.sh  > teacher.sql
mysql -u root -proot < teacher.sql

echo "---------------room-----------------"
cat room.csv  | bash room.sh  > room.sql
mysql -u root -proot < room.sql

echo "---------------batch-----------------"
cat batch.csv  | bash batch.sh  > batch.sql
mysql -u root -proot < batch.sql

echo "---------------batch-can-overlap-----------------"
cat batch-can-overlap.csv  | bash batch-can-overlap.sh  > batch-can-overlap.sql
mysql -u root -proot < batch-can-overlap.sql

echo "----------------subject-class-teacher-----------------"
cat subject-class-teacher.csv  | bash subject-class-teacher.sh  > subject-class-teacher.sql
mysql -u root -proot < subject-class-teacher.sql

echo "---------------subject-batch-teacher-----------------"
cat subject-batch-teacher.csv  | bash subject-batch-teacher.sh  > subject-batch-teacher.sql
mysql -u root -proot < subject-batch-teacher.sql

echo "---------------overlappingSBT-----------------"
cat overlappingSBT.csv  | bash overlappingSBT.sh  > overlappingSBT.sql
mysql -u root -proot < overlappingSBT.sql

echo "---------------classRoom-----------------"
cat classRoom.csv  | bash classRoom.sh  > classRoom.sql
mysql -u root -proot < classRoom.sql

echo "---------------batchRoom-----------------"
cat batchRoom.csv  | bash batchRoom.sh  > batchRoom.sql
mysql -u root -proot < batchRoom.sql

echo "---------------subjectRoom-----------------"
cat subjectRoom.csv  | bash subjectRoom.sh  > subjectRoom.sql
mysql -u root -proot < subjectRoom.sql

echo "---------------timetable-----------------"
cat timetable.csv  | bash timetable.sh  > timetable.sql
mysql -u root -proot < timetable.sql

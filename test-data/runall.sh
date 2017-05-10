#!/bin/bash
if [ $# -ne 1 ]
then
	echo "Specify the directory containing csv data as argv[1]"
	echo "Typically it will be like this: "
	echo "bash runall.sh csv/full"
	exit
fi
echo "---------------schema-----------------"
mysql -u root -proot < ../db-schema/database-create.sql
mysql -u root -proot < ../db-schema/schema.sql

echo "---------------triggers-----------------"
mysql -u root -proot <	../db-schema/triggers.sql 

echo "---------------dept -----------------"
mysql -u root -proot < sql/dept.sql 

#this one, config needs changes, as it used deptId
echo "---------------config-----------------"
mysql -u root -proot < sql/config.sql

echo "---------------snapshot ----------------"
mysql -u root -proot < sql/snapshot.sql

echo "---------------class-----------------"
cat $1/class.csv  | bash shell/class.sh  > $1/class.sql
mysql -u root -proot < $1/class.sql

echo "---------------subject-----------------"
cat $1/subject.csv  | bash shell/subject.sh  > $1/subject.sql
mysql -u root -proot < $1/subject.sql

echo "---------------teacher-----------------"
cat $1/teacher.csv  | bash shell/teacher.sh  > $1/teacher.sql
mysql -u root -proot < $1/teacher.sql

echo "---------------room-----------------"
cat $1/room.csv  | bash shell/room.sh  > $1/room.sql
mysql -u root -proot < $1/room.sql

echo "---------------batch-----------------"
cat $1/batch.csv  | bash shell/batch.sh  > $1/batch.sql
mysql -u root -proot < $1/batch.sql

echo "---------------batch-can-overlap-----------------"
cat $1/batch-can-overlap.csv  | bash shell/batch-can-overlap.sh  > $1/batch-can-overlap.sql
mysql -u root -proot < $1/batch-can-overlap.sql

echo "----------------subject-class-teacher-----------------"
cat $1/subject-class-teacher.csv  | bash shell/subject-class-teacher.sh  > $1/subject-class-teacher.sql
mysql -u root -proot < $1/subject-class-teacher.sql

echo "---------------subject-batch-teacher-----------------"
cat $1/subject-batch-teacher.csv  | bash shell/subject-batch-teacher.sh  > $1/subject-batch-teacher.sql
mysql -u root -proot < $1/subject-batch-teacher.sql

echo "---------------overlappingSBT-----------------"
cat $1/overlappingSBT.csv  | bash shell/overlappingSBT.sh  > $1/overlappingSBT.sql
mysql -u root -proot < $1/overlappingSBT.sql

echo "---------------classRoom-----------------"
cat $1/classRoom.csv  | bash shell/classRoom.sh  > $1/classRoom.sql
mysql -u root -proot < $1/classRoom.sql

echo "---------------batchRoom-----------------"
cat $1/batchRoom.csv  | bash shell/batchRoom.sh  > $1/batchRoom.sql
mysql -u root -proot < $1/batchRoom.sql

echo "---------------subjectRoom-----------------"
cat $1/subjectRoom.csv  | bash shell/subjectRoom.sh  > $1/subjectRoom.sql
mysql -u root -proot < $1/subjectRoom.sql

echo "---------------timetable-----------------"
cat $1/timetable.csv  | bash shell/timetable.sh  > $1/timetable.sql
mysql -u root -proot < $1/timetable.sql

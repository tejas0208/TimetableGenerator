echo "USE timeTable;"
IFS=,
while read -e classShortName subjectShortName teacherShortName
do
	if [ ! -z "$teacherShortName" ]
	then
			echo "INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName=\"$subjectShortName\"), 
				(SELECT classId FROM class WHERE classShortName=\"$classShortName\"),
				(SELECT teacherId from teacher WHERE teacherShortName=\"$teacherShortName\"),
				1
			);";
	else
			echo "INSERT INTO subjectClassTeacher(subjectId, classId, teacherId, snapshotId) VALUES (
				(SELECT subjectId FROM subject WHERE subjectShortName=\"$subjectShortName\"), 
				(SELECT classId FROM class WHERE classShortName=\"$classShortName\"),
				NULL,
				1
			);";
	fi
done


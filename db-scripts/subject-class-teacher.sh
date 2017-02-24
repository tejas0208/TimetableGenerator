echo "USE timeTable;"
IFS=,
while read -e classShortName subjectShortName 
do
	echo "INSERT INTO subjectClassTeacher(subjectId, classId, teacherId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName=\"$subjectShortName\"), 
		(SELECT classId FROM class WHERE classShortName=\"$classShortName\"),
		NULL
	);";
done


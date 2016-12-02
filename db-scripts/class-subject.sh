echo "USE timeTable;"
IFS=,
while read -e classShortName subjectShortName 
do
	echo "INSERT INTO classSubject(classId, subjectId) VALUES (
		(SELECT classId FROM class WHERE classShortName=\"$classShortName\"),
		(SELECT subjectId FROM subject WHERE subjectShortName=\"$subjectShortName\")
	);";
done


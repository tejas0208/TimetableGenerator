echo "USE timeTable;"
IFS=,
while read -e subjectShortName batchName teacherShortName
do
	echo "INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName=\"$subjectShortName\"),
		(SELECT batchId FROM batch WHERE batchName=\"$batchName\"),
		(SELECT teacherId FROM teacher WHERE teacherShortName=\"$teacherShortName\")	
	);";
done


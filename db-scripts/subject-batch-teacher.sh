echo "USE timeTable;"
IFS=,
while read -e subjectShortName batchName
do
	echo "INSERT INTO subjectBatchTeacher(subjectId, batchId, teacherId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName=\"$subjectShortName\"),
		(SELECT batchId FROM batch WHERE batchName=\"$batchName\"),
		NULL
	);";
done


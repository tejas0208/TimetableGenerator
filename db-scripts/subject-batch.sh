echo "USE timeTable;"
IFS=,
while read -e subjectShortName batchName
do
	echo "INSERT INTO subjectBatch(subjectId, batchId) VALUES (
		(SELECT subjectId FROM subject WHERE subjectShortName=\"$subjectShortName\"),
		(SELECT batchId FROM batch WHERE batchName=\"$batchName\")
	);";
done


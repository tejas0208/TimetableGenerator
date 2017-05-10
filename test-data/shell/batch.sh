echo "USE timeTable;"
IFS=,
while read -e cname bname count
do
echo "INSERT INTO batch(batchName, batchCount, snapshotId) VALUES ("\"$bname\", $count", 1);";
echo "INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName=\"$bname\"),(SELECT classId from class WHERE classShortName=\"$cname\"), 1);";
done


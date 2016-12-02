echo "USE timeTable;"
IFS=,
while read -e cname bname count
do
echo "INSERT INTO batch(batchName, batchCount) VALUES ("\"$bname\", $count");";
echo "INSERT INTO batchClass(batchId, classId) VALUES ((SELECT batchId FROM batch WHERE batchName=\"$bname\"),(SELECT classId from class WHERE classShortName=\"$cname\"));";
done


echo "USE timeTable;"
IFS=,
while read -e bname1 bname2 
do
echo "INSERT INTO batchCanOverlap(batchId, batchOverlapId) VALUES ((SELECT batchId FROM batch WHERE batchName=\"$bname1\"), ( (SELECT batchId FROM batch WHERE batchName=\"$bname2\")));";
done


echo "USE timeTable;"
IFS=,
while read -e bname room 
do
echo "INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName=\"$bname\"),(SELECT roomId from room WHERE roomShortName=\"$room\"), 1);";
done

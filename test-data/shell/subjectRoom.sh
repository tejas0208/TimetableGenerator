echo "USE timeTable;"
IFS=,
while read -e sname room 
do
echo "INSERT INTO subjectRoom(subjectId, roomId, snapshotId) VALUES ((SELECT subjectId FROM subject WHERE subjectShortName=\"$sname\"),(SELECT roomId from room WHERE roomShortName=\"$room\"), 1);";
done

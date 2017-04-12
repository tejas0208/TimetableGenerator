echo "USE timeTable;"
IFS=,
while read -e cname room 
do
echo "INSERT INTO classRoom(classId, roomId, snapshotId) VALUES ((SELECT classId FROM class WHERE classShortName=\"$cname\"),(SELECT roomId from room WHERE roomShortName=\"$room\"), 1);";
done

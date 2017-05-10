echo "USE timeTable;"
IFS=,
while read -e name sname count 
do
echo "INSERT INTO room(roomName, roomShortName, roomCount, snapshotId) VALUES (" \"$name\", \"$sname\", $count", 1);";
done


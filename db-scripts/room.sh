echo "USE timeTable;"
IFS=,
while read -e name sname count 
do
echo "INSERT INTO room(roomName, roomShortName, roomCount) VALUES (" \"$name\", \"$sname\", $count");";
done


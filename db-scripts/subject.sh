echo "USE timeTable;"
IFS=,
while read -e name sname hrs slot batches
do
echo "INSERT INTO subject(subjectName, subjectShortName, totalHrs, eachSlot, batches) VALUES (" \"$name\", \"$sname\", $hrs, $slot, $batches");";
done

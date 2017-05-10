echo "USE timeTable;"
IFS=,
while read -e name sname eachslot nslots batches
do
echo "INSERT INTO subject(subjectName, subjectShortName, eachSlot, nSlots, batches, snapshotId) VALUES (" \"$name\", \"$sname\", $eachslot, $nslots, $batches", 1);";
done

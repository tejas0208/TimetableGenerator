echo "USE timeTable;"
IFS=,
while read -e name sname minhrs maxhrs  dept
do
echo "INSERT INTO teacher(teacherName, teacherShortName, minHrs, maxHrs, deptId, snapshotId) VALUES (" \"$name\", \"$sname\", $minhrs, $maxhrs, $dept", 1);";
done


echo "USE timeTable;"
IFS=,
while read -e className classShortName semester  classCount
do
echo "INSERT INTO class(className, classShortName, semester, classCount) VALUES (" \"$className\", \"$classShortName\", $semester, $classCount");";
done

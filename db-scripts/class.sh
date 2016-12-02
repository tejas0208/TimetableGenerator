echo "USE timeTable;"
IFS=,
while read -e className classShortName semester 
do
echo "INSERT INTO class(className, classShortName, semester) VALUES (" \"$className\", \"$classShortName\", $semester");";
done

echo "USE timeTable;"
IFS=,
while read -e day slot room class subject teacher batch isBreak
do
	if [ $isBreak == "TRUE" ]
	then
		echo "INSERT INTO timeTable(day, slotNo, batchId, configId, isBreak) VALUES ($day, $slot, NULL, 1, $isBreak);";

	else
		if [ -z $batch ]
		then
			echo "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) VALUES
	 		($day, $slot, 
			(SELECT roomId from room WHERE roomShortName=\"$room\"),
			(SELECT classId from class WHERE classShortName=\"$class\"), 
			(SELECT subjectId from subject WHERE subjectShortName=\"$subject\"),
			(SELECT teacherId from teacher WHERE teacherShortName=\"$teacher\"), 
			NULL, 1,
			$isBreak);";
		
		else
			echo "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, batchId, configId, isBreak) 
			VALUES 		
			($day, $slot, 
			(SELECT roomId from room WHERE roomShortName=\"$room\"),
			(SELECT classId from class WHERE classShortName=\"$class\"), 
			(SELECT subjectId from subject WHERE subjectShortName=\"$subject\"),
			(SELECT teacherId from teacher WHERE teacherShortName=\"$teacher\"), 
			(SELECT batchId from batch WHERE batchName=\"$batch\"), 
			1,
			$isBreak);";
		fi
	fi
done

echo "USE timeTable;"
IFS=,
while read -e day slot room class subject teacher batch isFixed
do
	if [ $isFixed == "TRUE" ]
	then
		echo "INSERT INTO timeTable(day, slotNo, classId, batchId, snapshotId, isFixed) VALUES 
				($day, $slot, 
				(SELECT classId from class where classShortName=\"$class\"),
				NULL,  
				(SELECT snapshotId from snapshot where snapshotName=\"default\"),
				$isFixed);";
		echo	"INSERT INTO fixedEntry(ttId, fixedText, snapshotId) VALUES
				((SELECT ttId FROM timeTable WHERE day = $day AND slotNo = $slot AND 
				classId = (SELECT classId from class WHERE classShortName=\"$class\")  
				AND isFixed = $isFixed), \"LUNCH\", 1);";

	else
		if [ -z $batch ]
		then
			echo "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES
	 		($day, $slot, 
			(SELECT roomId from room WHERE roomShortName=\"$room\"),
			(SELECT classId from class WHERE classShortName=\"$class\"), 
			(SELECT subjectId from subject WHERE subjectShortName=\"$subject\"),
			(SELECT teacherId from teacher WHERE teacherShortName=\"$teacher\"), 
			NULL, 
			(SELECT snapshotId from snapshot where snapshotName=\"default\"),
			$isFixed);";
		
		else
			echo "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, snapshotId, isFixed) VALUES 		
			($day, $slot, 
			(SELECT roomId from room WHERE roomShortName=\"$room\"),
			(SELECT classId from class WHERE classShortName=\"$class\"), 
			(SELECT subjectId from subject WHERE subjectShortName=\"$subject\"),
			(SELECT teacherId from teacher WHERE teacherShortName=\"$teacher\"), 
			(SELECT batchId from batch WHERE batchName=\"$batch\"), 
			(SELECT snapshotId from snapshot where snapshotName=\"default\"),
			$isFixed);";
		fi
	fi
done

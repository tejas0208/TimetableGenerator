echo "USE timeTable;"
IFS=,
while read -e day slot room class subject teacher batch isFixed
do
	if [ $isFixed == "TRUE" ]
	then
		echo "INSERT INTO timeTable(day, slotNo, classId, batchId, configId, snapshotId, isFixed) VALUES 
				($day, $slot, 
				(SELECT classId from class where classShortName=\"$class\"),
				NULL, 1, 
				(SELECT snapshotId from snapshot where snapshotName=\"default\"),
				$isFixed);";

	else
		if [ -z $batch ]
		then
			echo "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, configId, snapshotId, isFixed) VALUES
	 		($day, $slot, 
			(SELECT roomId from room WHERE roomShortName=\"$room\"),
			(SELECT classId from class WHERE classShortName=\"$class\"), 
			(SELECT subjectId from subject WHERE subjectShortName=\"$subject\"),
			(SELECT teacherId from teacher WHERE teacherShortName=\"$teacher\"), 
			NULL, 1,
			(SELECT snapshotId from snapshot where snapshotName=\"default\"),
			$isFixed);";
		
		else
			echo "INSERT INTO timeTable(day, slotNo, roomId, classId, subjectId, teacherId, 
						batchId, configId, snapshotId, isFixed) VALUES 		
			($day, $slot, 
			(SELECT roomId from room WHERE roomShortName=\"$room\"),
			(SELECT classId from class WHERE classShortName=\"$class\"), 
			(SELECT subjectId from subject WHERE subjectShortName=\"$subject\"),
			(SELECT teacherId from teacher WHERE teacherShortName=\"$teacher\"), 
			(SELECT batchId from batch WHERE batchName=\"$batch\"), 
			1,
			(SELECT snapshotId from snapshot where snapshotName=\"default\"),
			$isFixed);";
		fi
	fi
done

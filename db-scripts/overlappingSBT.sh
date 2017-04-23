echo "USE timeTable;"
IFS=,
while read -e s1 b1 t1 s2 b2 t2 
do
	qs1="SELECT subjectId from subject where subjectShortName = \"$s1\" and snapshotId = 1";
	qs2="SELECT subjectId from subject where subjectShortName = \"$s2\" and snapshotId = 1";
	qb1="SELECT batchId from batch where batchName = \"$b1\" and snapshotId = 1";
	qb2="SELECT batchId from batch where batchName = \"$b2\" and snapshotId = 1";
	qt1="SELECT teacherId from teacher where teacherShortName = \"$t1\" and snapshotId = 1";
	qt2="SELECT teacherId from teacher where teacherShortName= \"$t2\" and snapshotId = 1";
	echo "INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = ($qs1) AND batchId = ($qb1) AND teacherId = ($qt1)),
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = ($qs2) AND batchId = ($qb2) AND teacherId = ($qt2)),
			1
		);";
	echo "INSERT INTO overlappingSBT(sbtId1, sbtId2, snapshotId) VALUES (
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = ($qs2) AND batchId = ($qb2) AND teacherId = ($qt2)),
			(SELECT sbtId from subjectBatchTeacher WHERE subjectId = ($qs1) AND batchId = ($qb1) AND teacherId = ($qt1)),
			1
		);";
done


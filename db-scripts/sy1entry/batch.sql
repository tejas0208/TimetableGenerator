USE timeTable;
INSERT INTO batch(batchName, batchCount, snapshotId) VALUES ("SYBT-CE-S1", 22, 1);
INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-CE-S1"),(SELECT classId from class WHERE classShortName="SYBT-CE"), 1);
INSERT INTO batch(batchName, batchCount, snapshotId) VALUES ("SYBT-CE-S2", 22, 1);
INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-CE-S2"),(SELECT classId from class WHERE classShortName="SYBT-CE"), 1);

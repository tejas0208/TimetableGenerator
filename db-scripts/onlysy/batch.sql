USE timeTable;
INSERT INTO batch(batchName, batchCount, snapshotId) VALUES ("SYBT-CE-S1", 22, 1);
INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-CE-S1"),(SELECT classId from class WHERE classShortName="SYBT-CE"), 1);
INSERT INTO batch(batchName, batchCount, snapshotId) VALUES ("SYBT-CE-S2", 22, 1);
INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-CE-S2"),(SELECT classId from class WHERE classShortName="SYBT-CE"), 1);
INSERT INTO batch(batchName, batchCount, snapshotId) VALUES ("SYBT-CE-S3", 22, 1);
INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-CE-S3"),(SELECT classId from class WHERE classShortName="SYBT-CE"), 1);
INSERT INTO batch(batchName, batchCount, snapshotId) VALUES ("SYBT-CE-S4", 22, 1);
INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-CE-S4"),(SELECT classId from class WHERE classShortName="SYBT-CE"), 1);
INSERT INTO batch(batchName, batchCount, snapshotId) VALUES ("SYBT-CE-DSY", 15, 1);
INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-CE-DSY"),(SELECT classId from class WHERE classShortName="SYBT-CE"), 1);
INSERT INTO batch(batchName, batchCount, snapshotId) VALUES ("SYBT-IT-S1", 22, 1);
INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-IT-S1"),(SELECT classId from class WHERE classShortName="SYBT-IT"), 1);
INSERT INTO batch(batchName, batchCount, snapshotId) VALUES ("SYBT-IT-S2", 22, 1);
INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-IT-S2"),(SELECT classId from class WHERE classShortName="SYBT-IT"), 1);
INSERT INTO batch(batchName, batchCount, snapshotId) VALUES ("SYBT-IT-S3", 22, 1);
INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-IT-S3"),(SELECT classId from class WHERE classShortName="SYBT-IT"), 1);
INSERT INTO batch(batchName, batchCount, snapshotId) VALUES ("SYBT-IT-S4", 22, 1);
INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-IT-S4"),(SELECT classId from class WHERE classShortName="SYBT-IT"), 1);
INSERT INTO batch(batchName, batchCount, snapshotId) VALUES ("SYBT-IT-DSY", 15, 1);
INSERT INTO batchClass(batchId, classId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-IT-DSY"),(SELECT classId from class WHERE classShortName="SYBT-CE"), 1);

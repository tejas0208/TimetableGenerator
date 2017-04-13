USE timeTable;
INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-CE-S1"),(SELECT roomId from room WHERE roomShortName="FOSS1"), 1);
INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-CE-S2"),(SELECT roomId from room WHERE roomShortName="FOSS2"), 1);
INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="TYBT-IT-T2"),(SELECT roomId from room WHERE roomShortName="SSL"), 1);
INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="TYBT-CE-T1"),(SELECT roomId from room WHERE roomShortName="DBMSL"), 1);
INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="TYBT-CE-FOSS1"),(SELECT roomId from room WHERE roomShortName="Cogni-1"), 1);

USE timeTable;
INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SY-C-S1"),(SELECT roomId from room WHERE roomShortName="FOSS1"), 1);
INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SY-C-S2"),(SELECT roomId from room WHERE roomShortName="FOSS2"), 1);
INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="I-T2"),(SELECT roomId from room WHERE roomShortName="SSL"), 1);
INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="C-T1"),(SELECT roomId from room WHERE roomShortName="DBMSL"), 1);
INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="C-FOSS1"),(SELECT roomId from room WHERE roomShortName="Cogni-1"), 1);

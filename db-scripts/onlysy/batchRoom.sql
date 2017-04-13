USE timeTable;
INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-CE-S1"),(SELECT roomId from room WHERE roomShortName="FOSS1"), 1);
INSERT INTO batchRoom(batchId, roomId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-CE-S2"),(SELECT roomId from room WHERE roomShortName="FOSS2"), 1);

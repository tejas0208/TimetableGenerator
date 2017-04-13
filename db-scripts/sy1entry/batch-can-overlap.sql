USE timeTable;
INSERT INTO batchCanOverlap(batchId, batchOverlapId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-CE-S1"), ( (SELECT batchId FROM batch WHERE batchName="SYBT-CE-S2")), 1);
INSERT INTO batchCanOverlap(batchId, batchOverlapId, snapshotId) VALUES ((SELECT batchId FROM batch WHERE batchName="SYBT-CE-S2"), ( (SELECT batchId FROM batch WHERE batchName="SYBT-CE-S1")), 1);

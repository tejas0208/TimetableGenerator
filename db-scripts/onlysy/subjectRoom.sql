USE timeTable;
INSERT INTO subjectRoom(subjectId, roomId, snapshotId) VALUES ((SELECT subjectId FROM subject WHERE subjectShortName="PPL"),(SELECT roomId from room WHERE roomShortName="AC-202"), 1);
INSERT INTO subjectRoom(subjectId, roomId, snapshotId) VALUES ((SELECT subjectId FROM subject WHERE subjectShortName="MPT"),(SELECT roomId from room WHERE roomShortName="AC-203"), 1);

USE timeTable;
INSERT INTO classRoom(classId, roomId, snapshotId) VALUES ((SELECT classId FROM class WHERE classShortName="SYBT-CE"),(SELECT roomId from room WHERE roomShortName="AC-202"), 1);
INSERT INTO classRoom(classId, roomId, snapshotId) VALUES ((SELECT classId FROM class WHERE classShortName="SYBT-IT"),(SELECT roomId from room WHERE roomShortName="AC-203"), 1);
INSERT INTO classRoom(classId, roomId, snapshotId) VALUES ((SELECT classId FROM class WHERE classShortName="FYMT-CE"),(SELECT roomId from room WHERE roomShortName="AC-203"), 1);
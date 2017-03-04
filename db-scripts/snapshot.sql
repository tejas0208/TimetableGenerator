USE timeTable;

INSERT INTO user(userName, password) VALUES ("abhijit", "abhijit");
INSERT INTO snapshot(snapShotName, snapShotCreator, createTime, modifyTime) VALUES("First Snapshot", (SELECT userId from user where userName = "abhijit"), "0800", "0800");

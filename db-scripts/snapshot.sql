USE timeTable;

INSERT INTO user(userName, password) VALUES ("abhijit", "abhijit");
INSERT INTO snapshot(snapShotName, snapShotCreator, createTime, modifyTime, configId) VALUES("default", (SELECT userId from user where userName = "abhijit"), "0800", "0800", 1);

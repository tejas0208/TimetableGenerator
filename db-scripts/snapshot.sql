USE timeTable;

INSERT INTO snapshot(snapShotName, snapShotCreator, createTime, modifyTime, configId) VALUES("default", (SELECT userId from user where userName = "abhijit"), "080000", "080000", 1);

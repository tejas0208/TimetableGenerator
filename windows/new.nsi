/*this is the script for creating a installer for taasika software.
this script can be run using nsis software
along with this script the source folder of taasika and two custom page files custom.ini and config_details.ini are also needed*/
;------------------------------------------------------------------------------------------------------------------
;Include Modern UI for new GUI

  !include "MUI2.nsh"
  !include "InstallOptions.nsh" ;for taking input from user
  !include nsDialogs.nsh
  !include LogicLib.nsh
  !include "StrFunc.nsh"
;--------------------------------

  Name "Taasika" ;title for installer
  OutFile "taasika.exe" ;name of the executable file

  ;Get installation folder from registry if available
  InstallDirRegKey HKCU "Software\Taasika" ""

  ;Request application privileges for Windows Vista
  RequestExecutionLevel admin

  ;;added variables to execute mysql script
  Var checking
  Var folder_mysql ;location of mysql.exe
  Var folder_apache ;location of apache
  Var login
  Var password
  Var errorsrc
  ;;for config files
  Var deptName
  Var deptShortName
  Var userName
  Var passwd
  Var source
  Var type_xampp
  Var type_wamp
  Var selected_type
  Var xampp_root
  Var firefox
  Var chrome
  Var def_browser
  Var browser_path
  ;;for intial config
  Var configName
  Var  dayBegin
  Var  slotDuration
  Var  nSlots
  Var first
  Var last
  Var sub
  Var final

  ;Var  deptId /*directly taken as 1, 1*/ ask sir for the appropriate value
  ;Var  incharge
  Var  daysInWeek
  Var dbname
  
  !define WAMP 1
  !define XAMPP 2
  !define STANDALONE 3
;--------------------------------
;Interface Settings

  !define MUI_ABORTWARNING

;--------------------------------
;Pages

  page custom TypeOfInstaller TypeOfInstallerLeave
  !insertmacro MUI_PAGE_LICENSE "c:\Users\Kalpesh\Desktop\taasika-master\LICENSE" ;while executing the nsis compiler give path of the source of taasika license
  !insertmacro MUI_PAGE_COMPONENTS
  Page custom GetInfos GetInfosLeave "new"
  Page custom GetConfigDetails GCD_leave  ": Information page"
  Page custom GetInitialConfig GIC_leave ":intial config for timetable"
  !insertmacro MUI_PAGE_INSTFILES

  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES



;these commands are to be run once the installtion is successful
!define MUI_FINISHPAGE_RUN
!define MUI_FINISHPAGE_RUN_TEXT "Finish Installing Taasika"
!define MUI_FINISHPAGE_RUN_FUNCTION "LaunchLink"
!insertmacro MUI_PAGE_FINISH

/*new macro for string validation*/
!define Validate "!insertmacro Validate"

!macro Validate ResultVar String CharacterSet
	Push "${String}"
	Push "${CharacterSet}"
	Call ValidateInternal
	Pop "${ResultVar}"
!macroend


!define ALPHA "abcdefghijklmnopqrstuvwxyz "
!define NUMERIC "1234567890"
!define SPECIAL "~!@#$%^&*()_+|`\=-}{$\":?><][';/.," # workaround for syntax highlighting - '

;Push "value to check"
;Push "comparisonlist"
Function ValidateInternal
  Push $0
  Push $1
  Push $2
  Push $3 ;value length
  Push $4 ;count 1
  Push $5 ;tmp var 1
  Push $6 ;list length
  Push $7 ;count 2
  Push $8 ;tmp var 2
  Exch 9
  Pop $1 ;list
  Exch 9
  Pop $2 ;value
  StrCpy $0 1
  StrLen $3 $2
  StrLen $6 $1
  StrCpy $4 0
  lbl_loop:
    StrCpy $5 $2 1 $4
    StrCpy $7 0
  lbl_loop2:
    StrCpy $8 $1 1 $7
    StrCmp $5 $8 lbl_loop_next 0
    IntOp $7 $7 + 1
    IntCmp $7 $6 lbl_loop2 lbl_loop2 lbl_error
  lbl_loop_next:
  IntOp $4 $4 + 1
  IntCmp $4 $3 lbl_loop lbl_loop lbl_done
  lbl_error:
  StrCpy $0 0
  lbl_done:
  Pop $6
  Pop $5
  Pop $4
  Pop $3
  Pop $2
  Pop $1
  Exch 2
  Pop $7
  Pop $8
  Exch $0
FunctionEnd
  
;--------------------------------
;Languages
 
  !insertmacro MUI_LANGUAGE "English"

;--------------------------------
;Installer Sections

${StrStrAdv}

Function search_browser
        StrCmp $def_browser "firefox" 0 try_chrome
        ReadRegStr $browser_path HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\firefox.exe" "Path"
        StrCmp $browser_path "" 0 Continue
        MessageBox MB_OK "firefox couldn't be found on your pc please make sure it is installed or try with chrome" IDOK abort
try_chrome:
        ReadRegStr $browser_path HKLM "SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" "Path"
        StrCmp $browser_path "" 0 Continue_1
        MessageBox MB_OK "chrome couldn't be found on your pc please make sure it is installed or try with firefox" IDOK abort
Continue:
        push $browser_path
        call adjust_path_spaces
        pop $browser_path
        StrCpy $6 "\firefox.exe"
        Strcpy $browser_path `$browser_path$6`
        goto browser_done
Continue_1:
        push $browser_path
        call adjust_path_spaces
        pop $browser_path
        StrCpy $6 "\chrome.exe"
        Strcpy $browser_path  `$browser_path$6`
        goto browser_done
abort:
      Abort
browser_done:
       ;MessageBox MB_OK "browser installed at $browser_path"

FunctionEnd

Function find_installed_server ;;this sections handles the different ways in which AMP components are installed xampp or wamp
${If} $selected_type = 1
                ReadRegStr $folder_apache HKLM "SYSTEM\CurrentControlSet\Services\wampapache64" "ImagePath" ; check if Apache is already installed using the registry
                StrCmp $folder_apache "" 0 Continue_1 ; IF Apache in not installed
                MessageBox MB_OK "WAMP couldn't be found on your pc make sure it is installed and try again" IDOK abort

        Continue_1:
                ReadRegStr $folder_mysql HKLM "SYSTEM\CurrentControlSet\Services\wampmysqld64" "ImagePath" ; check if mysql is already installed using the registry
                StrCmp $folder_mysql "" 0 Continue_12
                MessageBox MB_OK "WAMP Mysql  couldn't be found on you pc make sure it is installed and try again" IDOK abort
        Continue_12:
                ${StrStrAdv} $0 $folder_mysql "bin" ">" "<" "0" "0" "1"
                StrCpy $6 "www\Taasika"
                Strcpy $1 `$0www\Taasika`
                StrCpy $INSTDIR $1
                StrCpy $1 "wampmanager.exe"
                StrCpy $0 `$0$1`
                ${StrStrAdv} $folder_mysql $folder_mysql "\bin" "<" "<" "0" "0" "1"
                Exec '"$0"'
                StrCpy $folder_apache $0
                goto done
${EndIf}

${If} $selected_type = 2
        ReadRegStr $folder_apache HKLM "SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\xampp" InstallLocation ; check if Apache is already installed using the registry
        StrCmp $folder_apache "" 0 Continue_21
        MessageBox MB_OK "XAMPP couldn't be found on your pc make sure it is installed and try again" IDOK abort
    Continue_21:
        StrCpy $6 "\htdocs\Taasika"
        Strcpy $INSTDIR `$folder_apache$6`
        StrCpy $xampp_root $folder_apache
        StrCpy $0 `$folder_apache\xampp_start.exe`
        Strcpy $5 "\mysql"
        StrCpy $folder_mysql `$folder_apache$5`
        Exec '"$0"'
        StrCpy $folder_apache $0
        goto done
${EndIf}

abort:
    Abort
done:
FunctionEnd
           

Section "Taasika" SecDummy
    MessageBox MB_OK "Taasika will be installed in this directory $INSTDIR" IDOK
    SetOutPath "$INSTDIR" ;where to extract the files of taasika
    File /r "c:\Users\Kalpesh\Desktop\taasika-master\*" ;source folder of taasika "taasika-master"
    ;Store installation folder
    WriteRegStr HKCU "Software\Taasika" "" $INSTDIR
    StrCmp $password "" 0 +3
    ExecWait '"$folder_mysql\bin\mysql" -u $login --execute="DROP DATABASE IF EXISTS $dbname;"' $1
    Goto +2
    ExecWait '"$folder_mysql\bin\mysql" -u $login -p$password --execute="DROP DATABASE IF EXISTS $dbname;"' $1
    StrCmp $1 1 0 +3
    StrCpy $errorsrc "couldn't create the database"
    Goto abortinst
    StrCmp $password "" 0 +3
    ExecWait '"$folder_mysql\bin\mysql" -u $login --execute="CREATE DATABASE $dbname DEFAULT CHARSET=utf8;"'
    Goto +2
    ExecWait '"$folder_mysql\bin\mysql" -u $login -p$password --execute="CREATE DATABASE $dbname DEFAULT CHARSET=utf8;"'
importdbs:
    StrCpy $source "$INSTDIR\db-schema\windows_schema.sql"
    FileOpen $0 $source w
    FileWrite $0 `USE $dbname;$\r$\nCREATE TABLE dept(deptId int  AUTO_INCREMENT PRIMARY KEY COMMENT 'Department Id',deptName varchar(128) NOT NULL COMMENT 'Department Name',deptShortName varchar(32) NOT NULL COMMENT 'Department Short Name',CONSTRAINT c_deptName UNIQUE(deptName));`
    FileWrite $0 `CREATE TABLE user(userId int AUTO_INCREMENT PRIMARY KEY COMMENT 'User Id',userName varchar(128) NOT NULL COMMENT 'User\'s Full Name',password varchar(128) NOT NULL COMMENT 'User\'s Passsword',CONSTRAINT c_userName UNIQUE(userName));`
    FileWrite $0 `CREATE TABLE config(configId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Configuration Id',configName  varchar(128) NOT NULL COMMENT 'Configuration Name',dayBegin time COMMENT 'Day Begins at Time',slotDuration int COMMENT 'Duration of each slot in seconds',/* in seconds */nSlots int COMMENT 'No of slots in a day',deptId int COMMENT 'Department of this config',incharge int COMMENT 'Incharge user of this config',FOREIGN KEY (incharge) REFERENCES user(userId) ON DELETE CASCADE);`
    FileWrite $0 `CREATE TABLE snapshot(snapshotId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Snapshot Id',snapshotName varchar(128) COMMENT 'Name of the Snapshot',snapshotCreator int COMMENT 'User who created this snapshot',createTime time COMMENT 'Time of creation of this snapshot',modifyTime time COMMENT 'Time of modification of this snapshot',configId int COMMENT 'Configuration Id for this snapshot',FOREIGN KEY (snapshotCreator) REFERENCES user(userId) ON DELETE CASCADE,FOREIGN KEY (configId) REFERENCES config(configId) ON DELETE CASCADE,CONSTRAINT c_snapshotName UNIQUE(snapshotName));`
    FileWrite $0 `CREATE TABLE role(roleId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Role Id',roleName varchar(128) NOT NULL COMMENT 'Name of the Role',CONSTRAINT c_roleName UNIQUE(roleName));`
    FileWrite $0 `CREATE TABLE capability(capId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Capability Id',capName varchar(128) NOT NULL COMMENT 'Capability Name',roleId int COMMENT 'Role Id' ,CONSTRAINT c_capName UNIQUE(capName));`
    FileWrite $0 `CREATE TABLE teacher(teacherId int  AUTO_INCREMENT PRIMARY KEY COMMENT 'Teacher Id',teacherName varchar(256) NOT NULL COMMENT 'Teacher\'s Full Name',teacherShortName varchar(16) NOT NULL COMMENT 'Teacher\'s Short Name',minHrs int COMMENT 'Min Hrs of Work for Teacher',maxHrs int COMMENT 'Max hrs of work for Teacher',deptId int COMMENT 'Department of the Teacher',snapshotId int COMMENT 'Snapshot Id for this Teacher',FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,CONSTRAINT c_teacherShortName UNIQUE(teacherShortName, snapshotId));`
    FileWrite $0 `CREATE VIEW teacherReadable AS SELECT  t.teacherId, t.teacherName, t.teacherShortName, t.minHrs, t.maxHrs, d.deptShortName, s.snapshotName FROM teacher t, dept d, snapshot s WHERE t.deptId = d.deptId AND t.snapshotId = s.snapshotId ORDER BY snapshotName, teacherShortName;`
    FileWrite $0 `CREATE TABLE class(classId int  AUTO_INCREMENT PRIMARY KEY COMMENT 'Class Id',className varchar(256) NOT NULL COMMENT 'Class\'s Full Name',classShortName  varchar(32) NOT NULL COMMENT 'Class\'s Short Name',semester int NOT NULL COMMENT 'Current Semester No',classCount int NOT NULL COMMENT 'No. of Students in Class',snapshotId int COMMENT 'Snapshot Id for this Class',FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,CONSTRAINT c_classShortName UNIQUE(classShortName, snapshotId));`
    FileWrite $0 `CREATE TABLE batch(batchId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Batch Id',batchName varchar(32) NOT NULL COMMENT 'Batch Name',batchCount int COMMENT 'No. of Students in Batch',snapshotId int COMMENT 'Snapshot Id for this Batch',FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,CONSTRAINT c_batchName UNIQUE(batchName, snapshotId));`
    FileWrite $0 `CREATE TABLE batchCanOverlap(boId int AUTO_INCREMENT PRIMARY KEY COMMENT 'BatchOverlap Id',batchId int NOT NULL COMMENT 'Batch Id',batchOverlapId int NOT NULL COMMENT 'Batch Which Can Overlap',snapshotId int COMMENT 'Snapshot Id for this BO',FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,FOREIGN KEY(batchId) REFERENCES batch(batchId) ON DELETE CASCADE,FOREIGN KEY(batchOverlapId) REFERENCES batch(batchId) ON DELETE CASCADE,CONSTRAINT c_overlaps UNIQUE(batchId, batchOverlapId, snapshotId));`
    FileWrite $0 `CREATE VIEW batchCanOverlapReadable AS SELECT bo.boId, b1.batchId as "b1Id", b1.batchName as "b1Name",b2.batchId as "b2Id", b2.batchName  as "b2Name",s.snapShotName FROM batch b1, batch b2, batchCanOverlap bo, snapshot s WHERE b1.batchId  = bo.batchId AND b2.batchId = bo.batchOverlapId AND bo.snapshotId = s.snapshotId ORDER BY snapshotName, b1Name, b2Name;`
    FileWrite $0 `CREATE TABLE batchClass(bcId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Batch Class Id',batchId int NOT NULL COMMENT 'Batch Id',classId int NOT NULL COMMENT 'Class Id',snapshotId int COMMENT 'Snapshot Id for this batchClass',FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,FOREIGN KEY (batchId) REFERENCES batch(batchId) ON DELETE CASCADE,FOREIGN KEY (classId) REFERENCES class(classId) ON DELETE CASCADE,CONSTRAINT c_batchClass UNIQUE(batchId, classId, snapshotId));`
    FileWrite $0 `CREATE VIEW batchClassReadable AS SELECT bc.bcId, b.batchId, b.batchName, b.batchCount,c.classId, c.classShortName, c.classCount, s.snapshotName FROM batch b, class c, batchClass bc, snapshot s WHERE b.batchId = bc.batchId AND c.classId = bc.classId AND bc.snapshotId = s.snapshotId ORDER BY snapshotName, classShortName, batchName;`
    FileWrite $0 `CREATE TABLE room(roomId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Room Id',roomName varchar(32) NOT NULL COMMENT 'Room Name',roomShortName varchar(16) NOT NULL COMMENT 'Room Short Name',roomCount int COMMENT 'Capacity of Room',snapshotId int COMMENT 'Snapshot Id for this Room',FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,CONSTRAINT c_roomShortName UNIQUE(roomShortName, snapshotId),CONSTRAINT c_roomName UNIQUE(roomName, snapshotId));`
    FileWrite $0 `CREATE TABLE subject(subjectId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Subject Id',subjectName varchar(64) NOT NULL COMMENT 'Subject Full Name',subjectShortName varchar(16) NOT NULL COMMENT 'Subject Short Name',eachSlot int COMMENT 'No. of Slots for Each Entry',nSlots int COMMENT 'Total No. of Entries for this Subjeect',/*courseCode	varchar(32) NOT NULL, */batches  boolean COMMENT 'Schedule in Batches?',snapshotId int COMMENT 'Snapshot Id for this Subject',FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,CONSTRAINT c_subjectShortName UNIQUE(subjectShortName, snapshotId));`
    FileWrite $0 `CREATE TABLE subjectBatchTeacher(sbtId int AUTO_INCREMENT PRIMARY KEY COMMENT 'SBT Id',subjectId int NOT NULL COMMENT 'Subject Id',batchId int NOT NULL COMMENT 'Batch Id',teacherId int COMMENT 'Teacher Id',snapshotId int COMMENT 'Snapshot Id for this SBT',FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,FOREIGN KEY (batchId) REFERENCES batch(batchId) ON DELETE CASCADE,FOREIGN KEY (subjectId) REFERENCES subject(subjectId) ON DELETE CASCADE,FOREIGN KEY (teacherId) REFERENCES teacher(teacherId) ON DELETE CASCADE,CONSTRAINT c_subjectBatchTeacheer UNIQUE(subjectId, batchId, snapshotId));`
    FileWrite $0 `CREATE VIEW subjectBatchTeacherReadable AS SELECT sbt.sbtId, s.subjectId, s.subjectShortName,b.batchId, b.batchName, t.teacherId, t.teacherShortName , ss.snapshotName FROM subject s, batch b, subjectBatchTeacher sbt, teacher t, snapshot ss WHERE sbt.subjectId = s.subjectId AND sbt.batchId = b.batchId AND sbt.teacherId = t.teacherId AND sbt.snapshotId = ss.snapshotId ORDER by snapshotName , subjectShortName, batchName, teacherShortName;`
    FileWrite $0 `CREATE TABLE overlappingSBT(osbtId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Id: Subject-Batch Pairs that must overlap',sbtId1 int NOT NULL COMMENT 'Sub-Batch Id 1',sbtId2  int NOT NULL COMMENT 'Sub-Batch Id 2',snapshotId int COMMENT 'Snapshot Id for this OSBT',FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,FOREIGN KEY (sbtId1) REFERENCES subjectBatchTeacher(sbtId) ON DELETE CASCADE ON UPDATE CASCADE,FOREIGN KEY (sbtId2) REFERENCES subjectBatchTeacher(sbtId) ON DELETE CASCADE ON UPDATE CASCADE,CONSTRAINT c_overlappingSBT UNIQUE(sbtId1, sbtId2, snapshotId));`
    FileWrite $0 `CREATE VIEW overlappingSBTReadable AS SELECT sbto.osbtId as osbtId,s1.subjectId as subjectId1, s1.subjectShortName as subject1,b1.batchId as batchId1, b1.batchName as batch1,t1.teacherId as teacherId1, t1.teacherShortName as teacher1,s2.subjectId as subjectId2, s2.subjectShortName as subject2,b2.batchId as batchId2, b2.batchName as batch2,t2.teacherId as teacherId2, t2.teacherShortName as teacher2,ss.snapshotName FROM subject s1, subject s2, batch b1, batch b2, teacher t1, teacher t2, overlappingSBT sbto, subjectBatchTeacher sbt1, subjectBatchTeacher sbt2, snapshot ss WHERE sbto.sbtId1 = sbt1.sbtId AND sbto.sbtId2 = sbt2.sbtId AND sbt1.subjectId = s1.subjectId AND sbt1.batchId = b1.batchId AND sbt1.teacherId = t1.teacherId AND sbt2.subjectId = s2.subjectId AND sbt2.batchId = b2.batchId AND sbt2.teacherId = t2.teacherId AND sbto.snapshotId = ss.snapshotId ORDER BY snapshotName, subject1, subject2;`
    FileWrite $0 `CREATE TABLE subjectClassTeacher(sctId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Subject Class Teacher Mapping Id',subjectId int NOT NULL COMMENT 'Subject Id',classId int NOT NULL COMMENT 'Class Id',teacherId int COMMENT 'Teacher Id',snapshotId int COMMENT 'Snapshot Id for this SCT',FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,FOREIGN KEY (subjectId) REFERENCES subject(subjectId) ON DELETE CASCADE,FOREIGN KEY (classId) REFERENCES class(classId) ON DELETE CASCADE,FOREIGN KEY (teacherId) REFERENCES teacher(teacherId) ON DELETE CASCADE,CONSTRAINT c_subjectClassTeacheer UNIQUE(subjectId, classId, snapshotId));`
    FileWrite $0 `CREATE VIEW subjectClassTeacherReadable AS SELECT  sct.sctId, c.classId, c.classShortName, s.subjectId, s.subjectShortName,t.teacherId, t.teacherShortName, ss.snapshotName FROM subject s, class c, teacher t, subjectClassTeacher sct, snapshot ss WHERE s.subjectId = sct.subjectId AND t.teacherId = sct.teacherId AND c.classId = sct.classId  AND sct.snapshotId = ss.snapshotId ORDER BY snapshotName, subjectShortName, classShortName, teacherShortName;`
    FileWrite $0 `CREATE TABLE classRoom(crId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Class Room Mapping Id',classId int NOT NULL COMMENT 'Class Id',roomId  int NOT NULL COMMENT 'Room Id',snapshotId int COMMENT 'Snapshot Id for this Class-Room',FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,FOREIGN KEY (classId) REFERENCES class(classId) ON DELETE CASCADE,FOREIGN KEY (roomId) REFERENCES room(roomId) ON DELETE CASCADE,CONSTRAINT c_classRoom UNIQUE(classId, snapshotId));`
    FileWrite $0 `CREATE VIEW classRoomReadable AS SELECT cr.crId, c.classId, c.classShortName, r.roomId, r.roomShortName, s.snapshotName FROM class c, room r, classRoom cr, snapshot s WHERE c.classId = cr.classId AND r.roomId = cr.roomId AND cr.snapshotId = s.snapshotId ORDER BY snapshotName, classShortName, roomShortName;`
    FileWrite $0 `CREATE TABLE batchRoom(brId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Batch Room Mapping Id',batchId int NOT NULL COMMENT 'Batch Id',roomId  int NOT NULL COMMENT 'Room Id',snapshotId int COMMENT 'Snapshot Id for this Batch-Room',FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,FOREIGN KEY (batchId) REFERENCES batch(batchId) ON DELETE CASCADE,FOREIGN KEY (roomId) REFERENCES room(roomId) ON DELETE CASCADE,CONSTRAINT c_batchRoom UNIQUE(batchId, snapshotId));`
    FileWrite $0 `CREATE VIEW batchRoomReadable AS SELECT br.brId, b.batchId, b.batchName, r.roomId, r.roomShortName, s.snapshotName FROM batch b, room r, batchRoom br, snapshot s WHERE b.batchId = br.batchId AND r.roomId = br.roomId AND br.snapshotId = s.snapshotId ORDER BY snapshotName, batchName, roomShortName;`
    FileWrite $0 `CREATE TABLE subjectRoom(srId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Subject Room Preference Id',subjectId int NOT NULL COMMENT 'Subject Id',roomId int NOT NULL COMMENT 'Room Id',snapshotId int COMMENT 'Snapshot Id for this Subject-Room',FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,FOREIGN KEY (subjectId) REFERENCES subject(subjectId) ON DELETE CASCADE,FOREIGN KEY (roomId) REFERENCES room(roomId) ON DELETE CASCADE,CONSTRAINT c_subjectRoom UNIQUE(subjectId, snapshotId));`
    FileWrite $0 `CREATE VIEW subjectRoomReadable AS SELECT sr.srId, s.subjectId, s.subjectShortName, r.roomId,r.roomShortName , ss.snapshotName FROM subject s, room r, subjectRoom sr, snapshot ss WHERE s.subjectId = sr.subjectId AND r.roomId = sr.roomId AND r.snapshotId = ss.snapshotId ORDER BY snapshotName, subjectShortName, roomShortName;`
    FileWrite $0 `CREATE TABLE timeTable(ttId int AUTO_INCREMENT PRIMARY KEY COMMENT 'TimeTable Id',day smallint COMMENT 'Day of Week',slotNo int COMMENT 'Slot No.',roomId  int COMMENT 'Room Id',classId int COMMENT 'Class Id',subjectId int COMMENT 'Subject Id',teacherId int COMMENT 'Teacher Id',batchId int COMMENT 'Batch Id',isFixed boolean COMMENT 'Is Lunch/Fixed Slot?',snapshotId int NOT NULL COMMENT 'Snapshot Id',FOREIGN KEY (roomId) REFERENCES room(roomId) ON DELETE CASCADE,FOREIGN KEY (classId) REFERENCES class(classId) ON DELETE CASCADE,FOREIGN KEY (batchId) REFERENCES batch(batchId) ON DELETE CASCADE,FOREIGN KEY (subjectId) REFERENCES subject(subjectId) ON DELETE CASCADE,FOREIGN KEY (teacherId) REFERENCES teacher(teacherId) ON DELETE CASCADE,FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE);`
    ;FileWrite $0 `/*  Requirements on every new entry or an update $\r$\n same day slot teacher --> room same, subject same, class can be different (combined classes), batches can be different, break must be false$\r$\nsame day slot class --> roomId same not allowed (duplicate entry) + different room must for different batch, subject same ok for lab course as batch will be scheduled + different subject also ok for a batch of different lab,   teacherId must be different, batchId must be different, break must be false$\r$\nsame day slot subject --> must be a lab, batchId must be present, roomId must be different, classId can be different (different classe's batch scheduled), teacherId must be different, break must be false$\r$\nsame day slot  batch --> not allowed. batch will be always in one place any given time.$\r$\nany day, any slot, break true --> room NULL, subject NULL,  class not NULL, teacher ??, batch may or may not be NULL,*/$\r$\n/* create views : ttId	day slotNo	roomId	classId	subjectId teacherIdbatchIdisFixed snapshotId  */`
    FileWrite $0 `CREATE VIEW timeTableReadable AS SELECT tt.ttId, tt.day, tt.slotNo, r.roomShortName, c.classShortName,s.subjectShortName, t.teacherShortName, b.batchName, tt.isFixed, sn.snapshotName FROM  timeTable tt, room r, class c, subject s, teacher t, batch b, snapshot sn WHERE tt.classId = c.classId AND tt.subjectId = s.subjectId AND tt.batchId = b.batchId AND tt.batchId IS NOT null AND tt.roomId = r.roomId AND tt.teacherId = t.teacherId AND tt.snapshotId = sn.snapshotId AND tt.isFixed = FALSE UNION SELECT tt.ttId, tt.day, tt.slotNo, r.roomShortName, c.classShortName, s.subjectShortName, t.teacherShortName, null, tt.isFixed, sn.snapshotName FROM `
    FileWrite $0 `timeTable tt, room r, class c, subject s, teacher t, snapshot sn WHERE tt.classId = c.classId AND tt.subjectId = s.subjectId AND tt.roomId = r.roomId AND tt.teacherId = t.teacherId AND tt.batchId IS null AND tt.snapshotId = sn.snapshotId AND tt.isFixed = FALSE UNION SELECT tt.ttId, tt.day, tt.slotNo, null, c.classShortName, null, null, null, TRUE, sn.snapshotName FROM  timeTable tt, class c, snapshot sn WHERE tt.isFixed = TRUE AND tt.classId = c.classId AND tt.snapshotId = sn.snapshotId ORDER by ttId;`
    FileWrite $0 `$\r$\nCREATE TABLE fixedEntry (feId int AUTO_INCREMENT PRIMARY KEY COMMENT 'Fixed Entry Id',ttId int NOT NULL COMMENT 'Timetable Entry Id',fixedText varchar(128) COMMENT 'Description',snapshotId int COMMENT 'Snapshot Id for this fixedEntry',FOREIGN KEY (snapshotId) REFERENCES snapshot(snapshotId) ON DELETE CASCADE,FOREIGN KEY (ttId) REFERENCES timeTable(ttId) ON DELETE CASCADE,CONSTRAINT c_fixedEntry UNIQUE(ttId, snapshotId));`
    FileClose $0
    StrCmp $password "" 0 +3
    ExecWait '"$folder_mysql\bin\mysql" -u $login --execute="source $source" $dbname' $2
    Goto +2
    ExecWait '"$folder_mysql\bin\mysql" -u $login -p$password --execute="source $source" $dbname' $2
    StrCmp $2 1 0 new
    StrCpy $errorsrc "couldn't import the sql schema"
    Goto abortinst
new:
    FileOpen $0 $INSTDIR\db-schema\windows_conf.sql w
    FileWrite $0 'insert into dept (deptName, deptShortName) values ("$deptName", "$deptShortName");'
    FileWrite $0 'insert into user (userName, password) values ("$userName", "$passwd");'
    FileWrite $0 'insert into config (configName, dayBegin, slotDuration, nSlots, deptId, incharge) values ("$configName", "$dayBegin", $slotDuration, $nSlots, 1, 1);'
    FileClose $0
    StrCpy $source "$INSTDIR\db-schema\windows_conf.sql"
    StrCmp $password "" 0 +3
    ExecWait '"$folder_mysql\bin\mysql" -u $login --execute="source $source" $dbname' $3
    Goto +2
    ExecWait '"$folder_mysql\bin\mysql" -u $login -p$password --execute="source $source" $dbname' $3
    Strcmp $3 1 0 endinst
    StrCpy $errorsrc "Database or schema creation failed"
    Goto abortinst

    abortinst:
    MessageBox MB_OK "Error: $errorsrc please try running the installer again"  IDOK 0
    RMDir /r "$INSTDIR" ;;remove the taasika folder
    RMDir  "$INSTDIR"
    DeleteRegKey /ifempty HKCU "Software\Taasika"
    Abort
    Goto abort_inst

    endinst:
    Delete $INSTDIR\db-schema\windows-conf.sql ;remove the created temporary file
    ;;creating config.php file in taasika
    FileOpen $0 $INSTDIR\config.php w
    FileWrite $0 "<?php"
    FileWrite $0 "$\r$\n"
    FileWrite $0 "unset($$CFG);"
    FileWrite $0 "$\r$\n"
    FileWrite $0 "global $$CFG;"
    FileWrite $0 "$\r$\n"
    FileWrite $0 '$$CFG = new stdClass();'
    FileWrite $0 "$\r$\n"
    FileWrite $0 '$$CFG->db_type = "mysqli";'
    FileWrite $0 "$\r$\n"
    FileWrite $0 '$$CFG->db_user = "$login";'
    FileWrite $0 "$\r$\n"
    FileWrite $0 '$$CFG->db_pass = "$password";'
    FileWrite $0 "$\r$\n"
    FileWrite $0 '$$CFG->db_database = "$dbname";'
    FileWrite $0 "$\r$\n"
    FileWrite $0 '$$CFG->server = "localhost";'
    FileWrite $0 "$\r$\n"
    FileWrite $0 '$$CFG->port = "3306";'
    FileWrite $0 "$\r$\n"
    FileWrite $0 "$$CFG->conn = false;"
    FileWrite $0 "$\r$\n"
    FileWrite $0 "$$CFG->logfile = false;"
    FileWrite $0 "$\r$\n"
    FileWrite $0 "$$CFG->logfileName = false;"
    FileWrite $0 "$\r$\n"
    FileWrite $0 "?>"
    FileClose $0
    WriteUninstaller "$INSTDIR\Uninstall.exe"
    FileOpen $0 $INSTDIR\launch_taasika.cmd w
    FileWrite $0 `@echo off $\r$\n`
    ${If} $selected_type = 1
          ;wamp
          FileWrite $0 `Tasklist | findstr "mysqld.exe"$\r$\nIF %ErrorLevel% EQU 1 echo msgbox "wamp is not running please start wamp and try again!" > "%temp%\popup.vbs"&wscript.exe "%temp%\popup.vbs"&exit$\r$\n`
          FileWrite $0 `Tasklist | findstr "httpd.exe"$\r$\nIF %ErrorLevel% EQU 1 echo msgbox "wamp is not running please start wamp and try again!" > "%temp%\popup.vbs"&wscript.exe "%temp%\popup.vbs"&exit$\r$\nstart $browser_path -new -tab "localhost/Taasika/timetable.php"$\r$\nexit$\r$\n`
     ${EndIf}
     ${If} $selected_type = 2
           FileWrite $0 `Tasklist | findstr "mysqld.exe"$\r$\nIF %ErrorLevel% EQU 1 echo msgbox "xampp is not running please start xampp and try again!" > "%temp%\popup.vbs"&wscript.exe "%temp%\popup.vbs"&exit$\r$\n`
           FileWrite $0 `Tasklist | findstr "httpd.exe"$\r$\nIF %ErrorLevel% EQU 1 echo msgbox "xampp is not running please start xammpp and try again!" > "%temp%\popup.vbs"&wscript.exe "%temp%\popup.vbs"&exit$\r$\nstart $browser_path -new -tab "localhost/Taasika/timetable.php"$\r$\nexit$\r$\n`
      ${EndIf}
      FileClose $0
    /*creating a shortcut*/
    CreateShortcut "$Desktop\taasika.lnk" "$INSTDIR\launch_taasika.cmd" "launch taasika"
    abort_inst:
SectionEnd

;;for custom pages
Function .onInit
    InitPluginsDir
    !insertmacro INSTALLOPTIONS_EXTRACT "custom.ini"
    !insertmacro INSTALLOPTIONS_EXTRACT "config_details.ini"
    !insertmacro INSTALLOPTIONS_EXTRACT "initial_config.ini"
    StrCpy $checking "0"
FunctionEnd

 Function GetInfos
    !insertmacro MUI_HEADER_TEXT "Database information" "Database information - please fill all elements"
    !insertmacro INSTALLOPTIONS_DISPLAY "custom.ini"
FunctionEnd

Function GetInfosLeave
    ReadINIStr $login "$PLUGINSDIR\custom.ini" "Field 2" "State"
    StrCmp $login "" 0 +3
    MessageBox MB_OK "username for mysql database cannot be empty" IDOK 0
    Abort
    ReadINIStr $password "$PLUGINSDIR\custom.ini" "Field 4" "State"
    StrCmp $password "" 0 +3
    MessageBox MB_YESNO "the password field is empty are you sure you want to continue" IDYES +2 IDNO 0
    Abort
    ClearErrors
    StrCmp $password "" 0 +3
    ExecWait '"$folder_mysql\bin\mysql" -u$login --execute="SHOW DATABASES;"' $0
    Goto +2
    ExecWait '"$folder_mysql\bin\mysql" -u$login -p$password --execute="SHOW DATABASES;"' $0
    IfErrors +1 +2
    MessageBox MB_OK "Error occured code $0"
    StrCmp $0 1 0 +3
    MessageBox MB_OK "wrong user name or password"
    abort
    ReadINIStr $dbname "$PLUGINSDIR\custom.ini" "Field 6" "State"
    StrCmp $dbname "" 0 +3
    MessageBox MB_OK " database name cannot be empty" IDOK 0
    Abort
    MessageBox MB_OK " database name $dbname" IDOK 0
FunctionEnd

Function GCD_leave
      ReadINIStr $deptName "$PLUGINSDIR\config_details.ini" "Field 2" "State"
      StrCmp $deptName "" 0 +3
      MessageBox MB_OK "deptartment name for timetable cannot be empty" IDOK 0
      Abort
      ReadINIStr $deptShortName "$PLUGINSDIR\config_details.ini" "Field 4" "State"
      StrCmp $deptShortName "" 0 +3
      MessageBox MB_OK "deptartment short name cannot be empty" IDOK 0
      Abort
      ReadINIStr $userName "$PLUGINSDIR\config_details.ini" "Field 6" "State"
      StrCmp $userName "" 0 +3
      MessageBox MB_OK "username cannot be empty" IDOK 0
      Abort
      ReadINIStr $passwd "$PLUGINSDIR\config_details.ini" "Field 9" "State"
      StrCmp $passwd "" 0 +3
      MessageBox MB_OK "please choose a password for your account password cannot be empty" IDOK 0
      Abort
FunctionEnd

Function GIC_leave
      ReadINIStr $configName "$PLUGINSDIR\initial_config.ini" "Field 2" "State"
      StrCmp $ConfigName "" 0 +3
      MessageBox MB_OK "configuration name cannot be empty" IDOK 0
      Abort
      ReadINIStr $dayBegin "$PLUGINSDIR\initial_config.ini" "Field 4" "State"
      StrCmp $dayBegin "" 0 +3
      MessageBox MB_OK "please fill the 'Day Begins' field" IDOK 0
      Abort
      ReadINIStr $slotDuration "$PLUGINSDIR\initial_config.ini" "Field 6" "State"
      StrCmp $slotDuration "" 0 +3
      MessageBox MB_OK "slot duration cannot be empty" IDOK 0
      Abort
      ${Validate} $3 $slotDuration ${NUMERIC}
      StrCmp $3 "0" 0 +3
      MessageBox MB_OK "slot duration must be an integer" IDOK 0
      Abort
      IntOp $slotDuration $slotDuration * 60
      ReadINIStr $nSlots "$PLUGINSDIR\initial_config.ini" "Field 8" "State"
      StrCmp $nSlots "" 0 +3
      MessageBox MB_OK "no of slots cannot be empty" IDOK 0
      Abort
      ${Validate} $3 $nSlots ${NUMERIC}
      StrCmp $3 "0" 0 +3
      MessageBox MB_OK "no of slots  must be an integer" IDOK 0
      Abort
      ReadINIStr $daysInWeek "$PLUGINSDIR\initial_config.ini" "Field 10" "State"
      StrCmp $daysInWeek "" 0 +3
      MessageBox MB_OK "please enter working days in a week" IDOK 0
      Abort
      ${Validate} $3 $daysInWeek ${NUMERIC}
      StrCmp $3 "0" 0 +3
      MessageBox MB_OK "no of days must be an integer" IDOK 0
      Abort
      IntCmp $daysInWeek 0 is0 lessthan0 morethan0
      is0:
      lessthan0:
          MessageBox MB_OK "no of days must more than 0" IDOK 0
          Abort
      morethan0:
           IntCmp $daysInWeek 8 is8 lessthan8 morethan8
      is8:
      morethan8:
          MessageBox MB_OK "no of days must be less than 8" IDOK 0
          Abort
      lessthan8:
FunctionEnd
;;following function displays second custom page config_details.ini
Function GetConfigDetails
    !insertmacro MUI_HEADER_TEXT "Database information" "Database information - please fill all elements"
    !insertmacro INSTALLOPTIONS_DISPLAY "config_details.ini"
FunctionEnd

Function GetInitialConfig
    !insertmacro MUI_HEADER_TEXT "Database information" "Database information - please fill all elements"
    !insertmacro INSTALLOPTIONS_DISPLAY "initial_config.ini"
FunctionEnd
/*function given below is called when the custom page for selection xampp wamp is created*/
Function TypeOfInstaller
         nsDialogs::Create 1018
         Pop $0
         ${NSD_CreateLabel} 8 20 100% 10u "Please select one of the following: (how you have installed apache,php and mysql)"
         ${NSD_CreateCheckbox} 8 40 50u 10u "WAMP"
         Pop $type_wamp
         ${NSD_CreateCheckbox} 8 60 50u 10u "XAMPP"
         Pop $type_xampp
         ${NSD_CreateLabel} 8 100 100% 10u "Please select one of the following: (default browser for launching taasika)"
         ${NSD_CreateCheckbox} 8 120 100% 10u "Mozilla firefox"
         Pop $firefox
         ${NSD_CreateCheckbox} 8 140 100% 10u "Google Chrome"
         Pop $chrome
         nsDialogs::Show
FunctionEnd
/*function given below is called on cliking next in the selection page for xmap and wamp*/
Function TypeOfInstallerLeave
         ${NSD_GetState} $type_wamp $0
         ${If} $0 <> ${BST_UNCHECKED}
                StrCpy $selected_type ${WAMP}
        ${EndIf}
        
        ${NSD_GetState} $type_xampp $1
         ${If} $1 <> ${BST_UNCHECKED}
                StrCpy $selected_type ${XAMPP}
        ${EndIf}
        

        ${If} $0 = ${BST_CHECKED}
              ${If} $1 = ${BST_CHECKED}
                    MessageBox MB_OK "please select only one installation type" IDOK multi
              ${Else}
                            goto next
              ${EndIf}
        ${Else}
               ${If} $1 = ${BST_CHECKED}
                            goto next
                ${Else}
                           MessageBox MB_OK "please select at least one installation type" IDOK multi
                     
              ${EndIf}
        ${EndIf}
        
        next:
         ${NSD_GetState} $firefox $2
         ${If} $2 <> ${BST_UNCHECKED}
                StrCpy $def_browser "firefox"
        ${EndIf}

        ${NSD_GetState} $chrome $3
         ${If} $3 <> ${BST_UNCHECKED}
                StrCpy $def_browser "chrome"
        ${EndIf}

        ${If} $2 = ${BST_CHECKED}
              ${If} $3 = ${BST_CHECKED}
                    MessageBox MB_OK "please select only one browser option" IDOK multi
              ${Else}
                     goto done
              ${EndIf}
        ${Else}
               ${If} $3 = ${BST_CHECKED}
                     goto done
                ${Else}
                       MessageBox MB_OK "please select at least one browser option" IDOK multi
              ${EndIf}
        ${EndIf}
        multi:
              Abort
        done:
         Strcmp $checking "0" 0 +4
         Call find_installed_server
         Sleep 3000
         StrCpy $checking "1"
         Call search_browser
FunctionEnd
Function adjust_path_spaces
         pop $sub
         StrCpy $3 "0"
         again:
               ${StrStrAdv}  $first $sub "\" ">" "<" "0" "0" "0"
               StrCmp $first "" done
               StrCmp $3 "0" 0 +4
               StrCpy $3 "1"
               StrCpy $final `$first\`
               Goto +2
               StrCpy $final `$final"$first"\`
               ${StrStrAdv}  $last $sub "\" ">" ">" "0" "0" "0"
               StrCpy $sub $last
               Goto again
         done:
              StrCmp $sub "" +2 0
              StrCpy $final `$final"$sub"`
              push $final
FunctionEnd
Function LaunchLink
        StrCmp $8 "error" skip 0
            ${If} $selected_type = 2
                StrCpy $0 `$xampp_root\xampp_stop.exe`
                ExecWait '"$0"'
            ${EndIf}
	skip:
FunctionEnd
;--------------------------------
;Descriptions;Language strings
LangString DESC_SecDummy ${LANG_ENGLISH} "contains taasika."
;Assign language strings to sections
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
!insertmacro MUI_DESCRIPTION_TEXT ${SecDummy} $(DESC_SecDummy)
!insertmacro MUI_FUNCTION_DESCRIPTION_END
;--------------------------------
;Uninstaller Section
Section "Uninstall"
        Delete "$INSTDIR\Uninstall.exe"
        RMDir /r "$INSTDIR" ;;remove the taasika folder
        Delete "$Desktop\taasika.lnk"
        RMDir "$INSTDIR"
        DeleteRegKey /ifempty HKCU "Software\Taasika"
SectionEnd
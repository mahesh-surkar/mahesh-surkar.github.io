#!/bin/bash
# InfoTrophic moodle backup script.
dateTime=$(/bin/date +%Y_%m_%d_%H_%M_%S)
#echo $dateTime
backupDir="siteBackup_"$dateTime 
backupTar=$backupDir".tar"

/bin/mkdir $backupDir

echo "Starting Infotrophic Backup......"

echo "Starting Infotrophic Moodle Data Backup......"
/usr/bin/sudo /bin/tar -pcvf $backupDir/moodledata.tar -C /opt moodledata

echo "Starting Infotrophic PGSQL Database backup......"
/usr/bin/sudo /usr/bin/pg_dumpall -U postgres > $backupDir/pgSqlDump.sql 

/usr/bin/sudo /bin/tar -cvf $backupTar $backupDir 
echo "Created Backup file : " $backupTar 

/bin/rm -rf $backupDir 


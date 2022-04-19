const {
    mysql_host,
    mysql_user,
    mysql_passwd,
    mysql_db,
} = require('./modules/mysql_conf.json');

const host = mysql_host;
const user = mysql_user;
const password = mysql_passwd;
const database = mysql_db;

const Importer = require('mysql-import');
const importer = new Importer({host, user, password, database});

// New onProgress method, added in version 5.0!
importer.onProgress(progress=>{
  var percent = Math.floor(progress.bytes_processed / progress.total_bytes * 10000) / 100;
  console.log(`${percent}% Completed`);
});

importer.import('./sqlsetup/dump.sql').then(()=>{
  var files_imported = importer.getImported();
  console.log(`${files_imported.length} SQL file(s) imported.`);
}).catch(err=>{
  console.error(err);
});
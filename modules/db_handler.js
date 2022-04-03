const mysql = require('mysql');

const {
    mysql_host,
    mysql_user,
    mysql_passwd,
    mysql_db,
} = require('./mysql_conf.json');

const connection = mysql.createConnection({
    host: mysql_host,
    user: mysql_user,
    password: mysql_passwd,
    database: mysql_db
});

connection.connect((err) => {
    if (err) throw err;
    console.log('\x1b[33m%s\x1b[0m', '[DEBUG] Database connected!');
});

module.exports = {
    select(table, values = '*', conditions = '1') {
        return new Promise(function (resolve, reject) {
            connection.query(`SELECT ${values} FROM ${table} WHERE ${conditions}`, function (err, res, fields) {
                if (err) reject(err);
                resolve(res);
            });
        });
    }, 
    insert(table, rows, values) {
        return new Promise(function (resolve, reject) {
            connection.query(`INSERT INTO ${table} ${rows} VALUES ${values}`, function (err, res, fields) {
                if (err) reject(err);
                resolve(res);
            });
        });
    },
    update(table, set, conditions) {
        return new Promise(function (resolve, reject) {
            connection.query(`UPDATE ${table} SET ${set} WHERE ${conditions}`, function (err, res, fields) {
                if (err) reject(err);
                resolve(res);
            });
        });
    },
    delete(table, conditions = '0') {
        return new Promise(function (resolve, reject) {
            connection.query(`DELETE FROM ${table} WHERE ${conditions}`, function (err, res, fields) {
                if (err) reject(err);
                resolve(res);
            });
        });
    },
};
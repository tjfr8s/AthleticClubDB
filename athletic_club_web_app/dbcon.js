var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_freitast',
    password        : '4226',
    database        : 'cs340_freitast'
});
module.exports.pool = pool;

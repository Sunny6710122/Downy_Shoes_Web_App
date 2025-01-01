const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: "7258",
database: 'test',
insecureAuth : true
});

module.exports = connection;
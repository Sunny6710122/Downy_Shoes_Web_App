const mysql2 = require('mysql2/promise');


const db = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: "7258",
    database: 'test'
});


module.exports = db;
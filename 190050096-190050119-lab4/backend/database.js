const { Pool } = require('pg');
require('dotenv').config();

var pool = new Pool({
    user: process.env.USER_NAME,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.USER_PSWD,
    port: process.env.PORT,
});

pool.on('error', (err, client) => {
    console.error('Error:', err);
});

module.exports = pool

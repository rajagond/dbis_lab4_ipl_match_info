const { Pool } = require('pg');
require('dotenv').config();
const Cursor = require('pg-cursor')

const pool = new Pool({
    user: process.env.USER_NAME,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.USER_PSWD,
    port: process.env.PORT,
});

pool.on('error', (err, client) => {
    console.error('Error:', err);
});


const text = 'SELECT * FROM $1 WHERE ORDER BY season_year LIMIT $2'
const values = ['match', 10]
// callback
client.query(text, values, (err, res) => {
  if (err) {
    console.log(err.stack)
  } else {
    console.log(res)
    // { name: 'brianc', email: 'brian.m.carlson@gmail.com' }
  }
})
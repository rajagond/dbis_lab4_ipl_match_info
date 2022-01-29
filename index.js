const express = require('express');
require('dotenv').config();

const app = express(),
      bodyParser = require("body-parser");
      port = 3001;

//const db_connect = require('./postgres_db.js');

const { Pool } = require('pg');
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


app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

app.get('/', function (request,response) {
    //response.send('App Works !!!!');
    response.json({ info: 'Node.js, Express, and Postgres API' })

});

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.get('/matches', function userIdHandler (request, response) {
    const skip = request.query.skip;
    const limit = request.query.limit;
    console.log(skip, limit);
    response.send('GET');
  })

app.listen(port, function ()  {
  console.log(`App running on port ${port}.`)
})
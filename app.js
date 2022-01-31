const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db_connect = require('./postgres_db')
const port = 3000
require('dotenv').config();

const router = require('./routers/index');


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

//app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.use('/matches', router );

app.listen(port, function ()  {
  console.log(`App running on port ${port}.`)
})

app.get('/match', db_connect.getMatches)
app.get('/match/:id', db_connect.getMatchById)

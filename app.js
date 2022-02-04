const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db_connect = require('./postgres_db')
const port = 3000
require('dotenv').config();

const router_matches = require('./routers/index');
const router_venue = require('./routers/venue_route');
const router_player = require('./routers/player_route');
const router_pointstable = require('./routers/points_table');


app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  )

app.listen(port, function ()  {
  console.log(`App running on port ${port}.`)
})



//app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.use('/matches', router_matches );
app.use('/venues', router_venue );
app.use('/players', router_player );
app.use('/pointstable', router_pointstable );



app.get('/', function (req,res) {
  //res.send('App Works !!!!');
  res.json({ info: 'Node.js, Express, and Postgres API' })

});
//app.get('/match', db_connect.getMatches)
//app.get('/match/:id', db_connect.getMatchById)

app.use((req, res, next) => {
  const error = new Error('Not Found!');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

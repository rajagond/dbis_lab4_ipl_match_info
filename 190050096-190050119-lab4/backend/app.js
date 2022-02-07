const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
require('dotenv').config();

const router_matches = require('./routers/match_route');
const router_venue = require('./routers/venue_route');
const router_player = require('./routers/player_route');
const router_pointstable = require('./routers/points_table_route');


app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.listen(port, function() {
    console.log(`App running on port ${port}.`)
})

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});

app.use('/matches', router_matches);
app.use('/venues', router_venue);
app.use('/players', router_player);
app.use('/pointstable', router_pointstable);


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
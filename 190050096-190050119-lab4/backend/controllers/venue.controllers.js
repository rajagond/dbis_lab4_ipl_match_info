const pool = require('../database')

const getVenue = function(req, res, next) {
    pool.query('SELECT venue_id, venue_name, city_name, country_name FROM venue;', (error, results) => {
        if (error) {
            //throw error
            next(error)
        } else res.status(200).json(results.rows)
    })
}

//venues/:venue_id/basic
const getVenueInformation = function(req, res, next) {
    const venue_id = parseInt(req.params.venue_id)
    const query = {
        text: `SELECT venue_name, city_name, country_name, capacity, num_matches, high, low, runs_chased
        FROM (SELECT * FROM venue WHERE venue_id = $1) AS a
        LEFT JOIN
      (SELECT COUNT(DISTINCT venue_match.match_id) AS num_matches, MAX(score.total_scored) AS high, MIN(score.total_scored) AS low, venue_id
        FROM (SELECT * FROM match WHERE venue_id = $1) AS venue_match
        LEFT JOIN
      (SELECT match_id, SUM(runs_scored + extra_runs) AS total_scored
        FROM ball_by_ball
        GROUP BY match_id, innings_no) AS score
        ON venue_match.match_id = score.match_id
        GROUP By venue_id) AS b
        ON a.venue_id = b.venue_id
        LEFT JOIN 
      (SELECT MAX(score.total_scored) AS runs_chased, venue_id
        FROM (SELECT * FROM match WHERE venue_id = $1 AND win_type = 'wickets' ) AS venue_match
        LEFT JOIN
      (SELECT match_id, SUM(runs_scored + extra_runs) AS total_scored
        FROM ball_by_ball
        WHERE innings_no = 1
        GROUP BY match_id, innings_no) AS score
        ON venue_match.match_id = score.match_id
        GROUP BY venue_id) AS c
        ON b.venue_id = c.venue_id;`,
        values: [venue_id],
    }
    pool.query(query, (error, results) => {
        if (error) {
            next(error)
        } else res.status(200).json(results.rows)
    })
}

//venues/:venue_id/pie_chart
const getVenuePieChartInformation = function(req, res, next) {
        const venue_id = parseInt(req.params.venue_id)
        const query = {
            text: `SELECT COALESCE(SUM(CASE WHEN win_type = 'runs' THEN 1 ELSE 0 END), 0) AS first,
        COALESCE(SUM(CASE WHEN win_type = 'wickets' THEN 1 ELSE 0 END), 0) AS second,
        COALESCE(SUM(CASE WHEN win_type NOT IN ('runs', 'wickets') THEN 1 ELSE 0 END), 0) AS draw
        FROM match 
        WHERE venue_id = $1;`,
            values: [venue_id],
        }
        pool.query(query, (error, results) => {
            if (error) {
                next(error)
            } else res.status(200).json(results.rows)
        })
    }
    //venues/:venue_id/graph
const getVenueGraphInformation = function(req, res, next) {
    const venue_id = parseInt(req.params.venue_id)
    const query = {
        text: `SELECT season_year, AVG(run) as avg
        FROM
        (SELECT season_year, match_id
        FROM match 
        WHERE venue_id = $1 AND season_year IN (2011, 2013, 2015, 2017)) AS t1
        LEFT JOIN
        (SELECT match_id, SUM(runs_scored + extra_runs) AS run
        FROM ball_by_ball
        WHERE innings_no = 1
        GROUP BY match_id, innings_no) t2
        ON t1.match_id = t2.match_id
        GROUP BY season_year;`,
        values: [venue_id],
    }
    pool.query(query, (error, results) => {
        if (error) {
            next(error)
        } else res.status(200).json(results.rows)
    })
}

const createVenue = (req, res, next) => {
    const { venue_name, city_name, country_name, capacity } = req.body
    pool.query("INSERT INTO venue(venue_name, city_name, country_name, capacity) VALUES ($1, $2, $3, $4)", [venue_name, city_name, country_name, parseInt(capacity)], (error, results) => {
        if (error) {
            console.log(error)
            next(error)
        } else res.status(200).json({ status: "Venue Added" })
    })
}
module.exports = {
    getVenue,
    getVenueInformation,
    getVenuePieChartInformation,
    getVenueGraphInformation,
    createVenue
}
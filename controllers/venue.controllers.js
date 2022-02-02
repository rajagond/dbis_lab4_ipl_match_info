const pool = require('../database')

const getVenue = function (request, response) {
    pool.query('SELECT venue_id, venue_name, city_name, country_name FROM venue;',  (error, results) => {
        if (error) {
          //throw error
          response.status(201)
        }
        else response.status(200).json(results.rows)
    })
}
//venues/:venue_id/basic
const getVenueInformation = function (request, response) {
    const venue_id = parseInt(request.params.venue_id)
    const query1 = {
        text: `SELECT venue_name, city_name, country_name, capacity FROM venue WHERE venue_id = $1;`,
        values: [venue_id],
    }
    const query2 = {
      text: `SELECT COUNT(DISTINCT venue_match.match_id) AS num_matches, MAX(score.total_scored) AS high, MIN(score.total_scored) AS low
      FROM (SELECT * FROM match WHERE venue_id = $1) AS venue_match
      LEFT JOIN
      (SELECT match_id, innings_no, SUM(runs_scored + extra_runs) AS total_scored
      FROM ball_by_ball
      GROUP BY match_id, innings_no) AS score
      ON venue_match.match_id = score.match_id;`,
      values: [venue_id],
    }
    const query3 = {
    text: `SELECT COALESCE(MAX(score.total_scored) + 1, 0) AS runs_chased
    FROM (SELECT * FROM match WHERE venue_id = $1 AND win_type='wickets') AS venue_match
    LEFT JOIN
    (SELECT match_id, innings_no, SUM(runs_scored + extra_runs) AS total_scored
    FROM ball_by_ball
    WHERE innings_no = 1
    GROUP BY match_id, innings_no) AS score
    ON venue_match.match_id = score.match_id;`,
    values: [venue_id],
    }
    pool.query(query1, (error, results1) => {
        if (error) {
          throw error
        }
        pool.query(query2, (error, results2) => {
          if (error) {
            throw error
          }
          pool.query(query3, (error, results3) => {
            if (error) {
              throw error
            }
          response.status(200).json({
            "basic": results1.rows,
            "match_high_low": results2.rows,
            "runs_chased": results3.rows
          })
        })
      })
      })
}
//venues/:venue_id/pie_chart
const getVenuePieChartInformation = function (request, response) {
    const venue_id = parseInt(request.params.venue_id)
    const query = {
        text: `SELECT COALESCE(SUM(CASE WHEN win_type = 'runs' THEN 1 ELSE 0 END), 0) AS first_won,
        COALESCE(SUM(CASE WHEN win_type = 'wickets' THEN 1 ELSE 0 END), 0) AS second_won,
        COALESCE(SUM(CASE WHEN win_type NOT IN ('runs', 'wickets') THEN 1 ELSE 0 END), 0) AS draw,
        COALESCE (count(*), 0) AS total
        FROM match 
        WHERE venue_id = $1;`,
        values: [venue_id],
    }
    pool.query(query,  (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
    })
}
//venues/:venue_id/graph
const getVenueGraphInformation = function (request, response) {
    const venue_id = parseInt(request.params.venue_id)
    const query = {
        text: `SELECT season_year, AVG(run)
        FROM
        (SELECT season_year, match_id
        FROM match 
        WHERE venue_id = 11 AND season_year IN (2011, 2013, 2015, 2017)) AS t1
        LEFT JOIN
        (SELECT match_id, SUM(runs_scored + extra_runs) AS run
        FROM ball_by_ball
        WHERE innings_no = 1
        GROUP BY match_id, innings_no) t2
        ON t1.match_id = t2.match_id
        GROUP BY season_year;`,
        values: [venue_id],
    }
    pool.query(query,  (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
    })
}

const createVenue = (request, response) => {
    const { venue_name, country_name, city_name, capacity } = request.body
  
    pool.query('INSERT INTO venues(venue_name, city_name, country_name, capacity) VALUES ($1, $2, $3, $4)',
     [parseString(venue_name), parseString(city_name), parseString(country_name), parseInt(capacity)], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`Venue Added`)
    })
  }
module.exports = {
    getVenue,
    getVenueInformation,
    getVenuePieChartInformation,
    getVenueGraphInformation,
    createVenue
}

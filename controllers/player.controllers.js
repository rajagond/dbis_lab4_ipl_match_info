const pool = require('../database')

const getPlayer = function (request, response) {
    const id = parseInt(request.params.player_id)
    pool.query('SELECT player_name, country_name, batting_hand, bowling_skill FROM player WHERE player_id = $1;', [id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
    })
}
//players/:player_id/batdetails
const getPlayerDetails = function (request, response) {
    const player_id = parseInt(request.params.player_id)
    const query1 = {
      text: `SELECT COUNT(DISTINCT match_id) AS num_matches
      FROM ball_by_ball
      WHERE striker = $1 OR non_striker = $1;`,
      values: [player_id],
    }
    const query2 = {
        text: `SELECT SUM(runs_scored) AS total_score, SUM(CASE WHEN runs_scored = 4 THEN 4 ELSE 0 END) AS fours,
        SUM(CASE WHEN runs_scored = 6 THEN 6 ELSE 0 END) AS sixes, 
        SUM(CASE WHEN out_type IS NOT NULL THEN 1 ELSE 0 END) AS num_out
        COUNT(striker) AS balls_faced
        FROM ball_by_ball
        WHERE striker = $1
        GROUP BY striker;`,
        values: [player_id],
    }
    const query3 = {
    text: `SELECT max(total_score) AS high_score, SUM(CASE WHEN total_score < 100 AND total_score >=50 THEN 1 ELSE 0 END) AS num_fifties
    FROM
    (SELECT match_id, innings_no, SUM(runs_scored) AS total_score
    FROM ball_by_ball
    WHERE striker = $1
    GROUP BY match_id, innings_no, striker) AS abc;`,
    values: [player_id],
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
            "num_matches": results1.rows,
            "other_details": results2.rows,
            "high_fifties": results3.rows
          })
        })
      })
      })
}
//players/:player_id/batgraphinfo
const getPlayerInformationInGraph = function (request, response) {
    const player_id = parseInt(request.params.player_id)
    const query = {
      text: `SELECT match_id, SUM(runs_scored) AS match_score
      FROM ball_by_ball
      WHERE striker = $1
      GROUP BY match_id, innings_no, striker
      ORDER BY match_id;`,
      values: [player_id],
    }
    pool.query(query, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


//players/:player_id/bowldetails
const getBowlingDetails = function (request, response) {
    const player_id = parseInt(request.params.player_id)
    const query1 = {
      text: `SELECT COUNT(DISTINCT match_id) AS num_matches
      FROM ball_by_ball
      WHERE bowler = $1;`,
      values: [player_id],
    }
    const query2 = {
        text: `SELECT SUM(runs_scored) AS runs_conceded,
        SUM(CASE WHEN out_type IS NOT NULL AND out_type <> 'retired_hurt' AND out_type <> 'run_out' THEN 1 ELSE 0 END) AS wickets,
        COUNT(bowler) AS balls_bowled
        FROM ball_by_ball
        WHERE bowler = $1
        GROUP BY bowler;`,
        values: [player_id],
    }
    const query3 = {
    text: `SELECT SUM(CASE WHEN wickets>=5 THEN 1 ELSE 0 END) AS num_fives, SUM(match_over) AS over_bowled
    FROM
    (SELECT match_id, innings_no, SUM(CASE WHEN out_type IS NOT NULL AND out_type <> 'retired_hurt' AND out_type <> 'run_out' THEN 1 ELSE 0 END) AS wickets, COUNT(DISTINCT over_id) AS match_over
    FROM ball_by_ball
    WHERE bowler = $1
    GROUP BY match_id, innings_no, bowler) AS abc;`,
    values: [player_id],
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
            "num_matches": results1.rows,
            "other_details": results2.rows,
            "fives_overs_bowled": results3.rows
          })
        })
      })
      })
}
//players/:player_id/bowlgraphinfo
const getBowlingInformationInGraph = function (request, response) {
    const player_id = parseInt(request.params.player_id)
    const query = {
      text: `SELECT match_id, SUM(CASE WHEN out_type IS NOT NULL AND out_type <> 'retired_hurt' AND out_type <> 'run_out' THEN 1 ELSE 0 END) AS wickets, SUM(runs_scored) AS runs_conceded
      FROM ball_by_ball
      WHERE bowler = $1
      GROUP BY match_id, innings_no, bowler
      ORDER BY match_id;`,
      values: [player_id],
    }
    pool.query(query, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

module.exports = {
    getPlayer,
    getPlayerDetails,
    getPlayerInformationInGraph,
    getBowlingDetails,
    getBowlingInformationInGraph
}
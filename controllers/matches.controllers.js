const pool = require('../database')

const b1_query = `select match_id, season_year, e.team_name as team1, f.team_name as team2, g.team_name as winner, win_type, win_margin, venue_name, city_name from match
 left join team as e on team1= e.team_id left join team as f on team2 = f.team_id left join team as g on match_winner = g.team_id left join venue on match.venue_id = venue.venue_id 
 order by season_year;`


const getMatches = function (request, response) {
    //const skip = parseInt(request.query.skip);
    //const limit = parseInt(request.query.limit);
    //console.log(skip, limit)
    //pool.query(b1_query, [skip*limit, limit], (error, results) => {
    pool.query(b1_query,  (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
const getETByMatch_Id = function (request, response) { //= (request, response) =>
    const id = parseInt(request.params.match_id)
    const inn = parseInt(request.params.inn)
    pool.query('select sum(extra_runs) as extras, sum(runs_scored + extra_runs) as totals from ball_by_ball where match_id = $1 and innings_no=$2;',
     [id, inn], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getbatsmanByMatch_Id = function (request, response) { //= (request, response) =>
  const id = parseInt(request.params.match_id)
  const inn = parseInt(request.params.inn)
  const query = {
    text: `SELECT player_id, player_name, runs, fours, sixes, ball_faced 
    FROM player
    inner join (
      SELECT striker, sum(runs_scored)  AS runs, SUM(CASE WHEN runs_scored=4 THEN 1 ELSE 0 END) AS fours,
      SUM(CASE WHEN runs_scored=6 THEN 1 ELSE 0 END) AS sixes, count(*) ball_faced
      FROM ball_by_ball
      WHERE match_id = $1 and innings_no = $2
      GROUP BY striker) AS matches
    ON player.player_id = matches.striker
    ORDER BY runs DESC;`,
    values: [id, inn],
  }
  pool.query(query, (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).json(results.rows)
  })
}
const getbowlerByMatch_Id = function (request, response) { //= (request, response) =>
  const id = parseInt(request.params.match_id)
  const inn = parseInt(request.params.inn)
  const query = {
    text: `SELECT player_id, player_name, balls_bowled, runs_given, wickets
    FROM player
    inner join (
      SELECT bowler, sum(runs_scored)  AS runs_given,
      SUM(CASE WHEN out_type IS NOT NULL AND out_type NOT IN ('run out','retired hurt') THEN 1 ELSE 0 END) AS wickets, count(*) balls_bowled
      FROM ball_by_ball
      WHERE match_id = $1 and innings_no = $2
      GROUP BY bowler) AS matches
    ON player.player_id = matches.bowler
    ORDER BY wickets DESC;`,
    values: [id, inn],
  }
  pool.query(query, (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).json(results.rows)
  })
}

const getInningsInfo = (request, response) => {
  const id = parseInt(request.params.match_id)
  const inn = parseInt(request.params.inn)
  const query1 = {
    text: `SELECT player_id, player_name, runs, fours, sixes, ball_faced 
    FROM player
    inner join (
      SELECT striker, sum(runs_scored)  AS runs, SUM(CASE WHEN runs_scored=4 THEN 1 ELSE 0 END) AS fours,
      SUM(CASE WHEN runs_scored=6 THEN 1 ELSE 0 END) AS sixes, count(*) ball_faced
      FROM ball_by_ball
      WHERE match_id = $1 and innings_no = $2
      GROUP BY striker) AS matches
    ON player.player_id = matches.striker
    ORDER BY runs DESC;`,
    values: [id, inn],
  }
  const query2 = {
    text: 'select sum(extra_runs) as extras, sum(runs_scored + extra_runs) as totals from ball_by_ball where match_id = $1 and innings_no=$2;',
    values: [id, inn],
  }
  const query3 = {
    text: `SELECT player_id, player_name, balls_bowled, runs_given, wickets
    FROM player
    inner join (
      SELECT bowler, sum(runs_scored)  AS runs_given,
      SUM(CASE WHEN out_type IS NOT NULL AND out_type NOT IN ('run out','retired hurt') THEN 1 ELSE 0 END) AS wickets, count(*) balls_bowled
      FROM ball_by_ball
      WHERE match_id = $1 and innings_no = $2
      GROUP BY bowler) AS matches
    ON player.player_id = matches.bowler
    ORDER BY wickets DESC;`,
    values: [id, inn],
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
        "batsman": results1.rows,
        "extra": results2.rows,
        "bowler": results3.rows
      })
    })
  })
  })
}
const getMatchInfo = (request, response) => {
  const id = parseInt(request.params.match_id)
  const query1 = {
    text: `SELECT match.match_id, season_year, t1.team_name as team1, t2.team_name as team2, t3.team_name as toss, toss_name, venue_name, city_name
    FROM (SELECT * FROM match WHERE match_id = $1) AS match
    INNER JOIN team as t1 ON t1.team_id = match.team1
    INNER JOIN team as t2 ON t2.team_id = match.team2
    INNER JOIN team as t3 ON t3.team_id = match.toss_winner
    INNER JOIN venue ON venue.venue_id = match.venue_id;`,
    values: [id],
  }
  const query2 = {
    text: `SELECT umpire_name, role_desc FROM umpire
    INNER JOIN (SELECT * FROM umpire_match WHERE match_id = $1) AS ump ON ump.umpire_id = umpire.umpire_id;`,
    values: [id],
  }
  const query3 = {
    text: `SELECT pm1.player_name AS team1_player, pm2.player_name AS team2_player
    FROM 
    ( SELECT *, ROW_NUMBER() OVER () row_num1 FROM (SELECT team1 FROM match WHERE match_id = $1) AS match, (SELECT player_name, team_id FROM player
    INNER JOIN player_match ON player.player_id = player_match.player_id WHERE match_id=$1) AS p1 WHERE p1.team_id  = match.team1) AS pm1,
    ( SELECT *, ROW_NUMBER() OVER () row_num2 FROM (SELECT team2 FROM match WHERE match_id = $1) AS match, (SELECT player_name, team_id FROM player
    INNER JOIN player_match ON player.player_id = player_match.player_id WHERE match_id=$1) AS p2 WHERE p2.team_id  = match.team2) AS pm2
    WHERE row_num1= row_num2;`,
    values: [id],
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
        "basic_details": results1.rows,
        "umpire": results2.rows,
        "playing_eleven": results3.rows
      })
    })
  })
  })
}


const getCumulativeRunByMatch_Id = function (request, response) { //= (request, response) =>
  const id = parseInt(request.params.match_id)
  const query = {
    text: `SELECT inn_stats1.over_id AS i1, inn_stats1.wicket_over AS i1w, SUM(inn_stats1.run_over) OVER ( ORDER BY inn_stats1.over_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS inn1_cum_run,
    inn_stats2.over_id AS i2, inn_stats2.wicket_over AS i2w, SUM(inn_stats2.run_over) OVER ( ORDER BY inn_stats2.over_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS inn2_cum_run
   FROM
   (SELECT over_id, SUM(runs_scored + extra_runs) AS run_over, SUM(CASE WHEN out_type IS NOT NULL THEN 1 ELSE 0 END) AS wicket_over
   FROM ball_by_ball
   WHERE match_id = $1 AND innings_no =1
   GROUP BY over_id) AS inn_stats1
   FULL OUTER JOIN
   (SELECT over_id, SUM(runs_scored + extra_runs) AS run_over, SUM(CASE WHEN out_type IS NOT NULL THEN 1 ELSE 0 END) AS wicket_over
   FROM ball_by_ball
   WHERE match_id = $1 AND innings_no =2
   GROUP BY over_id) AS inn_stats2
   ON inn_stats1.over_id = inn_stats2.over_id;`,
    values: [id],
  }
  pool.query(query, (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).json(results.rows)
  })
}
  
  module.exports = {
    getMatches,
    getETByMatch_Id,
    getbatsmanByMatch_Id,
    getbowlerByMatch_Id,
    getInningsInfo,
    getMatchInfo,
    getCumulativeRunByMatch_Id
  }

const pool = require('../database')

const b1_query = `select match_id, season_year, e.team_name as team1, f.team_name as team2, g.team_name as winner, win_type, win_margin, venue_name, city_name from match
 left join team as e on team1= e.team_id left join team as f on team2 = f.team_id left join team as g on match_winner = g.team_id left join venue on match.venue_id = venue.venue_id 
 order by season_year;`


const getMatches = function (req, res, next) {
    //const skip = parseInt(req.query.skip);
    //const limit = parseInt(req.query.limit);
    //console.log(skip, limit)
    //pool.query(b1_query, [skip*limit, limit], (error, results) => {
    pool.query(b1_query,  (error, results) => {
      if (error) {
        next(error)
      }
      res.status(200).json(results.rows)
    })
  }
  
const getETByMatch_Id = function (req, res, next) { //= (req, res, next) =>
    const id = parseInt(req.params.match_id)
    const inn = parseInt(req.params.inn)
    pool.query('select sum(extra_runs) as extras, sum(runs_scored + extra_runs) as totals from ball_by_ball where match_id = $1 and innings_no=$2;',
     [id, inn], (error, results) => {
        if (error) {
            next(error)
        }
        res.status(200).json(results.rows)
    })
}

const getbatsmanByMatch_Id = function (req, res, next) { //= (req, res, next) =>
  const id = parseInt(req.params.match_id)
  const inn = parseInt(req.params.inn)
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
          next(error)
      }
      res.status(200).json(results.rows)
  })
}
const getbowlerByMatch_Id = function (req, res, next) { //= (req, res, next) =>
  const id = parseInt(req.params.match_id)
  const inn = parseInt(req.params.inn)
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
          next(error)
      }
      res.status(200).json(results.rows)
  })
}

const getInningsInfo = (req, res, next) => {
  const id = parseInt(req.params.match_id)
  const inn = parseInt(req.params.inn)
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
      next(error)
    }
    pool.query(query2, (error, results2) => {
      if (error) {
        next(error)
      }
      pool.query(query3, (error, results3) => {
        if (error) {
          next(error)
        }
      res.status(200).json({
        "batsman": results1.rows,
        "extra": results2.rows,
        "bowler": results3.rows
      })
    })
  })
  })
}
const getMatchInfo = (req, res, next) => {
  const id = parseInt(req.params.match_id)
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
      next(error)
    }
    pool.query(query2, (error, results2) => {
      if (error) {
        next(error)
      }
      pool.query(query3, (error, results3) => {
        if (error) {
          next(error)
        }
      res.status(200).json({
        "basic_details": results1.rows,
        "umpire": results2.rows,
        "playing_eleven": results3.rows
      })
    })
  })
  })
}

/*
const getCumulativeRunByMatch_Id = function (req, res, next) { //= (req, res, next) =>
  const id = parseInt(req.params.match_id)
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
          next(error)
      }
      res.status(200).json(results.rows)
  })
}*/

//
const getCumulativeRunByMatch_Id = function (req, res, next) { //= (req, res, next) =>
  const id = parseInt(req.params.match_id)
  const inn = parseInt(req.params.inn)
  const query = {
    text: `SELECT over_id, ball_id, wicket_over, SUM(runs_scored + extra_runs) OVER ( ORDER BY inn_stats1.over_id ASC, ball_id ASC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cum_run
    FROM
    (SELECT over_id,ball_id,runs_scored, extra_runs, (CASE WHEN out_type IS NOT NULL THEN 1 ELSE 0 END) AS wicket_over
    FROM ball_by_ball
    WHERE match_id = $1 AND innings_no = $2) AS inn_stats1
    ORDER BY over_id, ball_id;`,
    values: [id, inn],
  }
  pool.query(query, (error, results) => {
      if (error) {
          next(error)
      }
      res.status(200).json(results.rows)
  })
}



const getMatchBasicByMatch_Id = function (req, res, next) { //= (req, res, next) =>
  const id = parseInt(req.params.match_id)
  const query = {
    text: `SELECT match.match_id, season_year, inn1_total, nn1_wickets, inn1_over, inn2_total, inn2_wickets, inn2_over
    FROM (SELECT match_id, season_year FROM match WHERE match_id = $1) AS match
    INNER JOIN (SELECT match_id, SUM(runs_scored + extra_runs) AS inn1_total, SUM(CASE WHEN out_type IS NOT NULL THEN 1 ELSE 0 END) AS inn1_wickets,
        COUNT(DISTINCT over_id) AS inn1_over
        FROM ball_by_ball WHERE match_id = $1 AND innings_no = 1 GROUP BY match_id) AS BI
    ON match.match_id = BI.match_id
    INNER JOIN (SELECT match_id, SUM(runs_scored + extra_runs) AS inn2_total, SUM(CASE WHEN out_type IS NOT NULL THEN 1 ELSE 0 END) AS inn2_wickets,
        COUNT(DISTINCT over_id) AS inn2_over
        FROM ball_by_ball WHERE match_id = $1 AND innings_no = 2 GROUP BY match_id) AS DI
    ON match.match_id = DI.match_id;`,
    values: [id],
  }
  pool.query(query, (error, results) => {
      if (error) {
          next(error)
      }
      res.status(200).json(results.rows)
  })
}

const getMatchAdvancedByMatch_Id = function (req, res, next) { //= (req, res, next) =>
  const id = parseInt(req.params.match_id)
  const inn = parseInt(req.params.inn)
  const query = {
    text: `SELECT batsman, runs, ball_faced, bowler, runs_given, wickets, over_bowled
    FROM
    (
    SELECT *,
    ROW_NUMBER() over (PARTITION BY match_id, innings_no ORDER BY runs DESC, ball_faced ASC, batsman ASC) AS rank_batsman
    FROM(
    SELECT match_id, innings_no, player_name AS batsman, runs, ball_faced
    FROM (SELECT match_id, innings_no, striker, SUM (runs_scored) AS runs, COUNT(striker) AS ball_faced
      FROM ball_by_ball 
      WHERE match_id = $1 AND innings_no = $2
      GROUP BY match_id, innings_no, striker) AS bats
    LEFT JOIN player ON player_id = striker) AS bat_rank) AS abc
    FULL OUTER JOIN
    ( 
    SELECT *,
    ROW_NUMBER() over (PARTITION BY match_id, innings_no ORDER BY wickets DESC, runs_given ASC, bowler ASC) AS rank_bowler
    FROM(
    SELECT match_id, innings_no, player_name AS bowler, runs_given, wickets, over_bowled
    FROM (SELECT match_id, innings_no, bowler, SUM (runs_scored) AS runs_given, COUNT(DISTINCT over_id) AS over_bowled,
      SUM (CASE WHEN out_type IS NOT NULL AND out_type <> 'run out' AND out_type <> 'retired hurt' THEN 1 ELSE 0 END) AS wickets
      FROM ball_by_ball 
      WHERE match_id = $1 AND innings_no = $2
      GROUP BY match_id, innings_no, bowler) AS bowl
    LEFT JOIN player ON player_id = bowler) AS bow_rank WHERE wickets>0) AS def
    ON (abc.match_id, abc.innings_no, abc.rank_batsman) = (def.match_id, def.innings_no, def.rank_bowler)
    LIMIT 3;`,
    values: [id, inn],
  }
  pool.query(query, (error, results) => {
      if (error) {
          next(error)
      }
      res.status(200).json(results.rows)
  })
}

const getNumRunsInningsWise = function (req, res, next) { //= (req, res, next) =>
  const id = parseInt(req.params.match_id)
  const inn = parseInt(req.params.inn)
  const query = {
    text: `SELECT match_id, innings_no, SUM (runs_scored + extra_runs) AS runs, SUM(extra_runs) AS extras, SUM(CASE WHEN runs_scored = 1 THEN 1 ELSE 0 END) AS ones,
    SUM(CASE WHEN runs_scored = 2 THEN 2 ELSE 0 END) AS twos, SUM(CASE WHEN runs_scored = 3 THEN 3 ELSE 0 END) AS threes, 
    SUM(CASE WHEN runs_scored = 4 THEN 4 ELSE 0 END) AS fours, SUM(CASE WHEN runs_scored = 6 THEN 6 ELSE 0 END) AS sixs
    FROM ball_by_ball
    WHERE match_id = $1 AND innings_no = $2
    GROUP BY match_id, innings_no`,
    values: [id, inn],
  }
  pool.query(query, (error, results) => {
      if (error) {
          next(error)
      }
      res.status(200).json(results.rows)
  })
}













// matches/:match_id/team
const getInningTeamByMatch_Id = function (req, res, next) { //= (req, res, next) =>
  const id = parseInt(req.params.match_id)
  const query = {
    text: `SELECT match_id, inn1, e.team_name AS inn1_team, inn2, f.team_name AS inn2_team
    FROM
    (select match_id, (CASE WHEN ((team1, toss_name) = (toss_winner, 'bat')) OR (team1 <> toss_winner AND toss_name = 'field') THEN team1 ELSE team2 END ) AS inn1, (CASE WHEN ((team1, toss_name) = (toss_winner, 'field')) OR (team1 <> toss_winner AND toss_name = 'bat') THEN team1 ELSE team2 END ) AS inn2
    FROM match WHERE match_id=$1) AS mat
    INNER JOIN team AS e
    ON e.team_id = inn1
    INNER JOIN team AS f
    ON f.team_id = inn2;`,
    values: [id],
  }
  pool.query(query, (error, results) => {
      if (error) {
          next(error)
      }
      res.status(200).json(results.rows)
  })
}





  
  module.exports = {
    getMatches,
    getETByMatch_Id,
    getbatsmanByMatch_Id,
    getbowlerByMatch_Id,
    getInningsInfo,
    getMatchInfo,
    getCumulativeRunByMatch_Id,
    getMatchBasicByMatch_Id,
    getMatchAdvancedByMatch_Id,
    getNumRunsInningsWise,
    getInningTeamByMatch_Id
  }

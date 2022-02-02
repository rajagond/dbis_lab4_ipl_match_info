const pool = require('../database')

//pointstable/:year
const getPointsTable = function (request, response) {
    const year = parseInt(request.params.year);
    const query = {
        text: `SELECT *, abc.won*2 AS pts
        FROM
        (SELECT team_id, team_name, SUM(CASE WHEN team_id = team1 OR team_id = team2 THEN 1 ELSE 0 END) AS mat,
            SUM(CASE WHEN (team_id = team1 OR team_id = team2) AND team_id = match_winner THEN 1 ELSE 0 END) AS won,
            SUM(CASE WHEN (team_id = team1 OR team_id = team2) AND team_id <> match_winner THEN 1 ELSE 0 END) AS loss,
            SUM(CASE WHEN (team_id = team1 OR team_id = team2) AND win_type NOT IN ('runs', 'wickets') THEN 1 ELSE 0 END) AS tied,
            SUM(CASE 
                WHEN (team_id = team1 OR team_id = team2) AND ((toss_winner = team_id AND toss_name = 'bat') OR (toss_winner <> team_id AND toss_name = 'field')) THEN rr1
                WHEN (team_id = team1 OR team_id = team2) AND ((toss_winner = team_id AND toss_name = 'field') OR (toss_winner <> team_id AND toss_name = 'bat')) THEN rr2
                ELSE 0.0 END) AS nrr
        FROM team,
        (SELECT match.match_id, team1, team2, toss_winner, toss_name, match_winner, win_type, rr1, rr2 
        FROM match
        INNER JOIN
        (SELECT i1.match_id, ((total1*1.0/total_over1) - (total2*1.0/total_over2)) AS rr1, ((total2*1.0/total_over2) - (total1*1.0/total_over1)) AS rr2
        FROM (SELECT match_id, innings_no, SUM(runs_scored + extra_runs) AS total1, COUNT(DISTINCT over_id) AS total_over1 FROM ball_by_ball 
        WHERE innings_no = 1
        GROUP BY match_id, innings_no) AS i1
        INNER JOIN
        (SELECT match_id, innings_no, SUM(runs_scored + extra_runs) AS total2, COUNT(DISTINCT over_id) AS total_over2 FROM ball_by_ball 
        WHERE innings_no = 2
        GROUP BY match_id, innings_no) AS i2
        ON i1.match_id = i2.match_id) AS new
        ON match.match_id = new.match_id
        WHERE season_year = $1) as match_sy
        WHERE team_id = team1 OR team_id = team2
        GROUP BY team_id) AS abc
        ORDER BY pts DESC, nrr DESC, team_name;`,
        values: [year],
    }
    pool.query(query,  (error, results) => {
        if (error) {
          //throw error
          response.status(201)
        }
        else response.status(200).json(results.rows);
    })
}

module.exports = {getPointsTable}
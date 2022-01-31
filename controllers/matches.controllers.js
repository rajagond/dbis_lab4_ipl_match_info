const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.USER_NAME,
    //user: 'postgres',
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.USER_PSWD,
    //password: 'postgres',
    port: process.env.PORT,
});

pool.on('error', (err, client) => {
    console.error('Error:', err);
});

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
  
const getMatchById = function (request, response) { //= (request, response) =>
    const id = parseInt(request.params.match_id)
    const inn = parseInt(request.params.inn)

    if (inn == 3){
        pool.query('SELECT * FROM match WHERE match_id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    }

    pool.query('SELECT * FROM match WHERE match_id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
  

  
  module.exports = {
    getMatches,
    getMatchById,
  }

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

module.exports = {
    getPlayer
}
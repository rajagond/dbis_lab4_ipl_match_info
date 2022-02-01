const pool = require('../database')

const getVenue = function (request, response) {
    pool.query('SELECT venue_id, venue_name, city_name FROM venue;',  (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
    })
}

module.exports = {
    getVenue
}
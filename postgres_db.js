const { Pool } = require('pg');
require('dotenv').config();
const Cursor = require('pg-cursor')

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


const getMatches = (request, response) => {
    const skip = request.query.skip;
    const limit = parseInt(request.query.limit);
    console.log(skip, limit)
    pool.query('SELECT * FROM match LIMIT $1', [limit], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
const getMatchById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM match WHERE match_id = $1', [id], (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).json(results.rows)
    })
}
  
  const createUser = (request, response) => {
    const { name, email } = request.body
  
    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${result.insertId}`)
    })
  }
  
  const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body
  
    pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
  }
  
  const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }
  
  module.exports = {
    getMatches,
    getMatchById,
    createUser,
    updateUser,
    deleteUser,
  }
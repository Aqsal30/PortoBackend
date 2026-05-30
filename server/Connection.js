const pgp = require('pg-promise')()

const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'resto',
  user: 'postgres',
  password: '301101'
})

module.exports = db
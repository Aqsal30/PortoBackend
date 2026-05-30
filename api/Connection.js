const pgp = require('pg-promise')()

const db = pgp({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1,              // IMPORTANT for Vercel
  idleTimeoutMillis: 30000
})

module.exports = db

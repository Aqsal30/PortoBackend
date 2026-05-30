const pgp = require('pg-promise')()

const db = pgp(process.env.NEXT_PUBLIC_SUPABASE_URL)

module.exports = db
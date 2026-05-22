const { Pool, types } = require('pg');
require('dotenv').config();

// Force DATE types (OID 1082) to be returned as raw strings (YYYY-MM-DD)
// This prevents node-postgres from converting them to UTC Date objects
// which cause timezone-shifting bugs on the frontend.
types.setTypeParser(1082, (val) => val);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};

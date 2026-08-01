// config/db.js
// Sets up a single shared PostgreSQL connection pool for the whole app.
// All models/controllers import { query } from here instead of creating
// their own client connections.

const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10, // maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("connect", () => {
  console.log("PostgreSQL pool: new client connected");
});

pool.on("error", (err) => {
  // Errors on idle clients in the pool should not crash the whole app
  console.error("Unexpected error on idle PostgreSQL client", err);
  process.exit(1);
});

/**
 * Run a SQL query using the shared pool.
 * @param {string} text - SQL query text with $1, $2... placeholders
 * @param {Array} params - values for the placeholders
 * @returns {Promise<import('pg').QueryResult>}
 */
const query = (text, params) => pool.query(text, params);

/**
 * Quick connectivity check used at server startup.
 */
const testConnection = async () => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    console.log(`PostgreSQL connected successfully at ${result.rows[0].now}`);
    return true;
  } catch (err) {
    console.error("PostgreSQL connection failed:", err.message);
    return false;
  }
};

module.exports = {
  pool,
  query,
  testConnection,
};

// config/db.js

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("connect", () => {
  console.log("PostgreSQL pool: new client connected");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

const query = (text, params) => pool.query(text, params);

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
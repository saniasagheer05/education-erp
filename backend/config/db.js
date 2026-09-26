// config/db.js
// Supports both DATABASE_URL (production / hosted) and individual DB_* vars (local dev).

const { Pool } = require("pg");
require("dotenv").config();

let poolConfig;

if (process.env.DATABASE_URL) {
  // Production: use connection string with SSL
  poolConfig = { connectionString: process.env.DATABASE_URL, ssl: process.env.DB_SSL==="false" ? false : { rejectUnauthorized: false } };
} else {
  // Local dev: use individual env vars, no SSL
  poolConfig = {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "svce_erp",
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432", 10),
  };
}

// Common pool settings
poolConfig.max = 10;
poolConfig.idleTimeoutMillis = 30000;
poolConfig.connectionTimeoutMillis = 5000;

const pool = new Pool(poolConfig);

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
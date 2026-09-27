// config/db.js
// Supports both DATABASE_URL (production / hosted on Neon / Render) and individual DB_* vars (local dev).

const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config();

let poolConfig;

if (process.env.DATABASE_URL) {
  // Production / Hosted (Neon, Render, Supabase)
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DATABASE_SSL === "false" || process.env.DB_SSL === "false"
        ? false
        : { rejectUnauthorized: false },
  };
} else {
  // Local dev
  poolConfig = {
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "svce_erp",
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    ssl:
      process.env.DATABASE_SSL === "true" || process.env.DB_SSL === "true"
        ? { rejectUnauthorized: false }
        : false,
  };
}

// Pool settings tuned for serverless and hosted PostgreSQL
poolConfig.max = parseInt(process.env.DB_POOL_MAX || "10", 10);
poolConfig.idleTimeoutMillis = 30000;
poolConfig.connectionTimeoutMillis = 10000;

const pool = new Pool(poolConfig);

pool.on("connect", () => {
  console.log("PostgreSQL pool: client connected");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err.message);
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
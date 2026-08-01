// models/adminModel.js
// All raw SQL queries related to the admins table live here.

const { query } = require("../config/db");

/**
 * Find an admin by email, including password_hash (used for login).
 */
const findByEmail = async (email) => {
  const result = await query(
    `SELECT id, name, email, password_hash, role
     FROM admins WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
};

/**
 * Find an admin by primary key id (safe fields only).
 */
const findById = async (id) => {
  const result = await query(
    `SELECT id, name, email, role, created_at FROM admins WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Create a new admin account. Expects password to already be hashed.
 * (Not exposed via a public route by default — intended for seeding /
 * internal tooling. Kept here for completeness.)
 */
const create = async ({ name, email, passwordHash, role = "admin" }) => {
  const result = await query(
    `INSERT INTO admins (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, passwordHash, role]
  );
  return result.rows[0];
};

module.exports = {
  findByEmail,
  findById,
  create,
};

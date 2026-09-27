// utils/generateToken.js
// Wraps jsonwebtoken to produce a signed JWT carrying the user's id and role.

const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/jwt");

/**
 * Generate a signed JWT for a student or admin.
 * @param {Object} payload - e.g. { id, role, libraryId } or { id, role, email }
 * @returns {string} signed JWT
 */
const generateToken = (payload) => {
  const secret = JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }

  return jwt.sign(payload, secret, {
    expiresIn: JWT_EXPIRES_IN || "7d",
  });
};

module.exports = generateToken;

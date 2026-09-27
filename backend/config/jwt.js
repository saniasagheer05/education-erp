// config/jwt.js
// Centralized JWT configuration ensuring the exact same secret and settings
// are shared across token generation and authentication middleware.

const path = require("path");

// Ensure .env is loaded regardless of process working directory
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config();

const getJwtSecret = () => {
  return process.env.JWT_SECRET;
};

const getJwtExpiresIn = () => {
  return process.env.JWT_EXPIRES_IN || "7d";
};

module.exports = {
  get JWT_SECRET() {
    return getJwtSecret();
  },
  get JWT_EXPIRES_IN() {
    return getJwtExpiresIn();
  },
  getJwtSecret,
  getJwtExpiresIn,
};

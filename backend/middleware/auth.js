// middleware/auth.js
// Verifies the JWT sent in the Authorization header and attaches the
// decoded payload to req.user. Also exposes role-guard middlewares.

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwt");

/**
 * Verifies "Authorization: Bearer <token>" and attaches decoded payload
 * (id, role, and either libraryId or email) to req.user.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided. Access denied.",
    });
  }

  // Support "Bearer <token>" case-insensitively
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({
      success: false,
      message: "No token provided. Access denied.",
    });
  }

  let token = match[1].trim();

  // Strip surrounding quotes if present
  if (
    (token.startsWith('"') && token.endsWith('"')) ||
    (token.startsWith("'") && token.endsWith("'"))
  ) {
    token = token.slice(1, -1).trim();
  }

  const secret = JWT_SECRET;
  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "Server authentication configuration error: JWT_SECRET missing.",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid token. Access denied.",
    });
  }
};

/**
 * Restricts access to authenticated admins only.
 * Allows both 'admin' and 'super_admin' roles.
 * Must be used AFTER verifyToken.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "super_admin")) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

/**
 * Restricts access to authenticated students only.
 * Must be used AFTER verifyToken.
 */
const requireStudent = (req, res, next) => {
  if (!req.user || req.user.role !== "student") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Student privileges required.",
    });
  }
  next();
};

module.exports = {
  verifyToken,
  requireAdmin,
  requireStudent,
};

// middleware/auth.js
// Verifies the JWT sent in the Authorization header and attaches the
// decoded payload to req.user. Also exposes role-guard middlewares.

const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Verifies "Authorization: Bearer <token>" and attaches decoded payload
 * (id, role, and either libraryId or email) to req.user.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided. Access denied.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
 * Must be used AFTER verifyToken.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
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

// middleware/errorHandler.js
// Centralized Express error-handling middleware. Any error passed via
// next(err) (including ones caught by asyncHandler) ends up here.

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // PostgreSQL unique_violation
  if (err.code === "23505") {
    return res.status(409).json({
      success: false,
      message: "A record with this value already exists.",
      detail: err.detail,
    });
  }

  // PostgreSQL foreign_key_violation
  if (err.code === "23503") {
    return res.status(400).json({
      success: false,
      message: "Referenced record does not exist.",
      detail: err.detail,
    });
  }

  // PostgreSQL check_violation
  if (err.code === "23514") {
    return res.status(400).json({
      success: false,
      message: "Invalid value provided for one or more fields.",
      detail: err.detail,
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

/**
 * 404 handler for routes that don't match any defined endpoint.
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { errorHandler, notFound };

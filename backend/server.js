// server.js
// Entry point for the SVCE ERP backend API.

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------
app.use(
  cors({
    origin: process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN?.split(","),
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logger (useful during development)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// ---------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SVCE ERP API is running",
    college: "Sri Venkateshwara College of Engineering",
  });
});

app.get("/api/health", async (req, res) => {
  const dbConnected = await testConnection();
  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);

// ---------------------------------------------------------------------
// 404 + error handling (must be registered last)
// ---------------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// ---------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------
const startServer = async () => {
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error(
      "Failed to connect to PostgreSQL. Check your .env DB_* values and that PostgreSQL is running."
    );
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`SVCE ERP backend running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

startServer();

module.exports = app;

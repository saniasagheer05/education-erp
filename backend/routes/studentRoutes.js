// routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const {
  getProfile,
  getAttendance,
  getFees,
  getTimetable,
} = require("../controllers/studentController");
const { verifyToken, requireStudent } = require("../middleware/auth");

// All routes below require a valid student JWT
router.use(verifyToken, requireStudent);

// @route  GET /api/student/profile
router.get("/profile", getProfile);

// @route  GET /api/student/attendance
router.get("/attendance", getAttendance);

// @route  GET /api/student/fees
router.get("/fees", getFees);

// @route  GET /api/student/timetable
router.get("/timetable", getTimetable);

module.exports = router;

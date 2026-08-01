// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const { studentLogin, adminLogin } = require("../controllers/authController");

// @route  POST /api/auth/student/login
router.post("/student/login", studentLogin);

// @route  POST /api/auth/admin/login
router.post("/admin/login", adminLogin);

module.exports = router;

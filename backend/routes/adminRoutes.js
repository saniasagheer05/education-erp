// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const {
  addStudent,
  updateStudent,
  listStudents,
  getStudentById,
  addAttendance,
  addBulkAttendance,
  getLowAttendance,
  updateAttendance,
  addFees,
  updateFees,
  addTimetable,
  updateTimetable,
} = require("../controllers/adminController");
const {
  getStats, getDefaulters, getStudentFeesAdmin, getStudentAttendanceAdmin, getStudentTimetableAdmin,
} = require("../controllers/adminReportController");
const {
  createAnnouncement, listAnnouncementsAdmin, deleteAnnouncement,
} = require("../controllers/announcementController");
const { changePassword } = require("../controllers/adminAccountController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

// All routes below require a valid admin JWT
router.use(verifyToken, requireAdmin);

// ---------- Students ----------
// @route  POST /api/admin/students
router.post("/students", addStudent);

// @route  GET /api/admin/students  (list / filter — supporting endpoint)
router.get("/students", listStudents);

// @route  GET /api/admin/students/:id  (supporting endpoint)
router.get("/students/:id", getStudentById);

// @route  PUT /api/admin/students/:id
router.put("/students/:id", updateStudent);

// ---------- Attendance ----------
// @route  POST /api/admin/attendance/bulk
router.post("/attendance/bulk", addBulkAttendance);

// @route  GET /api/admin/attendance/low
router.get("/attendance/low", getLowAttendance);

// @route  POST /api/admin/attendance
router.post("/attendance", addAttendance);

// @route  PUT /api/admin/attendance/:id
router.put("/attendance/:id", updateAttendance);

// ---------- Fees ----------
// @route  POST /api/admin/fees
router.post("/fees", addFees);

// @route  PUT /api/admin/fees/:id
router.put("/fees/:id", updateFees);

// ---------- Timetable ----------
// @route  POST /api/admin/timetable
router.post("/timetable", addTimetable);

// @route  PUT /api/admin/timetable/:id
router.put("/timetable/:id", updateTimetable);

module.exports = router;

// ---------- Reports / dashboard ----------
router.get("/students/:id/fees", getStudentFeesAdmin);
router.get("/students/:id/attendance", getStudentAttendanceAdmin);
router.get("/students/:id/timetable", getStudentTimetableAdmin);
router.get("/stats", getStats);
router.get("/fees/defaulters", getDefaulters);

// ---------- Announcements ----------
router.post("/announcements", createAnnouncement);
router.get("/announcements", listAnnouncementsAdmin);
router.delete("/announcements/:id", deleteAnnouncement);

// ---------- Account ----------
router.put("/me/password", changePassword);

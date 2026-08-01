// controllers/studentController.js
// Handlers for the student-facing, self-service endpoints.
// req.user.id is the authenticated student's own id (from the JWT),
// so students can only ever read their own data.

const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Fee = require("../models/Fee");
const Timetable = require("../models/Timetable");
const asyncHandler = require("../utils/asyncHandler");

/**
 * @route   GET /api/student/profile
 * @desc    Get the logged-in student's own profile
 * @access  Private (student)
 */
const getProfile = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user.id);

  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }

  return res.status(200).json({ success: true, data: student });
});

/**
 * @route   GET /api/student/attendance
 * @desc    Get the logged-in student's attendance records + per-subject summary
 * @access  Private (student)
 * @query   subject, fromDate, toDate (all optional)
 */
const getAttendance = asyncHandler(async (req, res) => {
  const { subject, fromDate, toDate } = req.query;

  const [records, summary] = await Promise.all([
    Attendance.findByStudentId(req.user.id, { subject, fromDate, toDate }),
    Attendance.getSummaryByStudentId(req.user.id),
  ]);

  return res.status(200).json({
    success: true,
    data: {
      records,
      summary,
    },
  });
});

/**
 * @route   GET /api/student/fees
 * @desc    Get the logged-in student's fee records (all semesters)
 * @access  Private (student)
 */
const getFees = asyncHandler(async (req, res) => {
  const fees = await Fee.findByStudentId(req.user.id);
  return res.status(200).json({ success: true, data: fees });
});

/**
 * @route   GET /api/student/timetable
 * @desc    Get the logged-in student's weekly timetable
 * @access  Private (student)
 */
const getTimetable = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.user.id);

  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }

  const timetable = await Timetable.findByDeptSemSection(
    student.department,
    student.semester,
    student.section
  );

  return res.status(200).json({ success: true, data: timetable });
});

module.exports = {
  getProfile,
  getAttendance,
  getFees,
  getTimetable,
};

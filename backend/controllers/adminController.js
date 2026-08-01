// controllers/adminController.js
// Handlers for admin/registrar management endpoints: add/update
// students, and add/update attendance, fees, and timetable entries.

const bcrypt = require("bcrypt");
const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Fee = require("../models/Fee");
const Timetable = require("../models/Timetable");
const asyncHandler = require("../utils/asyncHandler");
const {
  validateNewStudent,
  validateAttendance,
  validateFees,
  validateTimetable,
} = require("../utils/validators");

const SALT_ROUNDS = 10;

// ---------------------------------------------------------------------
// STUDENTS
// ---------------------------------------------------------------------

/**
 * @route   POST /api/admin/students
 * @desc    Register a new student
 * @access  Private (admin)
 * @body    { libraryId, usn?, firstName, middleName?, lastName, email,
 *            phone?, password, gender?, dateOfBirth?, department, program?,
 *            semester, section, academicYear, admissionType?, status? }
 */
const addStudent = asyncHandler(async (req, res) => {
  const errors = validateNewStudent(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  const existing = await Student.findByEmail(req.body.email.trim().toLowerCase());
  if (existing) {
    return res.status(409).json({
      success: false,
      message: "A student with this email already exists",
    });
  }

  const passwordHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);

  const student = await Student.create({
    libraryId: req.body.libraryId.trim(),
    usn: req.body.usn ? req.body.usn.trim() : null,
    firstName: req.body.firstName.trim(),
    middleName: req.body.middleName ? req.body.middleName.trim() : null,
    lastName: req.body.lastName.trim(),
    email: req.body.email.trim().toLowerCase(),
    phone: req.body.phone || null,
    passwordHash,
    gender: req.body.gender || null,
    dateOfBirth: req.body.dateOfBirth || null,
    department: req.body.department,
    program: req.body.program || "B.E.",
    semester: req.body.semester,
    section: req.body.section,
    academicYear: req.body.academicYear,
    admissionType: req.body.admissionType || "Regular",
    status: req.body.status || "Active",
  });

  return res.status(201).json({
    success: true,
    message: "Student registered successfully",
    data: student,
  });
});

/**
 * @route   PUT /api/admin/students/:id
 * @desc    Update an existing student's details
 * @access  Private (admin)
 */
const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await Student.findById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }

  const updated = await Student.update(id, req.body);

  return res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: updated,
  });
});

/**
 * @route   GET /api/admin/students
 * @desc    List all students (optionally filtered)
 * @access  Private (admin)
 * @query   department, semester, section, status (all optional)
 */
const listStudents = asyncHandler(async (req, res) => {
  const { department, semester, section, status } = req.query;
  const students = await Student.findAll({ department, semester, section, status });
  return res.status(200).json({ success: true, count: students.length, data: students });
});

/**
 * @route   GET /api/admin/students/:id
 * @desc    Get a single student's details
 * @access  Private (admin)
 */
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }
  return res.status(200).json({ success: true, data: student });
});

// ---------------------------------------------------------------------
// ATTENDANCE
// ---------------------------------------------------------------------

/**
 * @route   POST /api/admin/attendance
 * @desc    Mark attendance for a student
 * @access  Private (admin)
 * @body    { studentId, subject, attendanceDate, status }
 */
const addAttendance = asyncHandler(async (req, res) => {
  const errors = validateAttendance(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  const student = await Student.findById(req.body.studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }

  const record = await Attendance.create({
    studentId: req.body.studentId,
    subject: req.body.subject,
    attendanceDate: req.body.attendanceDate,
    status: req.body.status,
    markedBy: req.user.id,
  });

  return res.status(201).json({
    success: true,
    message: "Attendance recorded successfully",
    data: record,
  });
});

/**
 * @route   PUT /api/admin/attendance/:id
 * @desc    Update an existing attendance record
 * @access  Private (admin)
 * @body    { subject?, attendanceDate?, status? }
 */
const updateAttendance = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await Attendance.findById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Attendance record not found" });
  }

  const updated = await Attendance.update(id, {
    subject: req.body.subject,
    attendanceDate: req.body.attendanceDate,
    status: req.body.status,
  });

  return res.status(200).json({
    success: true,
    message: "Attendance updated successfully",
    data: updated,
  });
});

// ---------------------------------------------------------------------
// FEES
// ---------------------------------------------------------------------

/**
 * @route   POST /api/admin/fees
 * @desc    Create a fee record for a student/semester
 * @access  Private (admin)
 * @body    { studentId, semester, academicYear, totalAmount, paidAmount?, dueDate?, status? }
 */
const addFees = asyncHandler(async (req, res) => {
  const errors = validateFees(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  const student = await Student.findById(req.body.studentId);
  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }

  const record = await Fee.create({
    studentId: req.body.studentId,
    semester: req.body.semester,
    academicYear: req.body.academicYear,
    totalAmount: req.body.totalAmount,
    paidAmount: req.body.paidAmount || 0,
    dueDate: req.body.dueDate || null,
    status: req.body.status || "Pending",
  });

  return res.status(201).json({
    success: true,
    message: "Fee record created successfully",
    data: record,
  });
});

/**
 * @route   PUT /api/admin/fees/:id
 * @desc    Update an existing fee record (e.g. mark as paid)
 * @access  Private (admin)
 * @body    { totalAmount?, paidAmount?, dueDate?, status? }
 */
const updateFees = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await Fee.findById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Fee record not found" });
  }

  const updated = await Fee.update(id, {
    totalAmount: req.body.totalAmount,
    paidAmount: req.body.paidAmount,
    dueDate: req.body.dueDate,
    status: req.body.status,
  });

  return res.status(200).json({
    success: true,
    message: "Fee record updated successfully",
    data: updated,
  });
});

// ---------------------------------------------------------------------
// TIMETABLE
// ---------------------------------------------------------------------

/**
 * @route   POST /api/admin/timetable
 * @desc    Add a new timetable entry for a department/semester/section
 * @access  Private (admin)
 * @body    { department, semester, section, dayOfWeek, periodNumber,
 *            subject, facultyName, startTime, endTime, roomNumber? }
 */
const addTimetable = asyncHandler(async (req, res) => {
  const errors = validateTimetable(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  const entry = await Timetable.create({
    department: req.body.department,
    semester: req.body.semester,
    section: req.body.section,
    dayOfWeek: req.body.dayOfWeek,
    periodNumber: req.body.periodNumber,
    subject: req.body.subject,
    facultyName: req.body.facultyName,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    roomNumber: req.body.roomNumber || null,
  });

  return res.status(201).json({
    success: true,
    message: "Timetable entry added successfully",
    data: entry,
  });
});

/**
 * @route   PUT /api/admin/timetable/:id
 * @desc    Update an existing timetable entry
 * @access  Private (admin)
 * @body    { subject?, facultyName?, startTime?, endTime?, roomNumber? }
 */
const updateTimetable = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await Timetable.findById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Timetable entry not found" });
  }

  const updated = await Timetable.update(id, {
    subject: req.body.subject,
    facultyName: req.body.facultyName,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    roomNumber: req.body.roomNumber,
  });

  return res.status(200).json({
    success: true,
    message: "Timetable entry updated successfully",
    data: updated,
  });
});

module.exports = {
  addStudent,
  updateStudent,
  listStudents,
  getStudentById,
  addAttendance,
  updateAttendance,
  addFees,
  updateFees,
  addTimetable,
  updateTimetable,
};

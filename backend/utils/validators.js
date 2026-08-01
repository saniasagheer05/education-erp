// utils/validators.js
// Lightweight, dependency-free request validation helpers.
// Each function returns an array of error strings (empty array = valid).

const isEmpty = (value) =>
  value === undefined || value === null || String(value).trim() === "";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));

/**
 * Validate payload for student login.
 */
const validateStudentLogin = ({ libraryId, password }) => {
  const errors = [];
  if (isEmpty(libraryId)) errors.push("Library ID is required");
  if (isEmpty(password)) errors.push("Password is required");
  return errors;
};

/**
 * Validate payload for admin login.
 */
const validateAdminLogin = ({ email, password }) => {
  const errors = [];
  if (isEmpty(email)) errors.push("Email is required");
  else if (!isValidEmail(email)) errors.push("Email format is invalid");
  if (isEmpty(password)) errors.push("Password is required");
  return errors;
};

/**
 * Validate payload for creating a new student (admin action).
 */
const validateNewStudent = (body) => {
  const errors = [];
  const required = [
    "libraryId",
    "firstName",
    "lastName",
    "email",
    "password",
    "department",
    "semester",
    "section",
    "academicYear",
  ];

  required.forEach((field) => {
    if (isEmpty(body[field])) errors.push(`${field} is required`);
  });

  if (!isEmpty(body.email) && !isValidEmail(body.email)) {
    errors.push("Email format is invalid");
  }

  if (
    body.semester !== undefined &&
    (Number.isNaN(Number(body.semester)) ||
      Number(body.semester) < 1 ||
      Number(body.semester) > 8)
  ) {
    errors.push("Semester must be a number between 1 and 8");
  }

  return errors;
};

/**
 * Validate payload for marking/updating attendance.
 */
const validateAttendance = (body) => {
  const errors = [];
  const validStatuses = ["Present", "Absent", "Late", "Excused"];

  if (isEmpty(body.studentId)) errors.push("studentId is required");
  if (isEmpty(body.subject)) errors.push("subject is required");
  if (isEmpty(body.attendanceDate)) errors.push("attendanceDate is required");
  if (isEmpty(body.status)) {
    errors.push("status is required");
  } else if (!validStatuses.includes(body.status)) {
    errors.push(`status must be one of: ${validStatuses.join(", ")}`);
  }

  return errors;
};

/**
 * Validate payload for adding/updating fee records.
 */
const validateFees = (body) => {
  const errors = [];
  const validStatuses = ["Paid", "Pending", "Partially Paid", "Overdue"];

  if (isEmpty(body.studentId)) errors.push("studentId is required");
  if (isEmpty(body.semester)) errors.push("semester is required");
  if (isEmpty(body.academicYear)) errors.push("academicYear is required");
  if (body.totalAmount === undefined || Number.isNaN(Number(body.totalAmount))) {
    errors.push("totalAmount must be a valid number");
  }
  if (body.paidAmount === undefined || Number.isNaN(Number(body.paidAmount))) {
    errors.push("paidAmount must be a valid number");
  }
  if (body.status && !validStatuses.includes(body.status)) {
    errors.push(`status must be one of: ${validStatuses.join(", ")}`);
  }

  return errors;
};

/**
 * Validate payload for adding/updating a timetable entry.
 */
const validateTimetable = (body) => {
  const errors = [];
  const validDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const required = [
    "department",
    "semester",
    "section",
    "dayOfWeek",
    "periodNumber",
    "subject",
    "facultyName",
    "startTime",
    "endTime",
  ];

  required.forEach((field) => {
    if (isEmpty(body[field])) errors.push(`${field} is required`);
  });

  if (body.dayOfWeek && !validDays.includes(body.dayOfWeek)) {
    errors.push(`dayOfWeek must be one of: ${validDays.join(", ")}`);
  }

  return errors;
};

module.exports = {
  isEmpty,
  isValidEmail,
  validateStudentLogin,
  validateAdminLogin,
  validateNewStudent,
  validateAttendance,
  validateFees,
  validateTimetable,
};

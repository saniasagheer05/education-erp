// models/attendanceModel.js
// All raw SQL queries related to the attendance table live here.

const { query } = require("../config/db");

/**
 * Get all attendance records for a given student, most recent first.
 */
const findByStudentId = async (studentId, filters = {}) => {
  const conditions = [`student_id = $1`];
  const values = [studentId];
  let index = 2;

  if (filters.subject) {
    conditions.push(`subject = $${index++}`);
    values.push(filters.subject);
  }
  if (filters.fromDate) {
    conditions.push(`attendance_date >= $${index++}`);
    values.push(filters.fromDate);
  }
  if (filters.toDate) {
    conditions.push(`attendance_date <= $${index++}`);
    values.push(filters.toDate);
  }

  const result = await query(
    `SELECT id, student_id, subject, attendance_date, status, created_at
     FROM attendance
     WHERE ${conditions.join(" AND ")}
     ORDER BY attendance_date DESC`,
    values
  );
  return result.rows;
};

/**
 * Compute attendance percentage summary per subject for a student.
 */
const getSummaryByStudentId = async (studentId) => {
  const result = await query(
    `SELECT
        subject,
        COUNT(*) AS total_classes,
        COUNT(*) FILTER (WHERE status = 'Present') AS present_count,
        ROUND(
          (COUNT(*) FILTER (WHERE status = 'Present')::NUMERIC / COUNT(*)) * 100,
          2
        ) AS attendance_percentage
     FROM attendance
     WHERE student_id = $1
     GROUP BY subject
     ORDER BY subject`,
    [studentId]
  );
  return result.rows;
};

/**
 * Insert a new attendance record.
 */
const create = async ({ studentId, subject, attendanceDate, status, markedBy }) => {
  const result = await query(
    `INSERT INTO attendance (student_id, subject, attendance_date, status, marked_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, student_id, subject, attendance_date, status, created_at`,
    [studentId, subject, attendanceDate, status, markedBy || null]
  );
  return result.rows[0];
};

/**
 * Update an existing attendance record by id.
 */
const update = async (id, { subject, attendanceDate, status }) => {
  const result = await query(
    `UPDATE attendance
     SET subject = COALESCE($1, subject),
         attendance_date = COALESCE($2, attendance_date),
         status = COALESCE($3, status)
     WHERE id = $4
     RETURNING id, student_id, subject, attendance_date, status, updated_at`,
    [subject, attendanceDate, status, id]
  );
  return result.rows[0] || null;
};

/**
 * Find a single attendance record by id.
 */
const findById = async (id) => {
  const result = await query(`SELECT * FROM attendance WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

module.exports = {
  findByStudentId,
  getSummaryByStudentId,
  create,
  update,
  findById,
};

// models/attendanceModel.js
// All raw SQL queries related to the attendance table live here.

const { query, pool } = require("../config/db");

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
     ON CONFLICT (student_id, subject, attendance_date)
     DO UPDATE SET status = EXCLUDED.status, updated_at = NOW()
     RETURNING id, student_id, subject, attendance_date, status, created_at`,
    [studentId, subject, attendanceDate, status, markedBy || null]
  );
  return result.rows[0];
};

/**
 * Bulk mark attendance using an explicit database transaction.
 */
const createBulk = async ({ subject, attendanceDate, records, markedBy }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const inserted = [];
    for (const rec of records) {
      const res = await client.query(
        `INSERT INTO attendance (student_id, subject, attendance_date, status, marked_by)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (student_id, subject, attendance_date)
         DO UPDATE SET status = EXCLUDED.status, updated_at = NOW()
         RETURNING id, student_id, subject, attendance_date, status`,
        [rec.studentId, subject, attendanceDate, rec.status, markedBy || null]
      );
      inserted.push(res.rows[0]);
    }

    await client.query("COMMIT");
    return inserted;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Find students whose overall attendance is below a given percentage threshold.
 */
const findLowAttendance = async ({ threshold = 75, department, semester } = {}) => {
  const conditions = ["s.status = 'Active'"];
  const values = [];
  let index = 1;

  if (department) {
    conditions.push(`s.department = $${index++}`);
    values.push(department);
  }
  if (semester) {
    conditions.push(`s.semester = $${index++}`);
    values.push(parseInt(semester, 10));
  }

  values.push(parseFloat(threshold));
  const thresholdIndex = index++;

  const sql = `
    SELECT
      s.id,
      s.library_id,
      s.usn,
      s.first_name,
      s.last_name,
      s.department,
      s.semester,
      s.section,
      COUNT(a.id)::INTEGER AS total_classes,
      COUNT(a.id) FILTER (WHERE a.status = 'Present')::INTEGER AS present_classes,
      ROUND(
        (COUNT(a.id) FILTER (WHERE a.status = 'Present')::NUMERIC / NULLIF(COUNT(a.id), 0)) * 100,
        1
      )::FLOAT AS attendance_percentage
    FROM students s
    JOIN attendance a ON a.student_id = s.id
    WHERE ${conditions.join(" AND ")}
    GROUP BY s.id, s.library_id, s.usn, s.first_name, s.last_name, s.department, s.semester, s.section
    HAVING (COUNT(a.id) FILTER (WHERE a.status = 'Present')::NUMERIC / NULLIF(COUNT(a.id), 0)) * 100 < $${thresholdIndex}
    ORDER BY attendance_percentage ASC, s.last_name ASC
  `;

  const result = await query(sql, values);
  return result.rows;
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
  createBulk,
  findLowAttendance,
  update,
  findById,
};

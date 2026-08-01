// models/feesModel.js
// All raw SQL queries related to the fees table live here.

const { query } = require("../config/db");

/**
 * Get all fee records for a given student, most recent semester first.
 */
const findByStudentId = async (studentId) => {
  const result = await query(
    `SELECT id, student_id, semester, academic_year, total_amount,
            paid_amount, due_amount, due_date, status, created_at, updated_at
     FROM fees
     WHERE student_id = $1
     ORDER BY semester DESC`,
    [studentId]
  );
  return result.rows;
};

/**
 * Find a single fee record by id.
 */
const findById = async (id) => {
  const result = await query(`SELECT * FROM fees WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

/**
 * Create a new fee record for a student/semester/academic_year.
 */
const create = async ({
  studentId,
  semester,
  academicYear,
  totalAmount,
  paidAmount,
  dueDate,
  status,
}) => {
  const result = await query(
    `INSERT INTO fees
      (student_id, semester, academic_year, total_amount, paid_amount, due_date, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, student_id, semester, academic_year, total_amount,
               paid_amount, due_amount, due_date, status, created_at`,
    [
      studentId,
      semester,
      academicYear,
      totalAmount,
      paidAmount || 0,
      dueDate || null,
      status || "Pending",
    ]
  );
  return result.rows[0];
};

/**
 * Update an existing fee record by id.
 */
const update = async (id, { totalAmount, paidAmount, dueDate, status }) => {
  const result = await query(
    `UPDATE fees
     SET total_amount = COALESCE($1, total_amount),
         paid_amount = COALESCE($2, paid_amount),
         due_date = COALESCE($3, due_date),
         status = COALESCE($4, status)
     WHERE id = $5
     RETURNING id, student_id, semester, academic_year, total_amount,
               paid_amount, due_amount, due_date, status, updated_at`,
    [totalAmount, paidAmount, dueDate, status, id]
  );
  return result.rows[0] || null;
};

module.exports = {
  findByStudentId,
  findById,
  create,
  update,
};

// models/studentModel.js
// All raw SQL queries related to the students table live here.

const { query } = require("../config/db");

const PUBLIC_COLUMNS = `
  id, library_id, usn, first_name, middle_name, last_name, email, phone,
  gender, date_of_birth, department, program, semester, section,
  academic_year, admission_type, status, created_at, updated_at
`;

/**
 * Find a student by library_id, including password_hash (used for login).
 */
const findByLibraryId = async (libraryId) => {
  const result = await query(
    `SELECT id, library_id, password_hash, first_name, last_name, status
     FROM students WHERE library_id = $1`,
    [libraryId]
  );
  return result.rows[0] || null;
};

/**
 * Find a student by primary key id (safe fields only).
 */
const findById = async (id) => {
  const result = await query(
    `SELECT ${PUBLIC_COLUMNS} FROM students WHERE id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

/**
 * Find a student by email (used to prevent duplicate registration).
 */
const findByEmail = async (email) => {
  const result = await query(`SELECT id FROM students WHERE email = $1`, [
    email,
  ]);
  return result.rows[0] || null;
};

/**
 * List all students, optionally filtered by department/semester/section.
 */
const findAll = async (filters = {}) => {
  const conditions = [];
  const values = [];
  let index = 1;

  if (filters.department) {
    conditions.push(`department = $${index++}`);
    values.push(filters.department);
  }
  if (filters.semester) {
    conditions.push(`semester = $${index++}`);
    values.push(filters.semester);
  }
  if (filters.section) {
    conditions.push(`section = $${index++}`);
    values.push(filters.section);
  }
  if (filters.status) {
    conditions.push(`status = $${index++}`);
    values.push(filters.status);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const result = await query(
    `SELECT ${PUBLIC_COLUMNS} FROM students ${whereClause} ORDER BY created_at DESC`,
    values
  );
  return result.rows;
};

/**
 * Insert a new student record. Expects password to already be hashed.
 */
const create = async (student) => {
  const result = await query(
    `INSERT INTO students
      (library_id, usn, first_name, middle_name, last_name, email, phone,
       password_hash, gender, date_of_birth, department, program, semester,
       section, academic_year, admission_type, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
     RETURNING ${PUBLIC_COLUMNS}`,
    [
      student.libraryId,
      student.usn || null,
      student.firstName,
      student.middleName || null,
      student.lastName,
      student.email,
      student.phone || null,
      student.passwordHash,
      student.gender || null,
      student.dateOfBirth || null,
      student.department,
      student.program || "B.E.",
      student.semester,
      student.section,
      student.academicYear,
      student.admissionType || "Regular",
      student.status || "Active",
    ]
  );
  return result.rows[0];
};

/**
 * Update an existing student record. Only provided fields are updated.
 */
const update = async (id, fields) => {
  const allowedFields = {
    usn: "usn",
    firstName: "first_name",
    middleName: "middle_name",
    lastName: "last_name",
    email: "email",
    phone: "phone",
    gender: "gender",
    dateOfBirth: "date_of_birth",
    department: "department",
    program: "program",
    semester: "semester",
    section: "section",
    academicYear: "academic_year",
    admissionType: "admission_type",
    status: "status",
  };

  const setClauses = [];
  const values = [];
  let index = 1;

  Object.entries(fields).forEach(([key, value]) => {
    if (allowedFields[key] !== undefined && value !== undefined) {
      setClauses.push(`${allowedFields[key]} = $${index++}`);
      values.push(value);
    }
  });

  if (setClauses.length === 0) {
    return findById(id);
  }

  values.push(id);
  const result = await query(
    `UPDATE students SET ${setClauses.join(", ")} WHERE id = $${index}
     RETURNING ${PUBLIC_COLUMNS}`,
    values
  );
  return result.rows[0] || null;
};

module.exports = {
  findByLibraryId,
  findById,
  findByEmail,
  findAll,
  create,
  update,
};

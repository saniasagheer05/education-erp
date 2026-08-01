// models/timetableModel.js
// All raw SQL queries related to the timetable table live here.
// A student's personal timetable is resolved by matching their
// department + semester + section against this table.

const { query } = require("../config/db");

/**
 * Get the full weekly timetable for a given department/semester/section.
 */
const findByDeptSemSection = async (department, semester, section) => {
  const result = await query(
    `SELECT id, department, semester, section, day_of_week, period_number,
            subject, faculty_name, start_time, end_time, room_number
     FROM timetable
     WHERE department = $1 AND semester = $2 AND section = $3
     ORDER BY
       CASE day_of_week
         WHEN 'Monday' THEN 1
         WHEN 'Tuesday' THEN 2
         WHEN 'Wednesday' THEN 3
         WHEN 'Thursday' THEN 4
         WHEN 'Friday' THEN 5
         WHEN 'Saturday' THEN 6
       END,
       period_number`,
    [department, semester, section]
  );
  return result.rows;
};

/**
 * Find a single timetable entry by id.
 */
const findById = async (id) => {
  const result = await query(`SELECT * FROM timetable WHERE id = $1`, [id]);
  return result.rows[0] || null;
};

/**
 * Create a new timetable entry.
 */
const create = async ({
  department,
  semester,
  section,
  dayOfWeek,
  periodNumber,
  subject,
  facultyName,
  startTime,
  endTime,
  roomNumber,
}) => {
  const result = await query(
    `INSERT INTO timetable
      (department, semester, section, day_of_week, period_number,
       subject, faculty_name, start_time, end_time, room_number)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING id, department, semester, section, day_of_week, period_number,
               subject, faculty_name, start_time, end_time, room_number`,
    [
      department,
      semester,
      section,
      dayOfWeek,
      periodNumber,
      subject,
      facultyName,
      startTime,
      endTime,
      roomNumber || null,
    ]
  );
  return result.rows[0];
};

/**
 * Update an existing timetable entry by id.
 */
const update = async (
  id,
  { subject, facultyName, startTime, endTime, roomNumber }
) => {
  const result = await query(
    `UPDATE timetable
     SET subject = COALESCE($1, subject),
         faculty_name = COALESCE($2, faculty_name),
         start_time = COALESCE($3, start_time),
         end_time = COALESCE($4, end_time),
         room_number = COALESCE($5, room_number)
     WHERE id = $6
     RETURNING id, department, semester, section, day_of_week, period_number,
               subject, faculty_name, start_time, end_time, room_number`,
    [subject, facultyName, startTime, endTime, roomNumber, id]
  );
  return result.rows[0] || null;
};

module.exports = {
  findByDeptSemSection,
  findById,
  create,
  update,
};

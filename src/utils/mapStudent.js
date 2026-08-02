export function mapApiStudentToCard(student) {
  const firstInitial = student.first_name ? student.first_name[0] : "";
  const lastInitial = student.last_name ? student.last_name[0] : "";

  return {
    id: student.id,
    libraryId: student.library_id,
    usn: student.usn || "PENDING",
    name: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
    initials: `${firstInitial}${lastInitial}`.toUpperCase() || "?",
    dept: student.department,
    sem: student.semester !== undefined && student.semester !== null ? String(student.semester) : "",
    section: student.section,
    academicYear: student.academic_year,
    status: student.status || "Active",
  };
}

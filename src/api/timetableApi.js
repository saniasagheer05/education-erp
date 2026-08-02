import { authorizedFetch } from "./apiClient";

/**
 * GET /api/admin/students/:studentId/timetable
 */
export async function getStudentTimetable(studentId) {
  const result = await authorizedFetch(`/admin/students/${studentId}/timetable`, {
    method: "GET",
  });
  return result.data; // { student: {department, semester, section}, timetable: [...] }
}

/**
 * POST /api/admin/timetable
 */
export async function createTimetableEntry(payload) {
  const result = await authorizedFetch("/admin/timetable", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return result.data;
}

/**
 * PUT /api/admin/timetable/:id
 */
export async function updateTimetableEntry(id, payload) {
  const result = await authorizedFetch(`/admin/timetable/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return result.data;
}

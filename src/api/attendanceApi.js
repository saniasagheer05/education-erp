import { authorizedFetch } from "./apiClient";

/**
 * GET /api/admin/students/:studentId/attendance
 */
export async function getStudentAttendance(studentId) {
  const result = await authorizedFetch(`/admin/students/${studentId}/attendance`, {
    method: "GET",
  });
  return result.data; // { records, summary }
}

/**
 * POST /api/admin/attendance
 */
export async function createAttendance(payload) {
  const result = await authorizedFetch("/admin/attendance", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return result.data;
}

/**
 * PUT /api/admin/attendance/:id
 */
export async function updateAttendance(id, payload) {
  const result = await authorizedFetch(`/admin/attendance/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return result.data;
}

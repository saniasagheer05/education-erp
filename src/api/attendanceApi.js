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
 * POST /api/admin/attendance/bulk
 * Payload: { subject, attendanceDate, records: [{ studentId, status }, ...] }
 */
export async function bulkMarkAttendance(payload) {
  const result = await authorizedFetch("/admin/attendance/bulk", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return result;
}

/**
 * GET /api/admin/attendance/low
 * Query params: threshold, department, semester
 */
export async function getLowAttendance(params = {}) {
  const query = new URLSearchParams();
  if (params.threshold !== undefined) query.append("threshold", params.threshold);
  if (params.department) query.append("department", params.department);
  if (params.semester) query.append("semester", params.semester);

  const qs = query.toString() ? `?${query.toString()}` : "";
  const result = await authorizedFetch(`/admin/attendance/low${qs}`, {
    method: "GET",
  });
  return result.data; // array of students with low attendance
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

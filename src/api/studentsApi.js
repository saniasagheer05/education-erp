import { authorizedFetch } from "./apiClient";

/**
 * GET /api/admin/students — list all students (optionally filtered).
 */
export async function listStudents(filters = {}) {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== "")
  ).toString();
  const path = params ? `/admin/students?${params}` : "/admin/students";
  const result = await authorizedFetch(path, { method: "GET" });
  return result.data;
}

/**
 * GET /api/admin/students/:id
 */
export async function getStudentById(id) {
  const result = await authorizedFetch(`/admin/students/${id}`, { method: "GET" });
  return result.data;
}

/**
 * POST /api/admin/students
 */
export async function createStudent(payload) {
  const result = await authorizedFetch("/admin/students", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return result.data;
}

/**
 * PUT /api/admin/students/:id
 */
export async function updateStudent(id, payload) {
  const result = await authorizedFetch(`/admin/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return result.data;
}

import { authorizedFetch } from "./apiClient";

/**
 * GET /api/admin/students/:studentId/fees
 */
export async function getStudentFees(studentId) {
  const result = await authorizedFetch(`/admin/students/${studentId}/fees`, {
    method: "GET",
  });
  return result.data;
}

/**
 * POST /api/admin/fees
 */
export async function createFee(payload) {
  const result = await authorizedFetch("/admin/fees", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return result.data;
}

/**
 * PUT /api/admin/fees/:id
 */
export async function updateFee(id, payload) {
  const result = await authorizedFetch(`/admin/fees/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return result.data;
}

export async function getDefaulters(params = {}) {
  const query = new URLSearchParams();
  if (params.department) query.append("department", params.department);
  if (params.semester) query.append("semester", params.semester);
  const qs = query.toString() ? `?${query.toString()}` : "";
  const result = await authorizedFetch(`/admin/fees/defaulters${qs}`, { method:"GET" });
  return { data: result.data || [], count: result.count || 0, totalDue: result.totalDue || 0 };
}

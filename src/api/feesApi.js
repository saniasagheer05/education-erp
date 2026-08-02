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

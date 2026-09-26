import { authorizedFetch } from "./apiClient";
export async function getAdminAnnouncements() { const r = await authorizedFetch("/admin/announcements", { method:"GET" }); return r.data; }
export async function createAnnouncement(payload) { const r = await authorizedFetch("/admin/announcements", { method:"POST", body: JSON.stringify(payload) }); return r.data; }
export async function deleteAnnouncement(id) { return authorizedFetch(`/admin/announcements/${id}`, { method:"DELETE" }); }
export async function getStudentAnnouncements() { const r = await authorizedFetch("/student/announcements", { method:"GET" }); return r.data; }
export async function savePushToken(token) { return authorizedFetch("/push-token", { method:"POST", body: JSON.stringify({ token }) }); }

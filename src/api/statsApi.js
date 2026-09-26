import { authorizedFetch } from "./apiClient";
export async function getDashboardStats() { const r = await authorizedFetch("/admin/stats", { method:"GET" }); return r.data; }

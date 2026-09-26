import { getToken, removeAuth } from "../utils/authStorage";
import { API_BASE_URL } from "../config/apiConfig";
let onSessionExpired = null;
export function setSessionExpiredHandler(handler) { onSessionExpired = handler; }
export async function authorizedFetch(path, options = {}) {
  const token = await getToken();
  if (!token) { const e = new Error("Your session was not found. Please log in again."); e.isAuthError = true; throw e; }
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}`, ...(options.headers||{}) } });
  const result = await response.json();
  if (!response.ok || !result.success) {
    const message = (result.errors && result.errors.join("\n")) || result.message || "Something went wrong. Please try again.";
    const error = new Error(message); error.status = response.status; error.body = result;
    if (response.status === 401) {
      error.isAuthError = true;
      try { await removeAuth(); } catch (e) { console.error("Failed to clear session after 401:", e); }
      if (onSessionExpired) onSessionExpired();
    }
    throw error;
  }
  return result;
}

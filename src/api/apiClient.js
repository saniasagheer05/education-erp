import { getToken } from "../utils/authStorage";
import { API_BASE_URL } from "../config/apiConfig";

export async function authorizedFetch(path, options = {}) {
  const token = await getToken();

  if (!token) {
    const error = new Error("Your admin session was not found. Please log in again.");
    error.isAuthError = true;
    throw error;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    const message =
      (result.errors && result.errors.join("\n")) ||
      result.message ||
      "Something went wrong. Please try again.";
    const error = new Error(message);
    error.status = response.status;
    error.body = result;
    throw error;
  }

  return result;
}

import { API_BASE_URL } from "../config/apiConfig";

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 700;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * POST /api/auth/admin/login
 */
export async function adminLogin(email, password) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      return { response, result };
    } catch (error) {
      lastError = error;
      console.error(
        `Admin login attempt ${attempt}/${MAX_ATTEMPTS} failed (network):`,
        error.message
      );
      if (attempt < MAX_ATTEMPTS) {
        await delay(RETRY_DELAY_MS * attempt);
      }
    }
  }

  throw lastError;
}

/**
 * POST /api/auth/student/login
 * Body: { libraryId: string, password: string }
 */
export async function studentLogin(libraryId, password) {
  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ libraryId, password }),
      });

      const result = await response.json();
      return { response, result };
    } catch (error) {
      lastError = error;
      console.error(
        `Student login attempt ${attempt}/${MAX_ATTEMPTS} failed (network):`,
        error.message
      );
      if (attempt < MAX_ATTEMPTS) {
        await delay(RETRY_DELAY_MS * attempt);
      }
    }
  }

  throw lastError;
}

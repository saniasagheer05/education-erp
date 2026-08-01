
import { API_BASE_URL } from "../config/apiConfig";

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 700;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * POST /api/auth/admin/login
 *
 * Retries a couple of times on a raw network failure (not on a real
 * 401/validation error) before giving up. This specifically helps right
 * after a fresh app launch / cleared app data, where the very first
 * outgoing request on some Android emulator setups can fail with a
 * generic "Network request failed" while the network interface / adb
 * reverse tunnel is still settling — even though every request after
 * that succeeds fine.
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
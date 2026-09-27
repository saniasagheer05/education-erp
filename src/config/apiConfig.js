// src/config/apiConfig.js
// Centralized API configuration.
//
// In production (Vercel, Render, or EAS builds), define EXPO_PUBLIC_API_URL.
// Expo automatically inlines any variable starting with EXPO_PUBLIC_ into the client bundle:
//   e.g. EXPO_PUBLIC_API_URL=https://svce-erp-api.onrender.com/api
//
// When EXPO_PUBLIC_API_URL is unset, it falls back to local development (http://localhost:5000/api).
// For Android emulator local testing, run: adb reverse tcp:5000 tcp:5000

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  return "http://localhost:5000/api";
};

export const API_BASE_URL = getBaseUrl();

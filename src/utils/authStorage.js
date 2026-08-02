// src/utils/authStorage.js
// Minimal AsyncStorage helpers for persisting the admin JWT across app sessions.

import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "svce_erp_admin_token";

export async function saveToken(token) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function removeToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

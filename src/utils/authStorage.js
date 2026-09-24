// src/utils/authStorage.js
// AsyncStorage helpers for persisting tokens and user profiles across app sessions.

import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "svce_erp_token";
const USER_KEY = "svce_erp_user";
// Legacy key for backwards compatibility
const LEGACY_ADMIN_TOKEN_KEY = "svce_erp_admin_token";

export async function saveToken(token) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(LEGACY_ADMIN_TOKEN_KEY, token);
}

export async function getToken() {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  if (token) return token;
  return AsyncStorage.getItem(LEGACY_ADMIN_TOKEN_KEY);
}

export async function removeToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
}

export async function saveUser(user) {
  if (!user) return;
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser() {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function removeUser() {
  await AsyncStorage.removeItem(USER_KEY);
}

export async function saveAuth(token, user) {
  await Promise.all([saveToken(token), saveUser(user)]);
}

export async function removeAuth() {
  await Promise.all([removeToken(), removeUser()]);
}

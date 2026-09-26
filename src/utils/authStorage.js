import AsyncStorage from "@react-native-async-storage/async-storage";
const TOKEN_KEY = "svce_erp_token";
const USER_KEY = "svce_erp_user";
export async function saveToken(token) { await AsyncStorage.setItem(TOKEN_KEY, token); }
export async function getToken() { return AsyncStorage.getItem(TOKEN_KEY); }
export async function removeToken() { await AsyncStorage.removeItem(TOKEN_KEY); }
export async function saveUser(user) { if (!user) return; await AsyncStorage.setItem(USER_KEY, JSON.stringify(user)); }
export async function getUser() { try { const raw = await AsyncStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; } }
export async function removeUser() { await AsyncStorage.removeItem(USER_KEY); }
export async function saveAuth(token, user) {
  const pairs = [[TOKEN_KEY, token]];
  if (user) pairs.push([USER_KEY, JSON.stringify(user)]);
  await AsyncStorage.multiSet(pairs);
}
export async function removeAuth() { await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]); }

// Remembers which portal (admin/student) was last used, purely so that
// after logging out, the login screen shown matches the one the person
// just used instead of always defaulting to one portal. Not part of the
// authenticated session, so it is never cleared by removeAuth/logout -
// that is what lets you log out of Admin and immediately see Admin Login
// again (with a link to switch), rather than being dropped on Student
// Login every time.
const LAST_PORTAL_KEY = "svce_erp_last_portal";
export async function saveLastPortal(role) {
  if (role !== "admin" && role !== "student") return;
  await AsyncStorage.setItem(LAST_PORTAL_KEY, role);
}
export async function getLastPortal() {
  const value = await AsyncStorage.getItem(LAST_PORTAL_KEY);
  return value === "admin" ? "admin" : "student";
}

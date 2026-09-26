import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  getToken,
  getUser,
  saveAuth,
  removeAuth,
  saveToken,
  removeToken,
  saveLastPortal,
  getLastPortal,
} from "../utils/authStorage";
import { registerForPushNotifications } from "../utils/pushNotifications";
import { setSessionExpiredHandler } from "../api/apiClient";

const AuthContext = createContext({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  role: null,
  lastPortal: "student",
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  // Which login screen (admin/student) to return to after logging out.
  // Restored from storage on launch, then kept in sync with the role of
  // whoever is currently logged in.
  const [lastPortal, setLastPortal] = useState("student");

  useEffect(() => {
    (async () => {
      try {
        const [token, storedUser, portal] = await Promise.all([getToken(), getUser(), getLastPortal()]);
        setLastPortal(portal);
        if (token) {
          setIsAuthenticated(true);
          setUser(storedUser || null);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to restore auth session:", err);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isAuthenticated) registerForPushNotifications();
  }, [isAuthenticated]);

  // If any API call comes back with an invalid/expired token, apiClient
  // already cleared AsyncStorage - mirror that here so the app switches
  // back to the login screen right away instead of staying "authenticated"
  // with a session that no longer works.
  useEffect(() => {
    setSessionExpiredHandler(() => {
      setUser(null);
      setIsAuthenticated(false);
    });
    return () => setSessionExpiredHandler(null);
  }, []);

  const login = useCallback(async (token, userData = null) => {
    if (!token) throw new Error("login() called without a token");
    if (userData) {
      await saveAuth(token, userData);
      setUser(userData);
      if (userData.role) {
        await saveLastPortal(userData.role);
        setLastPortal(userData.role);
      }
    } else {
      await saveToken(token);
    }
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    // Flip auth state FIRST, synchronously, so the app switches back to the
    // login screen immediately on tap. Clearing AsyncStorage happens after -
    // on a real device that call crosses the native bridge to disk and can
    // be slow, and blocking the UI transition on it is what made logout
    // look like it "does nothing" when that write was ever delayed.
    setUser(null);
    setIsAuthenticated(false);
    try {
      await removeAuth();
    } catch (err) {
      console.error("Failed to clear stored session during logout:", err);
      try {
        await removeToken();
        await removeUser();
      } catch (err2) {
        console.error("Fallback session clear also failed:", err2);
      }
    }
  }, []);

  const role = user?.role || null;

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated, user, role, lastPortal, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

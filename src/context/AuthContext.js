import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getToken,
  getUser,
  saveAuth,
  removeAuth,
  saveToken,
  removeToken,
} from "../utils/authStorage";

const AuthContext = createContext({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  role: null,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Restore existing session from AsyncStorage on app launch
  useEffect(() => {
    (async () => {
      try {
        const [token, storedUser] = await Promise.all([getToken(), getUser()]);
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

  const login = useCallback(async (token, userData = null) => {
    if (!token) {
      throw new Error("login() called without a token");
    }

    if (userData) {
      await saveAuth(token, userData);
      setUser(userData);
    } else {
      await saveToken(token);
    }

    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await removeAuth();
    } catch {
      await removeToken();
    }
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const role = user?.role || (isAuthenticated ? "admin" : null);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        role,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

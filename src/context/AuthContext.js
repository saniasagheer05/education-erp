import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { getToken, saveToken, removeToken } from "../utils/authStorage";

const AuthContext = createContext({
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initial check on app launch only — reads whatever token (if any) was
  // persisted from a previous session.
  useEffect(() => {
    (async () => {
      const token = await getToken();
      setIsAuthenticated(!!token);
      setIsLoading(false);
    })();
  }, []);

  // IMPORTANT: takes the freshly-issued token directly and sets
  // isAuthenticated from it immediately. The previous version wrote the
  // token to AsyncStorage and then immediately re-read it back to decide
  // whether to authenticate — an unnecessary write-then-read race that
  // was the actual cause of navigation silently never firing.
  const login = useCallback(async (token) => {
    if (!token) {
      throw new Error("login() called without a token");
    }
    await saveToken(token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await removeToken();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin, logout as apiLogout, register as apiRegister, setAuthToken } from "./api";

/**
 * Auth context shape (JSDoc for editor intellisense)
 * @typedef {Object} AuthContextType
 * @property {string|null} token
 * @property {boolean} isAuthenticated
 * @property {(email:string, password:string) => Promise<void>} login
 * @property {() => Promise<void>} logout
 * @property {(username:string, email:string, password:string) => Promise<void>} register
 */

const AuthContext = createContext(undefined);

/**
 * React Provider for authentication state.
 * Wraps the application and exposes login/logout/register via context.
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = useCallback(async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      const access = data && typeof data === "object" ? data.access_token : null;
      setToken(access || null);
    } catch (e) {
      // propagate with normalized message if present
      throw e;
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    try {
      await apiRegister(username, email, password);
    } catch (e) {
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      login,
      logout,
      register,
    }),
    [token, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /**
   * Hook to access auth context.
   * @returns {AuthContextType}
   */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

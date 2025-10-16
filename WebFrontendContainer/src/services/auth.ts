import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin, logout as apiLogout, register as apiRegister, setAuthToken } from "./api";

/** PUBLIC_INTERFACE
 * AuthContextType describes what the AuthProvider exposes to consumers.
 */
export type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  // PUBLIC_INTERFACE
  login: (email: string, password: string) => Promise<void>;
  // PUBLIC_INTERFACE
  logout: () => Promise<void>;
  // PUBLIC_INTERFACE
  register: (username: string, email: string, password: string) => Promise<void>;
};

// Use a short alias name to prevent any TSX namespace confusion.
const AuthCtx = createContext<AuthContextType | undefined>(undefined);

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: React.ReactNode }) {
  /** React Provider for authentication state and actions. */
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    const access = (data as any)?.access_token || (data as any)?.token;
    setToken(access || null);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    await apiRegister(username, email, password);
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setToken(null);
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      login,
      logout,
      register,
    }),
    [token, login, logout, register]
  );

  return React.createElement(AuthCtx.Provider, { value }, children);
}

// PUBLIC_INTERFACE
export function useAuth(): AuthContextType {
  /** Hook to access auth context. */
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

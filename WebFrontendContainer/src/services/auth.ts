import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin, logout as apiLogout, register as apiRegister, setAuthToken } from "./api";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  // PUBLIC_INTERFACE
  login: (email: string, password: string) => Promise<void>;
  // PUBLIC_INTERFACE
  logout: () => Promise<void>;
  // PUBLIC_INTERFACE
  register: (username: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    const access = data?.access_token || data?.token;
    setToken(access || null);
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    await apiRegister(username, email, password);
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
  /** Hook to access auth context. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

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

const AuthContext: React.Context<AuthContextType | undefined> = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await apiLogin(email, password) as { access_token?: string; expires_in?: number } | any;
      const access = (data && typeof data === "object" && "access_token" in data ? (data.access_token as string | undefined) : undefined) || null;
      setToken(access || null);
    } catch (e) {
      throw e;
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
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

  return React.createElement(AuthContext.Provider, { value }, children);
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

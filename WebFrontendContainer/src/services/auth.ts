import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Stubbed authentication context for no-auth mode compatibility.
 * These functions do nothing but maintain the API surface for any remaining references.
 */

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
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    // Stubbed - no-auth mode doesn't use login
    console.warn('Login called in no-auth mode - this is a no-op');
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    // Stubbed - no-auth mode doesn't use registration
    console.warn('Register called in no-auth mode - this is a no-op');
  }, []);

  const logout = useCallback(async () => {
    // Stubbed - no-auth mode doesn't use logout
    console.warn('Logout called in no-auth mode - this is a no-op');
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: false, // Always false in no-auth mode
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
  /** Hook to access auth context (stubbed in no-auth mode). */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Return a default context if not wrapped in provider
    return {
      token: null,
      isAuthenticated: false,
      login: async () => console.warn('Login not available in no-auth mode'),
      logout: async () => console.warn('Logout not available in no-auth mode'),
      register: async () => console.warn('Register not available in no-auth mode'),
    };
  }
  return ctx;
}

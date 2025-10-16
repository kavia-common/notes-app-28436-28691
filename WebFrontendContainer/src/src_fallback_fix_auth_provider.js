import React from "react";
import { AuthProvider as RealAuthProvider } from "./services/auth.jsx";

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Wrapper to ensure an AuthProvider exists even if JS/TS module resolution differs. */
  return <RealAuthProvider>{children}</RealAuthProvider>;
}

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../services/auth.jsx";

/**
 * PRIVATE ROUTE
 * Renders nested routes only if authenticated; otherwise redirects to /login
 */
// PUBLIC_INTERFACE
export default function PrivateRoute() {
  /** Protects private routes by checking authentication status. */
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

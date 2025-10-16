import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/auth.jsx";

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar" style={{ display: "flex", gap: 16, padding: 16, borderBottom: "1px solid var(--border-color)" }}>
      <Link to="/notes" className="App-link" style={{ textDecoration: "none" }}>
        Notes
      </Link>
      <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="App-link">Login</Link>
            <Link to="/register" className="App-link">Register</Link>
          </>
        ) : (
          <>
            <Link to="/notes/new" className="App-link">New Note</Link>
            <button onClick={handleLogout} className="theme-toggle" style={{ padding: "6px 10px" }}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;

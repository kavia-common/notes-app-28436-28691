import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../services/auth.jsx";

/**
 * Application header with authentication-aware navigation.
 * Shows login/register for guests, logout for authenticated users.
 */
const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (e) {
      // Logout errors are not critical
      window.location.href = "/login";
    }
  };

  return (
    <header className="navbar" role="banner" aria-label="Application Header">
      <div className="container nav-inner">
        <Link to={isAuthenticated ? "/notes" : "/"} className="brand" aria-label="Go to home">
          Notes App
        </Link>
        
        {isAuthenticated && (
          <nav aria-label="Primary">
            <div className="row">
              <NavLink to="/notes" className="App-link">All Notes</NavLink>
            </div>
          </nav>
        )}
        
        <div className="spacer" />
        
        <div className="row">
          {isAuthenticated ? (
            <>
              <Link to="/notes/new" className="btn btn-primary" aria-label="Create a new note">
                New Note
              </Link>
              <button onClick={handleLogout} className="btn" aria-label="Logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn" aria-label="Login">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" aria-label="Register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

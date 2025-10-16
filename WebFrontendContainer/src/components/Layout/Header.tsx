import React from "react";
import { Link } from "react-router-dom";

/**
 * Simple header without authentication controls.
 */
const Header: React.FC = () => {
  return (
    <nav className="navbar" style={{ display: "flex", gap: 16, padding: 16, borderBottom: "1px solid var(--border-color)" }}>
      <Link to="/notes" className="App-link" style={{ textDecoration: "none" }}>
        Notes
      </Link>
      <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        <Link to="/notes/new" className="App-link">New Note</Link>
      </div>
    </nav>
  );
};

export default Header;

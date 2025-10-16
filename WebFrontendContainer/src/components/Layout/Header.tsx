import React from "react";
import { Link, NavLink } from "react-router-dom";

/**
 * Simple public header (no auth) with accessible navigation and primary CTA.
 */
const Header: React.FC = () => {
  return (
    <header className="navbar" role="banner" aria-label="Application Header">
      <div className="container nav-inner">
        <Link to="/notes" className="brand" aria-label="Go to notes home">Notes</Link>
        <nav aria-label="Primary">
          <div className="row">
            <NavLink to="/notes" className="App-link">All Notes</NavLink>
          </div>
        </nav>
        <div className="spacer" />
        <div className="row">
          <Link to="/notes/new" className="btn btn-primary" aria-label="Create a new note">New Note</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

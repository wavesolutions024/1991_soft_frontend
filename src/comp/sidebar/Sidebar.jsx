import React from "react";
import "../sidebar/Sidebar.scss";
import logo from "../../assets/1991_tattoo_logo.png";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  return (
    <div>
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">
            <img src={logo} alt="1991 Tattoo Logo" />
          </span>
          <div>
            <p>1991 </p>
            <small>Tattoo</small>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>
            Dashboard
          </Link>

          <Link to="/client-form" className={location.pathname === "/client-form" ? "active" : ""}>
            Client Management
          </Link>

          <Link to="/appointment-form" className={location.pathname === "/appointment-form" ? "active" : ""}>
            Appointment Booking
          </Link>

          <Link to="/artists">Artist Management</Link>
          <Link to="/artists">Artists</Link>
          <Link to="/consultants">Consultant</Link>
        </nav>

        <button className="logout">Log Out</button>
      </aside>
    </div>
  );
};

export default Sidebar;

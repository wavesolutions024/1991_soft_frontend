import "../sidebar/Sidebar.scss";
import logo from "../../assets/1991_tattoo_logo.png";
import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../Context";

const Sidebar = () => {
  const location = useLocation();
  const { userData } = useContext(UserContext);

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

          <Link
            to="/cleints"
            className={location.pathname === "/cleints" ? "active" : ""}
          >
            Client Management
          </Link>

          <Link
            to="/appointment-form"
            className={
              location.pathname === "/appointment-form" ? "active" : ""
            }
          >
            Appointment Booking
          </Link>

          {userData?.role === "Admin" && (
            <Link
              to="/artists"
              className={
                location.pathname === "/artists" ? "active" : ""
              }
            >
              Artist Management
            </Link>
          )}
         

          <Link
            to="/consent"
            className={location.pathname === "/consent" ? "active" : ""}
          >
            Consent
          </Link>
        </nav>

        <button className="logout">Log Out</button>
      </aside>
    </div>
  );
};

export default Sidebar;

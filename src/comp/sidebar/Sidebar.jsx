import "../sidebar/Sidebar.scss";
import logo from "../../assets/1991_tattoo_logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../Context";
import { api } from "../../Api";

const Sidebar = () => {
  const location = useLocation();
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await api.get("api/franchies/logout");
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div>
      <aside className="sidebar">
        <div class="top">
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
            {userData?.role === "Admin" && (
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                Dashboard
              </Link>
            )}

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
                className={location.pathname === "/artists" ? "active" : ""}
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
            {userData?.role === "Admin" && (
              <Link
                to="/logs"
                className={location.pathname === "/logs" ? "active" : ""}
              >
                Logs
              </Link>
            )}
          </nav>
        </div>
        <div class="bottom">
          <p>{userData?.username}</p>
          <button onClick={logout} className="logout">
            Log Out
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;

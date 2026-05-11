import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.scss";
import Sidebar from "./comp/sidebar/Sidebar";
import Dashboard from "./comp/dashboard/Dashboard";
import ClientForm from "./comp/client form/ClientForm";
import AppointmentForm from "./comp/appointment form/AppointmentForm";
import ArtistManagement from "./comp/artist management/ArtistManagement";
import Artists from "./comp/artists/Artists";
import ConsultantForm from "./comp/consultant form/ConsultantForm";
import Login from "./pages/login/Login";

function App() {
  const AppContent = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
      <div className={`app ${isLoginPage ? 'login-layout' : ''}`}>
        {!isLoginPage && <Sidebar />}
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/client-form" element={<ClientForm/>} />
          <Route path="/appointment-form" element={<AppointmentForm/>} />
          <Route path="/artist-management" element={<ArtistManagement/>} />
          <Route path="/artists" element={<Artists/>} />
          <Route path="/consultants" element={<ConsultantForm/>} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </div>
    );
  };

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

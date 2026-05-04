import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Sidebar from "./comp/sidebar/Sidebar";
import Dashboard from "./comp/dashboard/Dashboard";
import ClientForm from "./comp/client form/ClientForm";
import AppointmentForm from "./comp/appointment form/AppointmentForm";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/client-form" element={<ClientForm/>} />
          <Route path="/appointment-form" element={<AppointmentForm/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

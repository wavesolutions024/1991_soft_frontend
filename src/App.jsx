import { Route, Routes } from "react-router-dom";
import "./App.scss";
import ValidateRoute from "../src/Validate";
import { routes } from "./Pages";

import { useContext } from "react";
import { UserContext } from "./Context";
import { ToastContainer } from "react-toastify";
import Loader from "./comp/Loader/Loader";
function App() {

  const { loader } = useContext(UserContext);
  return (
    <>
      <ToastContainer />
   { loader &&  <Loader/>}
  
      <Routes>
        {routes.map((item, index) => (
          <Route
            key={index}
            path={item.path}
            element={
              item.isPublic ? (
                <item.element />
              ) : (
                <ValidateRoute admin={item.admin}>
                  <item.element />
                </ValidateRoute>
              )
            }
          />
        ))}
      </Routes>
    </>
  );
}

export default App;

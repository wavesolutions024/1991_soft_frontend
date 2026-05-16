import { useContext } from "react";
import { UserContext } from "./Context";
import { Navigate } from "react-router-dom";

const ValidateRoute = ({ children, admin = false }) => {
  const { userData, loader } = useContext(UserContext);



  if (loader) {
    return <div>loading....</div>;
  }

  if(!userData){
    return <Navigate to="/login" replace />
  }


  if(admin  && userData?.role !== "Admin"){
    return <Navigate to="/404" replace />
  }




return children;
};


export default ValidateRoute
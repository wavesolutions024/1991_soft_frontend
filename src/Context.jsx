import { createContext, useEffect, useState } from "react";
import { api } from "./Api";


export const UserContext = createContext(null);

const ContextProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const isLoggedin = localStorage.getItem("isLoggedIn");
    const [loader,setLoader] = useState(true);




      const franchiesData = async ()=>{
        try {
            setLoader(true)
            const response = await api.get(`api/franchies/getFranchiesData`);
            if(response?.status === 200){
            
                setUserData(response?.data?.data)
            }
            
        } catch (error) {
            console.log(error)
        }finally{
            setLoader(false)
        }
      }

      useEffect(()=>{
        if(isLoggedin){
        franchiesData(isLoggedin)
        }else{
            setLoader(false)
        }
      },[isLoggedin]);


    
    return (
        <UserContext.Provider value={{ userData,franchiesData,loader,setLoader }}>
            {children}
        </UserContext.Provider>
    );
};

export default ContextProvider;
import { createContext, useState } from "react";
import { api } from "./Api";


export const UserContext = createContext(null);

const ContextProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

      const franchiesData = async ()=>{
        try {
            const response = await api.get(`api/franchies/getFranchiesData`);
            console.log(response)
        } catch (error) {
            console.log(error)
        }
      }
    
    return (
        <UserContext.Provider value={{ userData, setUserData,franchiesData }}>
            {children}
        </UserContext.Provider>
    );
};

export default ContextProvider;
import { createContext , useContext, useEffect, useState } from "react";

const userStateContext = createContext();  // gloal storage 


export const UserStateProvider = ({children}) =>{

    const [user , setUser] = useState(Boolean(localStorage.getItem("token")));

    return (
        // every component can use user and setUser 
        <userStateContext.Provider value = {{user , setUser}}>
        {children}
        </userStateContext.Provider>
    )
}
//custom hook 
export const useUser = ()=> useContext(userStateContext);
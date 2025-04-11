import { createContext , useContext, useEffect, useState } from "react";

const userStateContext = createContext();  // gloal storage 


export const UserStateProvider = ({children}) =>{
    
    const [user , setUser] = useState(()=>{
        const storedUser = localStorage.getItem("user") ;
        return storedUser? JSON.parse(storedUser) : null ; 
    });

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    return (
        // every component can use user and setUser 
        <userStateContext.Provider value = {{user , setUser}}>
        {children}
        </userStateContext.Provider>
    )
}
//custom hook 
export const useUser = ()=> useContext(userStateContext);
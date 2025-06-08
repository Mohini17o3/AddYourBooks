import { createContext , useContext, useEffect, useState } from "react";

const userStateContext = createContext();  // gloal storage 


export const UserStateProvider = ({children}) =>{
    
    const [user , setUser] = useState(null);
    const [accessToken , setAccessToken]  = useState(null) ;
    const [loading, setLoading] = useState(true);

  const url = import.meta.env.VITE_EXPRESS_BACKEND_URL ; 

    useEffect(() => {
       const token = sessionStorage.getItem("accessToken") ;
       const storedUser = sessionStorage.getItem("user");

       if(token) {
        setAccessToken(token) ;
        setLoading(false) ;
       }
       if(storedUser) {
        try{
            setUser(JSON.parse(storedUser)) ;
        }catch {
            setUser(null) ;
        }
       }
       else {
        fetch(`${url}/refresh-token` , {
            method : "POST" , 
            credentials : "include" , 
        })
        .then(res => {
            if(!res.ok) {
                throw new Error("Refresh failed") ;
            }
           return res.json() ; 
        })
        .then(data => {
            sessionStorage.setItem("accessToken" , data.token ) ;
            sessionStorage.setItem("user" , JSON.stringify(data.user)) ;
            setAccessToken(data.token) ;
            setUser(data.user) ;
            setLoading(false) ;
        })
        .catch(()=>{
            setAccessToken(null) ;
            setUser(null) ;
            setLoading(false) ;
        })
       }
    }, []);

    useEffect(()=>{
        let refreshTimer ;

        if(accessToken) {
            refreshTimer = setTimeout(() => {
               fetch(`${url}/refresh-token` , {
                method : "POST" , 
                credentials : "include" , 
               })
               .then((res)=>{
                if(!res.ok) {
                throw new Error("Refresh failed"); 
                }
                return res.json() ;
               })
               .then((data)=> {
                sessionStorage.setItem("accessToken" , data.token) ;
                sessionStorage.setItem("user" , JSON.stringify(data.user)) ;
                setAccessToken(data.token) ;
                setUser(data.user) ;
               }) 
               .catch(()=>{
                sessionStorage.clear() ;
                setAccessToken(null) ;
                setUser(null);
               })
            } , 55 * 60 * 1000) ; 
        }
        return () => {
            if(refreshTimer) {
                clearTimeout (refreshTimer) ;
            }
        }
      
    } , [accessToken]) ;

    return (
        // every component can use user and setUser 
        <userStateContext.Provider value = {{user , setUser , accessToken , setAccessToken , loading}}>
        {children}
        </userStateContext.Provider>
    )
}
//custom hook 
export const useUser = ()=> useContext(userStateContext);
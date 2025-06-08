import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./userStateContext";

function Login(){

    const url = import.meta.env.VITE_EXPRESS_BACKEND_URL ; 
    const navigate = useNavigate() ;
    const {setUser, setAccessToken} = useUser() ;
    const[error , setErrorMessage] = useState("");

    const[formData , setFormData] = useState({
        email : "" , 
        password : "",
    });

    const [loading , setLoading] = useState(false) ;
  
    const handleChange = (e)=>{
         const {id , value} = e.target ;
         setFormData((prev) => ({
            ...prev , 
            [id] : value, 
         }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault() ;
        setLoading(true) ;
        setErrorMessage("");
        try {
            const response = await fetch(`${url}/login` , {
                method : "POST" , 
                headers : {
                    "Content-type": "application/json"
                } , 
                body : JSON.stringify(formData), 
                credentials : "include" , 
            })  ;

            if(!response.ok) {
                const err = await response.json() ;
                throw new Error(err.message || "Login failed , please check your email and password") ;
            }
            
            const data = await response.json() ;
            const { token, user } = data;

            console.log("login sucsess");
            sessionStorage.setItem("accessToken" , token) ; 
            sessionStorage.setItem("user" , JSON.stringify(user))
;            setUser(user);
            setAccessToken(token) ;
            setLoading(false);
            navigate('/addBooks') ;

        }catch(e) {
            console.error(e) ;
            setErrorMessage(e.message || "Something went wrong , refresh and try again with correct credentials") ;
            setLoading(false);

        }
    }

    if(loading){
        return <div className="relative flex justify-center items-center text-white text-6xl font-bold font-zeyada"> Loading .. </div>
       }
   

 return (
    <div className="m-6 p-4 flex flex-col items-center justify-center">
   {error && (
    <p className="text-red-500 text-sm mt-2">{error}</p>
)} 
        <p className="font-bold m-4 text-white"> Not a user ? <Link to="/SignUp"> Sign Up</Link></p>
    <form className="flex flex-col border p-4 m-2 bg-opacity-30 rounded-md md:w-1/3 md:h-1/2 font-bold md:text-xl text-white" onSubmit={handleSubmit}>
        <label>Email : </label>
        <input className="rounded-md h-10 p-4 m-2 text-black"  id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required/>
        <label>Password</label>
        <input className="rounded-md h-10 p-4 m-2 text-black"  type="password" id="password" placeholder="Enter your password" value={formData.password}  onChange={handleChange} required />

        <input type="submit" className="bg-violet-400 lg:h-12 lg:w-24 lg:ml-40 lg:mt-6 sm:w-20 sm:ml-20 rounded-md hover:violet-500 hover:text-white cursor-pointer transition p-2"/>    
    </form>
    </div>
 );


}


export default Login ;

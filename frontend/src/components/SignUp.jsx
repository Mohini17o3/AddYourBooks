import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUp(){

    const url = import.meta.env.VITE_EXPRESS_BACKEND_URL ; 
    const navigate =  useNavigate() ;

    const[formData , setFormData] = useState({
        name : "" ,
        email : "" , 
        password : "",
    });
  const [loading , setLoading]  = useState(false);
    const handleChange = (e)=>{
         const {id , value} = e.target ;
         setFormData((prev) => ({
            ...prev , 
            [id] : value, 
         }));
    }


    const handleSubmit = async (e) => {
        e.preventDefault() ;
        setLoading(true);
        try {
            const response = await fetch(`${url}/register` , {
                method : "POST" , 
                headers : {
                    "Content-type": "application/json"
                } , 
                body : JSON.stringify(formData), 
            })  ;

            if(!response.ok) {
                throw new Error("Login failed") ;
            }

            const data = await response.json() ;
            console.log("register sucsess");
            setLoading(false) ;
            navigate("/login");

        }catch(e) {
            console.error(e) ;
        }
    }

    
    if(loading){
        return <div className="relative flex justify-center items-center text-white text-6xl font-bold font-zeyada"> Loading .. </div>
       }

 return (
    <div className="m-6 p-4 flex flex-col items-center justify-center">
    <form className="flex flex-col border p-4 m-2 bg-opacity-30 rounded-md md:w-1/3 md:h-1/2 font-bold md:text-xl text-white" onSubmit={handleSubmit}>
        <label>Name : </label>
        <input className="rounded-md h-10 p-4 m-2 text-black"  id="name" type="text" placeholder="Enter your name" value={formData.name} onChange={handleChange} required/>
        <label>Email : </label>
        <input className="rounded-md h-10 p-4 m-2 text-black"  id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required/>
        <label>Password</label>
        <input className="rounded-md h-10 p-4 m-2 text-black"  type="password" id="password" placeholder="Set your password" value={formData.password}  onChange={handleChange} required />

        <input type="submit" className="bg-violet-400 lg:h-12 lg:w-24 lg:ml-40 lg:mt-6 sm:w-20 sm:ml-20 rounded-md hover:violet-500 hover:text-white cursor-pointer transition p-2"/>    
    </form>
    <p className="font-bold m-4 text-white"> Already a user ? <Link to="/login"> Login</Link></p>
    </div>
 );


}


export default SignUp ;
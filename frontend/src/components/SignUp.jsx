import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

function SignUp(){
    const[formData , setFormData] = useState({
        name : "" , 
        email : "" , 
        password : "",
    });
  
    const handleChange = (e)=>{
         const {id , value} = e.target ;
         setFormData((prev) => ({
            ...prev , 
             [id] :value , 
         }));
    }


    const handleSubmit = (e) => {
        e.prevent.default() ;
        alert("submitted");
    }

 return (
    <div className="m-6 p-4 flex flex-col items-center justify-center">
    <form className="flex flex-col border p-4 m-2 bg-opacity-30 bg-violet-500 rounded-md w-1/3 h-1/2 font-bold text-xl text-violet-900">
        <label>Name :</label>
        <input className="rounded-md h-10 p-4 m-2" id="name" type="text" placeholder="John Doe" value={formData.name} handleChange={()=>{handleChange}} required/>
        <label>Email : </label>
        <input className="rounded-md h-10 p-4 m-2"  id="email" type="text" placeholder="Enter your email" value={formData.email} handleChange={()=>{handleChange}} required/>
        <label>Password</label>
        <input className="rounded-md h-10 p-4 m-2"  type="password" id="password" placeholder="Set your password" value={formData.password}  handleChange={()=>{handleChange}} required />

        <input type="submit" className="bg-violet-400 h-12 w-24 ml-40 mt-6 rounded-md hover:violet-500 hover:text-white cursor-pointer transition p-2" handleChange = {()=> {handleSubmit}}/>    
    </form>
    <p className="font-bold m-4"> Already a user ? <Link to="/login">Login here</Link></p>
    </div>
 );


}


export default SignUp ;
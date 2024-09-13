import React from 'react';
import Navbar from './components/Navbar';
import { Loader } from '@react-three/drei';
import { Outlet } from 'react-router-dom';




const App = () => {
    return (
        <>    
        <Loader />    
        <Navbar />      
         <Outlet />       
</>
    );
};

export default App;

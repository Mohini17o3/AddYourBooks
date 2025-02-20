import React from 'react';
import Navbar from './components/Navbar';
import { Loader } from '@react-three/drei';
import { Outlet } from 'react-router-dom';
import { UserStateProvider } from './components/userStateContext';



const App = () => {
    return (
        <>    
        <UserStateProvider>
        <Loader />    
        <Navbar />      
         <Outlet /> 
         </UserStateProvider>
</>
    );
};

export default App;

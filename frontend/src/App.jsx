import React from 'react';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import { Outlet } from 'react-router-dom';
const App = () => {
    return (
        <div>
            <Navbar />
            <main>
                <div>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default App;

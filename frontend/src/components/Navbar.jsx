import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
<nav className="sticky top-0 z-10 bg-white backdrop-filter backdrop-blur-lg bg-opacity-20 firefox:bg-opacity-90 border-b border-gray-200">
<div className="max-w-5xl mx-auto px-4">
    <div className="flex items-center justify-between h-16 gap-6">
      <div className="flex space-x-4 text-gray-900">
        <Link to="/" className="text-headingFont text-lg ">Home</Link>
        <Link to="/books" className="text-headingFont text-lg">Book List</Link>
        <Link to="/analytics" className="ml-4 text-headingFont text-lg">Analytics</Link>
        </div>
    </div>
  </div>
</nav>

    );
};

export default Navbar;  

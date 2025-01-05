import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
<nav className="sticky top-0 z-10 backdrop-filter backdrop-blur-lg bg-opacity-15 firefox:bg-opacity-90 border-b border-gray-200">
<div className="max-w-5xl mx-auto px-4 sm:px-2">
    <div className="flex items-center justify-between h-16 gap-6">
      <div className="flex space-x-4 ">
        <Link to="/" className="text-violet-900 md:text-lg ">Home</Link>
        <Link to="/searchBar" className="text-violet-900 md:text-lg ">Search Books</Link>
        <Link to="/addBooks" className="ml-4 text-violet-900 md:text-lg">Add Books</Link>
        <Link to="/books" className="text-violet-900 md:text-lg">Book List</Link>
        <Link to="/analytics" className="ml-4 text-violet-900 md:text-lg">Analytics</Link>
 
        </div>
        <div>
          <button>
            Sign Up
          </button>
        </div>
    </div>
  </div>
</nav>

    );
};

export default Navbar;  

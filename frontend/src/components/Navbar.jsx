import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky fixed top-0 z-230 lg:flex lg:items-center lg:justify-center mb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-2 backdrop-filter backdrop-blur-lg bg-opacity-15 firefox:bg-opacity-90 border-b border-gray-200">
        <div className="flex items-center justify-between h-16">
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-violet-200 md:text-lg hover:text-violet-600">Home</Link>
            <Link to="/searchBar" className="text-violet-200 md:text-lg hover:text-violet-600">Search</Link>
            <Link to="/addBooks" className="text-violet-200 md:text-lg hover:text-violet-600">Add</Link>
            <Link to="/books" className="text-violet-200 md:text-lg hover:text-violet-600">Book List</Link>
            <Link to="/topBooks" className="text-violet-200 md:text-lg hover:text-violet-600">Top Books</Link>
            <Link to="/analytics" className="text-violet-200 md:text-lg hover:text-violet-600">Analytics</Link>
          </div>

          {/* Hamburger Button for Mobile */}
          <button 
            className="md:hidden text-violet-900 focus:outline-none "
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>
              {/* Mobile Menu */}
              {isOpen && (
          <div className="md:hidden fixed z-100 flex flex-col items-center bg-white border-t border-gray-200 py-4 shadow-md w-56 rounded-md ">
            <Link to="/" className="py-2 text-violet-900 text-lg hover:text-violet-600" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/searchBar" className="py-2 text-violet-900 text-lg hover:text-violet-600" onClick={() => setIsOpen(false)}>Search</Link>
            <Link to="/addBooks" className="py-2 text-violet-900 text-lg hover:text-violet-600" onClick={() => setIsOpen(false)}>Add</Link>
            <Link to="/books" className="py-2 text-violet-900 text-lg hover:text-violet-600" onClick={() => setIsOpen(false)}>Book List</Link>
            <Link to="/topBooks" className="py-2 text-violet-900 text-lg hover:text-violet-600" onClick={() => setIsOpen(false)}>Top Books</Link>
            <Link to="/analytics" className="py-2 text-violet-900 text-lg hover:text-violet-600" onClick={() => setIsOpen(false)}>Analytics</Link>
          </div>
        )}
    </nav>
  );
};

export default Navbar;

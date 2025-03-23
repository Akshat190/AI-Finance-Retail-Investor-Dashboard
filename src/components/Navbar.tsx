import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, User, Search, BookOpen } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <BarChart2 className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">AI Investor</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/screener" className="flex items-center text-gray-600 hover:text-indigo-600">
              <Search className="h-5 w-5" />
              <span className="ml-1">Screener</span>
            </Link>
            <Link to="/portfolio" className="flex items-center text-gray-600 hover:text-indigo-600">
              <BookOpen className="h-5 w-5" />
              <span className="ml-1">Portfolio</span>
            </Link>
            <Link to="/profile" className="flex items-center text-gray-600 hover:text-indigo-600">
              <User className="h-5 w-5" />
              <span className="ml-1">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
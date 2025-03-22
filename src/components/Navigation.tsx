import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const links = [
    // { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Screener', path: '/screener' },
    { name: 'Investments', path: '/investments' },
    { name: 'Chat', path: '/chat' },
    { name: 'Settings', path: '/settings' },
    { name: 'Profile', path: '/profile' },
  ];
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">FinanceAI</Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    location.pathname === link.path
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Hello, {user.displayName || user.email}</span>
                <button
                  onClick={logout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${
                location.pathname === link.path
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <div className="space-y-1">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-gray-800">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <Link
                to="/login"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 
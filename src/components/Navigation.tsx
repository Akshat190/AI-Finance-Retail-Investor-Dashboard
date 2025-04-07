import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  BarChart2, 
  Briefcase, 
  TrendingUp, 
  Search, 
  DollarSign, 
  MessageSquare, 
  User,
  ChevronDown,
  Menu,
  X,
  Brain
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Group navigation items into logical categories
  const navGroups = [
    {
      id: 'main',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <BarChart2 className="h-4 w-4" /> },
        { name: 'Portfolio', path: '/portfolio', icon: <Briefcase className="h-4 w-4" /> }
      ]
    },
    {
      id: 'analysis',
      label: 'Analysis',
      items: [
        { name: 'Investment Advisor', path: '/investment-advisor', icon: <Brain className="h-4 w-4" /> },
        { name: 'Market Predictions', path: '/market-predictions', icon: <TrendingUp className="h-4 w-4" /> },
        { name: 'Screener', path: '/screener', icon: <Search className="h-4 w-4" /> }
      ]
    },
    {
      id: 'finance',
      label: 'Finance',
      items: [
        { name: 'Investments', path: '/investments', icon: <DollarSign className="h-4 w-4" /> }
      ]
    },
    {
      id: 'assistance',
      label: 'Assistance',
      items: [
        { name: 'Chat', path: '/chat', icon: <MessageSquare className="h-4 w-4" /> },
        { name: 'AI Demo', path: '/ai-demo', icon: <Brain className="h-4 w-4" /> },
        // { name: 'AI Tester', path: '/ai-tester', icon: <Brain className="h-4 w-4" /> }
      ]
    }
  ];
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleDropdown = (id: string) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      // Clear user from context
      setUser(null);
      
      // Redirect to login page
      navigate('/login');
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };
  
  return (
    <nav className="bg-white shadow-md relative z-50">
      {/* Top gradient accent line */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BarChart2 className="h-7 w-7 text-indigo-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FinanceAI
              </span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center">
            {/* Main nav items without dropdown */}
            <div className="flex space-x-1 mr-4">
              {navGroups[0].items.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    location.pathname === link.path
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                >
                  {link.icon}
                  <span className="ml-1.5">{link.name}</span>
                </Link>
              ))}
            </div>
            
            {/* Dropdown menu items */}
            <div className="flex space-x-1">
              {navGroups.slice(1).map((group) => (
                <div key={group.id} className="relative">
                  <button
                    className={`${
                      activeDropdown === group.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                    } px-3 py-2 rounded-md text-sm font-medium flex items-center`}
                    onClick={() => toggleDropdown(group.id)}
                  >
                    <span>{group.label}</span>
                    <ChevronDown className={`ml-1 h-4 w-4 transform transition-transform ${activeDropdown === group.id ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown content */}
                  {activeDropdown === group.id && (
                    <div className="absolute right-0 mt-1 w-56 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {group.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`${
                            location.pathname === item.path
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                          } block px-4 py-2 text-sm flex items-center`}
                          onClick={() => setActiveDropdown(null)}
                        >
                          {item.icon}
                          <span className="ml-2">{item.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* User account section */}
          <div className="hidden lg:flex lg:items-center">
            {user ? (
              <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
                <Link 
                  to="/profile" 
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/profile'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span className="ml-1.5">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-1.5">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* Main navigation items */}
          {navGroups.map((group) => (
            <div key={group.id} className="py-1">
              {group.label && (
                <div className="px-3 py-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                  {group.label}
                </div>
              )}
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    location.pathname === item.path
                      ? 'bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700'
                      : 'border-l-4 border-transparent text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  } block px-3 py-2 text-base font-medium flex items-center`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
        
        {/* Mobile user section */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <div className="space-y-1">
              <div className="px-4 py-2">
                <p className="text-sm font-medium text-gray-500">Signed in as</p>
                <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
              </div>
              <Link
                to="/profile"
                className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span className="ml-3">Profile</span>
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 flex items-center"
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 space-y-2">
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 text-base font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block w-full text-center px-4 py-2 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md hover:from-indigo-700 hover:to-purple-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 
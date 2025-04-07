import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from './Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, tokenExpired, refreshToken } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Attempt to refresh token on route change if user is logged in
    if (user && !loading) {
      refreshToken();
    }
  }, [location.pathname, user]);

  // If authentication is still loading, show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="large" />
      </div>
    );
  }

  // If token is expired, redirect to login
  if (tokenExpired) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated, render the children components
  return <>{children}</>;
}; 
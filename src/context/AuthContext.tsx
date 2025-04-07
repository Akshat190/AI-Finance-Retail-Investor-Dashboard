import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, refreshTokenIfNeeded, isTokenExpired } from '../utils/supabaseClient';
import { toast } from 'react-hot-toast';
import { AuthError } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  tokenExpired: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpired, setTokenExpired] = useState(false);
  
  // Check token expiration every minute
  useEffect(() => {
    const checkTokenInterval = setInterval(async () => {
      if (user) {
        const expired = await isTokenExpired();
        if (expired) {
          try {
            const { error } = await supabase.auth.refreshSession();
            if (error) {
              console.error('Token refresh failed:', error);
              setTokenExpired(true);
              toast.error('Your session has expired. Please login again.');
              await logout();
            } else {
              setTokenExpired(false);
            }
          } catch (err) {
            console.error('Error during token refresh check:', err);
          }
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(checkTokenInterval);
  }, [user]);

  useEffect(() => {
    // Check active sessions and set the user
    const getSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        if (session?.user) {
          // Check if token is expired or about to expire
          const expired = await isTokenExpired();
          if (expired) {
            try {
              const { error: refreshError } = await supabase.auth.refreshSession();
              if (refreshError) {
                console.error('Session refresh failed:', refreshError);
                setTokenExpired(true);
                return;
              }
            } catch (refreshErr) {
              console.error('Unexpected error during session refresh:', refreshErr);
              return;
            }
          }
          
          setUser({
            id: session.user.id,
            email: session.user.email || ''
          });
          setTokenExpired(false);
        }
      } catch (err) {
        console.error('Unexpected error during session check:', err);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || ''
          });
          setTokenExpired(false);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      if (!error) {
        setTokenExpired(false);
      }
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (!error) {
        setTokenExpired(false);
      }
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setTokenExpired(false);
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setTokenExpired(false);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const refreshToken = async () => {
    try {
      setLoading(true);
      await refreshTokenIfNeeded();
      // If we reach here without errors, token is either refreshed or still valid
      setTokenExpired(false);
    } catch (error) {
      console.error('Token refresh error:', error);
      setTokenExpired(true);
      toast.error('Session expired. Please login again.');
      await logout();
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    setUser,
    logout,
    refreshToken,
    tokenExpired
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabaseClient';
import { GEMINI_API_KEY } from '../config/apiKeys';

interface GeminiContextType {
  apiKey: string;
  loading: boolean;
  error: string | null;
  refreshApiKey: () => Promise<void>;
}

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export const useGemini = () => {
  const context = useContext(GeminiContext);
  if (context === undefined) {
    throw new Error('useGemini must be used within a GeminiProvider');
  }
  return context;
};

export const GeminiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState<string>(GEMINI_API_KEY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApiKey = async () => {
    if (!user) {
      setApiKey(GEMINI_API_KEY);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_settings')
        .select('gemini_api_key, use_default_key')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        // If user has chosen to use their own key and it exists
        if (data.use_default_key === false && data.gemini_api_key) {
          setApiKey(data.gemini_api_key);
        } else {
          // Otherwise use the default key
          setApiKey(GEMINI_API_KEY);
        }
      } else {
        // No settings found, use default key
        setApiKey(GEMINI_API_KEY);
      }
    } catch (err: any) {
      console.error('Error fetching Gemini API key:', err);
      setError(err.message || 'Failed to fetch API key');
      // Fall back to default key
      setApiKey(GEMINI_API_KEY);
    } finally {
      setLoading(false);
    }
  };

  // Refresh the API key (can be called after settings are updated)
  const refreshApiKey = async () => {
    await fetchApiKey();
  };

  // Fetch API key when user changes
  useEffect(() => {
    fetchApiKey();
  }, [user]);

  const value = {
    apiKey,
    loading,
    error,
    refreshApiKey
  };

  return (
    <GeminiContext.Provider value={value}>
      {children}
    </GeminiContext.Provider>
  );
}; 
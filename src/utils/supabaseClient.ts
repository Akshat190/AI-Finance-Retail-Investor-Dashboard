import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single instance of the Supabase client with short JWT expiration
// Configure with 1 hour token expiration and automatic token refresh
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'implicit',
    // Short expiration time (1 hour) for better security
    storageKey: 'ai-investor-auth-token',
  }
});

// Function to check if token is expired or about to expire
export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return true;
    
    // Get expiry time from JWT token
    const expiresAt = data.session.expires_at;
    if (!expiresAt) return true;
    
    // Consider token as expired if it has less than 5 minutes of validity
    const currentTime = Math.floor(Date.now() / 1000);
    const fiveMinutesInSeconds = 5 * 60;
    
    return expiresAt < currentTime + fiveMinutesInSeconds;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

// Function to refresh token if needed
export const refreshTokenIfNeeded = async (): Promise<void> => {
  try {
    if (await isTokenExpired()) {
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing token:', error);
        // Force logout if refresh fails
        await supabase.auth.signOut();
      }
    }
  } catch (error) {
    console.error('Error in refreshTokenIfNeeded:', error);
  }
}; 
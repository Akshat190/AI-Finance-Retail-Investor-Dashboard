import { supabase } from './supabase';

/**
 * Ensures a user has settings in the database, creating default settings if needed
 * @param userId The user's ID
 * @returns The user settings object
 */
export async function ensureUserSettings(userId: string) {
  try {
    // First, check if settings already exist
    const { data: existingSettings, error: fetchError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle instead of single to avoid 406 error
    
    // If settings exist, return them
    if (existingSettings) {
      return existingSettings;
    }
    
    // If settings don't exist, create default settings
    const defaultSettings = {
      user_id: userId,
      theme: 'light',
      notification_enabled: true,
      currency: 'USD',
      risk_tolerance: 'moderate',
      investment_horizon: 'medium'
    };
    
    // Try to insert default settings
    const { data: newSettings, error: insertError } = await supabase
      .from('user_settings')
      .insert([defaultSettings])
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating default user settings:', insertError);
      
      // If there's a conflict (409), try to fetch the settings again
      if (insertError.code === '409' || insertError.code === '23505') {
        const { data: conflictSettings } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
        return conflictSettings || defaultSettings;
      }
      
      // Return default settings if we can't insert or fetch
      return defaultSettings;
    }
    
    return newSettings;
  } catch (error) {
    console.error('Exception in ensureUserSettings:', error);
    
    // Return default settings on any error
    return {
      user_id: userId,
      theme: 'light',
      notification_enabled: true,
      currency: 'USD',
      risk_tolerance: 'moderate',
      investment_horizon: 'medium'
    };
  }
}

/**
 * Ensures a user has a profile in the database, creating a default profile if needed
 * @param user The user object from Supabase auth
 * @returns The user profile object
 */
export async function ensureUserProfile(user: any) {
  try {
    // First, check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle(); // Use maybeSingle instead of single
    
    // If profile exists, return it
    if (existingProfile) {
      return existingProfile;
    }
    
    // If profile doesn't exist, create default profile
    const email = user.email;
    const defaultProfile = {
      id: user.id,
      email: email,
      username: email?.split('@')[0] || 'user',
      full_name: '',
      avatar_url: '',
      updated_at: new Date().toISOString()
    };
    
    // Try to insert default profile
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([defaultProfile])
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating default profile:', insertError);
      
      // If there's a conflict, try to fetch the profile again
      if (insertError.code === '409' || insertError.code === '23505') {
        const { data: conflictProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        return conflictProfile || defaultProfile;
      }
      
      // Return default profile if we can't insert or fetch
      return defaultProfile;
    }
    
    return newProfile;
  } catch (error) {
    console.error('Exception in ensureUserProfile:', error);
    
    // Return default profile on any error
    return {
      id: user.id,
      email: user.email,
      username: user.email?.split('@')[0] || 'user',
      full_name: '',
      avatar_url: '',
      updated_at: new Date().toISOString()
    };
  }
}

/**
 * Fetches a user's portfolio, returning sample data if none exists
 * @param userId The user's ID
 * @param sampleData Sample portfolio data to use if no real data exists
 * @returns The user's portfolio
 */
export async function getUserPortfolio(userId: string, sampleData: any[]) {
  try {
    // Try to fetch from the portfolio table
    const { data: portfolioData, error } = await supabase
      .from('portfolio')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching portfolio:', error);
      return sampleData;
    }
    
    if (portfolioData && portfolioData.length > 0) {
      return portfolioData;
    }
    
    return sampleData;
  } catch (error) {
    console.error('Exception in getUserPortfolio:', error);
    return sampleData;
  }
} 
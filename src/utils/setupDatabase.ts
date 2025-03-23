import { supabase } from '../lib/supabase';

export const setupProfilesTable = async () => {
  try {
    // Check if the profiles table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('profiles')
      .select('count(*)', { count: 'exact', head: true });
      
    if (tableCheckError) {
      console.error('Error checking profiles table:', tableCheckError);
      
      // Create the profiles table if it doesn't exist
      // Note: This would typically be done via Supabase migrations or SQL editor
      // This is a fallback for development purposes
      console.log('Attempting to create profiles table...');
      
      // You would need admin privileges to create tables
      // This is just for demonstration
      alert('Please create a "profiles" table in your Supabase dashboard with the following columns:\n\n' +
        '- id (uuid, primary key)\n' +
        '- created_at (timestamp with time zone, default: now())\n' +
        '- updated_at (timestamp with time zone)\n' +
        '- username (text)\n' +
        '- full_name (text)\n' +
        '- avatar_url (text)\n' +
        '- website (text)\n\n' +
        'Then set up RLS policies to allow authenticated users to access their own profiles.');
    } else {
      console.log('Profiles table exists');
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
}; 
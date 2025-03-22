import React, { useState, useEffect } from 'react';
import { User, Settings, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AISettings } from '../components/AISettings';
import { AITester } from '../components/AITester';
// import { ensureUserProfile, ensureUserSettings } from '../lib/supabaseHelpers';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { GEMINI_API_KEY } from '../config/apiKeys';

export const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    investmentStyle: 'Moderate',
    riskTolerance: 'Medium',
    username: '',
    website: '',
    avatarUrl: '',
    geminiApiKey: '',
    useDefaultKey: true,
    showApiKey: false
  });

  useEffect(() => {
    if (user) {
      getProfile();
      getSettings();
    }
  }, [user]);

  const getProfile = async () => {
    try {
      setLoading(true);
      
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setFormData({
          username: data.username || '',
          fullName: data.full_name || '',
          email: data.email || '',
          investmentStyle: data.investment_style || 'Moderate',
          riskTolerance: data.risk_tolerance || 'Medium',
          website: data.website || '',
          avatarUrl: data.avatar_url || '',
          geminiApiKey: data.gemini_api_key || '',
          useDefaultKey: data.use_default_key !== false,
          showApiKey: false
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const getSettings = async () => {
    try {
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('user_settings')
        .select('gemini_api_key, use_default_key')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching settings:', error);
      }

      if (data) {
        setFormData({
          ...formData,
          geminiApiKey: data.gemini_api_key || '',
          useDefaultKey: data.use_default_key !== false
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      if (!user) throw new Error('No user');

      const updates = {
        id: user.id,
        full_name: formData.fullName,
        investment_style: formData.investmentStyle,
        risk_tolerance: formData.riskTolerance,
        username: formData.username,
        website: formData.website,
        avatar_url: formData.avatarUrl,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(updates);

      if (error) {
        throw error;
      }

      // Also update settings
      await updateSettings();
      
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = async () => {
    try {
      if (!user) throw new Error('No user');

      // Check if settings record exists
      const { data: existingSettings } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (existingSettings) {
        // Update existing record
        const { error } = await supabase
          .from('user_settings')
          .update({ 
            gemini_api_key: formData.useDefaultKey ? null : formData.geminiApiKey,
            use_default_key: formData.useDefaultKey
          })
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('user_settings')
          .insert([{ 
            user_id: user.id, 
            gemini_api_key: formData.useDefaultKey ? null : formData.geminiApiKey,
            use_default_key: formData.useDefaultKey
          }]);
        
        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  const testGeminiApi = async () => {
    const apiKeyToTest = formData.useDefaultKey ? GEMINI_API_KEY : formData.geminiApiKey;
    
    if (!formData.useDefaultKey && !formData.geminiApiKey) {
      toast.error('Please enter an API key or use the default key');
      return;
    }
    
    try {
      setLoading(true);
      
      // Test the Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKeyToTest
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Hello, can you respond with 'API connection successful' if this works?"
                }
              ]
            }
          ]
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        toast.success('API connection successful!');
      } else {
        toast.error(`API test failed: ${data.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error testing API:', error);
      toast.error('Failed to test API connection');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center mb-6">
          <User className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={updateProfile}>
          <div className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Email cannot be changed. Contact support for assistance.
              </p>
            </div>

            <div>
              <label htmlFor="investmentStyle" className="block text-sm font-medium text-gray-700">
                Investment Style
              </label>
              <select
                id="investmentStyle"
                name="investmentStyle"
                value={formData.investmentStyle}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Conservative">Conservative</option>
                <option value="Moderate">Moderate</option>
                <option value="Aggressive">Aggressive</option>
                <option value="Value">Value Investing</option>
                <option value="Growth">Growth Investing</option>
              </select>
            </div>

            <div>
              <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-700">
                Risk Tolerance
              </label>
              <select
                id="riskTolerance"
                name="riskTolerance"
                value={formData.riskTolerance}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700">
                Avatar URL
              </label>
              <input
                type="url"
                id="avatarUrl"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Gemini AI Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="default-key"
                    name="api-key-option"
                    type="radio"
                    checked={formData.useDefaultKey}
                    onChange={() => setFormData(prev => ({ ...prev, useDefaultKey: true }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    disabled={loading}
                  />
                  <label htmlFor="default-key" className="ml-2 block text-sm font-medium text-gray-700">
                    Use default Gemini API key (recommended)
                  </label>
                </div>
                
                {formData.useDefaultKey && (
                  <div className="ml-6 mb-4 p-3 bg-green-50 rounded-md border border-green-100">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-green-800">Default API key is configured and ready to use</span>
                    </div>
                    <p className="mt-1 text-xs text-green-700">
                      The application is already configured with a Gemini API key. You don't need to provide your own key.
                    </p>
                  </div>
                )}
                
                <div className="flex items-center">
                  <input
                    id="custom-key"
                    name="api-key-option"
                    type="radio"
                    checked={!formData.useDefaultKey}
                    onChange={() => setFormData(prev => ({ ...prev, useDefaultKey: false }))}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    disabled={loading}
                  />
                  <label htmlFor="custom-key" className="ml-2 block text-sm font-medium text-gray-700">
                    Use my own Gemini API key
                  </label>
                </div>
                
                {!formData.useDefaultKey && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-700">
                        Your Gemini API Key
                      </label>
                      <a 
                        href="https://ai.google.dev/tutorials/setup" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        Get a key
                      </a>
                    </div>
                    
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type={formData.showApiKey ? "text" : "password"}
                        name="geminiApiKey"
                        id="geminiApiKey"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter your Gemini API key"
                        value={formData.geminiApiKey}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                        onClick={() => setFormData(prev => ({ ...prev, showApiKey: !prev.showApiKey }))}
                      >
                        {formData.showApiKey ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-500">
                      Your API key is stored securely and used only for AI-powered features.
                    </p>
                  </>
                )}
                
                <div className="pt-2">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={testGeminiApi}
                    disabled={loading || (!formData.useDefaultKey && !formData.geminiApiKey)}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Testing...
                      </>
                    ) : (
                      'Test API Connection'
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {user && <AISettings userId={user.id} />}
      
      <div className="mt-8">
        <AITester />
      </div>
    </div>
  );
}; 
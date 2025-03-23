import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-hot-toast';
import { GEMINI_API_KEY } from '../config/apiKeys';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [useDefaultKey, setUseDefaultKey] = useState(true);

  // Fetch user settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_settings')
          .select('gemini_api_key, use_default_key')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching settings:', error);
          toast.error('Failed to load settings');
        }
        
        if (data) {
          setGeminiApiKey(data.gemini_api_key || '');
          setUseDefaultKey(data.use_default_key !== false); // Default to true if not set
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, [user]);

  const saveSettings = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
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
            gemini_api_key: useDefaultKey ? null : geminiApiKey,
            use_default_key: useDefaultKey
          })
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('user_settings')
          .insert([{ 
            user_id: user.id, 
            gemini_api_key: useDefaultKey ? null : geminiApiKey,
            use_default_key: useDefaultKey
          }]);
        
        if (error) throw error;
      }
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const testGeminiApi = async () => {
    const apiKeyToTest = useDefaultKey ? GEMINI_API_KEY : geminiApiKey;
    
    if (!useDefaultKey && !geminiApiKey) {
      toast.error('Please enter an API key or use the default key');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Test the Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
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
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Integration</h2>
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <input
              id="default-key"
              name="api-key-option"
              type="radio"
              checked={useDefaultKey}
              onChange={() => setUseDefaultKey(true)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="default-key" className="ml-2 block text-sm font-medium text-gray-700">
              Use default Gemini API key (recommended)
            </label>
          </div>
          
          {useDefaultKey && (
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
          
          <div className="flex items-center mb-4">
            <input
              id="custom-key"
              name="api-key-option"
              type="radio"
              checked={!useDefaultKey}
              onChange={() => setUseDefaultKey(false)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="custom-key" className="ml-2 block text-sm font-medium text-gray-700">
              Use my own Gemini API key
            </label>
          </div>
          
          {!useDefaultKey && (
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
                  type={showApiKey ? "text" : "password"}
                  name="geminiApiKey"
                  id="geminiApiKey"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter your Gemini API key"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  disabled={isLoading || isSaving}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
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
        </div>
        
        <div className="flex space-x-4">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={saveSettings}
            disabled={isLoading || isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </button>
          
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={testGeminiApi}
            disabled={isLoading || isSaving || (!useDefaultKey && !geminiApiKey)}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Testing...
              </>
            ) : (
              'Test Connection'
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">About Gemini AI</h2>
        
        <div className="prose max-w-none">
          <p>
            Gemini is Google's most capable AI model, designed to be helpful, harmless, and honest. 
            By adding your Gemini API key, you can unlock advanced AI features in this application:
          </p>
          
          <ul className="mt-4 space-y-2">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Personalized investment recommendations</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Advanced market analysis and insights</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Natural language portfolio queries</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Improved stock predictions and trend analysis</span>
            </li>
          </ul>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
            <h3 className="text-md font-medium text-blue-800 mb-2">How to get a Gemini API key:</h3>
            <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
              <li>Visit <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
              <li>Sign in with your Google account</li>
              <li>Navigate to the API keys section</li>
              <li>Create a new API key</li>
              <li>Copy and paste it here</li>
            </ol>
            <p className="mt-2 text-sm text-blue-600">
              The free tier includes up to 60 queries per minute, which is more than enough for personal use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-hot-toast';
import { GEMINI_API_KEY, OPENROUTER_API_KEY } from '../config/apiKeys';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openRouterApiKey, setOpenRouterApiKey] = useState('');
  const [preferredProvider, setPreferredProvider] = useState<'gemini' | 'openrouter'>('gemini');
  const [settings, setSettings] = useState({
    theme: 'light',
    notificationsEnabled: true,
    currency: 'USD',
    riskTolerance: 'moderate',
    investmentHorizon: 'medium'
  });

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

    const fetchSettings = async () => {
    setLoading(true);
    try {
      // Load API settings from the database
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // Load user interface settings from localStorage
      const savedUiSettings = localStorage.getItem('user_interface_settings');
      if (savedUiSettings) {
        try {
          const parsedSettings = JSON.parse(savedUiSettings);
          setSettings({
            theme: parsedSettings.theme || 'light',
            notificationsEnabled: parsedSettings.notificationsEnabled !== false,
            currency: parsedSettings.currency || 'USD',
            riskTolerance: parsedSettings.riskTolerance || 'moderate',
            investmentHorizon: parsedSettings.investmentHorizon || 'medium'
          });
        } catch (e) {
          console.error('Error parsing saved UI settings:', e);
          // Use defaults if parsing fails
        }
      }

      // Set AI API settings from database if available
      if (data) {
        // Set API keys
        if (data.gemini_api_key) {
          setGeminiApiKey(data.gemini_api_key);
        }
        
        if (data.openrouter_api_key) {
          setOpenRouterApiKey(data.openrouter_api_key);
        }
        
        // Set preferred provider
        if (data.preferred_ai_provider) {
          setPreferredProvider(data.preferred_ai_provider);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user?.id,
          // Only include fields that actually exist in the database table
          preferred_ai_provider: preferredProvider,
          gemini_api_key: geminiApiKey || null,
          openrouter_api_key: openRouterApiKey || null
        });
        
      if (error) {
        console.error('Error saving settings:', error);
        throw error;
      }
      
      // Save local settings to localStorage instead (since they don't exist in DB)
      localStorage.setItem('user_interface_settings', JSON.stringify({
        theme: settings.theme,
        notificationsEnabled: settings.notificationsEnabled,
        currency: settings.currency,
        riskTolerance: settings.riskTolerance,
        investmentHorizon: settings.investmentHorizon
      }));
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings({ ...settings, [name]: checked });
      } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Provider Settings</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred AI Provider
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
            <input
              type="radio"
                className="form-radio h-4 w-4 text-indigo-600"
                name="preferred_provider"
                value="gemini"
                checked={preferredProvider === 'gemini'}
                onChange={() => setPreferredProvider('gemini')}
              />
              <span className="ml-2 text-gray-700">Gemini</span>
            </label>
            <label className="inline-flex items-center">
            <input
              type="radio"
                className="form-radio h-4 w-4 text-indigo-600"
                name="preferred_provider" 
                value="openrouter"
                checked={preferredProvider === 'openrouter'}
                onChange={() => setPreferredProvider('openrouter')}
              />
              <span className="ml-2 text-gray-700">OpenRouter</span>
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {preferredProvider === 'gemini' 
              ? "Gemini is Google's AI model. It's fast and reliable."
              : "OpenRouter provides access to multiple AI models. Useful as a backup if Gemini quota is exceeded."}
          </p>
              </div>
              
        <div className="mb-6">
          <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-700 mb-1">
            Gemini API Key
          </label>
                <input
            type="password"
                  id="geminiApiKey"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
            placeholder={GEMINI_API_KEY ? "Default key is configured" : "Enter your Gemini API key"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Leave blank to use the application default
          </p>
              </div>
              
        <div className="mb-6">
          <label htmlFor="openRouterApiKey" className="block text-sm font-medium text-gray-700 mb-1">
            OpenRouter API Key
          </label>
          <input
            type="password"
            id="openRouterApiKey"
            value={openRouterApiKey}
            onChange={(e) => setOpenRouterApiKey(e.target.value)}
            placeholder={OPENROUTER_API_KEY ? "Default key is configured" : "Enter your OpenRouter API key"}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used as a fallback when Gemini quota is exceeded
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">General Settings</h2>
        
        <div className="mb-4">
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="notificationsEnabled"
              checked={settings.notificationsEnabled}
              onChange={(e) => setSettings({
                ...settings,
                notificationsEnabled: e.target.checked
              })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Enable notifications</span>
          </label>
        </div>
        
        <div className="mb-4">
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={settings.currency}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Investment Preferences</h2>
        
        <div className="mb-4">
          <label htmlFor="riskTolerance" className="block text-sm font-medium text-gray-700 mb-1">
            Risk Tolerance
          </label>
          <select
            id="riskTolerance"
            name="riskTolerance"
            value={settings.riskTolerance}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="investmentHorizon" className="block text-sm font-medium text-gray-700 mb-1">
            Investment Horizon
          </label>
          <select
            id="investmentHorizon"
            name="investmentHorizon"
            value={settings.investmentHorizon}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="short">Short Term (&lt; 1 year)</option>
            <option value="medium">Medium Term (1-5 years)</option>
            <option value="long">Long Term (&gt; 5 years)</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={saveSettings}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default Settings; 
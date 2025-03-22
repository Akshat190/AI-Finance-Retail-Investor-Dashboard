import React, { useState, useEffect } from 'react';
import { Key, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AIProvider } from '../lib/aiConfig';

interface AISettingsProps {
  userId: string;
}

export const AISettings: React.FC<AISettingsProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    preferredProvider: 'gemini' as AIProvider,
    geminiApiKey: '',
    openrouterApiKey: ''
  });

  useEffect(() => {
    fetchSettings();
  }, [userId]);

  async function fetchSettings() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setSettings({
          preferredProvider: data.preferred_ai_provider || 'gemini',
          geminiApiKey: data.gemini_api_key || '',
          openrouterApiKey: data.openrouter_api_key || ''
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          preferred_ai_provider: settings.preferredProvider,
          gemini_api_key: settings.geminiApiKey,
          openrouter_api_key: settings.openrouterApiKey,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setSuccess('AI settings saved successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <div className="flex items-center mb-6">
        <Key className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-900">AI Settings</h2>
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

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div>
            <label htmlFor="preferredProvider" className="block text-sm font-medium text-gray-700">
              Preferred AI Provider
            </label>
            <select
              id="preferredProvider"
              name="preferredProvider"
              value={settings.preferredProvider}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="gemini">Gemini 2.0 Flash</option>
              <option value="openrouter">OpenRouter (DeepSeek R1)</option>
            </select>
          </div>

          <div>
            <label htmlFor="geminiApiKey" className="block text-sm font-medium text-gray-700">
              Gemini API Key
            </label>
            <input
              type="password"
              id="geminiApiKey"
              name="geminiApiKey"
              value={settings.geminiApiKey}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your Gemini API key"
            />
          </div>

          <div>
            <label htmlFor="openrouterApiKey" className="block text-sm font-medium text-gray-700">
              OpenRouter API Key
            </label>
            <input
              type="password"
              id="openrouterApiKey"
              name="openrouterApiKey"
              value={settings.openrouterApiKey}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter your OpenRouter API key"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save API Keys
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}; 
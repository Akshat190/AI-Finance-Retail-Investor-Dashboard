import React, { useState, useEffect } from 'react';
import AIService from '../services/AIService';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { Loader2 } from 'lucide-react';

const AITester = () => {
  const { user } = useAuth();
  const [provider, setProvider] = useState<'gemini' | 'openrouter'>('gemini');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserSettings();
    } else {
      setLoadingSettings(false);
    }
  }, [user]);

  const fetchUserSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setUserSettings(data);
        setProvider(data.preferred_ai_provider || 'gemini');
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      setResponse('');
      
      const aiService = AIService;
      const result = await aiService.generateContent(prompt, {
        provider: provider,
        systemPrompt: "You are a helpful financial assistant.",
        temperature: 0.7,
        maxOutputTokens: 1000
      });
      
      setResponse(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      console.error('AI generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingSettings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Provider Tester</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            AI Provider
          </label>
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-indigo-600"
                value="gemini"
                checked={provider === 'gemini'}
                onChange={() => setProvider('gemini')}
              />
              <span className="ml-2 text-gray-700">Gemini</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio h-4 w-4 text-indigo-600"
                value="openrouter"
                checked={provider === 'openrouter'}
                onChange={() => setProvider('openrouter')}
              />
              <span className="ml-2 text-gray-700">OpenRouter</span>
            </label>
          </div>
          
          <div className="mt-2 mb-4">
            <p className="text-sm text-gray-500">
              Selected provider key: {provider === 'gemini' 
                ? (userSettings?.gemini_api_key ? '✅ Custom key configured' : '⚠️ Using default key') 
                : (userSettings?.openrouter_api_key ? '✅ Custom key configured' : '⚠️ Using default key')}
            </p>
          </div>
          
          <div className="flex flex-wrap space-x-2 mb-4">
            <button
              type="button" 
              onClick={() => setPrompt("Analyze the current market trends for the S&P 500 and provide key insights.")}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
            >
              Market Analysis
            </button>
            <button
              type="button"
              onClick={() => setPrompt("What are the top 3 stocks to watch in the technology sector this week?")}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
            >
              Stock Picks
            </button>
            <button
              type="button"
              onClick={() => setPrompt("Explain the impact of current interest rates on the bond market.")}
              className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
            >
              Interest Rates
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
              Test Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 h-32"
              placeholder="Enter a test prompt here..."
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {loading ? <span className="flex items-center"><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</span> : 'Generate Response'}
          </button>
        </form>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
          <h2 className="text-lg font-medium text-red-800 mb-2">Error</h2>
          <div className="text-red-700 whitespace-pre-wrap mb-3">{error}</div>
          
          {error.includes('404') && error.includes('gemini') && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm">
              <p className="font-medium text-yellow-800">This is a Gemini API endpoint error</p>
              <p className="text-yellow-700 mt-1">
                The API URL format has been updated in the latest changes. Try refreshing the 
                page, or switching to OpenRouter. If it persists, visit Settings to set your own API key.
              </p>
            </div>
          )}
          
          {error.includes('quota') && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm">
              <p className="font-medium text-yellow-800">API quota exceeded</p>
              <p className="text-yellow-700 mt-1">
                Try switching to the OpenRouter provider or wait some time for the quota to reset.
              </p>
            </div>
          )}
        </div>
      )}
      
      {response && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-2">AI Response</h2>
          <div className="bg-gray-50 p-4 rounded border border-gray-200 whitespace-pre-wrap">{response}</div>
        </div>
      )}
    </div>
  );
};

export default AITester; 
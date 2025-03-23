import React, { useState } from 'react';
import { getAIConfig } from '../lib/aiConfig';
import { generateAIResponse } from '../lib/aiService';
// Import only during development
// import { DEV_KEYS } from '../lib/devKeys';

export const AITester: React.FC = () => {
  const [provider, setProvider] = useState<'gemini' | 'openrouter'>('gemini');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // In production, you would get these from user settings
  // For development, you can use the DEV_KEYS
  const apiKeys = {
    // Comment out or remove in production
    // gemini: DEV_KEYS.gemini,
    // openrouter: DEV_KEYS.openrouter,
    
    // In production, get from user settings
    gemini: '',
    openrouter: ''
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKeys[provider]) {
      setError(`No API key provided for ${provider}`);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const config = getAIConfig(provider, apiKeys[provider]);
      const result = await generateAIResponse([
        { role: 'user', content: prompt }
      ], config);
      
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">AI Model Tester</h2>
      
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 p-3 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Select Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as 'gemini' | 'openrouter')}
            className="w-full p-2 border rounded"
          >
            <option value="gemini">Gemini 2.0 Flash</option>
            <option value="openrouter">DeepSeek R1 (OpenRouter)</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Your Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full p-2 border rounded h-32"
            placeholder="Enter your prompt here..."
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !prompt}
          className="bg-indigo-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Response'}
        </button>
      </form>
      
      {response && (
        <div className="border rounded p-4 bg-gray-50">
          <h3 className="font-medium mb-2">AI Response:</h3>
          <div className="whitespace-pre-wrap">{response}</div>
        </div>
      )}
    </div>
  );
}; 
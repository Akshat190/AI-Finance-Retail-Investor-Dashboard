import React, { useState } from 'react';
import AutocompleteInput from './AutocompleteInput';
import AIService from '../services/AIService';

interface ResearchAssistantProps {
  className?: string;
}

const ResearchAssistant: React.FC<ResearchAssistantProps> = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Investment-specific autocomplete suggestions
  const investmentSuggestions = [
    "How to analyze a company's financial statements?",
    "What are the best dividend stocks to buy?",
    "How to build a diversified portfolio?",
    "What is the difference between growth and value investing?",
    "How to evaluate a stock's valuation?",
    "What are the key metrics for stock analysis?",
    "How to identify undervalued stocks?",
    "What are the best investment strategies for beginners?",
    "How to manage investment risk?",
    "What are the best ETFs for long-term investment?",
    "How to analyze market trends?",
    "What are the best stocks for passive income?",
    "How to evaluate a company's competitive advantage?",
    "What are the key factors in stock selection?",
    "How to build a retirement portfolio?"
  ];

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setShowSuggestions(true);
  };

  const handleQuerySubmit = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const prompt = `
        Analyze this investment research query and provide a detailed response:
        "${query}"
        
        Include the following in your response:
        1. Key insights and analysis
        2. Relevant market context
        3. Potential risks and considerations
        4. Actionable recommendations
      `;

      const result = await AIService.generateContent(prompt, {
        systemPrompt: "You are an investment research assistant providing detailed analysis and recommendations.",
        temperature: 0.7,
      });

      setResponse(result);
    } catch (err) {
      console.error('Error generating research response:', err);
      setError('Failed to generate research response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSuggestions = investmentSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className={`bg-gray-50 p-6 rounded-xl shadow-sm ${className}`}>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Research Assistant
        </h3>
        <p className="text-gray-600">
          Get intelligent autocomplete as you type investment questions
        </p>
      </div>
      
      <div className="relative mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleQuerySubmit(query);
            }
          }}
          placeholder="Try 'How to analyze...' or 'Best strategies for...'"
          className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
        />
        
        {showSuggestions && query.length >= 2 && filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 mt-2 w-full bg-white shadow-lg max-h-60 rounded-lg py-2 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-200">
            {filteredSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="cursor-pointer select-none relative py-2.5 px-4 hover:bg-indigo-50 transition-colors duration-150"
                onClick={() => {
                  setQuery(suggestion);
                  handleQuerySubmit(suggestion);
                }}
              >
                <div className="flex items-center">
                  <span className="block truncate text-gray-700">{suggestion}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      )}
      
      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}
      
      {response && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-lg font-semibold text-gray-800">Research Analysis</h4>
            </div>
            <div className="prose prose-indigo max-w-none">
              {response.split('\n').map((line, index) => (
                <p key={index} className="text-gray-700 mb-3 leading-relaxed">{line}</p>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-indigo-500 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-indigo-700">
              <strong>Pro tip:</strong> Type a few characters to see investment-related suggestions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchAssistant; 
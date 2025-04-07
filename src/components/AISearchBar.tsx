import React, { useState } from 'react';
import AutocompleteInput from './AutocompleteInput';
import AIService from '../services/AIService';
import { useNavigate } from 'react-router-dom';

interface AISearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
}

const AISearchBar: React.FC<AISearchBarProps> = ({
  className = '',
  onSearch,
  placeholder = 'Search for stocks, ETFs, or investment ideas...',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Handle search submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);

    try {
      // If parent component provided a search handler, use it
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        // Determine intent and route to appropriate page
        const intent = await determineSearchIntent(searchQuery);
        routeBasedOnIntent(intent, searchQuery);
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Determine user intent using AI
  const determineSearchIntent = async (query: string): Promise<string> => {
    try {
      const prompt = `
        Analyze this search query from a user of an investment platform and determine their intent:
        "${query}"
        
        Categorize into ONE of these intents:
        1. stock_lookup - User wants information about a specific stock
        2. etf_lookup - User wants information about a specific ETF
        3. investment_idea - User is looking for investment ideas or strategies
        4. portfolio_analysis - User wants analysis of their portfolio
        5. market_news - User is looking for market news
        6. educational - User wants to learn about investing concepts
        
        Return ONLY the intent category name, nothing else.
      `;

      const intent = await AIService.generateCompletion(prompt, {
        temperature: 0.1, // Low temperature for more deterministic results
        maxTokens: 20,
      });

      return intent.trim().toLowerCase();
    } catch (error) {
      console.error('Error determining search intent:', error);
      return 'stock_lookup'; // Default fallback
    }
  };

  // Route user to appropriate page based on intent
  const routeBasedOnIntent = (intent: string, query: string) => {
    switch (intent) {
      case 'stock_lookup':
      case 'etf_lookup':
        // Extract ticker if possible
        const possibleTicker = extractPossibleTicker(query);
        navigate(`/stock/${possibleTicker || query}`);
        break;
      case 'investment_idea':
        navigate('/ai-insights/recommendations', { state: { searchQuery: query } });
        break;
      case 'portfolio_analysis':
        navigate('/ai-insights/portfolio');
        break;
      case 'market_news':
        navigate('/market-news', { state: { searchQuery: query } });
        break;
      case 'educational':
        navigate('/learn', { state: { searchQuery: query } });
        break;
      default:
        // Default to search results page
        navigate('/search', { state: { searchQuery: query } });
    }
  };

  // Simple utility to try to extract a ticker symbol
  const extractPossibleTicker = (query: string): string | null => {
    // Look for uppercase sequences that might be tickers
    const tickerRegex = /\b[A-Z]{1,5}\b/;
    const match = query.match(tickerRegex);
    return match ? match[0] : null;
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <AutocompleteInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="submit"
        className="absolute inset-y-0 right-0 px-3 flex items-center"
        disabled={isSearching}
      >
        {isSearching ? (
          <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
        ) : (
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </button>
    </form>
  );
};

export default AISearchBar; 
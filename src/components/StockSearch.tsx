import React, { useState, useEffect } from 'react';
import AIService from '../services/AIService';
import { useNavigate } from 'react-router-dom';
import { searchStock } from '../utils/stockPredictions';

interface StockSearchProps {
  onSelect?: (ticker: string) => void;
  className?: string;
  placeholder?: string;
}

interface StockSuggestion {
  symbol: string;
  name: string;
  source: 'local' | 'api';
  id: string; // Unique identifier for each suggestion
}

const StockSearch: React.FC<StockSearchProps> = ({
  onSelect,
  className = '',
  placeholder = 'Search for a stock (e.g., AAPL, MSFT, TSLA)...'
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 1) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        // First try local search
        const localResults = searchStock(query)
          .filter(stock => stock.symbol && stock.name) // Filter out invalid results
          .map((stock, index) => ({
            symbol: stock.symbol,
            name: stock.name,
            source: 'local' as const,
            id: `local-${stock.symbol}-${index}`
          }));
        
        // If we have few results, try the API
        if (localResults.length < 5) {
          const apiResults = await AIService.getTickerAutocomplete(query);
          if (apiResults && apiResults.length > 0) {
            const validApiResults = apiResults
              .filter(stock => stock && stock.symbol && stock.name) // Filter out invalid results
              .filter(apiStock => !localResults.some(local => local.symbol === apiStock.symbol))
              .map((stock, index) => ({
                symbol: stock.symbol,
                name: stock.name,
                source: 'api' as const,
                id: `api-${stock.symbol}-${index}`
              }));
            
            setSuggestions([...localResults, ...validApiResults].slice(0, 10));
          } else {
            setSuggestions(localResults.slice(0, 10));
          }
        } else {
          setSuggestions(localResults.slice(0, 10));
        }
      } catch (error) {
        console.error('Error getting ticker suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSelectTicker(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSelectTicker = (stock: StockSuggestion) => {
    setQuery(stock.symbol);
    setSuggestions([]);
    setShowSuggestions(false);
    
    if (onSelect) {
      onSelect(stock.symbol);
    } else {
      navigate(`/stocks/${stock.symbol}`);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className={`w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-200">
          {suggestions.map((stock, index) => (
            <li
              key={stock.id}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 transition-colors ${
                index === selectedIndex ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'
              }`}
              onClick={() => handleSelectTicker(stock)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium block truncate">
                  {`${stock.symbol} - ${stock.name}`}
                </span>
                {index === selectedIndex && (
                  <span className="text-indigo-600 absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StockSearch; 
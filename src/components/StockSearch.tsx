import React, { useState } from 'react';
import AIService from '../services/AIService';
import { useNavigate } from 'react-router-dom';

interface StockSearchProps {
  onSelect?: (ticker: string) => void;
  className?: string;
  placeholder?: string;
}

const StockSearch: React.FC<StockSearchProps> = ({
  onSelect,
  className = '',
  placeholder = 'Search for a stock (e.g., AAPL, MSFT, TSLA)...'
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 1) {
      setLoading(true);
      
      try {
        const results = await AIService.getTickerAutocomplete(value);
        setSuggestions(results);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error getting ticker suggestions:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;
    
    // Handle arrow up/down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prevIndex => 
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prevIndex => prevIndex > 0 ? prevIndex - 1 : 0);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleSelectTicker(suggestions[selectedIndex]);
    }
  };
  
  const handleSelectTicker = (ticker: string) => {
    setQuery(ticker);
    setSuggestions([]);
    
    if (onSelect) {
      onSelect(ticker);
    } else {
      // Default behavior: navigate to stock details
      navigate(`/stocks/${ticker}`);
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
          placeholder={placeholder}
          className={`w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>
      
      {suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-200">
          {suggestions.map((ticker, index) => (
            <li
              key={ticker}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 transition-colors ${
                index === selectedIndex ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'
              }`}
              onClick={() => handleSelectTicker(ticker)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium block truncate">{ticker}</span>
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
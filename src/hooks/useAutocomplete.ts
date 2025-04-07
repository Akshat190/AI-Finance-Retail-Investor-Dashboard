import { useState, useEffect, useCallback, useRef } from 'react';
import AIService from '../services/AIService';
import { AutocompleteOptions, AutocompleteResult } from '../types/AITypes';

// Custom debounce function implementation
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };

  debounced.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

interface UseAutocompleteProps {
  initialInput?: string;
  minChars?: number;
  debounceMs?: number;
  options?: AutocompleteOptions;
  type?: 'general' | 'ticker';
}

export function useAutocomplete({
  initialInput = '',
  minChars = 2,
  debounceMs = 300,
  options = {},
  type = 'general'
}: UseAutocompleteProps = {}) {
  const [input, setInput] = useState(initialInput);
  const [suggestions, setSuggestions] = useState<AutocompleteResult[] | string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Use a ref to keep track of the latest input value for the debounced function
  const inputRef = useRef(input);
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  // Debounced function to fetch autocomplete suggestions
  const fetchSuggestions = useCallback(
    debounce(async () => {
      const currentInput = inputRef.current;
      if (!currentInput || currentInput.length < minChars) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        let results: AutocompleteResult[] | string[] = [];
        
        if (type === 'ticker') {
          results = await AIService.getTickerAutocomplete(currentInput, options.limit);
        } else {
          results = await AIService.getAutocomplete(currentInput, options);
        }
        
        setSuggestions(results);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch suggestions'));
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs),
    [minChars, options, type]
  );

  // Fetch suggestions when input changes
  useEffect(() => {
    if (input.length >= minChars) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
    setSelectedIndex(-1);
    
    // Cleanup debounced function on unmount
    return () => {
      fetchSuggestions.cancel();
    };
  }, [input, minChars, fetchSuggestions]);

  // Handle input change
  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  // Handle suggestion selection
  const handleSelectSuggestion = useCallback((suggestion: AutocompleteResult | string) => {
    if (typeof suggestion === 'string') {
      setInput(suggestion);
    } else {
      setInput(suggestion.text);
    }
    setSuggestions([]);
    setSelectedIndex(-1);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!suggestions.length) return;
    
    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    }
    
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    }
    
    // Enter key
    else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[selectedIndex]);
    }
    
    // Escape key
    else if (e.key === 'Escape') {
      e.preventDefault();
      setSuggestions([]);
      setSelectedIndex(-1);
    }
  }, [suggestions, selectedIndex, handleSelectSuggestion]);

  return {
    input,
    suggestions,
    loading,
    error,
    selectedIndex,
    handleInputChange,
    handleSelectSuggestion,
    handleKeyDown,
  };
}

export default useAutocomplete; 
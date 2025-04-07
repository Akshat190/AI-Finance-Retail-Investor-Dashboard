import React, { forwardRef, useState, useRef, useEffect } from 'react';
import useAutocomplete from '../hooks/useAutocomplete';
import { AutocompleteResult } from '../types/AITypes';

interface AutocompleteInputProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  minChars?: number;
  type?: 'general' | 'ticker';
  label?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
}

const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(
  (
    {
      placeholder = 'Type to search...',
      className = '',
      value,
      onChange,
      onSelect,
      minChars = 2,
      type = 'general',
      label,
      id,
      name,
      required = false,
      disabled = false,
    },
    ref
  ) => {
    // Track if component is controlled
    const isControlled = value !== undefined;
    
    // Local state for the input field if uncontrolled
    const [localInputValue, setLocalInputValue] = useState('');
    
    // Determine input value based on controlled/uncontrolled state
    const inputValue = isControlled ? value : localInputValue;
    
    // Use our custom hook for autocomplete
    const {
      input,
      suggestions,
      loading,
      selectedIndex,
      handleInputChange,
      handleSelectSuggestion,
      handleKeyDown,
    } = useAutocomplete({
      initialInput: inputValue,
      minChars,
      type,
    });
    
    // Keep our hook's input in sync with props/state
    useEffect(() => {
      if (inputValue !== input) {
        handleInputChange(inputValue);
      }
    }, [inputValue, input]);
    
    // Handle input changes
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      
      // Update local state if uncontrolled
      if (!isControlled) {
        setLocalInputValue(newValue);
      }
      
      // Call parent onChange if provided
      if (onChange) {
        onChange(newValue);
      }
    };
    
    // Handle suggestion selection
    const onSuggestionSelect = (suggestion: AutocompleteResult | string) => {
      const selectedValue = typeof suggestion === 'string' ? suggestion : suggestion.text;
      
      // Update local state if uncontrolled
      if (!isControlled) {
        setLocalInputValue(selectedValue);
      }
      
      // Call parent onSelect if provided
      if (onSelect) {
        onSelect(selectedValue);
      }
      
      // Call parent onChange if provided
      if (onChange) {
        onChange(selectedValue);
      }
      
      // Call our hook's handler
      handleSelectSuggestion(suggestion);
    };
    
    // Ref for the dropdown container
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          event.target instanceof Node &&
          !dropdownRef.current.contains(event.target)
        ) {
          // Close suggestions
          if (suggestions.length > 0) {
            handleInputChange(input); // Keep the input value but close dropdown
          }
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [suggestions.length, handleInputChange, input]);
    
    return (
      <div className="autocomplete-container relative">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        
        <div className="relative" ref={dropdownRef}>
          <input
            ref={ref}
            type="text"
            id={id}
            name={name}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${className}`}
            placeholder={placeholder}
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            required={required}
            disabled={disabled}
            autoComplete="off"
          />
          
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
              {suggestions.map((suggestion, index) => {
                const text = typeof suggestion === 'string' ? suggestion : suggestion.text;
                const score = typeof suggestion === 'string' ? null : suggestion.score;
                
                return (
                  <li
                    key={`${text}-${index}`}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-100 ${
                      index === selectedIndex ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => onSuggestionSelect(suggestion)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="block truncate">{text}</span>
                      {score !== null && (
                        <span className="text-xs text-gray-500 mr-2">
                          {Math.round(score * 100)}%
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }
);

AutocompleteInput.displayName = 'AutocompleteInput';

export default AutocompleteInput; 
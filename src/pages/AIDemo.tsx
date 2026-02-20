import React, { useState, useCallback } from 'react';
import AISearchBar from '../components/AISearchBar';
import AIContentGenerator from '../components/AIContentGenerator';
import StockSearch from '../components/StockSearch';
import ResearchAssistant from '../components/ResearchAssistant';

const AIDemo: React.FC = () => {
  // Sample preset prompts for the content generator
  const presetPrompts = [
    'Write a stock analysis for AAPL',
    'Create an investment thesis for renewable energy stocks',
    'Draft a weekly market summary',
    'Generate a retirement savings plan for a 35-year-old',
    'Write a comparison between growth and value investing',
  ];

  const [activeTab, setActiveTab] = useState<'search' | 'content'>('search');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Investment Tools</h1>
      
      {/* Tab Navigation */}
      <div className="flex mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('search')}
          className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
            activeTab === 'search'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Search & Analysis
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-6 py-3 font-medium text-sm transition-colors duration-200 ${
            activeTab === 'content'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Content Generation
        </button>
      </div>
      
      {/* Search & Analysis Tab */}
      {activeTab === 'search' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ResearchAssistant />
          
          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-md font-medium text-gray-700 mb-3">
              Stock Search
            </h3>
            <p className="text-gray-600 mb-4">
              Search for stocks and get real-time suggestions
            </p>
            <StockSearch
              className="w-full"
              placeholder="Search for stocks (e.g., AAPL, MSFT, TSLA)..."
            />
          </div>
        </div>
      )}
      
      {/* Content Generation Tab */}
      {activeTab === 'content' && (
        <div className="bg-gray-50 p-5 rounded-lg">
          <AIContentGenerator
            presetPrompts={presetPrompts}
            placeholder="Describe what you want to generate..."
            className="w-full"
          />
        </div>
      )}
      
      {/* Info Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">AI-Powered Investment Tools</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700">
              Our AI investment tools help you make smarter financial decisions by providing:
            </p>
            
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>Intelligent Search</strong> - Find investment opportunities with natural language</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>Smart Autocomplete</strong> - Get context-aware suggestions as you type</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span><strong>Content Generation</strong> - Create professional investment documents</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-medium text-gray-800 mb-2">Try These Examples</h3>
            <p className="text-gray-600 text-sm mb-3">Click any example to try it out:</p>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab('search');
                  // You would need to implement a way to set the AISearchBar value
                }}
                className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded text-gray-700 transition-colors"
              >
                "Compare AAPL and MSFT stocks"
              </button>
              <button
                onClick={() => {
                  setActiveTab('search');
                  // You would need to implement a way to set the AISearchBar value
                }}
                className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded text-gray-700 transition-colors"
              >
                "Best ETFs for passive income"
              </button>
              <button
                onClick={() => {
                  setActiveTab('content');
                  // You would need to implement a way to set the content generator value
                }}
                className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded text-gray-700 transition-colors"
              >
                "Write a monthly market outlook report"
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDemo; 
import React, { useState } from 'react';
import AutocompleteInput from '../components/AutocompleteInput';
import AISearchBar from '../components/AISearchBar';
import AIContentGenerator from '../components/AIContentGenerator';
import StockSearch from '../components/StockSearch';

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
      
      {/* Search & Autocomplete Tab */}
      {activeTab === 'search' && (
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Smart Investment Search</h2>
              
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-700 mb-3">
                  Find Investment Opportunities
                </h3>
                <p className="text-gray-600 mb-4">
                  Try searching for stocks, ETFs, or investment strategies with our AI-powered search
                </p>
                <AISearchBar
                  placeholder="E.g., 'tech stocks with high growth', 'AAPL analysis', or 'best dividend ETFs'"
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-md font-medium text-gray-700 mb-3">
                    Research Assistant
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get intelligent autocomplete as you type investment questions
                  </p>
                  <AutocompleteInput
                    placeholder="Try 'How to analyze...' or 'Best strategies for...'"
                    className="w-full bg-white"
                  />
                  
                  <div className="mt-4 bg-indigo-50 p-3 rounded text-sm text-indigo-700">
                    <strong>Pro tip:</strong> Type a few characters and wait for AI suggestions to appear
                  </div>
                </div>
                
                <div className="bg-gray-50 p-5 rounded-lg">
                  <h3 className="text-md font-medium text-gray-700 mb-3">
                    Stock Ticker Search
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Quickly find company tickers with intelligent suggestions
                  </p>
                  <StockSearch className="w-full" />
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">AAPL</span>
                    <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">MSFT</span>
                    <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">GOOGL</span>
                    <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">AMZN</span>
                    <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">TSLA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Content Generation Tab */}
      {activeTab === 'content' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Investment Content Generator</h2>
            <p className="text-gray-600 mb-6">
              Create professional financial content for reports, analysis, or research using AI assistance
            </p>
            
            <AIContentGenerator
              placeholder="Describe what financial content you need..."
              presetPrompts={presetPrompts}
              className="w-full"
              systemPrompt="You are a professional financial analyst helping create high-quality investment content. Focus on providing accurate, insightful, and actionable information."
            />
          </div>
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
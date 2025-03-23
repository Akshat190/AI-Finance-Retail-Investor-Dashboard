import React from 'react';
import { Link } from 'react-router-dom';

const Chat: React.FC = () => {
  // Open Hugging Face in a new tab
  const openHuggingFace = () => {
    window.open('https://huggingface.co/spaces/Akshat1908/financial-chatbot', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Financial Assistant</h1>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="p-8 text-center">
          <svg 
            className="mx-auto h-24 w-24 text-indigo-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
            />
          </svg>
          
          <h2 className="mt-6 text-2xl font-bold text-gray-900">AI Financial Assistant</h2>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Our AI-powered financial assistant can help you with investment advice, stock information, 
            portfolio allocation, and general financial concepts.
          </p>
          
          <div className="mt-8">
            <button
              onClick={openHuggingFace}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Launch AI Assistant
              <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Features</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-gray-600">Personalized investment advice</span>
              </li>
              <li className="flex items-start">
                <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-gray-600">Real-time stock information</span>
              </li>
              <li className="flex items-start">
                <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-gray-600">Stock price predictions</span>
              </li>
              <li className="flex items-start">
                <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-gray-600">Portfolio allocation advice</span>
              </li>
              <li className="flex items-start">
                <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 text-gray-600">Financial education</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Example Questions</h3>
            <ul className="mt-4 space-y-3">
              <li className="text-gray-600">What stocks should I invest in based on my profile?</li>
              <li className="text-gray-600">How should I allocate my portfolio at age 35?</li>
              <li className="text-gray-600">What's the difference between stocks and bonds?</li>
              <li className="text-gray-600">How do I protect myself from investment fraud?</li>
              <li className="text-gray-600">What is dollar-cost averaging?</li>
              <li className="text-gray-600">Should I pay off debt or invest?</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-indigo-50 rounded-lg p-6 border border-indigo-100">
        <h2 className="text-xl font-semibold text-indigo-800 mb-4">About This Financial Assistant</h2>
        <p className="text-indigo-700 mb-4">
          This AI-powered financial assistant can help you with investment advice, stock information, 
          portfolio allocation, and general financial concepts. It uses real-time market data and 
          personalized recommendations based on your profile.
        </p>
        <p className="text-indigo-700">
          <strong>Note:</strong> While this assistant provides financial information, it should not 
          replace professional financial advice. Always consult with a qualified financial advisor 
          before making investment decisions.
        </p>
      </div>
    </div>
  );
};

export default Chat; 
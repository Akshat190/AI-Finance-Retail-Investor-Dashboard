import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-indigo-800">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
            alt="Financial background"
          />
          <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" aria-hidden="true"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">FinanceAI</h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
            Your AI-powered financial assistant. Get personalized investment advice, stock predictions, and financial education.
          </p>
          <div className="mt-10 flex space-x-4">
            {user ? (
              <>
                <Link
                  to="/portfolio"
                  className="inline-block bg-indigo-600 py-3 px-6 border border-transparent rounded-md text-base font-medium text-white hover:bg-indigo-700"
                >
                  View Portfolio
                </Link>
                <a
                  href="https://huggingface.co/spaces/Akshat1908/financial-chatbot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white py-3 px-6 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Talk to AI Assistant
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-block bg-indigo-600 py-3 px-6 border border-transparent rounded-md text-base font-medium text-white hover:bg-indigo-700"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-block bg-white py-3 px-6 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Smart financial tools for everyone
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              From beginners to experienced investors, our AI-powered platform helps you make better financial decisions.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">AI Financial Assistant</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get personalized financial advice and answers to your questions from our AI assistant.
                  </p>
                  <div className="mt-3">
                    <Link to="/chat" className="text-indigo-600 hover:text-indigo-500">
                      Try it now →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Stock Predictions</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Get AI-powered predictions on stock performance based on your risk profile.
                  </p>
                  <div className="mt-3">
                    <Link to="/predictions" className="text-indigo-600 hover:text-indigo-500">
                      View predictions →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Portfolio Management</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Track and manage your investments in one place with real-time updates.
                  </p>
                  <div className="mt-3">
                    <Link to="/portfolio" className="text-indigo-600 hover:text-indigo-500">
                      Manage portfolio →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Financial Education</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Learn about investing, financial concepts, and strategies through our AI assistant.
                  </p>
                  <div className="mt-3">
                    <Link to="/chat" className="text-indigo-600 hover:text-indigo-500">
                      Start learning →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 
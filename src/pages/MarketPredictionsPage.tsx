import React, { useState } from 'react';
import MarketPredictions from '../components/MarketPredictions';
import PricePrediction from '../components/PricePrediction';
import { PricePrediction as PricePredictionType } from '../types/AITypes';
import { BookOpen, LineChart, ListFilter, PlusCircle, Star } from 'lucide-react';
import AIMarketPredictionService from '../services/AIMarketPredictionService';

const MarketPredictionsPage: React.FC = () => {
  const [selectedTicker, setSelectedTicker] = useState<string>('');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  
  const handleAddToWatchlist = async (ticker: string) => {
    if (watchlist.includes(ticker)) return;
    
    setWatchlistLoading(true);
    try {
      // In a real implementation, this would save to the database
      await AIMarketPredictionService.addToWatchlist(ticker);
      setWatchlist([...watchlist, ticker]);
    } catch (err) {
      console.error("Error adding to watchlist:", err);
    } finally {
      setWatchlistLoading(false);
    }
  };
  
  const handleSelectWatchlistItem = (ticker: string) => {
    setSelectedTicker(ticker);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Market Predictions</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          AI-powered market and price predictions to help inform your investment decisions
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Market Overview Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Market Overview</h2>
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-3 py-1.5 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700 transition-colors">
                  Next Week
                </button>
                <button className="flex-1 sm:flex-none px-3 py-1.5 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700 transition-colors">
                  Next Month
                </button>
                <button className="flex-1 sm:flex-none px-3 py-1.5 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700 transition-colors">
                  6 Months
                </button>
              </div>
            </div>

            {/* Market Indices Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Dow Jones */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Dow Jones</h3>
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Current:</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">36,252</span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Range:</span>
                    <div className="text-right">
                      <div className="text-gray-900 dark:text-white">35,759.99</div>
                      <div className="text-gray-900 dark:text-white">36,744.01</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nasdaq */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Nasdaq</h3>
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Current:</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">14,631</span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Range:</span>
                    <div className="text-right">
                      <div className="text-gray-900 dark:text-white">13,958</div>
                      <div className="text-gray-900 dark:text-white">15,303</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Russell 2000 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Russell 2000</h3>
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Current:</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">1,954</span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Range:</span>
                    <div className="text-right">
                      <div className="text-gray-900 dark:text-white">1,876.96</div>
                      <div className="text-gray-900 dark:text-white">2,031.04</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* S&P 500 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">S&P 500</h3>
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-500 dark:text-gray-400 text-sm">Current:</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">4,587</span>
                  </div>
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Range:</span>
                    <div className="text-right">
                      <div className="text-gray-900 dark:text-white">4,425.87</div>
                      <div className="text-gray-900 dark:text-white">4,748.13</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <MarketPredictions />
          </div>

          {/* Price Prediction Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
            <PricePrediction 
              defaultTicker={selectedTicker}
              onPredictionGenerated={(prediction: PricePredictionType) => {
                if (prediction && !watchlist.includes(prediction.ticker)) {
                  handleAddToWatchlist(prediction.ticker);
                }
              }}
            />
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Watchlist */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Watchlist</h2>
            </div>
            
            <div className="p-4">
              {watchlist.length > 0 ? (
                <div className="space-y-2">
                  {watchlist.map((ticker, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                        selectedTicker === ticker ? 'bg-indigo-50 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                      }`}
                      onClick={() => handleSelectWatchlistItem(ticker)}
                    >
                      <div className="flex items-center">
                        <Star className={`h-4 w-4 mr-2 ${selectedTicker === ticker ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`} />
                        <span className="font-medium text-gray-900 dark:text-white">{ticker}</span>
                      </div>
                      <LineChart className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Star className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 mb-1">No stocks in your watchlist</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Search for tickers to add them to your watchlist
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Popular Searches */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Popular Searches</h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'JPM'].map((ticker) => (
                  <div
                    key={ticker}
                    className="border border-gray-200 dark:border-gray-700 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-center transition-colors"
                    onClick={() => setSelectedTicker(ticker)}
                  >
                    <span className="text-gray-900 dark:text-white font-medium">{ticker}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">About Predictions</h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Our AI predictions use advanced machine learning to analyze market trends, technical indicators, and fundamental data.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <ListFilter className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Get market sentiment, sector outlooks, price forecasts, and support/resistance levels.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <PlusCircle className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-3 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Add stocks to your watchlist to track predictions and monitor changes over time.
                  </p>
                </div>
                
                <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-100 dark:border-yellow-900 rounded-md p-3">
                  <p className="text-yellow-800 dark:text-yellow-200 text-xs">
                    <strong>Disclaimer:</strong> AI predictions are for informational purposes only and should not be considered financial advice. Always do your own research before making investment decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPredictionsPage; 
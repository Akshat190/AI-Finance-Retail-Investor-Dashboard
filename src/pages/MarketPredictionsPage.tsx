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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Market Predictions</h1>
        <p className="text-gray-600 mt-2">
          AI-powered market and price predictions to help inform your investment decisions
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <MarketPredictions />
          </div>
          
          <div>
            <PricePrediction 
              defaultTicker={selectedTicker}
              onPredictionGenerated={(prediction: PricePredictionType) => {
                // When a prediction is generated, we could save it or add to watchlist
                if (prediction && !watchlist.includes(prediction.ticker)) {
                  handleAddToWatchlist(prediction.ticker);
                }
              }}
            />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Your Watchlist</h2>
            </div>
            
            <div className="p-4">
              {watchlist.length > 0 ? (
                <div className="space-y-2">
                  {watchlist.map((ticker, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                        selectedTicker === ticker ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50 border border-gray-100'
                      }`}
                      onClick={() => handleSelectWatchlistItem(ticker)}
                    >
                      <div className="flex items-center">
                        <Star className={`h-4 w-4 mr-2 ${selectedTicker === ticker ? 'text-indigo-500' : 'text-gray-400'}`} />
                        <span className="font-medium">{ticker}</span>
                      </div>
                      <LineChart className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Star className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-1">No stocks in your watchlist</p>
                  <p className="text-sm text-gray-400">
                    Search for tickers to add them to your watchlist
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Popular Searches</h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'JPM'].map((ticker) => (
                  <div
                    key={ticker}
                    className="border border-gray-100 rounded p-2 hover:bg-gray-50 cursor-pointer text-center"
                    onClick={() => setSelectedTicker(ticker)}
                  >
                    <span className="text-gray-800 font-medium">{ticker}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">About Predictions</h2>
            </div>
            
            <div className="p-4">
              <div className="space-y-4 text-gray-600 text-sm">
                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p>
                    Our AI predictions are generated using advanced machine learning models that analyze market trends, technical indicators, and fundamental data.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <ListFilter className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p>
                    Predictions include market sentiment, sector outlooks, price forecasts, and support/resistance levels.
                  </p>
                </div>
                
                <div className="flex items-start">
                  <PlusCircle className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p>
                    Add stocks to your watchlist to quickly access their predictions and keep track of changes over time.
                  </p>
                </div>
                
                <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-md p-3">
                  <p className="text-yellow-800 text-xs">
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
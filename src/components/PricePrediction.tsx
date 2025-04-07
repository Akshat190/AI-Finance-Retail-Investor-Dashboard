import React, { useState, useEffect } from 'react';
import { PricePrediction as PricePredictionType } from '../types/AITypes';
import AIMarketPredictionService from '../services/AIMarketPredictionService';
import { Loader2, ChevronDown, Info, Search, ArrowRight } from 'lucide-react';

interface PricePredictionProps {
  className?: string;
  defaultTicker?: string;
  onPredictionGenerated?: (prediction: PricePredictionType) => void;
}

const PricePrediction: React.FC<PricePredictionProps> = ({ 
  className = '',
  defaultTicker = '',
  onPredictionGenerated
}) => {
  const [ticker, setTicker] = useState(defaultTicker);
  const [inputTicker, setInputTicker] = useState(defaultTicker);
  const [prediction, setPrediction] = useState<PricePredictionType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTechnical, setShowTechnical] = useState(false);
  const [showFundamental, setShowFundamental] = useState(false);
  
  useEffect(() => {
    if (defaultTicker) {
      generatePrediction(defaultTicker);
    }
  }, [defaultTicker]);
  
  const generatePrediction = async (tickerSymbol: string) => {
    if (!tickerSymbol.trim()) {
      setError("Please enter a valid ticker symbol");
      return;
    }
    
    setLoading(true);
    setError(null);
    setTicker(tickerSymbol.toUpperCase());
    
    try {
      const pricePrediction = await AIMarketPredictionService.generatePricePrediction(tickerSymbol.toUpperCase());
      setPrediction(pricePrediction);
      
      if (onPredictionGenerated) {
        onPredictionGenerated(pricePrediction);
      }
      
      // Auto-open one of the analysis sections
      setShowFundamental(true);
    } catch (err) {
      console.error("Error generating price prediction:", err);
      setError("Failed to generate price prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generatePrediction(inputTicker);
  };
  
  const getTimeframeColor = (timeframe: 'day' | 'week' | 'month' | 'quarter' | 'year', change: number) => {
    // Return different shades based on timeframe and change percent
    if (change > 0) {
      if (timeframe === 'day' || timeframe === 'week') return 'bg-green-500';
      if (timeframe === 'month') return 'bg-green-600';
      return 'bg-green-700';
    } else if (change < 0) {
      if (timeframe === 'day' || timeframe === 'week') return 'bg-red-500';
      if (timeframe === 'month') return 'bg-red-600';
      return 'bg-red-700';
    } else {
      return 'bg-gray-500';
    }
  };
  
  const getChangeText = (current: number, predicted: number) => {
    const diff = predicted - current;
    const percentChange = (diff / current) * 100;
    const sign = percentChange > 0 ? '+' : '';
    return `${sign}${percentChange.toFixed(2)}%`;
  };
  
  // Format price with appropriate decimal places based on price level
  const formatPrice = (price: number | undefined | null) => {
    // Handle undefined or null values
    if (price === undefined || price === null) return '0.00';
    
    if (price < 1) return price.toFixed(4);
    if (price < 10) return price.toFixed(3);
    if (price < 100) return price.toFixed(2);
    return price.toFixed(0);
  };
  
  return (
    <div className={`price-prediction ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Prediction</h2>
          
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={inputTicker}
                  onChange={e => setInputTicker(e.target.value.toUpperCase())}
                  placeholder="Enter ticker symbol (e.g. AAPL)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !inputTicker.trim()}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-500">Generating price prediction...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-800 p-4 rounded-lg">
              {error}
            </div>
          ) : prediction ? (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{ticker}</h3>
                  <div className="text-sm text-gray-500">
                    Confidence: <span className="font-medium text-gray-800">{prediction.confidence}%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Current Price</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${formatPrice(prediction.currentPrice)}
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                    <div className="text-sm text-indigo-600 mb-1">Next Month Prediction</div>
                    <div className="text-2xl font-bold text-indigo-800">
                      ${formatPrice(prediction.predictedPrices.month)}
                      <span className={`ml-2 text-sm inline-block px-2 py-0.5 rounded text-white ${
                        prediction.predictedPrices.month > prediction.currentPrice 
                          ? 'bg-green-600' 
                          : prediction.predictedPrices.month < prediction.currentPrice 
                            ? 'bg-red-600' 
                            : 'bg-gray-600'
                      }`}>
                        {getChangeText(prediction.currentPrice, prediction.predictedPrices.month)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Price timeline visualization */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Price Timeline</h4>
                  <div className="relative h-16">
                    {/* Timeline line */}
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-300"></div>
                    
                    {/* Current price marker */}
                    <div className="absolute top-0 translate-x-0 translate-y-0">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">Now</div>
                        <div className="w-0.5 h-2 bg-gray-800"></div>
                        <div className="w-3 h-3 rounded-full bg-gray-800 mb-1"></div>
                        <div className="text-sm font-medium">${formatPrice(prediction.currentPrice)}</div>
                      </div>
                    </div>
                    
                    {/* Day prediction */}
                    <div className="absolute top-0 translate-x-[20%] translate-y-0">
                      <div className="flex flex-col items-center">
                        <div className="text-xs px-2 py-1 rounded text-gray-600">Day</div>
                        <div className="w-0.5 h-2 bg-gray-400"></div>
                        <div className={`w-3 h-3 rounded-full ${getTimeframeColor('day', prediction.predictedPrices.day - prediction.currentPrice)} mb-1`}></div>
                        <div className="text-sm font-medium">${formatPrice(prediction.predictedPrices.day)}</div>
                      </div>
                    </div>
                    
                    {/* Week prediction */}
                    <div className="absolute top-0 translate-x-[40%] translate-y-0">
                      <div className="flex flex-col items-center">
                        <div className="text-xs px-2 py-1 rounded text-gray-600">Week</div>
                        <div className="w-0.5 h-2 bg-gray-400"></div>
                        <div className={`w-3 h-3 rounded-full ${getTimeframeColor('week', prediction.predictedPrices.week - prediction.currentPrice)} mb-1`}></div>
                        <div className="text-sm font-medium">${formatPrice(prediction.predictedPrices.week)}</div>
                      </div>
                    </div>
                    
                    {/* Month prediction */}
                    <div className="absolute top-0 translate-x-[60%] translate-y-0">
                      <div className="flex flex-col items-center">
                        <div className="text-xs px-2 py-1 rounded text-gray-600">Month</div>
                        <div className="w-0.5 h-2 bg-gray-400"></div>
                        <div className={`w-3 h-3 rounded-full ${getTimeframeColor('month', prediction.predictedPrices.month - prediction.currentPrice)} mb-1`}></div>
                        <div className="text-sm font-medium">${formatPrice(prediction.predictedPrices.month)}</div>
                      </div>
                    </div>
                    
                    {/* Quarter prediction */}
                    <div className="absolute top-0 translate-x-[80%] translate-y-0">
                      <div className="flex flex-col items-center">
                        <div className="text-xs px-2 py-1 rounded text-gray-600">Quarter</div>
                        <div className="w-0.5 h-2 bg-gray-400"></div>
                        <div className={`w-3 h-3 rounded-full ${getTimeframeColor('quarter', prediction.predictedPrices.quarter - prediction.currentPrice)} mb-1`}></div>
                        <div className="text-sm font-medium">${formatPrice(prediction.predictedPrices.quarter)}</div>
                      </div>
                    </div>
                    
                    {/* Year prediction */}
                    <div className="absolute top-0 translate-x-[100%] translate-y-0">
                      <div className="flex flex-col items-center">
                        <div className="text-xs px-2 py-1 rounded text-gray-600">Year</div>
                        <div className="w-0.5 h-2 bg-gray-400"></div>
                        <div className={`w-3 h-3 rounded-full ${getTimeframeColor('year', prediction.predictedPrices.year - prediction.currentPrice)} mb-1`}></div>
                        <div className="text-sm font-medium">${formatPrice(prediction.predictedPrices.year)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Support and resistance levels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Support Levels</h4>
                    <div className="space-y-2">
                      {prediction.supportLevels.map((level, idx) => (
                        <div 
                          key={idx} 
                          className={`p-2 rounded ${
                            idx === 0 ? 'bg-green-100 border border-green-200' : 'bg-gray-50 border border-gray-100'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className={idx === 0 ? 'font-medium text-green-800' : 'text-gray-700'}>
                              ${formatPrice(level)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {((level / prediction.currentPrice - 1) * 100).toFixed(2)}% from current
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Resistance Levels</h4>
                    <div className="space-y-2">
                      {prediction.resistanceLevels.map((level, idx) => (
                        <div 
                          key={idx} 
                          className={`p-2 rounded ${
                            idx === 0 ? 'bg-red-100 border border-red-200' : 'bg-gray-50 border border-gray-100'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className={idx === 0 ? 'font-medium text-red-800' : 'text-gray-700'}>
                              ${formatPrice(level)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {((level / prediction.currentPrice - 1) * 100).toFixed(2)}% from current
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Technical analysis section */}
                <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => setShowTechnical(!showTechnical)}
                  >
                    <div className="flex items-center">
                      <ChevronDown 
                        className={`h-5 w-5 mr-2 text-gray-400 transition-transform duration-200 ${
                          showTechnical ? 'transform rotate-180' : ''
                        }`} 
                      />
                      <span className="font-medium">Technical Analysis</span>
                    </div>
                    <div>
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  {showTechnical && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="space-y-3">
                        {prediction.technicalFactors.map((factor, idx) => (
                          <div key={idx} className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                            <p className="text-gray-600">{factor}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Fundamental analysis section */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => setShowFundamental(!showFundamental)}
                  >
                    <div className="flex items-center">
                      <ChevronDown 
                        className={`h-5 w-5 mr-2 text-gray-400 transition-transform duration-200 ${
                          showFundamental ? 'transform rotate-180' : ''
                        }`} 
                      />
                      <span className="font-medium">Fundamental Analysis</span>
                    </div>
                    <div>
                      <Info className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  {showFundamental && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="space-y-3">
                        {prediction.fundamentalFactors.map((factor, idx) => (
                          <div key={idx} className="flex items-start">
                            <ArrowRight className="h-4 w-4 text-gray-500 mt-1 mr-2 flex-shrink-0" />
                            <p className="text-gray-600">{factor}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Info className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">Enter a ticker symbol to see price predictions</p>
              <p className="text-xs text-gray-400">Examples: AAPL, MSFT, GOOGL, AMZN</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricePrediction; 
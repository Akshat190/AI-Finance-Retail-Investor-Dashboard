import React, { useState, useEffect } from 'react';
import { MarketPrediction, PricePrediction, SectorPrediction } from '../types/AITypes';
import AIMarketPredictionService from '../services/AIMarketPredictionService';
import { Loader2, ArrowDown, ArrowRight, ArrowUp, Calendar, ChevronDown, RefreshCw, CheckCircle } from 'lucide-react';
import cacheService from '../utils/cacheService';

interface MarketPredictionsProps {
  className?: string;
}

const MarketPredictions: React.FC<MarketPredictionsProps> = ({ className = '' }) => {
  const [predictions, setPredictions] = useState<MarketPrediction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' | 'quarter'>('week');
  const [expandedSectors, setExpandedSectors] = useState<string[]>([]);
  const [expandedIndices, setExpandedIndices] = useState<string[]>([]);
  const [isFromCache, setIsFromCache] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    loadPredictions();
  }, [timeframe]);
  
  const loadPredictions = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we already have cached data
      const cacheKey = `market_prediction_${timeframe}`;
      const cachedData = cacheService.getWithExpiry(cacheKey);
      
      // If force refresh, clear the cache first
      if (forceRefresh) {
        cacheService.clearCache(cacheKey);
        setRefreshing(true);
      }
      
      // Set cached status flag
      setIsFromCache(!!cachedData && !forceRefresh);
      
      const marketPrediction = await AIMarketPredictionService.generateMarketPrediction(timeframe);
      setPredictions(marketPrediction);
      
      // Auto expand the most bullish sector
      if (marketPrediction.sectorPredictions.length > 0) {
        const mostBullishSector = marketPrediction.sectorPredictions
          .filter(s => s.outlook === 'bullish')
          .sort((a, b) => {
            // Try to sort by highest potential return
            const extractHighestReturn = (str: string) => {
              const match = str.match(/(-?\d+\.?\d*)%\s*to\s*(-?\d+\.?\d*)%/);
              return match ? parseFloat(match[2]) : 0;
            };
            return extractHighestReturn(b.potentialReturn) - extractHighestReturn(a.potentialReturn);
          })[0]?.sector;
          
        if (mostBullishSector) {
          setExpandedSectors([mostBullishSector]);
        }
      }
      
      // Auto expand a major index
      if (marketPrediction.majorIndexPredictions.length > 0) {
        const mainIndex = marketPrediction.majorIndexPredictions.find(i => i.index === 'S&P 500')?.index;
        if (mainIndex) {
          setExpandedIndices([mainIndex]);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? `Failed to load market predictions: ${error.message}` 
        : 'Failed to load market predictions. Please try again later.';
      setError(errorMessage);
      console.error('Market predictions error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    loadPredictions(true); // Force refresh
  };
  
  const toggleSector = (sector: string) => {
    if (expandedSectors.includes(sector)) {
      setExpandedSectors(expandedSectors.filter(s => s !== sector));
    } else {
      setExpandedSectors([...expandedSectors, sector]);
    }
  };
  
  const toggleIndex = (index: string) => {
    if (expandedIndices.includes(index)) {
      setExpandedIndices(expandedIndices.filter(i => i !== index));
    } else {
      setExpandedIndices([...expandedIndices, index]);
    }
  };
  
  const getOutlookColor = (outlook: 'bearish' | 'neutral' | 'bullish') => {
    switch(outlook) {
      case 'bearish': return 'text-red-600';
      case 'neutral': return 'text-yellow-600';
      case 'bullish': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };
  
  const getOutlookIcon = (outlook: 'bearish' | 'neutral' | 'bullish') => {
    switch(outlook) {
      case 'bearish': return <ArrowDown className="h-4 w-4 text-red-600" />;
      case 'neutral': return <ArrowRight className="h-4 w-4 text-yellow-600" />;
      case 'bullish': return <ArrowUp className="h-4 w-4 text-green-600" />;
      default: return null;
    }
  };
  
  const getTimeframeLabel = (timeframe: 'day' | 'week' | 'month' | 'quarter') => {
    switch(timeframe) {
      case 'day': return 'Next Trading Day';
      case 'week': return 'Next Week';
      case 'month': return 'Next Month';
      case 'quarter': return 'Next Quarter';
      default: return '';
    }
  };
  
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Market Predictions</h2>
        
        <div className="flex items-center">
          {/* Display cache status and refresh button */}
          {isFromCache && (
            <div className="flex items-center text-xs text-gray-500 mr-4">
              <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
              <span>Cached data</span>
            </div>
          )}
          
          <button
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className={`p-2 rounded-full transition-colors ${refreshing ? 'bg-blue-100 text-blue-500' : 'hover:bg-gray-100'}`}
            title="Refresh predictions"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin text-blue-500' : 'text-gray-500'}`} />
          </button>
          
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="ml-3 bg-white border border-gray-300 rounded-md p-2 text-sm"
            disabled={loading}
          >
            <option value="day">Next Day</option>
            <option value="week">Next Week</option>
            <option value="month">Next Month</option>
            <option value="quarter">Next Quarter</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500">Generating market predictions...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          {error}
        </div>
      ) : predictions ? (
        <div className="space-y-6">
          {/* Overall Market Outlook */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {getTimeframeLabel(timeframe)} Outlook
                </h3>
                <div className="flex items-center">
                  <span className={`font-bold text-lg capitalize ${getOutlookColor(predictions.marketOutlook)}`}>
                    {predictions.marketOutlook}
                  </span>
                  <span className="ml-2 bg-gray-200 rounded-full px-2 py-1 text-xs">
                    {predictions.confidenceScore}% confidence
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Key Drivers</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  {predictions.keyDrivers.map((driver, idx) => (
                    <li key={idx}>{driver}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4 text-gray-700">
                <h4 className="font-medium text-gray-700 mb-2">Analysis</h4>
                <p className="text-gray-600">{predictions.analysis}</p>
              </div>
            </div>
          </div>
          
          {/* Sector Predictions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sector Outlook</h3>
              
              <div className="space-y-3">
                {predictions.sectorPredictions.sort((a, b) => {
                  // Sort by outlook (bullish > neutral > bearish)
                  const outlookScore = { 'bullish': 3, 'neutral': 2, 'bearish': 1 };
                  return outlookScore[b.outlook] - outlookScore[a.outlook];
                }).map((sector, idx) => (
                  <div 
                    key={idx} 
                    className="border border-gray-200 rounded-lg"
                  >
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleSector(sector.sector)}
                    >
                      <div className="flex items-center">
                        <ChevronDown 
                          className={`h-5 w-5 mr-2 text-gray-400 transition-transform duration-200 ${
                            expandedSectors.includes(sector.sector) ? 'transform rotate-180' : ''
                          }`} 
                        />
                        <span className="font-medium">{sector.sector}</span>
                      </div>
                      <div className="flex items-center">
                        <span className={`mr-3 capitalize font-medium ${getOutlookColor(sector.outlook)}`}>
                          {sector.outlook}
                        </span>
                        <span className="text-sm text-gray-500">{sector.potentialReturn}</span>
                      </div>
                    </div>
                    
                    {expandedSectors.includes(sector.sector) && (
                      <div className="p-4 pt-0 border-t border-gray-200 bg-gray-50">
                        <div className="mt-3">
                          <p className="text-gray-600 mb-3">{sector.rationale}</p>
                          
                          {sector.keyStocks.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Stocks</h4>
                              <div className="flex flex-wrap gap-2">
                                {sector.keyStocks.map((stock, i) => (
                                  <span 
                                    key={i} 
                                    className="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-sm"
                                  >
                                    {stock}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Index Predictions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Major Indices</h3>
              
              <div className="space-y-3">
                {predictions.majorIndexPredictions.map((indexPred, idx) => (
                  <div 
                    key={idx} 
                    className="border border-gray-200 rounded-lg"
                  >
                    <div 
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleIndex(indexPred.index)}
                    >
                      <div className="flex items-center">
                        <ChevronDown 
                          className={`h-5 w-5 mr-2 text-gray-400 transition-transform duration-200 ${
                            expandedIndices.includes(indexPred.index) ? 'transform rotate-180' : ''
                          }`} 
                        />
                        <span className="font-medium">{indexPred.index}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-500">
                          Current: <span className="font-medium text-gray-800">{indexPred.currentValue.toLocaleString()}</span>
                        </span>
                        <span className="text-gray-500">
                          Range: <span className="font-medium text-gray-800">
                            {indexPred.predictedRange.low.toLocaleString()} - {indexPred.predictedRange.high.toLocaleString()}
                          </span>
                        </span>
                      </div>
                    </div>
                    
                    {expandedIndices.includes(indexPred.index) && (
                      <div className="p-4 pt-0 border-t border-gray-200 bg-gray-50">
                        <div className="mt-3">
                          <div className="flex justify-between mb-3">
                            <span className="text-gray-700">
                              Confidence: <span className="font-medium">{indexPred.confidence}%</span>
                            </span>
                            <span className="text-gray-700">
                              Potential Change: {' '}
                              <span className={
                                indexPred.predictedRange.low > indexPred.currentValue ? 'text-green-600 font-medium' :
                                indexPred.predictedRange.high < indexPred.currentValue ? 'text-red-600 font-medium' :
                                'text-yellow-600 font-medium'
                              }>
                                {(((indexPred.predictedRange.high + indexPred.predictedRange.low) / 2 - indexPred.currentValue) / indexPred.currentValue * 100).toFixed(2)}%
                              </span>
                            </span>
                          </div>
                          
                          {/* Simple chart visualization */}
                          <div className="mt-4 mb-3">
                            <div className="relative h-16 bg-gray-200 rounded-lg w-full overflow-hidden">
                              {/* Current value line */}
                              <div 
                                className="absolute top-0 bottom-0 w-0.5 bg-gray-800 z-10"
                                style={{ 
                                  left: `${Math.max(0, Math.min(100, (indexPred.currentValue - (indexPred.predictedRange.low * 0.9)) / ((indexPred.predictedRange.high * 1.1) - (indexPred.predictedRange.low * 0.9)) * 100))}%` 
                                }}
                              >
                                <div className="absolute top-0 -left-7 -translate-x-1/2 bg-gray-800 text-white text-xs px-1 py-0.5 rounded">
                                  Now
                                </div>
                              </div>
                              
                              {/* Prediction range */}
                              <div 
                                className="absolute top-4 h-8 bg-indigo-100 rounded"
                                style={{ 
                                  left: `${Math.max(0, Math.min(100, (indexPred.predictedRange.low - (indexPred.predictedRange.low * 0.9)) / ((indexPred.predictedRange.high * 1.1) - (indexPred.predictedRange.low * 0.9)) * 100))}%`,
                                  width: `${Math.min(100, ((indexPred.predictedRange.high - indexPred.predictedRange.low) / ((indexPred.predictedRange.high * 1.1) - (indexPred.predictedRange.low * 0.9))) * 100)}%`
                                }}
                              />
                              
                              {/* Lower bound */}
                              <div 
                                className="absolute top-4 bottom-4 w-0.5 bg-indigo-600"
                                style={{ 
                                  left: `${Math.max(0, Math.min(100, (indexPred.predictedRange.low - (indexPred.predictedRange.low * 0.9)) / ((indexPred.predictedRange.high * 1.1) - (indexPred.predictedRange.low * 0.9)) * 100))}%` 
                                }}
                              >
                                <div className="absolute bottom-full -translate-y-1 -translate-x-1/2 text-xs text-gray-600">
                                  {indexPred.predictedRange.low.toLocaleString()}
                                </div>
                              </div>
                              
                              {/* Upper bound */}
                              <div 
                                className="absolute top-4 bottom-4 w-0.5 bg-indigo-600"
                                style={{ 
                                  left: `${Math.max(0, Math.min(100, (indexPred.predictedRange.high - (indexPred.predictedRange.low * 0.9)) / ((indexPred.predictedRange.high * 1.1) - (indexPred.predictedRange.low * 0.9)) * 100))}%` 
                                }}
                              >
                                <div className="absolute bottom-full -translate-y-1 -translate-x-1/2 text-xs text-gray-600">
                                  {indexPred.predictedRange.high.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Drivers</h4>
                            <ul className="list-disc pl-5 text-gray-600 space-y-1">
                              {indexPred.keyDrivers.map((driver, i) => (
                                <li key={i}>{driver}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">No predictions available yet.</p>
          <button
            onClick={loadPredictions}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Generate Predictions
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketPredictions; 
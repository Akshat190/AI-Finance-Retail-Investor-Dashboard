import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AIInvestmentAdvisorService from '../services/AIInvestmentAdvisorService';
import AIPortfolioService from '../services/AIPortfolioService';
import AIMarketSentimentService from '../services/AIMarketSentimentService';
import { 
  InvestmentIdea, 
  MarketSentiment, 
  TickerSentiment,
  RiskProfile
} from '../types/AITypes';
import { Loader2, TrendingUp, BarChart2, BookOpen, ArrowRight, RefreshCw, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import cacheService from '../utils/cacheService';
import { MarketPredictionPromo } from '../components/MarketPredictionPromo';

const InvestmentAdvisor = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState({
    ideas: false,
    sentiment: false,
    portfolio: false
  });
  const [isFromCache, setIsFromCache] = useState({
    ideas: false,
    sentiment: false
  });
  const [refreshing, setRefreshing] = useState({
    ideas: false,
    sentiment: false
  });
  const [error, setError] = useState<string | null>(null);
  
  const [investmentIdeas, setInvestmentIdeas] = useState<InvestmentIdea[]>([]);
  const [marketSentiment, setMarketSentiment] = useState<MarketSentiment | null>(null);
  const [ticker, setTicker] = useState('');
  const [tickerSentiment, setTickerSentiment] = useState<TickerSentiment | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // User preferences (could be fetched from user profile)
  const [userPreferences, setUserPreferences] = useState({
    riskProfile: 'moderate' as RiskProfile,
    investmentHorizon: 'medium' as 'short' | 'medium' | 'long',
    sectors: ['Technology', 'Healthcare'] as string[]
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);
  
  const loadInitialData = async () => {
    try {
      // Load investment ideas
      await generateInvestmentIdeas();
      
      // Load market sentiment
      await getMarketSentiment();
    } catch (err) {
      console.error("Failed to load initial data:", err);
      setError("Failed to load advisor data. Please try again later.");
    }
  };
  
  const generateInvestmentIdeas = async (forceRefresh = false) => {
    if (!user) return;
    
    setLoading(prev => ({ ...prev, ideas: true }));
    if (forceRefresh) {
      setRefreshing(prev => ({ ...prev, ideas: true }));
    }
    
    try {
      // Generate a cache key based on user preferences
      const prefsString = JSON.stringify(userPreferences);
      // Use a simple hash instead of Buffer which is only available in Node.js
      const hashKey = btoa(encodeURIComponent(prefsString)).substring(0, 20);
      const cacheKey = `investment_ideas_${user.id}_${hashKey}`;
      
      // Check if we have cached data
      const cachedData = cacheService.getWithExpiry(cacheKey);
      
      // If force refresh, clear the cache
      if (forceRefresh) {
        cacheService.clearCache(cacheKey);
      }
      
      // Set the cached flag
      setIsFromCache(prev => ({ ...prev, ideas: !!cachedData && !forceRefresh }));
      
      // Get the ideas from the service
      const ideas = await AIInvestmentAdvisorService.generateInvestmentIdeas(
        user.id,
        userPreferences
      );
      
      setInvestmentIdeas(ideas);
    } catch (err) {
      console.error("Failed to generate investment ideas:", err);
      setError("Failed to generate investment ideas. Please try again later.");
    } finally {
      setLoading(prev => ({ ...prev, ideas: false }));
      setRefreshing(prev => ({ ...prev, ideas: false }));
    }
  };
  
  const getMarketSentiment = async (forceRefresh = false) => {
    setLoading(prev => ({ ...prev, sentiment: true }));
    if (forceRefresh) {
      setRefreshing(prev => ({ ...prev, sentiment: true }));
    }
    
    try {
      // Check for cached data
      const cacheKey = 'market_sentiment';
      const cachedData = cacheService.getWithExpiry(cacheKey);
      
      // Set the cached flag
      setIsFromCache(prev => ({ ...prev, sentiment: !!cachedData && !forceRefresh }));
      
      // Get the sentiment from the service - pass the forceRefresh flag
      const sentiment = await AIMarketSentimentService.getMarketSentiment(forceRefresh);
      setMarketSentiment(sentiment);
    } catch (err) {
      console.error("Failed to get market sentiment:", err);
      setError("Failed to get market sentiment. Try refreshing to use the backup provider.");
    } finally {
      setLoading(prev => ({ ...prev, sentiment: false }));
      setRefreshing(prev => ({ ...prev, sentiment: false }));
    }
  };
  
  const handleRefreshIdeas = () => {
    generateInvestmentIdeas(true);
  };
  
  const handleRefreshSentiment = () => {
    getMarketSentiment(true);
  };
  
  const handleTickerSearch = async () => {
    if (!ticker.trim()) return;
    
    setSearchLoading(true);
    try {
      const sentiment = await AIMarketSentimentService.getTickerSentiment(ticker.trim());
      setTickerSentiment(sentiment);
    } catch (err) {
      console.error("Failed to get ticker sentiment:", err);
      setError("Failed to get ticker sentiment. Please try again later.");
    } finally {
      setSearchLoading(false);
    }
  };
  
  const getSentimentColor = (sentiment: 'bearish' | 'neutral' | 'bullish') => {
    switch (sentiment) {
      case 'bearish': return 'text-red-600';
      case 'neutral': return 'text-amber-600';
      case 'bullish': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Advisor</h1>
      <p className="text-gray-600 mb-8">AI-powered investment recommendations tailored to your preferences</p>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Market Sentiment Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Market Sentiment</h2>
          </div>
          
          <div className="flex items-center">
            {/* Display cache status and refresh button */}
            {isFromCache.sentiment && (
              <div className="flex items-center text-xs text-gray-500 mr-4">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                <span>Cached data</span>
              </div>
            )}
            <button
              onClick={handleRefreshSentiment}
              disabled={loading.sentiment}
              className="flex items-center text-sm text-indigo-600 hover:text-indigo-800 disabled:text-gray-400"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${refreshing.sentiment ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        {!loading.sentiment && !marketSentiment && error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  There was an error loading market sentiment. This may be due to the Gemini API error.
                </p>
                <button 
                  onClick={handleRefreshSentiment}
                  className="mt-2 px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                >
                  Try with OpenRouter
                </button>
              </div>
            </div>
          </div>
        )}
        
        {loading.sentiment && !marketSentiment ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          </div>
        ) : marketSentiment ? (
          <div>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="font-medium mb-1">Overall Market</p>
              <div className={`text-lg font-bold capitalize ${getSentimentColor(marketSentiment.overall)}`}>
                {marketSentiment.overall}
              </div>
            </div>
            
            <p className="font-medium mb-3">Sector Analysis</p>
            <div className="space-y-3 mb-4">
              {Object.entries(marketSentiment.sectors).map(([sector, sentiment]) => (
                <div key={sector} className="flex justify-between items-center p-2 border-b border-gray-100">
                  <span>{sector}</span>
                  <span className={`font-medium capitalize ${getSentimentColor(sentiment)}`}>
                    {sentiment}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{marketSentiment.analysis}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Failed to load market sentiment. Please try refreshing.</p>
        )}
      </div>
      
      {/* Market Predictions Promo */}
      <MarketPredictionPromo />
      
      {/* Investment Ideas Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <BarChart2 className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Investment Ideas</h2>
          </div>
          
          <div className="flex items-center">
            {/* Display cache status and refresh button */}
            {isFromCache.ideas && (
              <div className="flex items-center text-xs text-gray-500 mr-4">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                <span>Cached data</span>
              </div>
            )}
            
            <button
              onClick={handleRefreshIdeas}
              disabled={loading.ideas || refreshing.ideas}
              className={`p-2 rounded-full transition-colors ${refreshing.ideas ? 'bg-blue-100 text-blue-500' : 'hover:bg-gray-100'}`}
              title="Refresh investment ideas"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing.ideas ? 'animate-spin text-blue-500' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
        
        {loading.ideas && investmentIdeas.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          </div>
        ) : investmentIdeas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {investmentIdeas.map((idea, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{idea.ticker}</h3>
                    <p className="text-gray-600 text-sm">{idea.name}</p>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full font-medium ${
                    idea.riskLevel === 'conservative' ? 'bg-blue-50 text-blue-700' :
                    idea.riskLevel === 'moderate' ? 'bg-amber-50 text-amber-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {idea.riskLevel}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>{idea.type}</span>
                  <span className="font-medium">{idea.potentialReturn}</span>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{idea.reason}</p>
                
                <div className="flex justify-between items-center">
                  <div className="text-indigo-600 font-medium text-sm">
                    Suggested allocation: {idea.suggestedAllocation}%
                  </div>
                  <button className="text-sm flex items-center text-indigo-600 hover:text-indigo-800">
                    View thesis <ArrowRight className="h-3 w-3 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No investment ideas available. Try refreshing or changing your preferences.</p>
        )}
      </div>
    </div>
  );
};

export default InvestmentAdvisor; 
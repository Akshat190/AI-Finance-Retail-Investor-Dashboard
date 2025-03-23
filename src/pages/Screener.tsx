import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import axios from 'axios';
import { 
  Loader2, 
  BarChart2, 
  PieChart, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent, 
  User, 
  LogOut,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Bot
} from 'lucide-react';
import { getAIConfig } from '../lib/aiConfig';
import { generateAIResponse } from '../lib/aiService';

interface ScreenerStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  pe: number;
  sector: string;
}

export const Screener = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState<ScreenerStock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<ScreenerStock[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minPE: '',
    maxPE: '',
    sector: '',
    minMarketCap: '',
    maxMarketCap: ''
  });
  const [sortConfig, setSortConfig] = useState({
    key: 'symbol',
    direction: 'ascending'
  });
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [userSettings, setUserSettings] = useState<any>(null);

  useEffect(() => {
    checkUser();
    loadScreenerData();
    fetchUserSettings();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchQuery, filters, stocks]);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking user:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }

  async function fetchUserSettings() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user settings:', error);
        return;
      }
      
      setUserSettings(data);
    } catch (error) {
      console.error('Error fetching user settings:', error);
    }
  }

  async function loadScreenerData() {
    try {
      setLoading(true);
      
      // Use a free API key or fallback to sample data
      // For demo purposes, we'll use a sample data approach
      
      // Uncomment and replace with your actual API key when you have one
      // const apiKey = 'YOUR_ACTUAL_API_KEY';
      // const response = await axios.get(
      //   `https://financialmodelingprep.com/api/v3/quote/AAPL,MSFT,GOOGL,AMZN,META,TSLA,NVDA,JPM,V,JNJ?apikey=${apiKey}`
      // );
      
      // For now, use sample data
      const sampleStockData = [
        {
          symbol: 'AAPL',
          name: 'Apple Inc.',
          price: 175.25,
          change: 2.35,
          changesPercentage: 1.35,
          marketCap: 2850000000000,
          volume: 65432100,
          pe: 28.5,
          sector: 'Technology'
        },
        {
          symbol: 'MSFT',
          name: 'Microsoft Corporation',
          price: 310.20,
          change: 4.25,
          changesPercentage: 1.38,
          marketCap: 2320000000000,
          volume: 23456700,
          pe: 32.1,
          sector: 'Technology'
        },
        // Add more sample stocks here
        {
          symbol: 'GOOGL',
          name: 'Alphabet Inc.',
          price: 2850.75,
          change: -15.30,
          changesPercentage: -0.53,
          marketCap: 1880000000000,
          volume: 1876500,
          pe: 25.4,
          sector: 'Technology'
        },
        {
          symbol: 'AMZN',
          name: 'Amazon.com Inc.',
          price: 3150.50,
          change: 45.75,
          changesPercentage: 1.47,
          marketCap: 1590000000000,
          volume: 3214500,
          pe: 60.2,
          sector: 'Consumer Cyclical'
        },
        {
          symbol: 'META',
          name: 'Meta Platforms, Inc.',
          price: 325.80,
          change: -2.45,
          changesPercentage: -0.75,
          marketCap: 835000000000,
          volume: 21345600,
          pe: 22.8,
          sector: 'Technology'
        },
        {
          symbol: 'TSLA',
          name: 'Tesla, Inc.',
          price: 875.30,
          change: 32.65,
          changesPercentage: 3.87,
          marketCap: 878000000000,
          volume: 28765400,
          pe: 75.6,
          sector: 'Automotive'
        },
        {
          symbol: 'NVDA',
          name: 'NVIDIA Corporation',
          price: 450.25,
          change: 15.30,
          changesPercentage: 3.52,
          marketCap: 1120000000000,
          volume: 45678900,
          pe: 65.3,
          sector: 'Technology'
        },
        {
          symbol: 'JPM',
          name: 'JPMorgan Chase & Co.',
          price: 152.75,
          change: 1.25,
          changesPercentage: 0.82,
          marketCap: 450000000000,
          volume: 12345600,
          pe: 12.5,
          sector: 'Financial Services'
        },
        {
          symbol: 'V',
          name: 'Visa Inc.',
          price: 230.40,
          change: 3.15,
          changesPercentage: 1.38,
          marketCap: 480000000000,
          volume: 7654300,
          pe: 30.2,
          sector: 'Financial Services'
        },
        {
          symbol: 'JNJ',
          name: 'Johnson & Johnson',
          price: 165.20,
          change: -1.30,
          changesPercentage: -0.78,
          marketCap: 435000000000,
          volume: 5432100,
          pe: 24.1,
          sector: 'Healthcare'
        },
        {
          symbol: 'WMT',
          name: 'Walmart Inc.',
          price: 145.30,
          change: 2.10,
          changesPercentage: 1.47,
          marketCap: 395000000000,
          volume: 8765400,
          pe: 30.5,
          sector: 'Consumer Defensive'
        },
        {
          symbol: 'PG',
          name: 'The Procter & Gamble Company',
          price: 155.40,
          change: 0.85,
          changesPercentage: 0.55,
          marketCap: 370000000000,
          volume: 6543200,
          pe: 26.8,
          sector: 'Consumer Defensive'
        },
        {
          symbol: 'RELIANCE.NS',
          name: 'Reliance Industries Ltd.',
          price: 2450.75,
          change: 35.25,
          changesPercentage: 1.46,
          marketCap: 16500000000000,
          volume: 3456700,
          pe: 28.3,
          sector: 'Energy'
        },
        {
          symbol: 'TCS.NS',
          name: 'Tata Consultancy Services Ltd.',
          price: 3560.40,
          change: -45.30,
          changesPercentage: -1.26,
          marketCap: 13200000000000,
          volume: 1234500,
          pe: 29.7,
          sector: 'Technology'
        },
        {
          symbol: 'HDFCBANK.NS',
          name: 'HDFC Bank Ltd.',
          price: 1675.30,
          change: 25.45,
          changesPercentage: 1.54,
          marketCap: 9300000000000,
          volume: 2345600,
          pe: 22.5,
          sector: 'Financial Services'
        }
      ];
      
      // Format the data for our application
      const formattedStocks = sampleStockData.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.price,
        change: stock.change,
        changePercent: stock.changesPercentage,
        marketCap: stock.marketCap,
        volume: stock.volume,
        pe: stock.pe,
        sector: stock.sector
      }));
      
      setStocks(formattedStocks);
      setFilteredStocks(formattedStocks);
    } catch (error) {
      console.error('Error fetching stock data from API:', error);
      // Fallback to sample data in case of error
      // ... (use the same sample data as above)
    } finally {
      setLoading(false);
    }
  }

  function applyFiltersAndSearch() {
    let result = [...stocks];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        stock => 
          stock.symbol.toLowerCase().includes(query) || 
          stock.name.toLowerCase().includes(query)
      );
    }
    
    // Apply filters
    if (filters.minPrice) {
      result = result.filter(stock => stock.price >= parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      result = result.filter(stock => stock.price <= parseFloat(filters.maxPrice));
    }
    
    if (filters.minPE) {
      result = result.filter(stock => stock.pe >= parseFloat(filters.minPE));
    }
    
    if (filters.maxPE) {
      result = result.filter(stock => stock.pe <= parseFloat(filters.maxPE));
    }
    
    if (filters.sector) {
      result = result.filter(stock => stock.sector === filters.sector);
    }
    
    if (filters.minMarketCap) {
      const minMarketCapValue = parseFloat(filters.minMarketCap) * 1000000000; // Convert to billions
      result = result.filter(stock => stock.marketCap >= minMarketCapValue);
    }
    
    if (filters.maxMarketCap) {
      const maxMarketCapValue = parseFloat(filters.maxMarketCap) * 1000000000; // Convert to billions
      result = result.filter(stock => stock.marketCap <= maxMarketCapValue);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key as keyof ScreenerStock] < b[sortConfig.key as keyof ScreenerStock]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key as keyof ScreenerStock] > b[sortConfig.key as keyof ScreenerStock]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredStocks(result);
  }

  function handleSort(key: string) {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    
    // Sort the filtered stocks
    const sortedStocks = [...filteredStocks].sort((a, b) => {
      if (a[key as keyof ScreenerStock] < b[key as keyof ScreenerStock]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key as keyof ScreenerStock] > b[key as keyof ScreenerStock]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredStocks(sortedStocks);
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  }

  function resetFilters() {
    setFilters({
      minPrice: '',
      maxPrice: '',
      minPE: '',
      maxPE: '',
      sector: '',
      minMarketCap: '',
      maxMarketCap: ''
    });
    setSearchQuery('');
  }

  function requestSort(key: keyof ScreenerStock) {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    
    // Apply the sort
    const sortedStocks = [...filteredStocks].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredStocks(sortedStocks);
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  const handleAIAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aiPrompt.trim()) return;
    
    try {
      setAiLoading(true);
      setAiResponse('');
      
      // Get the preferred AI provider from user settings
      const preferredProvider = userSettings?.preferred_ai_provider || 'gemini';
      const apiKey = preferredProvider === 'gemini' 
        ? userSettings?.gemini_api_key 
        : userSettings?.openrouter_api_key;
      
      if (!apiKey) {
        setAiResponse("Please set up your AI API keys in the Profile page first.");
        setAiLoading(false);
        return;
      }
      
      // Get AI config
      const config = getAIConfig(preferredProvider, apiKey);
      
      // Generate context about the current filtered stocks
      const stockContext = filteredStocks.length <= 5 
        ? filteredStocks.map(s => `${s.symbol} (${s.name}): $${s.price}, PE: ${s.pe}, Market Cap: $${s.marketCap.toLocaleString()}B`).join('\n')
        : `${filteredStocks.length} stocks matching your criteria`;
      
      // Create messages for AI
      const messages = [
        {
          role: 'system',
          content: `You are an AI investment advisor. Provide concise, helpful analysis based on the user's question. 
          Current filtered stocks:\n${stockContext}`
        },
        {
          role: 'user',
          content: aiPrompt
        }
      ];
      
      // Generate response
      const response = await generateAIResponse(messages, config);
      setAiResponse(response);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setAiResponse('Sorry, there was an error generating the AI analysis. Please try again later.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-indigo-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <span className="text-white text-xl font-semibold">AI Investor</span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <Link
                  to="/dashboard"
                  className="text-white hover:bg-indigo-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <BarChart2 className="mr-3 h-6 w-6" />
                  Dashboard
                </Link>
                <Link
                  to="/portfolio"
                  className="text-white hover:bg-indigo-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <PieChart className="mr-3 h-6 w-6" />
                  Portfolio
                </Link>
                <Link
                  to="/screener"
                  className="bg-indigo-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <Search className="mr-3 h-6 w-6" />
                  Stock Screener
                </Link>
                <Link
                  to="/profile"
                  className="text-white hover:bg-indigo-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <User className="mr-3 h-6 w-6" />
                  Profile
                </Link>
                <Link
                  to="/chat"
                  className="text-white hover:bg-indigo-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                >
                  <Bot className="mr-3 h-6 w-6" />
                  ChatBot
                </Link>
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-indigo-700 p-4">
              <button
                onClick={handleSignOut}
                className="flex-shrink-0 w-full group block"
              >
                <div className="flex items-center">
                  <div>
                    <LogOut className="inline-block h-5 w-5 text-indigo-300 group-hover:text-indigo-200" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-indigo-300 group-hover:text-indigo-200">
                      Sign Out
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Stock Screener</h1>
                <button
                  onClick={loadScreenerData}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              
              {/* Display API error if any */}
              {apiError && (
                <div className="mt-2 rounded-md bg-yellow-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">{apiError}</h3>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Search and Filters */}
              <div className="bg-white shadow rounded-lg p-4 mb-6">
                <div className="mb-4">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search by symbol or company name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">Min Price ($)</label>
                    <input
                      type="number"
                      name="minPrice"
                      id="minPrice"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Max Price ($)</label>
                    <input
                      type="number"
                      name="maxPrice"
                      id="maxPrice"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="sector" className="block text-sm font-medium text-gray-700">Sector</label>
                    <select
                      id="sector"
                      name="sector"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={filters.sector}
                      onChange={handleFilterChange}
                    >
                      <option value="">All Sectors</option>
                      <option value="Technology">Technology</option>
                      <option value="Financial Services">Financial Services</option>
                      <option value="Consumer Cyclical">Consumer Cyclical</option>
                      <option value="Energy">Energy</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Automotive">Automotive</option>
                      <option value="Consumer Defensive">Consumer Defensive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="minPE" className="block text-sm font-medium text-gray-700">Min P/E Ratio</label>
                    <input
                      type="number"
                      name="minPE"
                      id="minPE"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={filters.minPE}
                      onChange={handleFilterChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="maxPE" className="block text-sm font-medium text-gray-700">Max P/E Ratio</label>
                    <input
                      type="number"
                      name="maxPE"
                      id="maxPE"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={filters.maxPE}
                      onChange={handleFilterChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="minMarketCap" className="block text-sm font-medium text-gray-700">Min Market Cap ($B)</label>
                    <input
                      type="number"
                      name="minMarketCap"
                      id="minMarketCap"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={filters.minMarketCap}
                      onChange={handleFilterChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="maxMarketCap" className="block text-sm font-medium text-gray-700">Max Market Cap ($B)</label>
                    <input
                      type="number"
                      name="maxMarketCap"
                      id="maxMarketCap"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={filters.maxMarketCap}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
              </div>

              {/* AI Analysis Section */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-indigo-500" />
                  AI Stock Analysis
                </h2>
                
                <form onSubmit={handleAIAnalysis} className="mb-4">
                  <div className="flex">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Ask about stocks, e.g., 'Which tech stocks have the best value?'"
                    />
                    <button
                      type="submit"
                      disabled={aiLoading || !aiPrompt.trim()}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {aiLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Analyze'
                      )}
                    </button>
                  </div>
                </form>
                
                {aiResponse && (
                  <div className="bg-indigo-50 p-4 rounded-md">
                    <p className="text-indigo-700 whitespace-pre-wrap">{aiResponse}</p>
                  </div>
                )}
              </div>

              {/* Stock Table */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                  <div className="text-sm text-gray-500">
                    Showing {filteredStocks.length} of {stocks.length} stocks
                  </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('symbol')}
                      >
                        <div className="flex items-center">
                          Symbol
                          {sortConfig.key === 'symbol' && (
                            sortConfig.direction === 'ascending' ? 
                              <ArrowUp className="h-4 w-4 ml-1" /> : 
                              <ArrowDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('name')}
                      >
                        <div className="flex items-center">
                          Company
                          {sortConfig.key === 'name' && (
                            sortConfig.direction === 'ascending' ? 
                              <ArrowUp className="h-4 w-4 ml-1" /> : 
                              <ArrowDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('sector')}
                      >
                        <div className="flex items-center">
                          Sector
                          {sortConfig.key === 'sector' && (
                            sortConfig.direction === 'ascending' ? 
                              <ArrowUp className="h-4 w-4 ml-1" /> : 
                              <ArrowDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('price')}
                      >
                        <div className="flex items-center">
                          Price
                          {sortConfig.key === 'price' && (
                            sortConfig.direction === 'ascending' ? 
                              <ArrowUp className="h-4 w-4 ml-1" /> : 
                              <ArrowDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('changePercent')}
                      >
                        <div className="flex items-center">
                          Change
                          {sortConfig.key === 'changePercent' && (
                            sortConfig.direction === 'ascending' ? 
                              <ArrowUp className="h-4 w-4 ml-1" /> : 
                              <ArrowDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('marketCap')}
                      >
                        <div className="flex items-center">
                          Market Cap
                          {sortConfig.key === 'marketCap' && (
                            sortConfig.direction === 'ascending' ? 
                              <ArrowUp className="h-4 w-4 ml-1" /> : 
                              <ArrowDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('pe')}
                      >
                        <div className="flex items-center">
                          P/E Ratio
                          {sortConfig.key === 'pe' && (
                            sortConfig.direction === 'ascending' ? 
                              <ArrowUp className="h-4 w-4 ml-1" /> : 
                              <ArrowDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStocks.map((stock) => (
                      <tr key={stock.symbol}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                          {stock.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {stock.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stock.sector}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${stock.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`${stock.change >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                            {stock.change >= 0 ? (
                              <ArrowUp className="h-4 w-4 mr-1" />
                            ) : (
                              <ArrowDown className="h-4 w-4 mr-1" />
                            )}
                            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${(stock.marketCap / 1000000000).toFixed(1)}B
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stock.pe.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <DollarSign className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
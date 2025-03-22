import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Loader2, 
  Search, 
  Filter, 
  // ArrowUpDown, 
  User, 
  LogOut, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Star,
  MessageSquare,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { getAIConfig } from '../lib/aiConfig';
import { generateAIResponse } from '../lib/aiService';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
  dividend: number;
}

export const Screener = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Stock>('symbol');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    sector: '',
    minPrice: '',
    maxPrice: '',
    minPE: '',
    maxPE: '',
    minDividend: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [userSettings, setUserSettings] = useState<any>(null);

  // Sample data - in a real app, this would come from an API
  const sampleStocks: Stock[] = [
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      price: 175.25,
      change: 2.50,
      changePercent: 1.45,
      marketCap: 2850000000000,
      peRatio: 28.5,
      dividend: 0.82
    },
    {
      id: '2',
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      sector: 'Technology',
      price: 310.20,
      change: 1.75,
      changePercent: 0.57,
      marketCap: 2320000000000,
      peRatio: 32.1,
      dividend: 0.94
    },
    {
      id: '3',
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      sector: 'Technology',
      price: 2850.75,
      change: -15.20,
      changePercent: -0.53,
      marketCap: 1880000000000,
      peRatio: 25.8,
      dividend: 0
    },
    {
      id: '4',
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      sector: 'Consumer Cyclical',
      price: 3150.50,
      change: -25.30,
      changePercent: -0.80,
      marketCap: 1590000000000,
      peRatio: 60.2,
      dividend: 0
    },
    {
      id: '5',
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      sector: 'Consumer Cyclical',
      price: 875.30,
      change: 32.50,
      changePercent: 3.85,
      marketCap: 880000000000,
      peRatio: 115.3,
      dividend: 0
    },
    {
      id: '6',
      symbol: 'JPM',
      name: 'JPMorgan Chase & Co.',
      sector: 'Financial Services',
      price: 152.75,
      change: 0.85,
      changePercent: 0.56,
      marketCap: 450000000000,
      peRatio: 12.1,
      dividend: 3.2
    },
    {
      id: '7',
      symbol: 'JNJ',
      name: 'Johnson & Johnson',
      sector: 'Healthcare',
      price: 165.20,
      change: -1.30,
      changePercent: -0.78,
      marketCap: 435000000000,
      peRatio: 17.5,
      dividend: 2.6
    },
    {
      id: '8',
      symbol: 'WMT',
      name: 'Walmart Inc.',
      sector: 'Consumer Defensive',
      price: 142.80,
      change: 1.20,
      changePercent: 0.85,
      marketCap: 395000000000,
      peRatio: 29.8,
      dividend: 1.5
    },
    {
      id: '9',
      symbol: 'PG',
      name: 'Procter & Gamble Co.',
      sector: 'Consumer Defensive',
      price: 145.50,
      change: 0.65,
      changePercent: 0.45,
      marketCap: 350000000000,
      peRatio: 25.3,
      dividend: 2.4
    },
    {
      id: '10',
      symbol: 'V',
      name: 'Visa Inc.',
      sector: 'Financial Services',
      price: 230.40,
      change: 3.25,
      changePercent: 1.43,
      marketCap: 495000000000,
      peRatio: 37.2,
      dividend: 0.7
    }
  ];

  useEffect(() => {
    checkUser();
    loadStocks();
    fetchUserSettings();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [stocks, searchTerm, filters, sortField, sortDirection]);

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
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

  async function loadStocks() {
    // In a real app, you would fetch from an API
    // For now, we'll use the sample data
    setStocks(sampleStocks);
    setFilteredStocks(sampleStocks);
    setLoading(false);
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  const applyFiltersAndSort = () => {
    let result = [...stocks];
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(stock => 
        stock.symbol.toLowerCase().includes(term) || 
        stock.name.toLowerCase().includes(term)
      );
    }
    
    // Apply filters
    if (filters.sector) {
      result = result.filter(stock => stock.sector === filters.sector);
    }
    
    if (filters.minPrice) {
      result = result.filter(stock => stock.price >= parseFloat(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      result = result.filter(stock => stock.price <= parseFloat(filters.maxPrice));
    }
    
    if (filters.minPE) {
      result = result.filter(stock => stock.peRatio >= parseFloat(filters.minPE));
    }
    
    if (filters.maxPE) {
      result = result.filter(stock => stock.peRatio <= parseFloat(filters.maxPE));
    }
    
    if (filters.minDividend) {
      result = result.filter(stock => stock.dividend >= parseFloat(filters.minDividend));
    }
    
    // Apply sort
    result.sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      } else {
        return sortDirection === 'asc' 
          ? (fieldA as number) - (fieldB as number) 
          : (fieldB as number) - (fieldA as number);
      }
    });
    
    setFilteredStocks(result);
  };

  const handleSort = (field: keyof Stock) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      sector: '',
      minPrice: '',
      maxPrice: '',
      minPE: '',
      maxPE: '',
      minDividend: '',
    });
    setSearchTerm('');
  };

  const sectors = Array.from(new Set(stocks.map(stock => stock.sector)));

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
        ? filteredStocks.map(s => `${s.symbol} (${s.name}): $${s.price}, PE: ${s.peRatio}, Dividend: ${s.dividend}%`).join('\n')
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">AI Investor</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/portfolio" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Portfolio
                </Link>
                <Link to="/screener" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Stock Screener
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative flex items-center space-x-4">
                <Link to="/profile" className="text-gray-500 hover:text-gray-700">
                  <User className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Stock Screener</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              {/* Search and Filter Controls */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="relative flex-1 mb-4 md:mb-0 md:mr-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Search by symbol or company name"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {showFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                    </button>
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset
                    </button>
                  </div>
                </div>

                {showFilters && (
                  <div className="mt-4 grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-2">
                      <label htmlFor="sector" className="block text-sm font-medium text-gray-700">
                        Sector
                      </label>
                      <select
                        id="sector"
                        name="sector"
                        value={filters.sector}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="">All Sectors</option>
                        {sectors.map((sector) => (
                          <option key={sector} value={sector}>
                            {sector}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                        Min Price
                      </label>
                      <input
                        type="number"
                        name="minPrice"
                        id="minPrice"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                        Max Price
                      </label>
                      <input
                        type="number"
                        name="maxPrice"
                        id="maxPrice"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Any"
                        min="0"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="minPE" className="block text-sm font-medium text-gray-700">
                        Min P/E
                      </label>
                      <input
                        type="number"
                        name="minPE"
                        id="minPE"
                        value={filters.minPE}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="maxPE" className="block text-sm font-medium text-gray-700">
                        Max P/E
                      </label>
                      <input
                        type="number"
                        name="maxPE"
                        id="maxPE"
                        value={filters.maxPE}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Any"
                        min="0"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="minDividend" className="block text-sm font-medium text-gray-700">
                        Min Dividend %
                      </label>
                      <input
                        type="number"
                        name="minDividend"
                        id="minDividend"
                        value={filters.minDividend}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="0"
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* AI Analysis Section */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-indigo-500" />
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
                        onClick={() => handleSort('symbol')}
                      >
                        <div className="flex items-center">
                          Symbol
                          {sortField === 'symbol' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-4 w-4 ml-1" /> : 
                              <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center">
                          Company
                          {sortField === 'name' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-4 w-4 ml-1" /> : 
                              <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('sector')}
                      >
                        <div className="flex items-center">
                          Sector
                          {sortField === 'sector' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-4 w-4 ml-1" /> : 
                              <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('price')}
                      >
                        <div className="flex items-center">
                          Price
                          {sortField === 'price' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-4 w-4 ml-1" /> : 
                              <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('changePercent')}
                      >
                        <div className="flex items-center">
                          Change
                          {sortField === 'changePercent' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-4 w-4 ml-1" /> : 
                              <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('marketCap')}
                      >
                        <div className="flex items-center">
                          Market Cap
                          {sortField === 'marketCap' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-4 w-4 ml-1" /> : 
                              <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('peRatio')}
                      >
                        <div className="flex items-center">
                          P/E Ratio
                          {sortField === 'peRatio' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-4 w-4 ml-1" /> : 
                              <ChevronDown className="h-4 w-4 ml-1" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('dividend')}
                      >
                        <div className="flex items-center">
                          Dividend %
                          {sortField === 'dividend' && (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="h-4 w-4 ml-1" /> : 
                              <ChevronDown className="h-4 w-4 ml-1" />
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
                      <tr key={stock.id}>
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
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${(stock.marketCap / 1000000000).toFixed(1)}B
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stock.peRatio.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stock.dividend.toFixed(2)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Star className="h-4 w-4" />
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
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Loader2, 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  User, 
  LogOut,
  Search,
  Globe,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock
} from 'lucide-react';

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

interface StockNews {
  id: string;
  title: string;
  source: string;
  url: string;
  image?: string;
  date: string;
  summary: string;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usIndices, setUsIndices] = useState<MarketIndex[]>([]);
  const [indianIndices, setIndianIndices] = useState<MarketIndex[]>([]);
  const [news, setNews] = useState<StockNews[]>([]);
  const [topGainers, setTopGainers] = useState<any[]>([]);
  const [topLosers, setTopLosers] = useState<any[]>([]);

  useEffect(() => {
    checkUser();
    loadDashboardData();
  }, []);

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

  async function loadDashboardData() {
    try {
      setRefreshing(true);
      
      // In a real app, you would fetch this data from financial APIs
      // For demo purposes, we'll use sample data
      
      // Load market indices
      setUsIndices([
        { name: 'S&P 500', value: 4892.37, change: 15.28, changePercent: 0.31 },
        { name: 'Dow Jones', value: 38239.98, change: 125.68, changePercent: 0.33 },
        { name: 'Nasdaq', value: 15451.31, change: -45.23, changePercent: -0.29 },
        { name: 'Russell 2000', value: 2025.19, change: 8.89, changePercent: 0.44 }
      ]);
      
      setIndianIndices([
        { name: 'Nifty 50', value: 22502.80, change: 152.35, changePercent: 0.68 },
        { name: 'Sensex', value: 73967.12, change: 496.37, changePercent: 0.67 },
        { name: 'Nifty Bank', value: 48235.90, change: -125.45, changePercent: -0.26 },
        { name: 'Nifty IT', value: 34125.75, change: 325.80, changePercent: 0.96 }
      ]);
      
      // Load top gainers and losers
      setTopGainers([
        { symbol: 'ADANIENT.NS', name: 'Adani Enterprises', price: 2580.45, change: 5.8 },
        { symbol: 'TATASTEEL.NS', name: 'Tata Steel', price: 145.30, change: 4.2 },
        { symbol: 'INFY.NS', name: 'Infosys', price: 1475.60, change: 3.5 },
        { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.35, change: 3.2 },
        { symbol: 'MSFT', name: 'Microsoft', price: 415.25, change: 2.8 }
      ]);
      
      setTopLosers([
        { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', price: 1245.30, change: -2.5 },
        { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', price: 1580.75, change: -1.8 },
        { symbol: 'AMZN', name: 'Amazon', price: 3250.40, change: -1.5 },
        { symbol: 'META', name: 'Meta Platforms', price: 475.20, change: -1.3 },
        { symbol: 'SBIN.NS', name: 'State Bank of India', price: 745.60, change: -1.1 }
      ]);
      
      // Load financial news
      setNews([
        {
          id: '1',
          title: 'Fed signals potential rate cuts later this year as inflation cools',
          source: 'Financial Times',
          url: '#',
          image: 'https://placehold.co/600x400/e2e8f0/475569?text=Fed+News',
          date: '2 hours ago',
          summary: 'Federal Reserve officials indicated they may begin cutting interest rates in the coming months if inflation continues to moderate, according to minutes from their latest meeting.'
        },
        {
          id: '2',
          title: 'Indian IT stocks rally on strong quarterly results and positive outlook',
          source: 'Economic Times',
          url: '#',
          image: 'https://placehold.co/600x400/e2e8f0/475569?text=IT+Stocks',
          date: '4 hours ago',
          summary: 'Major Indian IT companies including TCS, Infosys, and Wipro saw their stocks rise following better-than-expected quarterly results and optimistic guidance for the fiscal year.'
        },
        {
          id: '3',
          title: 'NVIDIA surpasses $2 trillion market cap on AI chip demand',
          source: 'Bloomberg',
          url: '#',
          image: 'https://placehold.co/600x400/e2e8f0/475569?text=NVIDIA',
          date: '6 hours ago',
          summary: 'NVIDIA\'s market value crossed $2 trillion as demand for its AI chips continues to surge, making it the third most valuable U.S. company after Microsoft and Apple.'
        },
        {
          id: '4',
          title: 'RBI maintains repo rate, signals continued focus on inflation control',
          source: 'Business Standard',
          url: '#',
          date: '8 hours ago',
          summary: 'The Reserve Bank of India kept its key policy rate unchanged at 6.5% for the seventh consecutive time, emphasizing its commitment to bringing inflation down to its 4% target.'
        },
        {
          id: '5',
          title: 'Oil prices rise on Middle East tensions and supply concerns',
          source: 'Reuters',
          url: '#',
          date: '10 hours ago',
          summary: 'Crude oil prices increased by over 2% as geopolitical tensions in the Middle East raised concerns about potential supply disruptions in the region.'
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

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
                  className="bg-indigo-900 text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md"
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
                  className="text-white hover:bg-indigo-700 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Market Dashboard</h1>
              <button
                onClick={loadDashboardData}
                className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  refreshing ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                disabled={refreshing}
              >
                <RefreshCw className={`-ml-0.5 mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Market Overview */}
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
                {/* US Market Indices */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            US Market Indices
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {new Date().toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="flow-root">
                      <ul className="-my-4 divide-y divide-gray-200">
                        {usIndices.map((index) => (
                          <li key={index.name} className="py-4">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">{index.name}</p>
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900 mr-2">
                                  {index.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <div className={`flex items-center ${
                                  index.change >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {index.change >= 0 ? (
                                    <ArrowUp className="h-4 w-4" />
                                  ) : (
                                    <ArrowDown className="h-4 w-4" />
                                  )}
                                  <span className="text-sm ml-1">
                                    {Math.abs(index.change).toFixed(2)} ({Math.abs(index.changePercent).toFixed(2)}%)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Indian Market Indices */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                        <Globe className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Indian Market Indices
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {new Date().toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="flow-root">
                      <ul className="-my-4 divide-y divide-gray-200">
                        {indianIndices.map((index) => (
                          <li key={index.name} className="py-4">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">{index.name}</p>
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900 mr-2">
                                  {index.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <div className={`flex items-center ${
                                  index.change >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {index.change >= 0 ? (
                                    <ArrowUp className="h-4 w-4" />
                                  ) : (
                                    <ArrowDown className="h-4 w-4" />
                                  )}
                                  <span className="text-sm ml-1">
                                    {Math.abs(index.change).toFixed(2)} ({Math.abs(index.changePercent).toFixed(2)}%)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Gainers and Losers */}
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Top Gainers */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                      Top Gainers
                    </h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flow-root">
                        <ul className="-my-4 divide-y divide-gray-200">
                          {topGainers.map((stock) => (
                            <li key={stock.symbol} className="py-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{stock.symbol}</p>
                                  <p className="text-sm text-gray-500">{stock.name}</p>
                                </div>
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-900 mr-2">
                                    ${stock.price.toFixed(2)}
                                  </p>
                                  <div className="flex items-center text-green-600">
                                    <ArrowUp className="h-4 w-4" />
                                    <span className="text-sm ml-1">
                                      {stock.change.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top Losers */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                      <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                      Top Losers
                    </h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flow-root">
                        <ul className="-my-4 divide-y divide-gray-200">
                          {topLosers.map((stock) => (
                            <li key={stock.symbol} className="py-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{stock.symbol}</p>
                                  <p className="text-sm text-gray-500">{stock.name}</p>
                                </div>
                                <div className="flex items-center">
                                  <p className="text-sm font-medium text-gray-900 mr-2">
                                    ${stock.price.toFixed(2)}
                                  </p>
                                  <div className="flex items-center text-red-600">
                                    <ArrowDown className="h-4 w-4" />
                                    <span className="text-sm ml-1">
                                      {Math.abs(stock.change).toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Market News */}
              <div className="mt-5">
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Latest Market News</h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <ul className="divide-y divide-gray-200">
                      {news.map((item) => (
                        <li key={item.id} className="px-4 py-4 sm:px-6">
                          <div className="flex items-start space-x-4">
                            {item.image && (
                              <div className="flex-shrink-0">
                                <img className="h-20 w-20 rounded-md object-cover" src={item.image} alt="" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <h4 className="text-base font-medium text-gray-900 truncate">{item.title}</h4>
                              <div className="mt-1 flex items-center text-sm text-gray-500">
                                <span className="truncate">{item.source}</span>
                                <span className="mx-1">&middot;</span>
                                <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <span>{item.date}</span>
                              </div>
                              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{item.summary}</p>
                              <div className="mt-2">
                                <a href={item.url} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                  Read full story
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
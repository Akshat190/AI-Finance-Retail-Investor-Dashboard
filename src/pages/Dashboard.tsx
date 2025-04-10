import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Newspaper,
  PlusCircle,
  Brain,
  ChevronRight
} from 'lucide-react';
import InvestmentTaxCalculator from '../components/InvestmentTaxCalculator';
import PortfolioManager from '../components/PortfolioManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

interface StockNews {
  id: string;
  title: string;
  url: string;
  source: string;
  date: string;
  snippet: string;
  imageUrl?: string;
}

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

interface Crypto {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  publishedAt: string;
  imageUrl?: string;
}

// Asset allocation data
interface AssetAllocation {
  label: string;
  value: number;
  color: string;
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState({
    stocks: true,
    crypto: true,
    news: true
  });
  const [refreshing, setRefreshing] = useState(false);
  const [usIndices, setUsIndices] = useState<MarketIndex[]>([]);
  const [indianIndices, setIndianIndices] = useState<MarketIndex[]>([]);
  const [news, setNews] = useState<StockNews[]>([
    {
      id: '1',
      title: 'Fed signals potential rate cuts later this year as inflation cools',
      source: 'Financial Times',
      url: '#',
      imageUrl: 'https://placehold.co/600x400/e2e8f0/475569?text=Fed+News',
      date: '2 hours ago',
      snippet: 'Federal Reserve officials indicated they may begin cutting interest rates in the coming months if inflation continues to moderate, according to minutes from their latest meeting.'
    },
    {
      id: '2',
      title: 'Indian IT stocks rally on strong quarterly results and positive outlook',
      source: 'Economic Times',
      url: '#',
      imageUrl: 'https://placehold.co/600x400/e2e8f0/475569?text=IT+Stocks',
      date: '4 hours ago',
      snippet: 'Major Indian IT companies including TCS, Infosys, and Wipro saw their stocks rise following better-than-expected quarterly results and optimistic guidance for the fiscal year.'
    },
    {
      id: '3',
      title: 'NVIDIA surpasses $2 trillion market cap on AI chip demand',
      source: 'Bloomberg',
      url: '#',
      imageUrl: 'https://placehold.co/600x400/e2e8f0/475569?text=NVIDIA',
      date: '6 hours ago',
      snippet: 'NVIDIA\'s market value crossed $2 trillion as demand for its AI chips continues to surge, making it the third most valuable U.S. company after Microsoft and Apple.'
    },
    {
      id: '4',
      title: 'RBI maintains repo rate, signals continued focus on inflation control',
      source: 'Business Standard',
      url: '#',
      date: '8 hours ago',
      snippet: 'The Reserve Bank of India kept its key policy rate unchanged at 6.5% for the seventh consecutive time, emphasizing its commitment to bringing inflation down to its 4% target.'
    },
    {
      id: '5',
      title: 'Oil prices rise on Middle East tensions and supply concerns',
      source: 'Reuters',
      url: '#',
      date: '10 hours ago',
      snippet: 'Crude oil prices increased by over 2% as geopolitical tensions in the Middle East raised concerns about potential supply disruptions in the region.'
    }
  ]);
  const [topGainers, setTopGainers] = useState<any[]>([]);
  const [topLosers, setTopLosers] = useState<any[]>([]);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [crypto, setCrypto] = useState<Crypto[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [assetAllocation, setAssetAllocation] = useState<AssetAllocation[]>([
    { label: 'Stocks', value: 65, color: '#6366F1' }, // Indigo
    { label: 'Bonds', value: 20, color: '#10B981' },  // Green
    { label: 'Crypto', value: 10, color: '#F59E0B' }, // Yellow/Amber
    { label: 'Cash', value: 5, color: '#6B7280' }     // Gray
  ]);

  // Prepare chart data
  const pieChartData = {
    labels: assetAllocation.map(asset => asset.label),
    datasets: [
      {
        data: assetAllocation.map(asset => asset.value),
        backgroundColor: assetAllocation.map(asset => asset.color),
        borderColor: assetAllocation.map(asset => asset.color),
        borderWidth: 1,
      },
    ],
  };
  
  // Chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
  };
  
  useEffect(() => {
    loadDashboardData();
    fetchCryptoData();
    fetchMarketData();
  }, []);

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
          imageUrl: 'https://placehold.co/600x400/e2e8f0/475569?text=Fed+News',
          date: '2 hours ago',
          snippet: 'Federal Reserve officials indicated they may begin cutting interest rates in the coming months if inflation continues to moderate, according to minutes from their latest meeting.'
        },
        {
          id: '2',
          title: 'Indian IT stocks rally on strong quarterly results and positive outlook',
          source: 'Economic Times',
          url: '#',
          imageUrl: 'https://placehold.co/600x400/e2e8f0/475569?text=IT+Stocks',
          date: '4 hours ago',
          snippet: 'Major Indian IT companies including TCS, Infosys, and Wipro saw their stocks rise following better-than-expected quarterly results and optimistic guidance for the fiscal year.'
        },
        {
          id: '3',
          title: 'NVIDIA surpasses $2 trillion market cap on AI chip demand',
          source: 'Bloomberg',
          url: '#',
          imageUrl: 'https://placehold.co/600x400/e2e8f0/475569?text=NVIDIA',
          date: '6 hours ago',
          snippet: 'NVIDIA\'s market value crossed $2 trillion as demand for its AI chips continues to surge, making it the third most valuable U.S. company after Microsoft and Apple.'
        },
        {
          id: '4',
          title: 'RBI maintains repo rate, signals continued focus on inflation control',
          source: 'Business Standard',
          url: '#',
          date: '8 hours ago',
          snippet: 'The Reserve Bank of India kept its key policy rate unchanged at 6.5% for the seventh consecutive time, emphasizing its commitment to bringing inflation down to its 4% target.'
        },
        {
          id: '5',
          title: 'Oil prices rise on Middle East tensions and supply concerns',
          source: 'Reuters',
          url: '#',
          date: '10 hours ago',
          snippet: 'Crude oil prices increased by over 2% as geopolitical tensions in the Middle East raised concerns about potential supply disruptions in the region.'
        }
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setRefreshing(false);
    }
  }

  async function fetchCryptoData() {
    try {
      setCryptoLoading(true);
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
            page: 1,
            sparkline: false,
            price_change_percentage: '24h'
          }
        }
      );
      setCryptoData(response.data);
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      // Fallback data in case API fails or rate limits
      setCryptoData([
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          current_price: 63245.12,
          price_change_percentage_24h: 2.35,
          market_cap: 1245678901234
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          current_price: 3456.78,
          price_change_percentage_24h: 1.23,
          market_cap: 415678901234
        },
        {
          id: 'binancecoin',
          symbol: 'bnb',
          name: 'Binance Coin',
          image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
          current_price: 567.89,
          price_change_percentage_24h: -0.45,
          market_cap: 87654321098
        }
      ]);
    } finally {
      setCryptoLoading(false);
    }
  }

  async function fetchMarketData() {
    try {
      // In a real app, you would fetch from actual APIs
      // For now, we'll use dummy data
      
      // Dummy stocks data
      const dummyStocks: Stock[] = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 175.34, change: 2.45, changePercent: 1.42 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 328.79, change: 1.23, changePercent: 0.38 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: -0.87, changePercent: -0.61 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 132.45, change: 3.21, changePercent: 2.48 },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.67, change: -5.43, changePercent: -2.16 }
      ];
      
      // Dummy crypto data
      const dummyCrypto: Crypto[] = [
        { symbol: 'BTC', name: 'Bitcoin', price: 42567.89, change: 1234.56, changePercent: 2.98, marketCap: 824.5 },
        { symbol: 'ETH', name: 'Ethereum', price: 2345.67, change: 87.65, changePercent: 3.87, marketCap: 281.3 },
        { symbol: 'BNB', name: 'Binance Coin', price: 345.67, change: -12.34, changePercent: -3.45, marketCap: 53.2 },
        { symbol: 'SOL', name: 'Solana', price: 98.76, change: 5.43, changePercent: 5.82, marketCap: 42.1 },
        { symbol: 'ADA', name: 'Cardano', price: 0.45, change: 0.02, changePercent: 4.65, marketCap: 15.8 }
      ];
      
      // Dummy news data
      const dummyNews: NewsItem[] = [
        {
          id: '1',
          title: 'Fed Signals Potential Rate Cuts as Inflation Eases',
          summary: 'The Federal Reserve indicated it may begin cutting interest rates soon as inflation shows signs of cooling.',
          url: '#',
          source: 'Financial Times',
          publishedAt: '2023-07-15T14:30:00Z',
          imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: '2',
          title: 'Tech Stocks Rally on Strong Earnings Reports',
          summary: 'Major technology companies reported better-than-expected quarterly earnings, driving a market rally.',
          url: '#',
          source: 'Wall Street Journal',
          publishedAt: '2023-07-14T18:45:00Z',
          imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        },
        {
          id: '3',
          title: 'Bitcoin Surges Past $40,000 as Institutional Adoption Grows',
          summary: 'Bitcoin prices have surged as more institutional investors add the cryptocurrency to their portfolios.',
          url: '#',
          source: 'Bloomberg',
          publishedAt: '2023-07-13T09:15:00Z',
          imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
        }
      ];
      
      setStocks(dummyStocks);
      setCrypto(dummyCrypto);
      setNewsItems(dummyNews);
      
      // Update loading state
      setLoading({
        stocks: false,
        crypto: false,
        news: false
      });
      
      // Log to confirm data is loaded
      console.log("Dashboard data loaded:", { stocks: dummyStocks, crypto: dummyCrypto, news: dummyNews });
    } catch (error) {
      console.error('Error fetching market data:', error);
      toast.error('Failed to load market data');
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  if (loading.stocks || loading.crypto || loading.news) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with logout button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Portfolio Value Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2">
            <h2 className="text-sm font-semibold text-white flex items-center">
              <DollarSign className="h-4 w-4 mr-1.5" />
              Portfolio Value
            </h2>
          </div>
          <div className="p-5">
            <div className="flex flex-col">
              <p className="text-3xl font-bold text-gray-900">$124,567.89</p>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-green-600 flex items-center font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +$1,234.56 (1.2%)
                </span>
                <span className="text-gray-500 ml-2">Today</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 rounded-md p-2">
                  <span className="text-gray-500">Initial Investment</span>
                  <p className="text-gray-900 font-semibold">$110,000.00</p>
                </div>
                <div className="bg-gray-50 rounded-md p-2">
                  <span className="text-gray-500">Total Gain</span>
                  <p className="text-green-600 font-semibold">$14,567.89</p>
                </div>
              </div>
              <div className="w-full mt-4">
                <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200">
                  <div style={{ width: "13.2%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                </div>
                <p className="text-xs text-gray-500 text-right">+13.2% overall return</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Asset Allocation Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2">
            <h2 className="text-sm font-semibold text-white flex items-center">
              <PieChart className="h-4 w-4 mr-1.5" />
              Asset Allocation
            </h2>
          </div>
          <div className="p-5">
            <div className="h-40 mt-1 mb-2">
              <Pie data={pieChartData} options={pieChartOptions} />
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2">
              {assetAllocation.map((asset) => (
                <div key={asset.label} className="flex items-center text-xs">
                  <div 
                    className="w-3 h-3 rounded-full mr-1.5" 
                    style={{ backgroundColor: asset.color }}
                  ></div>
                  <span className="text-gray-700">{asset.label}:</span>
                  <span className="ml-auto font-semibold">{asset.value}%</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 text-xs px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center justify-center">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Rebalance Portfolio
            </button>
          </div>
        </div>
        
        {/* Watchlist Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 flex justify-between items-center">
            <h2 className="text-sm font-semibold text-white flex items-center">
              <BarChart2 className="h-4 w-4 mr-1.5" />
              Watchlist
            </h2>
            <button className="text-white opacity-80 hover:opacity-100 text-xs">
              View All
            </button>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs text-gray-500 px-1">
                <span>Symbol</span>
                <div className="flex space-x-4">
                  <span>Price</span>
                  <span>24h</span>
                </div>
              </div>
              {(stocks.length > 0 ? stocks : [
                {symbol: 'AAPL', name: 'Apple Inc.', price: 175.34, change: 1.42, changePercent: 1.42},
                {symbol: 'MSFT', name: 'Microsoft Corp.', price: 328.79, change: 0.38, changePercent: 0.38},
                {symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.56, change: -0.61, changePercent: -0.61},
                {symbol: 'AMZN', name: 'Amazon.com Inc.', price: 173.25, change: 0.88, changePercent: 0.88}
              ]).slice(0, 4).map((stock) => (
                <div key={stock.symbol} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-xs font-bold text-gray-700 mr-2">
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{stock.symbol}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[110px]">{stock.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">${stock.price.toFixed(2)}</p>
                    <p className={`text-xs ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'} flex items-center justify-end`}>
                      {stock.changePercent >= 0 ? <ArrowUp className="h-3 w-3 mr-0.5" /> : <ArrowDown className="h-3 w-3 mr-0.5" />}
                      {Math.abs(stock.changePercent).toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-2 text-xs px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center justify-center">
              <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
              Add to Watchlist
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Tabs */}
      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="portfolio">Portfolio Manager</TabsTrigger>
          <TabsTrigger value="calculator">Investment Calculator</TabsTrigger>
          <TabsTrigger value="market">Market Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio">
          <PortfolioManager />
        </TabsContent>
        
        <TabsContent value="calculator">
          <InvestmentTaxCalculator />
        </TabsContent>
        
        <TabsContent value="market">
          {/* Market Trends Tab Content */}
          <div className="space-y-8">
            {/* Market Overview */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Market Overview</h2>
                <BarChart2 className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">S&P 500</span>
                    <div className="flex items-center">
                      <span className="font-medium">4,587.32</span>
                      <span className="ml-2 text-green-600 flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        1.2%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dow Jones</span>
                    <div className="flex items-center">
                      <span className="font-medium">35,432.67</span>
                      <span className="ml-2 text-green-600 flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        0.8%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nasdaq</span>
                    <div className="flex items-center">
                      <span className="font-medium">14,765.23</span>
                      <span className="ml-2 text-red-600 flex items-center text-sm">
                        <TrendingDown className="h-4 w-4 mr-1" />
                        0.3%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">10Y Treasury</span>
                    <div className="flex items-center">
                      <span className="font-medium">3.45%</span>
                      <span className="ml-2 text-red-600 flex items-center text-sm">
                        <TrendingDown className="h-4 w-4 mr-1" />
                        0.05%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">VIX</span>
                    <div className="flex items-center">
                      <span className="font-medium">18.34</span>
                      <span className="ml-2 text-green-600 flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        2.1%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gold</span>
                    <div className="flex items-center">
                      <span className="font-medium">$1,876.45</span>
                      <span className="ml-2 text-green-600 flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        0.6%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Crude Oil</span>
                    <div className="flex items-center">
                      <span className="font-medium">$78.32</span>
                      <span className="ml-2 text-red-600 flex items-center text-sm">
                        <TrendingDown className="h-4 w-4 mr-1" />
                        1.2%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">EUR/USD</span>
                    <div className="flex items-center">
                      <span className="font-medium">1.0845</span>
                      <span className="ml-2 text-green-600 flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        0.3%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Bitcoin</span>
                    <div className="flex items-center">
                      <span className="font-medium">$42,567</span>
                      <span className="ml-2 text-green-600 flex items-center text-sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        2.9%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stocks Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Stocks</h2>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% Change</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loading.stocks ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                            </div>
                          </td>
                        </tr>
                      ) : stocks.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                            No stock data available
                          </td>
                        </tr>
                      ) : (
                        stocks.map((stock) => (
                          <tr key={stock.symbol} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stock.symbol}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${stock.price.toFixed(2)}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Crypto Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <span className="text-gray-600">Cryptocurrencies</span>
              </div>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% Change</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap (B)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loading.crypto ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center">
                            <div className="flex justify-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                            </div>
                          </td>
                        </tr>
                      ) : crypto.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            No cryptocurrency data available
                          </td>
                        </tr>
                      ) : (
                        crypto.map((coin) => (
                          <tr key={coin.symbol} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{coin.symbol}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{coin.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${coin.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {coin.change >= 0 ? '+' : ''}${Math.abs(coin.change).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${coin.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {coin.changePercent >= 0 ? '+' : ''}{coin.changePercent.toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${coin.marketCap.toFixed(1)}B</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Financial News */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <span className="text-gray-600">Financial News</span>
              </div>
              {loading.news ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : news.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                  No financial news available
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {news.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.title} className="w-full h-40 object-cover" />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{item.snippet}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{item.source}</span>
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-3 inline-block text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Read more →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Market Trends Analysis */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Market Trends Analysis
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Sector Performance */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-md font-medium text-gray-900">Sector Performance</h3>
                    <span className="text-xs text-gray-500">Last 24 hours</span>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { sector: 'Technology', change: 2.4, stocks: ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'AMD', 'INTC'] },
                      { sector: 'Healthcare', change: 1.2, stocks: ['JNJ', 'PFE', 'UNH', 'ABBV', 'MRK', 'ABT'] },
                      { sector: 'Financials', change: -0.8, stocks: ['JPM', 'BAC', 'GS', 'WFC', 'C', 'MS'] },
                      { sector: 'Energy', change: -1.5, stocks: ['XOM', 'CVX', 'COP', 'BP', 'SLB', 'OXY'] },
                      { sector: 'Consumer Staples', change: 0.3, stocks: ['PG', 'KO', 'PEP', 'WMT', 'COST', 'CL'] },
                      { sector: 'Communication Services', change: 1.6, stocks: ['META', 'GOOG', 'NFLX', 'DIS', 'CMCSA', 'VZ'] }
                    ].map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className={`w-2 h-10 rounded-full mr-3 ${item.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <div>
                              <h4 className="font-medium text-gray-900">{item.sector}</h4>
                              <div className="flex flex-wrap items-center mt-1">
                                {item.stocks.map((stock, idx) => (
                                  <span key={idx} className="text-xs bg-gray-200 text-gray-700 rounded px-1.5 py-0.5 mr-1 mb-1">
                                    {stock}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className={`text-lg font-semibold ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {item.change >= 0 ? '+' : ''}{item.change}%
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${item.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(Math.abs(item.change) * 10, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Market Analysis */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-md font-medium text-gray-900">AI Market Analysis</h3>
                    <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">AI Generated</span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100">
                    <div className="flex items-start mb-4">
                      <div className="bg-indigo-100 p-2 rounded-full mr-3">
                        <Brain className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Market Outlook</h4>
                        <p className="text-sm text-gray-700">
                          Based on current market conditions, our AI analysis suggests a <span className="font-medium text-indigo-700">cautiously optimistic</span> outlook for the next quarter.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Technology and healthcare</span> sectors show strong momentum
                        </p>
                      </div>
                      <div className="flex items-center">
                        <TrendingDown className="h-4 w-4 text-red-600 mr-2" />
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Energy stocks</span> face headwinds due to commodity price fluctuations
                        </p>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Inflation concerns</span> are moderating
                        </p>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Federal Reserve</span> potentially shifting toward more accommodative policy
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button className="flex items-center text-xs text-indigo-600 hover:text-indigo-800 transition-colors">
                        View detailed report
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Market Movers */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-md font-medium text-gray-900">Market Movers</h3>
                    <span className="text-xs text-gray-500">Today's biggest changes</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-green-50 px-4 py-2 border-b border-gray-200">
                        <h4 className="text-sm font-medium text-green-800 flex items-center">
                          <ArrowUp className="h-4 w-4 mr-1" />
                          Top Gainers
                        </h4>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {[
                          { symbol: 'NVDA', name: 'NVIDIA Corp', change: 5.8 },
                          { symbol: 'PLTR', name: 'Palantir Technologies', change: 4.7 },
                          { symbol: 'AMD', name: 'Advanced Micro Devices', change: 4.1 },
                          { symbol: 'AAPL', name: 'Apple Inc', change: 3.2 },
                          { symbol: 'TSLA', name: 'Tesla Inc', change: 2.9 }
                        ].map((stock, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50">
                            <div>
                              <div className="font-medium">{stock.symbol}</div>
                              <div className="text-xs text-gray-500">{stock.name}</div>
                            </div>
                            <div className="text-green-600 font-medium">+{stock.change}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-red-50 px-4 py-2 border-b border-gray-200">
                        <h4 className="text-sm font-medium text-red-800 flex items-center">
                          <ArrowDown className="h-4 w-4 mr-1" />
                          Top Losers
                        </h4>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {[
                          { symbol: 'XOM', name: 'Exxon Mobil', change: 2.3 },
                          { symbol: 'MRK', name: 'Merck & Co', change: 1.8 },
                          { symbol: 'CVX', name: 'Chevron Corporation', change: 1.7 },
                          { symbol: 'WMT', name: 'Walmart Inc', change: 1.5 },
                          { symbol: 'JNJ', name: 'Johnson & Johnson', change: 1.3 }
                        ].map((stock, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50">
                            <div>
                              <div className="font-medium">{stock.symbol}</div>
                              <div className="text-xs text-gray-500">{stock.name}</div>
                            </div>
                            <div className="text-red-600 font-medium">-{stock.change}%</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
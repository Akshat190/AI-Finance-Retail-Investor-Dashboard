import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import axios from 'axios';
import { toast } from 'react-hot-toast';
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
  pe: number | null;
  sector: string;
  additionalInfo?: {
    type?: string;
    rating?: number;
    riskLevel?: string;
    expenseRatio?: number;
  };
}

// Add a helper function to determine if a stock is a special asset
const isSpecialAsset = (stock: ScreenerStock): boolean => {
  return stock.sector === 'Mutual Fund' || stock.sector === 'Precious Metals';
};

// Add a special component to render mutual funds or precious metals
const SpecialAssetInfo = ({ stock }: { stock: ScreenerStock }) => {
  if (stock.sector === 'Mutual Fund') {
    // For mutual funds, show the NAV and other fund-specific details
    return (
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <span className="font-medium">Type:</span>
          <span className="ml-1">Mutual Fund</span>
        </div>
        <div className="flex items-center mt-0.5">
          <span className="font-medium">NAV:</span>
          <span className="ml-1">${stock.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center mt-0.5">
          <span className="font-medium">AUM:</span>
          <span className="ml-1">${(stock.marketCap / 1000000000).toFixed(1)}B</span>
        </div>
        {stock.additionalInfo?.expenseRatio && (
          <div className="flex items-center mt-0.5">
            <span className="font-medium">Expense Ratio:</span>
            <span className="ml-1">{stock.additionalInfo.expenseRatio}%</span>
          </div>
        )}
        {stock.additionalInfo?.riskLevel && (
          <div className="flex items-center mt-0.5">
            <span className="font-medium">Risk:</span>
            <span className="ml-1">{stock.additionalInfo.riskLevel}</span>
          </div>
        )}
      </div>
    );
  }
  
  if (stock.sector === 'Precious Metals') {
    // For precious metals, show specific commodity details
    return (
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <span className="font-medium">Type:</span>
          <span className="ml-1">Precious Metal</span>
        </div>
        <div className="flex items-center mt-0.5">
          <span className="font-medium">Price (oz):</span>
          <span className="ml-1">${stock.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center mt-0.5">
          <span className="font-medium">YTD Change:</span>
          <span className={`ml-1 ${stock.symbol === 'GOLD' ? 'text-green-600' : 'text-green-600'}`}>
            {stock.symbol === 'GOLD' ? '+15.95%' : '+33.68%'}
          </span>
        </div>
        <div className="flex items-center mt-0.5">
          <span className="font-medium">24h Volume:</span>
          <span className="ml-1">${(stock.volume / 1000000000).toFixed(1)}B</span>
        </div>
      </div>
    );
  }
  
  return null;
};

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
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

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
      }
    } catch (error) {
      console.error('Error checking user:', error);
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
      setRefreshing(true);
      setApiError(null);
      
      // Use a free API key or fallback to sample data
      // For demo purposes, we'll use a sample data approach
      
      // Uncomment and replace with your actual API key when you have one
      // const apiKey = 'YOUR_ACTUAL_API_KEY';
      // try {
      //   const response = await axios.get(
      //     `https://financialmodelingprep.com/api/v3/quote/AAPL,MSFT,GOOGL,AMZN,META,TSLA,NVDA,JPM,V,JNJ?apikey=${apiKey}`
      //   );
      //   const transformedData = response.data.map(item => ({
      //     symbol: item.symbol,
      //     name: item.name,
      //     price: item.price,
      //     change: item.change,
      //     changePercent: item.changesPercentage,
      //     marketCap: item.marketCap,
      //     volume: item.volume,
      //     pe: item.pe || 0,
      //     sector: item.sector || 'Unknown'
      //   }));
      //   setStocks(transformedData);
      // } catch (apiError) {
      //   console.error('API error:', apiError);
      //   setApiError('Could not fetch stock data. Using sample data instead.');
      //   // Fall back to sample data
      // }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
          name: 'Procter & Gamble Co.',
          price: 142.90,
          change: -0.85,
          changesPercentage: -0.59,
          marketCap: 350000000000,
          volume: 6543200,
          pe: 25.7,
          sector: 'Consumer Defensive'
        },
        {
          symbol: 'MA',
          name: 'Mastercard Inc.',
          price: 362.80,
          change: 5.45,
          changesPercentage: 1.52,
          marketCap: 355000000000,
          volume: 3214500,
          pe: 33.4,
          sector: 'Financial Services'
        },
        {
          symbol: 'HD',
          name: 'Home Depot Inc.',
          price: 318.50,
          change: -2.80,
          changesPercentage: -0.87,
          marketCap: 320000000000,
          volume: 4325600,
          pe: 21.3,
          sector: 'Consumer Cyclical'
        },
        {
          symbol: 'DIS',
          name: 'Walt Disney Co.',
          price: 176.25,
          change: 3.45,
          changesPercentage: 2.00,
          marketCap: 320000000000,
          volume: 9876500,
          pe: 35.9,
          sector: 'Communication Services'
        },
        // Additional US Stocks
        {
          symbol: 'NFLX',
          name: 'Netflix, Inc.',
          price: 628.75,
          change: 12.30,
          changesPercentage: 1.99,
          marketCap: 275000000000,
          volume: 3876500,
          pe: 42.3,
          sector: 'Communication Services'
        },
        {
          symbol: 'AMD',
          name: 'Advanced Micro Devices, Inc.',
          price: 157.82,
          change: 3.24,
          changesPercentage: 2.10,
          marketCap: 254000000000,
          volume: 45327800,
          pe: 36.8,
          sector: 'Technology'
        },
        {
          symbol: 'PYPL',
          name: 'PayPal Holdings, Inc.',
          price: 62.45,
          change: -1.53,
          changesPercentage: -2.39,
          marketCap: 66300000000,
          volume: 12345600,
          pe: 17.2,
          sector: 'Financial Services'
        },
        {
          symbol: 'SBUX',
          name: 'Starbucks Corporation',
          price: 78.92,
          change: 0.75,
          changesPercentage: 0.96,
          marketCap: 89500000000,
          volume: 8765400,
          pe: 21.8,
          sector: 'Consumer Cyclical'
        },
        {
          symbol: 'COST',
          name: 'Costco Wholesale Corporation',
          price: 873.65,
          change: 5.28,
          changesPercentage: 0.61,
          marketCap: 387500000000,
          volume: 1876500,
          pe: 49.2,
          sector: 'Consumer Defensive'
        },
        {
          symbol: 'CVX',
          name: 'Chevron Corporation',
          price: 142.87,
          change: -2.35,
          changesPercentage: -1.62,
          marketCap: 267400000000,
          volume: 7654300,
          pe: 12.5,
          sector: 'Energy'
        },
        
        // Indian Stocks
        {
          symbol: 'RELIANCE.NS',
          name: 'Reliance Industries Limited',
          price: 2978.35,
          change: 42.65,
          changesPercentage: 1.45,
          marketCap: 20150000000000,
          volume: 8765430,
          pe: 31.2,
          sector: 'Energy'
        },
        {
          symbol: 'TCS.NS',
          name: 'Tata Consultancy Services Limited',
          price: 3652.80,
          change: -15.45,
          changesPercentage: -0.42,
          marketCap: 13400000000000,
          volume: 2345670,
          pe: 28.7,
          sector: 'Technology'
        },
        {
          symbol: 'INFY.NS',
          name: 'Infosys Limited',
          price: 1478.25,
          change: 28.35,
          changesPercentage: 1.96,
          marketCap: 6120000000000,
          volume: 4567890,
          pe: 24.3,
          sector: 'Technology'
        },
        {
          symbol: 'HDFCBANK.NS',
          name: 'HDFC Bank Limited',
          price: 1589.60,
          change: 12.75,
          changesPercentage: 0.81,
          marketCap: 8950000000000,
          volume: 3456780,
          pe: 18.6,
          sector: 'Financial Services'
        },
        {
          symbol: 'BHARTIARTL.NS',
          name: 'Bharti Airtel Limited',
          price: 1248.75,
          change: -6.85,
          changesPercentage: -0.55,
          marketCap: 6980000000000,
          volume: 2345670,
          pe: 26.4,
          sector: 'Communication Services'
        },
        {
          symbol: 'BAJFINANCE.NS',
          name: 'Bajaj Finance Limited',
          price: 7245.30,
          change: 145.65,
          changesPercentage: 2.05,
          marketCap: 4380000000000,
          volume: 1234560,
          pe: 35.8,
          sector: 'Financial Services'
        },
        {
          symbol: 'TATAMOTORS.NS',
          name: 'Tata Motors Limited',
          price: 798.45,
          change: 15.30,
          changesPercentage: 1.95,
          marketCap: 2670000000000,
          volume: 9876540,
          pe: 22.3,
          sector: 'Automotive'
        },
        {
          symbol: 'ASIANPAINT.NS',
          name: 'Asian Paints Limited',
          price: 3142.90,
          change: -28.55,
          changesPercentage: -0.90,
          marketCap: 3010000000000,
          volume: 1234560,
          pe: 62.4,
          sector: 'Consumer Cyclical'
        },
        {
          symbol: 'WIPRO.NS',
          name: 'Wipro Limited',
          price: 485.75,
          change: 8.25,
          changesPercentage: 1.73,
          marketCap: 2510000000000,
          volume: 5432100,
          pe: 19.8,
          sector: 'Technology'
        },
        {
          symbol: 'SUNPHARMA.NS',
          name: 'Sun Pharmaceutical Industries Limited',
          price: 1375.40,
          change: -5.65,
          changesPercentage: -0.41,
          marketCap: 3300000000000,
          volume: 2345670,
          pe: 33.2,
          sector: 'Healthcare'
        },
        
        // Gold & Silver
        {
          symbol: 'GOLD',
          name: 'Gold (per oz)',
          price: 2329.45,
          change: 12.35,
          changesPercentage: 0.53,
          marketCap: 12000000000000, // Approximate global gold market
          volume: 148500000000,
          pe: null,
          sector: 'Precious Metals'
        },
        {
          symbol: 'SILVER',
          name: 'Silver (per oz)',
          price: 27.48,
          change: 0.32,
          changesPercentage: 1.18,
          marketCap: 1400000000000, // Approximate global silver market
          volume: 6200000000,
          pe: null,
          sector: 'Precious Metals'
        },
        
        // Mutual Funds
        {
          symbol: 'VFIAX',
          name: 'Vanguard 500 Index Fund',
          price: 439.67, // NAV
          change: 4.25,
          changesPercentage: 0.97,
          marketCap: 325400000000, // AUM
          volume: 1250000,
          pe: null,
          sector: 'Mutual Fund'
        },
        {
          symbol: 'FCNTX',
          name: 'Fidelity Contrafund',
          price: 15.34, // NAV
          change: 0.18,
          changesPercentage: 1.19,
          marketCap: 98600000000, // AUM
          volume: 890000,
          pe: null,
          sector: 'Mutual Fund'
        },
        {
          symbol: 'HDFCMID',
          name: 'HDFC Midcap Opportunities Fund',
          price: 98.45, // NAV
          change: 1.35,
          changesPercentage: 1.39,
          marketCap: 32500000000, // AUM
          volume: 750000,
          pe: null,
          sector: 'Mutual Fund'
        },
        {
          symbol: 'MAEBL',
          name: 'Mirae Asset Emerging Bluechip',
          price: 78.32, // NAV
          change: 0.95,
          changesPercentage: 1.23,
          marketCap: 24100000000, // AUM
          volume: 620000,
          pe: null,
          sector: 'Mutual Fund'
        }
      ];
      
      // Update the mappedStocks part to include additional information for special assets
      const mappedStocks: ScreenerStock[] = sampleStockData.map(stock => {
        const baseStock = {
          symbol: stock.symbol,
          name: stock.name,
          price: stock.price,
          change: stock.change,
          changePercent: stock.changesPercentage,
          marketCap: stock.marketCap,
          volume: stock.volume,
          pe: stock.pe,
          sector: stock.sector
        };
        
        // Add additional info for mutual funds
        if (stock.sector === 'Mutual Fund') {
          let riskLevel = 'Moderate';
          let expenseRatio = 0.75;
          
          // Set specific values for known funds
          if (stock.symbol === 'VFIAX') {
            riskLevel = 'Moderate';
            expenseRatio = 0.04;
          } else if (stock.symbol === 'FCNTX') {
            riskLevel = 'Moderate';
            expenseRatio = 0.85;
          } else if (stock.symbol === 'HDFCMID') {
            riskLevel = 'High';
            expenseRatio = 1.45;
          } else if (stock.symbol === 'MAEBL') {
            riskLevel = 'High';
            expenseRatio = 1.65;
          }
          
          return {
            ...baseStock,
            additionalInfo: {
              type: 'Mutual Fund',
              riskLevel,
              expenseRatio
            }
          };
        }
        
        // Add additional info for precious metals
        if (stock.sector === 'Precious Metals') {
          return {
            ...baseStock,
            additionalInfo: {
              type: 'Precious Metal'
            }
          };
        }
        
        return baseStock;
      });
      
      setStocks(mappedStocks);
      toast.success("Stock data refreshed successfully");
    } catch (error) {
      console.error('Error loading screener data:', error);
      setApiError('Failed to load stock data. Please try again later.');
      toast.error("Failed to refresh stock data");
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

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
      
      // Set provider to openrouter to use the Qwen model
      const preferredProvider = 'openrouter';
      
      // Use the provided OpenRouter API key
      const apiKey = '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';
      
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
      
      try {
        // Make the actual API call
      const response = await generateAIResponse(messages, config);
      setAiResponse(response);
      } catch (apiError) {
        console.error('Error calling AI API:', apiError);
        
        // Fallback to mock responses if API call fails
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call delay
        
        const mockResponses = {
          growth: "Based on the current market data, technology and clean energy sectors show promising growth potential. Among your filtered stocks, NVDA and TSLA have demonstrated strong revenue growth trajectories. Consider evaluating their recent quarterly reports for sustainability of this growth rate.",
          undervalued: "Several stocks appear potentially undervalued based on traditional metrics. JPM stands out with a P/E of 12.5, well below the financial sector average. GOOGL also shows value characteristics with recent price drops despite strong fundamentals.",
          compare: "Comparing the tech giants:\n\n• AAPL: Strong cash position, mature product cycle, steady dividends\n• MSFT: Cloud leadership, diversified revenue streams, higher growth\n• GOOGL: Advertising dominance, AI investments, lower P/E ratio\n\nMSFT currently shows the most promising combination of growth and stability.",
          dividends: "For dividend focus, consider JNJ and PG with their strong dividend histories and defensive characteristics. Financial stocks like JPM also offer attractive yields with potential for dividend growth as interest rates stabilize.",
          general: "Looking at your filtered stocks, there's a diverse mix of growth and value opportunities. Technology stocks like AAPL, MSFT and NVDA continue to show strength despite market volatility. Consider a balanced approach with exposure to both growth sectors and defensive stocks like JNJ to manage risk.",
          mutualFunds: "For mutual fund investments, consider these top performers:\n\n• Vanguard S&P 500 ETF (VOO): Low expense ratio, broad market exposure\n• Fidelity Contrafund (FCNTX): Strong growth focus with solid historical returns\n• T. Rowe Price Blue Chip Growth (TRBCX): Quality large-cap growth stocks\n• Vanguard Total Bond Market ETF (BND): Solid fixed income exposure\n\nFor Indian investors, consider HDFC Midcap Opportunities and Mirae Asset Emerging Bluechip for domestic exposure.",
          preciousMetals: "Gold and silver present different investment opportunities:\n\n• Gold: Traditional safe-haven asset, currently showing strength amid economic uncertainty. Consider 5-10% allocation for portfolio diversification.\n\n• Silver: More industrial applications than gold, potentially higher upside during economic recovery but with greater volatility.\n\nBoth can be accessed via physical holdings, ETFs (GLD, SLV), or mining stocks. In the current environment, a slight preference for gold makes sense for stability.",
          marketComparison: "Comparing Indian vs US stock markets:\n\n• Indian market: Higher growth potential with GDP growth expectations of 6-7%. More volatile but potential for higher returns. SENSEX has shown strong performance in recent years.\n\n• US market: More established, deeper liquidity, and global reach. S&P 500 has historically delivered ~10% average annual returns.\n\nConsider a mix of both markets for diversification. US for stability and global exposure, India for growth potential.",
          balancedPortfolio: "For a balanced portfolio approach:\n\n• Core (50-60%): Quality large-cap stocks across sectors (mix of US/India)\n• Growth (15-20%): Select high-potential mid-caps and thematic investments\n• Income (10-15%): Dividend stocks and investment-grade bonds\n• Alternative (10-15%): Gold, REITs, and selective international exposure\n\nThis structure provides growth potential while managing volatility and generating some income. Adjust allocations based on your time horizon and risk tolerance."
        };
        
        // Choose response based on prompt keywords
        let response = mockResponses.general;
        const lowercasePrompt = aiPrompt.toLowerCase();
        
        if (lowercasePrompt.includes('growth') || lowercasePrompt.includes('potential')) {
          response = mockResponses.growth;
        } else if (lowercasePrompt.includes('undervalued') || lowercasePrompt.includes('value')) {
          response = mockResponses.undervalued;
        } else if (lowercasePrompt.includes('compare') && (lowercasePrompt.includes('aapl') || lowercasePrompt.includes('msft') || lowercasePrompt.includes('tech'))) {
          response = mockResponses.compare;
        } else if (lowercasePrompt.includes('dividend')) {
          response = mockResponses.dividends;
        } else if (lowercasePrompt.includes('mutual fund')) {
          response = mockResponses.mutualFunds;
        } else if (lowercasePrompt.includes('gold') || lowercasePrompt.includes('silver') || lowercasePrompt.includes('precious metal')) {
          response = mockResponses.preciousMetals;
        } else if ((lowercasePrompt.includes('india') && lowercasePrompt.includes('us')) || lowercasePrompt.includes('market comparison')) {
          response = mockResponses.marketComparison;
        } else if (lowercasePrompt.includes('balanced') || lowercasePrompt.includes('portfolio') || lowercasePrompt.includes('allocation')) {
          response = mockResponses.balancedPortfolio;
        }
        
        setAiResponse(response);
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      setAiResponse('Sorry, there was an error generating the AI analysis. Please try again later.');
    } finally {
      setAiLoading(false);
    }
  };

  // View Details handler
  const handleViewDetails = (stock: ScreenerStock) => {
    // Here you would implement actual details view
    // For now, we'll just show a toast notification
    toast.info(`Viewing details for ${stock.symbol}`);
    // In a real app, this might navigate to a stock details page:
    // navigate(`/stock/${stock.symbol}`);
  };
  
  // Add to Watchlist handler
  const handleAddToWatchlist = async (stock: ScreenerStock) => {
    try {
      // Here you would save to the watchlist - either in database or localStorage
      // For demo, we'll just show a success toast
      toast.success(`${stock.symbol} added to watchlist`);
      
      // Example of what this might look like with a real backend:
      /* 
      if (user) {
        const { error } = await supabase
          .from('watchlist')
          .insert([
            { 
              user_id: user.id, 
              symbol: stock.symbol,
              name: stock.name,
              added_at: new Date()
            }
          ]);
          
        if (error) throw error;
        toast.success(`${stock.symbol} added to watchlist`);
      } else {
        // For non-logged in users, could use localStorage
        const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        watchlist.push({
          symbol: stock.symbol,
          name: stock.name,
          added_at: new Date()
        });
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        toast.success(`${stock.symbol} added to watchlist`);
      }
      */
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      toast.error('Failed to add to watchlist');
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main content */}
      <div className="flex flex-col w-full">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
                  Stock Screener
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Find and filter stocks based on your investment criteria
                </p>
            </div>
              
              <div className="mt-4 md:mt-0 flex items-center gap-3">
              <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-3.5 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Filter className="h-4 w-4 mr-1.5" />
                  Reset Filters
              </button>
                
                <button
                  onClick={loadScreenerData}
                  className="inline-flex items-center px-3.5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Data
                </button>
              </div>
              </div>
              
              {/* Display API error if any */}
              {apiError && (
              <div className="mt-2 rounded-md bg-yellow-50 dark:bg-yellow-900/30 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">{apiError}</h3>
                    </div>
                  </div>
                </div>
              )}
            
              {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden mb-6">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  {/* Search input */}
                  <div className="w-full">
                    <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 py-2.5 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      placeholder="Search by symbol or company name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                  {/* Sector filter */}
                  <div className="sm:w-1/3">
                    <select
                      id="sector"
                      name="sector"
                      className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                      <option value="Precious Metals">Precious Metals</option>
                      <option value="Mutual Fund">Mutual Fund</option>
                    </select>
                  </div>
                </div>
                
                {/* Expandable filters */}
                <div className="mt-4">
                  <details className="group">
                    <summary className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                      <Filter className="h-4 w-4 mr-2 text-gray-500" />
                      Advanced Filters
                      <svg className="h-5 w-5 ml-2 text-gray-500 group-open:rotate-180 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </summary>
                    
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range ($)</label>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-1/2">
                    <input
                      type="number"
                      name="minPrice"
                      id="minPrice"
                              placeholder="Min"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                    />
                  </div>
                          <div className="w-1/2">
                    <input
                      type="number"
                      name="maxPrice"
                      id="maxPrice"
                              placeholder="Max"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                    />
                  </div>
                        </div>
                  </div>
                  
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <label htmlFor="minPE" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">P/E Ratio</label>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-1/2">
                    <input
                      type="number"
                      name="minPE"
                      id="minPE"
                              placeholder="Min"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      value={filters.minPE}
                      onChange={handleFilterChange}
                    />
                  </div>
                          <div className="w-1/2">
                    <input
                      type="number"
                      name="maxPE"
                      id="maxPE"
                              placeholder="Max"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      value={filters.maxPE}
                      onChange={handleFilterChange}
                    />
                          </div>
                        </div>
                  </div>
                  
                      <div className="flex flex-col">
                        <div className="flex items-center justify-between">
                          <label htmlFor="minMarketCap" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Market Cap ($B)</label>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-1/2">
                    <input
                      type="number"
                      name="minMarketCap"
                      id="minMarketCap"
                              placeholder="Min"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      value={filters.minMarketCap}
                      onChange={handleFilterChange}
                    />
                  </div>
                          <div className="w-1/2">
                    <input
                      type="number"
                      name="maxMarketCap"
                      id="maxMarketCap"
                              placeholder="Max"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      value={filters.maxMarketCap}
                      onChange={handleFilterChange}
                    />
                  </div>
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              </div>

              {/* Filter stats */}
              <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">{filteredStocks.length}</span> results from {stocks.length} stocks
                </div>
                
                    <button
                  onClick={resetFilters}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                >
                  Clear filters
                    </button>
                  </div>
              </div>

            {/* View Toggles */}
            <div className="flex items-center justify-end mb-4">
              <div className="inline-flex items-center rounded-md shadow-sm" role="group">
                <button
                  type="button"
                  className={`px-3.5 py-2 text-sm font-medium rounded-l-md border ${
                    viewMode === 'table' 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setViewMode('table')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9V7a1 1 0 011-1h10a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  type="button"
                  className={`px-3.5 py-2 text-sm font-medium rounded-r-md border ${
                    viewMode === 'cards' 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setViewMode('cards')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                  </div>
                </div>

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th 
                        scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('symbol')}
                      >
                        <div className="flex items-center">
                          Symbol
                          {sortConfig.key === 'symbol' && (
                            sortConfig.direction === 'ascending' ? 
                                <ArrowUp className="h-4 w-4 ml-1 text-indigo-500" /> : 
                                <ArrowDown className="h-4 w-4 ml-1 text-indigo-500" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('name')}
                      >
                        <div className="flex items-center">
                          Company
                          {sortConfig.key === 'name' && (
                            sortConfig.direction === 'ascending' ? 
                                <ArrowUp className="h-4 w-4 ml-1 text-indigo-500" /> : 
                                <ArrowDown className="h-4 w-4 ml-1 text-indigo-500" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                        onClick={() => requestSort('sector')}
                      >
                        <div className="flex items-center">
                          Sector
                          {sortConfig.key === 'sector' && (
                            sortConfig.direction === 'ascending' ? 
                                <ArrowUp className="h-4 w-4 ml-1 text-indigo-500" /> : 
                                <ArrowDown className="h-4 w-4 ml-1 text-indigo-500" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('price')}
                      >
                          <div className="flex items-center justify-end">
                          Price
                          {sortConfig.key === 'price' && (
                            sortConfig.direction === 'ascending' ? 
                                <ArrowUp className="h-4 w-4 ml-1 text-indigo-500" /> : 
                                <ArrowDown className="h-4 w-4 ml-1 text-indigo-500" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => requestSort('changePercent')}
                      >
                          <div className="flex items-center justify-end">
                          Change
                          {sortConfig.key === 'changePercent' && (
                            sortConfig.direction === 'ascending' ? 
                                <ArrowUp className="h-4 w-4 ml-1 text-indigo-500" /> : 
                                <ArrowDown className="h-4 w-4 ml-1 text-indigo-500" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                        onClick={() => requestSort('marketCap')}
                      >
                          <div className="flex items-center justify-end">
                          Market Cap
                          {sortConfig.key === 'marketCap' && (
                            sortConfig.direction === 'ascending' ? 
                                <ArrowUp className="h-4 w-4 ml-1 text-indigo-500" /> : 
                                <ArrowDown className="h-4 w-4 ml-1 text-indigo-500" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden lg:table-cell"
                        onClick={() => requestSort('pe')}
                      >
                          <div className="flex items-center justify-end">
                          P/E Ratio
                          {sortConfig.key === 'pe' && (
                            sortConfig.direction === 'ascending' ? 
                                <ArrowUp className="h-4 w-4 ml-1 text-indigo-500" /> : 
                                <ArrowDown className="h-4 w-4 ml-1 text-indigo-500" />
                          )}
                        </div>
                      </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredStocks.map((stock) => (
                        <tr key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-indigo-600 dark:text-indigo-400">
                          {stock.symbol}
                            </div>
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">{stock.name}</div>
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                          {stock.sector}
                            </span>
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                          ${stock.price.toFixed(2)}
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              stock.change >= 0 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                            }`}>
                            {stock.change >= 0 ? (
                                <ArrowUp className="h-3 w-3 mr-1" />
                            ) : (
                                <ArrowDown className="h-3 w-3 mr-1" />
                            )}
                              {Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
                            </div>
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                          ${(stock.marketCap / 1000000000).toFixed(1)}B
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                          {stock.pe?.toFixed(1) || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-3">
                              <button 
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                                onClick={() => handleAddToWatchlist(stock)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                          </button>
                              <button 
                                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                                onClick={() => handleViewDetails(stock)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                            </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                
                {filteredStocks.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No stocks found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Clear filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Card View */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStocks.map(stock => (
                  <div 
                    key={stock.symbol} 
                    className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{stock.symbol}</h3>
                            <span className="inline-flex items-center ml-2 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                              {stock.sector}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{stock.name}</p>
                        </div>
                        <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          stock.change >= 0 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}>
                          {stock.change >= 0 ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(stock.changePercent).toFixed(2)}%
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                          <p className="font-semibold text-gray-900 dark:text-white">${stock.price.toFixed(2)}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2 text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">P/E Ratio</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{stock.pe?.toFixed(1) || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded p-2 text-center col-span-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Market Cap</p>
                          <p className="font-semibold text-gray-900 dark:text-white">${(stock.marketCap / 1000000000).toFixed(1)}B</p>
                        </div>
                      </div>
                      
                      {isSpecialAsset(stock) && <SpecialAssetInfo stock={stock} />}
                      
                      <div className="mt-4 flex justify-between space-x-2">
                        <button
                          className="w-full flex-1 inline-flex justify-center items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => handleAddToWatchlist(stock)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          Watchlist
                        </button>
                        <button
                          className="w-full flex-1 inline-flex justify-center items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
                          onClick={() => handleViewDetails(stock)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredStocks.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No stocks found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Clear filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Analysis Section */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-5 sm:p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Bot className="h-5 w-5 mr-2 text-indigo-500" />
                AI Stock Insights
              </h2>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Ask our AI about stock trends, comparisons, or investment strategies
              </p>
              
              <form onSubmit={handleAIAnalysis} className="mb-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="block w-full pr-10 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 rounded-md shadow-sm"
                      placeholder="E.g., 'Which tech stocks have the best growth potential?'"
                    />
                    {aiPrompt && (
                      <button
                        type="button"
                        onClick={() => setAiPrompt('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={aiLoading || !aiPrompt.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Get AI Insights
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              {aiResponse && (
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 sm:p-5 rounded-md border border-indigo-100 dark:border-indigo-800/50">
                  <div className="flex items-start mb-2">
                    <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 rounded-md p-1.5">
                      <Bot className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="ml-3 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      AI Assistant
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {aiResponse}
                  </div>
                </div>
              )}
              
              {/* Quick suggestions */}
              {!aiResponse && !aiLoading && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Which stocks have the highest growth potential?")}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Growth potential
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Recommend undervalued technology stocks")}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Undervalued tech
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Compare AAPL, MSFT, and GOOGL")}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Compare tech giants
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Best mutual funds to invest in 2023")}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Mutual funds
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Should I invest in gold or silver right now?")}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Gold vs Silver
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Compare Indian vs US stock market for long term investment")}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    India vs US markets
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt("Best dividend stocks to build passive income")}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Dividend income
                  </button>
                  <button
                    type="button"
                    onClick={() => setAiPrompt("How to create a balanced portfolio with stocks, bonds, and alternative investments?")}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 dark:border-gray-700 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Balanced portfolio
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Loader2, 
  BarChart2, 
  PieChart, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Plus, 
  Trash2, 
  User, 
  LogOut,
  Calendar,
  ArrowRight,
  Calculator,
  Search
} from 'lucide-react';

interface Stock {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  purchase_price: number;
  current_price: number;
  purchase_date: string;
}

interface Prediction {
  years: number;
  predictedPrice: number;
  predictedValue: number;
  annualizedReturn: number;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
}

export const Portfolio = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [userSettings, setUserSettings] = useState<any>(null);
  const [newStock, setNewStock] = useState({
    symbol: '',
    name: '',
    shares: 0,
    purchase_price: 0,
    purchase_date: new Date().toISOString().split('T')[0]
  });
  const [buyStock, setBuyStock] = useState({
    symbol: '',
    name: '',
    shares: 1,
    price: 0,
    investmentYears: 5
  });

  // Sample data - in a real app, this would come from your database
  const sampleStocks: Stock[] = [
    {
      id: '1',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 10,
      purchase_price: 150.75,
      current_price: 175.25,
      purchase_date: '2023-01-15'
    },
    {
      id: '2',
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      shares: 5,
      purchase_price: 280.50,
      current_price: 310.20,
      purchase_date: '2023-02-20'
    },
    {
      id: '3',
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      shares: 2,
      purchase_price: 2750.00,
      current_price: 2850.75,
      purchase_date: '2023-03-10'
    },
    {
      id: '4',
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      shares: 3,
      purchase_price: 3200.00,
      current_price: 3150.50,
      purchase_date: '2023-04-05'
    },
    {
      id: '5',
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      shares: 8,
      purchase_price: 800.25,
      current_price: 875.30,
      purchase_date: '2023-05-12'
    }
  ];

  // Available stocks for purchase
  const availableStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 175.25 },
    { symbol: 'MSFT', name: 'Microsoft Corporation', price: 310.20 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2850.75 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3150.50 },
    { symbol: 'TSLA', name: 'Tesla, Inc.', price: 875.30 },
    { symbol: 'META', name: 'Meta Platforms, Inc.', price: 325.80 },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 450.25 },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 152.75 },
    { symbol: 'V', name: 'Visa Inc.', price: 230.40 },
    { symbol: 'JNJ', name: 'Johnson & Johnson', price: 165.20 },
    { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd.', price: 2450.75 },
    { symbol: 'TCS.NS', name: 'Tata Consultancy Services Ltd.', price: 3560.40 },
    { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd.', price: 1675.30 },
    { symbol: 'INFY.NS', name: 'Infosys Ltd.', price: 1450.25 },
    { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd.', price: 2580.60 },
    { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd.', price: 945.75 },
    { symbol: 'SBIN.NS', name: 'State Bank of India', price: 625.40 },
    { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel Ltd.', price: 875.20 },
    { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance Ltd.', price: 7250.30 },
    { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank Ltd.', price: 1850.45 },
    { symbol: 'TATAMOTORS.NS', name: 'Tata Motors Ltd.', price: 625.80 },
    { symbol: 'WIPRO.NS', name: 'Wipro Ltd.', price: 425.60 },
    { symbol: 'ADANIENT.NS', name: 'Adani Enterprises Ltd.', price: 2450.75 },
    { symbol: 'ASIANPAINT.NS', name: 'Asian Paints Ltd.', price: 3250.40 },
    { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India Ltd.', price: 9850.25 }
  ];

  useEffect(() => {
    checkUser();
    loadPortfolio();
  }, []);

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

  async function loadPortfolio() {
    // In a real app, you would fetch from your database
    // For now, we'll use the sample data
    setStocks(sampleStocks);
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

  async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewStock({
      ...newStock,
      [name]: name === 'shares' || name === 'purchase_price' ? parseFloat(value) : value
    });
  }

  async function handleBuyInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    
    if (name === 'symbol') {
      const selectedStock = availableStocks.find(stock => stock.symbol === value);
      if (selectedStock) {
        setBuyStock({
          ...buyStock,
          symbol: selectedStock.symbol,
          name: selectedStock.name,
          price: selectedStock.price
        });
      }
    } else {
      setBuyStock({
        ...buyStock,
        [name]: name === 'shares' || name === 'price' ? parseFloat(value) : value
      });
    }
  }

  async function handleAddStock(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      // In a real app, you would save to your database
      const newId = Math.random().toString(36).substring(2, 9);
      const stockToAdd: Stock = {
        id: newId,
        symbol: newStock.symbol.toUpperCase(),
        name: newStock.name,
        shares: newStock.shares,
        purchase_price: newStock.purchase_price,
        current_price: newStock.purchase_price, // Assume current price is same as purchase for new entries
        purchase_date: newStock.purchase_date
      };
      
      setStocks([...stocks, stockToAdd]);
      setShowAddForm(false);
      setNewStock({
        symbol: '',
        name: '',
        shares: 0,
        purchase_price: 0,
        purchase_date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  }

  async function handleBuyStock(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      // In a real app, you would save to your database
      const newId = Math.random().toString(36).substring(2, 9);
      const stockToAdd: Stock = {
        id: newId,
        symbol: buyStock.symbol,
        name: buyStock.name,
        shares: buyStock.shares,
        purchase_price: buyStock.price,
        current_price: buyStock.price,
        purchase_date: new Date().toISOString().split('T')[0]
      };
      
      // Check if we already own this stock
      const existingStockIndex = stocks.findIndex(s => s.symbol === buyStock.symbol);
      
      if (existingStockIndex >= 0) {
        // Update existing position with average cost
        const existingStock = stocks[existingStockIndex];
        const totalShares = existingStock.shares + buyStock.shares;
        const totalCost = (existingStock.shares * existingStock.purchase_price) + (buyStock.shares * buyStock.price);
        const averageCost = totalCost / totalShares;
        
        const updatedStocks = [...stocks];
        updatedStocks[existingStockIndex] = {
          ...existingStock,
          shares: totalShares,
          purchase_price: averageCost
        };
        
        setStocks(updatedStocks);
      } else {
        // Add new position
        setStocks([...stocks, stockToAdd]);
      }
      
      setShowBuyForm(false);
      setBuyStock({
        symbol: '',
        name: '',
        shares: 1,
        price: 0,
        investmentYears: 5
      });
    } catch (error) {
      console.error('Error buying stock:', error);
    }
  }

  async function handleDeleteStock(id: string) {
    try {
      // In a real app, you would delete from your database
      setStocks(stocks.filter(stock => stock.id !== id));
    } catch (error) {
      console.error('Error deleting stock:', error);
    }
  }

  async function refreshPrices() {
    try {
      setRefreshing(true);
      
      // In a real app, you would fetch current prices from an API
      // For demo purposes, we'll simulate price changes
      setTimeout(() => {
        const updatedStocks = stocks.map(stock => {
          // Random price change between -3% and +3%
          const changePercent = (Math.random() * 6) - 3;
          const newPrice = stock.current_price * (1 + (changePercent / 100));
          
          return {
            ...stock,
            current_price: newPrice
          };
        });
        
        setStocks(updatedStocks);
        setRefreshing(false);
      }, 1500);
    } catch (error) {
      console.error('Error refreshing prices:', error);
      setRefreshing(false);
    }
  }

  async function handlePredictStock(stock: Stock) {
    setSelectedStock(stock);
    setPredictions([]);
    setShowPredictionModal(true);
    generatePredictionForStock(stock);
  }

  async function generatePrediction() {
    if (!buyStock.symbol) return;
    
    const selectedStock = availableStocks.find(stock => stock.symbol === buyStock.symbol);
    if (!selectedStock) return;
    
    const stockObj: Stock = {
      id: 'temp',
      symbol: selectedStock.symbol,
      name: selectedStock.name,
      shares: buyStock.shares,
      purchase_price: selectedStock.price,
      current_price: selectedStock.price,
      purchase_date: new Date().toISOString().split('T')[0]
    };
    
    setSelectedStock(stockObj);
    setPredictions([]);
    setShowPredictionModal(true);
    generatePredictionForStock(stockObj);
  }

  async function generatePredictionForStock(stock: Stock) {
    try {
      setPredictionLoading(true);
      
      // In a real app, you would use an AI service or financial model
      // For demo purposes, we'll generate simulated predictions
      
      // Wait for a simulated API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate predictions for different time horizons
      const years = [1, 3, 5, 10];
      const generatedPredictions: Prediction[] = [];
      
      for (const year of years) {
        // Different growth rates based on the stock and time horizon
        let annualGrowthRate: number;
        let confidence: 'high' | 'medium' | 'low';
        let reasoning: string;
        
        // Customize predictions based on stock symbol
        if (stock.symbol.includes('.NS')) {
          // Indian stocks
          switch (stock.symbol) {
            case 'RELIANCE.NS':
              annualGrowthRate = 14 + (Math.random() * 6) - 3;
              confidence = year <= 3 ? 'high' : 'medium';
              reasoning = `Reliance Industries continues to diversify across energy, retail, and digital services. The company's strong market position and strategic investments in emerging technologies position it well for growth in the Indian market.`;
              break;
            case 'TCS.NS':
              annualGrowthRate = 12 + (Math.random() * 5) - 2;
              confidence = year <= 5 ? 'high' : 'medium';
              reasoning = `Tata Consultancy Services benefits from global digital transformation trends and has a strong presence in key markets. The company's consistent execution and diverse client base provide stability.`;
              break;
            case 'HDFCBANK.NS':
              annualGrowthRate = 15 + (Math.random() * 5) - 2.5;
              confidence = year <= 3 ? 'high' : 'medium';
              reasoning = `HDFC Bank has demonstrated consistent growth and asset quality. The bank's digital initiatives and expanding retail presence should continue to drive growth in India's developing financial services market.`;
              break;
            case 'INFY.NS':
              annualGrowthRate = 13 + (Math.random() * 5) - 2.5;
              confidence = year <= 3 ? 'high' : 'medium';
              reasoning = `Infosys continues to benefit from digital transformation trends globally. The company's investments in AI, cloud, and other emerging technologies position it well for future growth.`;
              break;
            case 'TATAMOTORS.NS':
              annualGrowthRate = 16 + (Math.random() * 8) - 4;
              confidence = 'medium';
              reasoning = `Tata Motors has growth potential in both domestic and international markets, particularly with its Jaguar Land Rover division and electric vehicle initiatives. However, automotive industry challenges and competition create some uncertainty.`;
              break;
            case 'ADANIENT.NS':
              annualGrowthRate = 18 + (Math.random() * 12) - 6;
              confidence = 'low';
              reasoning = `Adani Enterprises has significant growth potential across infrastructure, energy, and logistics sectors. However, regulatory challenges, high debt levels, and market volatility create higher uncertainty.`;
              break;
            default:
              annualGrowthRate = 10 + (Math.random() * 5) - 2.5;
              confidence = 'medium';
              reasoning = `This Indian company operates in a growing economy with favorable demographic trends. However, market-specific risks and global economic factors could impact performance. Diversification across multiple Indian stocks is recommended.`;
          }
        } else {
          // US stocks (existing logic)
          switch (stock.symbol) {
            case 'AAPL':
              annualGrowthRate = 12 + (Math.random() * 5) - 2.5;
              confidence = year <= 3 ? 'high' : 'medium';
              reasoning = year <= 3 
                ? `Apple's strong ecosystem, services growth, and potential new product categories suggest continued growth. The company's robust cash position and share buybacks provide downside protection.`
                : `While Apple has a strong track record, longer-term predictions are less certain due to potential market saturation and increased competition in key product categories.`;
              break;
            case 'MSFT':
              annualGrowthRate = 15 + (Math.random() * 5) - 2;
              confidence = year <= 5 ? 'high' : 'medium';
              reasoning = `Microsoft's cloud business (Azure) continues to show strong growth. The company's diversified revenue streams across enterprise software, cloud services, and gaming provide stability and multiple growth vectors.`;
              break;
            case 'GOOGL':
              annualGrowthRate = 14 + (Math.random() * 6) - 3;
              confidence = year <= 3 ? 'high' : 'medium';
              reasoning = `Alphabet's dominant position in search advertising and growing cloud business provide strong fundamentals. However, regulatory challenges and competition in AI could impact long-term growth.`;
              break;
            case 'AMZN':
              annualGrowthRate = 18 + (Math.random() * 7) - 3;
              confidence = year <= 3 ? 'high' : 'medium';
              reasoning = `Amazon's e-commerce dominance, AWS leadership, and expansion into new markets position it well for continued growth. Improving margins in retail and high-margin cloud services should drive profitability.`;
              break;
            case 'TSLA':
              annualGrowthRate = 25 + (Math.random() * 15) - 10;
              confidence = 'low';
              reasoning = `Tesla has significant growth potential in electric vehicles, energy storage, and AI. However, increased competition, production challenges, and valuation concerns create higher volatility and uncertainty.`;
              break;
            default:
              annualGrowthRate = 8 + (Math.random() * 4) - 2;
              confidence = 'medium';
              reasoning = `Based on historical market returns and the company's position in its industry, moderate growth is expected. Diversification across multiple stocks is recommended to reduce individual stock risk.`;
          }
        }
        
        // Adjust growth rate based on time horizon (longer = more conservative)
        if (year > 5) {
          annualGrowthRate = annualGrowthRate * 0.8;
        }
        
        // Calculate compound growth
        const predictedPrice = stock.current_price * Math.pow(1 + (annualGrowthRate / 100), year);
        const predictedValue = predictedPrice * stock.shares;
        
        generatedPredictions.push({
          years: year,
          predictedPrice,
          predictedValue,
          annualizedReturn: annualGrowthRate,
          confidence,
          reasoning
        });
      }
      
      setPredictions(generatedPredictions);
      setPredictionLoading(false);
    } catch (error) {
      console.error('Error generating prediction:', error);
      setPredictionLoading(false);
    }
  }

  function handleBuyAfterPrediction() {
    if (!selectedStock) return;
    
    // If we came from the buy form, complete the purchase
    if (showBuyForm) {
      handleBuyStock(new Event('submit') as any);
    }
    
    setShowPredictionModal(false);
  }

  // Calculate portfolio metrics
  const portfolioValue = stocks.reduce((total, stock) => total + (stock.shares * stock.current_price), 0);
  const portfolioCost = stocks.reduce((total, stock) => total + (stock.shares * stock.purchase_price), 0);
  const portfolioGain = portfolioValue - portfolioCost;
  const portfolioGainPercent = portfolioCost > 0 ? (portfolioGain / portfolioCost) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-100">
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
                <Link to="/portfolio" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Portfolio
                </Link>
                <Link to="/screener" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Stock Screener
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <Link to="/profile" className="text-gray-500 hover:text-gray-700 p-2 rounded-full">
                    <User className="h-6 w-6" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="ml-2 text-gray-500 hover:text-gray-700 p-2 rounded-full"
                  >
                    <LogOut className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Portfolio</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Portfolio Summary */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Portfolio Summary</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <DollarSign className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Value
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                ${portfolioValue.toFixed(2)}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <BarChart2 className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Cost
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                ${portfolioCost.toFixed(2)}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {portfolioGain >= 0 ? (
                            <TrendingUp className="h-6 w-6 text-green-400" />
                          ) : (
                            <TrendingDown className="h-6 w-6 text-red-400" />
                          )}
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Total Gain/Loss
                            </dt>
                            <dd>
                              <div className={`text-lg font-medium ${portfolioGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${portfolioGain.toFixed(2)}
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <PieChart className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              Return
                            </dt>
                            <dd>
                              <div className={`text-lg font-medium ${portfolioGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {portfolioGainPercent.toFixed(2)}%
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between mb-6">
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Existing Position
                  </button>
                  <button
                    onClick={() => setShowBuyForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Buy Stock
                  </button>
                </div>
                <button
                  onClick={refreshPrices}
                  disabled={refreshing}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {refreshing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Refresh Prices
                </button>
              </div>

              {/* Buy Stock Form */}
              {showBuyForm && (
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Buy Stock</h2>
                    <button
                      onClick={() => setShowBuyForm(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      &times;
                    </button>
                  </div>
                  <form onSubmit={handleBuyStock}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
                          Stock Symbol
                        </label>
                        <div className="mt-1">
                          <select
                            id="symbol"
                            name="symbol"
                            required
                            value={buyStock.symbol}
                            onChange={handleBuyInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          >
                            <option value="">Select a stock</option>
                            {availableStocks.map(stock => (
                              <option key={stock.symbol} value={stock.symbol}>
                                {stock.symbol} - {stock.name} (${stock.price.toFixed(2)})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="shares" className="block text-sm font-medium text-gray-700">
                          Number of Shares
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="shares"
                            id="shares"
                            required
                            min="0.01"
                            step="0.01"
                            value={buyStock.shares}
                            onChange={handleBuyInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Current Price
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="price"
                            id="price"
                            value={`$${buyStock.price.toFixed(2)}`}
                            disabled
                            className="shadow-sm bg-gray-50 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="totalCost" className="block text-sm font-medium text-gray-700">
                          Total Cost
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="totalCost"
                            id="totalCost"
                            value={`$${(buyStock.shares * buyStock.price).toFixed(2)}`}
                            disabled
                            className="shadow-sm bg-gray-50 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="investmentYears" className="block text-sm font-medium text-gray-700">
                          Investment Horizon (Years)
                        </label>
                        <div className="mt-1">
                          <input
                            type="range"
                            name="investmentYears"
                            id="investmentYears"
                            min="1"
                            max="20"
                            step="1"
                            value={buyStock.investmentYears}
                            onChange={handleBuyInputChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="text-center mt-2 text-sm text-gray-600">
                            {buyStock.investmentYears} {buyStock.investmentYears === 1 ? 'year' : 'years'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowBuyForm(false)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={generatePrediction}
                        className="inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Generate Prediction
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Buy Stock
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Prediction Modal */}
              {showPredictionModal && selectedStock && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                  <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                      <div>
                        <div className="mt-3 text-center sm:mt-5">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Investment Prediction for {selectedStock.symbol}
                          </h3>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Based on historical performance, market trends, and AI analysis
                            </p>
                          </div>
                        </div>
                      </div>

                      {predictionLoading ? (
                        <div className="mt-5 flex justify-center">
                          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                          <p className="ml-2 text-sm text-gray-500">Generating predictions...</p>
                        </div>
                      ) : (
                        <div className="mt-5">
                          <div className="bg-gray-50 p-4 rounded-md mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-500">Current Price:</span>
                              <span className="text-sm font-medium text-gray-900">${selectedStock.current_price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-500">Current Value:</span>
                              <span className="text-sm font-medium text-gray-900">
                                ${(selectedStock.shares * selectedStock.current_price).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {predictions.map((prediction, index) => (
                            <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-gray-900">
                                  {prediction.years} {prediction.years === 1 ? 'Year' : 'Years'} Prediction
                                </span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  prediction.confidence === 'high' 
                                    ? 'bg-green-100 text-green-800' 
                                    : prediction.confidence === 'medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                }`}>
                                  {prediction.confidence.charAt(0).toUpperCase() + prediction.confidence.slice(1)} Confidence
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div>
                                  <p className="text-sm text-gray-500">Predicted Price</p>
                                  <p className="text-lg font-medium text-gray-900">
                                    ${prediction.predictedPrice.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Predicted Value</p>
                                  <p className="text-lg font-medium text-gray-900">
                                    ${prediction.predictedValue.toFixed(2)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Annual Return</p>
                                  <p className={`text-lg font-medium ${
                                    prediction.annualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {prediction.annualizedReturn.toFixed(2)}%
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Total Return</p>
                                  <p className={`text-lg font-medium ${
                                    (prediction.predictedValue / (selectedStock.shares * selectedStock.current_price) - 1) * 100 >= 0 
                                      ? 'text-green-600' 
                                      : 'text-red-600'
                                  }`}>
                                    {((prediction.predictedValue / (selectedStock.shares * selectedStock.current_price) - 1) * 100).toFixed(2)}%
                                  </p>
                                </div>
                              </div>
                              
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">Analysis:</p>
                                <p className="text-sm text-gray-700 mt-1">{prediction.reasoning}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                          type="button"
                          onClick={() => setShowPredictionModal(false)}
                          className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                          Close
                        </button>
                        <button
                          type="button"
                          onClick={handleBuyAfterPrediction}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:col-start-2 sm:text-sm"
                        >
                          {showBuyForm ? 'Confirm Purchase' : 'Buy More'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Stock Form */}
              {showAddForm && (
                <div className="bg-white shadow rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium text-gray-900">Add Existing Position</h2>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      &times;
                    </button>
                  </div>
                  <form onSubmit={handleAddStock}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
                          Stock Symbol
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="symbol"
                            id="symbol"
                            required
                            value={newStock.symbol}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Company Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={newStock.name}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="shares" className="block text-sm font-medium text-gray-700">
                          Number of Shares
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="shares"
                            id="shares"
                            required
                            min="0.01"
                            step="0.01"
                            value={newStock.shares}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="purchase_price" className="block text-sm font-medium text-gray-700">
                          Purchase Price
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            name="purchase_price"
                            id="purchase_price"
                            required
                            min="0.01"
                            step="0.01"
                            value={newStock.purchase_price}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">
                          Purchase Date
                        </label>
                        <div className="mt-1">
                          <input
                            type="date"
                            name="purchase_date"
                            id="purchase_date"
                            required
                            value={newStock.purchase_date}
                            onChange={handleInputChange}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Add Stock
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Stock Holdings Table */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shares
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Cost
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Market Value
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gain/Loss
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stocks.map((stock) => {
                      const marketValue = stock.shares * stock.current_price;
                      const costBasis = stock.shares * stock.purchase_price;
                      const gainLoss = marketValue - costBasis;
                      const gainLossPercent = (gainLoss / costBasis) * 100;
                      
                      return (
                        <tr key={stock.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {stock.symbol}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stock.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {stock.shares.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${stock.purchase_price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${stock.current_price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${marketValue.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${gainLoss.toFixed(2)} ({gainLossPercent.toFixed(2)}%)
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handlePredictStock(stock)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <Calendar className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStock(stock.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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
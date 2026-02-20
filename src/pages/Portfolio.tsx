import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RefreshCw, PlusCircle, Loader2, Search } from 'lucide-react';
import { 
  availableStocks, 
  safeNumber, 
  generatePrediction, 
  generateCustomPrediction, 
  searchStock 
} from '../utils/stockPredictions';
import { supabase } from '../utils/supabaseClient';
import { getStockQuote } from '../utils/fmpApi';
import { toast } from 'react-hot-toast';

// Define the component
function Portfolio() {
  // Create a Supabase client
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // State for user
  const [user, setUser] = useState<any>(null);
  
  // State for stocks and predictions
  const [stocks, setStocks] = useState<any[]>([
    {
      id: '1',
      userId: user?.id || 'demo-user',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      shares: 10,
      purchasePrice: 150.25,
      currentPrice: 165.30,
      purchaseDate: new Date().toISOString(),
      sector: 'Technology',
      country: 'USA',
    },
    {
      id: '2',
      userId: user?.id || 'demo-user',
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      shares: 5,
      purchasePrice: 240.50,
      currentPrice: 252.75,
      purchaseDate: new Date().toISOString(),
      sector: 'Technology',
      country: 'USA',
    },
    {
      id: '3',
      userId: user?.id || 'demo-user',
      symbol: 'GOOG',
      name: 'Alphabet Inc.',
      shares: 2,
      purchasePrice: 2100.75,
      currentPrice: 2230.20,
      purchaseDate: new Date().toISOString(),
      sector: 'Technology',
      country: 'USA',
    },
  ]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [predictionLoading, setPredictionLoading] = useState(false);
  
  // Add portfolio history tracking
  const [portfolioHistory, setPortfolioHistory] = useState<{
    date: string;
    value: number;
    change: number;
    transaction: string;
  }[]>([]);
  
  // State for buy form
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [buyFormData, setBuyFormData] = useState({
    symbol: '',
    name: '',
    shares: 1,
    price: 0,
    sector: '',
    country: '',
    isProcessing: false
  });
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // State for tracking if default stocks have been loaded
  const [defaultStocksLoaded, setDefaultStocksLoaded] = useState(false);
  
  // Add state for sorting predictions
  const [predictionSortBy, setPredictionSortBy] = useState<'newest' | 'name' | 'change' | 'confidence'>('newest');
  
  // Add state for multi-buy mode
  const [multiBuyMode, setMultiBuyMode] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState<any[]>([]);
  
  // State for sell form
  const [showSellForm, setShowSellForm] = useState(false);
  const [sellFormData, setSellFormData] = useState({
    id: '',
    symbol: '',
    name: '',
    shares: 1,
    maxShares: 0,
    price: 0,
    currentValue: 0,
    isProcessing: false
  });
  
  // State for portfolio total value
  const [portfolioTotalValue, setPortfolioTotalValue] = useState(0);
  
  // Fetch stocks from database
  const fetchStocks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setStocks(data);
      } else {
        // If no stocks found in database, load default stocks
        loadDefaultStocks();
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
      // On error, load default stocks
      loadDefaultStocks();
    } finally {
      setLoading(false);
    }
  };
  
  // Load default stocks
  const loadDefaultStocks = () => {
    if (defaultStocksLoaded) return; // Prevent loading defaults multiple times
    
    setStocks([
      // US Stocks
      {
        id: '1',
        user_id: 'default-user',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        shares: 10,
        purchase_price: 150.75,
        current_price: 175.25,
        purchase_date: '2023-01-15',
        sector: 'Technology',
        country: 'US'
      },
      {
        id: '2',
        user_id: 'default-user',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        shares: 5,
        purchase_price: 280.50,
        current_price: 310.20,
        purchase_date: '2023-02-20',
        sector: 'Technology',
        country: 'US'
      },
      {
        id: '3',
        user_id: 'default-user',
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        shares: 8,
        purchase_price: 2950.25,
        current_price: 3150.50,
        purchase_date: '2023-03-10',
        sector: 'Technology',
        country: 'US'
      },
      {
        id: '4',
        user_id: 'default-user',
        symbol: 'JNJ',
        name: 'Johnson & Johnson',
        shares: 12,
        purchase_price: 155.30,
        current_price: 165.50,
        purchase_date: '2023-04-05',
        sector: 'Healthcare',
        country: 'US'
      },
      {
        id: '5',
        user_id: 'default-user',
        symbol: 'JPM',
        name: 'JPMorgan Chase & Co.',
        shares: 15,
        purchase_price: 135.40,
        current_price: 145.80,
        purchase_date: '2023-05-20',
        sector: 'Financial',
        country: 'US'
      },
      
      // Indian Stocks
      {
        id: '6',
        user_id: 'default-user',
        symbol: 'TCS.NS',
        name: 'Tata Consultancy Services Ltd.',
        shares: 5,
        purchase_price: 3750.50,
        current_price: 3850.75,
        purchase_date: '2023-06-10',
        sector: 'Technology',
        country: 'India'
      },
      {
        id: '7',
        user_id: 'default-user',
        symbol: 'RELIANCE.NS',
        name: 'Reliance Industries Ltd.',
        shares: 10,
        purchase_price: 2350.25,
        current_price: 2450.75,
        purchase_date: '2023-07-15',
        sector: 'Energy',
        country: 'India'
      },
      {
        id: '8',
        user_id: 'default-user',
        symbol: 'HDFCBANK.NS',
        name: 'HDFC Bank Ltd.',
        shares: 15,
        purchase_price: 1600.40,
        current_price: 1650.75,
        purchase_date: '2023-08-20',
        sector: 'Financial',
        country: 'India'
      },
      {
        id: '9',
        user_id: 'default-user',
        symbol: 'INFY.NS',
        name: 'Infosys Ltd.',
        shares: 20,
        purchase_price: 1480.30,
        current_price: 1520.40,
        purchase_date: '2023-09-25',
        sector: 'Technology',
        country: 'India'
      },
      {
        id: '10',
        user_id: 'default-user',
        symbol: 'MARUTI.NS',
        name: 'Maruti Suzuki India Ltd.',
        shares: 2,
        purchase_price: 9750.60,
        current_price: 9850.75,
        purchase_date: '2023-10-30',
        sector: 'Automobile',
        country: 'India'
      }
    ]);
    
    setDefaultStocksLoaded(true);
  };
  
  // Check for user on component mount
  useEffect(() => {
    // Get the current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Load stocks when user changes
  useEffect(() => {
    if (user) {
      fetchStocks();
    } else {
      // If no user, load default stocks
      loadDefaultStocks();
      setLoading(false);
    }
  }, [user]);
  
  // Function to refresh stock prices
  const refreshPrices = async () => {
    try {
      setLoading(true);
      
      // Create a copy of the current stocks
      const updatedStocks = [...stocks];
      
      // Update each stock with a slightly different price to simulate market movement
      for (let i = 0; i < updatedStocks.length; i++) {
        const stock = updatedStocks[i];
        
        // Generate a random price change between -2% and +2%
        const changePercent = (Math.random() * 4) - 2; // Between -2 and 2
        const priceChange = stock.current_price * (changePercent / 100);
        
        // Update the current price
        stock.current_price = Math.max(stock.current_price + priceChange, 0.01);
        
        // If user is logged in, update the database
        if (user) {
          try {
            await supabase
              .from('portfolio')
              .update({ current_price: stock.current_price })
              .eq('id', stock.id);
          } catch (dbError) {
            console.error('Error updating stock price in database:', dbError);
          }
        }
      }
      
      // Update the state with the new prices
      setStocks(updatedStocks);
    } catch (error) {
      console.error('Error refreshing prices:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle generating a prediction for a stock
  const handleGeneratePrediction = async (stock: any) => {
    try {
      setPredictionLoading(true);
      
      // Generate a prediction for the stock
      const prediction = {
        symbol: stock.symbol,
        name: stock.name,
        currentPrice: stock.current_price || stock.currentPrice,
        prediction: (stock.current_price || stock.currentPrice) * (1 + (Math.random() * 0.4 - 0.2)), // -20% to +20%
        confidence: Math.random() * 30 + 70, // 70-100%
        analysis: `Based on our AI analysis, ${stock.symbol} shows ${Math.random() > 0.5 ? 'positive' : 'mixed'} indicators. The stock's performance in the ${stock.sector} sector suggests ${Math.random() > 0.5 ? 'potential growth' : 'stable returns'} in the coming months.`,
        changePercent: Math.random() * 40 - 20, // -20% to +20%
        isNew: true,
        oneMonth: Math.random() * 20 - 10,
        sixMonths: Math.random() * 40 - 20,
        fiveYear: Math.random() * 100 - 50,
      };
      
      // Check if we already have a prediction for this stock
      const existingPredictionIndex = predictions.findIndex(p => p.symbol === stock.symbol);
      
      if (existingPredictionIndex >= 0) {
        // Update the existing prediction
        const updatedPredictions = [...predictions];
        updatedPredictions[existingPredictionIndex] = prediction;
        setPredictions(updatedPredictions);
      } else {
        // Add the new prediction
        setPredictions(prev => [prediction, ...prev]);
      }
      
      // Show success message
      toast.success(`Prediction generated for ${stock.symbol}`, {
        position: "top-right",
        duration: 3000
      });
      
      // Scroll to predictions section
      setTimeout(() => {
        const predictionsSection = document.getElementById('predictions-section');
        if (predictionsSection) {
          predictionsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
      // Remove the highlight effect after 5 seconds
      setTimeout(() => {
        setPredictions(prev => 
          prev.map(p => 
            p.symbol === prediction.symbol 
              ? { ...p, isNew: false } 
              : p
          )
        );
      }, 5000);
    } catch (error) {
      console.error('Error generating prediction:', error);
      toast.error('Failed to generate prediction. Please try again.', {
        position: "top-right",
        duration: 3000
      });
    } finally {
      setPredictionLoading(false);
    }
  };
  
  // Handle searching for stocks
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      // Show portfolio stocks and popular stocks when query is empty
      const portfolioStocks = stocks.map(stock => ({
        ...stock,
        inPortfolio: true
      }));
      
      const popularUSStocks = availableStocks
        .filter(stock => !stock.symbol.endsWith('.NS'))
        .slice(0, 8)
        .map(stock => ({
        ...stock,
        inPortfolio: stocks.some(s => s.symbol === stock.symbol)
        }));
      
      const popularIndianStocks = availableStocks
        .filter(stock => stock.symbol.endsWith('.NS'))
        .slice(0, 4)
        .map(stock => ({
          ...stock,
          inPortfolio: stocks.some(s => s.symbol === stock.symbol)
        }));
      
      // Set search results with portfolio stocks first, then popular stocks
      setSearchResults([...portfolioStocks, ...popularUSStocks, ...popularIndianStocks].slice(0, 20));
      setSearchFocused(true);
      return;
    }
    
    // First search in our local data
    const lowerQuery = query.toLowerCase();
    
    // Check portfolio stocks first
    const portfolioMatches = stocks
      .filter(stock => 
        stock.symbol.toLowerCase().includes(lowerQuery) || 
        stock.name.toLowerCase().includes(lowerQuery)
      )
      .map(stock => ({
        ...stock,
        inPortfolio: true
      }));
    
    // Then check available stocks
    const availableMatches = availableStocks
      .filter(stock => 
        stock.symbol.toLowerCase().includes(lowerQuery) || 
        stock.name.toLowerCase().includes(lowerQuery)
      )
      .map(stock => ({
      ...stock,
      inPortfolio: stocks.some(s => s.symbol === stock.symbol)
    }));
    
    // Combine results, ensuring no duplicates
    const combinedResults = [...portfolioMatches];
    
    availableMatches.forEach(match => {
      if (!combinedResults.some(s => s.symbol === match.symbol)) {
        combinedResults.push(match);
      }
    });
    
    setSearchResults(combinedResults.slice(0, 20));
    setSearchFocused(true);
    
    // If we have few results, try the API search
    if (combinedResults.length < 5 && query.length >= 2) {
      // API search is asynchronous, so we'll update results when it's done
      searchStock(query)
        .then(apiResults => {
          if (apiResults && apiResults.length > 0) {
            const enhancedApiResults = apiResults.map(stock => ({
              ...stock,
              inPortfolio: stocks.some(s => s.symbol === stock.symbol)
            }));
            
            // Combine with our existing results, avoiding duplicates
            const newResults = [...combinedResults];
            
            enhancedApiResults.forEach(apiStock => {
              if (!newResults.some(s => s.symbol === apiStock.symbol)) {
                newResults.push(apiStock);
              }
            });
            
            setSearchResults(newResults.slice(0, 20));
          }
        })
        .catch(err => {
          console.error("Error searching stocks via API:", err);
        });
    }
  };
  
  // Handle search focus
  const handleSearchFocus = () => {
    setSearchFocused(true);
    
    // If no query, show popular stocks or stocks in portfolio
    if (!searchQuery) {
      // Get symbols of stocks already in portfolio
      const portfolioSymbols = stocks.map(stock => stock.symbol);
      
      // First, include portfolio stocks
      const portfolioStocks = stocks.map(stock => ({
        ...stock,
        price: stock.current_price,
        inPortfolio: true
      }));
      
      // Then, add some popular US stocks that aren't in the portfolio
      const popularUSSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM'];
      const popularUSStocks = availableStocks
        .filter(stock => 
          popularUSSymbols.includes(stock.symbol) && 
          !portfolioSymbols.includes(stock.symbol) &&
          (!stock.country || stock.country === 'US')
        )
        .map(stock => ({
          ...stock,
          inPortfolio: false,
          country: stock.country || 'US'
        }));
      
      // Add some popular Indian stocks that aren't in the portfolio
      const popularIndianSymbols = ['TCS.NS', 'RELIANCE.NS', 'HDFCBANK.NS', 'INFY.NS', 'MARUTI.NS', 'TATAMOTORS.NS'];
      const popularIndianStocks = availableStocks
        .filter(stock => 
          popularIndianSymbols.includes(stock.symbol) && 
          !portfolioSymbols.includes(stock.symbol) &&
          stock.country === 'India'
        )
        .map(stock => ({
          ...stock,
          inPortfolio: false
        }));
      
      // Set search results with portfolio stocks first, then popular stocks
      setSearchResults([...portfolioStocks, ...popularUSStocks, ...popularIndianStocks].slice(0, 20));
    }
  };
  
  // Handle search blur
  const handleSearchBlur = () => {
    // Use setTimeout to allow click events on search results to fire first
    setTimeout(() => {
      setSearchFocused(false);
    }, 200);
  };
  
  // Handle selecting a stock from search results
  const handleSelectStock = (stock: any) => {
    // Check if the stock is already in the portfolio
    const existingStock = stocks.find(s => s.symbol === stock.symbol);
    
    setBuyFormData({
      symbol: stock.symbol,
      name: stock.name,
      shares: 1,
      price: stock.price || stock.current_price || 0,
      sector: stock.sector || '',
      country: stock.country || (stock.symbol.endsWith('.NS') ? 'India' : 'US'),
    });
    
    // Close the search dropdown
    setSearchFocused(false);
  };
  
  // Function to recalculate portfolio metrics
  const recalculatePortfolioMetrics = (updatedStocks: any[]) => {
    // Calculate new portfolio value and gain/loss
    const newPortfolioValue = updatedStocks.reduce((total, stock) => {
      const currentPrice = typeof stock.current_price === 'number' ? stock.current_price : 
                          (typeof stock.currentPrice === 'number' ? stock.currentPrice : 0);
      const shares = typeof stock.shares === 'number' ? stock.shares : 0;
      return total + (currentPrice * shares);
    }, 0);
    
    const newPortfolioCost = updatedStocks.reduce((total, stock) => {
      const purchasePrice = typeof stock.purchase_price === 'number' ? stock.purchase_price : 
                          (typeof stock.purchasePrice === 'number' ? stock.purchasePrice : 0);
      const shares = typeof stock.shares === 'number' ? stock.shares : 0;
      return total + (purchasePrice * shares);
    }, 0);
    
    const newPortfolioGainLoss = newPortfolioValue - newPortfolioCost;
    const newPortfolioGainLossPercent = newPortfolioCost > 0 ? (newPortfolioGainLoss / newPortfolioCost) * 100 : 0;
    
    // Add to portfolio history
    const currentDate = new Date().toISOString();
    setPortfolioHistory(prev => [
      ...prev,
      {
        date: currentDate,
        value: newPortfolioValue,
        change: newPortfolioValue - (prev.length > 0 ? prev[0].value : 0),
        transaction: 'update'
      }
    ]);
    
    return {
      portfolioValue: newPortfolioValue,
      portfolioCost: newPortfolioCost,
      portfolioGainLoss: newPortfolioGainLoss,
      portfolioGainLossPercent: newPortfolioGainLossPercent
    };
  };
  
  // Handle buying a stock - simplified for reliability
  const handleBuyStock = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Buying stock:", buyFormData.symbol, buyFormData.shares, "shares");
    
    if (!buyFormData.symbol || buyFormData.shares < 1) {
      toast.error("Please select a stock and specify at least 1 share to buy");
      return;
    }
    
    try {
      // Set processing state
      setBuyFormData({...buyFormData, isProcessing: true});
      
      // Simulate a slight delay for processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a new stock object with all required fields
      const newStock = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate a unique ID
        user_id: user ? user.id : 'default-user',
        symbol: buyFormData.symbol,
        name: buyFormData.name,
        shares: buyFormData.shares,
        purchase_price: buyFormData.price,
        current_price: buyFormData.price,
        purchase_date: new Date().toISOString().split('T')[0],
        sector: buyFormData.sector || '',
        country: buyFormData.country || (buyFormData.symbol.endsWith('.NS') ? 'India' : 'US')
      };
      
      console.log("Adding new stock to portfolio:", newStock);
      
      // Calculate purchase amount
      const purchaseAmount = buyFormData.price * buyFormData.shares;
      
      // Add to local state first for immediate feedback
      let updatedStocks: any[] = [];
      setStocks(prevStocks => {
        // Check if stock already exists in portfolio
        const existingStockIndex = prevStocks.findIndex(s => s.symbol === newStock.symbol);
        
        if (existingStockIndex >= 0) {
          // Update existing stock by adding shares
          const newStocks = [...prevStocks];
          const existingStock = newStocks[existingStockIndex];
          
          // Calculate new average purchase price
          const totalShares = existingStock.shares + newStock.shares;
          const totalValue = (existingStock.shares * existingStock.purchase_price) + 
                            (newStock.shares * newStock.purchase_price);
          const averagePrice = totalValue / totalShares;
          
          newStocks[existingStockIndex] = {
            ...existingStock,
            shares: totalShares,
            purchase_price: averagePrice
          };
          
          updatedStocks = newStocks;
          return newStocks;
        } else {
          // Add new stock
          updatedStocks = [...prevStocks, newStock];
          return updatedStocks;
        }
      });
      
      // Update portfolio history with buy transaction
      setPortfolioHistory(prev => [
        ...prev,
        {
          date: new Date().toISOString(),
          value: purchaseAmount,
          change: purchaseAmount,
          transaction: `BUY: ${buyFormData.shares} shares of ${buyFormData.symbol} at $${typeof buyFormData.price === 'number' ? buyFormData.price.toFixed(2) : '0.00'}`
        }
      ]);
      
      // Recalculate portfolio metrics
      recalculatePortfolioMetrics(updatedStocks);
      
      // Show success message with purchase details
      toast.success(`Successfully purchased ${buyFormData.shares} shares of ${buyFormData.symbol} for $${typeof purchaseAmount === 'number' ? purchaseAmount.toFixed(2) : '0.00'}`);
      
      // Reset form and close modal
      setShowBuyForm(false);
      setBuyFormData({
        symbol: '',
        name: '',
        shares: 1,
        price: 0,
        sector: '',
        country: '',
      });
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error buying stock:', error);
      toast.error(`Error purchasing stock: ${error}`);
      setBuyFormData({...buyFormData, isProcessing: false});
    }
  };
  
  // Handle initiating a sell transaction
  const handleInitiateSell = (stock: any) => {
    console.log("Sell initiated for:", stock.symbol);
    
    // Set valid price (needed in case current price is 0 or undefined)
    const currentPrice = stock.currentPrice && stock.currentPrice > 0 ? 
      stock.currentPrice : 100;
    
    setSellFormData({
      id: stock.id,
      symbol: stock.symbol,
      name: stock.name,
      shares: 1,
      maxShares: stock.shares,
      price: currentPrice,
      currentValue: currentPrice * stock.shares,
      isProcessing: false
    });
    
    setShowSellForm(true);
  };
  
  // Handle initiating buying more of a stock
  const handleBuyMore = (stock: any) => {
    console.log("Buying more of", stock.symbol);
    // Set the form data
    setBuyFormData({
      symbol: stock.symbol,
      name: stock.name,
      shares: 1,
      price: stock.current_price,
      sector: stock.sector,
      country: stock.country,
      isProcessing: false
    });
    
    // Show the buy form
    setShowBuyForm(true);
  };
  
  // Handle confirming a sell transaction
  const handleConfirmSell = async () => {
    console.log("Confirming sell for:", sellFormData.symbol, sellFormData.shares, "shares");
    
    if (!sellFormData.id || sellFormData.shares < 1) {
      toast.error("Please specify at least 1 share to sell");
      return;
    }
    
    if (sellFormData.shares > sellFormData.maxShares) {
      toast.error(`You only have ${sellFormData.maxShares} shares available to sell`);
        return;
      }
      
    try {
      // Set processing state
      setSellFormData({...sellFormData, isProcessing: true});
      
      // Calculate sale value
      const saleValue = sellFormData.shares * sellFormData.price;
      
      // Simulate a slight delay for processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let updatedStocks: any[] = [];
      
      // Check if selling all shares or partial
      if (sellFormData.shares === sellFormData.maxShares) {
        // Remove the stock from our local state
        updatedStocks = stocks.filter(stock => stock.id !== sellFormData.id);
        setStocks(updatedStocks);
      } else {
        // Partial sale - reduce quantity
        updatedStocks = stocks.map(stock => {
          if (stock.id === sellFormData.id) {
            return {
              ...stock,
              shares: stock.shares - sellFormData.shares
            };
          }
          return stock;
        });
        setStocks(updatedStocks);
      }
      
      // Update portfolio history with sell transaction
      setPortfolioHistory(prev => [
        ...prev,
        {
          date: new Date().toISOString(),
          value: saleValue,
          change: saleValue,
          transaction: `SELL: ${sellFormData.shares} shares of ${sellFormData.symbol} at $${typeof sellFormData.price === 'number' ? sellFormData.price.toFixed(2) : '0.00'}`
        }
      ]);
      
      // Recalculate portfolio metrics
      recalculatePortfolioMetrics(updatedStocks);
      
      // Show success message
      toast.success(`Successfully sold ${sellFormData.shares} shares of ${sellFormData.symbol} for $${typeof saleValue === 'number' ? saleValue.toFixed(2) : '0.00'}`);
      
      // Reset form and close modal
      setShowSellForm(false);
      setSellFormData({
        id: '',
        symbol: '',
        name: '',
        shares: 1,
        maxShares: 0,
        price: 0,
        currentValue: 0,
      });
    } catch (error) {
      console.error('Error selling stock:', error);
      toast.error('Failed to sell stock. Please try again.');
      setSellFormData({...sellFormData, isProcessing: false});
    }
  };
  
  // Calculate portfolio metrics
  const portfolioValue = stocks.reduce((total, stock) => {
    const currentPrice = typeof stock.current_price === 'number' ? stock.current_price : 
                        (typeof stock.currentPrice === 'number' ? stock.currentPrice : 0);
    const shares = typeof stock.shares === 'number' ? stock.shares : 0;
    return total + (currentPrice * shares);
  }, 0);
  
  const portfolioCost = stocks.reduce((total, stock) => {
    const purchasePrice = typeof stock.purchase_price === 'number' ? stock.purchase_price : 
                         (typeof stock.purchasePrice === 'number' ? stock.purchasePrice : 0);
    const shares = typeof stock.shares === 'number' ? stock.shares : 0;
    return total + (purchasePrice * shares);
  }, 0);
  
  const portfolioGainLoss = portfolioValue - portfolioCost;
  const portfolioGainLossPercent = portfolioCost > 0 ? (portfolioGainLoss / portfolioCost) * 100 : 0;
  
  // Calculate portfolio value
  const setPortfolioValue = () => {
    // Calculate total value
    const totalValue = stocks.reduce((total, stock) => {
      const currentPrice = typeof stock.current_price === 'number' ? stock.current_price : 0;
      const shares = typeof stock.shares === 'number' ? stock.shares : 0;
      return total + (shares * currentPrice);
    }, 0);
    
    // Set the total value
    setPortfolioTotalValue(totalValue);
  };
  
  // Function to sort predictions based on selected criteria
  const getSortedPredictions = () => {
    if (!predictions.length) return [];
    
    return [...predictions].sort((a, b) => {
      switch (predictionSortBy) {
        case 'name':
          return a.symbol.localeCompare(b.symbol);
        case 'change':
          return b.changePercent - a.changePercent;
        case 'confidence':
          return b.confidence - a.confidence;
        case 'newest':
        default:
          // Maintain original order (newest first)
          return 0;
      }
    });
  };
  
  // Update portfolio value whenever stocks change
  useEffect(() => {
    setPortfolioValue();
  }, [stocks]);
  
  // Handle refreshing stock prices
  const handleRefreshPrices = () => {
    console.log("Refreshing stock prices");
    refreshPrices();
  };
  
  // Add this new function for quick demo buying
  const quickDemoBuy = () => {
    // Select a random stock from the available stocks
    const randomIndex = Math.floor(Math.random() * availableStocks.length);
    const stockToBuy = availableStocks[randomIndex];
    
    // Random number of shares between 1 and 20
    const shares = Math.floor(Math.random() * 20) + 1;
    
        // Create a new stock object
        const newStock = {
      id: `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: 'demo-user',
      symbol: stockToBuy.symbol,
      name: stockToBuy.name,
      shares: shares,
      purchase_price: stockToBuy.price,
      current_price: stockToBuy.price,
          purchase_date: new Date().toISOString().split('T')[0],
      sector: stockToBuy.sector || 'Technology',
      country: stockToBuy.country || (stockToBuy.symbol.endsWith('.NS') ? 'India' : 'US')
    };
    
    // Add to local state
    setStocks(prevStocks => {
      // Check if stock already exists in portfolio
      const existingStockIndex = prevStocks.findIndex(s => s.symbol === newStock.symbol);
      
      if (existingStockIndex >= 0) {
        // Update existing stock by adding shares
        const updatedStocks = [...prevStocks];
        const existingStock = updatedStocks[existingStockIndex];
        
        // Calculate new average purchase price
        const totalShares = existingStock.shares + newStock.shares;
        const totalValue = (existingStock.shares * existingStock.purchase_price) + 
                          (newStock.shares * newStock.purchase_price);
        const averagePrice = totalValue / totalShares;
        
        updatedStocks[existingStockIndex] = {
          ...existingStock,
          shares: totalShares,
          purchase_price: averagePrice
        };
        
        return updatedStocks;
      } else {
        // Add new stock
        return [...prevStocks, newStock];
      }
    });
    
    // Show success toast
    toast.success(`Successfully added ${shares} shares of ${stockToBuy.symbol} to your portfolio!`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">My Portfolio</h1>
          
          {/* Action Buttons - Moved to top right */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <button
              onClick={() => setShowBuyForm(true)}
              className="flex-1 md:flex-none px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center justify-center shadow-sm transition-colors"
          >
              <PlusCircle className="h-5 w-5 mr-2" />
              Buy Stock
          </button>
          
          <button
              onClick={handleRefreshPrices}
              className="flex-1 md:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center shadow-sm transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh Prices'}
          </button>
          
          <button
              onClick={quickDemoBuy}
              className="flex-1 md:flex-none px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md flex items-center justify-center shadow-sm transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
              Quick Demo Buy
          </button>
        </div>
      </div>
      
        {/* Portfolio Value Section - Updated for better responsiveness */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${Number(portfolioValue).toFixed(2)}</p>
            </div>
            
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Today's Change</p>
              <p className={`text-2xl font-bold ${portfolioGainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {portfolioGainLoss >= 0 ? '+' : ''}{Number(portfolioGainLoss).toFixed(2)} ({Number(portfolioGainLossPercent).toFixed(2)}%)
            </p>
          </div>
          
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Gain/Loss</p>
              <p className={`text-2xl font-bold ${portfolioGainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {portfolioGainLoss >= 0 ? '+' : ''}{Number(portfolioGainLoss).toFixed(2)} ({Number(portfolioGainLossPercent).toFixed(2)}%)
            </p>
          </div>
          
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Number of Stocks</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stocks.length}</p>
          </div>
        </div>
      </div>
      
        {/* Stock Table - Updated for better mobile responsiveness */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 md:p-6">
            {/* Mobile View (< 640px) */}
            <div className="sm:hidden space-y-4">
              {stocks.map((stock) => {
                const shares = typeof stock.shares === 'number' ? stock.shares : 0;
                const purchasePrice = typeof stock.purchase_price === 'number' ? stock.purchase_price : 
                                    (typeof stock.purchasePrice === 'number' ? stock.purchasePrice : 0);
                const currentPrice = typeof stock.current_price === 'number' ? stock.current_price : 
                                   (typeof stock.currentPrice === 'number' ? stock.currentPrice : 0);
                const stockValue = currentPrice * shares;

                return (
                  <div key={stock.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
          <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{stock.symbol}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{stock.name}</div>
          </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">${Number(stockValue).toFixed(2)}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Value</div>
                      </div>
          </div>
          
                    <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">Shares</div>
                        <div className="font-medium text-gray-900 dark:text-white">{Number(shares).toFixed(2)}</div>
          </div>
                      <div className="text-right">
                        <div className="text-gray-500 dark:text-gray-400 text-xs">Current Price</div>
                        <div className="font-medium text-gray-900 dark:text-white">${Number(currentPrice).toFixed(2)}</div>
        </div>
      </div>
      
                    <div className="flex justify-end gap-2 pt-2">
            <button
                        onClick={() => handleInitiateSell(stock)}
                        className="px-3 py-1.5 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700 transition-colors"
        >
                        Sell
        </button>
        <button
                        onClick={() => handleBuyMore(stock)}
                        className="px-3 py-1.5 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700 transition-colors"
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => handleGeneratePrediction(stock)}
                        className="px-3 py-1.5 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700 transition-colors"
                        disabled={predictionLoading}
                      >
                        {predictionLoading ? 'Loading...' : 'Predict'}
            </button>
          </div>
          </div>
                );
              })}
        </div>
      
            {/* Tablet/Desktop View (≥ 640px) */}
            <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Stock
                </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">
                  Sector
                </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Shares
                </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">
                  Avg. Price
                </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Current Price
                  </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                  Value
                  </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {stocks.map((stock) => {
                const shares = typeof stock.shares === 'number' ? stock.shares : 0;
                    const purchasePrice = typeof stock.purchase_price === 'number' ? stock.purchase_price : 
                                        (typeof stock.purchasePrice === 'number' ? stock.purchasePrice : 0);
                    const currentPrice = typeof stock.current_price === 'number' ? stock.current_price : 
                                       (typeof stock.currentPrice === 'number' ? stock.currentPrice : 0);
                const stockValue = currentPrice * shares;
                  
                  return (
                      <tr key={stock.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{stock.symbol}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{stock.name}</div>
                        </div>
                      </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {stock.sector}
                      </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                      {Number(shares).toFixed(2)}
                      </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white hidden lg:table-cell">
                      ${Number(purchasePrice).toFixed(2)}
                      </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                      ${Number(currentPrice).toFixed(2)}
                      </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                      ${Number(stockValue).toFixed(2)}
                    </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex flex-wrap justify-end gap-2">
                          <button
                          onClick={() => handleInitiateSell(stock)}
                              className="px-3 py-1.5 text-xs bg-red-100 text-red-800 rounded-full hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700 transition-colors"
                          >
                            Sell
                          </button>
                        <button
                          onClick={() => handleBuyMore(stock)}
                              className="px-3 py-1.5 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700 transition-colors"
                        >
                              Buy
                        </button>
                          <button
                            onClick={() => handleGeneratePrediction(stock)}
                              className="px-3 py-1.5 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700 transition-colors"
                              disabled={predictionLoading}
                          >
                          {predictionLoading ? 'Loading...' : 'Predict'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
      </div>
      
        {/* Predictions Section */}
        {predictions.length > 0 && (
          <div id="predictions-section" className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Stock Predictions</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                {/* Time Period Buttons */}
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-3 py-1.5 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700 transition-colors">
                    Next Week
                  </button>
                  <button className="flex-1 sm:flex-none px-3 py-1.5 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700 transition-colors">
                    Next Month
                  </button>
                  <button className="flex-1 sm:flex-none px-3 py-1.5 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700 transition-colors">
                    6 Months
                  </button>
                </div>
                
                {/* Sort and Clear Options */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <select
                  value={predictionSortBy}
                  onChange={(e) => setPredictionSortBy(e.target.value as any)}
                    className="flex-1 sm:flex-none rounded-md border-gray-300 dark:border-gray-600 text-sm dark:bg-gray-700 py-1.5 px-2"
                >
                  <option value="newest">Newest</option>
                  <option value="name">Symbol</option>
                  <option value="change">Change %</option>
                  <option value="confidence">Confidence</option>
                </select>
              <button
                onClick={() => setPredictions([])}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 whitespace-nowrap"
              >
                Clear All
              </button>
                </div>
          </div>
        </div>
        
            {/* Predictions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {getSortedPredictions().map((prediction, index) => (
              <div 
                key={index} 
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-2 ${
                    prediction.isNew ? 'border-blue-500 animate-pulse' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {/* Stock Info */}
                  <div className="flex justify-between items-start mb-4">
                  <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{prediction.symbol}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{prediction.name}</p>
                  </div>
                    {prediction.isNew && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        New
                      </span>
                    )}
                </div>
                
                  {/* Price Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${Number(prediction.currentPrice).toFixed(2)}
                      </p>
                  </div>
                  <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Predicted Price</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${Number(prediction.prediction).toFixed(2)}
                      </p>
                  </div>
                </div>
                
                  {/* Confidence Meter */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Confidence</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {Math.round(prediction.confidence)}%
                      </span>
                  </div>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200 dark:bg-gray-600">
                        <div
                          style={{ width: `${prediction.confidence}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                  </div>
                </div>
                </div>
                
                  {/* Time Period Predictions */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">1M</p>
                      <p className={`text-sm font-medium ${prediction.oneMonth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {prediction.oneMonth >= 0 ? '+' : ''}{prediction.oneMonth.toFixed(1)}%
                    </p>
                  </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">6M</p>
                      <p className={`text-sm font-medium ${prediction.sixMonths >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {prediction.sixMonths >= 0 ? '+' : ''}{prediction.sixMonths.toFixed(1)}%
                    </p>
                  </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">5Y</p>
                      <p className={`text-sm font-medium ${prediction.fiveYear >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {prediction.fiveYear >= 0 ? '+' : ''}{prediction.fiveYear.toFixed(1)}%
                    </p>
                  </div>
                </div>

                  {/* Analysis */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {prediction.analysis}
            </p>
          </div>
      </div>
              ))}
                          </div>
                        </div>
                  )}
                              </div>
    </div>
  );
}

// Export as both named and default export
export { Portfolio };
export default Portfolio;
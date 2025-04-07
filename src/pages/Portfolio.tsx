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
      const prediction = await generatePrediction(stock);
      
      // Mark this prediction as new to highlight it
      prediction.isNew = true;
      
      // Check if we already have a prediction for this stock
      const existingPredictionIndex = predictions.findIndex(p => p.symbol === stock.symbol);
      
      if (existingPredictionIndex >= 0) {
        // Update the existing prediction
        const updatedPredictions = [...predictions];
        updatedPredictions[existingPredictionIndex] = prediction;
        setPredictions(updatedPredictions);
      } else {
        // Add the new prediction
        setPredictions([prediction, ...predictions]);
      }
      
      // Show success message with toast instead of alert
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
      // Show error with toast instead of alert
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
        <div className="flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
            onClick={refreshPrices}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Prices
          </button>
          
          {/* Demo Buy Button */}
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
            onClick={quickDemoBuy}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Quick Demo Buy
          </button>
          
          <button
            type="button"
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all relative"
            onClick={() => {
              setShowBuyForm(true);
              // Pre-populate search results with popular stocks to improve UX
              if (availableStocks && availableStocks.length > 0) {
                setSearchResults(availableStocks.slice(0, 12).map(stock => ({
                  ...stock,
                  inPortfolio: stocks.some(s => s.symbol === stock.symbol)
                })));
              }
            }}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Buy Stock
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </button>
        </div>
      </div>
      
      {/* Demo Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 md:p-6 mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">Demo Portfolio Features</h3>
        <p className="text-blue-700 dark:text-blue-400 mb-4">
          This demo portfolio allows you to practice buying and selling stocks without using real money.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Buy Stocks</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use the "Buy Stock" button to purchase new stocks or "Buy More" to add to existing positions.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sell Stocks</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use the "Sell" button to partially or completely sell your stock positions.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Refresh Prices</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use the "Refresh Prices" button to simulate market price changes for your portfolio.
            </p>
          </div>
        </div>
      </div>
      
      {/* Portfolio Value Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Portfolio Value</p>
            <p className="text-2xl font-bold">${Number(portfolioTotalValue).toFixed(2)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Today's Change</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">+$45.23 (0.56%)</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Gain/Loss</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">+${Number(portfolioGainLoss).toFixed(2)} ({Number(portfolioGainLossPercent).toFixed(2)}%)</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Number of Stocks</p>
            <p className="text-2xl font-bold">{stocks.length}</p>
          </div>
        </div>
      </div>
      
      {/* Portfolio Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setShowBuyForm(true)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center shadow-sm transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Buy Stock
        </button>
        
        <button
          onClick={handleRefreshPrices}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center shadow-sm transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Prices'}
            </button>
          </div>
      
      {/* Transaction History Section */}
      {portfolioHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolioHistory
                  .filter(transaction => transaction.transaction !== 'update')
                  .slice(0, 5)
                  .map((transaction, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.transaction}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={transaction.transaction.startsWith('BUY') ? 'text-red-600' : 'text-green-600'}>
                          ${Number(transaction.value).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {portfolioHistory.filter(t => t.transaction !== 'update').length === 0 && (
            <p className="text-gray-500 text-center py-4">No transactions yet</p>
          )}
        </div>
      )}
      
      {/* Portfolio Table */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-4 md:p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Sector
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Country
                </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Shares
                </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Avg. Price
                </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Current Price
                  </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Value
                  </th>
                <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                    Gain/Loss
                  </th>
                <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {stocks.map((stock) => {
                // Calculate value and gain/loss with proper type checks
                const currentPrice = typeof stock.current_price === 'number' ? stock.current_price : 0;
                const purchasePrice = typeof stock.purchase_price === 'number' ? stock.purchase_price : 0;
                const shares = typeof stock.shares === 'number' ? stock.shares : 0;
                
                const stockValue = currentPrice * shares;
                const initialValue = purchasePrice * shares;
                const gainLoss = stockValue - initialValue;
                const gainLossPercent = initialValue > 0 ? (gainLoss / initialValue) * 100 : 0;
                  
                  return (
                    <tr key={stock.id}>
                    <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {stock.symbol}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                            {stock.name}
                            </div>
                          </div>
                        </div>
                      </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {stock.sector}
                      </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      {stock.country}
                      </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right">
                      {Number(shares).toFixed(2)}
                      </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-right hidden sm:table-cell">
                      ${Number(purchasePrice).toFixed(2)}
                      </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      ${Number(currentPrice).toFixed(2)}
                      </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      ${Number(stockValue).toFixed(2)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium hidden md:table-cell">
                      <span className={gainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        ${Number(gainLoss).toFixed(2)} 
                        ({Number(gainLossPercent).toFixed(2)}%)
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                          <button
                          onClick={() => handleInitiateSell(stock)}
                          className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700"
                          >
                            Sell
                          </button>
                        <button
                          onClick={() => handleBuyMore(stock)}
                          className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700"
                        >
                          Buy More
                        </button>
                          <button
                            onClick={() => handleGeneratePrediction(stock)}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700 hidden sm:block"
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
      
      {/* Stock Predictions */}
      <div id="predictions-section" className="mt-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold">AI Stock Predictions</h2>
          
          <div className="flex items-center gap-4">
            {predictions.length > 1 && (
              <div className="flex items-center gap-2">
                <label htmlFor="sort-predictions" className="text-sm text-gray-500 dark:text-gray-400">
                  Sort by:
                </label>
                <select
                  id="sort-predictions"
                  value={predictionSortBy}
                  onChange={(e) => setPredictionSortBy(e.target.value as any)}
                  className="rounded-md border-gray-300 dark:border-gray-700 text-sm dark:bg-gray-800 py-1"
                >
                  <option value="newest">Newest</option>
                  <option value="name">Symbol</option>
                  <option value="change">Change %</option>
                  <option value="confidence">Confidence</option>
                </select>
              </div>
            )}
            
      {predictions.length > 0 && (
              <button
                onClick={() => setPredictions([])}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
        
        {predictions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {getSortedPredictions().map((prediction, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg shadow-md border-2 transition-all duration-500 ${
                  prediction.isNew 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 animate-pulse' 
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{prediction.symbol}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{prediction.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {prediction.isNew && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        New
                      </span>
                    )}
                  <button
                    onClick={() => {
                        setPredictions(predictions.filter((_, i) => i !== index));
                    }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                  </div>
                  
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                    <p className="text-lg font-semibold">${typeof prediction.currentPrice === 'number' ? Number(prediction.currentPrice).toFixed(2) : 'N/A'}</p>
                      </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Prediction (1 Year)</p>
                    <p className="text-lg font-semibold">${typeof prediction.prediction === 'number' ? Number(prediction.prediction).toFixed(2) : 'N/A'}</p>
                    </div>
                </div>
                  
                <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Confidence</p>
                    <p className="text-lg font-semibold">{typeof prediction.confidence === 'number' ? Math.round(prediction.confidence) + '%' : 'N/A'}</p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Projected Change</p>
                    <p className={`text-lg font-semibold ${typeof prediction.changePercent === 'number' && prediction.changePercent > 0 ? 'text-green-600 dark:text-green-400' : typeof prediction.changePercent === 'number' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {typeof prediction.changePercent === 'number' ? (prediction.changePercent > 0 ? '+' : '') + prediction.changePercent.toFixed(1) + '%' : 'N/A'}
                      </p>
                    </div>
                    </div>
                
                <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">AI Analysis</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 hover:line-clamp-none transition-all">{prediction.analysis}</p>
                  </div>
                  
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">1M</p>
                    <p className={`text-sm font-medium ${typeof prediction.oneMonth === 'number' && prediction.oneMonth > 0 ? 'text-green-600 dark:text-green-400' : typeof prediction.oneMonth === 'number' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {typeof prediction.oneMonth === 'number' ? (prediction.oneMonth > 0 ? '+' : '') + prediction.oneMonth.toFixed(1) + '%' : 'N/A'}
                    </p>
                      </div>
                  <div className="col-span-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">6M</p>
                    <p className={`text-sm font-medium ${typeof prediction.sixMonths === 'number' && prediction.sixMonths > 0 ? 'text-green-600 dark:text-green-400' : typeof prediction.sixMonths === 'number' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {typeof prediction.sixMonths === 'number' ? (prediction.sixMonths > 0 ? '+' : '') + prediction.sixMonths.toFixed(1) + '%' : 'N/A'}
                    </p>
                    </div>
                  <div className="col-span-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">5Y</p>
                    <p className={`text-sm font-medium ${typeof prediction.fiveYear === 'number' && prediction.fiveYear > 0 ? 'text-green-600 dark:text-green-400' : typeof prediction.fiveYear === 'number' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                      {typeof prediction.fiveYear === 'number' ? (prediction.fiveYear > 0 ? '+' : '') + prediction.fiveYear.toFixed(1) + '%' : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">
              No predictions generated yet. Click the "Predict" button on any stock to see AI-powered price predictions.
            </p>
        </div>
      )}
      </div>
      
      {/* Buy Stock Modal */}
      {showBuyForm && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
            
            <div className="relative bg-white rounded-lg max-w-lg w-full mx-auto shadow-xl border-2 border-green-500">
              {/* Color bar at top */}
              <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-green-500 rounded-t-lg"></div>
              
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-bold text-gray-900">Buy Stock</h3>
                    <button
                      type="button"
                  onClick={() => setShowBuyForm(false)}
                      className="text-gray-400 hover:text-gray-500"
                >
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
              {/* Content */}
              <div className="p-6">
                <form onSubmit={handleBuyStock}>
                  {/* Stock Search */}
                  {!buyFormData.symbol && (
                    <div className="mb-4">
                      <label htmlFor="stock-search" className="block text-sm font-medium text-gray-700 mb-1">Search Stock</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="stock-search"
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 border-gray-300 rounded-md"
                          placeholder="Enter symbol (e.g., AAPL) or company name"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onFocus={handleSearchFocus}
                          onBlur={handleSearchBlur}
                        />
                            </div>
                            
                      {/* Search Results */}
                      {searchFocused && (
                        <div className="mt-2 border border-gray-200 rounded-md shadow-sm max-h-60 overflow-y-auto">
                            {searchResults.length > 0 ? (
                              searchResults.map((result) => (
                                <div
                                  key={result.symbol}
                                className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                                onClick={() => handleSelectStock(result)}
                              >
                                <div className="flex justify-between">
                                    <div>
                                    <div className="font-medium">{result.symbol}</div>
                                    <div className="text-sm text-gray-500">{result.name}</div>
                                      </div>
                                  <div className="font-medium">${(result.price || result.current_price || 0).toFixed(2)}</div>
                                    </div>
                                </div>
                              ))
                            ) : (
                            <div className="p-3 text-center text-gray-500">No results found</div>
                          )}
                              </div>
                            )}
                          </div>
                        )}
                  
                  {/* Selected Stock Details */}
                  {buyFormData.symbol && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{buyFormData.symbol}</div>
                            <div className="text-sm text-gray-500">{buyFormData.name}</div>
                      </div>
                          <div className="font-medium">${buyFormData.price.toFixed(2)}</div>
                    </div>
                    
                            <button
                              type="button"
                          className="mt-2 text-sm text-indigo-600"
                              onClick={() => {
                            setBuyFormData({
                                  symbol: '',
                                  name: '',
                                  shares: 1,
                                  price: 0,
                                  sector: '',
                                  country: '',
                                });
                                setSearchQuery('');
                              }}
                            >
                              Change Stock
                            </button>
                          </div>
                          
                      {/* Quantity Selector */}
                              <div>
                        <label htmlFor="shares" className="block text-sm font-medium text-gray-700 mb-1">Number of Shares</label>
                        <div className="flex rounded-md shadow-sm">
                              <button
                                type="button"
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                            onClick={() => setBuyFormData({ ...buyFormData, shares: Math.max(1, buyFormData.shares - 1) })}
                              >
                                <span className="sr-only">Decrease</span>
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <input
                                type="number"
                                id="shares"
                                min="1"
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full text-center border-gray-300"
                            value={buyFormData.shares}
                            onChange={(e) => setBuyFormData({ ...buyFormData, shares: parseInt(e.target.value) || 1 })}
                              />
                              <button
                                type="button"
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                            onClick={() => setBuyFormData({ ...buyFormData, shares: buyFormData.shares + 1 })}
                              >
                                <span className="sr-only">Increase</span>
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Quick quantity buttons */}
                        <div className="flex flex-wrap gap-2 mt-2">
                              {[5, 10, 25, 50, 100].map(quantity => (
                                <button
                                  key={quantity}
                                  type="button"
                              className="px-2 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50"
                              onClick={() => setBuyFormData({ ...buyFormData, shares: quantity })}
                                >
                                  {quantity}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                      {/* Total */}
                      <div className="bg-green-50 p-3 rounded-md border border-green-100">
                        <div className="flex justify-between">
                          <span>Total Investment:</span>
                          <span className="font-bold">${(buyFormData.price * buyFormData.shares).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                  )}
                  
                  {/* Footer with action buttons */}
                  <div className="mt-6 border-t border-gray-200 pt-4 flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      onClick={() => setShowBuyForm(false)}
                    >
                      Cancel
                    </button>
                    
                    {buyFormData.symbol && (
                      <button
                        type="submit"
                        disabled={buyFormData.isProcessing}
                        className={`px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white ${
                          buyFormData.isProcessing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {buyFormData.isProcessing ? (
                          <div className="flex items-center">
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Processing...
                              </div>
                        ) : (
                          `Buy ${buyFormData.shares} ${buyFormData.shares === 1 ? 'Share' : 'Shares'}`
                        )}
                      </button>
                    )}
                              </div>
                </form>
                            </div>
                              </div>
                              </div>
                            </div>
      )}
      
      {/* Sell Stock Modal */}
      {showSellForm && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
            
            <div className="relative bg-white rounded-lg max-w-lg w-full mx-auto shadow-xl border-2 border-red-500">
              {/* Color bar at top */}
              <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-t-lg"></div>
              
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-bold text-gray-900">Sell Stock</h3>
                <button 
                  type="button"
                  onClick={() => setShowSellForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                              </div>
              
              {/* Content */}
              <div className="p-6">
                {/* Selected Stock Details */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{sellFormData.symbol}</div>
                        <div className="text-sm text-gray-500">{sellFormData.name}</div>
                              </div>
                      <div className="font-medium">${sellFormData.price.toFixed(2)}</div>
                              </div>
                    <div className="mt-2 text-sm text-gray-600">
                      You own: <span className="font-medium">{sellFormData.maxShares} shares</span>
                              </div>
                                </div>
                  
                  {/* Quantity Selector */}
                  <div>
                    <label htmlFor="sell-shares" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Shares to Sell
                    </label>
                    <div className="flex rounded-md shadow-sm">
                      <button
                        type="button"
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                        onClick={() => setSellFormData({ 
                          ...sellFormData, 
                          shares: Math.max(1, sellFormData.shares - 1) 
                        })}
                      >
                        <span className="sr-only">Decrease</span>
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        id="sell-shares"
                        min="1"
                        max={sellFormData.maxShares}
                        className="focus:ring-red-500 focus:border-red-500 flex-1 block w-full text-center border-gray-300"
                        value={sellFormData.shares}
                        onChange={(e) => setSellFormData({ 
                          ...sellFormData, 
                          shares: parseInt(e.target.value) || 1
                        })}
                      />
                      <button
                        type="button"
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                        onClick={() => setSellFormData({ 
                          ...sellFormData, 
                          shares: Math.min(sellFormData.maxShares, sellFormData.shares + 1) 
                        })}
                      >
                        <span className="sr-only">Increase</span>
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                              </div>
                    
                    {/* Quick quantity buttons */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button
                        type="button"
                        className="px-2 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50"
                        onClick={() => setSellFormData({ ...sellFormData, shares: 1 })}
                      >
                        1
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50"
                        onClick={() => setSellFormData({ 
                          ...sellFormData, 
                          shares: Math.floor(sellFormData.maxShares / 2)
                        })}
                      >
                        Half
                      </button>
                      <button
                        type="button"
                        className="px-2 py-1 text-xs border border-gray-300 rounded-full hover:bg-gray-50"
                        onClick={() => setSellFormData({ ...sellFormData, shares: sellFormData.maxShares })}
                      >
                        All
                      </button>
                            </div>
                          </div>
                  
                  {/* Total */}
                  <div className="bg-green-50 p-3 rounded-md border border-green-100">
                    <div className="flex justify-between">
                      <span>Total Sale Amount:</span>
                      <span className="font-bold">${(sellFormData.price * sellFormData.shares).toFixed(2)}</span>
                        </div>
                  </div>
                </div>
                    
                {/* Footer with action buttons */}
                <div className="mt-6 border-t border-gray-200 pt-4 flex items-center justify-end space-x-3">
                      <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setShowSellForm(false)}
                  >
                    Cancel
                      </button>
                      
                      <button
                        type="button"
                    onClick={handleConfirmSell}
                    disabled={sellFormData.isProcessing || sellFormData.shares < 1 || sellFormData.shares > sellFormData.maxShares}
                    className={`px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white ${
                      sellFormData.isProcessing || sellFormData.shares < 1 || sellFormData.shares > sellFormData.maxShares
                        ? 'bg-gray-400'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {sellFormData.isProcessing ? (
                      <div className="flex items-center">
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Processing...
                      </div>
                    ) : (
                      `Sell ${sellFormData.shares} ${sellFormData.shares === 1 ? 'Share' : 'Shares'}`
                    )}
                      </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading indicator for predictions */}
      {predictionLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="bg-white p-6 rounded-lg shadow-xl z-10 flex flex-col items-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mb-4" />
            <p className="text-gray-700">Generating prediction...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Export as both named and default export
export { Portfolio };
export default Portfolio;
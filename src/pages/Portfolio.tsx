import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { RefreshCw, PlusCircle, Loader2 } from 'lucide-react';
import { 
  availableStocks, 
  safeNumber, 
  generatePrediction, 
  generateCustomPrediction, 
  searchStock 
} from '../utils/stockPredictions';
import { supabase } from '../utils/supabaseClient';
import { getStockQuote } from '../utils/fmpApi';

// Define the component
function Portfolio() {
  // Create a Supabase client
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // State for user
  const [user, setUser] = useState<any>(null);
  
  // State for stocks and predictions
  const [stocks, setStocks] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [predictionLoading, setPredictionLoading] = useState(false);
  
  // State for buy form
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [buyStock, setBuyStock] = useState<{
    symbol: string;
    name: string;
    shares: number;
    price: number;
    sector: string;
    country: string;
    predictionYears: number;
    isProcessing: boolean;
  }>({
    symbol: '',
    name: '',
    shares: 1,
    price: 0,
    sector: '',
    country: '',
    predictionYears: 5,
    isProcessing: false
  });
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  
  // State for tracking if default stocks have been loaded
  const [defaultStocksLoaded, setDefaultStocksLoaded] = useState(false);
  
  // Add state for multi-buy mode
  const [multiBuyMode, setMultiBuyMode] = useState(false);
  const [selectedStocks, setSelectedStocks] = useState<any[]>([]);
  
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
      
      // Show success message
      alert(`Prediction generated for ${stock.symbol}`);
    } catch (error) {
      console.error('Error generating prediction:', error);
      alert('Failed to generate prediction. Please try again.');
    } finally {
      setPredictionLoading(false);
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      // Show popular stocks when query is empty
      setSearchResults(availableStocks.slice(0, 10).map(stock => ({
        ...stock,
        inPortfolio: stocks.some(s => s.symbol === stock.symbol)
      })));
      return;
    }
    
    // Search for stocks
    const results = searchStock(query);
    
    // Add a flag to indicate if the stock is already in the portfolio
    const resultsWithPortfolioFlag = results.map(stock => ({
      ...stock,
      inPortfolio: stocks.some(s => s.symbol === stock.symbol)
    }));
    
    setSearchResults(resultsWithPortfolioFlag);
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
    
    setBuyStock({
      symbol: stock.symbol,
      name: stock.name,
      shares: 1,
      price: stock.price || stock.current_price || 0,
      sector: stock.sector || '',
      country: stock.country || (stock.symbol.endsWith('.NS') ? 'India' : 'US'),
      predictionYears: 5,
      isProcessing: false
    });
    
    // Close the search dropdown
    setSearchFocused(false);
  };
  
  // Handle buying a stock - completely rewritten for reliability
  const handleBuyStock = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buyStock.symbol || buyStock.shares < 1) {
      alert("Please select a stock and specify at least 1 share to buy");
      return;
    }
    
    try {
      // Set processing state
      setBuyStock({...buyStock, isProcessing: true});
      
      // Create a new stock object with all required fields
      const newStock = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate a unique ID
        user_id: user ? user.id : 'default-user',
        symbol: buyStock.symbol,
        name: buyStock.name,
        shares: buyStock.shares,
        purchase_price: buyStock.price,
        current_price: buyStock.price,
        purchase_date: new Date().toISOString().split('T')[0],
        sector: buyStock.sector || '',
        country: buyStock.country || (buyStock.symbol.endsWith('.NS') ? 'India' : 'US')
      };
      
      console.log("Adding new stock to portfolio:", newStock);
      
      // Add to local state first for immediate feedback
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
      
      // If user is logged in, update database
      if (user) {
        try {
          // Check if stock already exists in database
          const { data: existingData, error: fetchError } = await supabase
            .from('portfolio')
            .select('*')
            .eq('user_id', user.id)
            .eq('symbol', buyStock.symbol);
          
          if (fetchError) {
            throw fetchError;
          }
          
          if (existingData && existingData.length > 0) {
            // Update existing stock
            const existingStock = existingData[0];
            
            // Calculate new average purchase price
            const totalShares = existingStock.shares + buyStock.shares;
            const totalValue = (existingStock.shares * existingStock.purchase_price) + 
                              (buyStock.shares * buyStock.price);
            const averagePrice = totalValue / totalShares;
            
            const { error: updateError } = await supabase
              .from('portfolio')
              .update({
                shares: totalShares,
                purchase_price: averagePrice,
                current_price: buyStock.price // Update current price
              })
              .eq('id', existingStock.id);
            
            if (updateError) {
              throw updateError;
            }
          } else {
            // Insert new stock
            const { error: insertError } = await supabase
              .from('portfolio')
              .insert([{
                user_id: user.id,
                symbol: buyStock.symbol,
                name: buyStock.name,
                shares: buyStock.shares,
                purchase_price: buyStock.price,
                current_price: buyStock.price,
                purchase_date: new Date().toISOString().split('T')[0],
                sector: buyStock.sector || '',
                country: buyStock.country || (buyStock.symbol.endsWith('.NS') ? 'India' : 'US')
              }]);
            
            if (insertError) {
              throw insertError;
            }
          }
          
          // Refresh portfolio data
          fetchStocks();
        } catch (dbError) {
          console.error('Database error:', dbError);
          alert("Database error occurred, but your purchase was recorded locally");
        }
      }
      
      // Generate prediction if requested
      if (buyStock.predictionYears > 0) {
        setPredictionLoading(true);
        
        try {
          const prediction = await generateCustomPrediction(
            buyStock.symbol,
            buyStock.name,
            buyStock.price,
            buyStock.predictionYears
          );
          
          setPredictions(prevPredictions => [...prevPredictions, prediction]);
          alert(`Generated ${buyStock.predictionYears}-year prediction for ${buyStock.symbol}`);
        } catch (predictionError) {
          console.error('Error generating prediction:', predictionError);
          alert("Could not generate prediction, but your purchase was successful");
        } finally {
          setPredictionLoading(false);
        }
      }
      
      // Show success message
      alert(`Successfully purchased ${buyStock.shares} shares of ${buyStock.symbol}`);
      
      // Reset form and close modal
      setShowBuyForm(false);
      setBuyStock({
        symbol: '',
        name: '',
        shares: 1,
        price: 0,
        sector: '',
        country: '',
        predictionYears: 5,
        isProcessing: false
      });
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error buying stock:', error);
      alert(`Error purchasing stock: ${error}`);
      setBuyStock({...buyStock, isProcessing: false});
    }
  };
  
  // Handle selling a stock
  const sellStock = async (stockId: string) => {
    try {
      // Find the stock to sell
      const stockToSell = stocks.find(stock => stock.id === stockId);
      
      if (!stockToSell) {
        throw new Error('Stock not found');
      }
      
      // Confirm the sale
      if (!window.confirm(`Are you sure you want to sell ${stockToSell.shares} shares of ${stockToSell.symbol}?`)) {
        return;
      }
      
      // If user is logged in, delete from database
      if (user) {
        try {
          const { error } = await supabase
            .from('portfolio')
            .delete()
            .eq('id', stockId);
          
          if (error) {
            console.error('Error deleting from database:', error);
            // Continue with local update even if database delete fails
          }
        } catch (dbError) {
          console.error('Exception deleting from database:', dbError);
          // Continue with local update
        }
      }
      
      // Remove the stock from our local state
      setStocks(stocks.filter(stock => stock.id !== stockId));
      
      // Show success message
      alert(`Successfully sold ${stockToSell.shares} shares of ${stockToSell.symbol}`);
    } catch (error) {
      console.error('Error selling stock:', error);
      alert('Failed to sell stock. Please try again.');
    }
  };
  
  // Calculate portfolio metrics
  const portfolioValue = stocks.reduce((total, stock) => {
    return total + (safeNumber(stock.current_price) * safeNumber(stock.shares));
  }, 0);
  
  const portfolioCost = stocks.reduce((total, stock) => {
    return total + (safeNumber(stock.purchase_price) * safeNumber(stock.shares));
  }, 0);
  
  const portfolioGainLoss = portfolioValue - portfolioCost;
  const portfolioGainLossPercent = portfolioCost > 0 ? (portfolioGainLoss / portfolioCost) * 100 : 0;
  
  // Group portfolio stocks by sector for the pie chart
  const sectorData = stocks.reduce((acc: any, stock) => {
    const sector = stock.sector || 'Other';
    const value = safeNumber(stock.current_price) * safeNumber(stock.shares);
    
    if (!acc[sector]) {
      acc[sector] = 0;
    }
    
    acc[sector] += value;
    return acc;
  }, {});
  
  // Convert sector data to array for the chart
  const sectorChartData = Object.entries(sectorData).map(([name, value]) => ({
    name,
    value: Number(value)
  }));
  
  // Handle selecting multiple stocks
  const handleSelectMultipleStocks = (stock: any) => {
    const isAlreadySelected = selectedStocks.some(s => s.symbol === stock.symbol);
    
    if (isAlreadySelected) {
      // Remove from selection
      setSelectedStocks(selectedStocks.filter(s => s.symbol !== stock.symbol));
    } else {
      // Add to selection with default 1 share
      setSelectedStocks([...selectedStocks, {
        ...stock,
        shares: 1
      }]);
    }
  };
  
  // Handle updating shares for a selected stock
  const handleUpdateSelectedShares = (symbol: string, shares: number) => {
    setSelectedStocks(selectedStocks.map(stock => 
      stock.symbol === symbol ? { ...stock, shares } : stock
    ));
  };
  
  // Handle buying multiple stocks
  const handleBuyMultipleStocks = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedStocks.length === 0) {
      alert('Please select at least one stock to buy');
      return;
    }
    
    try {
      setLoading(true);
      
      // Process each selected stock
      for (const stock of selectedStocks) {
        // Create a new stock object
        const newStock = {
          id: Date.now().toString() + stock.symbol, // Generate a unique ID
          user_id: user ? user.id : 'default-user',
          symbol: stock.symbol,
          name: stock.name,
          shares: stock.shares,
          purchase_price: stock.price || stock.current_price,
          current_price: stock.price || stock.current_price,
          purchase_date: new Date().toISOString().split('T')[0],
          sector: stock.sector || '',
          country: stock.country || (stock.symbol.endsWith('.NS') ? 'India' : 'US')
        };
        
        // If user is logged in, add to database
        if (user) {
          try {
            const { error } = await supabase
              .from('portfolio')
              .insert([{
                user_id: user.id,
                symbol: stock.symbol,
                name: stock.name,
                shares: stock.shares,
                purchase_price: stock.price || stock.current_price,
                current_price: stock.price || stock.current_price,
                purchase_date: new Date().toISOString().split('T')[0],
                sector: stock.sector || '',
                country: stock.country || (stock.symbol.endsWith('.NS') ? 'India' : 'US')
              }]);
            
            if (error) {
              console.error(`Error adding ${stock.symbol} to database:`, error);
            }
          } catch (dbError) {
            console.error(`Error adding ${stock.symbol} to database:`, dbError);
            // Still add to local state even if database fails
            setStocks([...stocks, newStock]);
          }
        } else {
          // If no user, just add to local state
          setStocks(prevStocks => [...prevStocks, newStock]);
        }
      }
      
      // Fetch updated stocks if user is logged in
      if (user) {
        fetchStocks();
      }
      
      // Reset form
      setShowBuyForm(false);
      setMultiBuyMode(false);
      setSelectedStocks([]);
      setBuyStock({
        symbol: '',
        name: '',
        shares: 1,
        price: 0,
        sector: '',
        country: '',
        predictionYears: 5,
        isProcessing: false
      });
      setSearchQuery('');
      setSearchResults([]);
      
      // Show success message
      alert(`Successfully purchased ${selectedStocks.length} stocks`);
    } catch (error) {
      console.error('Error buying stocks:', error);
      alert(`Error purchasing stocks: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Add this function to update current prices
  const updateCurrentPrices = async () => {
    if (stocks.length === 0) return;
    
    try {
      setLoading(true);
      
      // Get symbols from portfolio
      const symbols = stocks.map(stock => stock.symbol);
      const uniqueSymbols = [...new Set(symbols)];
      
      // Get quotes for all symbols
      const updatedPrices = await Promise.all(
        uniqueSymbols.map(async (symbol) => {
          const quote = await getStockQuote(symbol);
          return {
            symbol,
            price: quote?.price || null
          };
        })
      );
      
      // Update stocks with new prices
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          const updatedPrice = updatedPrices.find(p => p.symbol === stock.symbol);
          if (updatedPrice && updatedPrice.price) {
            return {
              ...stock,
              current_price: updatedPrice.price
            };
          }
          return stock;
        })
      );
      
      // If user is logged in, update database
      if (user) {
        for (const stock of stocks) {
          const updatedPrice = updatedPrices.find(p => p.symbol === stock.symbol);
          if (updatedPrice && updatedPrice.price) {
            try {
              await supabase
                .from('portfolio')
                .update({ current_price: updatedPrice.price })
                .eq('id', stock.id);
            } catch (error) {
              console.error('Error updating price in database:', error);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error updating prices:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
        <div className="flex space-x-3">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={updateCurrentPrices}
          >
            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Prices
          </button>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={() => setShowBuyForm(true)}
          >
            <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Buy Stock
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-indigo-800 mb-2">Total Portfolio Value</h3>
            <p className="text-2xl font-bold text-indigo-900">${portfolioValue.toFixed(2)}</p>
          </div>
          <div className={`p-4 rounded-lg ${portfolioGainLoss >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <h3 className={`text-sm font-medium mb-2 ${portfolioGainLoss >= 0 ? 'text-green-800' : 'text-red-800'}`}>
              Total Gain/Loss
            </h3>
            <p className={`text-2xl font-bold ${portfolioGainLoss >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              ${portfolioGainLoss.toFixed(2)} ({portfolioGainLossPercent.toFixed(2)}%)
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Number of Stocks</h3>
            <p className="text-2xl font-bold text-blue-900">{stocks.length}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Portfolio</h2>
        
        {stocks.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-500 mb-4">You don't have any stocks in your portfolio yet.</p>
            <button
              onClick={() => setShowBuyForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusCircle className="-ml-1 mr-2 h-5 w-5" />
              Buy Your First Stock
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shares
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gain/Loss
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stocks.map((stock) => {
                  const purchaseValue = safeNumber(stock.purchase_price) * safeNumber(stock.shares);
                  const currentValue = safeNumber(stock.current_price) * safeNumber(stock.shares);
                  const gainLoss = currentValue - purchaseValue;
                  const gainLossPercent = (gainLoss / purchaseValue) * 100;
                  
                  return (
                    <tr key={stock.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                            <div className="text-sm text-gray-500">{stock.name}</div>
                            <div className="flex mt-1 space-x-2">
                              {stock.sector && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {stock.sector}
                                </span>
                              )}
                              {stock.country && (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  stock.country === 'India' 
                                    ? 'bg-orange-100 text-orange-800' 
                                    : 'bg-green-100 text-green-800'
                                }`}>
                                  {stock.country}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {stock.shares}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${safeNumber(stock.purchase_price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${safeNumber(stock.current_price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${currentValue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${gainLoss.toFixed(2)} ({gainLossPercent.toFixed(2)}%)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => sellStock(stock.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Sell
                          </button>
                          <button
                            onClick={() => handleGeneratePrediction(stock)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Predict
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Predictions Section */}
      {predictions.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Stock Predictions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predictions.map((prediction) => (
              <div key={prediction.symbol} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{prediction.symbol}</h3>
                    <p className="text-sm text-gray-500">{prediction.name}</p>
                  </div>
                  <button
                    onClick={() => {
                      setPredictions(predictions.filter(p => p.symbol !== prediction.symbol));
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Current Price</h4>
                    <p className="text-lg font-semibold">${prediction.currentPrice.toFixed(2)}</p>
                  </div>
                  
                  {prediction.customYear && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        {prediction.customYearPeriod}-Year Prediction
                      </h4>
                      <div className="flex items-baseline">
                        <p className={`text-lg font-semibold ${prediction.customYear >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${(prediction.currentPrice * (1 + prediction.customYear / 100)).toFixed(2)}
                        </p>
                        <p className={`ml-2 text-sm ${prediction.customYear >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({prediction.customYear >= 0 ? '+' : ''}{prediction.customYear.toFixed(2)}%)
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Confidence: {prediction.customYearConfidence}%
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">1 Month</h4>
                      <p className={`text-sm font-medium ${prediction.oneMonth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {prediction.oneMonth >= 0 ? '+' : ''}{prediction.oneMonth.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">6 Months</h4>
                      <p className={`text-sm font-medium ${prediction.sixMonths >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {prediction.sixMonths >= 0 ? '+' : ''}{prediction.sixMonths.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-500 mb-1">1 Year</h4>
                      <p className={`text-sm font-medium ${prediction.oneYear >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {prediction.oneYear >= 0 ? '+' : ''}{prediction.oneYear.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      // Toggle detailed analysis
                      setPredictions(predictions.map(p => 
                        p.symbol === prediction.symbol 
                          ? { ...p, showDetails: !p.showDetails } 
                          : p
                      ));
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                  >
                    {prediction.showDetails ? 'Hide Details' : 'Show Detailed Analysis'}
                  </button>
                  
                  {prediction.showDetails && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm">
                      <div className="prose prose-sm max-w-none">
                        {prediction.analysis.split('\n').map((paragraph, index) => {
                          if (paragraph.startsWith('# ')) {
                            return <h3 key={index} className="text-base font-semibold mt-4 mb-2">{paragraph.substring(2)}</h3>;
                          } else if (paragraph.startsWith('## ')) {
                            return <h4 key={index} className="text-sm font-medium mt-3 mb-1">{paragraph.substring(3)}</h4>;
                          } else if (paragraph.trim() === '') {
                            return <div key={index} className="h-2"></div>;
                          } else {
                            return <p key={index} className="mb-2">{paragraph}</p>;
                          }
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Buy Stock Modal */}
      {showBuyForm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-medium text-gray-900" id="modal-title">
                      Buy Stock
                    </h3>
                    
                    {/* Close button */}
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => {
                        if (buyStock.isProcessing) return;
                        setShowBuyForm(false);
                        setBuyStock({
                          symbol: '',
                          name: '',
                          shares: 1,
                          price: 0,
                          sector: '',
                          country: '',
                          predictionYears: 5,
                          isProcessing: false
                        });
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form id="buy-stock-form" onSubmit={handleBuyStock}>
                    {/* Step 1: Search for a stock */}
                    <div className={`mb-6 ${buyStock.symbol ? 'opacity-50' : ''}`}>
                      <label htmlFor="stock-search" className="block text-lg font-medium text-gray-700 mb-3">
                        Step 1: Search for a Stock
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="stock-search"
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full text-lg border-gray-300 rounded-md py-3 px-4"
                          placeholder="Enter symbol or company name"
                          value={searchQuery}
                          onChange={handleSearchChange}
                          onFocus={() => {
                            if (buyStock.symbol) return; // Disable when stock is selected
                            handleSearchFocus();
                            // Always show some default stocks even if search query is empty
                            if (searchResults.length === 0) {
                              setSearchResults(availableStocks.slice(0, 10).map(stock => ({
                                ...stock,
                                inPortfolio: stocks.some(s => s.symbol === stock.symbol)
                              })));
                            }
                          }}
                          onBlur={handleSearchBlur}
                          disabled={!!buyStock.symbol || buyStock.isProcessing}
                        />
                        
                        {/* Search results dropdown */}
                        {searchFocused && !buyStock.symbol && (
                          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-96 overflow-auto">
                            <div className="sticky top-0 bg-gray-50 px-4 py-3 text-base font-medium text-gray-700 uppercase tracking-wider border-b border-gray-200">
                              {searchQuery ? 'Search Results' : 'Popular Stocks'}
                            </div>
                            
                            {searchResults.length > 0 ? (
                              searchResults.map((result) => (
                                <div
                                  key={result.symbol}
                                  className={`px-6 py-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${
                                    result.inPortfolio ? 'border-l-4 border-indigo-500' : ''
                                  }`}
                                  onClick={() => {
                                    handleSelectStock(result);
                                    setSearchQuery('');
                                    setSearchResults([]);
                                  }}
                                >
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="text-xl font-medium text-gray-900 mb-1">
                                        {result.symbol}
                                        {result.inPortfolio && (
                                          <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                            In Portfolio
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-base text-gray-600">{result.name}</div>
                                    </div>
                                    <div className="text-xl font-medium text-gray-900">
                                      ${((result.price || result.current_price) || 0).toFixed(2)}
                                    </div>
                                  </div>
                                  <div className="flex mt-3 space-x-3">
                                    {result.sector && (
                                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-base font-medium bg-blue-100 text-blue-800">
                                        {result.sector}
                                      </span>
                                    )}
                                    {result.country && (
                                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-base font-medium ${
                                        result.country === 'India' 
                                          ? 'bg-orange-100 text-orange-800' 
                                          : 'bg-green-100 text-green-800'
                                      }`}>
                                        {result.country}
                                      </span>
                                    )}
                                  </div>
                                  {result.inPortfolio && (
                                    <div className="text-base text-gray-500 mt-2">
                                      You own {result.shares || 0} shares at ${(result.purchase_price || 0).toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="px-6 py-4 text-gray-500">
                                No stocks found. Try a different search term.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Step 2: Configure purchase details */}
                    {buyStock.symbol && (
                      <>
                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="block text-lg font-medium text-gray-700">
                              Step 2: Configure Purchase Details
                            </h4>
                            
                            {/* Change stock button */}
                            <button
                              type="button"
                              className="text-sm text-indigo-600 hover:text-indigo-500"
                              onClick={() => {
                                if (buyStock.isProcessing) return;
                                setBuyStock({
                                  symbol: '',
                                  name: '',
                                  shares: 1,
                                  price: 0,
                                  sector: '',
                                  country: '',
                                  predictionYears: 5,
                                  isProcessing: false
                                });
                                setSearchQuery('');
                              }}
                              disabled={buyStock.isProcessing}
                            >
                              Change Stock
                            </button>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded-md mb-4">
                            <div className="flex justify-between items-center mb-3">
                              <div>
                                <div className="text-xl font-medium text-gray-900">{buyStock.symbol}</div>
                                <div className="text-base text-gray-600">{buyStock.name}</div>
                              </div>
                              <div className="text-xl font-medium text-gray-900">
                                ${(buyStock.price || 0).toFixed(2)}
                              </div>
                            </div>
                            
                            {/* Show if stock is already in portfolio */}
                            {stocks.some(s => s.symbol === buyStock.symbol) && (
                              <div className="mt-3 p-2 bg-indigo-50 rounded border border-indigo-100 text-sm text-indigo-700">
                                <div className="font-medium">Already in your portfolio</div>
                                <div className="mt-1">
                                  {(() => {
                                    const existingStock = stocks.find(s => s.symbol === buyStock.symbol);
                                    return existingStock 
                                      ? `You own ${existingStock.shares} shares at an average price of $${existingStock.purchase_price.toFixed(2)}`
                                      : '';
                                  })()}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Improved quantity selector */}
                          <div className="mb-4">
                            <label htmlFor="shares" className="block text-base font-medium text-gray-700 mb-2">
                              Number of Shares to Buy
                            </label>
                            <div className="flex items-center">
                              <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                                onClick={() => setBuyStock({ ...buyStock, shares: Math.max(1, buyStock.shares - 1) })}
                                disabled={buyStock.isProcessing}
                              >
                                <span className="sr-only">Decrease</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <input
                                type="number"
                                id="shares"
                                min="1"
                                step="1"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full text-center text-lg border-gray-300"
                                value={buyStock.shares}
                                onChange={(e) => setBuyStock({ ...buyStock, shares: parseInt(e.target.value) || 1 })}
                                disabled={buyStock.isProcessing}
                              />
                              <button
                                type="button"
                                className="inline-flex items-center justify-center p-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100"
                                onClick={() => setBuyStock({ ...buyStock, shares: buyStock.shares + 1 })}
                                disabled={buyStock.isProcessing}
                              >
                                <span className="sr-only">Increase</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Quick quantity buttons */}
                            <div className="flex space-x-2 mt-2">
                              {[5, 10, 25, 50, 100].map(quantity => (
                                <button
                                  key={quantity}
                                  type="button"
                                  className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                                  onClick={() => setBuyStock({ ...buyStock, shares: quantity })}
                                  disabled={buyStock.isProcessing}
                                >
                                  {quantity}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-indigo-50 rounded-md border border-indigo-100">
                            <div className="flex justify-between items-center">
                              <span className="text-base text-gray-700">Total Investment:</span>
                              <span className="text-xl font-bold text-indigo-700">
                                ${((buyStock.price || 0) * (buyStock.shares || 1)).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Step 3: Configure AI prediction */}
                        <div className="mb-6">
                          <h4 className="block text-lg font-medium text-gray-700 mb-3">
                            Step 3: Configure AI Prediction
                          </h4>
                          
                          <div className="p-4 bg-yellow-50 rounded-md border border-yellow-100">
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <label htmlFor="prediction-years" className="block text-base font-medium text-gray-700">
                                  Generate AI Prediction for {buyStock.predictionYears} {buyStock.predictionYears === 1 ? 'year' : 'years'}
                                </label>
                              </div>
                              
                              <input
                                type="range"
                                id="prediction-years"
                                min="1"
                                max="20"
                                step="1"
                                className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
                                value={buyStock.predictionYears}
                                onChange={(e) => setBuyStock({ ...buyStock, predictionYears: parseInt(e.target.value) })}
                                disabled={buyStock.isProcessing}
                              />
                              
                              <div className="flex justify-between text-xs text-gray-500 px-1 mt-1">
                                <span>1yr</span>
                                <span>5yrs</span>
                                <span>10yrs</span>
                                <span>15yrs</span>
                                <span>20yrs</span>
                              </div>
                            </div>
                            
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-0.5">
                                <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                  Our AI will analyze {buyStock.symbol} and generate a {buyStock.predictionYears}-year price prediction after purchase. This helps you understand the potential long-term value of your investment.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Purchase summary */}
                        <div className="mb-6">
                          <h4 className="block text-lg font-medium text-gray-700 mb-3">
                            Purchase Summary
                          </h4>
                          
                          <div className="p-4 bg-indigo-50 rounded-md border border-indigo-100">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Stock:</span>
                                <span className="font-medium">{buyStock.symbol} ({buyStock.name})</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Price per Share:</span>
                                <span className="font-medium">${(buyStock.price || 0).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Number of Shares:</span>
                                <span className="font-medium">{buyStock.shares}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>AI Prediction:</span>
                                <span className="font-medium">{buyStock.predictionYears} {buyStock.predictionYears === 1 ? 'year' : 'years'}</span>
                              </div>
                              <div className="pt-2 border-t border-indigo-200">
                                <div className="flex justify-between text-indigo-900">
                                  <span className="font-medium">Total Investment:</span>
                                  <span className="font-bold">${((buyStock.price || 0) * (buyStock.shares || 1)).toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {/* Action buttons */}
                    <div className="sm:flex sm:flex-row-reverse mt-6">
                      <button
                        type="submit"
                        disabled={!buyStock.symbol || buyStock.shares < 1 || buyStock.isProcessing}
                        className={`w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                          !buyStock.symbol || buyStock.shares < 1 || buyStock.isProcessing
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                      >
                        {buyStock.isProcessing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          `Buy ${buyStock.shares} ${buyStock.shares === 1 ? 'Share' : 'Shares'}`
                        )}
                      </button>
                      
                      {/* Cancel button */}
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => {
                          if (buyStock.isProcessing) return;
                          setShowBuyForm(false);
                          setBuyStock({
                            symbol: '',
                            name: '',
                            shares: 1,
                            price: 0,
                            sector: '',
                            country: '',
                            predictionYears: 5,
                            isProcessing: false
                          });
                          setSearchQuery('');
                          setSearchResults([]);
                        }}
                        disabled={buyStock.isProcessing}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
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
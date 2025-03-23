// Financial Modeling Prep API utility functions
const FMP_API_KEY = 'pru6MU79VDKfOxFifSsK52BMY32vBUYc';
const FMP_BASE_URL = 'https://financialmodelingprep.com/api/v3';

/**
 * Get real-time stock quote
 */
export const getStockQuote = async (symbol: string) => {
  try {
    const response = await fetch(`${FMP_BASE_URL}/quote/${symbol}?apikey=${FMP_API_KEY}`);
    const data = await response.json();
    return data[0]; // FMP returns an array with a single quote object
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return null;
  }
};

/**
 * Search for stocks by name or symbol
 */
export const searchStocks = async (query: string) => {
  try {
    const response = await fetch(`${FMP_BASE_URL}/search?query=${query}&limit=10&apikey=${FMP_API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
};

/**
 * Get company profile information
 */
export const getCompanyProfile = async (symbol: string) => {
  try {
    const response = await fetch(`${FMP_BASE_URL}/profile/${symbol}?apikey=${FMP_API_KEY}`);
    const data = await response.json();
    return data[0]; // FMP returns an array with a single profile object
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return null;
  }
};

/**
 * Get historical stock prices
 */
export const getHistoricalPrices = async (symbol: string, from: string, to: string) => {
  try {
    const response = await fetch(
      `${FMP_BASE_URL}/historical-price-full/${symbol}?from=${from}&to=${to}&apikey=${FMP_API_KEY}`
    );
    const data = await response.json();
    return data.historical;
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    return [];
  }
};

/**
 * Get company financial ratios
 */
export const getFinancialRatios = async (symbol: string) => {
  try {
    const response = await fetch(`${FMP_BASE_URL}/ratios/${symbol}?apikey=${FMP_API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching financial ratios:', error);
    return [];
  }
};

/**
 * Get company news
 */
export const getCompanyNews = async (symbol: string, limit = 5) => {
  try {
    const response = await fetch(`${FMP_BASE_URL}/stock_news?tickers=${symbol}&limit=${limit}&apikey=${FMP_API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching company news:', error);
    return [];
  }
};

/**
 * Get market movers (gainers, losers)
 */
export const getMarketMovers = async (type: 'gainers' | 'losers') => {
  try {
    const response = await fetch(`${FMP_BASE_URL}/stock_market/${type}?apikey=${FMP_API_KEY}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching market ${type}:`, error);
    return [];
  }
}; 
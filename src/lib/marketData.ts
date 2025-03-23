import axios from 'axios';

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
}

interface CompanyProfile {
  name: string;
  industry: string;
  marketCap: number;
  peRatio: number;
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    const data = response.data['Global Quote'];
    return {
      symbol: data['01. symbol'],
      price: parseFloat(data['05. price']),
      change: parseFloat(data['09. change']),
      changePercent: parseFloat(data['10. change percent'].replace('%', '')),
      high: parseFloat(data['03. high']),
      low: parseFloat(data['04. low']),
      volume: parseInt(data['06. volume']),
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
}

export async function getCompanyProfile(symbol: string): Promise<CompanyProfile> {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`
    );

    return {
      name: response.data.name,
      industry: response.data.finnhubIndustry,
      marketCap: response.data.marketCapitalization,
      peRatio: response.data.peRatio,
    };
  } catch (error) {
    console.error('Error fetching company profile:', error);
    throw error;
  }
}

export async function getHistoricalData(symbol: string): Promise<any[]> {
  try {
    const response = await axios.get(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );

    const timeSeriesData = response.data['Time Series (Daily)'];
    return Object.entries(timeSeriesData).map(([date, values]: [string, any]) => ({
      date,
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
    }));
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
}
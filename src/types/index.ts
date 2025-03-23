export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  stocks: Stock[];
}

export interface Stock {
  symbol: string;
  shares: number;
  average_price: number;
  current_price: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
}
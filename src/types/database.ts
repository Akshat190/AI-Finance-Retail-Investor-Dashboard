export interface Portfolio {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Holding {
  id: string;
  portfolio_id: string;
  symbol: string;
  shares: number;
  average_price: number;
  created_at: string;
  updated_at: string;
}

export interface AISignal {
  id: string;
  symbol: string;
  signal_type: string;
  confidence: number;
  created_at: string;
  recommendation: string;
  risk_level: string;
}

export interface PortfolioWithHoldings extends Portfolio {
  holdings: Holding[];
}
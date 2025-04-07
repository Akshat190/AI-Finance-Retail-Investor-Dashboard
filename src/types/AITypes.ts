// src/types/AITypes.ts

// Common types for AI services
export interface AIServiceOptions {
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
  provider?: 'gemini' | 'openrouter';
  model?: string;
}

// Portfolio Analysis Types
export interface Portfolio {
  holdings: PortfolioHolding[];
  totalValue: number;
  cashBalance: number;
}

export interface PortfolioHolding {
  ticker: string;
  name: string;
  shares: number;
  price: number;
  value: number;
  costBasis: number;
  returnPct: number;
  weight: number;
}

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

export interface PortfolioAnalysisResult {
  analysis: string;
  diversificationScore: number;
  riskScore: number;
  recommendations: string[];
}

// Investment Recommendation Types
export interface InvestmentIdea {
  ticker: string;
  name: string;
  type: 'stock' | 'etf' | 'bond' | 'crypto' | 'other';
  reason: string;
  riskLevel: RiskProfile;
  potentialReturn: string;
  suggestedAllocation: number;
}

// Investment Advisor Types
export interface InvestmentThesis {
  ticker: string;
  thesis: string;
  bullishFactors: string[];
  bearishFactors: string[];
  keyMetrics: Record<string, string>;
  recommendation: 'buy' | 'hold' | 'sell';
  targetPrice: string;
  timeHorizon: string;
}

export interface ComparativeAnalysis {
  tickers: string[];
  comparison: Record<string, Record<string, string>>;
  analysis: string;
  recommendation: string;
}

// Portfolio Management Types
export interface PortfolioRebalanceRecommendation {
  ticker: string;
  action: 'buy' | 'sell' | 'hold';
  shares: number;
  reasoning: string;
}

export interface PortfolioAllocation {
  ticker: string;
  name: string;
  type: 'stock' | 'etf' | 'bond' | 'crypto' | 'cash' | 'other';
  allocation: number;
  reasoning: string;
}

// Chat Types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// Autocomplete Types
export interface AutocompleteOptions {
  limit?: number;
  threshold?: number;
  temperature?: number;
}

export interface AutocompleteResult {
  text: string;
  description?: string;
  score?: number;
}

// AI Insight Types
export interface MarketSentiment {
  overall: 'bearish' | 'neutral' | 'bullish';
  sectors: {
    [sector: string]: 'bearish' | 'neutral' | 'bullish';
  };
  analysis: string;
}

export interface MarketIndicator {
  name: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  sentiment: 'bearish' | 'neutral' | 'bullish';
  description: string;
}

export interface TickerSentiment {
  ticker: string;
  sentiment: 'bearish' | 'neutral' | 'bullish';
  confidenceScore: number;
  keyFactors: string[];
}

// New Market Prediction Types
export interface MarketPrediction {
  timeframe: 'day' | 'week' | 'month' | 'quarter';
  marketOutlook: 'bearish' | 'neutral' | 'bullish';
  confidenceScore: number;
  keyDrivers: string[];
  sectorPredictions: SectorPrediction[];
  majorIndexPredictions: IndexPrediction[];
  analysis: string;
  createdAt: Date;
}

export interface SectorPrediction {
  sector: string;
  outlook: 'bearish' | 'neutral' | 'bullish';
  potentialReturn: string;
  keyStocks: string[];
  rationale: string;
}

export interface IndexPrediction {
  index: string;
  currentValue: number;
  predictedRange: {
    low: number;
    high: number;
  };
  confidence: number;
  keyDrivers: string[];
}

export interface PricePrediction {
  ticker: string;
  currentPrice: number;
  predictedPrices: {
    oneDay?: number;
    oneWeek?: number;
    oneMonth?: number;
    threeMonths?: number;
  };
  supportLevels: number[];
  resistanceLevels: number[];
  confidence: number;
  technicalFactors: string[];
  fundamentalFactors: string[];
}

// User Preferences
export interface AIUserPreferences {
  riskTolerance: RiskProfile;
  investmentHorizon: 'short' | 'medium' | 'long';
  aiFeatures: {
    portfolioAnalysis: boolean;
    recommendations: boolean;
    chatbot: boolean;
    automatedAnalysis: boolean;
    marketPredictions: boolean;
  };
  apiKeys?: {
    openai?: string;
    gemini?: string;
  };
} 
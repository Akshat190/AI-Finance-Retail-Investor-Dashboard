import { useState, useEffect } from 'react';
import { getStockQuote, getCompanyProfile } from '../lib/marketData';
import { generatePortfolioPredictions } from '../lib/aiPredictions';
import type { PortfolioWithHoldings } from '../types/database';
import type { AIPrediction } from '../lib/aiPredictions';

export function useMarketData(portfolio: PortfolioWithHoldings) {
  const [quotes, setQuotes] = useState<Record<string, any>>({});
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMarketData();
  }, [portfolio]);

  async function fetchMarketData() {
    try {
      setLoading(true);
      
      // Fetch real-time quotes for all holdings
      const quotesData: Record<string, any> = {};
      for (const holding of portfolio.holdings) {
        const quote = await getStockQuote(holding.symbol);
        quotesData[holding.symbol] = quote;
      }
      setQuotes(quotesData);

      // Generate AI predictions
      const predictions = await generatePortfolioPredictions(portfolio);
      setPredictions(predictions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return {
    quotes,
    predictions,
    loading,
    error,
    refreshData: fetchMarketData
  };
}
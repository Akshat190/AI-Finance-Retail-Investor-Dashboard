import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { PortfolioWithHoldings, Holding } from '../types/database';

export function usePortfolio() {
  const [portfolios, setPortfolios] = useState<PortfolioWithHoldings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  async function fetchPortfolios() {
    try {
      const { data: portfoliosData, error: portfoliosError } = await supabase
        .from('portfolios')
        .select('*')
        .order('created_at', { ascending: false });

      if (portfoliosError) throw portfoliosError;

      const portfoliosWithHoldings = await Promise.all(
        portfoliosData.map(async (portfolio) => {
          const { data: holdings, error: holdingsError } = await supabase
            .from('holdings')
            .select('*')
            .eq('portfolio_id', portfolio.id);

          if (holdingsError) throw holdingsError;

          return {
            ...portfolio,
            holdings: holdings || [],
          };
        })
      );

      setPortfolios(portfoliosWithHoldings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function addHolding(portfolioId: string, holding: Omit<Holding, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('holdings')
        .insert([{ ...holding, portfolio_id: portfolioId }])
        .select()
        .single();

      if (error) throw error;

      setPortfolios(current =>
        current.map(portfolio =>
          portfolio.id === portfolioId
            ? { ...portfolio, holdings: [...portfolio.holdings, data] }
            : portfolio
        )
      );

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }

  async function updateHolding(holdingId: string, updates: Partial<Holding>) {
    try {
      const { data, error } = await supabase
        .from('holdings')
        .update(updates)
        .eq('id', holdingId)
        .select()
        .single();

      if (error) throw error;

      setPortfolios(current =>
        current.map(portfolio => ({
          ...portfolio,
          holdings: portfolio.holdings.map(holding =>
            holding.id === holdingId ? { ...holding, ...data } : holding
          ),
        }))
      );

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    }
  }

  return {
    portfolios,
    loading,
    error,
    addHolding,
    updateHolding,
    refreshPortfolios: fetchPortfolios,
  };
}
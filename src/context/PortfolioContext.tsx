import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';

interface PortfolioContextType {
  stocks: any[];
  loading: boolean;
  error: string | null;
  fetchStocks: () => Promise<void>;
  addStock: (stock: any) => Promise<void>;
  updateStock: (id: string, updates: any) => Promise<void>;
  deleteStock: (id: string) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = async () => {
    if (!user) {
      setStocks([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('portfolio')
        .select('*')
        .eq('user_id', user.id)
        .order('symbol', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setStocks(data || []);
    } catch (err: any) {
      console.error('Error fetching stocks:', err);
      setError(err.message || 'Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  };

  const addStock = async (stock: any) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: insertError } = await supabase
        .from('portfolio')
        .insert([{ ...stock, user_id: user.id }])
        .select();

      if (insertError) {
        throw insertError;
      }

      setStocks(prevStocks => [...prevStocks, data![0]]);
    } catch (err: any) {
      console.error('Error adding stock:', err);
      setError(err.message || 'Failed to add stock to portfolio');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id: string, updates: any) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('portfolio')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (updateError) {
        throw updateError;
      }

      setStocks(prevStocks => 
        prevStocks.map(stock => 
          stock.id === id ? { ...stock, ...updates } : stock
        )
      );
    } catch (err: any) {
      console.error('Error updating stock:', err);
      setError(err.message || 'Failed to update stock');
    } finally {
      setLoading(false);
    }
  };

  const deleteStock = async (id: string) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('portfolio')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      setStocks(prevStocks => prevStocks.filter(stock => stock.id !== id));
    } catch (err: any) {
      console.error('Error deleting stock:', err);
      setError(err.message || 'Failed to delete stock');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [user]);

  const value = {
    stocks,
    loading,
    error,
    fetchStocks,
    addStock,
    updateStock,
    deleteStock
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}; 
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { AISignal } from '../types/database';

export function useAISignals() {
  const [signals, setSignals] = useState<AISignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSignals();
  }, []);

  async function fetchSignals() {
    try {
      const { data, error } = await supabase
        .from('ai_signals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSignals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return {
    signals,
    loading,
    error,
    refreshSignals: fetchSignals,
  };
}
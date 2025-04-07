-- AI Market Predictions Table
CREATE TABLE IF NOT EXISTS ai_market_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timeframe TEXT NOT NULL,
  market_outlook TEXT NOT NULL,
  confidence_score INTEGER NOT NULL,
  key_drivers TEXT[] NOT NULL,
  sector_predictions JSONB NOT NULL,
  index_predictions JSONB NOT NULL,
  analysis TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ai_market_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_market_predictions ON ai_market_predictions FOR SELECT 
  USING (true);

-- AI Price Predictions Table
CREATE TABLE IF NOT EXISTS ai_price_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticker TEXT NOT NULL,
  current_price NUMERIC NOT NULL,
  predicted_prices JSONB NOT NULL,
  support_levels NUMERIC[] NOT NULL,
  resistance_levels NUMERIC[] NOT NULL,
  confidence INTEGER NOT NULL,
  technical_factors TEXT[] NOT NULL,
  fundamental_factors TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ai_price_predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_price_predictions ON ai_price_predictions FOR SELECT 
  USING (true);

-- User Prediction Watchlist
CREATE TABLE IF NOT EXISTS user_prediction_watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  ticker TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_prediction_watchlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_watchlist ON user_prediction_watchlist FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY insert_own_watchlist ON user_prediction_watchlist FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY delete_own_watchlist ON user_prediction_watchlist FOR DELETE 
  USING (auth.uid() = user_id); 
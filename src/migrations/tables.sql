-- Profile table with risk profile
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  risk_profile TEXT DEFAULT 'moderate',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_profile ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY update_own_profile ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  gemini_api_key TEXT,
  use_default_key BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_settings ON user_settings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY insert_own_settings ON user_settings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_own_settings ON user_settings FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY delete_own_settings ON user_settings FOR DELETE 
  USING (auth.uid() = user_id);

-- AI Investment Ideas Table
CREATE TABLE IF NOT EXISTS ai_investment_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  risk_profile TEXT NOT NULL,
  ideas JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ai_investment_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_ideas ON ai_investment_ideas FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY insert_own_ideas ON ai_investment_ideas FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- AI Investment Theses Table
CREATE TABLE IF NOT EXISTS ai_investment_theses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticker TEXT NOT NULL,
  risk_profile TEXT NOT NULL,
  thesis JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ai_investment_theses ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_theses ON ai_investment_theses FOR SELECT 
  USING (true);

-- AI Comparative Analyses Table
CREATE TABLE IF NOT EXISTS ai_comparative_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tickers TEXT[] NOT NULL,
  risk_profile TEXT NOT NULL,
  comparison JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ai_comparative_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_analyses ON ai_comparative_analyses FOR SELECT 
  USING (true);

-- AI Market Sentiment Table
CREATE TABLE IF NOT EXISTS ai_market_sentiment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sentiment JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ai_market_sentiment ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_sentiment ON ai_market_sentiment FOR SELECT 
  USING (true);

-- AI Ticker Sentiment Table
CREATE TABLE IF NOT EXISTS ai_ticker_sentiment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticker TEXT NOT NULL,
  sentiment JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ai_ticker_sentiment ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_ticker_sentiment ON ai_ticker_sentiment FOR SELECT 
  USING (true);

-- AI Portfolio Allocations Table
CREATE TABLE IF NOT EXISTS ai_portfolio_allocations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  risk_profile TEXT NOT NULL,
  investment_amount NUMERIC,
  time_horizon TEXT NOT NULL,
  allocations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ai_portfolio_allocations ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_allocations ON ai_portfolio_allocations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY insert_own_allocations ON ai_portfolio_allocations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- AI Portfolio Analyses Table
CREATE TABLE IF NOT EXISTS ai_portfolio_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  portfolio JSONB NOT NULL,
  analysis JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ai_portfolio_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_analyses ON ai_portfolio_analyses FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY insert_own_analyses ON ai_portfolio_analyses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- AI Portfolio Rebalancing Recommendations Table
CREATE TABLE IF NOT EXISTS ai_portfolio_rebalancing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  current_portfolio JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ai_portfolio_rebalancing ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_rebalancing ON ai_portfolio_rebalancing FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY insert_own_rebalancing ON ai_portfolio_rebalancing FOR INSERT 
  WITH CHECK (auth.uid() = user_id); 
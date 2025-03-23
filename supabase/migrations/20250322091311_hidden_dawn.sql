/*
  # Investment Dashboard Schema

  1. New Tables
    - `portfolios`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      
    - `holdings`
      - `id` (uuid, primary key)
      - `portfolio_id` (uuid, references portfolios)
      - `symbol` (text)
      - `shares` (numeric)
      - `average_price` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `ai_signals`
      - `id` (uuid, primary key)
      - `symbol` (text)
      - `signal_type` (text)
      - `confidence` (numeric)
      - `created_at` (timestamp)
      - `recommendation` (text)
      - `risk_level` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create holdings table
CREATE TABLE IF NOT EXISTS holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid REFERENCES portfolios ON DELETE CASCADE NOT NULL,
  symbol text NOT NULL,
  shares numeric NOT NULL CHECK (shares >= 0),
  average_price numeric NOT NULL CHECK (average_price > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create AI signals table
CREATE TABLE IF NOT EXISTS ai_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL,
  signal_type text NOT NULL,
  confidence numeric NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
  created_at timestamptz DEFAULT now(),
  recommendation text NOT NULL,
  risk_level text NOT NULL
);

-- Enable Row Level Security
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_signals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own portfolios"
  ON portfolios
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage holdings in their portfolios"
  ON holdings
  FOR ALL
  TO authenticated
  USING (
    portfolio_id IN (
      SELECT id FROM portfolios WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    portfolio_id IN (
      SELECT id FROM portfolios WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can read AI signals"
  ON ai_signals
  FOR SELECT
  TO authenticated
  USING (true);
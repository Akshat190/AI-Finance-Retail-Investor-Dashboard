-- Add use_default_key column to user_settings table
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS use_default_key BOOLEAN DEFAULT TRUE; 
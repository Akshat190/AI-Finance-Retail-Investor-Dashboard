-- Add openrouter_api_key column to user_settings table
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS openrouter_api_key TEXT;

-- Add preferred_ai_provider column to user_settings table with default value 'gemini'
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS preferred_ai_provider TEXT DEFAULT 'gemini'; 
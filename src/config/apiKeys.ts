// API Keys configuration

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'api-key';
export const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || 'api-key';

// Default models
export const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash';
export const DEFAULT_OPENROUTER_MODEL = 'deepseek/deepseek-r1:free';

// API endpoints
export const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/';
export const OPENROUTER_API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

// Other API keys can be added here in the future 

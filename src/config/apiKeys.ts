// API Keys configuration

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyA3YH50t1XHWxvrX7gqtTJzANSSs2O5Azc';
export const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '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';

// Default models
export const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash';
export const DEFAULT_OPENROUTER_MODEL = 'deepseek/deepseek-r1:free';

// API endpoints
export const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1/models/';
export const OPENROUTER_API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

// Other API keys can be added here in the future 
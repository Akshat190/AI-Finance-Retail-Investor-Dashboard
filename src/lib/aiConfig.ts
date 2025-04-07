export interface AIConfig {
  provider: string;
  model: string;
  apiKey: string;
  apiUrl: string;
  headers: Record<string, string>;
}

export function getAIConfig(provider: string, apiKey: string): AIConfig {
  if (provider === 'gemini') {
    return {
      provider: 'gemini',
      model: 'gemini-pro',
      apiKey,
      apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      headers: {
        'Content-Type': 'application/json'
      }
    };
  } else {
    // OpenRouter configuration
    return {
      provider: 'openrouter',
      model: 'qwen/qwen2.5-vl-3b-instruct:free', // Using the specified model
      apiKey,
      apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Finance Portfolio App',
        'Content-Type': 'application/json'
      }
    };
  }
} 
export type AIProvider = 'gemini' | 'openrouter';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  modelName: string;
  baseUrl?: string;
}

// Default configurations for each provider
export const defaultConfigs: Record<AIProvider, Omit<AIConfig, 'apiKey'>> = {
  gemini: {
    provider: 'gemini',
    modelName: 'gemini-2.0-flash',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta'
  },
  openrouter: {
    provider: 'openrouter',
    modelName: 'deepseek/deepseek-r1:free',
    baseUrl: 'https://openrouter.ai/api/v1'
  }
};

// Get configuration with API key
export function getAIConfig(provider: AIProvider, apiKey: string): AIConfig {
  return {
    ...defaultConfigs[provider],
    apiKey
  };
} 
import { GEMINI_API_KEY } from '../config/apiKeys';

// Utility functions for interacting with the Gemini API

/**
 * Get the Gemini API key from user settings or use the default one
 */
export const getGeminiApiKey = async (supabase: any, userId: string): Promise<string> => {
  try {
    // First try to get user's custom API key
    const { data, error } = await supabase
      .from('user_settings')
      .select('gemini_api_key')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching Gemini API key:', error);
      return GEMINI_API_KEY; // Fall back to default key
    }
    
    // Return user's key if it exists, otherwise use default
    return data?.gemini_api_key || GEMINI_API_KEY;
  } catch (error) {
    console.error('Error:', error);
    return GEMINI_API_KEY; // Fall back to default key
  }
};

/**
 * Generate content using the Gemini API
 * If no API key is provided, the default one will be used
 */
export const generateWithGemini = async (
  apiKey: string = GEMINI_API_KEY,
  prompt: string,
  options: {
    temperature?: number;
    maxOutputTokens?: number;
    topK?: number;
    topP?: number;
  } = {}
): Promise<string | null> => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: options.temperature || 0.7,
          maxOutputTokens: options.maxOutputTokens || 2048,
          topK: options.topK || 40,
          topP: options.topP || 0.95
        }
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Gemini API error:', data.error);
      return null;
    }
    
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return null;
  }
};

/**
 * Generate investment recommendations using Gemini
 */
export const generateInvestmentRecommendations = async (
  apiKey: string,
  portfolio: any[],
  riskTolerance: string,
  investmentHorizon: string,
  goals: string[]
): Promise<any | null> => {
  try {
    const prompt = `
      As a financial advisor, provide investment recommendations based on the following:
      
      Current Portfolio: ${JSON.stringify(portfolio)}
      Risk Tolerance: ${riskTolerance}
      Investment Horizon: ${investmentHorizon}
      Financial Goals: ${goals.join(', ')}
      
      Please provide recommendations for:
      1. Mutual Funds (3 options)
      2. Fixed Deposits (2 options)
      3. Stocks (3 options)
      
      For each recommendation, include:
      - Name/Symbol
      - Why it's recommended (brief reasoning)
      - Expected returns
      - Risk level
      - Any special considerations
      
      Format your response as JSON with this structure:
      {
        "mutualFunds": [
          {
            "name": "Fund Name",
            "ticker": "TICKER",
            "reasoning": "Why recommended",
            "expectedReturn": "X%",
            "riskLevel": "Low/Medium/High",
            "considerations": "Any special notes"
          }
        ],
        "fixedDeposits": [...],
        "stocks": [...]
      }
    `;
    
    const result = await generateWithGemini(apiKey, prompt, { temperature: 0.2 });
    
    if (!result) return null;
    
    // Extract JSON from the response
    const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : result;
    
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Failed to parse JSON from Gemini response:', e);
      return null;
    }
  } catch (error) {
    console.error('Error generating investment recommendations:', error);
    return null;
  }
};

/**
 * Analyze market conditions using Gemini
 */
export const analyzeMarketConditions = async (apiKey: string): Promise<any | null> => {
  try {
    const prompt = `
      As a financial analyst, provide a brief assessment of current market conditions.
      
      Please include:
      1. Overall market sentiment (Bullish/Neutral/Bearish)
      2. Volatility assessment (Low/Medium/High)
      3. Interest rate trend (Rising/Stable/Falling)
      4. A brief summary of market conditions (1-2 sentences)
      
      Format your response as JSON with this structure:
      {
        "sentiment": "Bullish/Neutral/Bearish",
        "volatility": "Low/Medium/High",
        "interestRateTrend": "Rising/Stable/Falling",
        "summary": "Brief market summary"
      }
    `;
    
    const result = await generateWithGemini(apiKey, prompt, { temperature: 0.1 });
    
    if (!result) return null;
    
    // Extract JSON from the response
    const jsonMatch = result.match(/```json\n([\s\S]*?)\n```/) || result.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : result;
    
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Failed to parse JSON from Gemini response:', e);
      return null;
    }
  } catch (error) {
    console.error('Error analyzing market conditions:', error);
    return null;
  }
}; 
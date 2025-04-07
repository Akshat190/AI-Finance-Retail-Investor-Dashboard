import AIService from './AIService';
import { supabase } from '../utils/supabaseClient';
import { MarketSentiment, TickerSentiment } from '../types/AITypes';
import cacheService from '../utils/cacheService';
import { extractJsonFromResponse } from '../utils/aiResponseParser';

/**
 * Service for generating market sentiment analysis using AI
 */
class AIMarketSentimentService {
  private aiService = AIService;

  /**
   * Get current market sentiment analysis
   * Now with 6-hour caching to prevent frequent reloading
   */
  async getMarketSentiment(forceRefresh = false): Promise<MarketSentiment> {
    const cacheKey = 'market_sentiment';
    
    // Clear cache if forced refresh
    if (forceRefresh) {
      cacheService.clearItem(cacheKey);
    }
    
    // Try to get from cache first (if not forced refresh)
    const cachedSentiment = cacheService.getWithExpiry(cacheKey);
    if (cachedSentiment && !forceRefresh) {
      console.log('Using cached market sentiment');
      return cachedSentiment;
    }
    
    try {
      // Define sectors to analyze
      const sectors = [
        'Technology',
        'Healthcare',
        'Financials',
        'Consumer Discretionary',
        'Energy',
        'Industrials',
        'Communication Services',
        'Materials',
        'Utilities',
        'Real Estate'
      ];
      
      const prompt = `
        Analyze the current market sentiment and provide an overall assessment.
        
        Include:
        1. Overall market sentiment (bearish, neutral, or bullish)
        2. Sector-specific sentiment for the following sectors:
           ${sectors.join(', ')}
        3. A brief analysis of the current market conditions (1-2 paragraphs)
        
        Return the data in the following JSON format WITHOUT using markdown code blocks:
        {
          "overall": "bearish" | "neutral" | "bullish",
          "sectors": {
            "Technology": "bearish" | "neutral" | "bullish",
            ... (for each sector)
          },
          "analysis": "Brief analysis of market conditions"
        }
      `;

      const systemPrompt = "You are a financial market analyst specializing in sentiment analysis across different market sectors. Return your response as a valid JSON object without code block markers.";
      
      try {
        // First try with Gemini
        const response = await this.aiService.generateCompletion(prompt, {
          systemPrompt,
          temperature: 0.3,
          provider: 'gemini'
        });

        // Use the utility function to extract JSON from the response
        const sentiment = extractJsonFromResponse(response);
        
        // Validate required fields
        if (!sentiment.overall || !sentiment.sectors || !sentiment.analysis) {
          throw new Error("Incomplete sentiment data received");
        }
        
        // Store in the database
        await this.logMarketSentiment(sentiment);
        
        // Cache the sentiment for 6 hours
        cacheService.setWithExpiry(cacheKey, sentiment);
        
        return sentiment;
      } catch (geminiError) {
        console.error("Failed with Gemini, trying OpenRouter:", geminiError);
        
        // Try with OpenRouter as backup
        const response = await this.aiService.generateCompletion(prompt, {
          systemPrompt,
          temperature: 0.3,
          provider: 'openrouter',
          model: 'deepseek/deepseek-r1:free'
        });
        
        // Use the utility function to extract JSON from the response
        const sentiment = extractJsonFromResponse(response);
        
        // Validate required fields
        if (!sentiment.overall || !sentiment.sectors || !sentiment.analysis) {
          throw new Error("Incomplete sentiment data received");
        }
        
        // Store in the database
        await this.logMarketSentiment(sentiment);
        
        // Cache the sentiment for 6 hours
        cacheService.setWithExpiry(cacheKey, sentiment);
        
        return sentiment;
      }
    } catch (error) {
      console.error("Market sentiment error:", error);
      throw error;
    }
  }

  /**
   * Get sentiment analysis for a specific ticker
   * Now with 6-hour caching to prevent frequent reloading
   */
  async getTickerSentiment(ticker: string, forceRefresh = false): Promise<TickerSentiment> {
    const cacheKey = `ticker_sentiment_${ticker.toUpperCase()}`;
    
    // Clear cache if forced refresh
    if (forceRefresh) {
      cacheService.clearItem(cacheKey);
    }
    
    // Try to get from cache first
    const cachedSentiment = cacheService.getWithExpiry(cacheKey);
    if (cachedSentiment && !forceRefresh) {
      console.log(`Using cached ticker sentiment for ${ticker}`);
      return cachedSentiment;
    }
    
    try {
      const prompt = `
        Analyze the market sentiment for ${ticker.toUpperCase()} stock.
        
        Include:
        1. Overall sentiment (bearish, neutral, or bullish)
        2. Confidence score (0-100)
        3. Key factors influencing this sentiment (4-5 bullet points)
        
        Return the data in the following JSON format WITHOUT using markdown code blocks:
        {
          "ticker": "${ticker.toUpperCase()}",
          "sentiment": "bearish" | "neutral" | "bullish",
          "confidenceScore": 75,
          "keyFactors": [
            "Factor 1",
            "Factor 2",
            "Factor 3",
            "Factor 4"
          ]
        }
      `;

      const systemPrompt = "You are a financial analyst specializing in individual stock sentiment analysis. Return your response as a valid JSON object without code block markers.";
      
      try {
        // First try with Gemini
        const response = await this.aiService.generateCompletion(prompt, {
          systemPrompt,
          temperature: 0.3,
          provider: 'gemini'
        });

        // Use the utility function to extract JSON from the response
        const sentiment = extractJsonFromResponse(response);
        
        // Validate required fields
        if (!sentiment.ticker || !sentiment.sentiment || !sentiment.confidenceScore || !sentiment.keyFactors) {
          throw new Error("Incomplete ticker sentiment data received");
        }
        
        // Store in the database
        await this.logTickerSentiment(sentiment);
        
        // Cache the sentiment for 6 hours
        cacheService.setWithExpiry(cacheKey, sentiment);
        
        return sentiment;
      } catch (geminiError) {
        console.error("Failed with Gemini, trying OpenRouter for ticker sentiment:", geminiError);
        
        // Try with OpenRouter as backup
        const response = await this.aiService.generateCompletion(prompt, {
          systemPrompt,
          temperature: 0.3,
          provider: 'openrouter',
          model: 'deepseek/deepseek-r1:free'
        });
        
        // Use the utility function to extract JSON from the response
        const sentiment = extractJsonFromResponse(response);
        
        // Validate required fields
        if (!sentiment.ticker || !sentiment.sentiment || !sentiment.confidenceScore || !sentiment.keyFactors) {
          throw new Error("Incomplete ticker sentiment data received");
        }
        
        // Store in the database
        await this.logTickerSentiment(sentiment);
        
        // Cache the sentiment for 6 hours
        cacheService.setWithExpiry(cacheKey, sentiment);
        
        return sentiment;
      }
    } catch (error) {
      console.error("Ticker sentiment error:", error);
      throw error;
    }
  }

  /**
   * Get sentiment for key market indicators
   */
  async getMarketIndicatorsSentiment(): Promise<{
    indicators: Record<string, {
      value: string;
      trend: 'up' | 'down' | 'stable';
      sentiment: 'bearish' | 'neutral' | 'bullish';
    }>;
    summary: string;
  }> {
    try {
      const prompt = `
        Provide an analysis of key market indicators and their current sentiment implications.
        
        Analyze the following indicators:
        - S&P 500
        - Dow Jones Industrial Average
        - NASDAQ Composite
        - VIX (Volatility Index)
        - 10-Year Treasury Yield
        - US Dollar Index
        - Crude Oil
        - Gold
        
        For each indicator, provide:
        - A realistic current value based on recent market knowledge
        - Whether the trend is up, down, or stable
        - Whether this is considered bearish, neutral, or bullish for the broader market
        
        Return your response as a JSON object with the following format WITHOUT using markdown code blocks:
        {
          "indicators": {
            "S&P 500": {
              "value": "approximate current value",
              "trend": "up" | "down" | "stable",
              "sentiment": "bearish" | "neutral" | "bullish"
            },
            ... (other indicators)
          },
          "summary": "A brief summary of what these indicators suggest about market sentiment"
        }
      `;

      const systemPrompt = "You are a market analyst specializing in indicator analysis and sentiment interpretation. Return your response as a valid JSON object without code block markers.";
      
      const response = await this.aiService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.2,
        provider: 'openrouter',
        model: 'deepseek/deepseek-r1:free'
      });

      try {
        // Use the utility function to extract JSON from the response
        const indicatorSentiment = extractJsonFromResponse(response);
        
        // Validate required fields
        if (!indicatorSentiment.indicators || !indicatorSentiment.summary) {
          throw new Error("Incomplete indicator sentiment data received");
        }
        
        // Log the indicator sentiment to the database
        await this.logIndicatorSentiment(indicatorSentiment);
        
        return indicatorSentiment;
      } catch (parseError) {
        console.error("Failed to parse indicator sentiment response:", parseError);
        throw new Error("Failed to analyze indicator sentiment. Please try again.");
      }
    } catch (error) {
      console.error("Indicator sentiment error:", error);
      throw error;
    }
  }

  /**
   * Log market sentiment to the database
   */
  private async logMarketSentiment(sentiment: MarketSentiment): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      const { error } = await supabase
        .from('market_sentiment_logs')
        .insert({
          overall: sentiment.overall,
          sectors: sentiment.sectors,
          analysis: sentiment.analysis,
          user_id: user?.id,
          created_at: new Date()
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging market sentiment:", error);
    }
  }

  /**
   * Log ticker sentiment to the database
   */
  private async logTickerSentiment(sentiment: TickerSentiment): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      const { error } = await supabase
        .from('ticker_sentiment_logs')
        .insert({
          ticker: sentiment.ticker,
          sentiment: sentiment.sentiment,
          confidence_score: sentiment.confidenceScore,
          key_factors: sentiment.keyFactors,
          user_id: user?.id,
          created_at: new Date()
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging ticker sentiment:", error);
    }
  }

  /**
   * Log indicator sentiment to the database
   */
  private async logIndicatorSentiment(
    indicatorSentiment: any
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_indicator_sentiment')
        .insert({
          indicators: indicatorSentiment.indicators,
          summary: indicatorSentiment.summary,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging indicator sentiment:", error);
    }
  }
}

export default new AIMarketSentimentService(); 
import AIService from './AIService';
import { supabase } from '../lib/supabase';
import { MarketPrediction, PricePrediction, SectorPrediction } from '../types/AITypes';
import { extractJsonFromResponse } from '../utils/aiResponseParser';
import cacheService from '../utils/cacheService';

/**
 * Service for generating market and price predictions using AI
 */
class AIMarketPredictionService {
  private aiService: typeof AIService;
  private sectors = [
    'Technology', 
    'Healthcare', 
    'Financials', 
    'Consumer Discretionary', 
    'Consumer Staples',
    'Energy', 
    'Industrials', 
    'Materials', 
    'Utilities', 
    'Real Estate', 
    'Communication Services'
  ];

  private indices = [
    { name: 'S&P 500', symbol: 'SPX' },
    { name: 'Dow Jones Industrial Average', symbol: 'DJI' },
    { name: 'Nasdaq Composite', symbol: 'IXIC' },
    { name: 'Russell 2000', symbol: 'RUT' },
    { name: 'VIX', symbol: 'VIX' }
  ];

  constructor() {
    this.aiService = AIService;
  }

  /**
   * Generate a market prediction for the specified timeframe
   * Now with 6-hour caching to prevent frequent reloading
   */
  async generateMarketPrediction(timeframe: 'day' | 'week' | 'month' | 'quarter'): Promise<MarketPrediction> {
    const cacheKey = `market_prediction_${timeframe}`;
    
    // Try to get from cache first
    const cachedPrediction = cacheService.getWithExpiry(cacheKey);
    if (cachedPrediction) {
      console.log(`Using cached market prediction for ${timeframe}`);
      return cachedPrediction;
    }
    
    try {
      const timeframeText = 
        timeframe === 'day' ? 'next trading day' : 
        timeframe === 'week' ? 'next week' : 
        timeframe === 'month' ? 'next month' : 'next quarter';

      const prompt = `
        Generate a market prediction for the ${timeframeText}.
        
        Analyze key market indicators, sentiment, and technical factors to predict:
        1. Overall market outlook (bearish, neutral, or bullish)
        2. Confidence score (0-100) in this prediction
        3. Key drivers affecting your prediction
        
        For each of these sectors, provide an outlook (bearish, neutral, or bullish), potential return range, 
        and 1-2 key stocks that might perform well in that sector:
        ${this.sectors.join(', ')}
        
        For these major indices, provide your prediction:
        ${this.indices.map(idx => idx.name).join(', ')}
        
        For each index, provide:
        - Current approximate value (best estimate)
        - Predicted range (low and high) for the ${timeframeText}
        - Confidence level (0-100)
        - Key drivers
        
        Return the response as a JSON object WITHOUT using markdown code blocks. Use this format:
        {
          "marketOutlook": "bearish" | "neutral" | "bullish",
          "confidenceScore": number,
          "keyDrivers": ["driver 1", "driver 2", ...],
          "sectorPredictions": [
            {
              "sector": "Technology",
              "outlook": "bearish" | "neutral" | "bullish",
              "potentialReturn": "-2% to +1%",
              "keyStocks": ["AAPL", "MSFT"],
              "rationale": "Brief explanation"
            },
            ... (other sectors)
          ],
          "majorIndexPredictions": [
            {
              "index": "S&P 500",
              "currentValue": 4500,
              "predictedRange": {
                "low": 4400,
                "high": 4600
              },
              "confidence": 70,
              "keyDrivers": ["driver 1", "driver 2"]
            },
            ... (other indices)
          ],
          "analysis": "A detailed analysis of the market prediction"
        }
      `;

      const systemPrompt = "You are a market analyst specializing in short-term market predictions based on technical and fundamental analysis. Provide realistic forecasts with proper uncertainty levels. Respond with a valid JSON object without any markdown code block formatting.";
      
      // Create a list of model configurations to try in sequence
      const modelOptions = [
        { provider: 'gemini', model: 'gemini-1.5-flash' },
        { provider: 'openrouter', model: 'anthropic/claude-3-opus:free' },
        { provider: 'openrouter', model: 'meta-llama/llama-3-70b-instruct:free' },
        { provider: 'openrouter', model: 'deepseek/deepseek-r1:free' },
        { provider: 'gemini', model: 'gemini-pro' }
      ];
      
      let response = null;
      let lastError = null;
      
      // Try each model in sequence until one succeeds
      for (const modelConfig of modelOptions) {
        try {
          console.log(`Trying to generate market prediction with ${modelConfig.provider}/${modelConfig.model}`);
          
          response = await this.aiService.generateContent(prompt, {
            systemPrompt,
            temperature: 0.3,
            provider: modelConfig.provider as 'gemini' | 'openrouter',
            model: modelConfig.model
          });
          
          // If we get here, the API call was successful
          console.log(`Successfully generated market prediction with ${modelConfig.provider}/${modelConfig.model}`);
          break;
        } catch (error) {
          console.error(`Failed to generate with ${modelConfig.provider}/${modelConfig.model}:`, error);
          lastError = error;
          // Continue to the next model
        }
      }
      
      // If all API calls failed, use the mock prediction as a last resort
      if (!response) {
        console.warn(`All API models failed to generate market prediction. Using mock data as fallback.`);
        console.error(`Last error was:`, lastError);
        
        // Generate a mock prediction
        const mockPrediction = this.generateMockMarketPrediction(timeframe);
        
        // Cache the mock prediction (but for a shorter time - 2 hours)
        cacheService.setWithExpiry(cacheKey, mockPrediction, 2 * 60 * 60 * 1000);
        
        // Log that we're using mock data
        await this.logMockUsage('market_prediction', timeframe);
        
        return mockPrediction;
      }

      try {
        // Parse the response
        const prediction = extractJsonFromResponse(response);
        
        // Validate required fields
        if (!prediction.marketOutlook || 
            !prediction.confidenceScore || 
            !prediction.keyDrivers || 
            !prediction.sectorPredictions || 
            !prediction.majorIndexPredictions) {
          throw new Error("Incomplete prediction data received");
        }
        
        // Add timestamp
        const fullPrediction: MarketPrediction = {
          ...prediction,
          timeframe,
          createdAt: new Date()
        };
        
        // Log the prediction to the database
        await this.logMarketPrediction(fullPrediction);
        
        // Cache the prediction for 6 hours
        cacheService.setWithExpiry(cacheKey, fullPrediction);
        
        return fullPrediction;
      } catch (parseError) {
        console.error("Failed to parse market prediction:", parseError);
        
        // If parsing fails, fall back to mock data
        console.warn(`Failed to parse AI response. Using mock data as fallback.`);
        
        // Generate a mock prediction
        const mockPrediction = this.generateMockMarketPrediction(timeframe);
        
        // Cache the mock prediction (but for a shorter time - 2 hours)
        cacheService.setWithExpiry(cacheKey, mockPrediction, 2 * 60 * 60 * 1000);
        
        // Log that we're using mock data
        await this.logMockUsage('market_prediction', timeframe);
        
        return mockPrediction;
      }
    } catch (error) {
      console.error("Market prediction error:", error);
      throw error;
    }
  }

  /**
   * Generate a mock market prediction as a fallback when all API calls fail
   * This creates realistic-looking data for development and emergency fallback
   */
  private generateMockMarketPrediction(timeframe: 'day' | 'week' | 'month' | 'quarter'): MarketPrediction {
    console.log(`Generating mock market prediction for ${timeframe} as emergency fallback`);
    
    const getRandomOutlook = (): 'bearish' | 'neutral' | 'bullish' => {
      const rand = Math.random();
      if (rand < 0.33) return 'bearish';
      if (rand < 0.66) return 'neutral';
      return 'bullish';
    };
    
    const getRandomConfidence = (): number => {
      return Math.floor(Math.random() * 30) + 50; // 50-80 range
    };
    
    const randomReturnRange = (outlook: string): string => {
      let min: number, max: number;
      
      switch (outlook) {
        case 'bearish':
          min = -Math.floor(Math.random() * 8) - 2; // -10 to -2
          max = Math.floor(Math.random() * 3); // 0 to 2
          break;
        case 'neutral':
          min = -Math.floor(Math.random() * 3) - 1; // -4 to -1
          max = Math.floor(Math.random() * 5) + 1; // 1 to 5
          break;
        case 'bullish':
          min = Math.floor(Math.random() * 2); // 0 to 1
          max = Math.floor(Math.random() * 8) + 3; // 3 to 10
          break;
        default:
          min = -2;
          max = 2;
      }
      
      return `${min}% to ${max}%`;
    };
    
    // Generate mock sector predictions
    const sectorPredictions = this.sectors.map(sector => {
      const outlook = getRandomOutlook();
      const keyStocks = {
        'Technology': ['AAPL', 'MSFT', 'NVDA', 'GOOGL'],
        'Healthcare': ['JNJ', 'PFE', 'UNH', 'ABBV'],
        'Financials': ['JPM', 'BAC', 'WFC', 'GS'],
        'Consumer Discretionary': ['AMZN', 'TSLA', 'HD', 'NKE'],
        'Consumer Staples': ['PG', 'KO', 'PEP', 'WMT'],
        'Energy': ['XOM', 'CVX', 'COP', 'SLB'],
        'Industrials': ['CAT', 'BA', 'GE', 'MMM'],
        'Materials': ['LIN', 'FCX', 'APD', 'DOW'],
        'Utilities': ['NEE', 'DUK', 'SO', 'D'],
        'Real Estate': ['AMT', 'PLD', 'CCI', 'SPG'],
        'Communication Services': ['META', 'NFLX', 'DIS', 'CMCSA']
      }[sector] || ['AAPL', 'MSFT'];
      
      // Randomly pick 2 stocks from the sector
      const selectedStocks = [
        keyStocks[Math.floor(Math.random() * keyStocks.length)],
        keyStocks[Math.floor(Math.random() * keyStocks.length)]
      ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
      
      return {
        sector,
        outlook,
        potentialReturn: randomReturnRange(outlook),
        keyStocks: selectedStocks,
        rationale: `Based on current market conditions and technical analysis. ${outlook === 'bullish' ? 'Positive momentum expected.' : outlook === 'bearish' ? 'Caution advised in this sector.' : 'Mixed signals present.'}`
      };
    });
    
    // Generate mock index predictions
    const majorIndexPredictions = this.indices.map(index => {
      const currentValues: { [key: string]: number } = {
        'SPX': 4500 + Math.floor(Math.random() * 200) - 100,
        'DJI': 36000 + Math.floor(Math.random() * 1000) - 500,
        'IXIC': 14500 + Math.floor(Math.random() * 500) - 250,
        'RUT': 2000 + Math.floor(Math.random() * 100) - 50,
        'VIX': 15 + Math.floor(Math.random() * 10) - 5
      };
      
      const currentValue = currentValues[index.symbol];
      const percentChange = Math.random() * 0.05; // 0-5% change
      
      // For VIX, behavior is different
      const isVix = index.symbol === 'VIX';
      const direction = Math.random() > 0.5 ? 1 : -1;
      const change = isVix ? (Math.random() * 5) : (currentValue * percentChange);
      
      const low = isVix 
        ? Math.max(10, currentValue + (direction * change * -1)) 
        : (currentValue - change);
        
      const high = isVix 
        ? Math.max(12, currentValue + (direction * change))
        : (currentValue + change);
      
      return {
        index: index.name,
        currentValue,
        predictedRange: {
          low: Math.round(low * 100) / 100,
          high: Math.round(high * 100) / 100
        },
        confidence: getRandomConfidence(),
        keyDrivers: [
          "Market sentiment",
          "Economic data",
          "Technical patterns",
          isVix ? "Market volatility" : "Sector performance"
        ]
      };
    });
    
    // Define overall market outlook based on S&P prediction
    const spIndex = majorIndexPredictions.find(idx => idx.index === 'S&P 500');
    let marketOutlook: 'bearish' | 'neutral' | 'bullish' = 'neutral';
    
    if (spIndex) {
      const avgPrediction = (spIndex.predictedRange.high + spIndex.predictedRange.low) / 2;
      if (avgPrediction > spIndex.currentValue * 1.01) marketOutlook = 'bullish';
      else if (avgPrediction < spIndex.currentValue * 0.99) marketOutlook = 'bearish';
    }
    
    return {
      marketOutlook,
      confidenceScore: getRandomConfidence(),
      keyDrivers: [
        "Federal Reserve policy",
        "Inflation data",
        "Corporate earnings",
        "Market sentiment",
        "Technical indicators"
      ],
      sectorPredictions,
      majorIndexPredictions,
      analysis: `The market appears to be showing ${marketOutlook} signals for the ${timeframe}. This is primarily driven by recent economic data and technical patterns. Investors should monitor Federal Reserve communications and upcoming earnings reports. Note: This is a mock prediction generated as a fallback due to API unavailability.`,
      timeframe,
      createdAt: new Date()
    };
  }

  /**
   * Generate a mock price prediction as a fallback when all API calls fail
   */
  private generateMockPricePrediction(ticker: string): PricePrediction {
    console.log(`Generating mock price prediction for ${ticker} as emergency fallback`);
    
    // Start with a reasonable price
    const basePrice = 50 + Math.floor(Math.random() * 150);
    const volatility = Math.random() * 0.3 + 0.05; // 5-35% volatility
    
    // Generate some reasonable changes for different timeframes
    const oneDayChange = (Math.random() * 2 - 1) * volatility * 0.2; // -/+ 0.2 * volatility
    const oneWeekChange = (Math.random() * 2 - 1) * volatility * 0.4; // -/+ 0.4 * volatility
    const oneMonthChange = (Math.random() * 2 - 1) * volatility * 0.7; // -/+ 0.7 * volatility
    const threeMonthChange = (Math.random() * 2 - 1) * volatility; // -/+ full volatility
    
    const rounding = (num: number) => Math.round(num * 100) / 100;
    
    // Calculate predicted prices
    const currentPrice = basePrice;
    const oneDayPrice = rounding(basePrice * (1 + oneDayChange));
    const oneWeekPrice = rounding(basePrice * (1 + oneWeekChange));
    const oneMonthPrice = rounding(basePrice * (1 + oneMonthChange));
    const threeMonthPrice = rounding(basePrice * (1 + threeMonthChange));
    
    // Generate reasonable support/resistance levels
    const supportLevels = [
      rounding(basePrice * 0.9),
      rounding(basePrice * 0.85),
      rounding(basePrice * 0.8)
    ];
    
    const resistanceLevels = [
      rounding(basePrice * 1.1),
      rounding(basePrice * 1.15),
      rounding(basePrice * 1.2)
    ];
    
    return {
      ticker,
      currentPrice,
      predictedPrices: {
        oneDay: oneDayPrice,
        oneWeek: oneWeekPrice,
        oneMonth: oneMonthPrice,
        threeMonths: threeMonthPrice
      },
      supportLevels,
      resistanceLevels,
      confidence: Math.floor(Math.random() * 25) + 55, // 55-80% confidence
      technicalFactors: [
        "Moving average trends",
        "Volume patterns",
        "Price momentum",
        "Historical support/resistance levels"
      ],
      fundamentalFactors: [
        "Industry outlook",
        "Recent earnings performance",
        "Market sentiment",
        "Sector rotation trends"
      ]
    };
  }

  /**
   * Generate a price prediction for a specific ticker
   * Now with 6-hour caching to prevent frequent reloading
   */
  async generatePricePrediction(ticker: string): Promise<PricePrediction> {
    const cacheKey = `price_prediction_${ticker}`;
    
    // Try to get from cache first
    const cachedPrediction = cacheService.getWithExpiry(cacheKey);
    if (cachedPrediction) {
      console.log(`Using cached price prediction for ${ticker}`);
      return cachedPrediction;
    }
    
    try {
      const prompt = `
        Generate a detailed price prediction for ${ticker} stock.
        
        Include the following in your prediction:
        1. Current approximate price (best estimate)
        2. Predicted prices for:
           - Next trading day
           - One week
           - One month
           - Three months
        3. Key support levels
        4. Key resistance levels
        5. Confidence level (0-100%)
        6. Key technical factors affecting the prediction
        7. Key fundamental factors affecting the prediction
        
        Return your prediction as a JSON object WITHOUT using markdown code blocks. Use this format:
        {
          "currentPrice": number,
          "predictedPrices": {
            "oneDay": number,
            "oneWeek": number,
            "oneMonth": number,
            "threeMonths": number
          },
          "supportLevels": [number, number, ...],
          "resistanceLevels": [number, number, ...],
          "confidence": number,
          "technicalFactors": ["factor 1", "factor 2", ...],
          "fundamentalFactors": ["factor 1", "factor 2", ...]
        }
      `;

      const systemPrompt = "You are a technical analyst specializing in stock price predictions. Provide realistic predictions with appropriate levels of uncertainty. Respond with a valid JSON object without any markdown code block formatting.";
      
      // Create a list of model configurations to try in sequence
      const modelOptions = [
        { provider: 'gemini', model: 'gemini-1.5-flash' },
        { provider: 'openrouter', model: 'anthropic/claude-3-opus:free' },
        { provider: 'openrouter', model: 'meta-llama/llama-3-70b-instruct:free' },
        { provider: 'openrouter', model: 'deepseek/deepseek-r1:free' },
        { provider: 'gemini', model: 'gemini-pro' }
      ];
      
      let response = null;
      let lastError = null;
      
      // Try each model in sequence until one succeeds
      for (const modelConfig of modelOptions) {
        try {
          console.log(`Trying to generate price prediction for ${ticker} with ${modelConfig.provider}/${modelConfig.model}`);
          
          response = await this.aiService.generateContent(prompt, {
            systemPrompt,
            temperature: 0.3,
            provider: modelConfig.provider as 'gemini' | 'openrouter',
            model: modelConfig.model
          });
          
          // If we get here, the API call was successful
          console.log(`Successfully generated price prediction for ${ticker} with ${modelConfig.provider}/${modelConfig.model}`);
          break;
        } catch (error) {
          console.error(`Failed to generate price prediction with ${modelConfig.provider}/${modelConfig.model}:`, error);
          lastError = error;
          // Continue to the next model
        }
      }
      
      // If all API calls failed, use the mock prediction as a last resort
      if (!response) {
        console.warn(`All API models failed to generate price prediction for ${ticker}. Using mock data as fallback.`);
        console.error(`Last error was:`, lastError);
        
        // Generate a mock prediction
        const mockPrediction = this.generateMockPricePrediction(ticker);
        
        // Cache the mock prediction (but for a shorter time - 2 hours)
        cacheService.setWithExpiry(cacheKey, mockPrediction, 2 * 60 * 60 * 1000);
        
        // Log that we're using mock data
        await this.logMockUsage('price_prediction', ticker);
        
        return mockPrediction;
      }

      try {
        // Use the utility function to parse the response
        const basePrediction = extractJsonFromResponse(response);
        
        // Validate required fields
        if (!basePrediction.currentPrice || 
            !basePrediction.predictedPrices || 
            !basePrediction.supportLevels || 
            !basePrediction.resistanceLevels || 
            !basePrediction.confidence) {
          throw new Error("Incomplete price prediction data received");
        }
        
        // Add ticker to prediction
        const prediction: PricePrediction = {
          ...basePrediction,
          ticker
        };
        
        // Log the prediction to the database
        await this.logPricePrediction(prediction);
        
        // Cache the prediction for 6 hours
        cacheService.setWithExpiry(cacheKey, prediction);
        
        return prediction;
      } catch (parseError) {
        console.error("Failed to parse price prediction:", parseError);
        
        // If parsing fails, fall back to mock data
        console.warn(`Failed to parse AI response for ${ticker}. Using mock data as fallback.`);
        
        // Generate a mock prediction
        const mockPrediction = this.generateMockPricePrediction(ticker);
        
        // Cache the mock prediction (but for a shorter time - 2 hours)
        cacheService.setWithExpiry(cacheKey, mockPrediction, 2 * 60 * 60 * 1000);
        
        // Log that we're using mock data
        await this.logMockUsage('price_prediction', ticker);
        
        return mockPrediction;
      }
    } catch (error) {
      console.error("Price prediction error:", error);
      throw error;
    }
  }

  /**
   * Get top performing sectors prediction for the coming period
   */
  async getTopPerformingSectors(timeframe: 'week' | 'month' | 'quarter'): Promise<SectorPrediction[]> {
    try {
      const marketPrediction = await this.generateMarketPrediction(timeframe);
      
      // Sort sector predictions by outlook and potential return (parsed from string)
      return marketPrediction.sectorPredictions
        .sort((a, b) => {
          // First sort by outlook (bullish > neutral > bearish)
          const outlookScore = {
            'bullish': 3,
            'neutral': 2,
            'bearish': 1
          };
          
          const scoreDiff = outlookScore[a.outlook] - outlookScore[b.outlook];
          if (scoreDiff !== 0) return scoreDiff;
          
          // Then try to sort by potential return if possible
          const getAvgReturn = (returnStr: string) => {
            const matches = returnStr.match(/(-?\d+\.?\d*)%\s*to\s*(-?\d+\.?\d*)%/);
            if (matches && matches.length === 3) {
              const low = parseFloat(matches[1]);
              const high = parseFloat(matches[2]);
              return (low + high) / 2;
            }
            return 0;
          };
          
          return getAvgReturn(b.potentialReturn) - getAvgReturn(a.potentialReturn);
        })
        // Return top 3 sectors
        .slice(0, 3);
    } catch (error) {
      console.error("Top performing sectors error:", error);
      throw error;
    }
  }

  /**
   * Log market prediction to the database
   */
  private async logMarketPrediction(prediction: MarketPrediction): Promise<void> {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      
      // Create base record without user_id
      const record: Record<string, unknown> = {
        timeframe: prediction.timeframe,
        market_outlook: prediction.marketOutlook,
        confidence_score: prediction.confidenceScore,
        key_drivers: prediction.keyDrivers,
        sector_predictions: prediction.sectorPredictions,
        index_predictions: prediction.majorIndexPredictions,
        analysis: prediction.analysis
      };
      
      // Add user_id only if user is authenticated
      if (user?.id) {
        record.user_id = user.id;
      }

      const { error } = await supabase
        .from('ai_market_predictions')
        .insert(record);

      if (error) throw error;
    } catch (error) {
      console.error("Error logging market prediction:", error);
    }
  }

  /**
   * Log price prediction to the database
   */
  private async logPricePrediction(prediction: PricePrediction): Promise<void> {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      
      // Create base record without user_id
      const record: Record<string, unknown> = {
        ticker: prediction.ticker,
        current_price: prediction.currentPrice,
        predicted_prices: prediction.predictedPrices,
        support_levels: prediction.supportLevels,
        resistance_levels: prediction.resistanceLevels,
        confidence: prediction.confidence,
        technical_factors: prediction.technicalFactors,
        fundamental_factors: prediction.fundamentalFactors
      };
      
      // Add user_id only if user is authenticated
      if (user?.id) {
        record.user_id = user.id;
      }

      const { error } = await supabase
        .from('ai_price_predictions')
        .insert(record);

      if (error) throw error;
    } catch (error) {
      console.error("Error logging price prediction:", error);
    }
  }

  /**
   * Add a ticker to the user's watchlist
   * @param ticker The stock ticker to add
   * @returns void
   */
  async addToWatchlist(ticker: string): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { error } = await supabase
        .from('user_prediction_watchlist')
        .insert({
          user_id: user.id,
          ticker: ticker.toUpperCase()
        });
        
      if (error) throw error;
      
    } catch (error) {
      console.error("Error adding ticker to watchlist:", error);
      throw error;
    }
  }
  
  /**
   * Get the user's watchlist
   * @returns Array of ticker symbols in the user's watchlist
   */
  async getWatchlist(): Promise<string[]> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from('user_prediction_watchlist')
        .select('ticker')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      return data.map(item => item.ticker);
      
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      throw error;
    }
  }
  
  /**
   * Remove a ticker from the user's watchlist
   * @param ticker The stock ticker to remove
   * @returns void
   */
  async removeFromWatchlist(ticker: string): Promise<void> {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { error } = await supabase
        .from('user_prediction_watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('ticker', ticker.toUpperCase());
        
      if (error) throw error;
      
    } catch (error) {
      console.error("Error removing ticker from watchlist:", error);
      throw error;
    }
  }

  /**
   * Log when mock data is used due to API failures
   */
  private async logMockUsage(feature: string, context: string): Promise<void> {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      
      const record = {
        feature,
        context,
        timestamp: new Date().toISOString(),
        user_id: user?.id || null,
        reason: 'API_FAILURE'
      };

      const { error } = await supabase
        .from('mock_data_usage')
        .insert(record);

      if (error) console.error("Error logging mock usage:", error);
    } catch (error) {
      console.error("Failed to log mock data usage:", error);
    }
  }
}

export default new AIMarketPredictionService(); 
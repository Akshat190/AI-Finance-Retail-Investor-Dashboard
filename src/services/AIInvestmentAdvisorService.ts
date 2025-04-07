import AIService from './AIService';
import { supabase } from '../lib/supabase';
import { InvestmentIdea, RiskProfile, InvestmentThesis, ComparativeAnalysis } from '../types/AITypes';
import { extractJsonFromResponse } from '../utils/aiResponseParser';
import cacheService from '../utils/cacheService';

class AIInvestmentAdvisorService {
  /**
   * Generate personalized investment ideas based on user preferences
   */
  async generateInvestmentIdeas(
    userId: string,
    preferences: {
      riskProfile: RiskProfile;
      investmentHorizon: 'short' | 'medium' | 'long';
      sectors?: string[];
      excludeSectors?: string[];
      themes?: string[];
      investmentAmount?: number;
    }
  ): Promise<InvestmentIdea[]> {
    // Generate a cache key based on user preferences
    const prefsString = JSON.stringify(preferences);
    // Use a browser-compatible approach instead of Buffer
    const hashKey = btoa(encodeURIComponent(prefsString)).substring(0, 20);
    const cacheKey = `investment_ideas_${userId}_${hashKey}`;
    
    // Try to get from cache first
    const cachedIdeas = cacheService.getWithExpiry(cacheKey);
    if (cachedIdeas) {
      console.log('Using cached investment ideas');
      return cachedIdeas;
    }
    
    try {
      // Build a prompt based on user preferences
      const sectorsText = preferences.sectors?.length
        ? `Focus on these sectors: ${preferences.sectors.join(', ')}`
        : '';
      
      const excludeSectorsText = preferences.excludeSectors?.length
        ? `Exclude these sectors: ${preferences.excludeSectors.join(', ')}`
        : '';
      
      const themesText = preferences.themes?.length
        ? `Consider these investment themes: ${preferences.themes.join(', ')}`
        : '';
      
      const amountText = preferences.investmentAmount
        ? `For an investment amount of approximately $${preferences.investmentAmount}`
        : '';
      
      const prompt = `
        Generate 5 personalized investment ideas for a ${preferences.riskProfile} investor with a ${preferences.investmentHorizon} investment horizon.
        ${sectorsText}
        ${excludeSectorsText}
        ${themesText}
        ${amountText}
        
        For each investment idea:
        1. Provide a specific ticker symbol
        2. Full name of the security
        3. Type of investment (stock, ETF, bond, etc.)
        4. Why it's appropriate for this investor
        5. Risk level (conservative, moderate, aggressive)
        6. Potential return expectation
        7. Suggested allocation percentage
        
        Return the response as an array of JSON objects with the following structure:
        [
          {
            "ticker": "AAPL",
            "name": "Apple Inc.",
            "type": "stock",
            "reason": "Explanation of why this is recommended",
            "riskLevel": "moderate",
            "potentialReturn": "8-10% annually",
            "suggestedAllocation": 15
          },
          ... (other ideas)
        ]
      `;

      const systemPrompt = "You are an investment advisor helping retail investors discover appropriate investment opportunities based on their risk profile and preferences. Always respond with valid JSON array.";
      
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
          console.log(`Trying to generate investment ideas with ${modelConfig.provider}/${modelConfig.model}`);
          
          response = await AIService.generateContent(prompt, {
            systemPrompt,
            temperature: 0.4,
            provider: modelConfig.provider,
            model: modelConfig.model
          });
          
          // If we get here, the API call was successful
          console.log(`Successfully generated investment ideas with ${modelConfig.provider}/${modelConfig.model}`);
          break;
        } catch (error) {
          console.error(`Failed to generate with ${modelConfig.provider}/${modelConfig.model}:`, error);
          lastError = error;
          // Continue to the next model
        }
      }
      
      // If all models failed, throw the last error
      if (!response) {
        throw new Error(`All models failed to generate investment ideas. Last error: ${lastError}`);
      }

      try {
        // Use our enhanced utility to extract and parse JSON from the response
        const ideas = extractJsonFromResponse(response);
        
        // Validate that ideas is an array
        if (!Array.isArray(ideas)) {
          throw new Error("Response is not an array of investment ideas");
        }
        
        // Validate each idea has required fields
        const validIdeas: InvestmentIdea[] = ideas.filter(idea => 
          idea && 
          typeof idea.ticker === 'string' && 
          typeof idea.name === 'string' && 
          typeof idea.type === 'string' &&
          typeof idea.reason === 'string' &&
          typeof idea.riskLevel === 'string' &&
          typeof idea.potentialReturn === 'string' &&
          typeof idea.suggestedAllocation === 'number'
        );
        
        if (validIdeas.length === 0) {
          throw new Error("No valid investment ideas found in response");
        }
        
        // Log the ideas to the database
        await this.logInvestmentIdeas(userId, preferences.riskProfile, validIdeas);
        
        // Cache the results for 6 hours
        cacheService.setWithExpiry(cacheKey, validIdeas);
        
        return validIdeas;
      } catch (parseError) {
        console.error("Failed to parse investment ideas:", parseError);
        
        // Add some debug logging
        console.log("Raw response:", response);
        
        throw new Error("Failed to generate investment ideas. Please try again.");
      }
    } catch (error) {
      console.error("Investment ideas error:", error);
      throw error;
    }
  }

  /**
   * Generate a detailed investment thesis for a specific ticker with caching
   */
  async generateInvestmentThesis(
    ticker: string,
    riskProfile: RiskProfile
  ): Promise<InvestmentThesis> {
    const cacheKey = `investment_thesis_${ticker}_${riskProfile}`;
    
    // Try to get from cache first
    const cachedThesis = cacheService.getWithExpiry(cacheKey);
    if (cachedThesis) {
      console.log(`Using cached investment thesis for ${ticker}`);
      return cachedThesis;
    }
    
    try {
      const prompt = `
        Generate a detailed investment thesis for ${ticker} for a ${riskProfile} investor.
        
        Include the following in your analysis:
        1. Overall investment thesis summary
        2. 3-5 bullish factors
        3. 3-5 bearish factors
        4. Key metrics including P/E ratio, P/B ratio, dividend yield, and any other relevant metrics
        5. Clear buy/hold/sell recommendation
        6. Potential target price or price range
        7. Suggested time horizon for the investment
        
        Return the response as a JSON object with the following structure:
        {
          "thesis": "Detailed investment thesis summary",
          "bullishFactors": ["Factor 1", "Factor 2", ...],
          "bearishFactors": ["Factor 1", "Factor 2", ...],
          "keyMetrics": {
            "P/E Ratio": "value",
            "Dividend Yield": "value",
            ... (other metrics)
          },
          "recommendation": "buy" | "hold" | "sell",
          "targetPrice": "price or range",
          "timeHorizon": "e.g., 1-2 years"
        }
      `;

      const systemPrompt = "You are an investment analyst creating detailed investment theses for individual securities.";
      
      const response = await AIService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.3,
      });

      try {
        // Parse the response
        const thesis: InvestmentThesis = {
          ticker,
          ...JSON.parse(response)
        };
        
        // Log the thesis to the database
        await this.logInvestmentThesis(ticker, riskProfile, thesis);
        
        // Cache the thesis for 6 hours
        cacheService.setWithExpiry(cacheKey, thesis);
        
        return thesis;
      } catch (parseError) {
        console.error("Failed to parse investment thesis:", parseError);
        throw new Error("Failed to generate investment thesis. Please try again.");
      }
    } catch (error) {
      console.error("Investment thesis error:", error);
      throw error;
    }
  }

  /**
   * Get comparative analysis between multiple investments
   */
  async getComparativeAnalysis(
    tickers: string[],
    riskProfile: RiskProfile
  ): Promise<{
    comparison: Record<string, Record<string, string>>;
    analysis: string;
    recommendation: string;
  }> {
    if (tickers.length < 2) {
      throw new Error("At least two tickers are required for comparison");
    }

    try {
      const prompt = `
        Perform a comparative analysis of the following securities: ${tickers.join(', ')}
        
        For a ${riskProfile} investor, compare these securities across key dimensions:
        1. Risk and volatility
        2. Potential returns
        3. Business model and competitive position
        4. Financial health
        5. Valuation metrics
        
        Provide a side-by-side comparison with standardized metrics for each, followed by your analysis
        of the strengths and weaknesses of each, and a final recommendation on which might be most 
        appropriate for a ${riskProfile} investor.
        
        Return the response as a JSON object with the following structure:
        {
          "comparison": {
            "Security 1": {
              "Risk Level": "value",
              "Growth Potential": "value",
              ... (other metrics)
            },
            "Security 2": {
              ... (same metrics)
            }
          },
          "analysis": "Detailed comparative analysis",
          "recommendation": "Final recommendation for this investor"
        }
      `;

      const systemPrompt = "You are an investment analyst performing comparative analysis between different investment options.";
      
      const response = await AIService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.2,
      });

      try {
        // Parse the response
        const comparison = JSON.parse(response);
        
        // Log the comparison to the database
        await this.logComparativeAnalysis(tickers, riskProfile, comparison);
        
        return comparison;
      } catch (parseError) {
        console.error("Failed to parse comparative analysis:", parseError);
        throw new Error("Failed to generate comparative analysis. Please try again.");
      }
    } catch (error) {
      console.error("Comparative analysis error:", error);
      throw error;
    }
  }

  /**
   * Log investment ideas to the database
   */
  private async logInvestmentIdeas(
    userId: string,
    riskProfile: RiskProfile,
    ideas: InvestmentIdea[]
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_investment_ideas')
        .insert({
          user_id: userId,
          risk_profile: riskProfile,
          ideas: ideas,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging investment ideas:", error);
    }
  }

  /**
   * Log investment thesis to the database
   */
  private async logInvestmentThesis(
    ticker: string,
    riskProfile: RiskProfile,
    thesis: InvestmentThesis
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_investment_theses')
        .insert({
          ticker: ticker,
          risk_profile: riskProfile,
          thesis: thesis,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging investment thesis:", error);
    }
  }

  /**
   * Log comparative analysis to the database
   */
  private async logComparativeAnalysis(
    tickers: string[],
    riskProfile: RiskProfile,
    comparison: ComparativeAnalysis
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_comparative_analyses')
        .insert({
          tickers: tickers,
          risk_profile: riskProfile,
          comparison: comparison,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging comparative analysis:", error);
    }
  }
}

export default new AIInvestmentAdvisorService(); 
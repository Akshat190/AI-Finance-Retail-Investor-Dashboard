import AIService from './AIService';
import { supabase } from '../lib/supabase';
import { Portfolio, PortfolioHolding, RiskProfile, PortfolioAnalysisResult } from '../types/AITypes';

class AIPortfolioService {
  /**
   * Generate a recommended portfolio allocation based on user's risk profile and investment goals
   */
  async generatePortfolioAllocation(
    userId: string,
    riskProfile: RiskProfile,
    investmentGoals: string,
    investmentAmount: number,
    timeHorizon: 'short' | 'medium' | 'long'
  ): Promise<{ allocation: Record<string, number>; explanation: string }> {
    try {
      const prompt = `
        Generate an optimal portfolio allocation for a retail investor with the following profile:
        
        Risk Profile: ${riskProfile}
        Investment Goals: ${investmentGoals}
        Investment Amount: $${investmentAmount}
        Time Horizon: ${timeHorizon} term
        
        Create a diversified portfolio allocation across different asset classes (stocks, ETFs, bonds, etc.).
        For each asset class, specify the percentage allocation and 1-2 recommended tickers/funds.
        Ensure the total allocation adds up to 100%.
        
        Return the response as a JSON object with the following structure:
        {
          "allocation": {
            "US_LARGE_CAP": { "percentage": 25, "tickers": ["VTI", "SPY"] },
            "US_SMALL_CAP": { "percentage": 10, "tickers": ["VB", "IJR"] },
            ... other asset classes
          },
          "explanation": "A few sentences explaining the reasoning behind this allocation"
        }
      `;

      const systemPrompt = "You are an expert portfolio manager helping retail investors create optimal portfolio allocations.";
      
      const response = await AIService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.2,
      });
      
      try {
        // Try to parse the response as JSON
        const parsedResponse = JSON.parse(response);
        
        // Log the recommendation to the database
        await this.logPortfolioRecommendation(userId, riskProfile, parsedResponse);
        
        return parsedResponse;
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", parseError);
        throw new Error("Failed to generate portfolio allocation. Please try again.");
      }
    } catch (error) {
      console.error("Portfolio allocation error:", error);
      throw error;
    }
  }

  /**
   * Analyze an existing portfolio and provide recommendations
   */
  async analyzePortfolio(
    userId: string,
    portfolio: Portfolio,
    riskProfile: RiskProfile
  ): Promise<PortfolioAnalysisResult> {
    try {
      // Convert portfolio to a string representation
      const holdingsText = portfolio.holdings
        .map(h => `${h.ticker} (${h.name}): ${h.shares} shares, $${h.value} (${(h.weight * 100).toFixed(1)}% of portfolio)`)
        .join('\n');

      const prompt = `
        Analyze this investment portfolio for a ${riskProfile} investor:
        
        Total Portfolio Value: $${portfolio.totalValue}
        Cash Balance: $${portfolio.cashBalance}
        
        Holdings:
        ${holdingsText}
        
        Please provide a comprehensive analysis including:
        1. Overall portfolio assessment
        2. Diversification analysis (sectors, asset classes, geographic regions)
        3. Risk exposure evaluation
        4. Specific recommendations for improvements
        
        Format your response as JSON with the following structure:
        {
          "analysis": "Detailed analysis text",
          "diversificationScore": 0-100,
          "riskScore": 0-100,
          "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
        }
      `;

      const systemPrompt = "You are a professional portfolio analyst helping retail investors. Provide clear, actionable advice.";
      
      const response = await AIService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.3,
      });

      try {
        // Parse the response
        const analysisResult: PortfolioAnalysisResult = JSON.parse(response);
        
        // Log the analysis to the database
        await this.logPortfolioAnalysis(userId, portfolio, analysisResult);
        
        return analysisResult;
      } catch (parseError) {
        console.error("Failed to parse AI analysis response:", parseError);
        throw new Error("Failed to analyze portfolio. Please try again.");
      }
    } catch (error) {
      console.error("Portfolio analysis error:", error);
      throw error;
    }
  }

  /**
   * Recommend rebalancing actions for an existing portfolio
   */
  async recommendRebalancing(
    userId: string,
    portfolio: Portfolio,
    riskProfile: RiskProfile
  ): Promise<{ actions: Array<{ ticker: string; action: 'buy' | 'sell' | 'hold'; shares: number; reasoning: string }> }> {
    try {
      // Convert portfolio to a string representation
      const holdingsText = portfolio.holdings
        .map(h => `${h.ticker} (${h.name}): ${h.shares} shares, $${h.value} (${(h.weight * 100).toFixed(1)}% of portfolio)`)
        .join('\n');

      const prompt = `
        Recommend rebalancing actions for this ${riskProfile} investor's portfolio:
        
        Total Portfolio Value: $${portfolio.totalValue}
        Cash Balance: $${portfolio.cashBalance}
        
        Holdings:
        ${holdingsText}
        
        Suggest specific buy, sell, or hold actions to better align this portfolio with a ${riskProfile} risk profile.
        For each recommendation, include the number of shares to buy/sell and a brief explanation.
        
        Format your response as a JSON object with the following structure:
        {
          "actions": [
            {
              "ticker": "AAPL",
              "action": "buy",
              "shares": 5,
              "reasoning": "Explanation for this recommendation"
            },
            {
              "ticker": "TSLA",
              "action": "sell",
              "shares": 2,
              "reasoning": "Explanation for this recommendation"
            }
          ]
        }
      `;

      const systemPrompt = "You are a portfolio manager specializing in portfolio rebalancing for retail investors.";
      
      const response = await AIService.generateCompletion(prompt, {
        systemPrompt,
        temperature: 0.2,
      });

      try {
        // Parse the response
        const rebalancingRecommendations = JSON.parse(response);
        
        // Log the recommendations to the database
        await this.logRebalancingRecommendations(userId, portfolio, rebalancingRecommendations);
        
        return rebalancingRecommendations;
      } catch (parseError) {
        console.error("Failed to parse rebalancing recommendations:", parseError);
        throw new Error("Failed to generate rebalancing recommendations. Please try again.");
      }
    } catch (error) {
      console.error("Rebalancing recommendation error:", error);
      throw error;
    }
  }

  /**
   * Log portfolio recommendations to the database
   */
  private async logPortfolioRecommendation(
    userId: string,
    riskProfile: RiskProfile,
    recommendation: any
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_portfolio_recommendations')
        .insert({
          user_id: userId,
          risk_profile: riskProfile,
          recommendation: recommendation,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging portfolio recommendation:", error);
      // Don't throw here to prevent disrupting the main flow
    }
  }

  /**
   * Log portfolio analysis to the database
   */
  private async logPortfolioAnalysis(
    userId: string,
    portfolio: Portfolio,
    analysis: PortfolioAnalysisResult
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_portfolio_analyses')
        .insert({
          user_id: userId,
          portfolio_snapshot: portfolio,
          analysis: analysis,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging portfolio analysis:", error);
      // Don't throw here to prevent disrupting the main flow
    }
  }

  /**
   * Log rebalancing recommendations to the database
   */
  private async logRebalancingRecommendations(
    userId: string,
    portfolio: Portfolio,
    recommendations: any
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_rebalancing_recommendations')
        .insert({
          user_id: userId,
          portfolio_snapshot: portfolio,
          recommendations: recommendations,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error("Error logging rebalancing recommendations:", error);
      // Don't throw here to prevent disrupting the main flow
    }
  }
}

export default new AIPortfolioService(); 
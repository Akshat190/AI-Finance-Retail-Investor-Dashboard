   // src/services/InvestmentRecommendationService.ts
   import AIService from './AIService';
   import StockDataService from './StockDataService';

   interface Holdings {
     [ticker: string]: {
       shares: number;
       costBasis: number;
     };
   }

   type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

   class InvestmentRecommendationService {
     async generateRecommendations(
       userId: string, 
       riskProfile: RiskProfile, 
       investmentGoals: string, 
       currentHoldings: Holdings
     ): Promise<string> {
       // Get market data
       const marketData = await StockDataService.getMarketOverview();
       
       const prompt = `
         Based on the following information, recommend 3-5 investments (stocks, ETFs, or other securities) that would be suitable:
         
         Risk Profile: ${riskProfile}
         Investment Goals: ${investmentGoals}
         Current Holdings: ${JSON.stringify(currentHoldings)}
         Market Overview: ${JSON.stringify(marketData)}
         
         For each recommendation, provide:
         1. Ticker symbol
         2. Why it's appropriate for this investor
         3. Potential risks to be aware of
         4. Suggested allocation percentage
       `;
       
       const recommendations = await AIService.generateCompletion(prompt);
       return recommendations;
     }
   }
   
   export default new InvestmentRecommendationService();
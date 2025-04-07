   // src/services/PortfolioAnalysisService.ts
   import AIService from './AIService';
   import AIInsightsRepository from '../repositories/AIInsightsRepository';

   interface Portfolio {
     [key: string]: any;
   }

   type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

   class PortfolioAnalysisService {
     async analyzePortfolio(userId: string, portfolio: Portfolio, riskProfile: RiskProfile): Promise<string> {
       const portfolioData = JSON.stringify(portfolio);
       
       const prompt = `
         Analyze this investment portfolio for a ${riskProfile} risk investor:
         ${portfolioData}
         
         Provide the following:
         1. Overall portfolio assessment
         2. Diversification analysis
         3. Risk exposure evaluation
         4. Suggested improvements
       `;
       
       const systemPrompt = "You are a professional portfolio analyst helping retail investors. Provide clear, actionable advice.";
       
       const analysis = await AIService.generateCompletion(prompt, { systemPrompt });
       
       // Save to database
       await AIInsightsRepository.savePortfolioInsight(
         userId,
         portfolio,
         analysis,
         null // We'll add recommendations separately
       );
       
       return analysis;
     }
   }
   
   export default new PortfolioAnalysisService();
   // src/api/aiRoutes.ts
   import express, { Request, Response } from 'express';
   import PortfolioAnalysisService from '../services/PortfolioAnalysisService';
   import InvestmentRecommendationService from '../services/InvestmentRecommendationService';
   import FinancialChatbotService from '../services/FinancialChatbotService';
   import { authenticateUser } from '../middleware/auth';
   import { getUserPreferences } from '../services/UserService';

   interface AuthenticatedRequest extends Request {
     user?: {
       id: string;
       email: string;
     };
   }

   const router = express.Router();

   // All routes require authentication
   router.use(authenticateUser);

   // Portfolio analysis endpoint
   router.post('/analyze-portfolio', async (req: AuthenticatedRequest, res: Response) => {
     try {
       const { portfolio } = req.body;
       const userId = req.user?.id;
       
       if (!userId) {
         return res.status(401).json({ error: 'User not authenticated' });
       }
       
       const userPreferences = await getUserPreferences(userId);
       
       const analysis = await PortfolioAnalysisService.analyzePortfolio(
         userId,
         portfolio,
         userPreferences.riskTolerance
       );
       
       res.json({ analysis });
     } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'Unknown error';
       res.status(500).json({ error: errorMessage });
     }
   });

   // Investment recommendations endpoint
   router.post('/recommendations', async (req: AuthenticatedRequest, res: Response) => {
     try {
       const { investmentGoals, currentHoldings } = req.body;
       const userId = req.user?.id;
       
       if (!userId) {
         return res.status(401).json({ error: 'User not authenticated' });
       }
       
       const userPreferences = await getUserPreferences(userId);
       
       const recommendations = await InvestmentRecommendationService.generateRecommendations(
         userId,
         userPreferences.riskTolerance,
         investmentGoals,
         currentHoldings
       );
       
       res.json({ recommendations });
     } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'Unknown error';
       res.status(500).json({ error: errorMessage });
     }
   });

   // Chatbot endpoint
   router.post('/chat', async (req: AuthenticatedRequest, res: Response) => {
     try {
       const { message, chatHistory } = req.body;
       const userId = req.user?.id;
       
       if (!userId) {
         return res.status(401).json({ error: 'User not authenticated' });
       }
       
       const response = await FinancialChatbotService.processMessage(
         userId,
         message,
         chatHistory
       );
       
       res.json({ response });
     } catch (error) {
       const errorMessage = error instanceof Error ? error.message : 'Unknown error';
       res.status(500).json({ error: errorMessage });
     }
   });

   export default router;
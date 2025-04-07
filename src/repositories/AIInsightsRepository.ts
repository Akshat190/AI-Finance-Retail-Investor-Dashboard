   // src/repositories/AIInsightsRepository.ts
   import { supabase } from '../lib/supabaseClient';

   interface PortfolioSnapshot {
     [key: string]: any;
   }

   class AIInsightsRepository {
     async savePortfolioInsight(
       userId: string, 
       portfolioSnapshot: PortfolioSnapshot, 
       analysis: string, 
       recommendations: string | null
     ): Promise<any> {
       const { data, error } = await supabase
         .from('ai_portfolio_insights')
         .insert({
           user_id: userId,
           portfolio_snapshot: portfolioSnapshot,
           analysis,
           recommendations
         });
       
       if (error) throw error;
       return data;
     }
     
     async getLatestPortfolioInsight(userId: string): Promise<any> {
       const { data, error } = await supabase
         .from('ai_portfolio_insights')
         .select('*')
         .eq('user_id', userId)
         .order('created_at', { ascending: false })
         .limit(1);
       
       if (error) throw error;
       return data[0];
     }
   }
   
   export default new AIInsightsRepository();
   // src/services/FinancialChatbotService.ts
   import AIService from './AIService';

   interface ChatMessage {
     role: 'user' | 'assistant';
     content: string;
   }

   class FinancialChatbotService {
     async processMessage(
       userId: string, 
       message: string, 
       chatHistory: ChatMessage[]
     ): Promise<string> {
       const formattedHistory = chatHistory.map(msg => 
         `${msg.role}: ${msg.content}`
       ).join('\n');
       
       const systemPrompt = `
         You are a helpful financial assistant for retail investors.
         Provide accurate, educational responses about investing, stocks, and financial concepts.
         Never recommend specific investments without disclaimers.
         If you don't know something, admit it rather than making up information.
       `;
       
       const prompt = `
         Chat History:
         ${formattedHistory}
         
         User: ${message}
         
         Assistant:
       `;
       
       const response = await AIService.generateCompletion(prompt, { systemPrompt });
       return response;
     }
   }
   
   export default new FinancialChatbotService();
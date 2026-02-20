   // src/services/AIService.ts
   import { AutocompleteOptions, AutocompleteResult } from '../types/AITypes';
   import { 
     GEMINI_API_KEY, 
     OPENROUTER_API_KEY,
     DEFAULT_GEMINI_MODEL,
     DEFAULT_OPENROUTER_MODEL,
     OPENROUTER_API_ENDPOINT
   } from '../config/apiKeys';
   import { supabase } from '../utils/supabaseClient';

   /**
    * Options for generating AI content
    */
   interface AIServiceOptions {
     systemPrompt?: string;
     temperature?: number;
     maxOutputTokens?: number;
     provider?: 'gemini' | 'openrouter';
     model?: string;
   }

   /**
    * Service for generating AI content using Google's Gemini API or OpenRouter API
    */
   class AIService {
     private apiKey: string;
     private openRouterKey: string;
     private currentProvider: 'gemini' | 'openrouter' = 'gemini';
     private geminiBaseUrl: string;
     private openRouterBaseUrl: string;
     
     constructor() {
       this.apiKey = GEMINI_API_KEY || '';
       this.openRouterKey = OPENROUTER_API_KEY || '';
       this.geminiBaseUrl = 'https://generativelanguage.googleapis.com/v1beta';
       this.openRouterBaseUrl = 'https://openrouter.ai/api/v1';
       
       // Try to load user settings
       this.loadUserSettings();
     }
     
     /**
      * Load user settings for API keys and preferences
      */
     private async loadUserSettings() {
       try {
         const user = (await supabase.auth.getUser()).data.user;
         
         if (user) {
           const { data, error } = await supabase
             .from('user_settings')
             .select('gemini_api_key, openrouter_api_key, preferred_ai_provider')
             .eq('user_id', user.id)
             .single();
           
           if (!error && data) {
             // Update keys from user settings if available
             if (data.gemini_api_key) {
               this.apiKey = data.gemini_api_key;
             }
             
             if (data.openrouter_api_key) {
               this.openRouterKey = data.openrouter_api_key;
             }
             
             this.currentProvider = data.preferred_ai_provider as 'gemini' | 'openrouter' || 'gemini';
           }
         }
       } catch (error) {
         console.error('Failed to load user settings:', error);
         // Continue with default keys
       }
     }
     
     /**
      * Generate content using either Gemini API or OpenRouter API with fallback
      */
     async generateContent(prompt: string, options: AIServiceOptions = {}): Promise<string> {
       try {
         // Use specified provider or default to Gemini
         this.currentProvider = options.provider || this.currentProvider;
         
         // Check if we have valid API keys
         if (this.currentProvider === 'gemini' && !this.apiKey) {
           console.warn('Gemini API key is missing, falling back to OpenRouter');
           this.currentProvider = 'openrouter';
         }
         
         if (this.currentProvider === 'openrouter' && !this.openRouterKey) {
           console.warn('OpenRouter API key is missing, falling back to Gemini');
           this.currentProvider = 'gemini';
         }
         
         // If both API keys are missing, return a default response
         if (!this.apiKey && !this.openRouterKey) {
           console.warn('No API keys available, returning default response');
           return this.getDefaultResponse(prompt);
         }
         
         // Try to generate with the current provider
         if (this.currentProvider === 'gemini') {
           try {
             return await this.generateGeminiContent(prompt, options);
           } catch (error) {
             console.error("Gemini API error:", error);
             
             // Check if the error is related to quota limits
             const errorMsg = error instanceof Error ? error.message : String(error);
             if (errorMsg.includes('quota') || errorMsg.includes('rate limit')) {
               console.log('Gemini quota exceeded, falling back to OpenRouter');
               this.currentProvider = 'openrouter';
               return await this.generateOpenRouterContent(prompt, options);
             }
             throw error;
           }
         } else {
           return await this.generateOpenRouterContent(prompt, options);
         }
       } catch (error) {
         console.error("AI Service Error:", error);
         return this.getDefaultResponse(prompt);
       }
     }
     
     /**
      * Get a default response when no API keys are available
      */
     private getDefaultResponse(prompt: string): string {
       // Simple fallback responses for common queries
       if (prompt.toLowerCase().includes('stock') || prompt.toLowerCase().includes('market')) {
         return "I'm currently unable to access real-time market data. Please check back later or ensure your API keys are properly configured.";
       }
       
       if (prompt.toLowerCase().includes('analysis') || prompt.toLowerCase().includes('research')) {
         return "I'm temporarily unable to perform detailed analysis. Please try again later or check your API configuration.";
       }
       
       return "I'm currently unable to process your request. Please ensure your API keys are properly configured or try again later.";
     }
     
     /**
      * Generate content using Gemini API
      */
     private async generateGeminiContent(prompt: string, options: AIServiceOptions = {}): Promise<string> {
       const model = options.model || DEFAULT_GEMINI_MODEL;
       
       // Ensure we have the correct API version based on the model
       const baseUrl = model.startsWith('gemini-1.5') 
         ? 'https://generativelanguage.googleapis.com/v1beta'
         : 'https://generativelanguage.googleapis.com/v1';
       
       const apiUrl = `${baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
       
       console.log(`Using Gemini model: ${model} with base URL: ${baseUrl}`);
       
       // Construct the appropriate payload based on the model
       const payload = {
         contents: [
           {
             parts: [
               ...(options.systemPrompt ? [{
                 text: options.systemPrompt
               }] : []),
               {
                 text: prompt
               }
             ]
           }
         ],
         generationConfig: {
           temperature: options.temperature ?? 0.7,
           maxOutputTokens: options.maxOutputTokens ?? 1024,
         },
         safetySettings: [
           {
             category: "HARM_CATEGORY_HARASSMENT",
             threshold: "BLOCK_NONE"
           },
           {
             category: "HARM_CATEGORY_HATE_SPEECH",
             threshold: "BLOCK_NONE"
           },
           {
             category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
             threshold: "BLOCK_NONE"
           },
           {
             category: "HARM_CATEGORY_DANGEROUS_CONTENT",
             threshold: "BLOCK_NONE"
           }
         ]
       };

       try {
         console.log(`Gemini payload:`, JSON.stringify({
           model,
           temperature: payload.generationConfig.temperature,
           maxOutputTokens: payload.generationConfig.maxOutputTokens,
           hasSystemPrompt: !!options.systemPrompt
         }));
         
         const response = await fetch(apiUrl, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify(payload),
         });

         console.log(`Gemini response status: ${response.status} ${response.statusText}`);

         // Get the response text for potential error handling
         const responseText = await response.text();
         
         if (!response.ok) {
           let errorMessage = `Gemini API Error: ${response.status} ${response.statusText}`;
           
           try {
             // Try to parse the error as JSON
             const errorData = JSON.parse(responseText);
             errorMessage = `Gemini API Error: ${JSON.stringify(errorData)}`;
             console.error('Gemini API Error:', errorData);
           // eslint-disable-next-line @typescript-eslint/no-unused-vars
           } catch (_) {
             // If parsing fails, use the raw response text
             console.error('Gemini API Error (raw):', responseText);
           }
           throw new Error(errorMessage);
         }

         // Parse the response as JSON
         let data;
         try {
           data = JSON.parse(responseText);
         // eslint-disable-next-line @typescript-eslint/no-unused-vars
         } catch (e) {
           console.error('Failed to parse Gemini response:', e);
           console.log('Raw response:', responseText);
           throw new Error('Invalid JSON response from Gemini API');
         }
       
         if (!data.candidates || data.candidates.length === 0) {
           console.error('No candidates in Gemini response:', data);
           throw new Error('No content generated from Gemini');
         }

         // Handle potential content block from safety settings
         if (data.candidates[0].finishReason === 'SAFETY' || 
             data.candidates[0].finishReason === 'RECITATION' ||
             data.candidates[0].finishReason === 'OTHER') {
           console.error('Gemini content blocked due to:', data.candidates[0].finishReason);
           throw new Error(`Content generation stopped: ${data.candidates[0].finishReason}`);
         }

         // Check if we have valid content
         if (!data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
           console.error('Empty content in Gemini response:', data.candidates[0]);
           throw new Error('Empty content received from Gemini');
         }

         return data.candidates[0].content.parts[0].text;
       } catch (error: unknown) {
         console.error('Gemini processing error:', error);
         // Rethrow the error with more context
         const errorMessage = error instanceof Error ? error.message : String(error);
         throw new Error(`Failed to generate content with Gemini: ${errorMessage}`);
       }
     }
     
     /**
      * Generate content using OpenRouter API
      */
     private async generateOpenRouterContent(prompt: string, options: AIServiceOptions = {}): Promise<string> {
       try {
         // Check if the API key is valid
         if (!this.openRouterKey || this.openRouterKey.trim() === '') {
           console.warn('OpenRouter API key is missing. Falling back to Gemini.');
           return this.generateGeminiContent(prompt, options);
         }

         const model = options.model || DEFAULT_OPENROUTER_MODEL;
         const messages = [
           {
             role: 'user',
             content: prompt
           }
         ];

         const payload = {
           model: model,
           messages: messages,
           temperature: options.temperature ?? 0.7,
           max_tokens: options.maxOutputTokens ?? 1024
         };

         const response = await fetch(OPENROUTER_API_ENDPOINT, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${this.openRouterKey}`,
             'HTTP-Referer': window.location.origin,
             'X-Title': 'Finance App'
           },
           body: JSON.stringify(payload),
         });

         if (!response.ok) {
           const errorData = await response.json();
           console.error('OpenRouter API error:', errorData);
           
           // If unauthorized, fall back to Gemini
           if (response.status === 401) {
             console.warn('OpenRouter API key is invalid. Falling back to Gemini.');
             return this.generateGeminiContent(prompt, options);
           }
           
           throw new Error(`OpenRouter API Error: ${JSON.stringify(errorData)}`);
         }

         const data = await response.json();
         return data.choices[0].message.content;
       } catch (error) {
         console.error('OpenRouter processing error:', error);
         
         // If there's an error with OpenRouter, fall back to Gemini
         try {
           console.warn('Falling back to Gemini due to OpenRouter error');
           return await this.generateGeminiContent(prompt, options);
         } catch (fallbackError) {
           throw new Error(`Failed to generate content with both OpenRouter and Gemini: ${error instanceof Error ? error.message : String(error)}`);
         }
       }
     }

     /**
      * Legacy method for backward compatibility
      */
     async generateCompletion(prompt: string, options: AIServiceOptions = {}): Promise<string> {
       return this.generateContent(prompt, options);
     }

     /**
      * Generate autocomplete suggestions based on user input
      */
     async getAutocompleteSuggestions(
       input: string,
       context: string,
       options: AutocompleteOptions = {}
     ): Promise<AutocompleteResult[]> {
       try {
         // Format prompt for autocomplete
         const prompt = `
           Given the following input, suggest up to ${options.limit || 5} relevant autocompletions.
           Only return a valid JSON array of strings, without any markdown formatting or additional text.
           
           Input: ${input}
           
           Example response format: ["suggestion1", "suggestion2", "suggestion3"]
         `;
         
         const response = await this.generateContent(prompt, {
           systemPrompt: "You are an autocomplete assistant. Only return valid JSON arrays of strings.",
           temperature: options.temperature || 0.1,
         });

         // Clean the response to ensure it's valid JSON
         const cleanResponse = response
           .replace(/```json/g, '')
           .replace(/```/g, '')
           .trim();
         
         const parsedResponse = JSON.parse(cleanResponse);
         
         if (Array.isArray(parsedResponse)) {
           return parsedResponse.map(text => ({ text, score: 1 }));
         }
         
         return [];
       } catch (error) {
         console.error('Autocomplete error:', error);
         return [];
       }
     }

     /**
      * Get autocomplete suggestions for stock ticker symbols
      */
     async getTickerAutocomplete(input: string, limit: number = 5): Promise<string[]> {
       try {
         // Format prompt for ticker autocomplete
         const prompt = `
           Given the following input, suggest up to ${limit} relevant stock ticker symbols.
           Only return a valid JSON array of strings, without any markdown formatting or additional text.
           
           Input: ${input}
           
           Example response format: ["AAPL", "MSFT", "GOOGL"]
         `;
         
         const response = await this.generateContent(prompt, {
           systemPrompt: "You are a stock ticker autocomplete assistant. Only return valid JSON arrays of stock ticker symbols.",
           temperature: 0.1,
         });

         // Clean the response to ensure it's valid JSON
         const cleanResponse = response
           .replace(/```json/g, '')
           .replace(/```/g, '')
           .trim();
         
         const parsedResponse = JSON.parse(cleanResponse);
         
         if (Array.isArray(parsedResponse)) {
           return parsedResponse;
         }
         
         return [];
       } catch (error) {
         console.error('Ticker autocomplete error:', error);
         return [];
       }
     }
   }
   
   export default new AIService();
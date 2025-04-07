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
       this.apiKey = GEMINI_API_KEY;
       this.openRouterKey = OPENROUTER_API_KEY;
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
               this.openRouterKey = data.openrouter_api_key || OPENROUTER_API_KEY;
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
         throw error;
       }
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
       // Use the provided model or fall back to default, ensuring it's a valid model ID
       const model = options.model || DEFAULT_OPENROUTER_MODEL;
       
       // Log model being used for debugging
       console.log(`Using OpenRouter model: ${model}`);
       
       const messages = [];
       
       // Add system prompt if provided
       if (options.systemPrompt) {
         messages.push({
           role: 'system',
           content: options.systemPrompt
         });
       }
       
       // Add the main user prompt
       messages.push({
         role: 'user',
         content: prompt
       });
       
       const payload = {
         model: model,
         messages: messages,
         temperature: options.temperature ?? 0.7,
         max_tokens: options.maxOutputTokens ?? 1024
       };

       console.log(`OpenRouter payload:`, JSON.stringify({
         model: payload.model,
         temperature: payload.temperature,
         max_tokens: payload.max_tokens,
         message_count: payload.messages.length
       }));

       try {
         // Check if the API key is valid
         if (!this.openRouterKey || this.openRouterKey.trim() === '') {
           throw new Error('OpenRouter API key is missing. Please add it in the settings.');
         }

         const response = await fetch(OPENROUTER_API_ENDPOINT, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${this.openRouterKey}`,
             'HTTP-Referer': window.location.origin, // Required by OpenRouter
             'X-Title': 'Finance App' // Optional - name of your app
           },
           body: JSON.stringify(payload),
         });

         // Log response status for debugging
         console.log(`OpenRouter response status: ${response.status} ${response.statusText}`);

         // Get the response text for potential error handling
         const responseText = await response.text();
         
         if (!response.ok) {
           let errorMessage = `OpenRouter API Error: ${response.status} ${response.statusText}`;
           try {
             // Try to parse the error as JSON
             const errorData = JSON.parse(responseText);
             errorMessage = `OpenRouter API Error: ${JSON.stringify(errorData)}`;
             console.error('OpenRouter API Error:', errorData);
           } catch (_) {
             // If parsing fails, use the raw response text
             console.error('OpenRouter API Error (raw):', responseText);
           }
           throw new Error(errorMessage);
         }

         // Parse the response as JSON
         let data;
         try {
           data = JSON.parse(responseText);
         } catch (e) {
           console.error('Failed to parse OpenRouter response:', e);
           console.log('Raw response:', responseText);
           throw new Error('Invalid JSON response from OpenRouter API');
         }
         
         if (!data.choices || data.choices.length === 0) {
           console.error('No choices in OpenRouter response:', data);
           throw new Error('No content generated from OpenRouter');
         }

         // Check if we have valid content
         const content = data.choices[0].message?.content;
         if (!content) {
           console.error('Empty content in OpenRouter response:', data.choices[0]);
           throw new Error('Empty content received from OpenRouter');
         }

         return content;
       } catch (error: unknown) {
         console.error('OpenRouter processing error:', error);
         // Rethrow the error with more context
         const errorMessage = error instanceof Error ? error.message : String(error);
         throw new Error(`Failed to generate content with OpenRouter: ${errorMessage}`);
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
           Given the following code context and current input, suggest up to ${options.limit || 5} relevant autocompletions.
           
           Current code:
           ${context}
           
           Current user input: ${input}
           
           Return the suggestions as a JSON array of objects with "text" (the completion text) and "description" (a brief explanation).
           Only include the completion part after the current input.
         `;
         
         const response = await this.generateContent(prompt, {
           systemPrompt: "You are a coding assistant providing autocomplete suggestions. Only provide valid JSON.",
           temperature: options.temperature || 0.3,
         });
         
         const parsedResponse = JSON.parse(response);
         
         if (Array.isArray(parsedResponse)) {
           return parsedResponse.slice(0, options.limit || 5); // Ensure we return at most 5 suggestions
         }
         
         return [];
       } catch (error) {
         console.error('Autocomplete error:', error);
         return [];
       }
     }
   }
   
   export default new AIService();
/**
 * Utility to parse AI responses that may contain JSON within markdown code blocks
 */

/**
 * Extracts a JSON object from an AI response that might be wrapped in various formats
 * such as markdown code blocks or text
 * @param response The response string from the AI
 * @returns The parsed JSON object
 */
export function extractJsonFromResponse(response: string): any {
  if (!response || typeof response !== 'string') {
    console.error('Empty or invalid response received:', response);
    throw new Error("Empty or invalid response received");
  }

  console.log('Attempting to extract JSON from response of length:', response.length);
  
  // First, try to directly parse the response
  try {
    return JSON.parse(response);
  } catch (e) {
    // Direct parsing failed, continue with other methods
    console.log("Direct JSON parsing failed, trying alternative extraction methods");
  }

  // Try to extract from markdown code block (```json ... ```)
  const codeBlockMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1]);
    } catch (e) {
      // Code block parsing failed, continue to next method
      console.log("Code block JSON parsing failed");
    }
  }

  // Try to extract anything that looks like a JSON object
  const jsonObjectMatch = response.match(/(\{[\s\S]*\})/);
  if (jsonObjectMatch && jsonObjectMatch[1]) {
    try {
      return JSON.parse(jsonObjectMatch[1]);
    } catch (e) {
      // JSON object parsing failed, continue to next method
      console.log("JSON object parsing failed");

      // Try to sanitize the JSON object by fixing common issues
      let sanitized = jsonObjectMatch[1]
        .replace(/,\s*}/g, '}') // Remove trailing commas in objects
        .replace(/,\s*\]/g, ']') // Remove trailing commas in arrays
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":') // Ensure property names are quoted
        .replace(/:\s*'/g, ':"') // Replace single quotes with double quotes for values
        .replace(/'\s*(,|}|\])/g, '"$1'); // Replace closing single quotes with double quotes

      try {
        return JSON.parse(sanitized);
      } catch (sanitizeErr) {
        console.log("Sanitized JSON parsing also failed");
      }
    }
  }

  // Try to extract anything that looks like a JSON array
  const jsonArrayMatch = response.match(/(\[[\s\S]*\])/);
  if (jsonArrayMatch && jsonArrayMatch[1]) {
    try {
      return JSON.parse(jsonArrayMatch[1]);
    } catch (e) {
      // JSON array parsing failed, continue to next method
      console.log("JSON array parsing failed");

      // Try to sanitize the JSON array by fixing common issues
      let sanitized = jsonArrayMatch[1]
        .replace(/,\s*\]/g, ']') // Remove trailing commas in arrays
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":') // Ensure property names are quoted
        .replace(/:\s*'/g, ':"') // Replace single quotes with double quotes for values
        .replace(/'\s*(,|}|\])/g, '"$1'); // Replace closing single quotes with double quotes

      try {
        return JSON.parse(sanitized);
      } catch (sanitizeErr) {
        console.log("Sanitized JSON array parsing also failed");
      }
    }
  }
  
  // If all else fails, try a more aggressive approach by finding anything between square or curly brackets
  console.log("All standard extraction methods failed. Trying more aggressive extraction.");
  
  try {
    // Look for anything that might be JSON
    const bracePattern = /(\{[\s\S]*?\})(?!\s*[,\]\}])/g;
    const bracketPattern = /(\[[\s\S]*?\])(?!\s*[,\]\}])/g;
    
    // Try arrays first
    const bracketMatches = [...response.matchAll(bracketPattern)];
    if (bracketMatches.length > 0) {
      // Try each match
      for (const match of bracketMatches) {
        try {
          const possibleJson = match[1].trim();
          const cleaned = possibleJson
            .replace(/,\s*\]/g, ']') // Remove trailing commas
            .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":') // Ensure property names are quoted
            .replace(/:\s*'/g, ':"') // Replace single quotes with double quotes
            .replace(/'\s*(,|}|\])/g, '"$1'); // Replace closing single quotes with double quotes
          
          return JSON.parse(cleaned);
        } catch (e) {
          // Try next match
          continue;
        }
      }
    }
    
    // Try objects if arrays didn't work
    const braceMatches = [...response.matchAll(bracePattern)];
    if (braceMatches.length > 0) {
      // Try each match
      for (const match of braceMatches) {
        try {
          const possibleJson = match[1].trim();
          const cleaned = possibleJson
            .replace(/,\s*\}/g, '}') // Remove trailing commas
            .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":') // Ensure property names are quoted
            .replace(/:\s*'/g, ':"') // Replace single quotes with double quotes
            .replace(/'\s*(,|}|\])/g, '"$1'); // Replace closing single quotes with double quotes
          
          return JSON.parse(cleaned);
        } catch (e) {
          // Try next match
          continue;
        }
      }
    }
    
    // Last resort: create a dummy response with some placeholder values
    console.error("Failed to extract any valid JSON. Creating a fallback response.");
    
    // Check if this was supposed to be an array of investment ideas
    if (response.includes("investment") && response.includes("ticker")) {
      return [
        {
          "ticker": "PLACEHOLDER",
          "name": "Extraction Failed - Please Try Again",
          "type": "error",
          "reason": "The AI response could not be parsed correctly. Please try refreshing.",
          "riskLevel": "moderate",
          "potentialReturn": "unknown",
          "suggestedAllocation": 0
        }
      ];
    }
    
    // For unknown formats, return a generic error object
    return {
      "error": "Failed to extract JSON",
      "message": "The AI response could not be parsed correctly. Please try again."
    };
    
  } catch (error) {
    console.error("Error during aggressive JSON extraction:", error);
    throw new Error("Could not extract valid JSON from the response");
  }
}

/**
 * Clean a response string by removing code block markers and other non-essential formatting
 * @param response The raw string response from an AI service
 * @returns A cleaned string
 */
export function cleanResponseText(response: string): string {
  // Remove markdown code blocks
  let cleaned = response.replace(/```(?:json|javascript|js|typescript|ts)?\s*([\s\S]*?)\s*```/g, '$1');
  
  // Remove any HTML-like tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  
  return cleaned.trim();
} 
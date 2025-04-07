/**
 * Extracts and parses JSON from an AI response string
 * This handles cases where the AI model might add extra text around the JSON
 * 
 * @param responseText The raw text response from the AI
 * @returns Parsed JSON object or array
 */
export function extractJsonFromResponse(responseText: string): any {
  if (!responseText) {
    throw new Error("Empty response received");
  }
  
  // First attempt: Try to parse the entire response as JSON
  try {
    return JSON.parse(responseText);
  } catch (e) {
    // If that fails, look for JSON within the response
    console.log("Failed to parse entire response as JSON, attempting to extract JSON");
  }
  
  // Second attempt: Try to find JSON array/object within the text
  try {
    // Look for arrays [...]
    const arrayMatch = responseText.match(/\[[\s\S]*\]/);
    if (arrayMatch && arrayMatch[0]) {
      return JSON.parse(arrayMatch[0]);
    }
    
    // Look for objects {...}
    const objectMatch = responseText.match(/\{[\s\S]*\}/);
    if (objectMatch && objectMatch[0]) {
      return JSON.parse(objectMatch[0]);
    }
  } catch (e) {
    console.error("Failed to extract JSON with regex:", e);
  }
  
  // Third attempt: Try to clean the response and extract JSON
  try {
    // Remove markdown code blocks
    let cleaned = responseText.replace(/```json|```/g, '').trim();
    
    // Remove any text before the first [ or { and after the last ] or }
    let firstChar = cleaned.indexOf('[');
    let lastChar = cleaned.lastIndexOf(']');
    
    if (firstChar === -1) {
      firstChar = cleaned.indexOf('{');
      lastChar = cleaned.lastIndexOf('}');
    }
    
    if (firstChar !== -1 && lastChar !== -1 && lastChar > firstChar) {
      cleaned = cleaned.substring(firstChar, lastChar + 1);
      return JSON.parse(cleaned);
    }
  } catch (e) {
    console.error("Failed to clean and extract JSON:", e);
  }
  
  throw new Error("Could not extract valid JSON from response");
} 
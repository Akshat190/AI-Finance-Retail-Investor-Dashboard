// Test script for OpenRouter API
// For Node.js - uncomment if running directly with Node
// import fetch from 'node-fetch';

async function testOpenRouter() {
  // Using the OpenRouter API key provided by the user
  const apiKey = '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';
  
  console.log('Testing OpenRouter API connection with deepseek/deepseek-r1:free model');
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000', // Required by OpenRouter
        'X-Title': 'Finance App Test' // Optional name of your app
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free', // Using the correct model ID format
        messages: [
          {
            role: 'user',
            content: 'What is the meaning of life?'
          }
        ],
        temperature: 0.7,
        max_tokens: 250
      }),
    });

    const data = await response.json();
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      console.error('Error response:', data);
    } else {
      console.log('Success! Model used:', data.model);
      console.log('Response:', data.choices[0].message.content);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

// This script is intended to be included in the browser environment where fetch is available
// If using directly in Node.js without a bundler, you'll need to use a fetch polyfill or node-fetch

// Run the test
testOpenRouter().catch(console.error);

// Log available models for reference
console.log('\nKnown working OpenRouter models:');
console.log('- deepseek/deepseek-r1:free');
console.log('- anthropic/claude-3-haiku:free');
console.log('- google/gemini-pro:free');
console.log('- meta-llama/llama-3-8b-instruct:free'); 
import { AIConfig } from './aiConfig';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function generateAIResponse(
  messages: Message[],
  config: AIConfig
): Promise<string> {
  try {
    if (config.provider === 'gemini') {
      return await generateGeminiResponse(messages, config);
    } else if (config.provider === 'openrouter') {
      return await generateOpenRouterResponse(messages, config);
    } else {
      throw new Error(`Unsupported AI provider: ${config.provider}`);
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}

async function generateGeminiResponse(
  messages: Message[],
  config: AIConfig
): Promise<string> {
  // Format messages for Gemini API
  const formattedMessages = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : msg.role,
    parts: [{ text: msg.content }]
  }));

  const response = await fetch(
    `${config.baseUrl}/models/${config.modelName}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': config.apiKey
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      })
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function generateOpenRouterResponse(
  messages: Message[],
  config: AIConfig
): Promise<string> {
  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI Investor'
    },
    body: JSON.stringify({
      model: config.modelName,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenRouter API error: ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
} 
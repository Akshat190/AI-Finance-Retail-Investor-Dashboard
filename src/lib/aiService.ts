import { AIConfig } from './aiConfig';

interface Message {
  role: string;
  content: string;
}

export async function generateAIResponse(messages: Message[], config: AIConfig): Promise<string> {
  try {
    if (config.provider === 'gemini') {
      return await generateGeminiResponse(messages, config);
    } else {
      return await generateOpenRouterResponse(messages, config);
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw new Error('Failed to generate AI response');
  }
}

async function generateGeminiResponse(messages: Message[], config: AIConfig): Promise<string> {
  const prompt = messages.map(msg => msg.content).join('\n\n');
  
  const response = await fetch(`${config.apiUrl}?key=${config.apiKey}`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${errorText}`);
  }
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function generateOpenRouterResponse(messages: Message[], config: AIConfig): Promise<string> {
  const response = await fetch(config.apiUrl, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      model: config.model,
      messages: messages
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
  }
  
  const data = await response.json();
  
  if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
    throw new Error('Invalid response format from OpenRouter API');
  }
  
  return data.choices[0].message.content;
} 
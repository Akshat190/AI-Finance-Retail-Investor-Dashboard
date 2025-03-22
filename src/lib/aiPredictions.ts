import OpenAI from 'openai';
import type { PortfolioWithHoldings } from '../types/database';
import { getHistoricalData, getCompanyProfile } from './marketData';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface AIPrediction {
  symbol: string;
  predictedReturn: number;
  confidence: number;
  reasoning: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  timeframe: string;
}

export async function generatePortfolioPredictions(
  portfolio: PortfolioWithHoldings
): Promise<AIPrediction[]> {
  const predictions: AIPrediction[] = [];

  for (const holding of portfolio.holdings) {
    try {
      // Gather data for AI analysis
      const [historicalData, profile] = await Promise.all([
        getHistoricalData(holding.symbol),
        getCompanyProfile(holding.symbol)
      ]);

      // Prepare data for AI analysis
      const marketData = {
        symbol: holding.symbol,
        historicalPrices: historicalData.slice(0, 30), // Last 30 days
        profile,
        currentPosition: {
          shares: holding.shares,
          averagePrice: holding.average_price
        }
      };

      // Generate AI prediction
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a financial analyst AI that provides investment predictions."
          },
          {
            role: "user",
            content: `Analyze this stock position and provide a return prediction:
              Symbol: ${marketData.symbol}
              Industry: ${marketData.profile.industry}
              Current Position: ${marketData.currentPosition.shares} shares at $${marketData.currentPosition.averagePrice}
              Market Cap: $${marketData.profile.marketCap}B
              P/E Ratio: ${marketData.profile.peRatio}
              
              Recent price trend: ${JSON.stringify(marketData.historicalPrices.slice(0, 5))}
              
              Provide a prediction in this format:
              - Predicted return (%)
              - Confidence level (0-1)
              - Risk level (Low/Medium/High)
              - Brief reasoning
              - Timeframe (e.g., "3 months")`
          }
        ]
      });

      const response = completion.choices[0].message.content;
      
      // Parse AI response and structure the prediction
      const prediction: AIPrediction = {
        symbol: holding.symbol,
        predictedReturn: parseFloat(response.match(/return.*?(-?\d+\.?\d*)/)?.[1] || "0"),
        confidence: parseFloat(response.match(/confidence.*?(\d+\.?\d*)/)?.[1] || "0"),
        riskLevel: (response.match(/risk.*?(Low|Medium|High)/)?.[1] || "Medium") as 'Low' | 'Medium' | 'High',
        reasoning: response.match(/reasoning:?(.*?)(?=timeframe|\n|$)/i)?.[1]?.trim() || "",
        timeframe: response.match(/timeframe:?\s*"?([^"\n]+)"?/i)?.[1]?.trim() || "3 months"
      };

      predictions.push(prediction);
    } catch (error) {
      console.error(`Error generating prediction for ${holding.symbol}:`, error);
    }
  }

  return predictions;
}
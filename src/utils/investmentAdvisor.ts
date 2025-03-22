import { getMarketMovers, getFinancialRatios } from './fmpApi';

// Types for investment options
export interface MutualFund {
  id: string;
  name: string;
  category: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  expenseRatio: number;
  aum: number; // Assets Under Management in millions
  description: string;
  investmentStrategy: string;
}

export interface FixedDeposit {
  id: string;
  bankName: string;
  interestRate: number;
  minTenure: number; // in months
  maxTenure: number; // in months
  minAmount: number;
  seniorCitizenBonus: number; // additional interest rate for senior citizens
  prematureWithdrawal: boolean;
  compounding: 'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly';
  specialFeatures?: string[];
}

export interface InvestmentRecommendation {
  type: 'MutualFund' | 'FixedDeposit' | 'Stock';
  item: MutualFund | FixedDeposit | any; // stock object
  score: number; // 0-100 score for how strongly recommended
  reasoning: string;
}

// Sample mutual fund data (in a real app, this would come from an API)
export const mutualFunds: MutualFund[] = [
  {
    id: 'mf1',
    name: 'Vanguard Total Stock Market Index Fund',
    category: 'Large-Cap Blend',
    riskLevel: 'Moderate',
    oneYearReturn: 15.2,
    threeYearReturn: 12.8,
    fiveYearReturn: 14.5,
    expenseRatio: 0.04,
    aum: 1300000, // $1.3 trillion
    description: 'This fund provides broad exposure to the U.S. equity market, with a focus on large-cap stocks.',
    investmentStrategy: 'Passive index strategy tracking the CRSP US Total Market Index.'
  },
  {
    id: 'mf2',
    name: 'Fidelity 500 Index Fund',
    category: 'Large-Cap Blend',
    riskLevel: 'Moderate',
    oneYearReturn: 14.8,
    threeYearReturn: 12.5,
    fiveYearReturn: 14.2,
    expenseRatio: 0.015,
    aum: 380000, // $380 billion
    description: 'This fund aims to provide investment results that correspond to the total return of common stocks publicly traded in the United States.',
    investmentStrategy: 'Passive index strategy tracking the S&P 500 Index.'
  },
  {
    id: 'mf3',
    name: 'T. Rowe Price Blue Chip Growth Fund',
    category: 'Large-Cap Growth',
    riskLevel: 'Moderate',
    oneYearReturn: 18.5,
    threeYearReturn: 15.2,
    fiveYearReturn: 17.8,
    expenseRatio: 0.69,
    aum: 95000, // $95 billion
    description: 'This fund focuses on established blue-chip companies with above-average growth potential.',
    investmentStrategy: 'Active management focusing on large-cap growth stocks with strong fundamentals.'
  },
  {
    id: 'mf4',
    name: 'Vanguard Small-Cap Index Fund',
    category: 'Small-Cap Blend',
    riskLevel: 'High',
    oneYearReturn: 16.9,
    threeYearReturn: 10.2,
    fiveYearReturn: 12.5,
    expenseRatio: 0.05,
    aum: 140000, // $140 billion
    description: 'This fund provides exposure to small-cap U.S. stocks, offering growth potential with higher volatility.',
    investmentStrategy: 'Passive index strategy tracking the CRSP US Small Cap Index.'
  },
  {
    id: 'mf5',
    name: 'American Funds American Balanced Fund',
    category: 'Moderate Allocation',
    riskLevel: 'Low',
    oneYearReturn: 10.5,
    threeYearReturn: 8.7,
    fiveYearReturn: 9.8,
    expenseRatio: 0.59,
    aum: 145000, // $145 billion
    description: 'This balanced fund invests in a mix of stocks and bonds, aiming for long-term growth and income.',
    investmentStrategy: 'Active management with approximately 60% stocks and 40% bonds.'
  },
  {
    id: 'mf6',
    name: 'Vanguard Total Bond Market Index Fund',
    category: 'Intermediate-Term Bond',
    riskLevel: 'Low',
    oneYearReturn: 3.5,
    threeYearReturn: 2.8,
    fiveYearReturn: 3.2,
    expenseRatio: 0.035,
    aum: 310000, // $310 billion
    description: 'This fund provides broad exposure to U.S. investment-grade bonds with a focus on stability and income.',
    investmentStrategy: 'Passive index strategy tracking the Bloomberg U.S. Aggregate Float Adjusted Index.'
  },
  {
    id: 'mf7',
    name: 'Fidelity Contrafund',
    category: 'Large-Cap Growth',
    riskLevel: 'Moderate',
    oneYearReturn: 17.2,
    threeYearReturn: 14.5,
    fiveYearReturn: 16.8,
    expenseRatio: 0.86,
    aum: 130000, // $130 billion
    description: 'This fund invests in companies whose value the manager believes is not fully recognized by the public.',
    investmentStrategy: 'Active management focusing on growth stocks that are undervalued relative to their potential.'
  },
  {
    id: 'mf8',
    name: 'PIMCO Total Return Fund',
    category: 'Intermediate-Term Bond',
    riskLevel: 'Low',
    oneYearReturn: 4.2,
    threeYearReturn: 3.5,
    fiveYearReturn: 3.8,
    expenseRatio: 0.7,
    aum: 65000, // $65 billion
    description: 'This fund invests primarily in high-quality bonds, seeking to maximize total return while preserving capital.',
    investmentStrategy: 'Active management with a focus on macroeconomic trends and individual security selection.'
  },
  {
    id: 'mf9',
    name: 'Vanguard Dividend Growth Fund',
    category: 'Large-Cap Value',
    riskLevel: 'Moderate',
    oneYearReturn: 12.8,
    threeYearReturn: 11.5,
    fiveYearReturn: 13.2,
    expenseRatio: 0.22,
    aum: 55000, // $55 billion
    description: 'This fund focuses on high-quality companies with a history of growing their dividends.',
    investmentStrategy: 'Active management focusing on companies with sustainable dividend growth potential.'
  },
  {
    id: 'mf10',
    name: 'Vanguard Total International Stock Index Fund',
    category: 'Foreign Large-Cap Blend',
    riskLevel: 'High',
    oneYearReturn: 11.5,
    threeYearReturn: 7.8,
    fiveYearReturn: 9.2,
    expenseRatio: 0.08,
    aum: 415000, // $415 billion
    description: 'This fund provides broad exposure to international stocks, excluding U.S. companies.',
    investmentStrategy: 'Passive index strategy tracking the FTSE Global All Cap ex US Index.'
  }
];

// Sample fixed deposit data
export const fixedDeposits: FixedDeposit[] = [
  {
    id: 'fd1',
    bankName: 'Chase Bank',
    interestRate: 4.5,
    minTenure: 12,
    maxTenure: 60,
    minAmount: 1000,
    seniorCitizenBonus: 0.25,
    prematureWithdrawal: true,
    compounding: 'Quarterly',
    specialFeatures: ['Online account management', 'Auto-renewal option']
  },
  {
    id: 'fd2',
    bankName: 'Bank of America',
    interestRate: 4.25,
    minTenure: 6,
    maxTenure: 60,
    minAmount: 500,
    seniorCitizenBonus: 0.2,
    prematureWithdrawal: true,
    compounding: 'Monthly',
    specialFeatures: ['Loan against FD', 'Partial withdrawal option']
  },
  {
    id: 'fd3',
    bankName: 'Wells Fargo',
    interestRate: 4.6,
    minTenure: 12,
    maxTenure: 84,
    minAmount: 2000,
    seniorCitizenBonus: 0.3,
    prematureWithdrawal: false,
    compounding: 'Quarterly'
  },
  {
    id: 'fd4',
    bankName: 'Citibank',
    interestRate: 4.35,
    minTenure: 3,
    maxTenure: 60,
    minAmount: 1000,
    seniorCitizenBonus: 0.25,
    prematureWithdrawal: true,
    compounding: 'Quarterly',
    specialFeatures: ['Auto-renewal', 'Interest payout options']
  },
  {
    id: 'fd5',
    bankName: 'Capital One',
    interestRate: 4.75,
    minTenure: 12,
    maxTenure: 60,
    minAmount: 1000,
    seniorCitizenBonus: 0.15,
    prematureWithdrawal: true,
    compounding: 'Monthly',
    specialFeatures: ['No fees', 'FDIC insured']
  },
  {
    id: 'fd6',
    bankName: 'Ally Bank',
    interestRate: 4.8,
    minTenure: 3,
    maxTenure: 60,
    minAmount: 0,
    seniorCitizenBonus: 0,
    prematureWithdrawal: true,
    compounding: 'Daily',
    specialFeatures: ['No minimum deposit', '24/7 customer service']
  },
  {
    id: 'fd7',
    bankName: 'Marcus by Goldman Sachs',
    interestRate: 4.65,
    minTenure: 12,
    maxTenure: 72,
    minAmount: 500,
    seniorCitizenBonus: 0,
    prematureWithdrawal: false,
    compounding: 'Monthly',
    specialFeatures: ['No fees', 'FDIC insured']
  }
];

// Market condition assessment
export const assessMarketCondition = async (): Promise<{
  condition: 'Bullish' | 'Bearish' | 'Neutral';
  volatility: 'Low' | 'Moderate' | 'High';
  interestRateTrend: 'Rising' | 'Falling' | 'Stable';
  description: string;
}> => {
  try {
    // In a real app, this would analyze real market data
    // For now, we'll use a simplified approach with market movers
    const gainers = await getMarketMovers('gainers');
    const losers = await getMarketMovers('losers');
    
    // Calculate average percentage changes
    const avgGainerChange = gainers.length > 0 
      ? gainers.reduce((sum: number, stock: any) => sum + (stock.changesPercentage || 0), 0) / gainers.length
      : 0;
    
    const avgLoserChange = losers.length > 0
      ? losers.reduce((sum: number, stock: any) => sum + (stock.changesPercentage || 0), 0) / losers.length
      : 0;
    
    // Determine market condition
    let condition: 'Bullish' | 'Bearish' | 'Neutral';
    let volatility: 'Low' | 'Moderate' | 'High';
    let interestRateTrend: 'Rising' | 'Falling' | 'Stable';
    let description: string;
    
    // This is simplified logic - in a real app, you'd use more sophisticated analysis
    if (avgGainerChange > 3) {
      condition = 'Bullish';
      description = 'The market is showing strong positive momentum with significant gains.';
    } else if (avgLoserChange < -3) {
      condition = 'Bearish';
      description = 'The market is experiencing downward pressure with notable losses.';
    } else {
      condition = 'Neutral';
      description = 'The market is relatively stable with balanced gains and losses.';
    }
    
    // Determine volatility based on the spread between gainers and losers
    const volatilitySpread = Math.abs(avgGainerChange - avgLoserChange);
    if (volatilitySpread > 8) {
      volatility = 'High';
      description += ' Volatility is high, indicating uncertainty.';
    } else if (volatilitySpread > 4) {
      volatility = 'Moderate';
      description += ' Volatility is moderate, suggesting some market uncertainty.';
    } else {
      volatility = 'Low';
      description += ' Volatility is low, indicating relative stability.';
    }
    
    // For interest rate trend, in a real app you would use economic data
    // Here we'll use a simplified approach based on bond market indicators
    // For now, we'll just set a default
    interestRateTrend = 'Stable';
    description += ' Interest rates appear to be stable in the current environment.';
    
    return {
      condition,
      volatility,
      interestRateTrend,
      description
    };
  } catch (error) {
    console.error('Error assessing market condition:', error);
    // Default fallback
    return {
      condition: 'Neutral',
      volatility: 'Moderate',
      interestRateTrend: 'Stable',
      description: 'Unable to accurately assess current market conditions. Using default neutral outlook.'
    };
  }
};

// AI recommendation engine
export const getInvestmentRecommendations = async (
  riskTolerance: 'Low' | 'Moderate' | 'High',
  investmentHorizon: 'Short' | 'Medium' | 'Long',
  investmentGoals: string[] = ['Growth', 'Income', 'Preservation'],
  currentPortfolio: any[] = []
): Promise<InvestmentRecommendation[]> => {
  try {
    // Assess current market conditions
    const marketCondition = await assessMarketCondition();
    
    // Initialize recommendations array
    const recommendations: InvestmentRecommendation[] = [];
    
    // Determine appropriate asset allocation based on risk tolerance and market conditions
    let stockAllocation = 0;
    let bondAllocation = 0;
    let fdAllocation = 0;
    
    if (riskTolerance === 'High') {
      stockAllocation = 80;
      bondAllocation = 15;
      fdAllocation = 5;
    } else if (riskTolerance === 'Moderate') {
      stockAllocation = 60;
      bondAllocation = 30;
      fdAllocation = 10;
    } else {
      stockAllocation = 30;
      bondAllocation = 40;
      fdAllocation = 30;
    }
    
    // Adjust based on market conditions
    if (marketCondition.condition === 'Bearish') {
      stockAllocation -= 10;
      bondAllocation += 5;
      fdAllocation += 5;
    } else if (marketCondition.condition === 'Bullish') {
      stockAllocation += 10;
      bondAllocation -= 5;
      fdAllocation -= 5;
    }
    
    // Adjust based on investment horizon
    if (investmentHorizon === 'Short') {
      stockAllocation -= 20;
      bondAllocation -= 10;
      fdAllocation += 30;
    } else if (investmentHorizon === 'Long') {
      stockAllocation += 10;
      bondAllocation += 5;
      fdAllocation -= 15;
    }
    
    // Ensure allocations are within reasonable bounds
    stockAllocation = Math.max(0, Math.min(100, stockAllocation));
    bondAllocation = Math.max(0, Math.min(100, bondAllocation));
    fdAllocation = Math.max(0, Math.min(100, fdAllocation));
    
    // Normalize to ensure they sum to 100%
    const total = stockAllocation + bondAllocation + fdAllocation;
    stockAllocation = Math.round((stockAllocation / total) * 100);
    bondAllocation = Math.round((bondAllocation / total) * 100);
    fdAllocation = 100 - stockAllocation - bondAllocation;
    
    // Filter and score mutual funds based on criteria
    const scoredMutualFunds = mutualFunds.map(fund => {
      let score = 0;
      
      // Score based on risk tolerance match
      if (fund.riskLevel === riskTolerance) {
        score += 30;
      } else if (
        (fund.riskLevel === 'Moderate' && riskTolerance === 'High') ||
        (fund.riskLevel === 'Low' && riskTolerance === 'Moderate')
      ) {
        score += 15;
      }
      
      // Score based on performance
      score += fund.fiveYearReturn * 2;
      
      // Penalize high expense ratios
      score -= fund.expenseRatio * 10;
      
      // Bonus for large AUM (stability)
      score += Math.min(10, fund.aum / 100000);
      
      // Adjust based on category and market conditions
      if (
        (fund.category.includes('Bond') && marketCondition.condition === 'Bearish') ||
        (fund.category.includes('Growth') && marketCondition.condition === 'Bullish')
      ) {
        score += 15;
      }
      
      // Adjust for investment goals
      if (
        (investmentGoals.includes('Income') && fund.category.includes('Bond')) ||
        (investmentGoals.includes('Growth') && fund.category.includes('Growth')) ||
        (investmentGoals.includes('Preservation') && fund.riskLevel === 'Low')
      ) {
        score += 10;
      }
      
      return {
        type: 'MutualFund' as const,
        item: fund,
        score,
        reasoning: generateReasoning(fund, score, marketCondition, riskTolerance, investmentHorizon)
      };
    });
    
    // Filter and score fixed deposits
    const scoredFixedDeposits = fixedDeposits.map(fd => {
      let score = 0;
      
      // Base score on interest rate
      score += fd.interestRate * 10;
      
      // Adjust based on investment horizon
      if (
        (investmentHorizon === 'Short' && fd.maxTenure <= 12) ||
        (investmentHorizon === 'Medium' && fd.maxTenure >= 24 && fd.maxTenure <= 36) ||
        (investmentHorizon === 'Long' && fd.maxTenure >= 48)
      ) {
        score += 20;
      }
      
      // Bonus for flexible features
      if (fd.prematureWithdrawal) score += 10;
      if (fd.specialFeatures && fd.specialFeatures.length > 0) score += 5;
      
      // Adjust for market conditions
      if (marketCondition.interestRateTrend === 'Rising') {
        score -= 10; // Better to wait for higher rates
      } else if (marketCondition.interestRateTrend === 'Falling') {
        score += 15; // Lock in rates before they fall
      }
      
      return {
        type: 'FixedDeposit' as const,
        item: fd,
        score,
        reasoning: generateFDReasoning(fd, score, marketCondition, investmentHorizon)
      };
    });
    
    // Combine and sort all recommendations
    const allRecommendations = [...scoredMutualFunds, ...scoredFixedDeposits];
    allRecommendations.sort((a, b) => b.score - a.score);
    
    // Return top recommendations based on asset allocation
    const topRecommendations: InvestmentRecommendation[] = [];
    
    // Add mutual funds based on allocation
    const mutualFundCount = Math.ceil((stockAllocation + bondAllocation) / 20); // Roughly 1 fund per 20% allocation
    const stockFunds = scoredMutualFunds
      .filter(rec => !(rec.item as MutualFund).category.includes('Bond'))
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.ceil(stockAllocation / 20));
    
    const bondFunds = scoredMutualFunds
      .filter(rec => (rec.item as MutualFund).category.includes('Bond'))
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.ceil(bondAllocation / 20));
    
    topRecommendations.push(...stockFunds, ...bondFunds);
    
    // Add fixed deposits based on allocation
    const fdCount = Math.ceil(fdAllocation / 20);
    const topFDs = scoredFixedDeposits
      .sort((a, b) => b.score - a.score)
      .slice(0, fdCount);
    
    topRecommendations.push(...topFDs);
    
    // Sort final recommendations by score
    topRecommendations.sort((a, b) => b.score - a.score);
    
    return topRecommendations;
  } catch (error) {
    console.error('Error generating investment recommendations:', error);
    return [];
  }
};

// Helper function to generate reasoning for mutual fund recommendations
function generateReasoning(
  fund: MutualFund,
  score: number,
  marketCondition: any,
  riskTolerance: string,
  investmentHorizon: string
): string {
  let reasoning = '';
  
  // Performance reasoning
  if (fund.fiveYearReturn > 12) {
    reasoning += `${fund.name} has shown strong performance with a ${fund.fiveYearReturn.toFixed(1)}% 5-year return. `;
  } else if (fund.fiveYearReturn > 8) {
    reasoning += `${fund.name} has shown solid performance with a ${fund.fiveYearReturn.toFixed(1)}% 5-year return. `;
  } else {
    reasoning += `${fund.name} has shown moderate performance with a ${fund.fiveYearReturn.toFixed(1)}% 5-year return. `;
  }
  
  // Risk alignment
  reasoning += `This fund's ${fund.riskLevel} risk profile ${
    fund.riskLevel === riskTolerance 
      ? 'aligns perfectly with' 
      : 'is somewhat different from'
  } your ${riskTolerance.toLowerCase()} risk tolerance. `;
  
  // Market condition
  if (
    (fund.category.includes('Bond') && marketCondition.condition === 'Bearish') ||
    (fund.riskLevel === 'Low' && marketCondition.volatility === 'High')
  ) {
    reasoning += `It's a good defensive choice in the current ${marketCondition.condition.toLowerCase()} market with ${marketCondition.volatility.toLowerCase()} volatility. `;
  } else if (
    (fund.category.includes('Growth') && marketCondition.condition === 'Bullish') ||
    (fund.riskLevel === 'High' && marketCondition.volatility === 'Low')
  ) {
    reasoning += `It's well-positioned to capitalize on the current ${marketCondition.condition.toLowerCase()} market with ${marketCondition.volatility.toLowerCase()} volatility. `;
  }
  
  // Expense ratio
  if (fund.expenseRatio < 0.1) {
    reasoning += `The extremely low expense ratio of ${fund.expenseRatio.toFixed(2)}% will help maximize your returns. `;
  } else if (fund.expenseRatio < 0.5) {
    reasoning += `The reasonable expense ratio of ${fund.expenseRatio.toFixed(2)}% is cost-effective. `;
  } else {
    reasoning += `The expense ratio of ${fund.expenseRatio.toFixed(2)}% is somewhat high, but may be justified by the fund's strategy. `;
  }
  
  // Investment horizon
  if (investmentHorizon === 'Long' && fund.riskLevel === 'High') {
    reasoning += `This fund is suitable for your long-term investment horizon, allowing time to weather market fluctuations. `;
  } else if (investmentHorizon === 'Short' && fund.riskLevel === 'Low') {
    reasoning += `This fund's lower risk profile makes it appropriate for your shorter investment horizon. `;
  }
  
  return reasoning;
}

// Helper function to generate reasoning for fixed deposit recommendations
function generateFDReasoning(
  fd: FixedDeposit,
  score: number,
  marketCondition: any,
  investmentHorizon: string
): string {
  let reasoning = '';
  
  // Interest rate reasoning
  if (fd.interestRate > 4.5) {
    reasoning += `${fd.bankName} offers a competitive interest rate of ${fd.interestRate.toFixed(2)}%, which is above average in the current market. `;
  } else {
    reasoning += `${fd.bankName} offers an interest rate of ${fd.interestRate.toFixed(2)}%, which is reasonable in the current market. `;
  }
  
  // Tenure alignment with investment horizon
  if (
    (investmentHorizon === 'Short' && fd.minTenure <= 12) ||
    (investmentHorizon === 'Medium' && fd.maxTenure >= 24 && fd.maxTenure <= 36) ||
    (investmentHorizon === 'Long' && fd.maxTenure >= 48)
  ) {
    reasoning += `The tenure options (${fd.minTenure}-${fd.maxTenure} months) align well with your ${investmentHorizon.toLowerCase()}-term investment horizon. `;
  } else {
    reasoning += `The tenure options (${fd.minTenure}-${fd.maxTenure} months) may not perfectly align with your ${investmentHorizon.toLowerCase()}-term investment horizon. `;
  }
  
  // Interest rate trend
  if (marketCondition.interestRateTrend === 'Rising') {
    reasoning += `With interest rates trending upward, you might consider shorter terms or laddering your deposits. `;
  } else if (marketCondition.interestRateTrend === 'Falling') {
    reasoning += `With interest rates trending downward, locking in this rate for a longer term could be advantageous. `;
  } else {
    reasoning += `With stable interest rates, this FD offers predictable returns in the current environment. `;
  }
  
  // Special features
  if (fd.prematureWithdrawal) {
    reasoning += `This FD offers premature withdrawal options, providing flexibility if your financial needs change. `;
  }
  
  if (fd.seniorCitizenBonus > 0) {
    reasoning += `Senior citizens receive an additional ${fd.seniorCitizenBonus.toFixed(2)}% interest bonus. `;
  }
  
  if (fd.specialFeatures && fd.specialFeatures.length > 0) {
    reasoning += `Additional benefits include: ${fd.specialFeatures.join(', ')}. `;
  }
  
  return reasoning;
} 
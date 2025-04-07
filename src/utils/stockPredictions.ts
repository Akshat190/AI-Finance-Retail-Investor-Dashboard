// Stock prediction utilities and functions

// Helper function to handle NaN values
export const safeNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// Available stocks for buying
export const availableStocks = [
  // US Tech Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.25, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 310.20, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc. (Google)', price: 2850.75, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3150.50, sector: 'Technology' },
  { symbol: 'META', name: 'Meta Platforms, Inc.', price: 325.80, sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 875.30, sector: 'Industrial' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 420.50, sector: 'Technology' },
  { symbol: 'NFLX', name: 'Netflix, Inc.', price: 550.40, sector: 'Technology' },
  { symbol: 'PYPL', name: 'PayPal Holdings, Inc.', price: 120.75, sector: 'Financial' },
  { symbol: 'ADBE', name: 'Adobe Inc.', price: 480.30, sector: 'Technology' },
  
  // US Financial Stocks
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 145.80, sector: 'Financial' },
  { symbol: 'BAC', name: 'Bank of America Corporation', price: 38.50, sector: 'Financial' },
  { symbol: 'WFC', name: 'Wells Fargo & Company', price: 45.25, sector: 'Financial' },
  { symbol: 'C', name: 'Citigroup Inc.', price: 70.40, sector: 'Financial' },
  { symbol: 'GS', name: 'The Goldman Sachs Group, Inc.', price: 350.60, sector: 'Financial' },
  
  // US Healthcare Stocks
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 165.50, sector: 'Healthcare' },
  { symbol: 'PFE', name: 'Pfizer Inc.', price: 38.75, sector: 'Healthcare' },
  { symbol: 'MRK', name: 'Merck & Co., Inc.', price: 85.20, sector: 'Healthcare' },
  { symbol: 'UNH', name: 'UnitedHealth Group Incorporated', price: 450.30, sector: 'Healthcare' },
  { symbol: 'ABT', name: 'Abbott Laboratories', price: 110.45, sector: 'Healthcare' },
  
  // US Consumer Stocks
  { symbol: 'PG', name: 'The Procter & Gamble Company', price: 145.60, sector: 'Consumer' },
  { symbol: 'KO', name: 'The Coca-Cola Company', price: 55.75, sector: 'Consumer' },
  { symbol: 'PEP', name: 'PepsiCo, Inc.', price: 165.30, sector: 'Consumer' },
  { symbol: 'WMT', name: 'Walmart Inc.', price: 140.50, sector: 'Consumer' },
  { symbol: 'COST', name: 'Costco Wholesale Corporation', price: 510.25, sector: 'Consumer' },
  
  // US Industrial Stocks
  { symbol: 'GE', name: 'General Electric Company', price: 105.80, sector: 'Industrial' },
  { symbol: 'BA', name: 'The Boeing Company', price: 210.40, sector: 'Industrial' },
  { symbol: 'CAT', name: 'Caterpillar Inc.', price: 225.60, sector: 'Industrial' },
  { symbol: 'MMM', name: '3M Company', price: 95.30, sector: 'Industrial' },
  { symbol: 'HON', name: 'Honeywell International Inc.', price: 195.70, sector: 'Industrial' },
  
  // US Energy Stocks
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', price: 110.25, sector: 'Energy' },
  { symbol: 'CVX', name: 'Chevron Corporation', price: 155.40, sector: 'Energy' },
  { symbol: 'COP', name: 'ConocoPhillips', price: 115.60, sector: 'Energy' },
  { symbol: 'SLB', name: 'Schlumberger Limited', price: 50.30, sector: 'Energy' },
  { symbol: 'EOG', name: 'EOG Resources, Inc.', price: 125.70, sector: 'Energy' },
  
  // ETFs
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', price: 420.50, sector: 'ETF' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', price: 365.30, sector: 'ETF' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', price: 220.40, sector: 'ETF' },
  { symbol: 'VOO', name: 'Vanguard S&P 500 ETF', price: 385.60, sector: 'ETF' },
  { symbol: 'VEA', name: 'Vanguard FTSE Developed Markets ETF', price: 45.75, sector: 'ETF' },
  
  // Indian Technology Stocks
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services Ltd.', price: 3850.75, sector: 'Technology', country: 'India' },
  { symbol: 'INFY.NS', name: 'Infosys Ltd.', price: 1520.40, sector: 'Technology', country: 'India' },
  { symbol: 'WIPRO.NS', name: 'Wipro Ltd.', price: 450.25, sector: 'Technology', country: 'India' },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies Ltd.', price: 1250.60, sector: 'Technology', country: 'India' },
  { symbol: 'TECHM.NS', name: 'Tech Mahindra Ltd.', price: 1180.30, sector: 'Technology', country: 'India' },
  { symbol: 'LTI.NS', name: 'Larsen & Toubro Infotech Ltd.', price: 4750.50, sector: 'Technology', country: 'India' },
  
  // Indian Financial Stocks
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Ltd.', price: 1650.75, sector: 'Financial', country: 'India' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank Ltd.', price: 950.40, sector: 'Financial', country: 'India' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', price: 620.30, sector: 'Financial', country: 'India' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank Ltd.', price: 850.25, sector: 'Financial', country: 'India' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank Ltd.', price: 1850.60, sector: 'Financial', country: 'India' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance Ltd.', price: 7250.40, sector: 'Financial', country: 'India' },
  
  // Indian Consumer Stocks
  { symbol: 'ITC.NS', name: 'ITC Ltd.', price: 420.75, sector: 'Consumer', country: 'India' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever Ltd.', price: 2550.30, sector: 'Consumer', country: 'India' },
  { symbol: 'NESTLEIND.NS', name: 'Nestle India Ltd.', price: 22450.60, sector: 'Consumer', country: 'India' },
  { symbol: 'BRITANNIA.NS', name: 'Britannia Industries Ltd.', price: 4650.25, sector: 'Consumer', country: 'India' },
  { symbol: 'DABUR.NS', name: 'Dabur India Ltd.', price: 550.40, sector: 'Consumer', country: 'India' },
  { symbol: 'MARICO.NS', name: 'Marico Ltd.', price: 520.30, sector: 'Consumer', country: 'India' },
  
  // Indian Energy & Industrial Stocks
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Ltd.', price: 2450.75, sector: 'Energy', country: 'India' },
  { symbol: 'ONGC.NS', name: 'Oil and Natural Gas Corporation Ltd.', price: 180.40, sector: 'Energy', country: 'India' },
  { symbol: 'NTPC.NS', name: 'NTPC Ltd.', price: 240.30, sector: 'Energy', country: 'India' },
  { symbol: 'POWERGRID.NS', name: 'Power Grid Corporation of India Ltd.', price: 220.25, sector: 'Energy', country: 'India' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro Ltd.', price: 2850.60, sector: 'Industrial', country: 'India' },
  { symbol: 'ADANIPORTS.NS', name: 'Adani Ports and Special Economic Zone Ltd.', price: 850.40, sector: 'Industrial', country: 'India' },
  
  // Indian Pharmaceutical Stocks
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical Industries Ltd.', price: 1150.75, sector: 'Healthcare', country: 'India' },
  { symbol: 'DRREDDY.NS', name: 'Dr. Reddy\'s Laboratories Ltd.', price: 5250.40, sector: 'Healthcare', country: 'India' },
  { symbol: 'CIPLA.NS', name: 'Cipla Ltd.', price: 1050.30, sector: 'Healthcare', country: 'India' },
  { symbol: 'DIVISLAB.NS', name: 'Divi\'s Laboratories Ltd.', price: 3650.25, sector: 'Healthcare', country: 'India' },
  { symbol: 'BIOCON.NS', name: 'Biocon Ltd.', price: 250.60, sector: 'Healthcare', country: 'India' },
  
  // Indian Automobile Stocks
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki India Ltd.', price: 9850.75, sector: 'Automobile', country: 'India' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors Ltd.', price: 650.40, sector: 'Automobile', country: 'India' },
  { symbol: 'M&M.NS', name: 'Mahindra & Mahindra Ltd.', price: 1450.30, sector: 'Automobile', country: 'India' },
  { symbol: 'HEROMOTOCO.NS', name: 'Hero MotoCorp Ltd.', price: 2850.25, sector: 'Automobile', country: 'India' },
  { symbol: 'BAJAJ-AUTO.NS', name: 'Bajaj Auto Ltd.', price: 4650.60, sector: 'Automobile', country: 'India' },
  
  // Indian ETFs/Indices
  { symbol: 'NIFTYBEES.NS', name: 'Nippon India ETF Nifty BeES', price: 220.75, sector: 'ETF', country: 'India' },
  { symbol: 'BANKBEES.NS', name: 'Nippon India ETF Bank BeES', price: 380.40, sector: 'ETF', country: 'India' },
  { symbol: 'GOLDBEES.NS', name: 'Nippon India ETF Gold BeES', price: 45.30, sector: 'ETF', country: 'India' }
];

// Company profiles for prediction
const companyProfiles: {[key: string]: any} = {
  // Tech giants
  'AAPL': { 
    growthRate: 12, 
    volatility: 25, 
    moat: 9, 
    dividendYield: 0.6,
    cyclicality: 6,
    debtLevel: 3,
    innovationScore: 9,
    marketPosition: 'market leader',
    businessModel: 'hardware and services ecosystem',
    riskProfile: 'moderate',
    maturityStage: 'mature but innovative',
    currentValuation: 'fairly valued'
  },
  'MSFT': { 
    growthRate: 15, 
    volatility: 22, 
    moat: 9, 
    dividendYield: 0.8,
    cyclicality: 4,
    debtLevel: 2,
    innovationScore: 8,
    marketPosition: 'market leader',
    businessModel: 'software and cloud services',
    riskProfile: 'moderate',
    maturityStage: 'mature but innovative',
    currentValuation: 'fairly valued'
  },
  'GOOGL': { 
    growthRate: 18, 
    volatility: 28, 
    moat: 9, 
    dividendYield: 0,
    cyclicality: 5,
    debtLevel: 1,
    innovationScore: 9,
    marketPosition: 'market leader',
    businessModel: 'advertising and cloud services',
    riskProfile: 'moderate',
    maturityStage: 'mature but innovative',
    currentValuation: 'fairly valued'
  },
  // Default profile for stocks without specific data
  'DEFAULT': {
    growthRate: 8,
    volatility: 30,
    moat: 5,
    dividendYield: 1.5,
    cyclicality: 6,
    debtLevel: 4,
    innovationScore: 6,
    marketPosition: 'competitive',
    businessModel: 'traditional',
    riskProfile: 'moderate',
    maturityStage: 'mature',
    currentValuation: 'fairly valued'
  }
};

// Economic scenarios for prediction context
const economicScenarios = [
  { name: 'Strong Growth', probability: 0.25, marketReturn: 12 },
  { name: 'Moderate Growth', probability: 0.45, marketReturn: 8 },
  { name: 'Stagflation', probability: 0.15, marketReturn: 2 },
  { name: 'Recession', probability: 0.10, marketReturn: -10 },
  { name: 'Recovery', probability: 0.05, marketReturn: 15 }
];

// Helper function to get sector outlook
function getSectorOutlook(sector: string): string {
  const sectorOutlooks: {[key: string]: string} = {
    'Technology': 'The technology sector continues to benefit from digital transformation trends, cloud computing growth, and artificial intelligence advancements. While valuations can be elevated, leading companies with strong competitive positions are well-positioned for long-term growth.',
    'Healthcare': 'The healthcare sector benefits from demographic trends including aging populations and growing middle classes in emerging markets. Innovation in treatments and digital health solutions provides growth opportunities.',
    'Financial': 'Financial services companies are sensitive to interest rate environments, regulatory changes, and economic cycles. Digital transformation is reshaping the competitive landscape, with fintech disruption creating both challenges and opportunities.',
    'Consumer': 'Consumer companies offer relative stability through economic cycles, particularly those selling essential goods. E-commerce growth continues to reshape retail, while changing consumer preferences toward health and sustainability influence product development.',
    'Industrial': 'Industrial companies are cyclical but essential to economic growth and infrastructure development. Automation, supply chain optimization, and sustainability initiatives are driving innovation in the sector.',
    'Energy': 'The energy sector faces dual challenges from the transition to renewable sources and volatility in traditional energy markets. Companies with clear energy transition strategies and diversified energy portfolios are better positioned for long-term success.',
    'ETF': 'Exchange-traded funds provide diversified exposure to markets or sectors with lower company-specific risk. Performance depends on the underlying assets, with broad market ETFs historically delivering long-term growth while reducing volatility.',
    'Default': 'This sector demonstrates performance generally aligned with broader economic trends. Companies with strong competitive positions, healthy balance sheets, and effective management teams are better positioned to outperform peers over the long term.'
  };
  
  return sectorOutlooks[sector] || sectorOutlooks['Default'];
}

// Helper function to describe sector performance in different economic scenarios
function sectorPerformanceDescription(sector: string, scenario: string): string {
  const performanceMatrix: {[key: string]: {[key: string]: string}} = {
    'Technology': {
      'Strong Growth': 'exceptionally well, as risk appetite increases and growth is prioritized',
      'Moderate Growth': 'well, benefiting from continued digital transformation',
      'Stagflation': 'unevenly, with established profitable tech outperforming speculative tech',
      'Recession': 'poorly in the short term, though quality companies with strong balance sheets may recover quickly',
      'Recovery': 'strongly, particularly companies enabling productivity improvements'
    },
    'Default': {
      'Strong Growth': 'in line with broader market trends',
      'Moderate Growth': 'steadily, with company-specific factors driving relative performance',
      'Stagflation': 'based primarily on pricing power and balance sheet strength',
      'Recession': 'based on cyclicality, balance sheet strength, and essential nature of products/services',
      'Recovery': 'based on cyclicality and positioning for post-recession growth'
    }
  };
  
  const sectorMatrix = performanceMatrix[sector] || performanceMatrix['Default'];
  return sectorMatrix[scenario] || 'based on company-specific factors';
}

// Main prediction generation function
export async function generatePrediction(stock: any) {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { symbol, name, sector = 'Default', current_price: currentPrice = 100 } = stock;
    
    // Get company profile or use default
    const profile = companyProfiles[symbol] || companyProfiles['DEFAULT'];
    
    // Base calculations
    const volatilityFactor = profile.volatility / 100;
    const baseSectorGrowth = 
      sector === 'Technology' ? 12 :
      sector === 'Healthcare' ? 9 :
      sector === 'Financial' ? 8 :
      sector === 'Consumer' ? 7 :
      sector === 'Industrial' ? 8 :
      sector === 'Energy' ? 6 :
      sector === 'ETF' ? 8 : 7; // Default
    
    // Company-specific adjustment
    const companyAdjustment = (profile.growthRate - baseSectorGrowth) / 2;
    
    // Economic scenario weighting
    let weightedReturn = 0;
    for (const scenario of economicScenarios) {
      weightedReturn += scenario.probability * scenario.marketReturn;
    }
    
    // Calculate prediction metrics
    const baseReturn = baseSectorGrowth + companyAdjustment;
    const marketAdjustedReturn = (baseReturn + weightedReturn) / 2;
    
    // Add random variation for realism
    const randomFactor = ((Math.random() * 2) - 1) * volatilityFactor * 10;
    const projectedReturn = marketAdjustedReturn + randomFactor;
    
    // 1-year price prediction
    const predictedPrice = safeNumber(currentPrice) * (1 + (projectedReturn / 100));
    
    // Confidence calculation (higher for lower volatility and stronger moat)
    const confidenceBase = 70 - (volatilityFactor * 100) + (profile.moat * 3);
    const confidence = Math.max(Math.min(confidenceBase + (Math.random() * 10), 95), 40);
    
    // Calculate shorter and longer timeframes
    const oneMonthReturn = (projectedReturn / 12) + ((Math.random() * 2 - 1) * volatilityFactor * 5);
    const sixMonthsReturn = (projectedReturn / 2) + ((Math.random() * 2 - 1) * volatilityFactor * 8);
    const fiveYearCompounded = Math.pow(1 + (projectedReturn / 100), 5) - 1;
    const fiveYearReturn = fiveYearCompounded * 100;
    
    // Get relevant sector outlook
    const sectorOutlook = getSectorOutlook(sector);
    
    // Randomly select a scenario for analysis
    const scenarios = economicScenarios.sort(() => Math.random() - 0.5).slice(0, 2);
    const scenarioAnalysis = scenarios.map(s => 
      `In a ${s.name.toLowerCase()} scenario, ${symbol} would likely perform ${sectorPerformanceDescription(sector, s.name)}.`
    ).join(' ');
    
    // Generate analysis text
    const analysis = `${symbol} shows a ${projectedReturn > 0 ? 'positive' : 'negative'} outlook with expected ${Math.abs(projectedReturn).toFixed(1)}% return over the next year. ${
      profile.moat > 7 ? 'The company has a strong competitive advantage in its market. ' : 
      profile.moat > 5 ? 'The company has a moderate competitive position. ' : 
      'The company faces significant competitive pressures. '
    }${scenarioAnalysis} ${sectorOutlook.split('.')[0]}.`;
    
    // Return the prediction object
    return {
      symbol,
      name,
      currentPrice: safeNumber(currentPrice),
      prediction: predictedPrice, // Required by the Portfolio component
      changePercent: projectedReturn, // Required by the Portfolio component
      confidence,
      analysis,
      oneMonth: oneMonthReturn,
      sixMonths: sixMonthsReturn,
      fiveYear: fiveYearReturn,
      sector,
      isNew: false // Will be set by handleGeneratePrediction function
    };
    
  } catch (error) {
    console.error('Error generating prediction:', error);
    throw new Error('Failed to generate prediction');
  }
}

// Generate detailed investment analysis
function generateDetailedInvestmentAnalysis(stock: any, profile: any, predictions: any) {
  const { symbol, name, sector = 'Default' } = stock;
  const { oneMonth, sixMonths, oneYear, customYear, years } = predictions;
  
  // Company analysis
  const companyAnalysis = profile.moat >= 8 ?
    `${name} (${symbol}) has established a strong competitive position in the ${sector} sector with significant barriers to entry.` :
    profile.moat >= 6 ?
    `${name} (${symbol}) has developed a solid competitive position in the ${sector} sector with some defensible advantages.` :
    `${name} (${symbol}) operates in the competitive ${sector} sector where maintaining market position requires continuous innovation.`;
  
  // Moat analysis
  const moatAnalysis = profile.moat >= 8 ?
    `The company's strong competitive moat is derived from ${
      sector === 'Technology' ? 'its technological leadership, network effects, and ecosystem lock-in' :
      sector === 'Healthcare' ? 'patents, regulatory approvals, and specialized expertise' :
      sector === 'Financial' ? 'scale advantages, regulatory relationships, and customer switching costs' :
      sector === 'Consumer' ? 'brand strength, distribution networks, and customer loyalty' :
      sector === 'Industrial' ? 'scale economies, proprietary technology, and long-term contracts' :
      sector === 'Energy' ? 'access to resources, infrastructure assets, and regulatory permits' :
      'its established market position and operational efficiencies'
    }.` :
    profile.moat >= 6 ?
    `The company has established competitive advantages through ${
      sector === 'Technology' ? 'product differentiation and user experience' :
      sector === 'Healthcare' ? 'specialized products and services' :
      sector === 'Financial' ? 'customer relationships and service quality' :
      sector === 'Consumer' ? 'brand recognition and product quality' :
      sector === 'Industrial' ? 'operational efficiency and product reliability' :
      sector === 'Energy' ? 'operational expertise and strategic assets' :
      'operational excellence and market positioning'
    }.` :
    `The company faces competitive pressures that require ongoing innovation and operational improvements to maintain market share.`;
  
  // Innovation analysis
  const innovationAnalysis = profile.innovationScore >= 8 ?
    `${symbol} demonstrates industry-leading innovation capabilities, consistently introducing new products and services that drive growth.` :
    profile.innovationScore >= 6 ?
    `${symbol} maintains a solid innovation pipeline that supports its competitive position.` :
    `${symbol} faces innovation challenges in a rapidly evolving marketplace.`;
  
  // Financial health analysis
  const financialHealthAnalysis = profile.debtLevel <= 2 ?
    `The company maintains a strong balance sheet with minimal debt, providing financial flexibility for investments and shareholder returns.` :
    profile.debtLevel <= 4 ?
    `The company maintains a balanced financial position with manageable debt levels.` :
    `The company's elevated debt levels may constrain financial flexibility and increase vulnerability to economic downturns.`;
  
  // Dividend analysis
  const dividendAnalysis = profile.dividendYield > 3 ?
    `${symbol} offers an attractive dividend yield of approximately ${profile.dividendYield}%, positioning it as a potential income investment.` :
    profile.dividendYield > 1 ?
    `${symbol} provides a moderate dividend yield of approximately ${profile.dividendYield}%.` :
    profile.dividendYield > 0 ?
    `${symbol} offers a modest dividend yield of approximately ${profile.dividendYield}%.` :
    `${symbol} does not currently pay a dividend, focusing instead on reinvesting for growth.`;
  
  // Economic analysis
  const economicAnalysis = profile.cyclicality >= 8 ?
    `As a highly cyclical company, ${symbol}'s performance is strongly influenced by economic conditions.` :
    profile.cyclicality >= 5 ?
    `${symbol} shows moderate sensitivity to economic cycles, with performance partially influenced by broader economic trends.` :
    `${symbol} demonstrates relatively low cyclicality, with performance less dependent on economic conditions than many peers.`;
  
  // Time horizon analysis
  const timeHorizonAnalysis = years >= 10 ?
    `Your long-term investment horizon aligns well with capturing the full benefits of compounding returns and weathering market volatility.` :
    years >= 5 ?
    `Your medium to long-term investment horizon provides a good balance between growth potential and risk management.` :
    years >= 3 ?
    `Your medium-term investment horizon requires careful consideration of entry points and valuation.` :
    `Your shorter investment horizon increases the importance of timing and market sentiment in determining returns.`;
  
  // Risk factors
  const volatilityRisk = profile.volatility >= 35 ?
    `High price volatility (${profile.volatility}% annualized)` :
    profile.volatility >= 25 ?
    `Moderate price volatility (${profile.volatility}% annualized)` :
    `Relatively low price volatility (${profile.volatility}% annualized)`;
  
  const cyclicalityRisk = profile.cyclicality >= 7 ?
    `High sensitivity to economic cycles` :
    profile.cyclicality >= 5 ?
    `Moderate sensitivity to economic cycles` :
    `Low sensitivity to economic cycles`;
  
  const disruptionRisk = sector === 'Technology' || sector === 'Retail' ?
    `Potential technological disruption in the industry` : '';
  
  const regulatoryRisk = sector === 'Financial' || sector === 'Healthcare' || sector === 'Energy' ?
    `Regulatory changes affecting business operations` : '';
  
  // Filter out empty risks
  const risks = [volatilityRisk, cyclicalityRisk, disruptionRisk, regulatoryRisk].filter(risk => risk !== '');
  
  // Return expectations
  const annualizedCustomReturn = (Math.pow(1 + customYear/100, 1/years) - 1) * 100;
  
  const returnExpectations = `Based on our analysis, we project a total return of ${customYear.toFixed(1)}% over your ${years}-year investment horizon, representing an annualized return of approximately ${annualizedCustomReturn.toFixed(2)}%. For context, our short-term projections show ${oneMonth.toFixed(1)}% movement in the next month and ${sixMonths.toFixed(1)}% over six months. Our standard 1-year forecast indicates ${oneYear.toFixed(1)}% potential return.`;
  
  // Valuation assessment
  const valuationAssessment = profile.currentValuation === 'undervalued' ?
    `Current valuation metrics suggest ${symbol} may be undervalued relative to its growth prospects and sector peers, potentially offering an attractive entry point.` :
    profile.currentValuation === 'fairly valued' ?
    `Current valuation metrics suggest ${symbol} is fairly valued relative to its growth prospects and sector peers.` :
    `Current valuation metrics suggest ${symbol} may be trading at a premium relative to its growth prospects and sector peers, which could limit upside potential.`;
  
  // Investment strategy recommendation
  const strategyRecommendation = years >= 5 && profile.growthRate >= 10 ?
    `Given your long-term investment horizon and ${symbol}'s strong growth profile, a buy-and-hold strategy may be appropriate, allowing time to overcome short-term volatility and benefit from compounding returns.` :
    years >= 5 && profile.dividendYield >= 2 ?
    `Given your long-term investment horizon and ${symbol}'s dividend yield, a dividend reinvestment strategy could effectively compound returns over time.` :
    years <= 2 && profile.volatility >= 30 ?
    `Given your shorter investment horizon and ${symbol}'s volatility profile, consider implementing a more active management approach with defined entry and exit points.` :
    `For your ${years}-year investment horizon, consider a balanced approach that monitors ${symbol}'s performance against your investment thesis, adjusting positions as fundamentals evolve.`;
  
  // Sector outlook
  const sectorOutlook = getSectorOutlook(sector);
  
  // Compile the full analysis
  return `# Investment Analysis: ${name} (${symbol})

## Company Overview
${companyAnalysis} ${moatAnalysis} ${innovationAnalysis}

## Financial Profile
${financialHealthAnalysis} ${dividendAnalysis} The company has demonstrated a historical growth rate of approximately ${profile.growthRate}% annually.

## Economic Context
${economicAnalysis}

## ${sector} Sector Outlook
${sectorOutlook}

## ${years}-Year Return Projection
${returnExpectations} ${valuationAssessment}

## Investment Horizon Considerations
${timeHorizonAnalysis}

## Key Risk Factors
${risks.join('\n')}

## Strategy Considerations
${strategyRecommendation}

Note: This analysis is based on historical data and current market conditions. Actual results may vary significantly, particularly over longer time horizons.`;
}

// Custom year prediction function
export async function generateCustomPrediction(stock: any, years: number) {
  try {
    // Get the standard prediction first
    const standardPrediction = await generatePrediction(stock);
    
    // Calculate custom year prediction
    let customYear;
    if (years <= 1) {
      customYear = standardPrediction.oneYear;
    } else if (years <= 3) {
      customYear = standardPrediction.threeYear;
    } else if (years <= 5) {
      customYear = standardPrediction.fiveYear;
    } else if (years <= 10) {
      customYear = standardPrediction.tenYear;
    } else {
      // For periods longer than 10 years, compound the annual return
      customYear = ((1 + standardPrediction.annualizedReturn / 100) ** years - 1) * 100;
    }
    
    // Calculate confidence for custom year
    const customYearConfidence = Math.max(20, Math.round(85 - (years > 5 ? 15 : years > 3 ? 10 : 5)));
    
    // Generate custom reasoning
    const { symbol, sector } = stock;
    const profile = companyProfiles[symbol] || companyProfiles['DEFAULT'];
    
    // Get sector insights
    const sectorInsights: {[key: string]: string} = {
      'Technology': `Technology companies often benefit from innovation and digital transformation trends. ${symbol} operates in a sector that has historically delivered annual returns of approximately 12%.`,
      'Healthcare': `Healthcare companies benefit from demographic trends and ongoing medical advances. ${symbol} is positioned in a sector that has historically delivered annual returns of approximately 9%.`,
      'Financial': `Financial services companies are sensitive to interest rate changes and economic cycles. ${symbol} is in a sector that typically benefits from rising interest rates and has delivered historical annual returns of about 8%.`,
      'Default': `${symbol} operates in a sector that has shown historical annual returns averaging around 8%, generally moving in line with broader market trends.`
    };
    
    const annualizedCustomReturn = (Math.pow(1 + customYear/100, 1/years) - 1) * 100;
    
    const sentiment = annualizedCustomReturn >= 15 ? 'very bullish' : 
                     annualizedCustomReturn >= 10 ? 'bullish' : 
                     annualizedCustomReturn >= 5 ? 'moderately bullish' :
                     annualizedCustomReturn >= 0 ? 'neutral to slightly bullish' : 
                     annualizedCustomReturn >= -5 ? 'slightly bearish' : 
                     annualizedCustomReturn >= -10 ? 'moderately bearish' : 'bearish';
    
    const customYearAnalysis = years <= 1 ?
      `Our 1-year forecast represents a short-term outlook where market sentiment and technical factors often play a significant role alongside company fundamentals.` :
      years <= 3 ?
      `Our ${years}-year forecast represents a medium-term investment horizon where company fundamentals begin to outweigh short-term market fluctuations.` :
      years <= 5 ?
      `Our ${years}-year forecast represents a medium to long-term investment horizon where company strategy and sector trends become increasingly important drivers of returns.` :
      years <= 10 ?
      `Our ${years}-year forecast represents a long-term investment horizon where compounding returns can significantly impact overall performance, and macroeconomic factors play a crucial role.` :
      `Our ${years}-year forecast represents a very long-term investment horizon where compounding becomes the dominant factor in total returns, and technological and societal shifts may fundamentally alter business landscapes.`;
    
    const customReasoning = `Custom ${years}-Year Forecast for ${symbol} (${sector} Sector)
    
Our analysis indicates a ${sentiment} outlook for ${symbol} over your specified ${years}-year investment horizon. ${sectorInsights[sector] || sectorInsights['Default']}

${customYearAnalysis} We project a total return of ${customYear.toFixed(2)}% over ${years} years, which represents an annualized return of approximately ${annualizedCustomReturn.toFixed(2)}%.

For context, our short-term projections show ${standardPrediction.oneMonth.toFixed(1)}% movement in the next month and ${standardPrediction.sixMonths.toFixed(1)}% over six months. Our standard 1-year forecast indicates ${standardPrediction.oneYear.toFixed(1)}% potential return.

Key factors influencing this ${years}-year projection include:
• ${sector} sector trends and competitive positioning
• Expected product/service innovation cycles
• Projected market expansion opportunities
• Anticipated regulatory environment
• Macroeconomic factors including interest rates and inflation expectations

Note that prediction confidence decreases with longer time horizons. Our confidence in this ${years}-year projection is approximately ${customYearConfidence}%, compared to our 1-year forecast confidence of ${standardPrediction.oneYearConfidence}%.

Consider your investment goals, risk tolerance, and portfolio diversification when evaluating this opportunity.`;
    
    // Return the enhanced prediction with custom year data
    return {
      ...standardPrediction,
      customYear,
      customYearPeriod: years,
      customYearConfidence,
      customReasoning
    };
  } catch (error) {
    console.error('Error generating custom prediction:', error);
    throw error;
  }
}

// Search function to find stocks
export function searchStock(query: string): any[] {
  if (!query) return availableStocks.slice(0, 10);
  
  const lowerQuery = query.toLowerCase();
  
  return availableStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(lowerQuery) || 
    stock.name.toLowerCase().includes(lowerQuery)
  ).slice(0, 15); // Return up to 15 results
} 
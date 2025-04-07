// Mutual Funds Data
export const mutualFundsData = [
  {
    id: '1',
    name: 'Vanguard 500 Index Fund',
    ticker: 'VFIAX',
    category: 'Large Blend',
    nav: 439.67,
    aum: 325.4, // in billions
    expenseRatio: 0.04,
    oneYearReturn: 12.8,
    threeYearReturn: 9.2,
    fiveYearReturn: 11.5,
    risk: 'Moderate',
    rating: 5,
    holdings: 'S&P 500 companies',
    fundManager: 'Vanguard',
    region: 'US'
  },
  {
    id: '2',
    name: 'Fidelity Contrafund',
    ticker: 'FCNTX',
    category: 'Large Growth',
    nav: 15.34,
    aum: 98.6,
    expenseRatio: 0.85,
    oneYearReturn: 14.7,
    threeYearReturn: 10.1,
    fiveYearReturn: 12.8,
    risk: 'Moderate',
    rating: 4,
    holdings: 'Large-cap growth stocks',
    fundManager: 'Fidelity',
    region: 'US'
  },
  {
    id: '3',
    name: 'T. Rowe Price Blue Chip Growth',
    ticker: 'TRBCX',
    category: 'Large Growth',
    nav: 145.23,
    aum: 87.2,
    expenseRatio: 0.7,
    oneYearReturn: 13.9,
    threeYearReturn: 8.5,
    fiveYearReturn: 11.9,
    risk: 'Moderate-High',
    rating: 4,
    holdings: 'Large-cap blue-chip companies',
    fundManager: 'T. Rowe Price',
    region: 'US'
  },
  {
    id: '4',
    name: 'HDFC Midcap Opportunities Fund',
    ticker: 'HDFCMID',
    category: 'Mid Cap',
    nav: 98.45,
    aum: 32.5,
    expenseRatio: 1.45,
    oneYearReturn: 18.5,
    threeYearReturn: 15.2,
    fiveYearReturn: 14.8,
    risk: 'High',
    rating: 5,
    holdings: 'Indian mid-cap companies',
    fundManager: 'HDFC Mutual Fund',
    region: 'India'
  },
  {
    id: '5',
    name: 'Mirae Asset Emerging Bluechip',
    ticker: 'MAEBL',
    category: 'Large & Mid Cap',
    nav: 78.32,
    aum: 24.1,
    expenseRatio: 1.65,
    oneYearReturn: 20.7,
    threeYearReturn: 16.8,
    fiveYearReturn: 15.5,
    risk: 'High',
    rating: 5,
    holdings: 'Indian large & mid-cap companies',
    fundManager: 'Mirae Asset',
    region: 'India'
  },
  {
    id: '6',
    name: 'Vanguard Total Bond Market ETF',
    ticker: 'BND',
    category: 'Intermediate Core Bond',
    nav: 79.56,
    aum: 97.8,
    expenseRatio: 0.03,
    oneYearReturn: 1.2,
    threeYearReturn: 0.8,
    fiveYearReturn: 1.5,
    risk: 'Low',
    rating: 4,
    holdings: 'U.S. investment-grade bonds',
    fundManager: 'Vanguard',
    region: 'US'
  },
  {
    id: '7',
    name: 'Axis Bluechip Fund',
    ticker: 'AXISBLU',
    category: 'Large Cap',
    nav: 45.67,
    aum: 18.9,
    expenseRatio: 1.75,
    oneYearReturn: 15.3,
    threeYearReturn: 12.5,
    fiveYearReturn: 13.2,
    risk: 'Moderate',
    rating: 4,
    holdings: 'Indian large-cap companies',
    fundManager: 'Axis Mutual Fund',
    region: 'India'
  },
  {
    id: '8',
    name: 'SBI Small Cap Fund',
    ticker: 'SBISMALL',
    category: 'Small Cap',
    nav: 120.34,
    aum: 12.6,
    expenseRatio: 1.95,
    oneYearReturn: 25.8,
    threeYearReturn: 18.9,
    fiveYearReturn: 16.2,
    risk: 'Very High',
    rating: 5,
    holdings: 'Indian small-cap companies',
    fundManager: 'SBI Mutual Fund',
    region: 'India'
  }
];

// PPF (Public Provident Fund) Data
export const ppfData = {
  currentInterestRate: 7.1, // in percentage
  minimumDeposit: 500, // in INR
  maximumDeposit: 150000, // in INR per year
  lockInPeriod: 15, // in years
  loanEligibility: 'After completion of 3 years',
  taxBenefits: 'Tax deduction under Section 80C, tax-free interest and maturity amount',
  extensionPeriod: 5, // in years
  interestCalculation: 'Monthly basis but paid annually',
  partialWithdrawal: 'Allowed from the 7th financial year',
  historicalRates: [
    { year: '2023', rate: 7.1 },
    { year: '2022', rate: 7.1 },
    { year: '2021', rate: 7.1 },
    { year: '2020', rate: 7.9 },
    { year: '2019', rate: 8.0 },
    { year: '2018', rate: 7.6 },
    { year: '2017', rate: 7.8 },
    { year: '2016', rate: 8.1 },
    { year: '2015', rate: 8.7 },
    { year: '2014', rate: 8.7 }
  ]
};

// Precious Metals Data (Gold & Silver)
export const preciousMetalsData = [
  {
    id: 'gold',
    name: 'Gold',
    currentPrice: 2329.45, // in USD per ounce
    todayChange: 12.35,
    todayChangePercent: 0.53,
    weekChange: -15.20,
    weekChangePercent: -0.65,
    monthChange: 45.78,
    monthChangePercent: 2.01,
    yearChange: 320.45,
    yearChangePercent: 15.95,
    marketCap: 'N/A',
    volume24h: 148.5, // in billions USD
    historicalPrices: [
      { date: '2023-12-01', price: 2003.12 },
      { date: '2023-09-01', price: 1912.54 },
      { date: '2023-06-01', price: 1940.76 },
      { date: '2023-03-01', price: 1845.35 },
      { date: '2022-12-01', price: 1808.20 }
    ]
  },
  {
    id: 'silver',
    name: 'Silver',
    currentPrice: 27.48, // in USD per ounce
    todayChange: 0.32,
    todayChangePercent: 1.18,
    weekChange: 0.87,
    weekChangePercent: 3.27,
    monthChange: 2.35,
    monthChangePercent: 9.35,
    yearChange: 6.92,
    yearChangePercent: 33.68,
    marketCap: 'N/A',
    volume24h: 6.2, // in billions USD
    historicalPrices: [
      { date: '2023-12-01', price: 24.12 },
      { date: '2023-09-01', price: 22.54 },
      { date: '2023-06-01', price: 23.50 },
      { date: '2023-03-01', price: 21.05 },
      { date: '2022-12-01', price: 20.56 }
    ]
  }
];

// Cryptocurrency Data
export const cryptoData = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    currentPrice: 65432.18, // in USD
    todayChange: 1345.67,
    todayChangePercent: 2.10,
    marketCap: 1280000000000,
    volume24h: 32500000000,
    circulatingSupply: 19540000,
    allTimeHigh: 69000,
    allTimeHighDate: '2021-11-10',
    rank: 1,
    algorithm: 'SHA-256',
    category: 'Currency',
    historicalPrices: [
      { date: '2023-12-01', price: 37250.45 },
      { date: '2023-09-01', price: 25990.32 },
      { date: '2023-06-01', price: 29870.12 },
      { date: '2023-03-01', price: 23150.78 },
      { date: '2022-12-01', price: 16750.23 }
    ]
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    currentPrice: 3245.67, // in USD
    todayChange: 65.43,
    todayChangePercent: 2.05,
    marketCap: 389000000000,
    volume24h: 15600000000,
    circulatingSupply: 120250000,
    allTimeHigh: 4878.26,
    allTimeHighDate: '2021-11-10',
    rank: 2,
    algorithm: 'Ethash',
    category: 'Smart Contract Platform',
    historicalPrices: [
      { date: '2023-12-01', price: 2056.78 },
      { date: '2023-09-01', price: 1645.32 },
      { date: '2023-06-01', price: 1850.45 },
      { date: '2023-03-01', price: 1575.23 },
      { date: '2022-12-01', price: 1275.12 }
    ]
  },
  {
    id: 'binancecoin',
    name: 'Binance Coin',
    symbol: 'BNB',
    currentPrice: 608.25, // in USD
    todayChange: 10.45,
    todayChangePercent: 1.75,
    marketCap: 92000000000,
    volume24h: 1720000000,
    circulatingSupply: 151350000,
    allTimeHigh: 690.93,
    allTimeHighDate: '2021-05-10',
    rank: 3,
    algorithm: 'BEP-2',
    category: 'Exchange Token',
    historicalPrices: [
      { date: '2023-12-01', price: 452.34 },
      { date: '2023-09-01', price: 215.67 },
      { date: '2023-06-01', price: 305.23 },
      { date: '2023-03-01', price: 298.45 },
      { date: '2022-12-01', price: 250.78 }
    ]
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    currentPrice: 134.78, // in USD
    todayChange: 5.67,
    todayChangePercent: 4.38,
    marketCap: 58200000000,
    volume24h: 3450000000,
    circulatingSupply: 432000000,
    allTimeHigh: 259.96,
    allTimeHighDate: '2021-11-06',
    rank: 4,
    algorithm: 'Proof of History',
    category: 'Smart Contract Platform',
    historicalPrices: [
      { date: '2023-12-01', price: 105.23 },
      { date: '2023-09-01', price: 25.67 },
      { date: '2023-06-01', price: 23.45 },
      { date: '2023-03-01', price: 22.12 },
      { date: '2022-12-01', price: 12.45 }
    ]
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    currentPrice: 0.45, // in USD
    todayChange: 0.01,
    todayChangePercent: 2.27,
    marketCap: 15900000000,
    volume24h: 645000000,
    circulatingSupply: 35400000000,
    allTimeHigh: 3.10,
    allTimeHighDate: '2021-09-02',
    rank: 5,
    algorithm: 'Ouroboros',
    category: 'Smart Contract Platform',
    historicalPrices: [
      { date: '2023-12-01', price: 0.38 },
      { date: '2023-09-01', price: 0.25 },
      { date: '2023-06-01', price: 0.29 },
      { date: '2023-03-01', price: 0.32 },
      { date: '2022-12-01', price: 0.26 }
    ]
  }
]; 
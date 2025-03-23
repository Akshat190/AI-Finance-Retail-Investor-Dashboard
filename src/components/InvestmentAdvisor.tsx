import React, { useState, useEffect } from 'react';
import { 
  getInvestmentRecommendations, 
  assessMarketCondition,
  InvestmentRecommendation,
  MutualFund,
  FixedDeposit
} from '../utils/investmentAdvisor';
import { useGemini } from '../context/GeminiContext';

interface InvestmentAdvisorProps {
  portfolio?: any[];
}

const InvestmentAdvisor: React.FC<InvestmentAdvisorProps> = ({ portfolio = [] }) => {
  const [loading, setLoading] = useState(false);
  const [marketCondition, setMarketCondition] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [riskTolerance, setRiskTolerance] = useState<'Low' | 'Moderate' | 'High'>('Moderate');
  const [investmentHorizon, setInvestmentHorizon] = useState<'Short' | 'Medium' | 'Long'>('Medium');
  const [investmentGoals, setInvestmentGoals] = useState<string[]>(['Growth', 'Income']);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [assetAllocation, setAssetAllocation] = useState({ stocks: 60, bonds: 30, fd: 10 });
  const { apiKey } = useGemini();

  // Fetch market condition on component mount
  useEffect(() => {
    const fetchMarketCondition = async () => {
      try {
        const condition = await assessMarketCondition();
        setMarketCondition(condition);
      } catch (error) {
        console.error('Error fetching market condition:', error);
      }
    };
    
    fetchMarketCondition();
  }, []);

  // Generate recommendations
  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const recommendations = await getInvestmentRecommendations(
        apiKey,
        riskTolerance,
        investmentHorizon,
        investmentGoals,
        assetAllocation.stocks,
        assetAllocation.bonds,
        assetAllocation.fd,
        portfolio
      );
      setRecommendations(recommendations);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle asset allocation slider changes
  const handleAllocationChange = (type: 'stocks' | 'bonds' | 'fd', value: number) => {
    // Calculate the difference from previous value
    const diff = value - assetAllocation[type];
    
    // Create a new allocation object
    const newAllocation = { ...assetAllocation, [type]: value };
    
    // Adjust other allocations proportionally
    if (diff !== 0) {
      const otherTypes = ['stocks', 'bonds', 'fd'].filter(t => t !== type) as ('stocks' | 'bonds' | 'fd')[];
      const totalOther = otherTypes.reduce((sum, t) => sum + assetAllocation[t], 0);
      
      if (totalOther > 0) {
        // Distribute the difference proportionally
        otherTypes.forEach(t => {
          const proportion = assetAllocation[t] / totalOther;
          newAllocation[t] = Math.max(0, Math.round(newAllocation[t] - (diff * proportion)));
        });
        
        // Ensure total is 100%
        const newTotal = Object.values(newAllocation).reduce((sum, val) => sum + val, 0);
        if (newTotal !== 100) {
          const lastType = otherTypes[otherTypes.length - 1];
          newAllocation[lastType] += (100 - newTotal);
        }
      }
    }
    
    setAssetAllocation(newAllocation);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Investment Advisor</h2>
      
      {marketCondition ? (
        <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <h3 className="text-lg font-medium text-indigo-900 mb-2">Current Market Assessment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Market Condition</div>
              <div className={`text-lg font-medium ${
                marketCondition.condition === 'Bullish' ? 'text-green-600' : 
                marketCondition.condition === 'Bearish' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {marketCondition.condition}
              </div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Volatility</div>
              <div className={`text-lg font-medium ${
                marketCondition.volatility === 'Low' ? 'text-green-600' : 
                marketCondition.volatility === 'High' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {marketCondition.volatility}
              </div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm text-gray-500">Interest Rate Trend</div>
              <div className={`text-lg font-medium ${
                marketCondition.interestRateTrend === 'Stable' ? 'text-green-600' : 
                marketCondition.interestRateTrend === 'Rising' ? 'text-yellow-600' : 'text-blue-600'
              }`}>
                {marketCondition.interestRateTrend}
              </div>
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            {marketCondition.summary}
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Investment Profile</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Risk Tolerance
            </label>
            <div className="flex space-x-4">
              {['Low', 'Moderate', 'High'].map((risk) => (
                <button
                  key={risk}
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    riskTolerance === risk 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setRiskTolerance(risk as 'Low' | 'Moderate' | 'High')}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment Horizon
            </label>
            <div className="flex space-x-4">
              {[
                { value: 'Short', label: 'Short (< 3 years)' },
                { value: 'Medium', label: 'Medium (3-7 years)' },
                { value: 'Long', label: 'Long (> 7 years)' }
              ].map((horizon) => (
                <button
                  key={horizon.value}
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    investmentHorizon === horizon.value 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setInvestmentHorizon(horizon.value as 'Short' | 'Medium' | 'Long')}
                >
                  {horizon.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investment Goals
            </label>
            <div className="flex flex-wrap gap-2">
              {['Growth', 'Income', 'Preservation', 'Tax Benefits'].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    investmentGoals.includes(goal) 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => {
                    if (investmentGoals.includes(goal)) {
                      setInvestmentGoals(investmentGoals.filter(g => g !== goal));
                    } else {
                      setInvestmentGoals([...investmentGoals, goal]);
                    }
                  }}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <button
              type="button"
              className="text-indigo-600 text-sm font-medium flex items-center"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            >
              {showAdvancedOptions ? (
                <>
                  <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                  </svg>
                  Hide Advanced Options
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  Show Advanced Options
                </>
              )}
            </button>
          </div>
          
          {showAdvancedOptions && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-base font-medium text-gray-900 mb-3">Asset Allocation</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">
                      Stocks: {assetAllocation.stocks}%
                    </label>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={assetAllocation.stocks}
                    onChange={(e) => handleAllocationChange('stocks', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">
                      Bonds: {assetAllocation.bonds}%
                    </label>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={assetAllocation.bonds}
                    onChange={(e) => handleAllocationChange('bonds', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">
                      Fixed Deposits: {assetAllocation.fd}%
                    </label>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={assetAllocation.fd}
                    onChange={(e) => handleAllocationChange('fd', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="flex justify-center">
                  <div className="w-40 h-40 relative">
                    <div 
                      className="absolute inset-0 rounded-full overflow-hidden"
                      style={{ 
                        background: `conic-gradient(
                          #4f46e5 0% ${assetAllocation.stocks}%, 
                          #818cf8 ${assetAllocation.stocks}% ${assetAllocation.stocks + assetAllocation.bonds}%, 
                          #60a5fa ${assetAllocation.stocks + assetAllocation.bonds}% 100%
                        )` 
                      }}
                    ></div>
                    <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">100%</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-indigo-600 rounded-full mr-1"></div>
                    <span>Stocks</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-indigo-400 rounded-full mr-1"></div>
                    <span>Bonds</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mr-1"></div>
                    <span>FDs</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center mb-8">
        <button
          type="button"
          className={`px-6 py-3 rounded-md text-base font-medium text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          onClick={generateRecommendations}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Recommendations...
            </div>
          ) : (
            'Get Personalized Recommendations'
          )}
        </button>
      </div>
      
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Personalized Recommendations</h3>
          
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className={`px-4 py-3 ${
                  rec.type === 'MutualFund' 
                    ? 'bg-indigo-50 border-b border-indigo-100' 
                    : rec.type === 'FixedDeposit'
                      ? 'bg-blue-50 border-b border-blue-100'
                      : 'bg-green-50 border-b border-green-100'
                }`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        rec.type === 'MutualFund' 
                          ? 'bg-indigo-100 text-indigo-600' 
                          : rec.type === 'FixedDeposit'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-green-100 text-green-600'
                      }`}>
                        {rec.type === 'MutualFund' && (
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                          </svg>
                        )}
                        {rec.type === 'FixedDeposit' && (
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                          </svg>
                        )}
                        {rec.type === 'Stock' && (
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {rec.type === 'MutualFund' 
                            ? (rec.item as MutualFund).name
                            : rec.type === 'FixedDeposit'
                              ? `${(rec.item as FixedDeposit).bankName} Fixed Deposit`
                              : rec.item.name
                          }
                        </h4>
                        <div className="text-sm text-gray-500">
                          {rec.type === 'MutualFund' 
                            ? (rec.item as MutualFund).category
                            : rec.type === 'FixedDeposit'
                              ? `${(rec.item as FixedDeposit).minTenure}-${(rec.item as FixedDeposit).maxTenure} months`
                              : rec.item.sector
                          }
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-gray-900">
                        {rec.type === 'MutualFund' 
                          ? `${(rec.item as MutualFund).oneYearReturn.toFixed(2)}%`
                          : rec.type === 'FixedDeposit'
                            ? `${(rec.item as FixedDeposit).interestRate.toFixed(2)}%`
                            : `$${rec.item.price.toFixed(2)}`
                        }
                      </div>
                      <div className="text-sm text-gray-500">
                        {rec.type === 'MutualFund' 
                          ? '1-Year Return'
                          : rec.type === 'FixedDeposit'
                            ? 'Interest Rate'
                            : 'Current Price'
                        }
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-4">
                  <div className="mb-3">
                    <div className="flex items-center mb-1">
                      <div className="text-sm font-medium text-gray-500 mr-2">Recommendation Score:</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            rec.score >= 80 ? 'bg-green-500' : 
                            rec.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${rec.score}%` }}
                        ></div>
                      </div>
                      <div className="ml-2 text-sm font-medium text-gray-700">{rec.score}/100</div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{rec.reasoning}</p>
                  
                  {rec.type === 'MutualFund' && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500">Risk Level</div>
                        <div className={`text-sm font-medium ${
                          (rec.item as MutualFund).riskLevel === 'Low' ? 'text-green-600' :
                          (rec.item as MutualFund).riskLevel === 'Moderate' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {(rec.item as MutualFund).riskLevel}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500">Expense Ratio</div>
                        <div className="text-sm font-medium text-gray-900">
                          {(rec.item as MutualFund).expenseRatio.toFixed(2)}%
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500">3-Year Return</div>
                        <div className="text-sm font-medium text-gray-900">
                          {(rec.item as MutualFund).threeYearReturn.toFixed(2)}%
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500">5-Year Return</div>
                        <div className="text-sm font-medium text-gray-900">
                          {(rec.item as MutualFund).fiveYearReturn.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {rec.type === 'FixedDeposit' && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500">Minimum Amount</div>
                        <div className="text-sm font-medium text-gray-900">
                          ₹{(rec.item as FixedDeposit).minAmount.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500">Compounding</div>
                        <div className="text-sm font-medium text-gray-900">
                          {(rec.item as FixedDeposit).compounding}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500">Senior Citizen Bonus</div>
                        <div className="text-sm font-medium text-gray-900">
                          +{(rec.item as FixedDeposit).seniorCitizenBonus.toFixed(2)}%
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-xs text-gray-500">Premature Withdrawal</div>
                        <div className="text-sm font-medium text-gray-900">
                          {(rec.item as FixedDeposit).prematureWithdrawal ? 'Allowed' : 'Not Allowed'}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      More Details
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Invest Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentAdvisor; 
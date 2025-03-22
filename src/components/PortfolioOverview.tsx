import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, AlertTriangle } from 'lucide-react';
import type { PortfolioWithHoldings } from '../types/database';

interface PortfolioOverviewProps {
  portfolio: PortfolioWithHoldings;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ portfolio }) => {
  const totalValue = portfolio.holdings.reduce(
    (sum, holding) => sum + holding.shares * holding.average_price,
    0
  );

  const mockPerformanceData = [
    { date: '2024-01', value: totalValue * 0.95 },
    { date: '2024-02', value: totalValue * 0.98 },
    { date: '2024-03', value: totalValue * 0.97 },
    { date: '2024-04', value: totalValue * 1.02 },
    { date: '2024-05', value: totalValue },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{portfolio.name}</h2>
        <div className="flex items-center text-green-500">
          <TrendingUp className="h-5 w-5 mr-2" />
          <span className="font-semibold">+2.5% Today</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-gray-500">Total Value</div>
            <DollarSign className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            ${totalValue.toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-gray-500">Daily Change</div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-green-500">
            +$1,234.56
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="text-gray-500">Risk Level</div>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-yellow-500">
            Moderate
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4F46E5"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Holdings</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Shares
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {portfolio.holdings.map((holding) => (
                <tr key={holding.id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-indigo-600">
                    {holding.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {holding.shares}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    ${holding.average_price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    ${(holding.shares * holding.average_price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      2.5%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
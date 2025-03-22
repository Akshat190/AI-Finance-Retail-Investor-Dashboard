import React from 'react';
import { Brain, TrendingUp, AlertTriangle, BarChart2 } from 'lucide-react';
import type { AISignal } from '../types/database';

interface AIInsightsProps {
  signals: AISignal[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ signals }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {signals.map((signal) => (
          <div
            key={signal.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">
                {signal.symbol}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  signal.recommendation === 'Buy'
                    ? 'bg-green-100 text-green-800'
                    : signal.recommendation === 'Sell'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {signal.recommendation}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Signal Type</span>
                <span className="font-medium text-gray-900">{signal.signal_type}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Confidence</span>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${signal.confidence * 100}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-900">
                    {(signal.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Risk Level</span>
                <span
                  className={`font-medium ${
                    signal.risk_level === 'High'
                      ? 'text-red-600'
                      : signal.risk_level === 'Medium'
                      ? 'text-yellow-600'
                      : 'text-green-600'
                  }`}
                >
                  {signal.risk_level}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
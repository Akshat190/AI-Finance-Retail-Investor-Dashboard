import React from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, RefreshCw } from 'lucide-react';
import type { AIPrediction } from '../lib/aiPredictions';

interface AIPredictionsProps {
  predictions: AIPrediction[];
  onRefresh: () => void;
  loading: boolean;
}

export const AIPredictions: React.FC<AIPredictionsProps> = ({
  predictions,
  onRefresh,
  loading
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">AI Return Predictions</h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {predictions.map((prediction) => (
          <div
            key={prediction.symbol}
            className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-900">
                {prediction.symbol}
              </span>
              <div className={`flex items-center ${
                prediction.predictedReturn >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {prediction.predictedReturn >= 0 ? (
                  <TrendingUp className="h-5 w-5 mr-1" />
                ) : (
                  <TrendingDown className="h-5 w-5 mr-1" />
                )}
                <span className="font-semibold">
                  {prediction.predictedReturn >= 0 ? '+' : ''}
                  {prediction.predictedReturn.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Timeframe</span>
                <span className="font-medium text-gray-900">{prediction.timeframe}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Confidence</span>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${prediction.confidence * 100}%` }}
                    />
                  </div>
                  <span className="font-medium text-gray-900">
                    {(prediction.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Risk Level</span>
                <span className={`font-medium ${
                  prediction.riskLevel === 'High'
                    ? 'text-red-600'
                    : prediction.riskLevel === 'Medium'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}>
                  {prediction.riskLevel}
                </span>
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium text-gray-700">Analysis:</p>
                <p className="mt-1">{prediction.reasoning}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
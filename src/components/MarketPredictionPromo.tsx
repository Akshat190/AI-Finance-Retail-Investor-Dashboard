import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MarketPredictionPromoProps {
  className?: string;
}

export const MarketPredictionPromo: React.FC<MarketPredictionPromoProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  
  return (
    <div className={`bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-5 mb-8 ${className}`}>
      <div className="flex items-start">
        <TrendingUp className="h-10 w-10 text-indigo-500 mr-4" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Market Predictions
          </h3>
          <p className="text-gray-600 mb-4">
            Get AI-powered market forecasts and price predictions to inform your investment decisions.
            Data refreshes every 6 hours to provide you with up-to-date insights.
          </p>
          <button
            onClick={() => navigate('/market-predictions')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            View Predictions
          </button>
        </div>
      </div>
    </div>
  );
}; 
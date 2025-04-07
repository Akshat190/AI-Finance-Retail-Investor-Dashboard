import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarketPredictions from './MarketPredictions';
import AIMarketPredictionService from '../services/AIMarketPredictionService';

// Mock the AIMarketPredictionService
jest.mock('../services/AIMarketPredictionService', () => ({
  __esModule: true,
  default: {
    generateMarketPrediction: jest.fn(),
  },
}));

describe('MarketPredictions Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockMarketPrediction = {
    timeframe: 'week',
    marketOutlook: 'bullish',
    confidenceScore: 75,
    keyDrivers: ['Strong earnings reports', 'Positive economic data', 'Fed policy'],
    sectorPredictions: [
      {
        sector: 'Technology',
        outlook: 'bullish',
        potentialReturn: '3% to 5%',
        rationale: 'Tech sector continues to show growth',
        keyStocks: ['AAPL', 'MSFT']
      },
      {
        sector: 'Healthcare',
        outlook: 'neutral',
        potentialReturn: '0% to 2%',
        rationale: 'Mixed earnings and regulatory concerns',
        keyStocks: ['JNJ', 'PFE']
      }
    ],
    majorIndexPredictions: [
      {
        index: 'S&P 500',
        currentValue: 4500,
        predictedRange: {
          low: 4450,
          high: 4650
        },
        confidence: 80,
        keyDrivers: ['Earnings momentum', 'Economic growth']
      }
    ],
    analysis: 'Market outlook is positive for the next week based on strong earnings',
    createdAt: new Date()
  };

  test('renders initial loading state', () => {
    // Mock the service to return a promise that doesn't resolve yet
    (AIMarketPredictionService.generateMarketPrediction as jest.Mock).mockReturnValue(
      new Promise(() => {})
    );

    render(<MarketPredictions />);
    
    // Check that the loading indicator is shown
    expect(screen.getByText(/generating market predictions/i)).toBeInTheDocument();
  });

  test('renders predictions when data is loaded', async () => {
    // Mock the service to return our mock prediction
    (AIMarketPredictionService.generateMarketPrediction as jest.Mock).mockResolvedValue(
      mockMarketPrediction
    );

    render(<MarketPredictions />);
    
    // Wait for the prediction data to be displayed
    await waitFor(() => {
      expect(screen.getByText(/next week outlook/i)).toBeInTheDocument();
      expect(screen.getByText(/bullish/i)).toBeInTheDocument();
      expect(screen.getByText(/75% confidence/i)).toBeInTheDocument();
    });
    
    // Check that sector predictions are rendered
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Healthcare')).toBeInTheDocument();
    
    // Check that major indices are rendered
    expect(screen.getByText('S&P 500')).toBeInTheDocument();
  });

  test('changes timeframe when selector is changed', async () => {
    // Mock the service to return our mock prediction for both calls
    (AIMarketPredictionService.generateMarketPrediction as jest.Mock).mockResolvedValue(
      mockMarketPrediction
    );

    render(<MarketPredictions />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText(/next week outlook/i)).toBeInTheDocument();
    });
    
    // Change the timeframe to 'month'
    const timeframeSelector = screen.getByRole('combobox');
    fireEvent.change(timeframeSelector, { target: { value: 'month' } });
    
    // Verify that the AI service was called again with the new timeframe
    expect(AIMarketPredictionService.generateMarketPrediction).toHaveBeenCalledWith('month');
  });

  test('displays error message when API fails', async () => {
    // Mock the service to return an error
    (AIMarketPredictionService.generateMarketPrediction as jest.Mock).mockRejectedValue(
      new Error('API error')
    );

    render(<MarketPredictions />);
    
    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to load market predictions/i)).toBeInTheDocument();
    });
  });
}); 
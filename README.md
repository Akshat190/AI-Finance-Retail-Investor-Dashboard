# AI Investor Dashboard

A modern, AI-powered investment dashboard that provides market analysis, portfolio management, and investment recommendations. Built with React, TypeScript, and powered by AI models.

## Features

### AI-Powered Market Analysis
- Real-time market predictions using Google Gemini and OpenRouter AI
- Sector-wise analysis and performance tracking
- Stock price forecasting with confidence levels
- Investment recommendations based on market trends
- Risk assessment and portfolio optimization

### Portfolio Management
- Track investments with real-time price updates
- Performance analytics and historical data
- Risk assessment tools
- Transaction history with detailed records
- Buy/Sell functionality with quick actions

### Stock Screener
- Advanced filtering options by sector, country, and performance
- Real-time market data integration
- Custom watchlists
- Technical indicators and analysis
- Quick search and comparison tools

### Investment Advisor
- Personalized investment strategies
- Risk tolerance assessment
- Portfolio optimization suggestions
- Market insights and trends
- AI-powered analysis of investment opportunities

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Chart.js/Recharts for data visualization
- React Bootstrap for UI components
- React Hot Toast for notifications

### Backend
- Supabase for database and authentication
- Google Gemini AI for market analysis
- OpenRouter AI for additional AI capabilities
- RESTful APIs for market data
- Real-time updates and synchronization

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn or npm
- Supabase account
- Google Gemini API key
- OpenRouter API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-investor-dashboard.git
   cd ai-investor-dashboard
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   ```

4. Start the development server:
   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── components/     # Reusable UI components
│   ├── Navigation.tsx
│   ├── PortfolioManager.tsx
│   ├── PortfolioAnalysis.tsx
│   └── ...
├── context/        # React context providers
│   └── AuthContext.tsx
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and configurations
│   ├── supabase.ts
│   └── aiPredictions.ts
├── pages/          # Page components
│   ├── Portfolio.tsx
│   ├── Screener.tsx
│   └── ...
├── services/       # API and service integrations
└── types/          # TypeScript type definitions
```

## Key Features in Detail

### Portfolio Management
- Real-time stock price updates
- Buy/Sell functionality with quick actions
- Portfolio performance tracking
- Transaction history
- Risk assessment tools

### AI Analysis
- Market trend predictions
- Stock price forecasting
- Sector performance analysis
- Investment recommendations
- Risk level assessment

### Stock Screener
- Advanced filtering options
- Real-time market data
- Technical indicators
- Custom watchlists
- Quick search functionality

## API Integration

### Market Data
- Real-time stock prices
- Historical data
- Company profiles
- Market trends
- Sector performance

### AI Services
- Google Gemini for market analysis
- OpenRouter for additional AI capabilities
- Custom prediction models
- Risk assessment algorithms

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Guidelines

### Code Style
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Write meaningful comments
- Follow the project's ESLint configuration

### Testing
- Write unit tests for components
- Test API integrations
- Verify AI predictions
- Check responsive design
- Test user interactions

## Deployment

### Production Build
```bash
yarn build
# or
npm run build
```

### Preview
```bash
yarn preview
# or
npm run preview
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [OpenRouter](https://openrouter.ai/) for additional AI models
- [React](https://reactjs.org/) and the React community
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Chart.js](https://www.chartjs.org/) for data visualization
- [React Bootstrap](https://react-bootstrap.github.io/) for UI components 
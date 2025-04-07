import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { Screener } from './pages/Screener';
import { Profile } from './pages/Profile';
import { Loader2 } from 'lucide-react';
import Investments from './pages/Investments';
// import Settings from './pages/Settings';
import Chat from './pages/Chat';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import AIDemo from './pages/AIDemo';
import AITester from './pages/AITester';
import InvestmentAdvisor from './pages/InvestmentAdvisor';
import MarketPredictionsPage from './pages/MarketPredictionsPage';

// Simple Home component
// const Home = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
//     <h1 className="text-4xl font-bold text-indigo-600 mb-6">AI Investor</h1>
//     <p className="text-xl text-gray-700 max-w-2xl text-center mb-8">
//       Your intelligent assistant for making smarter investment decisions
//     </p>
//     <div className="flex gap-4">
//       <a 
//         href="/login" 
//         className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//       >
//         Log In
//       </a>
//       <a 
//         href="/register" 
//         className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
//       >
//         Register
//       </a>
//     </div>
//   </div>
// );
  
// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navigation />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/portfolio" element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          } />
          <Route path="/investment-advisor" element={
            <ProtectedRoute>
              <InvestmentAdvisor />
            </ProtectedRoute>
          } />
          <Route path="/market-predictions" element={
            <ProtectedRoute>
              <MarketPredictionsPage />
            </ProtectedRoute>
          } />
          <Route path="/screener" element={<Screener />} />
          <Route path="/investments" element={
            <ProtectedRoute>
              <Investments />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          {/* <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } /> */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/ai-demo" element={
            <ProtectedRoute>
              <AIDemo />
            </ProtectedRoute>
          } />
          <Route path="/ai-tester" element={
            <ProtectedRoute>
              <AITester />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
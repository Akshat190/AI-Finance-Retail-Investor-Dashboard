import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Loader2, UserPlus, Mail, Lock, User, AlertCircle, CheckCircle2, BarChart2 } from 'lucide-react';
import { RiskProfile } from '../types/AITypes';

export const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [riskProfile, setRiskProfile] = useState<RiskProfile>('moderate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: fullName,
            risk_profile: riskProfile,
            updated_at: new Date().toISOString(),
          });
          
        if (profileError) throw profileError;
        
        // Create user settings record with default values
        const { error: settingsError } = await supabase
          .from('user_settings')
          .upsert({
            user_id: data.user.id,
            use_default_key: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          
        if (settingsError) throw settingsError;
        
        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Registration form */}
      <div className="flex flex-col justify-center items-center p-8 md:w-1/2 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600">
              Join AI Investor and start making smarter investment decisions
            </p>
          </div>
          
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 border-l-4 border-red-500">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {error}
                  </h3>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleRegister}>
            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="full-name"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Minimum 6 characters"
                  minLength={6}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters long
              </p>
            </div>
            
            <div>
              <label htmlFor="risk-profile" className="block text-sm font-medium text-gray-700 mb-1">
                Risk Profile
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BarChart2 className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <select
                  id="risk-profile"
                  name="riskProfile"
                  value={riskProfile}
                  onChange={(e) => setRiskProfile(e.target.value as RiskProfile)}
                  className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                This helps us provide personalized investment recommendations
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 shadow-sm transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" aria-hidden="true" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" aria-hidden="true" />
                    Create account
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right side - Features and benefits */}
      <div className="hidden md:flex md:w-1/2 bg-indigo-600 text-white flex-col justify-center items-center p-12">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">Join AI Investor</h1>
          <p className="text-xl mb-8">
            Create your account and get access to all these features:
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-indigo-300 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">AI-Powered Portfolio Analysis</h3>
                <p className="text-white/80">Get insights into your portfolio performance and risk exposure</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-indigo-300 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">Investment Recommendations</h3>
                <p className="text-white/80">Receive personalized investment suggestions based on your goals</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-indigo-300 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">Financial AI Chatbot</h3>
                <p className="text-white/80">Ask questions and get instant financial advice from our AI assistant</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-indigo-300 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">Market Trend Analysis</h3>
                <p className="text-white/80">Stay ahead with AI-powered market trend predictions and insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
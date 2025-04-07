import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Brain, TrendingUp, MessageSquare, Shield, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section with Animated Background */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute animate-[pulse_8s_ease-in-out_infinite] opacity-50 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 blur-3xl w-full h-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full border-2 border-white/20 text-white mb-6 backdrop-blur-md">
                <span className="flex h-2 w-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                <span className="text-sm font-medium">AI-Powered Investment Platform</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="block mb-2">Invest Smarter</span>
                <span className="relative">
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-400">
                    with AI Insights
                  </span>
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 to-pink-400 transform translate-y-2"></span>
                </span>
              </h1>
              <p className="mt-8 text-xl text-white/90 leading-relaxed">
                AI Investor combines cutting-edge artificial intelligence with financial expertise to help you make better investment decisions, analyze market trends, and optimize your portfolio in real-time.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                  <Link
                    to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold text-lg hover:bg-gray-50 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ease-in-out duration-150"
                  >
                  Start Free Trial
                  </Link>
                  <Link
                    to="/login"
                  className="w-full sm:w-auto mt-3 sm:mt-0 px-8 py-4 rounded-xl border-2 border-white/30 backdrop-blur-sm text-white font-bold text-lg hover:bg-white/10 transition"
                  >
                  Sign In
                  </Link>
              </div>
              <div className="mt-12 flex items-center justify-center lg:justify-start space-x-6">
                <div className="flex -space-x-2">
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
                  <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/46.jpg" alt="User" />
                </div>
                <div className="text-white text-sm">
                  <span className="font-bold">2,500+</span> investors joined this week
                </div>
              </div>
            </div>
            <div className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-6">
              <div className="relative mx-auto w-full rounded-2xl shadow-2xl lg:max-w-md overflow-hidden border border-white/20 backdrop-blur-sm bg-white/10">
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-white/80 text-xs font-medium">AI Portfolio Analysis</div>
                </div>
                <img
                  className="w-full"
                  src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Trading dashboard preview"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-indigo-600">93%</div>
              <div className="mt-2 text-sm text-gray-500 text-center">Users report better investment decisions</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-indigo-600">24/7</div>
              <div className="mt-2 text-sm text-gray-500 text-center">AI-powered market monitoring</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-indigo-600">10k+</div>
              <div className="mt-2 text-sm text-gray-500 text-center">Active investors using our platform</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-indigo-600">14.3%</div>
              <div className="mt-2 text-sm text-gray-500 text-center">Average portfolio performance improvement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Everything you need to invest with confidence
            </p>
            <p className="mt-6 max-w-2xl text-xl text-gray-500 mx-auto">
              Our platform combines powerful analytics, AI insights, and user-friendly tools to help you make informed investment decisions.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500 group-hover:duration-200"></div>
                <div className="relative bg-white p-8 rounded-xl ring-1 ring-gray-900/5 shadow-md h-full flex flex-col">
                  <div className="bg-indigo-50 rounded-lg p-4 inline-block">
                    <Brain className="h-7 w-7 text-indigo-600" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">AI-Powered Insights</h3>
                  <p className="mt-4 text-base text-gray-500 flex-grow">
                    Get personalized investment recommendations and market predictions powered by state-of-the-art AI models with detailed analysis of risk and potential returns.
                  </p>
                  <div className="mt-6">
                    <ul className="space-y-3">
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Stock performance predictions</span>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Market trend identification</span>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Personalized investment suggestions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500 group-hover:duration-200"></div>
                <div className="relative bg-white p-8 rounded-xl ring-1 ring-gray-900/5 shadow-md h-full flex flex-col">
                  <div className="bg-blue-50 rounded-lg p-4 inline-block">
                    <BarChart2 className="h-7 w-7 text-blue-600" />
                    </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">Portfolio Analytics</h3>
                  <p className="mt-4 text-base text-gray-500 flex-grow">
                    Track and analyze your investments with real-time data, advanced performance metrics, and visualization tools that help you understand your portfolio at a glance.
                  </p>
                  <div className="mt-6">
                    <ul className="space-y-3">
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Real-time performance tracking</span>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Risk assessment and diversification</span>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Interactive charting and reports</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500 group-hover:duration-200"></div>
                <div className="relative bg-white p-8 rounded-xl ring-1 ring-gray-900/5 shadow-md h-full flex flex-col">
                  <div className="bg-green-50 rounded-lg p-4 inline-block">
                    <MessageSquare className="h-7 w-7 text-green-600" />
                    </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">AI Financial Assistant</h3>
                  <p className="mt-4 text-base text-gray-500 flex-grow">
                    Chat with our AI assistant to get answers to financial questions, investment advice, and market insights in plain language without financial jargon.
                  </p>
                  <div className="mt-6">
                    <ul className="space-y-3">
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">24/7 financial advice</span>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Plain language explanations</span>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Custom research on demand</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500 group-hover:duration-200"></div>
                <div className="relative bg-white p-8 rounded-xl ring-1 ring-gray-900/5 shadow-md h-full flex flex-col">
                  <div className="bg-amber-50 rounded-lg p-4 inline-block">
                    <TrendingUp className="h-7 w-7 text-amber-600" />
                    </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">Market Trends</h3>
                  <p className="mt-4 text-base text-gray-500 flex-grow">
                    Stay updated with the latest market trends with AI-generated predictions on future movements based on historical data and current events.
                  </p>
                  <div className="mt-6">
                    <ul className="space-y-3">
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Trend identification algorithms</span>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Sector rotation analysis</span>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Macro economic indicators</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500 group-hover:duration-200"></div>
                <div className="relative bg-white p-8 rounded-xl ring-1 ring-gray-900/5 shadow-md h-full flex flex-col">
                  <div className="bg-red-50 rounded-lg p-4 inline-block">
                    <Shield className="h-7 w-7 text-red-600" />
                    </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">Risk Assessment</h3>
                  <p className="mt-4 text-base text-gray-500 flex-grow">
                    Understand the risk profile of your investments with detailed risk evaluations and get recommendations tailored to your specific risk tolerance.
                  </p>
                  <div className="mt-6">
                    <ul className="space-y-3">
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Personalized risk scoring</span>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Diversification recommendations</span>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Volatility forecasting</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-500 group-hover:duration-200"></div>
                <div className="relative bg-white p-8 rounded-xl ring-1 ring-gray-900/5 shadow-md h-full flex flex-col">
                  <div className="bg-violet-50 rounded-lg p-4 inline-block">
                    <Wallet className="h-7 w-7 text-violet-600" />
                    </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">Demo Trading</h3>
                  <p className="mt-4 text-base text-gray-500 flex-grow">
                    Practice investment strategies without risking real money with our fully-featured demo trading environment complete with real-market data.
                  </p>
                  <div className="mt-6">
                    <ul className="space-y-3">
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-violet-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Risk-free practice environment</span>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-violet-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Real market data</span>
                      </li>
                      <li className="flex">
                        <CheckCircle2 className="h-5 w-5 text-violet-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500">Performance tracking & analysis</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">How It Works</h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Get started in three simple steps
            </p>
            <p className="mt-6 max-w-2xl text-xl text-gray-500 mx-auto">
              Our platform is designed to be intuitive and easy to use, even if you're new to investing or AI technology.
            </p>
          </div>
          
          <div className="mt-20">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              <div className="relative">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-indigo-500 text-white text-2xl font-bold mb-4">1</div>
                <h3 className="text-xl font-medium text-gray-900">Create your account</h3>
                <p className="mt-4 text-base text-gray-500">
                  Sign up in minutes with just your email address. No credit card required to get started with our basic plan.
                </p>
                <div className="absolute top-0 right-0 md:right-8 -mt-2 md:mr-8 hidden lg:block">
                  <svg className="h-12 w-24 text-gray-300" fill="none" viewBox="0 0 120 30" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M0 15h100m0 0l-15-10m15 10l-15 10" />
                  </svg>
                </div>
              </div>
              
              <div className="relative mt-10 lg:mt-0">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-indigo-500 text-white text-2xl font-bold mb-4">2</div>
                <h3 className="text-xl font-medium text-gray-900">Connect your investments</h3>
                <p className="mt-4 text-base text-gray-500">
                  Link your existing portfolio or start a new one. Our secure API connections protect your financial data.
                </p>
                <div className="absolute top-0 right-0 md:right-8 -mt-2 hidden lg:block">
                  <svg className="h-12 w-24 text-gray-300" fill="none" viewBox="0 0 120 30" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M0 15h100m0 0l-15-10m15 10l-15 10" />
                  </svg>
                </div>
              </div>
              
              <div className="mt-10 lg:mt-0">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-indigo-500 text-white text-2xl font-bold mb-4">3</div>
                <h3 className="text-xl font-medium text-gray-900">Unlock AI insights</h3>
                <p className="mt-4 text-base text-gray-500">
                  Our AI analyzes your portfolio and market conditions to provide personalized recommendations and insights.
                </p>
              </div>
            </div>
            
            <div className="mt-14 flex justify-center">
              <Link to="/register" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Our Technology</h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Built with modern web technologies
            </p>
            <p className="mt-6 max-w-2xl text-xl text-gray-500 mx-auto">
              We leverage cutting-edge tools and frameworks to deliver a fast, responsive, and intelligent investment platform that works seamlessly across all devices.
            </p>
          </div>
          
          <div className="mt-20">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {/* React */}
              <div className="group w-28 flex flex-col items-center transition-all duration-300 transform hover:scale-110">
                <div className="bg-white p-4 rounded-full shadow-md h-20 w-20 flex items-center justify-center group-hover:shadow-lg">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-blue-500">
                    <path d="M12 9.861a2.139 2.139 0 100 4.278 2.139 2.139 0 100-4.278zm-5.992 6.394l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 001.363 3.578l.101.213-.101.213a23.307 23.307 0 00-1.363 3.578l-.133.467zM5.317 8.95c-2.674.751-4.315 1.9-4.315 3.046 0 1.145 1.641 2.294 4.315 3.046a24.95 24.95 0 011.182-3.046A24.752 24.752 0 015.317 8.95zm12.675 7.305l-.133-.469a23.357 23.357 0 00-1.364-3.577l-.101-.213.101-.213a23.42 23.42 0 001.364-3.578l.133-.468.473.119c3.517.889 5.535 2.398 5.535 4.14s-2.018 3.25-5.535 4.139l-.473.12zm-.491-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 01-1.182 3.046zM5.31 8.945l-.133-.467C4.188 4.992 4.488 2.494 6 1.622c1.483-.856 3.864.155 6.359 2.716l.34.349-.34.349a23.552 23.552 0 00-2.422 2.967l-.135.193-.235.02a23.657 23.657 0 00-3.785.61l-.472.119zm1.896-6.63c-.268 0-.505.058-.705.173-.994.573-1.17 2.565-.485 5.253a25.122 25.122 0 013.233-.501 24.847 24.847 0 012.052-2.544c-1.56-1.519-3.037-2.381-4.095-2.381zm9.589 20.362c-.001 0-.001 0 0 0-1.425 0-3.255-1.073-5.154-3.023l-.34-.349.34-.349a23.53 23.53 0 002.421-2.968l.135-.193.234-.02a23.63 23.63 0 003.787-.609l.472-.119.134.468c.987 3.484.688 5.983-.824 6.854a2.38 2.38 0 01-1.205.308zm-4.096-3.381c1.56 1.519 3.037 2.381 4.095 2.381h.001c.267 0 .505-.058.704-.173.994-.573 1.171-2.566.485-5.254a25.02 25.02 0 01-3.234.501 24.674 24.674 0 01-2.051 2.545zM18.69 8.945l-.472-.119a23.479 23.479 0 00-3.787-.61l-.234-.02-.135-.193a23.414 23.414 0 00-2.421-2.967l-.34-.349.34-.349C14.135 1.778 16.515.767 18 1.622c1.512.872 1.812 3.37.824 6.855l-.134.468zM14.75 7.24c1.142.104 2.227.273 3.234.501.686-2.688.509-4.68-.485-5.253-.988-.571-2.845.304-4.8 2.208A24.849 24.849 0 0114.75 7.24zM7.206 22.677A2.38 2.38 0 016 22.369c-1.512-.871-1.812-3.369-.823-6.854l.132-.468.472.119c1.155.291 2.429.496 3.785.609l.235.02.134.193a23.596 23.596 0 002.422 2.968l.34.349-.34.349c-1.898 1.95-3.728 3.023-5.151 3.023zm-1.19-6.427c-.686 2.688-.509 4.681.485 5.254.987.563 2.843-.305 4.8-2.208a24.998 24.998 0 01-2.052-2.545 24.976 24.976 0 01-3.233-.501zm5.984.628c-.823 0-1.669-.036-2.516-.106l-.235-.02-.135-.193a30.388 30.388 0 01-1.35-2.122 30.354 30.354 0 01-1.166-2.228l-.1-.213.1-.213a30.3 30.3 0 011.166-2.228c.414-.749.885-1.472 1.35-2.122l.135-.193.235-.02a29.785 29.785 0 015.033 0l.234.02.134.193a30.006 30.006 0 012.517 4.35l.101.213-.101.213a29.6 29.6 0 01-2.517 4.35l-.134.193-.234.02c-.847.07-1.694.106-2.517.106zm-2.197-1.084c1.48.111 2.914.111 4.395 0a29.006 29.006 0 002.196-3.798 28.585 28.585 0 00-2.197-3.798 29.031 29.031 0 00-4.394 0 28.477 28.477 0 00-2.197 3.798 29.114 29.114 0 002.197 3.798z" />
                  </svg>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-md font-medium text-gray-900">React</h3>
                  <p className="text-xs text-gray-500 mt-1">UI Components</p>
                </div>
              </div>
              
              {/* TypeScript */}
              <div className="group w-28 flex flex-col items-center transition-all duration-300 transform hover:scale-110">
                <div className="bg-white p-4 rounded-full shadow-md h-20 w-20 flex items-center justify-center group-hover:shadow-lg">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-blue-600">
                    <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
                  </svg>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-md font-medium text-gray-900">TypeScript</h3>
                  <p className="text-xs text-gray-500 mt-1">Type Safety</p>
                </div>
              </div>
              
              {/* Tailwind CSS */}
              <div className="group w-28 flex flex-col items-center transition-all duration-300 transform hover:scale-110">
                <div className="bg-white p-4 rounded-full shadow-md h-20 w-20 flex items-center justify-center group-hover:shadow-lg">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-cyan-500">
                    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
                  </svg>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-md font-medium text-gray-900">Tailwind CSS</h3>
                  <p className="text-xs text-gray-500 mt-1">Responsive Design</p>
                </div>
              </div>
              
              {/* Web Sockets */}
              <div className="group w-28 flex flex-col items-center transition-all duration-300 transform hover:scale-110">
                <div className="bg-white p-4 rounded-full shadow-md h-20 w-20 flex items-center justify-center group-hover:shadow-lg">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-12 w-12 text-purple-500" strokeWidth="2">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-md font-medium text-gray-900">WebSockets</h3>
                  <p className="text-xs text-gray-500 mt-1">Real-time Data</p>
                </div>
              </div>
              
              {/* Supabase */}
              <div className="group w-28 flex flex-col items-center transition-all duration-300 transform hover:scale-110">
                <div className="bg-white p-4 rounded-full shadow-md h-20 w-20 flex items-center justify-center group-hover:shadow-lg">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-green-600">
                    <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424l-.401.562a1.04 1.04 0 0 0 .836 1.659H12v8.959a.396.396 0 0 0 .716.233l9.081-12.261.401-.562a1.04 1.04 0 0 0-.836-1.66z" />
                  </svg>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-md font-medium text-gray-900">Supabase</h3>
                  <p className="text-xs text-gray-500 mt-1">Database & Auth</p>
                </div>
              </div>
              
              {/* Google Gemini */}
              <div className="group w-28 flex flex-col items-center transition-all duration-300 transform hover:scale-110">
                <div className="bg-white p-4 rounded-full shadow-md h-20 w-20 flex items-center justify-center group-hover:shadow-lg">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-purple-600">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-md font-medium text-gray-900">Google Gemini</h3>
                  <p className="text-xs text-gray-500 mt-1">AI Integration</p>
                </div>
              </div>
              
              {/* Progressive Web App */}
              <div className="group w-28 flex flex-col items-center transition-all duration-300 transform hover:scale-110">
                <div className="bg-white p-4 rounded-full shadow-md h-20 w-20 flex items-center justify-center group-hover:shadow-lg">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-indigo-600">
                    <path d="M17.5 12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11m-15-11a1.5 1.5 0 0 0-1.5 1.5v16A1.5 1.5 0 0 0 2.5 20H10c-.54-1.36-.5-2.77 0-4H5.5v-1.5H11a5.5 5.5 0 0 1 10.97-.7c.22-.25.38-.55.53-.8v-1.5h-18V5h18V3.5A1.5 1.5 0 0 0 21 2z" />
                  </svg>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-md font-medium text-gray-900">PWA</h3>
                  <p className="text-xs text-gray-500 mt-1">Mobile-friendly</p>
                </div>
              </div>
              
              {/* Vite */}
              <div className="group w-28 flex flex-col items-center transition-all duration-300 transform hover:scale-110">
                <div className="bg-white p-4 rounded-full shadow-md h-20 w-20 flex items-center justify-center group-hover:shadow-lg">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-12 w-12 text-yellow-500">
                    <path d="M12.0001 0L23.2731 3.39L21.8321 19.01L12.0001 24L2.16805 19.01L0.727051 3.39L12.0001 0Z" />
                    <path d="M16.0131 12.0561L19.4131 7.5921H16.1741L13.9421 10.9581L11.2841 7.5921H7.76305L11.9421 13.6581L8.31305 18.4081H11.5521L14.0131 14.7061L16.9421 18.4081H20.4631L16.0131 12.0561Z" fill="white" />
                    <path d="M7.51806 14.0001V7.59206H4.43806V14.0001C4.43806 14.5161 4.28306 14.9401 3.97306 15.2761C3.66306 15.6121 3.25806 15.7801 2.75806 15.7801C2.25806 15.7801 1.85306 15.6121 1.54306 15.2761C1.23306 14.9401 1.07806 14.5161 1.07806 14.0001V7.59206H4.15806V5.00006H1.07806V2.42406H4.43806V5.00006C4.43806 5.51606 4.59306 5.94006 4.90306 6.27606C5.21306 6.61206 5.61806 6.78006 6.11806 6.78006C6.61806 6.78006 7.02306 6.61206 7.33306 6.27606C7.64306 5.94006 7.79806 5.51606 7.79806 5.00006V2.42406H10.8781V14.0001C10.8781 15.5441 10.4131 16.8001 9.48306 17.7681C8.55306 18.7361 7.34306 19.2201 5.85306 19.2201C4.36306 19.2201 3.15306 18.7361 2.22306 17.7681C1.29306 16.8001 0.828064 15.5441 0.828064 14.0001V5.00006H0.548065V2.42406H7.79806V5.00006H7.51806V14.0001Z" fill="white" />
                  </svg>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-md font-medium text-gray-900">Vite</h3>
                  <p className="text-xs text-gray-500 mt-1">Fast Bundling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-indigo-50 py-24 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 -mt-20 -ml-20">
            <svg width="404" height="384" fill="none" viewBox="0 0 404 384" className="text-indigo-200 opacity-20">
              <defs>
                <pattern id="de316486-4a29-4312-bdfc-fbce2132a2c1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" className="text-indigo-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="384" fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c1)" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 -mb-20 -mr-20">
            <svg width="404" height="384" fill="none" viewBox="0 0 404 384" className="text-indigo-200 opacity-20">
              <defs>
                <pattern id="de316486-4a29-4312-bdfc-fbce2132a2c2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" className="text-indigo-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="384" fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c2)" />
            </svg>
          </div>
          <div className="text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Hear from our users
            </p>
            <p className="mt-6 max-w-2xl text-xl text-gray-500 mx-auto">
              Discover how AI Investor is transforming the way people approach investments
            </p>
          </div>
          
          <div className="mt-20">
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="group relative bg-white p-6 rounded-2xl shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.44762 7.17859C8.44762 10.1786 6.44762 10.1786 6.44762 10.1786C6.44762 10.1786 6.44762 8.17859 4.44762 8.17859V4.17859C6.44762 4.17859 8.44762 5.17859 8.44762 7.17859ZM17.4476 7.17859C17.4476 10.1786 15.4476 10.1786 15.4476 10.1786C15.4476 10.1786 15.4476 8.17859 13.4476 8.17859V4.17859C15.4476 4.17859 17.4476 5.17859 17.4476 7.17859ZM8.44762 15.1786V13.1786C4.44762 13.1786 3.44762 16.1786 3.44762 19.1786H6.44762C6.44762 17.1786 6.44762 15.1786 8.44762 15.1786ZM17.4476 15.1786V13.1786C13.4476 13.1786 12.4476 16.1786 12.4476 19.1786H15.4476C15.4476 17.1786 15.4476 15.1786 17.4476 15.1786Z" />
                  </svg>
                </div>
                <div className="text-gray-600 italic mt-6">
                  <p className="text-lg">
                    "The AI insights have completely transformed how I approach investing. I've seen a 15% increase in my portfolio since using this platform. It helped me identify underperforming stocks I wouldn't have noticed otherwise."
                  </p>
                </div>
                <div className="mt-8 flex items-center">
                  <img
                    className="h-12 w-12 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User"
                  />
                  <div className="ml-4">
                    <p className="text-base font-medium text-gray-900">John Davis</p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-500">Retail Investor</p>
                      <span className="mx-2 text-gray-500">•</span>
                      <div className="flex text-yellow-400">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
              </div>
            </div>
                  </div>
                </div>
              </div>
              
              <div className="group relative bg-white p-6 rounded-2xl shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.44762 7.17859C8.44762 10.1786 6.44762 10.1786 6.44762 10.1786C6.44762 10.1786 6.44762 8.17859 4.44762 8.17859V4.17859C6.44762 4.17859 8.44762 5.17859 8.44762 7.17859ZM17.4476 7.17859C17.4476 10.1786 15.4476 10.1786 15.4476 10.1786C15.4476 10.1786 15.4476 8.17859 13.4476 8.17859V4.17859C15.4476 4.17859 17.4476 5.17859 17.4476 7.17859ZM8.44762 15.1786V13.1786C4.44762 13.1786 3.44762 16.1786 3.44762 19.1786H6.44762C6.44762 17.1786 6.44762 15.1786 8.44762 15.1786ZM17.4476 15.1786V13.1786C13.4476 13.1786 12.4476 16.1786 12.4476 19.1786H15.4476C15.4476 17.1786 15.4476 15.1786 17.4476 15.1786Z" />
                  </svg>
                </div>
                <div className="text-gray-600 italic mt-6">
                  <p className="text-lg">
                    "The AI financial assistant is a game-changer. It's like having a financial advisor available 24/7 to answer all my questions in plain English. I no longer feel intimidated by complex financial concepts."
                  </p>
                </div>
                <div className="mt-8 flex items-center">
                  <img
                    className="h-12 w-12 rounded-full"
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User"
                  />
                  <div className="ml-4">
                    <p className="text-base font-medium text-gray-900">Sarah Miller</p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-500">New Investor</p>
                      <span className="mx-2 text-gray-500">•</span>
                      <div className="flex text-yellow-400">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
              </div>
            </div>
                  </div>
                </div>
              </div>
              
              <div className="group relative bg-white p-6 rounded-2xl shadow-xl transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.44762 7.17859C8.44762 10.1786 6.44762 10.1786 6.44762 10.1786C6.44762 10.1786 6.44762 8.17859 4.44762 8.17859V4.17859C6.44762 4.17859 8.44762 5.17859 8.44762 7.17859ZM17.4476 7.17859C17.4476 10.1786 15.4476 10.1786 15.4476 10.1786C15.4476 10.1786 15.4476 8.17859 13.4476 8.17859V4.17859C15.4476 4.17859 17.4476 5.17859 17.4476 7.17859ZM8.44762 15.1786V13.1786C4.44762 13.1786 3.44762 16.1786 3.44762 19.1786H6.44762C6.44762 17.1786 6.44762 15.1786 8.44762 15.1786ZM17.4476 15.1786V13.1786C13.4476 13.1786 12.4476 16.1786 12.4476 19.1786H15.4476C15.4476 17.1786 15.4476 15.1786 17.4476 15.1786Z" />
                  </svg>
                </div>
                <div className="text-gray-600 italic mt-6">
                  <p className="text-lg">
                    "As a financial analyst, I appreciate the depth of data this platform provides. The portfolio analysis tools have helped identify underperforming assets and optimize my clients' investment strategies with remarkable precision."
                  </p>
                </div>
                <div className="mt-8 flex items-center">
                  <img
                    className="h-12 w-12 rounded-full"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User"
                  />
                  <div className="ml-4">
                    <p className="text-base font-medium text-gray-900">Robert Johnson</p>
                    <div className="flex items-center mt-1">
                  <p className="text-sm text-gray-500">Financial Analyst</p>
                      <span className="mx-2 text-gray-500">•</span>
                      <div className="flex text-yellow-400">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section with Mobile App Promo */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute animate-[pulse_8s_ease-in-out_infinite] opacity-30 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 blur-3xl w-full h-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            <span className="block">Ready to transform your investments?</span>
                <span className="block mt-2">Start using AI Investor today.</span>
          </h2>
              <p className="mt-6 text-lg text-indigo-100 max-w-lg">
                Join thousands of investors who are already leveraging AI to make smarter investment decisions and optimize their portfolios.
          </p>
              
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 border-2 border-white text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 transition"
          >
            Sign up for free
          </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 border-2 border-white/30 text-base font-medium rounded-md text-white bg-transparent hover:bg-white/10 transition"
                >
                  Learn more
                </Link>
              </div>
              
              {/* App Store Badges */}
              <div className="mt-12">
                <p className="text-white text-sm font-medium mb-4">Get our mobile app:</p>
                <div className="flex flex-wrap gap-4">
                  <a href="#" className="flex items-center justify-center px-4 py-2 bg-black rounded-lg hover:bg-gray-800 transition">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                    </svg>
                    <div className="ml-3">
                      <div className="text-xs text-gray-200">Download on the</div>
                      <div className="text-white font-medium">App Store</div>
                    </div>
                  </a>
                  <a href="#" className="flex items-center justify-center px-4 py-2 bg-black rounded-lg hover:bg-gray-800 transition">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3.18 23.7c-.44 0-.86-.18-1.18-.5-.32-.32-.48-.76-.47-1.2.03-1.43.1-2.74.22-3.92.2-2.42.56-4.52 1.06-6.18C3.3 10.5 3.85 9.5 4.5 8.6c.75-1.02 1.52-1.7 2.25-2.07.23-.12.47-.21.7-.29l.26-.09c.16-.05.32-.08.46-.1.14-.01.3-.01.44.03.15.06.29.14.42.24l3.56 3.26c.32.29.48.73.43 1.18-.05.45-.31.84-.69 1.06-.36.2-.54.33-1.31.58-.76.25-1.08.36-1.42.6-.28.2-.52.48-.68.81-.36.72-.53 1.7-.53 3.07 0 1.34.18 2.66.52 3.92.17.63.52 1.14 1.05 1.53.33.24.91.52 1.91.52.99 0 1.57-.28 1.9-.52.53-.39.88-.91 1.05-1.53.34-1.25.52-2.57.52-3.92 0-1.36-.17-2.35-.53-3.07-.16-.33-.4-.61-.68-.81-.34-.24-.66-.35-1.42-.6-.77-.25-.94-.38-1.31-.58-.38-.22-.64-.61-.69-1.06-.05-.45.11-.89.43-1.18l3.56-3.26c.13-.1.27-.18.42-.24.15-.04.3-.04.44-.03.15.02.3.05.46.1l.26.09c.24.08.47.17.7.29.74.37 1.5 1.05 2.25 2.07.67.9 1.21 1.91 1.7 3.3.5 1.65.85 3.76 1.06 6.18.12 1.18.19 2.49.22 3.92 0 .44-.16.88-.47 1.2-.32.32-.73.5-1.18.5H3.18Z" />
                    </svg>
                    <div className="ml-3">
                      <div className="text-xs text-gray-200">GET IT ON</div>
                      <div className="text-white font-medium">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-12 lg:mt-0 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl blur opacity-75"></div>
                <div className="relative bg-white rounded-3xl overflow-hidden border-8 border-white shadow-2xl transform rotate-2">
                  <img
                    className="w-64"
                    src="https://images.unsplash.com/photo-1555421689-491a97ff2040?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                    alt="Mobile app"
                  />
                </div>
                <div className="absolute top-0 right-0 -mr-16 -mt-12 bg-white rounded-3xl overflow-hidden border-8 border-white shadow-2xl transform -rotate-3">
                  <img
                    className="w-56"
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                    alt="Mobile app dashboard"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="mt-20 max-w-md mx-auto lg:max-w-2xl">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-medium text-white mb-2">Subscribe to our newsletter</h3>
              <p className="text-indigo-100 text-sm mb-4">Get the latest investment insights and AI tips delivered to your inbox.</p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-3 rounded-md transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 
import React, { useState, useEffect, useRef } from 'react';
import { User, Loader2, MessageSquare, Send, Bot } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use Vite's environment variable approach
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    email: '',
    username: '',
    investmentStyle: '',
    riskTolerance: '',
    geminiApiKey: '',
    useDefaultKey: true
  });
  
  // Chatbot state
  const [showChatbot, setShowChatbot] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([]);
  const [userMessage, setUserMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatSession, setChatSession] = useState<any>(null);

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  // Initialize chat session
  useEffect(() => {
    if (userProfile.useDefaultKey || userProfile.geminiApiKey) {
      initChatSession();
    }
  }, [userProfile.useDefaultKey, userProfile.geminiApiKey]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const getProfile = async () => {
    try {
      setLoading(true);
      
      if (!user) throw new Error('No user');

      const { data, error } = await supabase
        .from('profiles')
        .select(`full_name, email, username, investment_style, risk_tolerance`)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Get user settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('gemini_api_key, use_default_key')
        .eq('user_id', user.id)
        .single();

      if (settingsError && settingsError.code !== 'PGRST116') {
        console.error('Error fetching settings:', settingsError);
      }

      setUserProfile({
        fullName: data?.full_name || '',
        email: user.email || '',
        username: data?.username || '',
        investmentStyle: data?.investment_style || 'Moderate',
        riskTolerance: data?.risk_tolerance || 'Medium',
        geminiApiKey: settingsData?.gemini_api_key || '',
        useDefaultKey: settingsData?.use_default_key !== false
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const initChatSession = () => {
    try {
      const apiKey = userProfile.useDefaultKey ? GEMINI_API_KEY : userProfile.geminiApiKey;
      
      if (!apiKey) return;
      
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const chat = model.startChat({
        history: [], // Start with empty history
        generationConfig: {
          temperature: 0.7,
        },
      });
      
      setChatSession(chat);
    } catch (error) {
      console.error('Error initializing chat session:', error);
    }
  };

  const sendMessage = async () => {
    if (!userMessage.trim() || !chatSession) return;
    
    try {
      setChatLoading(true);
      
      // Add user message to chat
      const newMessage = { role: 'user', content: userMessage };
      setChatMessages(prev => [...prev, newMessage]);
      
      // Clear input
      setUserMessage('');
      
      // Send message to Gemini
      const result = await chatSession.sendMessage(userMessage);
      const response = result.response;
      
      // Add AI response to chat
      setChatMessages(prev => [...prev, { role: 'assistant', content: response.text() }]);
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      toast.error('Failed to get response from Gemini');
      
      // Add error message to chat
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please check your API key and try again.' 
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const clearChat = () => {
    setChatMessages([]);
    // Reinitialize chat session
    initChatSession();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* User Profile Information */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <User className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{userProfile.fullName || 'Not set'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{userProfile.email}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Username</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{userProfile.username || 'Not set'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Investment Style</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{userProfile.investmentStyle}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Risk Tolerance</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">{userProfile.riskTolerance}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">API Key Status</h3>
            <p className="mt-1 text-lg font-medium text-gray-900">
              {userProfile.useDefaultKey 
                ? 'Using default API key' 
                : userProfile.geminiApiKey 
                  ? 'Using custom API key' 
                  : 'No API key set'}
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => toast.success('Edit profile feature coming soon!')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Gemini Chatbot Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div 
          className="bg-indigo-600 text-white p-4 flex justify-between items-center cursor-pointer"
          onClick={() => setShowChatbot(!showChatbot)}
        >
          <div className="flex items-center">
            <Bot className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-bold">Gemini 2.0 Flash Chatbot</h2>
          </div>
          <div>
            {showChatbot ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
        
        {showChatbot && (
          <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Ask me anything about investing, finance, or portfolio management
              </p>
              <button
                onClick={clearChat}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Clear chat
              </button>
            </div>
            
            <div className="border rounded-lg bg-gray-50 h-96 flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <Bot className="h-12 w-12 mb-2 text-indigo-300" />
                    <p className="text-center">Hi! I'm your AI financial assistant powered by Gemini 2.0 Flash.</p>
                    <p className="text-center text-sm mt-1">How can I help with your investments today?</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start max-w-[75%]`}>
                          {msg.role === 'assistant' && (
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-1">
                              <Bot className="h-5 w-5 text-indigo-600" />
                            </div>
                          )}
                          <div 
                            className={`rounded-lg px-4 py-2 ${
                              msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-gray-200 text-gray-800 rounded-tl-none'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          {msg.role === 'user' && (
                            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center ml-2 mt-1">
                              <User className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start max-w-[75%]">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-1">
                            <Bot className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="bg-gray-200 rounded-lg px-4 py-2 text-gray-800 rounded-tl-none">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              <div className="border-t p-3 bg-white">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={chatLoading || !chatSession}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={chatLoading || !userMessage.trim() || !chatSession}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                  >
                    {chatLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {!chatSession && (
                  <p className="mt-2 text-sm text-red-500">
                    Please set up your Gemini API key to use the chatbot.
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-3 text-xs text-gray-500">
              <p>Powered by Google Gemini 2.0 Flash. Your conversations are not stored on our servers.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 
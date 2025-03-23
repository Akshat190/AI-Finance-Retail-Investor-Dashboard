import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGemini } from '../context/GeminiContext';
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface UserProfile {
  age: number;
  risk: string;
  horizon: string;
}

const FinancialChatBot: React.FC = () => {
  const { user } = useAuth();
  const { apiKey } = useGemini();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [stockTicker, setStockTicker] = useState('');
  
  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    age: 30,
    risk: 'Moderate',
    horizon: 'medium-term'
  });
  
  // Add initial welcome message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: "Hello! I'm your financial assistant. How can I help you today? You can ask about stocks, investment advice, or financial concepts.",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  }, []);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Function to communicate with Hugging Face Spaces API
  const fetchFromHuggingFace = async (message: string, userProfile: UserProfile) => {
    try {
      // Construct the API URL for your Hugging Face Space
      const apiUrl = "https://akshat1908-financial-chatbot.hf.space/api/predict";
      
      // Prepare the data to send to the API
      // Adjust this based on how your Gradio interface is set up
      const payload = {
        data: [
          message,                    // User message
          [],                         // Chat history (empty for first message)
          userProfile.age,            // Age
          "Male",                     // Gender (default)
          userProfile.risk,           // Risk tolerance
          `${userProfile.horizon} (1-5 years)` // Investment horizon
        ]
      };
      
      // Make the API call
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Extract the bot's response from the result
      // The structure depends on your Gradio interface
      // Typically it's in result.data[0] or similar
      const botResponse = result.data[1]; // Adjust index based on your API response structure
      
      return botResponse;
    } catch (error) {
      console.error("Error calling Hugging Face API:", error);
      return "I'm sorry, I encountered an error while processing your request. Please try again later.";
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = input;
    setInput('');
    
    // Add user message to chat
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setIsLoading(true);
    
    try {
      // Get response from Hugging Face Spaces API
      const response = await fetchFromHuggingFace(userMessage, userProfile);
      
      // Add bot response to chat
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response. Please try again.');
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePredictStock = async () => {
    if (!stockTicker.trim()) return;
    
    // Add user message to chat
    const userMessage = `predict: ${stockTicker.toUpperCase()}`;
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setIsLoading(true);
    
    try {
      // Get prediction from Hugging Face Spaces API
      const response = await fetchFromHuggingFace(userMessage, userProfile);
      
      // Add bot response to chat
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      setStockTicker(''); // Clear the input field
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get prediction. Please try again.');
      
      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't generate a prediction at this time. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 bg-indigo-600 text-white">
          <h2 className="text-xl font-semibold">Financial Assistant</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-indigo-100 text-gray-800'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown components={{
                    p: ({node, ...props}) => <p className="mb-2" {...props} />,
                    h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-2 mt-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2 mt-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-md font-bold mb-1 mt-2" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1" {...props} />,
                    table: ({node, ...props}) => <div className="overflow-x-auto"><table className="min-w-full divide-y divide-gray-200" {...props} /></div>,
                    th: ({node, ...props}) => <th className="px-3 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />,
                    td: ({node, ...props}) => <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500" {...props} />,
                    a: ({node, ...props}) => <a className="text-indigo-600 hover:text-indigo-800" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-200 pl-4 italic" {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline 
                        ? <code className="bg-gray-100 rounded px-1 py-0.5 text-sm" {...props} />
                        : <pre className="bg-gray-100 rounded p-2 overflow-x-auto text-sm" {...props} />
                  }}>
                    {message.text}
                  </ReactMarkdown>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? 'Thinking...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Profile</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              value={userProfile.age}
              onChange={(e) => setUserProfile({...userProfile, age: parseInt(e.target.value) || 30})}
              min="18"
              max="100"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Tolerance</label>
            <select
              value={userProfile.risk}
              onChange={(e) => setUserProfile({...userProfile, risk: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Investment Horizon</label>
            <select
              value={userProfile.horizon}
              onChange={(e) => setUserProfile({...userProfile, horizon: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="short-term">Short-term (&lt; 1 year)</option>
              <option value="medium-term">Medium-term (1-5 years)</option>
              <option value="long-term">Long-term (&gt; 5 years)</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Stock Prediction</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={stockTicker}
              onChange={(e) => setStockTicker(e.target.value)}
              placeholder="Enter stock ticker (e.g., AAPL)"
              className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handlePredictStock}
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading || !stockTicker.trim()}
            >
              Predict
            </button>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Example Questions</h3>
          <div className="space-y-2">
            <button
              onClick={() => setInput("What stocks should I invest in based on my profile?")}
              className="w-full text-left p-2 text-sm hover:bg-indigo-50 rounded"
            >
              What stocks should I invest in based on my profile?
            </button>
            
            <button
              onClick={() => setInput("stock: AAPL")}
              className="w-full text-left p-2 text-sm hover:bg-indigo-50 rounded"
            >
              Get Apple stock information
            </button>
            
            <button
              onClick={() => setInput("predict: TSLA")}
              className="w-full text-left p-2 text-sm hover:bg-indigo-50 rounded"
            >
              Predict Tesla stock
            </button>
            
            <button
              onClick={() => setInput("How should I allocate my portfolio?")}
              className="w-full text-left p-2 text-sm hover:bg-indigo-50 rounded"
            >
              How should I allocate my portfolio?
            </button>
            
            <button
              onClick={() => setInput("What's the difference between stocks and bonds?")}
              className="w-full text-left p-2 text-sm hover:bg-indigo-50 rounded"
            >
              What's the difference between stocks and bonds?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialChatBot; 
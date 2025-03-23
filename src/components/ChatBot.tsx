import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Loader2, Send, Bot, User, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

// Temporary solution - replace with proper environment variable handling
const API_KEY = "AIzaSyDlxS3E1fUgn7Dd1jFPs9f-5uxHGtw0CCg"; // Replace this with your actual key
const genAI = new GoogleGenerativeAI(API_KEY);

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: 'Hello! I\'m your AI assistant. How can I help you with your financial questions today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input field when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const generateResponse = async (prompt: string) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Include conversation history for context
      const conversationHistory = messages
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');
      
      const fullPrompt = `${conversationHistory}\nUser: ${prompt}\nAssistant:`;
      
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    try {
      setLoading(true);
      
      // Generate response
      const responseText = await generateResponse(userMessage);
      
      // Add bot response to chat
      setMessages(prev => [...prev, { role: 'bot', content: responseText }]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Failed to get a response. Please try again.');
      
      // Add error message to chat
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: 'Sorry, I encountered an error processing your request. Please try again.' 
      }]);
    } finally {
      setLoading(false);
      // Focus back on input after response
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const clearChat = () => {
    setMessages([
      { role: 'bot', content: 'Chat cleared. How can I help you today?' }
    ]);
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-indigo-50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-indigo-800 flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            FinanceAI Assistant
          </h3>
          <p className="text-sm text-gray-600">Ask me about investments, market trends, or financial advice</p>
        </div>
        <button 
          onClick={clearChat}
          className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-gray-100"
          title="Clear chat"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <div className="flex items-start">
                {message.role === 'bot' && (
                  <Bot className="h-5 w-5 mr-2 mt-1 flex-shrink-0 text-indigo-600" />
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
                {message.role === 'user' && (
                  <User className="h-5 w-5 ml-2 mt-1 flex-shrink-0 text-white" />
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none px-4 py-2">
              <div className="flex items-center">
                <Bot className="h-5 w-5 mr-2 text-indigo-600" />
                <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something about finance..."
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-600 text-white rounded-md px-4 py-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBot; 
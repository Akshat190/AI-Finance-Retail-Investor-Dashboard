import React, { useEffect } from 'react';

const HuggingFaceChatbot: React.FC = () => {
  useEffect(() => {
    // Redirect to Hugging Face Space
    window.location.href = 'https://huggingface.co/spaces/Akshat1908/financial-chatbot';
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-lg text-gray-700">Redirecting to AI Financial Assistant...</p>
      </div>
    </div>
  );
};

export default HuggingFaceChatbot; 
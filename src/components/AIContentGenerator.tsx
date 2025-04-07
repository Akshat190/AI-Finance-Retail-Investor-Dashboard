import React, { useState, useEffect } from 'react';
import AIService from '../services/AIService';
import AutocompleteInput from './AutocompleteInput';

interface AIContentGeneratorProps {
  initialPrompt?: string;
  placeholder?: string;
  presetPrompts?: string[];
  className?: string;
  onGenerate?: (content: string) => void;
  maxLength?: number;
  systemPrompt?: string;
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  initialPrompt = '',
  placeholder = 'Describe what you want to generate...',
  presetPrompts = [],
  className = '',
  onGenerate,
  maxLength = 500,
  systemPrompt = 'You are a financial content assistant helping investors create professional content.',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    // Calculate word count
    const words = content.trim().split(/\s+/);
    setWordCount(content.trim() ? words.length : 0);
  }, [content]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const generatedContent = await AIService.generateCompletion(prompt, {
        systemPrompt,
        maxTokens: Math.min(maxLength * 2, 2000), // Estimate tokens based on word count
      });
      
      setContent(generatedContent);
      
      if (onGenerate) {
        onGenerate(generatedContent);
      }
    } catch (err) {
      console.error('Error generating content:', err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePresetSelect = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
      .then(() => {
        // Show temporary copy success message
        const button = document.getElementById('copy-button');
        if (button) {
          const originalText = button.textContent;
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  const handleClear = () => {
    setContent('');
    setPrompt('');
  };

  return (
    <div className={`ai-content-generator ${className}`}>
      <div className="mb-4">
        <label htmlFor="prompt" className="block text-sm font-medium mb-1">
          What do you want to generate?
        </label>
        <AutocompleteInput
          id="prompt"
          value={prompt}
          onChange={setPrompt}
          placeholder={placeholder}
          className="w-full p-2"
        />
      </div>

      {presetPrompts.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Suggested prompts:</p>
          <div className="flex flex-wrap gap-2">
            {presetPrompts.map((presetPrompt, index) => (
              <button
                key={index}
                onClick={() => handlePresetSelect(presetPrompt)}
                className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
                type="button"
              >
                {presetPrompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between mb-4">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
          type="button"
        >
          {isGenerating ? 'Generating...' : 'Generate Content'}
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleClear}
            disabled={isGenerating || (!prompt && !content)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 transition"
            type="button"
          >
            Clear
          </button>
          {content && (
            <button
              id="copy-button"
              onClick={handleCopy}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              type="button"
            >
              Copy
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="relative">
        <textarea
          className="w-full h-64 p-3 border rounded focus:ring-2 focus:ring-blue-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Generated content will appear here..."
          readOnly={isGenerating}
        />
        <div className="absolute bottom-2 right-2 text-sm text-gray-500">
          {wordCount} words
        </div>
      </div>
    </div>
  );
};

export default AIContentGenerator; 
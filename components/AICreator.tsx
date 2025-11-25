
import React, { useState } from 'react';
import { parseTokenIntent } from '../services/geminiService';
import { TokenFormState } from '../types';
import { Button } from './Button';

interface AICreatorProps {
  onConfigGenerated: (config: Partial<TokenFormState>) => void;
  onGenerateSite: () => void;
}

export const AICreator: React.FC<AICreatorProps> = ({ onConfigGenerated, onGenerateSite }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMagicCreate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const config = await parseTokenIntent(prompt);
    setLoading(false);
    if (config) {
       onConfigGenerated(config);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-900/10 to-transparent mb-8 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/40">
          <span className="text-2xl">🔮</span>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="text-lg font-bold text-white mb-1">Magic Token Creator (AI)</h3>
                <p className="text-sm text-gray-400 mb-4">
                   Describe your dream token in plain English. We'll handle the config and even build the website.
                </p>
             </div>
             <button 
                onClick={onGenerateSite}
                className="hidden sm:block text-[10px] bg-purple-600/20 text-purple-300 border border-purple-500/50 px-3 py-1 rounded hover:bg-purple-600 hover:text-white transition-colors"
             >
                Generate Website Only
             </button>
          </div>
          
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. I want a deflationary token named 'Mars Rover' on Base chain with 5% tax, and I need a full website for it."
              className="w-full bg-black/30 border border-purple-500/30 rounded-lg p-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none h-24 text-sm placeholder-gray-500"
            />
            <div className="absolute bottom-3 right-3 flex gap-2">
               <button 
                 className="text-xs text-purple-300 hover:text-white px-3 py-1.5"
                 onClick={onGenerateSite}
               >
                 Generate Site UI
               </button>
               <Button 
                 variant="secondary" 
                 className="!py-1.5 !px-4 !text-xs !bg-purple-600 hover:!bg-purple-500 text-white"
                 onClick={handleMagicCreate}
                 isLoading={loading}
                 disabled={!prompt}
               >
                 ✨ Generate Config
               </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

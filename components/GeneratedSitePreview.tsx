
import React from 'react';
import { GeneratedSiteContent } from '../types';

interface GeneratedSitePreviewProps {
  content: GeneratedSiteContent | null;
  onBack: () => void;
  onDeploy: () => void;
}

export const GeneratedSitePreview: React.FC<GeneratedSitePreviewProps> = ({ content, onBack, onDeploy }) => {
  if (!content) return <div className="text-white text-center p-10">Loading Site Preview...</div>;

  const { primary, secondary, background } = content.colorPalette;

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-y-auto font-sans">
       {/* Editor Toolbar */}
       <div className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="text-gray-400 hover:text-white">← Back to Editor</button>
             <span className="text-white font-bold">AI Site Preview</span>
          </div>
          <div className="flex items-center gap-3">
             <button className="hidden sm:block text-gray-400 hover:text-white text-sm">Customize Colors</button>
             <button onClick={onDeploy} className="bg-brand-green text-black font-bold px-6 py-2 rounded hover:bg-green-400 transition-colors">
                Deploy Site (IPFS)
             </button>
          </div>
       </div>

       {/* Generated Content Wrapper */}
       <div className="min-h-screen" style={{ backgroundColor: background, color: '#fff' }}>
          
          {/* Hero Section */}
          <section className="py-20 px-6 text-center max-w-5xl mx-auto">
             <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight" style={{ color: primary }}>
                {content.heroHeadline}
             </h1>
             <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
                {content.heroSubheadline}
             </p>
             <div className="flex justify-center gap-4">
                <button className="px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105" style={{ backgroundColor: primary, color: background }}>
                   Buy Token
                </button>
                <button className="px-8 py-4 rounded-full font-bold text-lg border transition-colors hover:bg-white/10" style={{ borderColor: primary, color: primary }}>
                   View Chart
                </button>
             </div>
          </section>

          {/* About Section */}
          <section className="py-20 px-6 bg-black/20">
             <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                   <h2 className="text-3xl font-bold mb-4" style={{ color: secondary }}>{content.aboutTitle}</h2>
                   <p className="text-gray-300 text-lg leading-relaxed">{content.aboutText}</p>
                </div>
                <div className="order-1 md:order-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl h-64 w-full flex items-center justify-center border border-gray-700">
                   <span className="text-gray-600">AI Generated Image Placeholder</span>
                </div>
             </div>
          </section>

          {/* Features Grid */}
          <section className="py-20 px-6 max-w-6xl mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {content.features.map((feat, idx) => (
                   <div key={idx} className="p-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="text-4xl mb-4">{feat.icon}</div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: primary }}>{feat.title}</h3>
                      <p className="text-gray-400 text-sm">Automated feature verification enabled.</p>
                   </div>
                ))}
             </div>
          </section>

          {/* Roadmap */}
          <section className="py-20 px-6 bg-black/20">
             <h2 className="text-3xl font-bold text-center mb-12" style={{ color: secondary }}>Roadmap</h2>
             <div className="max-w-3xl mx-auto space-y-8">
                {content.roadmapSteps.map((step, idx) => (
                   <div key={idx} className="flex gap-6 items-start">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0" style={{ backgroundColor: secondary, color: background }}>
                         {idx + 1}
                      </div>
                      <div>
                         <h3 className="text-xl font-bold text-white">{step.title}</h3>
                         <p className="text-gray-400">{step.description}</p>
                      </div>
                   </div>
                ))}
             </div>
          </section>

          <footer className="py-10 text-center text-gray-500 text-sm border-t border-white/10 mt-10">
             Powered by MemeLaunch AI Site Generator
          </footer>
       </div>
    </div>
  );
};

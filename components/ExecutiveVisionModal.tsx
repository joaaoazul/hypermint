
import React, { useState } from 'react';
import { Button } from './Button';

interface ExecutiveVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'vision' | 'roadmap' | 'architecture' | 'features' | 'monetization' | 'operations';

export const ExecutiveVisionModal: React.FC<ExecutiveVisionModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('vision');

  if (!isOpen) return null;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'vision', label: 'Vision & Strategy', icon: '👁️' },
    { id: 'roadmap', label: 'Roadmap & Backlog', icon: '🗺️' },
    { id: 'architecture', label: 'Tech Architecture', icon: '🏗️' },
    { id: 'features', label: 'Core Features', icon: '🚀' },
    { id: 'monetization', label: 'Economy', icon: '💰' },
    { id: 'operations', label: 'Ops & Security', icon: '🛡️' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative bg-[#0E0F12] w-full max-w-6xl h-[90vh] rounded-2xl border border-brand-border flex flex-col shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-brand-border bg-[#11131A]">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-brand-accent">⚡</span> Project Executive Vision
            </h2>
            <p className="text-brand-text-muted text-sm mt-1">Platform Master Plan & Technical Specifications</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-[#11131A] border-r border-brand-border hidden md:flex flex-col p-4 gap-2 overflow-y-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${
                  activeTab === tab.id
                    ? 'bg-brand-accent text-black shadow-neon'
                    : 'text-brand-text-muted hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden flex overflow-x-auto border-b border-brand-border bg-[#11131A] p-2 gap-2 absolute top-0 left-0 right-0 z-10">
             {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-brand-accent text-black' : 'bg-gray-800 text-gray-400'
                }`}
              >
                {tab.label}
              </button>
             ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-gradient-to-br from-[#0E0F12] to-[#13161C] relative">
            
            {activeTab === 'vision' && (
              <div className="space-y-8 animate-fade-in">
                <section>
                  <h3 className="text-3xl font-bold text-white mb-4">1. Visão Executiva e Posição Competitiva</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    Objetivo: transformar o site numa plataforma <strong>multi-chain, segura, social e viral</strong> para criação, compra, e promoção de tokens, com livestream integrada, IA para avaliação e gamificação que cria network effects e retenção.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-xl border border-brand-accent/20">
                      <h4 className="text-brand-accent font-bold mb-2">Diferenciais Chave</h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
                        <li>Multi-chain (Solana / EVMs / L2s)</li>
                        <li>Proteções anti-rugpull (liquidity lock, vesting, escrow)</li>
                        <li>Livestream integrada + compra em-stream</li>
                        <li>Score de risco com IA e transparência</li>
                        <li>3D tokens + AR + skins</li>
                      </ul>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="space-y-8 animate-fade-in">
                <section>
                  <h3 className="text-3xl font-bold text-white mb-6">3. Roadmap por Fases</h3>
                  <div className="space-y-6">
                    {[
                      { title: "Release A — Core & Safe", items: "SIWE auth, Buy via bonding curve, Coin page, Risk Score v1, Anti-rugpull primitives, KYC minimal." },
                      { title: "Release B — Social & Live", items: "Livestream integration, live overlays, chat + moderation IA, marketplace, creator profiles." },
                      { title: "Release C — Scale & Multi-chain", items: "Add Ethereum, BSC, Polygon, Base, Solana full support; mobile app." },
                      { title: "Release D — Monetize & Deep IA", items: "Launchpad premium, boosts, tokenomics improvements, AI auto-generation." },
                      { title: "Release E — Experience", items: "3D/AR advanced, skins marketplace, coin personality (IA), battle royale mode." }
                    ].map((phase, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-brand-dark border border-brand-border flex items-center justify-center text-brand-accent font-bold text-sm shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-lg">{phase.title}</h4>
                          <p className="text-gray-400 text-sm">{phase.items}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="pt-8 border-t border-brand-border/50">
                  <h3 className="text-2xl font-bold text-white mb-4">2. High Impact Backlog</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                     <div className="glass-panel p-4 border border-brand-border rounded-lg">
                        <span className="text-xs font-bold bg-brand-accent/10 text-brand-accent px-2 py-1 rounded">PRIORITY</span>
                        <h5 className="font-bold text-white mt-2">COIN-002 — Buy/Sell via Bonding Curve</h5>
                        <p className="text-xs text-gray-400 mt-1">AC: UI calcula preço pela curva e cria ordem; returns payload para assinatura on-chain.</p>
                     </div>
                     <div className="glass-panel p-4 border border-brand-border rounded-lg">
                        <span className="text-xs font-bold bg-brand-accent/10 text-brand-accent px-2 py-1 rounded">PRIORITY</span>
                        <h5 className="font-bold text-white mt-2">LIVE-001 — Livestream infra + overlay commerce</h5>
                        <p className="text-xs text-gray-400 mt-1">AC: streamer can enable “Buy buttons” overlay; viewers can press and create signed buy intents.</p>
                     </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'architecture' && (
              <div className="space-y-8 animate-fade-in">
                <section>
                  <h3 className="text-3xl font-bold text-white mb-6">4. Arquitetura Técnica</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                     <div className="bg-[#1A1D25] p-5 rounded-xl border border-brand-border">
                        <h4 className="text-brand-secondary font-bold mb-3">Frontend</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                           <li>Next.js (App Router)</li>
                           <li>Tailwind CSS</li>
                           <li>React-three-fiber (3D)</li>
                           <li>Framer Motion</li>
                           <li>React Query / SWR</li>
                        </ul>
                     </div>
                     <div className="bg-[#1A1D25] p-5 rounded-xl border border-brand-border">
                        <h4 className="text-brand-secondary font-bold mb-3">Backend (Microservices)</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                           <li>Node.js (NestJS/Express)</li>
                           <li>API Gateway (Auth)</li>
                           <li>Coin Service (Indexer)</li>
                           <li>Trade Service (Swap)</li>
                           <li>Bonding Curve Engine</li>
                        </ul>
                     </div>
                     <div className="bg-[#1A1D25] p-5 rounded-xl border border-brand-border">
                        <h4 className="text-brand-secondary font-bold mb-3">Data & Indexing</h4>
                        <ul className="text-sm text-gray-400 space-y-1">
                           <li>PostgreSQL + TimescaleDB</li>
                           <li>Redis (Cache/PubSub)</li>
                           <li>The Graph (On-chain events)</li>
                           <li>ElasticSearch (Marketplace)</li>
                        </ul>
                     </div>
                  </div>

                  <div className="p-6 bg-black/40 rounded-xl border border-gray-800 font-mono text-xs text-gray-300 overflow-x-auto">
                    <h4 className="text-white font-bold mb-2">// SQL Schema Example: Tokens</h4>
                    <pre>{`CREATE TABLE tokens (
  id TEXT PRIMARY KEY,
  name TEXT,
  symbol TEXT,
  chain TEXT,
  contract_address TEXT,
  creator_wallet TEXT,
  created_at TIMESTAMP,
  status TEXT,
  risk_score INT
);`}</pre>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-8 animate-fade-in">
                 <section>
                    <h3 className="text-3xl font-bold text-white mb-6">Core & Advanced Features</h3>
                    
                    <div className="space-y-6">
                       <div>
                          <h4 className="text-xl font-bold text-white mb-2">9. 3D / AR Implementation</h4>
                          <p className="text-gray-400 text-sm mb-2">
                             Stack: react-three-fiber + @react-three/drei.
                             <br/>
                             Use <code>useLoader(TextureLoader, url)</code> for custom skins.
                             <br/>
                             AR Mobile: WebXR via <code>&lt;model-viewer&gt;</code> component.
                          </p>
                       </div>

                       <div>
                          <h4 className="text-xl font-bold text-white mb-2">10. AI Integrations</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div className="glass-panel p-4 rounded border border-brand-border">
                                <span className="font-bold text-white">Risk Score Model</span>
                                <p className="text-xs text-gray-400 mt-1">Classifies tokens based on holder concentration, tx velocity, and social signals.</p>
                             </div>
                             <div className="glass-panel p-4 rounded border border-brand-border">
                                <span className="font-bold text-white">Generative Content</span>
                                <p className="text-xs text-gray-400 mt-1">Auto-generate names, logos, descriptions, and websites for creators.</p>
                             </div>
                          </div>
                       </div>
                       
                       <div>
                          <h4 className="text-xl font-bold text-white mb-2">11. Live Streaming</h4>
                          <p className="text-gray-400 text-sm">
                             <strong>Commerce Overlay:</strong> Streamer adds product (token) with a buy button that triggers popup.
                             <br/>
                             <strong>Monetization:</strong> Tip system (SOL/ETH) + Superchats.
                          </p>
                       </div>
                    </div>
                 </section>
              </div>
            )}

            {activeTab === 'monetization' && (
              <div className="space-y-8 animate-fade-in">
                <section>
                   <h3 className="text-3xl font-bold text-white mb-6">13. Monetization & Tokenomics</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="glass-panel p-6 rounded-xl border border-green-500/20 text-center">
                         <div className="text-2xl mb-2">💸</div>
                         <h4 className="font-bold text-white">Trading Fees</h4>
                         <p className="text-xs text-gray-400 mt-1">Slippage + Platform Fee on every swap.</p>
                      </div>
                      <div className="glass-panel p-6 rounded-xl border border-purple-500/20 text-center">
                         <div className="text-2xl mb-2">🚀</div>
                         <h4 className="font-bold text-white">Launchpad</h4>
                         <p className="text-xs text-gray-400 mt-1">Tiered creation fees & premium placement.</p>
                      </div>
                      <div className="glass-panel p-6 rounded-xl border border-yellow-500/20 text-center">
                         <div className="text-2xl mb-2">⚡</div>
                         <h4 className="font-bold text-white">Boosts</h4>
                         <p className="text-xs text-gray-400 mt-1">Pay-to-feature on trending lists.</p>
                      </div>
                      <div className="glass-panel p-6 rounded-xl border border-blue-500/20 text-center">
                         <div className="text-2xl mb-2">🎫</div>
                         <h4 className="font-bold text-white">NFT Passes</h4>
                         <p className="text-xs text-gray-400 mt-1">Discounts on fees for advanced creators.</p>
                      </div>
                   </div>
                </section>
                
                <section>
                   <h3 className="text-xl font-bold text-white mb-4">12. Gamification Loops</h3>
                   <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                      <li>Points for interactions: buy/hold/trade/share = XP</li>
                      <li>Leaderboards by volume, shill count, badges</li>
                      <li>Daily quests (e.g., “Buy 1 new token today”)</li>
                      <li><strong>Battle Royale Mode:</strong> Tokens compete in volume cycles, lowest eliminated.</li>
                   </ul>
                </section>
              </div>
            )}

            {activeTab === 'operations' && (
               <div className="space-y-8 animate-fade-in">
                  <section>
                     <h3 className="text-3xl font-bold text-white mb-6">14. Security & Compliance</h3>
                     <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl mb-6">
                        <h4 className="text-red-400 font-bold mb-2">Critical Checklist</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                           <div className="flex items-center gap-2">✅ Smart Contract Audits</div>
                           <div className="flex items-center gap-2">✅ Rate Limit & WAF</div>
                           <div className="flex items-center gap-2">✅ SIWE for Wallet Ops</div>
                           <div className="flex items-center gap-2">✅ HSM for server signing</div>
                           <div className="flex items-center gap-2">✅ KYC for large raisers</div>
                           <div className="flex items-center gap-2">✅ Bug Bounty Program</div>
                        </div>
                     </div>
                  </section>

                  <section>
                     <h3 className="text-xl font-bold text-white mb-4">17. Operational Plan</h3>
                     <div className="flex flex-wrap gap-2">
                        {['CTO / Engineering Lead', '2-4 Full Stack Devs', 'DevOps / Infra', 'Security Engineer', 'AI Data Scientist', 'Growth Marketer', 'Legal Advisor'].map(role => (
                           <span key={role} className="bg-gray-800 text-gray-300 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-700">
                              {role}
                           </span>
                        ))}
                     </div>
                  </section>
               </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

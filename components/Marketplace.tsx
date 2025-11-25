import React, { useState } from 'react';
import { CreatedToken, Chain } from '../types';
import { Button } from './Button';

interface MarketplaceProps {
  tokens: CreatedToken[];
  myTokenIds: Set<string>;
  onSelectToken?: (token: CreatedToken) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ tokens, myTokenIds, onSelectToken }) => {
  const [filter, setFilter] = useState<'all' | 'trending' | 'new' | 'my-coins'>('all');
  const [chainFilter, setChainFilter] = useState<Chain | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTokens = tokens.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.ticker.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    
    // Filter logic
    if (filter === 'my-coins' && !myTokenIds.has(t.id)) return false;
    
    if (chainFilter !== 'ALL' && t.chain !== chainFilter) return false;
    return true;
  }).sort((a, b) => {
    if (filter === 'new') return b.timestamp - a.timestamp;
    return b.marketCap - a.marketCap;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
        <div>
           <h2 className="text-4xl font-black text-white tracking-tighter mb-2">MARKET <span className="text-primary">TERMINAL</span></h2>
           <p className="text-text-muted text-lg font-light">Real-time liquidity analysis and token discovery.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
           <div className="relative group w-full sm:w-72">
             <input 
               type="text" 
               placeholder="Search assets..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-surface border border-border rounded-xl px-5 py-3 pl-11 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-text-dim shadow-lg"
             />
             <svg className="w-5 h-5 text-text-dim absolute left-4 top-3 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
           </div>
           
           <div className="flex bg-surface rounded-xl p-1 border border-border">
             {[
               {id: 'all', label: 'All'},
               {id: 'trending', label: 'Trending'},
               {id: 'new', label: 'New'},
               {id: 'my-coins', label: 'Holdings'}
             ].map((f) => (
               <button
                 key={f.id}
                 onClick={() => setFilter(f.id as any)}
                 className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
                   filter === f.id ? 'bg-surface-highlight text-primary shadow-sm' : 'text-text-muted hover:text-white'
                 }`}
               >
                 {f.label}
               </button>
             ))}
           </div>
        </div>
      </div>
      
      {/* Chain Filter Pills */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide border-b border-white/5">
         {(['ALL', 'SOL', 'ETH', 'BSC', 'SUI', 'BASE'] as const).map(c => (
            <button
               key={c}
               onClick={() => setChainFilter(c)}
               className={`px-4 py-2 rounded-t-lg text-xs font-bold border-b-2 transition-all ${
                  chainFilter === c 
                    ? 'border-primary text-white bg-white/5' 
                    : 'border-transparent text-text-dim hover:text-text-muted'
               }`}
            >
               {c === 'ALL' ? 'Global' : c}
            </button>
         ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTokens.map((token) => (
          <div 
            key={token.id} 
            onClick={() => onSelectToken && onSelectToken(token)}
            className="group glass-card rounded-2xl p-0 cursor-pointer transition-all duration-300 hover:border-primary/40 relative overflow-hidden"
          >
             {/* Card Header with Image Background Blur */}
             <div className="h-24 bg-gradient-to-b from-white/5 to-transparent relative p-6 flex justify-between items-start">
                <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                    token.chain === 'SOL' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' : 
                    token.chain === 'ETH' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                    'border-gray-500/30 text-gray-400 bg-gray-500/10'
                }`}>
                   {token.chain}
                </div>
                {/* Score Ring */}
                <div className="relative w-8 h-8 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                       <circle cx="16" cy="16" r="14" stroke="#1F2229" strokeWidth="2" fill="none" />
                       <circle cx="16" cy="16" r="14" stroke={token.riskScore > 80 ? '#00FF9D' : '#FF0055'} strokeWidth="2" fill="none" strokeDasharray="88" strokeDashoffset={88 - (88 * token.riskScore) / 100} />
                    </svg>
                    <span className="absolute text-[8px] font-bold">{token.riskScore}</span>
                </div>
             </div>

             <div className="px-6 pb-6 relative z-10 -mt-10">
                <div className="flex gap-4 mb-4">
                   <div className="w-20 h-20 rounded-xl bg-[#0A0C10] p-1 border border-border shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <img src={token.image!} alt={token.name} className="w-full h-full object-cover rounded-lg" />
                   </div>
                   <div className="pt-10">
                      <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors">{token.name}</h3>
                      <span className="text-xs font-mono text-text-dim uppercase tracking-wider">${token.ticker}</span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-t border-white/5 border-b border-white/5 mb-4 bg-black/20 -mx-6 px-6">
                    <div>
                       <div className="text-[10px] uppercase tracking-wider text-text-dim font-bold mb-1">Market Cap</div>
                       <div className="text-white font-mono text-sm">${(token.marketCap / 1000).toFixed(1)}k</div>
                    </div>
                    <div className="text-right">
                       <div className="text-[10px] uppercase tracking-wider text-text-dim font-bold mb-1">Volume 24h</div>
                       <div className="text-success font-mono text-sm">${(token.volume24h / 1000).toFixed(1)}k</div>
                    </div>
                </div>

                <p className="text-xs text-text-muted leading-relaxed line-clamp-2 min-h-[32px] mb-4">
                   {token.description}
                </p>

                {/* Bonding Curve Bar */}
                <div>
                   <div className="flex justify-between text-[9px] mb-1.5 uppercase font-bold tracking-wider">
                      <span className="text-text-dim">Bonding Progress</span>
                      <span className="text-primary">45%</span>
                   </div>
                   <div className="h-1.5 w-full bg-[#151921] rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[45%] shadow-[0_0_8px_#00F0FF]"></div>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>
      
      {filteredTokens.length === 0 && (
         <div className="text-center py-20 animate-fade-in border border-dashed border-border rounded-3xl mt-10">
            <div className="text-text-dim mb-4 text-4xl opacity-50">🔭</div>
            <h3 className="text-white font-bold text-lg">No assets found</h3>
            <p className="text-text-muted mt-2 text-sm">
              Adjust your parameters to find hidden gems.
            </p>
         </div>
      )}
    </div>
  );
};
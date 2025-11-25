import React, { useState } from 'react';

export const LiquidityLocker: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const lockedPairs = [
    { pair: 'SPEPE/SOL', address: '0x7a...9f', value: '$452,000', unlockDate: '2025-10-12', logo: '🐸' },
    { pair: 'YIELD/USDC', address: '0x3b...2a', value: '$120,500', unlockDate: '2024-12-01', logo: '🚀' },
    { pair: 'HYPER/ETH', address: '0x1c...55', value: '$2,800,000', unlockDate: '2026-05-20', logo: '⚡' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      <div className="text-center mb-16">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            On-Chain Security
         </div>
         <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">
            LIQUIDITY <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">LOCKER</span>
         </h1>
         <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Secure your LP tokens in our audited smart contracts. Build trust with your community by proving your liquidity is locked forever or for a fixed term.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
         <div className="glass-card p-8 rounded-2xl border border-border text-center">
            <div className="text-4xl mb-4">🔒</div>
            <div className="text-text-dim text-xs font-bold uppercase tracking-wider">Total Value Locked</div>
            <div className="text-4xl font-mono font-bold text-white mt-2">$145.2M</div>
         </div>
         <div className="glass-card p-8 rounded-2xl border border-border text-center">
            <div className="text-4xl mb-4">⛓️</div>
            <div className="text-text-dim text-xs font-bold uppercase tracking-wider">Active Lockers</div>
            <div className="text-4xl font-mono font-bold text-white mt-2">12,405</div>
         </div>
         <div className="glass-card p-8 rounded-2xl border border-border text-center bg-gradient-to-br from-primary/10 to-transparent border-primary/30">
            <div className="text-4xl mb-4">🛡️</div>
            <div className="text-primary text-xs font-bold uppercase tracking-wider">Security Score</div>
            <div className="text-4xl font-mono font-bold text-white mt-2">100%</div>
         </div>
      </div>

      <div className="glass-card p-8 rounded-2xl border border-border mb-12">
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <h3 className="text-2xl font-bold text-white">Create New Lock</h3>
            <div className="flex gap-4">
               <button className="px-6 py-3 rounded-xl bg-surface border border-border text-white font-bold hover:bg-white/5 transition-colors">
                  My Locks
               </button>
               <button className="px-6 py-3 rounded-xl bg-primary text-black font-bold hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                  + Lock Liquidity
               </button>
            </div>
         </div>
         
         <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
            <input 
               type="text" 
               className="w-full bg-[#0A0C10] border border-border rounded-xl py-4 pl-12 pr-4 text-white placeholder-text-dim focus:border-primary focus:ring-1 focus:ring-primary outline-none"
               placeholder="Search by pair address or token name..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      <div className="glass-card rounded-2xl border border-border overflow-hidden">
         <div className="px-6 py-4 border-b border-border bg-[#0A0C10] flex justify-between items-center">
            <span className="font-bold text-white text-sm uppercase tracking-wider">Recent Locks</span>
            <div className="flex gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-xs text-green-500 font-bold">Live Updates</span>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-[#151921] text-text-dim uppercase text-xs">
                  <tr>
                     <th className="px-6 py-4 font-bold">Pair</th>
                     <th className="px-6 py-4 font-bold">Address</th>
                     <th className="px-6 py-4 font-bold text-right">Value</th>
                     <th className="px-6 py-4 font-bold text-right">Unlock Date</th>
                     <th className="px-6 py-4 font-bold text-center">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {lockedPairs.map((lock, idx) => (
                     <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                           <span className="text-xl">{lock.logo}</span>
                           {lock.pair}
                        </td>
                        <td className="px-6 py-4 font-mono text-primary text-xs">{lock.address}</td>
                        <td className="px-6 py-4 font-mono text-right text-white">{lock.value}</td>
                        <td className="px-6 py-4 font-mono text-right text-text-muted">{lock.unlockDate}</td>
                        <td className="px-6 py-4 text-center">
                           <button className="text-xs font-bold text-primary hover:text-white underline">View</button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
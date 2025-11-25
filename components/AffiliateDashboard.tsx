
import React from 'react';
import { ReferralStats } from '../types';

export const AffiliateDashboard: React.FC = () => {
  const stats: ReferralStats = {
    tier: 'Gold',
    referrals: 142,
    earningsSol: 45.5,
    nftId: '#8821',
    rank: 12
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Affiliate System 3.0</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Share your unique link or "Referral NFT" to earn instant on-chain commissions.
          Payments are distributed automatically via smart contract.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* NFT Badge Card */}
        <div className="glass-panel p-1 rounded-xl border border-yellow-500/50 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent"></div>
          <div className="bg-brand-card rounded-lg p-6 h-full relative z-10">
             <div className="flex justify-between items-start mb-6">
                <span className="text-yellow-500 text-xs font-bold border border-yellow-500/30 px-2 py-1 rounded">TIER: {stats.tier}</span>
                <span className="text-gray-500 text-xs font-mono">ID: {stats.nftId}</span>
             </div>
             <div className="w-full aspect-square bg-black rounded-lg mb-6 border border-gray-700 flex items-center justify-center relative overflow-hidden">
                {/* Simulated 3D Card */}
                <div className="w-32 h-48 bg-gradient-to-b from-yellow-400 to-yellow-700 rounded-lg transform rotate-12 shadow-2xl flex items-center justify-center border-2 border-white/20">
                   <div className="text-black font-bold text-center">
                     <div className="text-xs">REFERRAL</div>
                     <div className="text-2xl">PASS</div>
                   </div>
                </div>
                <div className="absolute bottom-4 left-4 text-xs text-gray-500">
                   Hold to earn 15% fees
                </div>
             </div>
             <button className="w-full bg-yellow-500 text-black font-bold py-3 rounded hover:bg-yellow-400 transition-colors">
                Mint Referral NFT
             </button>
          </div>
        </div>

        {/* Stats & Earnings */}
        <div className="lg:col-span-2 space-y-6">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel p-6 rounded-xl border border-brand-input">
                 <div className="text-gray-400 text-xs uppercase font-bold">Total Earnings</div>
                 <div className="text-3xl font-mono text-white font-bold mt-2">{stats.earningsSol} SOL</div>
                 <div className="text-brand-green text-xs mt-1">≈ $6,500 USD</div>
              </div>
              <div className="glass-panel p-6 rounded-xl border border-brand-input">
                 <div className="text-gray-400 text-xs uppercase font-bold">Total Referrals</div>
                 <div className="text-3xl font-mono text-white font-bold mt-2">{stats.referrals}</div>
                 <div className="text-gray-500 text-xs mt-1">Active Traders</div>
              </div>
              <div className="glass-panel p-6 rounded-xl border border-brand-input">
                 <div className="text-gray-400 text-xs uppercase font-bold">Global Rank</div>
                 <div className="text-3xl font-mono text-white font-bold mt-2">#{stats.rank}</div>
                 <div className="text-yellow-500 text-xs mt-1">Top 1%</div>
              </div>
           </div>

           <div className="glass-panel p-6 rounded-xl border border-brand-input">
              <h3 className="text-lg font-bold text-white mb-4">Your Referral Link</h3>
              <div className="flex gap-2">
                 <input 
                   readOnly 
                   value="https://hypermint.com/ref/0x7F...3kL2"
                   className="flex-1 bg-black/50 border border-gray-700 rounded px-4 py-3 text-gray-300 font-mono text-sm focus:outline-none"
                 />
                 <button className="bg-brand-green text-black font-bold px-6 rounded hover:bg-green-400">
                    Copy
                 </button>
              </div>
              <div className="mt-4 flex gap-4 text-sm text-gray-400">
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Instant Settlement
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    No Minimum Claim
                 </div>
              </div>
           </div>

           {/* Leaderboard Preview */}
           <div className="glass-panel rounded-xl border border-brand-input overflow-hidden">
              <div className="p-4 bg-gray-800/50 border-b border-gray-700 font-bold text-white">
                 Top Affiliates (This Month)
              </div>
              <div className="p-4 space-y-3">
                 {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-800/30 rounded transition-colors">
                       <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${i === 1 ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'}`}>{i}</span>
                          <span className="text-gray-300 font-mono">0x{Math.random().toString(16).substr(2, 6)}...</span>
                       </div>
                       <span className="text-brand-green font-bold">{(100 - i * 15).toFixed(1)} SOL</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

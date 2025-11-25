
import React from 'react';
import { DaoProposal } from '../types';

const PROPOSALS: DaoProposal[] = [
  { id: 'PIP-12', title: 'Reduce Platform Fees to 0.8%', description: 'Proposal to lower the base creation fee to attract more volume.', votesFor: 1250000, votesAgainst: 45000, status: 'Active', endDate: Date.now() + 86400000, category: 'Treasury' },
  { id: 'PIP-11', title: 'Add Support for Arbitrum Network', description: 'Deploy contracts to ARB L2 to support low cost launches.', votesFor: 3200000, votesAgainst: 10000, status: 'Passed', endDate: Date.now() - 100000000, category: 'Feature' },
  { id: 'PIP-10', title: 'Burn 5% of Treasury Tokens', description: 'Deflationary measure to increase token value.', votesFor: 800000, votesAgainst: 900000, status: 'Rejected', endDate: Date.now() - 200000000, category: 'Treasury' },
];

export const DaoGovernance: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
       <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <span className="text-purple-400 font-bold uppercase tracking-wider text-xs border border-purple-500/30 px-3 py-1 rounded-full mb-3 inline-block">Governance v2</span>
            <h2 className="text-4xl font-bold text-white mb-2">HyperMint DAO</h2>
            <p className="text-gray-400">Vote on platform fees, new chains, and treasury usage.</p>
          </div>
          <div className="glass-panel p-4 rounded-xl border border-purple-500/30 flex items-center gap-4">
             <div>
                <div className="text-[10px] text-gray-500 uppercase">Your Voting Power</div>
                <div className="text-xl font-bold text-white">0 $HYPER</div>
             </div>
             <button className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded hover:bg-purple-500 transition-colors">
                Get $HYPER
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
             {PROPOSALS.map((prop) => (
                <div key={prop.id} className="glass-panel p-6 rounded-xl border border-brand-input hover:border-purple-500/30 transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            prop.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                            prop.status === 'Passed' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
                         }`}>
                            {prop.status}
                         </span>
                         <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{prop.category}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{prop.id}</span>
                   </div>
                   
                   <h3 className="text-xl font-bold text-white mb-2">{prop.title}</h3>
                   <p className="text-gray-400 text-sm mb-6">{prop.description}</p>
                   
                   {/* Progress Bar */}
                   <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                         <span className="text-green-400">For: {(prop.votesFor / 1000).toFixed(1)}k</span>
                         <span className="text-red-400">Against: {(prop.votesAgainst / 1000).toFixed(1)}k</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden flex">
                         <div className="h-full bg-green-500" style={{ width: `${(prop.votesFor / (prop.votesFor + prop.votesAgainst)) * 100}%` }}></div>
                         <div className="h-full bg-red-500" style={{ width: `${(prop.votesAgainst / (prop.votesFor + prop.votesAgainst)) * 100}%` }}></div>
                      </div>
                   </div>

                   {prop.status === 'Active' && (
                      <div className="flex gap-3 pt-2">
                         <button className="flex-1 bg-brand-input border border-green-500/30 text-green-400 py-2 rounded font-bold hover:bg-green-500/10 transition-colors">
                            Vote For
                         </button>
                         <button className="flex-1 bg-brand-input border border-red-500/30 text-red-400 py-2 rounded font-bold hover:bg-red-500/10 transition-colors">
                            Vote Against
                         </button>
                      </div>
                   )}
                </div>
             ))}
          </div>
          
          <div className="space-y-6">
             <div className="glass-panel p-6 rounded-xl border border-brand-input">
                <h3 className="font-bold text-white mb-4">Treasury Stats</h3>
                <div className="space-y-4">
                   <div>
                      <div className="text-xs text-gray-500">DAO Treasury Balance</div>
                      <div className="text-2xl font-mono text-white">$4,250,000</div>
                   </div>
                   <div>
                      <div className="text-xs text-gray-500">Monthly Revenue Share</div>
                      <div className="text-xl font-mono text-brand-green">$125,000</div>
                   </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700">
                   <button className="w-full bg-brand-input hover:bg-gray-700 text-white py-2 rounded text-sm transition-colors">
                      View On-Chain
                   </button>
                </div>
             </div>
             
             <div className="glass-panel p-6 rounded-xl border border-brand-input bg-purple-900/10">
                <h3 className="font-bold text-white mb-2">Create Proposal</h3>
                <p className="text-xs text-gray-400 mb-4">Hold 100,000 $HYPER to submit new proposals.</p>
                <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded transition-colors disabled:opacity-50" disabled>
                   Insufficient Balance
                </button>
             </div>
          </div>
       </div>
    </div>
  );
};

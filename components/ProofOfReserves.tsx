
import React from 'react';
import { ReserveData } from '../types';

const RESERVES: ReserveData[] = [
  { asset: 'SOL', balance: 145000, valueUsd: 24650000, address: 'So1...9x2', custodian: 'Fireblocks', lastAudit: '2023-10-25' },
  { asset: 'USDC', balance: 50000000, valueUsd: 50000000, address: '0x7...aF2', custodian: 'BitGo', lastAudit: '2023-10-25' },
  { asset: 'BTC', balance: 450, valueUsd: 15750000, address: 'bc1...k92', custodian: 'ColdStorage', lastAudit: '2023-10-24' },
];

export const ProofOfReserves: React.FC = () => {
  const totalValue = RESERVES.reduce((acc, curr) => acc + curr.valueUsd, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
       <div className="text-center mb-12">
         <span className="text-brand-green font-bold uppercase tracking-wider text-xs border border-brand-green/30 px-3 py-1 rounded-full mb-4 inline-block">Transparency Protocol</span>
         <h2 className="text-4xl font-bold text-white mb-4">Proof of Reserves</h2>
         <p className="text-gray-400 max-w-2xl mx-auto">
           We maintain 100% solvency. All user assets are backed 1:1 and held in segregated institutional custody.
           Verify our on-chain assets in real-time.
         </p>
       </div>

       {/* Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-panel p-6 rounded-xl border border-brand-green/20 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-brand-green/5"></div>
             <div className="relative z-10">
               <div className="text-gray-400 text-xs uppercase font-bold">Total Assets Protected</div>
               <div className="text-3xl font-mono font-bold text-white mt-2">${(totalValue / 1000000).toFixed(1)}M</div>
               <div className="text-brand-green text-xs mt-1">Last verified: 2 mins ago</div>
             </div>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-brand-input text-center">
             <div className="text-gray-400 text-xs uppercase font-bold">Solvency Ratio</div>
             <div className="text-3xl font-mono font-bold text-white mt-2">102%</div>
             <div className="text-gray-500 text-xs mt-1">Over-collateralized</div>
          </div>
          <div className="glass-panel p-6 rounded-xl border border-brand-input text-center">
             <div className="text-gray-400 text-xs uppercase font-bold">Insurance Fund</div>
             <div className="text-3xl font-mono font-bold text-white mt-2">$50M</div>
             <div className="text-gray-500 text-xs mt-1">SAFU Covered</div>
          </div>
       </div>

       {/* Table */}
       <div className="glass-panel rounded-xl border border-brand-input overflow-hidden">
         <table className="w-full text-left text-sm">
           <thead className="bg-gray-800/50 text-gray-400 text-xs uppercase">
             <tr>
               <th className="p-4">Asset</th>
               <th className="p-4">Balance</th>
               <th className="p-4 text-right">Value (USD)</th>
               <th className="p-4 hidden md:table-cell">Custodian</th>
               <th className="p-4 hidden md:table-cell">Address (Hash)</th>
               <th className="p-4 text-right">Status</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-700 text-gray-300">
             {RESERVES.map((res, idx) => (
               <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                 <td className="p-4 font-bold text-white">{res.asset}</td>
                 <td className="p-4 font-mono">{res.balance.toLocaleString()}</td>
                 <td className="p-4 text-right font-mono">${res.valueUsd.toLocaleString()}</td>
                 <td className="p-4 hidden md:table-cell">
                    <span className="bg-gray-700 px-2 py-1 rounded text-xs">{res.custodian}</span>
                 </td>
                 <td className="p-4 hidden md:table-cell font-mono text-brand-green text-xs">{res.address}</td>
                 <td className="p-4 text-right">
                    <span className="flex items-center justify-end gap-1 text-brand-green text-xs font-bold">
                      <span>●</span> Verified
                    </span>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>

       <div className="mt-8 flex justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
          {/* Mock Partner Logos */}
          <div className="text-white font-bold text-xl flex items-center gap-2"><span className="text-brand-green">♦</span> Fireblocks</div>
          <div className="text-white font-bold text-xl flex items-center gap-2"><span className="text-blue-400">●</span> Chainalysis</div>
          <div className="text-white font-bold text-xl flex items-center gap-2"><span className="text-purple-400">▲</span> CertiK</div>
       </div>
    </div>
  );
};


import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TokenomicsConfig } from '../types';

interface VisualTokenomicsProps {
  config: TokenomicsConfig;
  onChange: (key: keyof TokenomicsConfig, value: number) => void;
}

export const VisualTokenomics: React.FC<VisualTokenomicsProps> = ({ config, onChange }) => {
  
  const liquidity = 100 - config.marketingWallet - config.devWallet;
  
  const data = [
    { name: 'Liquidity (Public)', value: liquidity, color: '#86EFAC' },
    { name: 'Marketing', value: config.marketingWallet, color: '#3B82F6' },
    { name: 'Dev Team', value: config.devWallet, color: '#A855F7' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
        {/* Chart */}
        <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1A2332', border: '1px solid #374151', borderRadius: '8px' }}
                   itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center">
                 <div className="text-xs text-gray-500">Supply</div>
                 <div className="text-lg font-bold text-white">100%</div>
               </div>
            </div>
        </div>

        {/* Controls */}
        <div className="space-y-4">
           <div>
             <div className="flex justify-between text-xs mb-1">
               <span className="text-blue-400">Marketing Wallet</span>
               <span className="text-white">{config.marketingWallet}%</span>
             </div>
             <input 
               type="range" 
               min="0" max="20" 
               value={config.marketingWallet} 
               onChange={(e) => onChange('marketingWallet', parseInt(e.target.value))}
               className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
             />
           </div>
           <div>
             <div className="flex justify-between text-xs mb-1">
               <span className="text-purple-400">Dev Wallet</span>
               <span className="text-white">{config.devWallet}%</span>
             </div>
             <input 
               type="range" 
               min="0" max="20" 
               value={config.devWallet} 
               onChange={(e) => onChange('devWallet', parseInt(e.target.value))}
               className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
             />
           </div>
           <div className="pt-2 border-t border-gray-700/50">
             <div className="flex justify-between text-xs text-gray-400">
               <span>Liquidity Pool</span>
               <span className="text-brand-green font-bold">{liquidity}%</span>
             </div>
           </div>
        </div>
      </div>

      {/* Taxes */}
      <div className="bg-brand-input/30 p-4 rounded-lg border border-gray-700">
         <h4 className="text-xs font-bold uppercase text-gray-400 mb-3">Tax Configuration</h4>
         <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="block text-[10px] text-gray-500 mb-1">Buy Tax ({config.buyTax}%)</label>
               <input 
                 type="range" min="0" max="10" 
                 value={config.buyTax}
                 onChange={(e) => onChange('buyTax', parseInt(e.target.value))}
                 className="w-full h-1 bg-gray-700 rounded appearance-none cursor-pointer accent-brand-green"
               />
            </div>
            <div>
               <label className="block text-[10px] text-gray-500 mb-1">Sell Tax ({config.sellTax}%)</label>
               <input 
                 type="range" min="0" max="10" 
                 value={config.sellTax}
                 onChange={(e) => onChange('sellTax', parseInt(e.target.value))}
                 className="w-full h-1 bg-gray-700 rounded appearance-none cursor-pointer accent-red-400"
               />
            </div>
         </div>
      </div>
      
      {/* Lock */}
      <div className="flex items-center justify-between bg-brand-input/30 p-3 rounded-lg border border-brand-green/20">
         <div className="flex items-center gap-2">
           <span className="text-lg">🔒</span>
           <div>
             <div className="text-xs font-bold text-white">Liquidity Lock</div>
             <div className="text-[10px] text-gray-500">Prevents Rug Pulls</div>
           </div>
         </div>
         <select 
           value={config.liquidityLockMonths}
           onChange={(e) => onChange('liquidityLockMonths', parseInt(e.target.value))}
           className="bg-brand-dark text-xs border border-gray-700 rounded p-1 text-white focus:border-brand-green outline-none"
         >
           <option value={1}>1 Month</option>
           <option value={3}>3 Months</option>
           <option value={6}>6 Months</option>
           <option value={12}>1 Year</option>
           <option value={1200}>Forever (Burned)</option>
         </select>
      </div>
    </div>
  );
};

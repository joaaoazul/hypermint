
import React from 'react';
import { useWallet } from '../hooks/useWallet';
import { Button } from './Button';

interface DashboardProps {
  onConnectClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onConnectClick }) => {
  const { isConnected } = useWallet();

  const portfolio = [
    { ticker: 'SPEPE', amount: '1,500,000', value: 450.20, change: '+12.5%' },
    { ticker: 'YIELD', amount: '5,000', value: 120.50, change: '-2.1%' },
    { ticker: 'SOL', amount: '14.5', value: 2100.00, change: '+5.4%' },
  ];

  const bots = [
    { name: 'Sniper Bot Alpha', status: 'Active', profit: '+2.4 SOL', uptime: '4h 20m' },
    { name: 'DCA Accumulator', status: 'Paused', profit: '0 SOL', uptime: '0m' },
  ];

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in flex flex-col items-center justify-center text-center">
        <div className="bg-brand-card border border-brand-border p-12 rounded-3xl max-w-lg w-full shadow-neon relative overflow-hidden group">
           <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="text-6xl mb-6 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">🔒</div>
           <h2 className="text-3xl font-bold text-white mb-4">Portfolio Locked</h2>
           <p className="text-gray-400 mb-8 leading-relaxed">
             Connect your wallet to access your holdings, track performance, and manage your automated trading bots.
           </p>
           <Button 
             onClick={onConnectClick}
             className="w-full py-4 text-lg !font-bold uppercase tracking-widest"
           >
             Connect Wallet
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Command Center</h2>
          <div className="flex items-center gap-2 mt-1">
             <span className="bg-yellow-500/20 text-yellow-500 text-[10px] border border-yellow-500/30 px-2 py-0.5 rounded font-bold uppercase">Lvl 5 Trader</span>
             <div className="w-24 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 w-[60%]"></div>
             </div>
             <span className="text-[10px] text-gray-500">340/500 XP</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-brand-input hover:bg-gray-700 text-white text-sm px-4 py-2 rounded border border-gray-600 transition-colors">
            Export Tax CSV
          </button>
          <button className="bg-brand-green text-black font-bold text-sm px-4 py-2 rounded hover:bg-green-400 transition-colors">
            Deposit Fiat
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-xl border border-brand-input relative overflow-hidden col-span-1 md:col-span-2">
          <div className="relative z-10">
            <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Total Net Worth</span>
            <div className="text-4xl font-mono text-white font-bold mt-1">$2,670.70</div>
            <div className="text-brand-green text-xs mt-2 flex items-center gap-1">
              <span>▲</span> 8.2% this week
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 p-4">
            <svg className="w-24 h-24 text-brand-green" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-brand-input group hover:border-purple-500/50 transition-colors cursor-pointer">
          <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Subscription</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xl text-white font-bold">Pro Tier</span>
            <span className="text-purple-400">★</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-500">
             Next billing: 24 Oct
          </div>
          <div className="mt-3 text-[10px] text-brand-green">
            Active: Anti-Rug Scanner
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-brand-input">
          <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Creator Rewards</span>
          <div className="flex justify-between mt-2">
            <div>
              <div className="text-xl text-white font-bold">1.2 SOL</div>
              <div className="text-[10px] text-gray-500">Unclaimed Fees</div>
            </div>
            <button className="text-xs border border-brand-green text-brand-green px-2 rounded hover:bg-brand-green hover:text-black transition-colors">
              Claim
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Portfolio Table */}
        <div className="lg:col-span-2 glass-panel rounded-xl border border-brand-input overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-white font-bold text-sm uppercase tracking-wide">Portfolio Holdings</h3>
            <span className="text-gray-500 text-xs">Assets</span>
          </div>
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-brand-input/50 text-xs uppercase">
              <tr>
                <th className="p-4 font-medium">Asset</th>
                <th className="p-4 font-medium">Balance</th>
                <th className="p-4 font-medium text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {portfolio.map((item) => (
                <tr key={item.ticker} className="hover:bg-brand-input/30 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {item.ticker[0]}
                    </div>
                    <div>
                      <span className="block text-white font-medium">{item.ticker}</span>
                    </div>
                  </td>
                  <td className="p-4">{item.amount}</td>
                  <td className="p-4 text-right">
                    <div className="text-white font-medium">${item.value.toFixed(2)}</div>
                    <div className={item.change.startsWith('+') ? 'text-brand-green text-xs' : 'text-red-400 text-xs'}>
                      {item.change}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Automated Trading Bots */}
        <div className="glass-panel rounded-xl border border-brand-input overflow-hidden">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-blue-900/20">
            <div className="flex items-center gap-2">
               <span className="text-blue-400 text-lg">🤖</span>
               <h3 className="text-white font-bold text-sm uppercase tracking-wide">Auto-Trading Bots</h3>
            </div>
            <button className="text-[10px] bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-400">+ New Bot</button>
          </div>
          <div className="divide-y divide-gray-700">
            {bots.map((bot, idx) => (
              <div key={idx} className="p-4">
                 <div className="flex justify-between mb-1">
                    <span className="font-bold text-white">{bot.name}</span>
                    <span className={`text-[10px] px-1.5 rounded border ${bot.status === 'Active' ? 'border-green-500 text-green-500' : 'border-gray-500 text-gray-500'}`}>{bot.status}</span>
                 </div>
                 <div className="flex justify-between text-xs text-gray-400">
                    <span>Profit: <span className="text-white">{bot.profit}</span></span>
                    <span>Runtime: {bot.uptime}</span>
                 </div>
              </div>
            ))}
            <div className="p-4 text-center">
              <p className="text-xs text-gray-500 italic">Upgrade to Pro for Grid Trading bots.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

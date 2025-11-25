import React, { useState, useEffect } from 'react';
import { CreatedToken, TokenComment } from '../types';
import { BinanceChart } from './BinanceChart';
import { DepthChart } from './DepthChart';
import { useWallet } from '../hooks/useWallet';

interface TokenDetailViewProps {
  token: CreatedToken;
  onBack: () => void;
  onConnectClick: () => void;
  onTokenUpdate?: (token: CreatedToken) => void;
}

const formatCompactNumber = (num: number) => {
  return Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 2
  }).format(num);
};

// ... (Generate Candle Data Logic - Keeping existing logic, just styling update)
const generateCandleData = (timeframe: string, creationTime: number, currentMarketCap: number) => {
  const data = [];
  const now = Math.floor(Date.now() / 1000); 
  const startTime = Math.floor(creationTime / 1000);
  
  let interval = 900;
  if (timeframe === '1m') interval = 60;
  if (timeframe === '5m') interval = 300;
  if (timeframe === '15m') interval = 900;
  if (timeframe === '1h') interval = 3600;
  if (timeframe === '4h') interval = 14400;
  if (timeframe === '1D') interval = 86400;

  let candlesCount = Math.floor((now - startTime) / interval);
  if (candlesCount < 1) candlesCount = 1;
  if (candlesCount > 2000) candlesCount = 2000;

  const startPrice = 0.00000280;
  const supply = 1_000_000_000;
  const targetPrice = currentMarketCap / supply;
  
  let price = startPrice;
  const linearStep = (targetPrice - startPrice) / Math.max(1, candlesCount);

  for (let i = 0; i <= candlesCount; i++) {
    const time = startTime + (i * interval);
    if (time > now && i > 0) break;

    const volatilityFactor = Math.sqrt(interval / 900); 
    const volatility = 0.000000005 * volatilityFactor;
    
    const open = price;
    const noise = (Math.random() - 0.5) * volatility * 2;
    let close = open + linearStep + noise;
    if (i === candlesCount) close = targetPrice;
    close = Math.max(0.00000001, close); 
    const high = Math.max(open, close) + (Math.random() * volatility * 0.5);
    const low = Math.max(0.00000001, Math.min(open, close) - (Math.random() * volatility * 0.5));
    const volume = Math.floor(Math.random() * 50000 * volatilityFactor);
    data.push({ time, open, high, low, close, volume });
    price = close;
  }
  return data;
};

const MOCK_COMMENTS: TokenComment[] = [
  { id: '1', user: 'Degen_Ape', avatar: '🐸', text: 'This looks super bullish. Aping 5 SOL.', timestamp: Date.now() - 360000, likes: 12 },
  { id: '2', user: 'CryptoMom', avatar: '🚀', text: 'Dev is based, community is active. Holding till Raydium.', timestamp: Date.now() - 720000, likes: 8 },
  { id: '3', user: 'WhaleWatcher', avatar: '🐋', text: 'Volume picking up rapidly.', timestamp: Date.now() - 900000, likes: 5 },
];

const INITIAL_TRADES = [
  { user: '8x...A2', type: 'buy', amount: 0.5, tokens: '12.5k', date: '14:32:01', tx: 'tx1' },
  { user: '4k...99', type: 'sell', amount: 0.12, tokens: '3.2k', date: '14:31:55', tx: 'tx2' },
  { user: 'By...21', type: 'buy', amount: 1.5, tokens: '38.1k', date: '14:31:42', tx: 'tx3' },
  { user: '99...zz', type: 'buy', amount: 0.1, tokens: '2.5k', date: '14:30:10', tx: 'tx4' },
];

export const TokenDetailView: React.FC<TokenDetailViewProps> = ({ token, onBack, onConnectClick, onTokenUpdate }) => {
  const { isConnected } = useWallet();
  const [chartView, setChartView] = useState<'price' | 'depth'>('price');
  const [timeframe, setTimeframe] = useState('15m');
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['SMA', 'Volume']);
  const [tradeTab, setTradeTab] = useState<'buy' | 'sell'>('buy');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [candleData, setCandleData] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState(token.marketCap / 1_000_000_000);
  const [percentChange, setPercentChange] = useState(0);
  const [marketCap, setMarketCap] = useState(token.marketCap);
  const [bondingProgress, setBondingProgress] = useState(68);
  const [kingProgress, setKingProgress] = useState(55);
  
  const [solBalance, setSolBalance] = useState(14.5);
  const [userTokenBalance, setUserTokenBalance] = useState(0);
  const [amount, setAmount] = useState<string>('');
  const [isTrading, setIsTrading] = useState(false);
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [commentInput, setCommentInput] = useState('');
  const [trades, setTrades] = useState(INITIAL_TRADES);

  useEffect(() => {
     const data = generateCandleData(timeframe, token.timestamp, marketCap);
     setCandleData(data);
     if (data.length > 0) {
        const lastClose = data[data.length - 1].close;
        const firstOpen = data[0].open;
        setCurrentPrice(lastClose);
        setPercentChange(((lastClose - firstOpen) / firstOpen) * 100);
     }
  }, [timeframe, token.timestamp, marketCap]); 

  useEffect(() => { setErrorMsg(null); }, [amount, tradeTab]);

  const toggleIndicator = (ind: string) => {
    if (activeIndicators.includes(ind)) setActiveIndicators(prev => prev.filter(i => i !== ind));
    else setActiveIndicators(prev => [...prev, ind]);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    const newComment: TokenComment = {
      id: Date.now().toString(),
      user: 'You',
      avatar: '👤',
      text: commentInput,
      timestamp: Date.now(),
      likes: 0
    };
    setComments([newComment, ...comments]);
    setCommentInput('');
  };

  const handleTrade = () => {
    if (!isConnected) {
        onConnectClick();
        setErrorMsg("Connect wallet to trade");
        return;
    }
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    if (tradeTab === 'buy' && val > solBalance) { setErrorMsg("Insufficient Funds"); return; }
    if (tradeTab === 'sell' && (val / currentPrice) > userTokenBalance && userTokenBalance === 0) { setErrorMsg("Insufficient Token Balance"); return; }

    setIsTrading(true);
    setTimeout(() => {
        let newPrice = currentPrice;
        if (tradeTab === 'buy') {
            const tokensReceived = val / currentPrice;
            setSolBalance(prev => prev - val);
            setUserTokenBalance(prev => prev + tokensReceived);
            newPrice = currentPrice + (currentPrice * (0.01 + (val / 1000)));
            setBondingProgress(prev => Math.min(100, prev + (val * 0.5)));
            setTrades(prev => [{ user: 'You', type: 'buy', amount: val, tokens: formatCompactNumber(tokensReceived), date: new Date().toLocaleTimeString('en-US', {hour12: false}), tx: 'pending...' }, ...prev]);
        } else {
            const tokensSold = val / currentPrice; 
            setSolBalance(prev => prev + val);
            setUserTokenBalance(prev => Math.max(0, prev - tokensSold));
            newPrice = Math.max(0.00000001, currentPrice - (currentPrice * (0.01 + (val / 1000))));
            setBondingProgress(prev => Math.max(0, prev - (val * 0.2)));
            setTrades(prev => [{ user: 'You', type: 'sell', amount: val, tokens: formatCompactNumber(tokensSold), date: new Date().toLocaleTimeString('en-US', {hour12: false}), tx: 'pending...' }, ...prev]);
        }
        setCurrentPrice(newPrice);
        setMarketCap(newPrice * 1_000_000_000);
        if (onTokenUpdate) onTokenUpdate({ ...token, marketCap: newPrice * 1_000_000_000, volume24h: token.volume24h + (val * currentPrice * 150) });
        setIsTrading(false);
        setAmount('');
    }, 600);
  };

  const isSafe = token.riskScore > 75;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 py-6 animate-fade-in font-sans pb-20 pt-20">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-xs font-bold text-text-muted hover:text-white flex items-center gap-1 bg-surface px-4 py-2 rounded-lg border border-border hover:border-primary transition-colors">
            ← MARKET
        </button>
        <span className="text-border text-xs">/</span>
        <span className="text-xs text-text-muted font-bold uppercase">{token.chain}</span>
        <span className="text-border text-xs">/</span>
        <span className="text-xs text-white font-black tracking-wide">{token.ticker}-SOL</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* ================= LEFT COLUMN ================= */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Ticker Header */}
          <div className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center">
             <div className="flex gap-4 items-center">
                <img src={token.image || ''} alt={token.name} className="w-14 h-14 rounded-xl object-cover border border-white/10 shadow-lg" />
                <div>
                   <h1 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                      {token.name} 
                   </h1>
                   <div className="flex items-center gap-3 text-xs mt-1">
                      <span className="bg-white/5 border border-white/10 text-text-main px-2 py-0.5 rounded font-mono font-bold">{token.ticker}</span>
                      <span className="text-success font-mono">Vol: {(token.volume24h / 1000).toFixed(1)}K</span>
                      {token.website && <a href="#" className="text-text-muted hover:text-primary">🌐 Website</a>}
                   </div>
                </div>
             </div>
             
             <div className="flex gap-8 mt-4 sm:mt-0 text-right">
                <div>
                   <div className="text-[10px] text-text-dim uppercase font-bold tracking-wider">Price USD</div>
                   <div className={`text-2xl font-mono font-bold tracking-tight ${percentChange >= 0 ? 'text-success' : 'text-accent'}`}>
                      ${currentPrice.toFixed(9)}
                   </div>
                </div>
                <div>
                   <div className="text-[10px] text-text-dim uppercase font-bold tracking-wider">24h Change</div>
                   <div className={`text-sm font-mono font-bold ${percentChange >= 0 ? 'text-success' : 'text-accent'}`}>
                     {percentChange >= 0 ? '▲' : '▼'} {Math.abs(percentChange).toFixed(2)}%
                   </div>
                </div>
                <div>
                   <div className="text-[10px] text-text-dim uppercase font-bold tracking-wider">Market Cap</div>
                   <div className="text-sm font-mono font-bold text-white">${formatCompactNumber(marketCap)}</div>
                </div>
             </div>
          </div>

          {/* Chart Section */}
          <div className="glass-card rounded-2xl overflow-hidden border border-border flex flex-col h-[500px]">
             {/* Chart Toolbar */}
             <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-[#0A0C10]">
                <div className="flex items-center gap-4">
                   <div className="flex bg-[#151921] rounded-lg p-0.5">
                      {['1m', '5m', '15m', '1h', '4h', '1D'].map(tf => (
                         <button 
                           key={tf}
                           onClick={() => setTimeframe(tf)}
                           className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${timeframe === tf ? 'bg-[#1F2229] text-primary shadow-sm' : 'text-text-muted hover:text-white'}`}
                         >
                            {tf}
                         </button>
                      ))}
                   </div>
                   <div className="h-4 w-[1px] bg-border"></div>
                   <div className="flex gap-2">
                      {['SMA', 'EMA', 'BB', 'RSI'].map(ind => (
                         <button 
                           key={ind}
                           onClick={() => toggleIndicator(ind)}
                           className={`text-[10px] font-bold px-2 py-1 rounded transition-colors border ${
                               activeIndicators.includes(ind) ? 'bg-primary/10 border-primary/30 text-primary' : 'border-transparent text-text-muted hover:text-white'
                           }`}
                         >
                            {ind}
                         </button>
                      ))}
                   </div>
                </div>
                
                <div className="flex bg-[#151921] rounded-lg p-0.5">
                   <button onClick={() => setChartView('price')} className={`px-3 py-1 rounded-md text-[10px] font-bold ${chartView === 'price' ? 'bg-[#1F2229] text-white' : 'text-text-muted'}`}>Price</button>
                   <button onClick={() => setChartView('depth')} className={`px-3 py-1 rounded-md text-[10px] font-bold ${chartView === 'depth' ? 'bg-[#1F2229] text-white' : 'text-text-muted'}`}>Depth</button>
                </div>
             </div>
             
             <div className="flex-1 bg-[#0A0C10] relative">
                {chartView === 'price' ? (
                   <BinanceChart data={candleData} activeIndicators={activeIndicators} colors={{ up: '#00FF9D', down: '#FF0055', bg: '#0A0C10' }} />
                ) : (
                   <DepthChart />
                )}
             </div>
          </div>

          {/* Security & Info Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Security */}
             <div className="glass-card p-6 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-white flex items-center gap-2">
                       <span className="text-primary">🛡️</span> Security Analysis
                    </h3>
                    <div className={`px-2 py-1 rounded text-[10px] font-bold border ${isSafe ? 'border-success/30 text-success bg-success/10' : 'border-accent/30 text-accent bg-accent/10'}`}>
                        SCORE: {token.riskScore}/100
                    </div>
                </div>
                <div className="space-y-4">
                     <div className="flex justify-between items-center py-2 border-b border-white/5">
                         <span className="text-xs text-text-muted">Liquidity Lock</span>
                         <span className="text-xs font-bold text-white">{token.tokenomics.liquidityLockMonths > 0 ? 'Locked 🔒' : 'Unlocked ⚠️'}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-white/5">
                         <span className="text-xs text-text-muted">Mint Authority</span>
                         <span className="text-xs font-bold text-white">{token.revokeMint ? 'Revoked ✅' : 'Active ⚠️'}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-white/5">
                         <span className="text-xs text-text-muted">Top 10 Holders</span>
                         <span className="text-xs font-bold text-white">{isSafe ? '12.5%' : '65.2%'}</span>
                     </div>
                </div>
             </div>

             {/* Bonding Curve */}
             <div className="glass-card p-6 rounded-2xl border border-border">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-white">Bonding Curve</h3>
                   <span className="text-xs font-mono text-primary">{bondingProgress.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-[#151921] rounded-full overflow-hidden mb-4 border border-white/5">
                   <div className="h-full bg-gradient-to-r from-primary to-secondary relative" style={{width: `${bondingProgress}%`}}>
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[2px]"></div>
                   </div>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                   When the market cap reaches <span className="text-white font-bold">$69,000</span>, all liquidity is deposited into Raydium and burned.
                </p>
             </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: TRADE & ORDER BOOK ================= */}
        <div className="lg:col-span-1 flex flex-col gap-6">
           
           {/* Trade Interface */}
           <div className="glass-card p-5 rounded-2xl border border-border bg-[#0E1014]">
              <div className="flex bg-[#151921] p-1 rounded-lg mb-6">
                 <button 
                   onClick={() => setTradeTab('buy')}
                   className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${tradeTab === 'buy' ? 'bg-success text-black shadow-[0_0_10px_rgba(0,255,157,0.3)]' : 'text-text-muted hover:text-white'}`}
                 >
                    Buy
                 </button>
                 <button 
                   onClick={() => setTradeTab('sell')}
                   className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${tradeTab === 'sell' ? 'bg-accent text-white shadow-[0_0_10px_rgba(255,0,85,0.3)]' : 'text-text-muted hover:text-white'}`}
                 >
                    Sell
                 </button>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between text-[10px] text-text-dim font-bold uppercase">
                    <span>Avail</span>
                    <span>{tradeTab === 'buy' ? `${solBalance.toFixed(2)} SOL` : formatCompactNumber(userTokenBalance)}</span>
                 </div>
                 
                 <div className="relative group">
                    <input 
                      type="number" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#151921] border border-border rounded-xl p-4 text-white text-right font-mono font-bold text-lg focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    />
                    <div className="absolute left-4 top-4 text-text-muted text-xs font-bold flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                          {tradeTab === 'buy' ? 'SOL' : token.ticker.slice(0,1)}
                       </div>
                       {tradeTab === 'buy' ? 'SOL' : token.ticker}
                    </div>
                 </div>

                 <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 75, 100].map(pct => (
                       <button 
                         key={pct}
                         onClick={() => {
                            if (tradeTab === 'buy') setAmount((solBalance * (pct/100)).toFixed(4));
                            else setAmount((userTokenBalance * (pct/100)).toFixed(0));
                         }}
                         className="bg-[#151921] hover:bg-[#1F2229] border border-border text-[10px] text-text-muted hover:text-white rounded py-1.5 transition-colors"
                       >
                          {pct}%
                       </button>
                    ))}
                 </div>

                 <div className="space-y-2 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-xs">
                       <span className="text-text-muted">Slippage</span>
                       <span className="text-white font-mono">Auto (0.5%)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="text-text-muted">Network Fee</span>
                       <span className="text-white font-mono">~0.00005 SOL</span>
                    </div>
                 </div>

                 <button 
                   onClick={handleTrade}
                   disabled={isTrading}
                   className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg transition-all transform active:scale-[0.98] ${
                      tradeTab === 'buy' 
                      ? 'bg-success text-black hover:bg-[#00FF9D]/90' 
                      : 'bg-accent text-white hover:bg-[#FF0055]/90'
                   } disabled:opacity-50 disabled:grayscale`}
                 >
                    {isConnected ? (isTrading ? 'SWAPPING...' : 'PLACE ORDER') : 'CONNECT WALLET'}
                 </button>
              </div>
           </div>
           
           {/* Recent Trades Table */}
           <div className="glass-card rounded-2xl flex flex-col flex-1 overflow-hidden min-h-[300px] border border-border bg-[#0E1014]">
              <div className="px-4 py-3 border-b border-border font-bold text-white text-xs uppercase tracking-wider bg-[#151921]">
                 Recent Trades
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                 <table className="w-full text-xs">
                    <thead className="text-text-dim sticky top-0 bg-[#0E1014] z-10">
                       <tr>
                          <th className="text-left p-3 font-medium">Type</th>
                          <th className="text-right p-3 font-medium">Size</th>
                          <th className="text-right p-3 font-medium">SOL</th>
                          <th className="text-right p-3 font-medium">Time</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {trades.map((t, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors font-mono">
                             <td className={`p-3 font-bold uppercase ${t.type === 'buy' ? 'text-success' : 'text-accent'}`}>
                                {t.type}
                             </td>
                             <td className="p-3 text-right text-text-muted">{t.tokens}</td>
                             <td className="p-3 text-right text-white font-bold">{t.amount}</td>
                             <td className="p-3 text-right text-text-dim">{t.date}</td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
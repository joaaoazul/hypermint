
import React, { useState, useEffect, useRef } from 'react';
import { LiveStream } from '../types';
import { useWallet } from '../hooks/useWallet';

interface LivestreamViewProps {
  stream: LiveStream | null;
  onBack: () => void;
  onConnectClick: () => void;
}

interface ChatMessage {
  user: string;
  text: string;
  color: string;
  isTip?: boolean;
  amount?: number;
}

export const LivestreamView: React.FC<LivestreamViewProps> = ({ stream, onBack, onConnectClick }) => {
  const { isConnected, address } = useWallet();
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { user: 'MoonBoi99', text: 'Is this contract audited??', color: '#EF4444' },
    { user: 'SafeDev', text: 'Yes, check the pinned link!', color: '#86EFAC' },
    { user: 'WhaleAlert', text: 'Just aped 50 SOL 🚀', color: '#3B82F6' },
  ]);
  const [unlocked, setUnlocked] = useState(!stream?.isTokenGated && !stream?.pricePerView);
  const [tipAlert, setTipAlert] = useState<{user: string, amount: number} | null>(null);
  
  // Tipping State
  const [isProcessingTip, setIsProcessingTip] = useState(false);
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [customTipAmount, setCustomTipAmount] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages([...messages, { user: 'You', text: chatMessage, color: '#fff' }]);
    setChatMessage('');
  };

  const handleUnlock = () => {
    // Simulating wallet interaction
    setTimeout(() => {
        setUnlocked(true);
    }, 1000);
  };

  const handleTip = async (amount: number) => {
    if (!isConnected) {
        onConnectClick();
        return;
    }
    
    if (amount <= 0) return;

    setIsProcessingTip(true);
    setShowCustomTip(false);
    setCustomTipAmount('');

    // Simulate wallet signing interaction
    setMessages(prev => [...prev, { 
       user: 'System', 
       text: `Requesting wallet signature for ${amount} SOL...`, 
       color: '#9CA3AF' 
    }]);

    try {
        // Simulate network delay / blockchain confirmation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const userLabel = address ? `${address.slice(0,4)}...${address.slice(-4)}` : 'You';
        
        setMessages(prev => [...prev, { 
            user: userLabel, 
            text: `tipped ${amount} SOL! 💎`, 
            color: '#FBBF24',
            isTip: true,
            amount: amount
        }]);

        // Show Flashy Overlay
        setTipAlert({ user: userLabel, amount });

        // Hide Overlay after 4s
        setTimeout(() => {
            setTipAlert(null);
        }, 4000);

    } catch (e) {
        setMessages(prev => [...prev, { 
            user: 'System', 
            text: `Transaction failed.`, 
            color: '#EF4444' 
        }]);
    } finally {
        setIsProcessingTip(false);
    }
  };

  const handleCustomTipSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const val = parseFloat(customTipAmount);
      if (val > 0) handleTip(val);
  };

  if (!stream) return null;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row bg-black overflow-hidden animate-slide-up">
      {/* Video Area */}
      <div className="flex-1 flex flex-col relative bg-gray-900">
         {/* Top Bar Overlay */}
         <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex justify-between items-start">
            <div className="flex items-center gap-4">
               <button onClick={onBack} className="bg-black/50 hover:bg-white/20 p-2 rounded-full text-white backdrop-blur-sm transition-colors">
                  ←
               </button>
               <div>
                  <h2 className="text-white font-bold text-lg drop-shadow-md">{stream.title}</h2>
                  <div className="flex items-center gap-2 text-xs">
                     <span className="text-brand-green font-bold">{stream.hostName}</span>
                     <span className="text-gray-300">• {stream.viewers.toLocaleString()} watching</span>
                  </div>
               </div>
            </div>
            <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-lg animate-pulse">
               LIVE
            </div>
         </div>

         {/* TIP ALERT OVERLAY */}
         {tipAlert && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
               <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border-2 border-yellow-500 shadow-[0_0_100px_rgba(234,179,8,0.6)] animate-[pulse_0.5s_ease-in-out] text-center transform scale-110">
                  <div className="text-6xl mb-4 animate-bounce">💎</div>
                  <div className="text-2xl font-bold text-yellow-500 mb-1 uppercase tracking-widest">{tipAlert.user} TIPPED</div>
                  <div className="text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{tipAlert.amount} SOL</div>
               </div>
            </div>
         )}

         {/* Video Content / Gated State */}
         <div className="flex-1 flex items-center justify-center relative group">
            {!unlocked ? (
               <div className="text-center p-8 max-w-md bg-brand-card/90 backdrop-blur-md rounded-xl border border-brand-input shadow-2xl z-20">
                  <div className="text-4xl mb-4">🔒</div>
                  <h3 className="text-xl font-bold text-white mb-2">Restricted Access</h3>
                  <p className="text-gray-400 mb-6">
                     {stream.isTokenGated 
                        ? `You need ${stream.minTokenBalance} tokens to watch this stream.` 
                        : `This is a premium event. Price: ${stream.pricePerView} SOL.`}
                  </p>
                  <button 
                     onClick={handleUnlock}
                     className="w-full bg-brand-green text-black font-bold py-3 rounded hover:bg-green-400 transition-all shadow-[0_0_15px_rgba(134,239,172,0.3)]"
                  >
                     {stream.isTokenGated ? 'Verify Wallet' : `Pay ${stream.pricePerView} SOL`}
                  </button>
               </div>
            ) : (
               <>
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/20 to-green-900/20 pointer-events-none"></div>
                  {/* Simulated WebRTC Stream */}
                  <img src={stream.thumbnail} className="w-full h-full object-cover opacity-50" alt="Stream" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <span className="text-white/20 text-4xl font-bold uppercase tracking-widest rotate-[-15deg]">Low Latency HLS</span>
                  </div>
               </>
            )}
         </div>

         {/* Bottom Controls */}
         <div className="p-4 bg-gray-900 border-t border-gray-800 flex items-center gap-4">
             <button className="text-white hover:text-brand-green">▶</button>
             <div className="w-24 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="w-full h-full bg-red-500"></div>
             </div>
             <span className="text-xs text-red-500 font-bold">LIVE</span>
             <div className="flex-1"></div>
             <button className="text-gray-400 hover:text-white text-sm">HD</button>
             <button className="text-gray-400 hover:text-white text-sm">⛶</button>
         </div>
      </div>

      {/* Chat Area */}
      <div className="w-full lg:w-80 bg-brand-dark border-l border-brand-input flex flex-col h-[300px] lg:h-auto">
         <div className="p-3 border-b border-brand-input font-bold text-white text-sm flex justify-between items-center">
            <span>Stream Chat</span>
            <span className="text-[10px] text-gray-500">Slow Mode: Off</span>
         </div>
         
         <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-sm" ref={scrollRef}>
            {messages.map((msg, idx) => (
               <div key={idx} className={`break-words ${msg.isTip ? 'bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.1)]' : ''}`}>
                  <span className="font-bold opacity-90" style={{color: msg.color}}>{msg.user}: </span>
                  <span className={msg.isTip ? 'text-yellow-200 font-bold' : 'text-gray-300'}>{msg.text}</span>
               </div>
            ))}
         </div>

         {/* Tipping & Input */}
         <div className="p-4 border-t border-brand-input bg-brand-card relative">
            
            {/* Wallet Info Mini Bar */}
            {isConnected && address && (
               <div className="absolute -top-6 left-0 right-0 bg-brand-card/90 border-t border-brand-input px-3 py-1 flex justify-between items-center text-[10px] text-gray-400">
                   <span>Wallet: {address.slice(0,4)}...{address.slice(-4)}</span>
                   <span className="text-brand-accent">Connected</span>
               </div>
            )}

            {/* Custom Tip Popup */}
            {showCustomTip && (
                <div className="absolute bottom-full left-0 right-0 p-4 bg-brand-card border-t border-brand-input shadow-2xl animate-slide-up z-20">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-white">Custom Tip Amount</span>
                        <button onClick={() => setShowCustomTip(false)} className="text-gray-500 hover:text-white">✕</button>
                    </div>
                    <form onSubmit={handleCustomTipSubmit} className="flex gap-2">
                        <input 
                            type="number" 
                            autoFocus
                            step="0.01"
                            value={customTipAmount}
                            onChange={(e) => setCustomTipAmount(e.target.value)}
                            placeholder="0.00" 
                            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm outline-none focus:border-yellow-500"
                        />
                        <button type="submit" className="bg-yellow-500 text-black font-bold px-4 rounded hover:bg-yellow-400">
                            Send
                        </button>
                    </form>
                </div>
            )}

            {/* Preset Tip Buttons */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
               {[0.1, 0.5, 1.0].map((amt) => (
                  <button 
                     key={amt}
                     onClick={() => handleTip(amt)}
                     disabled={isProcessingTip}
                     className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 rounded px-3 py-1.5 text-xs font-bold hover:bg-yellow-500 hover:text-black transition-all flex items-center gap-1 shrink-0 whitespace-nowrap disabled:opacity-50"
                  >
                     {isProcessingTip ? '...' : `💎 ${amt} SOL`}
                  </button>
               ))}
               <button 
                 onClick={() => setShowCustomTip(!showCustomTip)}
                 className="bg-gray-800 text-gray-300 border border-gray-700 rounded px-3 py-1.5 text-xs font-bold hover:bg-gray-700 hover:text-white transition-colors shrink-0 whitespace-nowrap"
               >
                  Custom
               </button>
               <button className="bg-purple-500/10 text-purple-500 border border-purple-500/30 rounded px-3 py-1.5 text-xs font-bold hover:bg-purple-500 hover:text-white transition-colors shrink-0 whitespace-nowrap ml-auto">
                  🚀 Boost
               </button>
            </div>

            <form onSubmit={handleSendMessage} className="relative">
               <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={isConnected ? "Send a message..." : "Connect wallet to chat..."}
                  disabled={!isConnected}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 px-3 text-white text-sm focus:border-brand-green outline-none pr-8 disabled:opacity-50 disabled:cursor-not-allowed"
               />
               <button type="submit" disabled={!isConnected} className="absolute right-2 top-2 text-gray-400 hover:text-brand-green disabled:opacity-30">
                  ↵
               </button>
            </form>
            
            {!isConnected && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center rounded-lg z-10">
                    <button onClick={onConnectClick} className="bg-brand-accent text-black font-bold text-xs px-4 py-2 rounded shadow-neon hover:scale-105 transition-transform">
                        Connect Wallet to Chat
                    </button>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { useWallet, WalletType } from '../hooks/useWallet';

interface ConnectWalletHubProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WalletOption {
  id: string;
  name: string;
  icon: string; // Using emoji for simplicity in this demo, replace with SVG in prod
  deepLink: string;
  detectedKey: string; // Window object key to check (e.g., 'ethereum')
}

const EVM_WALLETS: WalletOption[] = [
  { id: "metamask", name: "MetaMask", icon: "🦊", deepLink: "https://metamask.io/", detectedKey: "ethereum" },
  { id: "rainbow", name: "Rainbow", icon: "🌈", deepLink: "https://rainbow.me/", detectedKey: "ethereum" },
  { id: "coinbase", name: "Coinbase Wallet", icon: "🔵", deepLink: "https://www.coinbase.com/wallet", detectedKey: "ethereum" },
  { id: "trust", name: "Trust Wallet", icon: "🛡️", deepLink: "https://trustwallet.com/", detectedKey: "trustwallet" },
];

const SOL_WALLETS: WalletOption[] = [
  { id: "phantom", name: "Phantom", icon: "👻", deepLink: "https://phantom.app/", detectedKey: "solana" },
  { id: "solflare", name: "Solflare", icon: "☀️", deepLink: "https://solflare.com/", detectedKey: "solflare" },
  { id: "backpack", name: "Backpack", icon: "🎒", deepLink: "https://backpack.app/", detectedKey: "backpack" },
];

export const ConnectWalletHub: React.FC<ConnectWalletHubProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<WalletType>('evm');
  const { connect, status } = useWallet();
  const [installedWallets, setInstalledWallets] = useState<Record<string, boolean>>({});

  // Auto-detect wallets on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const detected: Record<string, boolean> = {};
      
      // Mock detection for the demo visualization
      detected['metamask'] = true;
      detected['phantom'] = true;
      
      // Real detection logic would look like this:
      // if ((window as any).ethereum) detected['metamask'] = true;
      // if ((window as any).solana) detected['phantom'] = true;
      
      setInstalledWallets(detected);
    }
  }, []);

  if (!isOpen) return null;

  const handleConnect = (wallet: WalletOption) => {
    connect(activeTab, wallet.id);
    // Modal will stay open to show status changes, or close on success via parent effect
  };

  const currentWallets = activeTab === 'evm' ? EVM_WALLETS : SOL_WALLETS;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-[#0E0F12] w-full max-w-md rounded-2xl border border-brand-border shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="p-6 pb-2">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Connect Wallet</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
           </div>

           {/* Tabs */}
           <div className="flex bg-[#161A1E] p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('evm')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                   activeTab === 'evm' ? 'bg-brand-card shadow-lg text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Ethereum (EVM)
              </button>
              <button 
                onClick={() => setActiveTab('solana')}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                   activeTab === 'solana' ? 'bg-brand-card shadow-lg text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Solana
              </button>
           </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 min-h-[300px]">
           
           {status === 'connecting' || status === 'signing' ? (
              <div className="flex flex-col items-center justify-center h-full py-10 space-y-6">
                 <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-brand-accent/20 border-t-brand-accent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xl">
                       {activeTab === 'evm' ? '🦊' : '👻'}
                    </div>
                 </div>
                 <div className="text-center">
                    <h3 className="text-white font-bold text-lg">
                       {status === 'connecting' ? 'Requesting Connection...' : 'Verify Ownership'}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2 max-w-[200px] mx-auto">
                       {status === 'connecting' 
                          ? 'Please approve the connection in your wallet.' 
                          : 'Please sign the message to verify you are the owner.'}
                    </p>
                 </div>
                 {status === 'signing' && (
                    <div className="bg-brand-accent/10 text-brand-accent px-4 py-2 rounded-lg text-xs font-mono border border-brand-accent/20">
                       SIWE/SIWS Signature Request
                    </div>
                 )}
              </div>
           ) : (
              <div className="space-y-3">
                 <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2">
                    {activeTab === 'evm' ? 'Popular EVM Wallets' : 'Solana Ecosystem'}
                 </div>
                 
                 {currentWallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => handleConnect(wallet)}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-[#161A1E] border border-gray-800 hover:border-brand-accent/50 hover:bg-[#1A1D25] transition-all group"
                    >
                       <div className="flex items-center gap-3">
                          <span className="text-2xl">{wallet.icon}</span>
                          <span className="font-bold text-white group-hover:text-brand-accent transition-colors">{wallet.name}</span>
                       </div>
                       
                       {installedWallets[wallet.id] ? (
                          <div className="text-[10px] font-bold bg-green-500/10 text-green-500 px-2 py-0.5 rounded border border-green-500/20 flex items-center gap-1">
                             <span>✓</span> INSTALLED
                          </div>
                       ) : (
                          <div className="text-[10px] font-bold text-blue-500 flex items-center gap-1 group-hover:underline">
                             INSTALL
                             <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </div>
                       )}
                    </button>
                 ))}

                 {activeTab === 'evm' && (
                    <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg flex gap-3">
                       <span className="text-blue-400 text-lg">ℹ️</span>
                       <p className="text-[10px] text-gray-400 leading-relaxed">
                          We use <strong>SIWE (Sign-In with Ethereum)</strong> to securely authenticate you without ever accessing your private keys.
                       </p>
                    </div>
                 )}
              </div>
           )}

        </div>
      </div>
    </div>
  );
};


import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Button } from './components/Button';
import { BondingCurveChart } from './components/BondingCurveChart';
import { Dashboard } from './components/Dashboard';
import { SecurityDashboard } from './components/SecurityDashboard';
import { Marketplace } from './components/Marketplace';
import { AIAssistant } from './components/AIAssistant';
import { ProofOfReserves } from './components/ProofOfReserves';
import { AffiliateDashboard } from './components/AffiliateDashboard';
import { DaoGovernance } from './components/DaoGovernance';
import { GeneratedSitePreview } from './components/GeneratedSitePreview';
import { LivestreamList } from './components/LivestreamList';
import { LivestreamView } from './components/LivestreamView';
import { TokenDetailView } from './components/TokenDetailView';
import { ExecutiveVisionModal } from './components/ExecutiveVisionModal';
import { ConnectWalletHub } from './components/ConnectWalletHub';
import { LiquidityLocker } from './components/LiquidityLocker';
import { TokenMinters } from './components/TokenMinters';
import { Documentation, ApiReference, AuditReports, BugBounty } from './components/DeveloperPages';
import { WalletProvider, useWallet } from './hooks/useWallet';
import { generateTokenMetadata, generateWebsiteContent } from './services/geminiService';
import { TokenFormState, CreatedToken, ViewState, Chain, GeneratedSiteContent, LiveStream } from './types';

// Initial Mock Data (unchanged logic, just style updates downstream)
const INITIAL_MARKET_TOKENS: CreatedToken[] = [
  { 
    id: '1', 
    name: 'Safe Pepe', 
    ticker: 'SPEPE', 
    description: 'The safest frog on Solana. Community driven, zero tax, liquidity burnt.', 
    image: 'https://picsum.photos/seed/pepe/50/50', 
    supply: 1000000000,
    marketCap: 12500, 
    replies: 45, 
    timestamp: Date.now() - 86400000, 
    riskScore: 98, 
    rugProbability: 'Low', 
    isAudited: true, 
    volume24h: 45000, 
    revokeMint: true, 
    revokeFreeze: true, 
    antiBot: true, 
    canBurn: true, 
    canPause: false, 
    isOwnable: false, 
    twitter: '', 
    telegram: '', 
    website: '', 
    tokenType: 'deflationary', 
    tokenomics: { buyTax: 0, sellTax: 0, liquidityLockMonths: 12, marketingWallet: 0, devWallet: 0 }, 
    chain: 'SOL',
    nftConfig: { enabled: true, name: 'Safe Pepe Origins', symbol: 'SPEPENFT', supply: 1000, mintPrice: 0.5, royalty: 5, image: 'https://picsum.photos/seed/pepenft/100/100' }
  },
  { 
    id: '2', 
    name: 'Doge Yield', 
    ticker: 'YIELD', 
    description: 'Staking rewards active. First reflection token on BSC with auto-yield.', 
    image: 'https://picsum.photos/seed/doge/50/50', 
    supply: 1000000,
    marketCap: 8200, 
    replies: 12, 
    timestamp: Date.now() - 3600000, 
    riskScore: 45, 
    rugProbability: 'Medium', 
    isAudited: false, 
    volume24h: 1200, 
    revokeMint: false, 
    revokeFreeze: false, 
    antiBot: false, 
    canBurn: true, 
    canPause: true, 
    isOwnable: true, 
    twitter: '', 
    telegram: '', 
    website: '', 
    tokenType: 'reflection', 
    tokenomics: { buyTax: 5, sellTax: 5, liquidityLockMonths: 1, marketingWallet: 5, devWallet: 5 }, 
    chain: 'BSC',
    nftConfig: { enabled: false, name: '', symbol: '', supply: 0, mintPrice: 0, royalty: 0, image: null }
  },
];

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('create');
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isWalletHubOpen, setIsWalletHubOpen] = useState(false); 

  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [selectedToken, setSelectedToken] = useState<CreatedToken | null>(null);
  const [generatedSiteContent, setGeneratedSiteContent] = useState<GeneratedSiteContent | null>(null);
  
  const [marketTokens, setMarketTokens] = useState<CreatedToken[]>(INITIAL_MARKET_TOKENS);
  const [myTokenIds, setMyTokenIds] = useState<Set<string>>(new Set());

  const { isConnected, status } = useWallet();

  useEffect(() => {
    if (status === 'connected') {
      setIsWalletHubOpen(false);
    }
  }, [status]);

  const [form, setForm] = useState<TokenFormState>({
    name: '',
    ticker: '',
    description: '',
    image: null,
    supply: 1000000,
    twitter: '',
    telegram: '',
    website: '',
    discord: '',
    facebook: '',
    revokeMint: false,
    revokeFreeze: false,
    antiBot: false,
    canBurn: true,
    canPause: false,
    isOwnable: true,
    tokenType: 'standard',
    tokenomics: {
      buyTax: 0,
      sellTax: 0,
      liquidityLockMonths: 6,
      marketingWallet: 2,
      devWallet: 2,
    },
    nftConfig: {
      enabled: false,
      name: '',
      symbol: '',
      supply: 1000,
      mintPrice: 0.1,
      royalty: 5,
      image: null
    },
    chain: 'SOL'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
         setForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAI = async () => {
    if (!form.name) return;
    setIsGenerating(true);
    try {
      const desc = await generateTokenMetadata(form.name, form.ticker || form.name.substring(0, 4).toUpperCase());
      setForm(prev => ({ ...prev, description: desc }));
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
       setIsWalletHubOpen(true);
       return;
    }

    if (!form.name || !form.ticker || !form.description || !form.image) return;

    setIsCreating(true);

    setTimeout(() => {
      const newTokenId = Date.now().toString();
      const newToken: CreatedToken = {
        id: newTokenId,
        name: form.name,
        ticker: form.ticker,
        description: form.description,
        image: form.image,
        supply: form.supply,
        tokenType: 'standard',
        tokenomics: form.tokenomics,
        nftConfig: form.nftConfig,
        chain: form.chain,
        marketCap: 2800, 
        replies: 0,
        timestamp: Date.now(),
        riskScore: 90,
        rugProbability: 'Low',
        isAudited: false,
        volume24h: 0,
        revokeMint: true,
        revokeFreeze: true,
        antiBot: true,
        canBurn: true,
        canPause: false,
        isOwnable: false,
        twitter: form.twitter,
        telegram: form.telegram,
        website: form.website,
        discord: form.discord,
        facebook: form.facebook,
      };

      setMarketTokens(prev => [newToken, ...prev]);
      setMyTokenIds(prev => new Set(prev).add(newTokenId));

      setIsCreating(false);
      
      setForm({
        name: '',
        ticker: '',
        description: '',
        image: null,
        supply: 1000000,
        twitter: '',
        telegram: '',
        website: '',
        discord: '',
        facebook: '',
        revokeMint: false,
        revokeFreeze: false,
        antiBot: false,
        canBurn: true,
        canPause: false,
        isOwnable: true,
        tokenType: 'standard',
        tokenomics: { buyTax: 0, sellTax: 0, liquidityLockMonths: 6, marketingWallet: 2, devWallet: 2 },
        nftConfig: { enabled: false, name: '', symbol: '', supply: 1000, mintPrice: 0.1, royalty: 5, image: null },
        chain: 'SOL'
      });
      
      setCurrentView('marketplace');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const handleTokenUpdate = (updatedToken: CreatedToken) => {
    setMarketTokens(prev => prev.map(t => t.id === updatedToken.id ? updatedToken : t));
    if (selectedToken && selectedToken.id === updatedToken.id) {
        setSelectedToken(updatedToken);
    }
  };

  const showFooter = currentView !== 'generated-site' && currentView !== 'livestream-view';

  // Helper to scroll to top when changing view from footer
  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-text-main font-sans pb-20 relative selection:bg-primary selection:text-black pt-20">
      
      <ExecutiveVisionModal isOpen={isVisionOpen} onClose={() => setIsVisionOpen(false)} />
      <ConnectWalletHub isOpen={isWalletHubOpen} onClose={() => setIsWalletHubOpen(false)} />

      {currentView === 'generated-site' ? (
        <GeneratedSitePreview 
          content={generatedSiteContent} 
          onBack={() => setCurrentView('create')} 
          onDeploy={() => {
            alert('Site deployed to IPFS!');
            setCurrentView('create');
          }}
        />
      ) : currentView === 'livestream-view' ? (
         <LivestreamView 
            stream={selectedStream} 
            onBack={() => setCurrentView('livestream-list')} 
            onConnectClick={() => setIsWalletHubOpen(true)}
         />
      ) : currentView === 'token-detail' && selectedToken ? (
        <>
          <Header 
            currentView={currentView} 
            onNavigate={setCurrentView} 
            onOpenVision={() => setIsVisionOpen(true)}
            onConnectClick={() => setIsWalletHubOpen(true)}
          />
          <TokenDetailView 
            token={selectedToken}
            onBack={() => setCurrentView('marketplace')}
            onConnectClick={() => setIsWalletHubOpen(true)}
            onTokenUpdate={handleTokenUpdate}
          />
          {showFooter && <Footer onNavigate={handleNavigate} />}
        </>
      ) : (
        <>
          <Header 
            currentView={currentView} 
            onNavigate={setCurrentView} 
            onOpenVision={() => setIsVisionOpen(true)}
            onConnectClick={() => setIsWalletHubOpen(true)}
          />

          {currentView === 'dashboard' && <Dashboard onConnectClick={() => setIsWalletHubOpen(true)} />}
          {currentView === 'safety' && <SecurityDashboard />}
          {currentView === 'marketplace' && (
            <Marketplace 
              tokens={marketTokens}
              myTokenIds={myTokenIds}
              onSelectToken={(token) => {
                setSelectedToken(token);
                setCurrentView('token-detail');
              }}
            />
          )}
          {currentView === 'reserves' && <ProofOfReserves />}
          {currentView === 'affiliates' && <AffiliateDashboard />}
          {currentView === 'dao' && <DaoGovernance />}
          {currentView === 'livestream-list' && (
             <LivestreamList onSelectStream={(s) => {
                setSelectedStream(s);
                setCurrentView('livestream-view');
             }} />
          )}

          {/* New Footer Pages */}
          {currentView === 'liquidity-locker' && <LiquidityLocker />}
          {currentView === 'token-minters' && <TokenMinters onNavigate={handleNavigate} />}
          {currentView === 'documentation' && <Documentation />}
          {currentView === 'api-reference' && <ApiReference />}
          {currentView === 'audit-reports' && <AuditReports />}
          {currentView === 'bug-bounty' && <BugBounty />}
          
          {currentView === 'create' && (
          <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
            
            {/* NEW HERO SECTION */}
            <div className="relative mb-20">
               {/* Background Glows */}
               <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none opacity-40"></div>
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none opacity-40"></div>
               
               <div className="text-center max-w-4xl mx-auto animate-slide-up relative z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                     <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                     Hypermint Protocol V2 is Live
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
                     DEPLOY TOKENS <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">AT LIGHTSPEED</span>
                  </h1>
                  <p className="text-text-muted text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed mb-10">
                     The enterprise-grade launchpad for Solana, Ethereum, and Base. 
                     Instant liquidity, AI security audits, and automated bonding curves.
                  </p>
                  
                  {/* Hero Stats */}
                  <div className="flex flex-wrap justify-center gap-8 md:gap-16 border-t border-b border-white/5 py-8 bg-black/20 backdrop-blur-sm">
                     <div className="text-center">
                        <div className="text-3xl font-mono font-bold text-white">$4.2B+</div>
                        <div className="text-xs text-text-muted uppercase tracking-widest mt-1">Total Volume</div>
                     </div>
                     <div className="text-center">
                        <div className="text-3xl font-mono font-bold text-white">125K+</div>
                        <div className="text-xs text-text-muted uppercase tracking-widest mt-1">Tokens Deployed</div>
                     </div>
                     <div className="text-center">
                        <div className="text-3xl font-mono font-bold text-white">&lt;15s</div>
                        <div className="text-xs text-text-muted uppercase tracking-widest mt-1">Deployment Time</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* MAIN INTERFACE GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Command Center Form */}
              <section className="lg:col-span-7 animate-fade-in relative z-10">
                <div className="glass-card rounded-3xl p-1 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 pointer-events-none"></div>
                  
                  {/* Terminal Header */}
                  <div className="bg-[#151921] px-6 py-4 flex items-center justify-between border-b border-white/5 rounded-t-[20px]">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                     </div>
                     <div className="text-xs font-mono text-gray-500">~/deploy-contract.sh</div>
                  </div>

                  <div className="p-8 bg-[#0A0C10]">
                    <form onSubmit={handleSubmit} className="space-y-8">
                      
                      {/* Network Selector */}
                      <div>
                        <label className="block text-text-muted text-xs font-bold uppercase mb-4 tracking-wider">Select Blockchain Infrastructure</label>
                        <div className="grid grid-cols-5 gap-3">
                           {['SOL', 'ETH', 'BSC', 'SUI', 'BASE'].map((chain) => (
                             <button
                               type="button"
                               key={chain}
                               onClick={() => setForm(prev => ({...prev, chain: chain as Chain}))}
                               className={`py-4 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-2 group ${
                                 form.chain === chain 
                                 ? 'bg-primary/10 text-primary border-primary shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                                 : 'bg-[#151921] border-border text-text-dim hover:border-text-muted hover:text-white'
                               }`}
                             >
                               <span className="group-hover:scale-110 transition-transform flex items-center justify-center w-8 h-8">
                                  {chain === 'SOL' && (
                                     <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                           <linearGradient id="sol_grad_select" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                              <stop stopColor="#9945FF"/>
                                              <stop offset="1" stopColor="#14F195"/>
                                           </linearGradient>
                                        </defs>
                                        <path d="M4.94 10.36h21.96c.46 0 .84-.37.84-.82 0-.25-.11-.47-.29-.62L22.1 4.54c-.17-.15-.4-.24-.65-.24H4.28c-.46 0-.84.37-.84.82 0 .25.11.47.29.62l5.35 4.38c.17.15.4.24.65.24zM27.06 13.06H5.1c-.46 0-.84.37-.84.82 0 .25.11.47.29.62l5.35 4.38c.17.15.4.24.65.24h17.18c.46 0 .84-.37.84-.82 0-.25-.11-.47-.29-.62l-5.35-4.38c-.17-.15-.4-.24-.65-.24zM4.94 26.66h21.96c.46 0 .84-.37.84-.82 0-.25-.11-.47-.29-.62l-5.35-4.38c-.17-.15-.4-.24-.65-.24H4.28c-.46 0-.84.37-.84.82 0 .25.11.47.29.62l5.35 4.38c.17.15.4.24.65.24z" fill="url(#sol_grad_select)" />
                                     </svg>
                                  )}
                                  {chain === 'ETH' && (
                                     <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 4V12.87L23.497 16.22L16 3.999V4ZM16 21.968V27.995L23.502 17.616L16 21.968Z" fill="#C0CBF6"/>
                                        <path d="M16 4L8.5 16.22L16 12.87V4ZM16 27.995V21.968L8.5 17.616L16 27.995Z" fill="#C0CBF6"/>
                                        <path d="M16 20.573L23.496 16.22L15.996 12.872V20.573H16Z" fill="#8197EE"/>
                                        <path d="M8.5 16.22L15.998 20.573V12.872L8.5 16.22Z" fill="#8197EE"/>
                                     </svg>
                                  )}
                                  {chain === 'BSC' && (
                                     <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 4L22 10L28 16L22 22L16 28L10 22L4 16L10 10L16 4Z" fill="#F0B90B"/>
                                        <path d="M16 10L19 13L22 10L19 7L16 10Z" fill="#181A20"/>
                                        <path d="M16 22L19 25L16 28L13 25L16 22Z" fill="#181A20"/>
                                        <path d="M10 16L13 19L16 16L13 13L10 16Z" fill="#181A20"/>
                                        <path d="M22 16L19 19L22 22L25 19L22 16Z" fill="#181A20"/>
                                        <circle cx="16" cy="16" r="2" fill="#181A20"/>
                                     </svg>
                                  )}
                                  {chain === 'SUI' && (
                                     <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#3B82F6" fillOpacity="0.1"/>
                                        <path d="M20.5 8C19.5 8 18.6 8.4 18 9C17.4 9.6 17 10.5 17 11.5C17 13.5 18.5 15 20.5 15C21.5 15 22.4 14.6 23 14C23.6 13.4 24 12.5 24 11.5C24 9.5 22.5 8 20.5 8Z" fill="#4DA2FF"/>
                                        <path d="M11.5 17C10.5 17 9.6 17.4 9 18C8.4 18.6 8 19.5 8 20.5C8 22.5 9.5 24 11.5 24C12.5 24 13.4 23.6 14 23C14.6 22.4 15 21.5 15 20.5C15 18.5 13.5 17 11.5 17Z" fill="#4DA2FF"/>
                                        <path d="M22 19C21.4 19 21 19.4 21 20V24H18V21C18 19.9 17.1 19 16 19H14.5C13.7 19 13 18.3 13 17.5V17H16C17.7 17 19 15.7 19 14V11H21V14.5C21 15.3 21.7 16 22.5 16H24V19H22Z" fill="#81C3FF"/>
                                     </svg>
                                  )}
                                  {chain === 'BASE' && (
                                     <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="16" cy="16" r="14" fill="#0052FF"/>
                                        <path d="M16 8C11.5817 8 8 11.5817 8 16C8 20.4183 11.5817 24 16 24" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                                     </svg>
                                  )}
                               </span>
                               {chain}
                             </button>
                           ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-text-muted text-xs font-bold uppercase tracking-wider">Token Name</label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            required
                            className="input-premium w-full rounded-xl p-4 text-white outline-none placeholder-text-dim font-medium"
                            placeholder="e.g. Galactic Credits"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-text-muted text-xs font-bold uppercase tracking-wider">Ticker Symbol</label>
                          <div className="relative">
                            <span className="absolute left-4 top-4 text-text-dim font-bold">$</span>
                            <input
                              type="text"
                              name="ticker"
                              value={form.ticker}
                              onChange={handleInputChange}
                              required
                              className="input-premium w-full rounded-xl p-4 pl-8 text-white outline-none placeholder-text-dim uppercase font-mono font-bold"
                              placeholder="CRED"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-text-muted text-xs font-bold uppercase tracking-wider">Max Supply</label>
                          <input
                            type="number"
                            name="supply"
                            value={form.supply}
                            onChange={handleInputChange}
                            required
                            className="input-premium w-full rounded-xl p-4 text-white outline-none placeholder-text-dim font-mono"
                            placeholder="1000000"
                          />
                      </div>

                      <div className="space-y-2 relative">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-text-muted text-xs font-bold uppercase tracking-wider">Asset Description</label>
                          <button
                            type="button"
                            onClick={handleGenerateAI}
                            disabled={isGenerating}
                            className="text-xs text-primary font-bold hover:text-white transition-colors flex items-center gap-1 bg-primary/5 border border-primary/20 px-3 py-1 rounded-lg"
                          >
                             {isGenerating ? 'Running LLM...' : '✨ Auto-Generate'}
                          </button>
                        </div>
                        <textarea
                          name="description"
                          value={form.description}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          className="input-premium w-full rounded-xl p-4 text-white outline-none resize-none placeholder-text-dim leading-relaxed"
                          placeholder="Describe the utility and vision..."
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="block text-text-muted text-xs font-bold uppercase tracking-wider">Upload Asset Logo</label>
                        <div 
                          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group ${
                            form.image 
                              ? 'border-primary bg-primary/5' 
                              : 'border-border hover:border-primary/50 hover:bg-[#151921]'
                          }`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                          
                          {form.image ? (
                            <div className="relative w-32 h-32 mx-auto shadow-2xl rounded-2xl overflow-hidden border border-primary/50">
                              <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                                 <span className="text-white font-bold text-xs uppercase tracking-widest">Replace</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-4">
                              <div className="h-16 w-16 text-text-dim group-hover:text-primary transition-colors bg-[#0F1218] rounded-2xl flex items-center justify-center border border-border shadow-lg">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                              </div>
                              <div className="text-sm font-bold text-text-muted group-hover:text-white transition-colors">Drag & Drop or Click to Upload</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Socials & Website Section */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <label className="block text-text-muted text-xs font-bold uppercase tracking-wider mb-4">Project Socials (Optional)</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">🌐</span>
                                <input
                                  type="text"
                                  name="website"
                                  value={form.website}
                                  onChange={handleInputChange}
                                  className="input-premium w-full rounded-xl p-3 pl-10 text-sm text-white outline-none placeholder-text-dim"
                                  placeholder="Website URL"
                                />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">
                                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                                </span>
                                <input
                                  type="text"
                                  name="twitter"
                                  value={form.twitter}
                                  onChange={handleInputChange}
                                  className="input-premium w-full rounded-xl p-3 pl-10 text-sm text-white outline-none placeholder-text-dim"
                                  placeholder="X (Twitter)"
                                />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">
                                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0z"/></svg>
                                </span>
                                <input
                                  type="text"
                                  name="telegram"
                                  value={form.telegram}
                                  onChange={handleInputChange}
                                  className="input-premium w-full rounded-xl p-3 pl-10 text-sm text-white outline-none placeholder-text-dim"
                                  placeholder="Telegram Link"
                                />
                             </div>
                          </div>
                          <div className="space-y-1">
                             <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim">
                                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.772-.6083 1.1588a18.2915 18.2915 0 00-5.4868 0 12.64 12.64 0 00-.6177-1.1588.0775.0775 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561 20.03 20.03 0 005.9937 3.0336.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057 13.111 13.111 0 01-1.872-8927.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873 893.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286 20.005 20.005 0 005.9946-3.0336.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
                                </span>
                                <input
                                  type="text"
                                  name="discord"
                                  value={form.discord}
                                  onChange={handleInputChange}
                                  className="input-premium w-full rounded-xl p-3 pl-10 text-sm text-white outline-none placeholder-text-dim"
                                  placeholder="Discord Invite"
                                />
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5">
                        <Button 
                          type={isConnected ? "submit" : "button"}
                          onClick={isConnected ? undefined : () => setIsWalletHubOpen(true)}
                          className="w-full !py-5 !text-lg !rounded-xl" 
                          variant="primary"
                          isLoading={isCreating}
                        >
                          {isConnected ? 'INITIALIZE DEPLOYMENT' : 'CONNECT WALLET TO START'}
                        </Button>
                        <div className="flex justify-between items-center mt-4 text-[10px] text-text-dim uppercase tracking-wider font-mono">
                          <span>Est. Gas Fee: 0.002 {form.chain}</span>
                          <span className="flex items-center gap-1 text-green-500">● System Operational</span>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </section>

              {/* Right Column: Live Preview & Bonding Curve */}
              <section className="lg:col-span-5 space-y-8 animate-fade-in sticky top-28">
                
                {/* Preview Card */}
                <div className="glass-card rounded-3xl p-8 relative group overflow-hidden border-t border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px]"></div>

                    <div className="flex items-center justify-between mb-8 relative z-10">
                       <h3 className="text-text-muted text-xs font-bold uppercase tracking-widest">Live Preview</h3>
                       <div className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-primary">Pending Creation</div>
                    </div>

                    <div className="flex gap-6 relative z-10 mb-8 items-center">
                      <div className="w-24 h-24 shrink-0 bg-[#0A0C10] rounded-2xl overflow-hidden border border-border shadow-2xl flex items-center justify-center">
                        {form.image ? (
                          <img src={form.image} alt={form.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl opacity-20">?</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-white text-3xl tracking-tight mb-1">
                          {form.name || 'Unknown Asset'} 
                        </h4>
                        <div className="flex items-center gap-3">
                           <span className="text-primary font-bold font-mono text-sm tracking-wider border border-primary/20 bg-primary/5 px-2 py-0.5 rounded">
                               ${form.ticker || '---'}
                           </span>
                           <span className="text-xs text-text-dim uppercase tracking-wider font-bold">{form.chain} Network</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-[#0A0C10] border border-white/5 mb-6 relative z-10">
                       <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                             <span className="block text-[10px] text-text-dim uppercase font-bold mb-1">Supply</span>
                             <span className="font-mono text-white">{Number(form.supply).toLocaleString()}</span>
                          </div>
                          <div>
                             <span className="block text-[10px] text-text-dim uppercase font-bold mb-1">Ownership</span>
                             <span className="font-mono text-white">{form.isOwnable ? 'Renounced' : 'Retained'}</span>
                          </div>
                       </div>
                    </div>

                    <p className="text-sm text-text-muted leading-relaxed line-clamp-3 relative z-10 font-light">
                      {form.description || 'No description provided. The contract will be initialized with default parameters.'}
                    </p>
                </div>

                {/* Bonding Curve Simulation */}
                <div className="glass-card p-1 rounded-3xl">
                   <div className="bg-[#0F1218] rounded-[20px] p-6">
                      <BondingCurveChart />
                   </div>
                </div>

              </section>
            </div>
          </main>
          )}
          
          {showFooter && <Footer onNavigate={handleNavigate} />}
          <AIAssistant />
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
};

export default App;

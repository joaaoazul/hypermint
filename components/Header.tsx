import React, { useState } from 'react';
import { ViewState } from '../types';
import { Button } from './Button';
import { useWallet } from '../hooks/useWallet';

interface HeaderProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  onOpenVision: () => void;
  onConnectClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenVision, onConnectClick }) => {
  const { isConnected, address, walletType, disconnect } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'create', label: 'Launchpad', icon: '🚀' },
    { id: 'marketplace', label: 'Terminal', icon: '📊' },
    { id: 'dashboard', label: 'Portfolio', icon: '💼' },
    { id: 'safety', label: 'Security', icon: '🛡️' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-4 pointer-events-none">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Left: Brand Identity */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('create')}
        >
          {/* Logo Container with Glass Effect */}
          <div className="w-12 h-12 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/30">
            {/* Isometric Block Logo */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              <defs>
                <linearGradient id="headerLogoGrad" x1="2" y1="4" x2="22" y2="20" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00F0FF" />
                  <stop offset="1" stopColor="#7000FF" />
                </linearGradient>
              </defs>
              <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" stroke="url(#headerLogoGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors"/>
              <path d="M12 12L20.66 7M12 12L3.34 7M12 12V22" stroke="url(#headerLogoGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="2" fill="white" className="animate-pulse" />
            </svg>
          </div>
          
          <div className="hidden sm:flex flex-col">
             <span className="text-lg font-black tracking-tight text-white leading-none font-sans">
               HYPER<span className="text-primary">MINT</span>
             </span>
             <span className="text-[9px] text-text-muted tracking-[0.3em] font-medium uppercase leading-none mt-1">
               PROTOCOL v2
             </span>
          </div>
        </div>
        
        {/* Center: Dynamic Navigation Island */}
        <nav className="hidden xl:flex items-center gap-1 bg-surface/50 backdrop-blur-2xl px-2 py-2 rounded-2xl border border-white/5 shadow-2xl">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button 
                key={item.id}
                onClick={() => onNavigate(item.id as ViewState)} 
                className={`
                  relative px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2
                  ${isActive 
                    ? 'bg-surface-highlight text-white shadow-inner border border-white/5' 
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 bg-primary rounded-r-full shadow-[0_0_10px_#00F0FF]"></div>}
                <span className={`text-base transition-transform duration-300 ${isActive ? 'scale-110 text-primary' : 'grayscale opacity-70'}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Wallet & Actions */}
        <div className="flex items-center gap-3">
          
          {isConnected ? (
            <div className="relative group pointer-events-auto">
               <button 
                 className="flex items-center gap-3 bg-surface/80 backdrop-blur-md border border-border rounded-xl py-2 px-3 pr-4 shadow-lg hover:border-primary/50 transition-all"
               >
                 <div className="w-8 h-8 rounded-lg bg-[#0E1116] border border-white/5 flex items-center justify-center shadow-inner overflow-hidden relative">
                    {walletType === 'evm' ? (
                       <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="16" cy="16" r="16" fill="#627EEA" fillOpacity="0.2"/>
                          <path d="M16 4V12.87L23.497 16.22L16 3.999V4ZM16 21.968V27.995L23.502 17.616L16 21.968Z" fill="#C0CBF6"/>
                          <path d="M16 4L8.5 16.22L16 12.87V4ZM16 27.995V21.968L8.5 17.616L16 27.995Z" fill="#C0CBF6"/>
                          <path d="M16 20.573L23.496 16.22L15.996 12.872V20.573H16Z" fill="#8197EE"/>
                          <path d="M8.5 16.22L15.998 20.573V12.872L8.5 16.22Z" fill="#8197EE"/>
                       </svg>
                    ) : (
                       <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                             <linearGradient id="sol_grad_header" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#9945FF"/>
                                <stop offset="1" stopColor="#14F195"/>
                             </linearGradient>
                          </defs>
                          <path d="M4.94 10.36h21.96c.46 0 .84-.37.84-.82 0-.25-.11-.47-.29-.62L22.1 4.54c-.17-.15-.4-.24-.65-.24H4.28c-.46 0-.84.37-.84.82 0 .25.11.47.29.62l5.35 4.38c.17.15.4.24.65.24zM27.06 13.06H5.1c-.46 0-.84.37-.84.82 0 .25.11.47.29.62l5.35 4.38c.17.15.4.24.65.24h17.18c.46 0 .84-.37.84-.82 0-.25-.11-.47-.29-.62l-5.35-4.38c-.17-.15-.4-.24-.65-.24zM4.94 26.66h21.96c.46 0 .84-.37.84-.82 0-.25-.11-.47-.29-.62l-5.35-4.38c-.17-.15-.4-.24-.65-.24H4.28c-.46 0-.84.37-.84.82 0 .25.11.47.29.62l5.35 4.38c.17.15.4.24.65.24z" fill="url(#sol_grad_header)" />
                       </svg>
                    )}
                 </div>
                 <div className="flex flex-col items-start">
                    <span className="font-mono text-xs font-bold text-white tracking-wide">
                        {address?.slice(0, 4)}...{address?.slice(-4)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                      <span className="text-[10px] text-text-muted">Connected</span>
                    </div>
                 </div>
               </button>
               
               <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                  <div className="p-1">
                     <button onClick={disconnect} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 rounded-lg font-medium flex items-center gap-2 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Disconnect
                     </button>
                  </div>
               </div>
            </div>
          ) : (
            <Button 
              variant="primary"
              size="md"
              onClick={onConnectClick}
              className="!rounded-xl font-bold shadow-glow hover:shadow-glow-lg"
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            >
              Connect Wallet
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="xl:hidden p-3 text-white bg-surface/80 backdrop-blur-md rounded-xl border border-white/10 shadow-lg active:scale-95 transition-transform"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden absolute top-24 left-4 right-4 bg-[#0A0C10] border border-border rounded-2xl animate-slide-up shadow-2xl z-50 overflow-hidden pointer-events-auto ring-1 ring-white/10">
          <div className="p-2 flex flex-col gap-1">
             {navItems.map((item) => {
               const isActive = currentView === item.id;
               return (
               <button
                 key={item.id}
                 onClick={() => {
                   onNavigate(item.id as ViewState);
                   setMobileMenuOpen(false);
                 }}
                 className={`flex items-center gap-4 p-4 rounded-xl text-sm font-bold transition-all ${
                   isActive
                     ? 'bg-surface-highlight text-primary border-l-4 border-primary' 
                     : 'hover:bg-white/5 text-text-muted hover:text-white'
                 }`}
               >
                 <span className="text-xl">{item.icon}</span>
                 {item.label}
               </button>
             )})}
          </div>
        </div>
      )}
    </header>
  );
};
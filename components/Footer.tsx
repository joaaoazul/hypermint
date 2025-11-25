
import React from 'react';
import { Button } from './Button';
import { ViewState } from '../types';

interface FooterProps {
  onNavigate: (view: ViewState) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-border bg-[#030405] pt-20 pb-10 mt-20 relative z-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Column 1: Brand (4 cols) */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-surface border border-white/10 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <path d="M12 2L20.66 7V17L12 22L3.34 17V7L12 2Z" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 12L20.66 7M12 12L3.34 7M12 12V22" stroke="#00F0FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tighter">HYPER<span className="text-primary">MINT</span></span>
                <span className="block text-[10px] text-text-dim tracking-[0.2em] font-medium uppercase">Protocol V2</span>
              </div>
            </div>
            <p className="text-text-muted text-sm leading-relaxed max-w-sm">
              The enterprise-grade infrastructure for tokenized communities. Deploy, manage, and scale digital assets across Solana, Ethereum, and L2s with institutional security.
            </p>
            <div className="flex gap-3 mt-2">
               {/* Rede X (Twitter) */}
               <a href="#" className="group flex items-center justify-center w-10 h-10 rounded-lg bg-surface border border-white/5 hover:border-primary/50 hover:bg-white/5 transition-all" aria-label="Rede X">
                  <svg className="w-5 h-5 text-text-dim group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
               </a>
               {/* Telegram */}
               <a href="#" className="group flex items-center justify-center w-10 h-10 rounded-lg bg-surface border border-white/5 hover:border-primary/50 hover:bg-white/5 transition-all" aria-label="Telegram">
                  <svg className="w-5 h-5 text-text-dim group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                       <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
               </a>
            </div>
          </div>

          {/* Column 2: Ecosystem (2 cols) */}
          <div className="md:col-span-2">
             <h4 className="text-white font-bold mb-6">Ecosystem</h4>
             <ul className="space-y-4 text-sm text-text-muted">
                <li><button onClick={() => onNavigate('create')} className="hover:text-primary transition-colors text-left">Launchpad</button></li>
                <li><button onClick={() => onNavigate('marketplace')} className="hover:text-primary transition-colors text-left">Marketplace</button></li>
                <li><button onClick={() => onNavigate('liquidity-locker')} className="hover:text-primary transition-colors text-left">Liquidity Locker</button></li>
                <li><button onClick={() => onNavigate('token-minters')} className="hover:text-primary transition-colors text-left">Token Minters</button></li>
             </ul>
          </div>

          {/* Column 3: Developers (2 cols) */}
          <div className="md:col-span-2">
             <h4 className="text-white font-bold mb-6">Developers</h4>
             <ul className="space-y-4 text-sm text-text-muted">
                <li><button onClick={() => onNavigate('documentation')} className="hover:text-primary transition-colors text-left">Documentation</button></li>
                <li><button onClick={() => onNavigate('api-reference')} className="hover:text-primary transition-colors text-left">API Reference</button></li>
                <li><button onClick={() => onNavigate('audit-reports')} className="hover:text-primary transition-colors text-left">Audit Reports</button></li>
                <li><button onClick={() => onNavigate('bug-bounty')} className="hover:text-primary transition-colors text-left">Bug Bounty</button></li>
             </ul>
          </div>

          {/* Column 4: Newsletter (4 cols) */}
          <div className="md:col-span-4 bg-surface rounded-2xl p-6 border border-border">
             <h4 className="text-white font-bold mb-2">Subscribe to Alpha</h4>
             <p className="text-xs text-text-muted mb-4">Get early alerts on trending launches and protocol updates.</p>
             <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-[#030405] border border-border rounded-lg px-4 py-2 text-sm text-white focus:border-primary outline-none flex-1"
                />
                <Button size="sm" variant="primary">Join</Button>
             </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="text-xs text-text-dim">
              © 2025 HyperMint Protocol. All rights reserved.
           </div>
           <div className="flex gap-6 text-xs text-text-muted font-medium">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Cookie Preferences</a>
           </div>
        </div>

      </div>
    </footer>
  );
};

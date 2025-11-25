
import React, { useState } from 'react';
import { Button } from './Button';

// --- Documentation Component ---
export const Documentation: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState('intro');

  const renderContent = () => {
    switch (activeDoc) {
      case 'intro':
        return (
          <div className="animate-fade-in space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Introduction</h1>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Welcome to the official <strong>HyperMint</strong> documentation — the ultimate platform to <strong>create, list, and trade tokens</strong> across multiple blockchains (EVM + Solana).
              </p>
              <div className="p-4 bg-brand-primary/10 border border-primary/20 rounded-lg mb-6">
                <p className="text-sm text-primary">
                  <strong>Target Audience:</strong> Users creating tokens, Developers integrating our SDK, and Auditors verifying security.
                </p>
              </div>
            </div>

            <section>
              <h3 className="text-2xl font-bold text-white mb-4">Module Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Token Creator', desc: 'Deploy ERC-20 / SPL tokens instantly.' },
                  { title: 'Launchpad', desc: 'IDO/ICO tools with whitelist, tiers & vesting.' },
                  { title: 'Marketplace', desc: 'Listings and sales for assets.' },
                  { title: 'Liquidity Locker', desc: 'Secure LP token locking with schedules.' },
                  { title: 'Developers API', desc: 'SDKs, endpoints, and integration examples.' },
                  { title: 'Security', desc: 'Audits, checklists, and bug bounty programs.' }
                ].map((item, i) => (
                  <div key={i} className="bg-[#0A0C10] p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                    <strong className="text-white block mb-1">{item.title}</strong>
                    <span className="text-sm text-gray-400">{item.desc}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        );

      case 'quick-start':
        return (
          <div className="animate-fade-in space-y-8">
            <h1 className="text-4xl font-black text-white mb-6">Quick Start Guide</h1>
            <p className="text-gray-300">Go from zero to deployed token in under 15 minutes.</p>

            <section>
              <h3 className="text-2xl font-bold text-white mb-4">1. Prerequisites</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 ml-2">
                <li>Compatible Wallet (MetaMask, Coinbase, Phantom).</li>
                <li>RPC Endpoints configured (Devnet/Testnet or Mainnet).</li>
                <li><span className="text-red-400">Deployer Key</span> (Server-side only — NEVER commit to repo).</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-white mb-4">2. Create Token (UI)</h3>
              <ol className="list-decimal list-inside text-gray-400 space-y-2 ml-2">
                <li>Navigate to <strong className="text-white">/create</strong>.</li>
                <li>Fill in details: Name (e.g., <code>MyToken</code>), Symbol (<code>MTK</code>), Supply.</li>
                <li>Connect Wallet and sign the transaction (SIWE / SIWS).</li>
                <li>Receive your contract address instantly.</li>
              </ol>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-white mb-4">3. Create via API</h3>
              <div className="bg-[#151921] p-4 rounded-xl border border-white/10 overflow-x-auto">
                <div className="text-xs font-mono text-gray-500 mb-2">POST /api/createToken</div>
                <pre className="text-sm font-mono text-green-400">
{`{
  "name": "MyToken",
  "symbol": "MTK",
  "supply": 1000000,
  "network": "evm"
}`}
                </pre>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-white mb-4">4. Next Steps</h3>
              <div className="flex gap-4">
                <Button size="sm" variant="outline">List on Marketplace</Button>
                <Button size="sm" variant="outline">Lock Liquidity</Button>
              </div>
            </section>
          </div>
        );

      case 'standards':
        return (
          <div className="animate-fade-in space-y-8">
            <h1 className="text-4xl font-black text-white mb-6">Token Standards</h1>
            
            <section>
              <h3 className="text-2xl font-bold text-white mb-4">EVM (ERC-20)</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
                <li><strong>Base:</strong> ERC-20 with 18 decimals.</li>
                <li><strong>Security:</strong> Use OpenZeppelin implementations (Ownable, ReentrancyGuard).</li>
                <li><strong>Features:</strong> Implement <code>permit</code> (EIP-2612) for gas-less UX.</li>
              </ul>
              <div className="bg-[#151921] p-4 rounded-xl border border-white/10 overflow-x-auto">
                <pre className="text-sm font-mono text-blue-300">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SimpleToken is ERC20 {
  constructor(string memory name_, string memory symbol_, uint256 supply, address owner) 
    ERC20(name_, symbol_) 
  {
    _mint(owner, supply * 10**decimals());
  }
}`}
                </pre>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-white mb-4">BSC (BEP-20)</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Fully EVM compatible (fork of ERC-20).</li>
                <li><strong>Gas:</strong> Uses BNB. Low transaction fees & high speed.</li>
                <li>Supports <code>IBEP20</code> interface extensions.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-white mb-4">Base (ERC-20)</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Ethereum Layer 2 built on OP Stack (Coinbase).</li>
                <li>Standard ERC-20 architecture with L2 scalability.</li>
                <li><strong>Gas:</strong> ETH. Secure, low cost, and developer friendly.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-white mb-4">Solana (SPL)</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Use <code>spl-token</code> and Metaplex for metadata.</li>
                <li>Standard decimals: 9.</li>
                <li>Create Associated Token Account (ATA) for deployer.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-white mb-4">Sui (Move)</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
                <li>Written in <strong>Move</strong> smart contract language.</li>
                <li>Object-centric data model (Coin&lt;T&gt;).</li>
                <li>Requires One-Time Witness (OTW) pattern for currency creation.</li>
              </ul>
              <div className="bg-[#151921] p-4 rounded-xl border border-white/10 overflow-x-auto">
                <pre className="text-sm font-mono text-cyan-300">
{`module my_coin::managed {
    use std::option;
    use sui::coin;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct MANAGED has drop {}

    fun init(witness: MANAGED, ctx: &mut TxContext) {
        let (treasury, metadata) = coin::create_currency(
            witness, 6, b"SUI", b"Sui Coin", b"", option::none(), ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury, tx_context::sender(ctx));
    }
}`}
                </pre>
              </div>
            </section>
          </div>
        );

      case 'launchpad':
        return (
          <div className="animate-fade-in space-y-8">
            <h1 className="text-4xl font-black text-white mb-6">Launchpad Guide</h1>
            
            <section>
              <h3 className="text-2xl font-bold text-white mb-4">Core Concepts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-surface rounded-lg border border-white/5">
                    <strong className="text-primary">Round</strong>
                    <p className="text-sm text-gray-400">Sales event with specific price, supply, and duration.</p>
                </div>
                <div className="p-4 bg-surface rounded-lg border border-white/5">
                    <strong className="text-primary">Whitelist</strong>
                    <p className="text-sm text-gray-400">List of eligible wallet addresses.</p>
                </div>
                <div className="p-4 bg-surface rounded-lg border border-white/5">
                    <strong className="text-primary">Vesting</strong>
                    <p className="text-sm text-gray-400">Gradual token release to prevent dumps.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-white mb-4">Create Round (API)</h3>
              <div className="bg-[#151921] p-4 rounded-xl border border-white/10 overflow-x-auto">
                <div className="text-xs font-mono text-gray-500 mb-2">POST /launchpad/rounds</div>
                <pre className="text-sm font-mono text-yellow-400">
{`{
  "name": "Seed Round",
  "tokenAddress": "0xToken...",
  "priceWei": "1000000000000000",
  "start": 1710000000,
  "end": 1710003600,
  "vesting": { "cliff": 30, "duration": 180 }
}`}
                </pre>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-white mb-4">Operational Checklist</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Testnet round verified.</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> KYC rules applied (if necessary).</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Emergency multisig configured.</li>
              </ul>
            </section>
          </div>
        );

      case 'security':
        return (
          <div className="animate-fade-in space-y-8">
            <h1 className="text-4xl font-black text-white mb-6">Security Best Practices</h1>
            
            <section>
              <h3 className="text-2xl font-bold text-white mb-4">1. Smart Contracts</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Use <strong>OpenZeppelin</strong> standards.</li>
                <li>Avoid direct <code>transfer</code> call; use <code>SafeERC20</code>.</li>
                <li><strong>Least Privilege:</strong> Use Multisig (Gnosis Safe) for admin keys.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-white mb-4">2. Deployment Ops</h3>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Use <strong>HSM / MPC</strong> for keys; never plain text env vars.</li>
                <li>Set up on-chain monitoring for large transfers.</li>
              </ul>
            </section>

            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl">
               <h3 className="text-red-400 font-bold mb-4">Technical Checklist</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                  <div>☐ <code>nonReentrant</code> on buy/withdraw</div>
                  <div>☐ SafeERC20 implemented</div>
                  <div>☐ Ownership via Multisig</div>
                  <div>☐ Rate limiting (API + IP)</div>
                  <div>☐ SIWE/SIWS Nonce Validation</div>
                  <div>☐ Bug Bounty Program Live</div>
               </div>
            </div>
          </div>
        );

      case 'governance':
        return (
          <div className="animate-fade-in space-y-8">
            <h1 className="text-4xl font-black text-white mb-6">Governance</h1>
            
            <section>
              <h3 className="text-2xl font-bold text-white mb-4">Models</h3>
              <div className="space-y-4">
                 <div className="bg-[#151921] p-4 rounded-lg">
                    <strong className="text-white">Multisig (Funds)</strong>
                    <p className="text-sm text-gray-400">3-of-5 or 4-of-6 signers required. Mandatory for treasury.</p>
                 </div>
                 <div className="bg-[#151921] p-4 rounded-lg">
                    <strong className="text-white">On-Chain DAO</strong>
                    <p className="text-sm text-gray-400">Token-based voting for protocol parameters. Includes Time-lock.</p>
                 </div>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold text-white mb-4">Proposal Flow</h3>
              <ol className="list-decimal list-inside text-gray-400 space-y-2 ml-2">
                 <li>Proposal Created (Snapshot/On-chain).</li>
                 <li>Debate + Voting Period.</li>
                 <li>Approval &rarr; <strong>Timelock</strong> (48-72h).</li>
                 <li>Execution via Multisig/DAO.</li>
              </ol>
            </section>
          </div>
        );

      default:
        return <div>Select a topic</div>;
    }
  };

  const menuItems = [
    { id: 'intro', label: 'Introduction' },
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'standards', label: 'Token Standards' },
    { id: 'launchpad', label: 'Launchpad Guide' },
    { id: 'security', label: 'Security Best Practices' },
    { id: 'governance', label: 'Governance' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0">
         <div className="sticky top-24 glass-card p-4 rounded-xl border border-border">
            <h3 className="font-bold text-white mb-4 px-2">Documentation</h3>
            <ul className="space-y-1">
               {menuItems.map((item) => (
                  <li key={item.id}>
                     <button 
                        onClick={() => setActiveDoc(item.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                           activeDoc === item.id 
                           ? 'bg-primary/10 text-primary border border-primary/20' 
                           : 'text-text-muted hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                     >
                        {item.label}
                     </button>
                  </li>
               ))}
            </ul>
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
         <div className="glass-card p-8 md:p-12 rounded-2xl border border-border min-h-[800px]">
            {renderContent()}
         </div>
      </div>
    </div>
  );
};

// --- API Reference Component ---
export const ApiReference: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
       <div className="text-center mb-16">
         <h1 className="text-4xl md:text-5xl font-black text-white mb-4">API Reference</h1>
         <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Programmatically interact with the HyperMint Protocol. Manage deployments, fetch market data, and automate liquidity operations.
         </p>
         <div className="mt-8">
            <code className="bg-[#0A0C10] border border-border px-4 py-2 rounded-lg text-primary font-mono text-sm">
               https://api.hypermint.com/v2
            </code>
         </div>
       </div>

       <div className="grid gap-8">
          {[
             { method: 'GET', endpoint: '/tokens', desc: 'List all deployed tokens with pagination and filters.', params: true },
             { method: 'POST', endpoint: '/deploy', desc: 'Deploy a new token contract (Requires API Key).', params: true },
             { method: 'GET', endpoint: '/market/stats', desc: 'Get global protocol statistics and volume.', params: false },
             { method: 'POST', endpoint: '/liquidity/lock', desc: 'Create a new liquidity lock for a pair.', params: true },
          ].map((api, i) => (
             <div key={i} className="glass-card rounded-xl border border-border overflow-hidden">
                <div className="bg-[#151921] px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/5 gap-4">
                   <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded text-xs font-bold uppercase w-16 text-center ${api.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                         {api.method}
                      </span>
                      <span className="font-mono text-white font-bold">{api.endpoint}</span>
                   </div>
                   <span className="text-gray-400 text-sm">{api.desc}</span>
                </div>
                {api.params && (
                   <div className="p-6 bg-[#0A0C10]">
                      <h4 className="text-xs font-bold text-text-dim uppercase tracking-wider mb-4">Parameters</h4>
                      <div className="space-y-3">
                         <div className="flex gap-4 text-sm border-b border-white/5 pb-2">
                            <span className="w-32 font-mono text-primary">chain</span>
                            <span className="text-gray-500">string</span>
                            <span className="text-gray-400">Network identifier (e.g. 'sol', 'eth')</span>
                         </div>
                         <div className="flex gap-4 text-sm border-b border-white/5 pb-2">
                            <span className="w-32 font-mono text-primary">limit</span>
                            <span className="text-gray-500">integer</span>
                            <span className="text-gray-400">Number of results to return (max 100)</span>
                         </div>
                      </div>
                   </div>
                )}
             </div>
          ))}
       </div>
    </div>
  );
};

// --- Audit Reports Component ---
export const AuditReports: React.FC = () => {
   const audits = [
      { id: 'HM-2024-001', firm: 'CertiK', date: 'Oct 15, 2024', score: '98/100', status: 'Passed', link: '#' },
      { id: 'HM-2024-002', firm: 'Hacken', date: 'Sep 22, 2024', score: '10/10', status: 'Passed', link: '#' },
      { id: 'HM-2024-003', firm: 'Trail of Bits', date: 'Aug 05, 2024', score: 'Low Risk', status: 'Passed', link: '#' },
   ];

   return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
         <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6">Security Audits</h1>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
               We prioritize security above all else. Our smart contracts undergo rigorous testing and continuous auditing by industry-leading firms.
            </p>
         </div>

         <div className="glass-card rounded-2xl border border-border overflow-hidden mb-12">
            <table className="w-full text-left">
               <thead className="bg-[#151921] text-text-dim uppercase text-xs">
                  <tr>
                     <th className="px-6 py-4 font-bold">Audit ID</th>
                     <th className="px-6 py-4 font-bold">Firm</th>
                     <th className="px-6 py-4 font-bold">Date</th>
                     <th className="px-6 py-4 font-bold">Score</th>
                     <th className="px-6 py-4 font-bold">Status</th>
                     <th className="px-6 py-4 font-bold text-right">Report</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {audits.map((audit, idx) => (
                     <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white font-mono text-sm">{audit.id}</td>
                        <td className="px-6 py-4 text-white font-bold">{audit.firm}</td>
                        <td className="px-6 py-4 text-gray-400 text-sm">{audit.date}</td>
                        <td className="px-6 py-4 text-primary font-bold">{audit.score}</td>
                        <td className="px-6 py-4">
                           <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-1 rounded text-xs font-bold uppercase">
                              {audit.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="text-sm font-bold text-white hover:text-primary transition-colors flex items-center gap-2 justify-end">
                              <span>📄</span> PDF
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-2xl border border-border">
               <h3 className="font-bold text-white mb-4">Continuous Monitoring</h3>
               <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Beyond static audits, we employ real-time threat detection systems that monitor on-chain activity 24/7. Any suspicious transaction patterns trigger an automated pause on sensitive contract functions to protect user funds.
               </p>
               <div className="flex gap-4 opacity-70">
                  <div className="bg-white/5 px-3 py-1 rounded text-xs">Forta Network</div>
                  <div className="bg-white/5 px-3 py-1 rounded text-xs">OpenZeppelin Defender</div>
               </div>
            </div>
            <div className="glass-card p-8 rounded-2xl border border-border">
               <h3 className="font-bold text-white mb-4">Verification</h3>
               <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  All deployed contracts are automatically verified on Etherscan, Solscan, and BscScan. Users can independently inspect the code and verify the bytecode matches our open-source repositories.
               </p>
               <button className="text-primary text-sm font-bold hover:underline">View GitHub Repository →</button>
            </div>
         </div>
      </div>
   );
};

// --- Bug Bounty Component ---
export const BugBounty: React.FC = () => {
   return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
         <div className="text-center mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 relative z-10">HUNT BUGS.<br/><span className="text-red-500">GET PAID.</span></h1>
            <p className="text-xl text-text-muted max-w-2xl mx-auto relative z-10">
               Help us secure the protocol and earn up to $100,000 per vulnerability. We take security reports seriously and pay out swiftly.
            </p>
            <div className="mt-8 relative z-10">
               <Button variant="danger" size="xl">Submit a Report</Button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            {[
               { severity: 'Critical', payout: '$50,000 - $100,000', color: 'red' },
               { severity: 'High', payout: '$10,000 - $50,000', color: 'orange' },
               { severity: 'Medium', payout: '$1,000 - $10,000', color: 'yellow' },
               { severity: 'Low', payout: '$100 - $1,000', color: 'blue' },
            ].map((tier, i) => (
               <div key={i} className={`glass-card p-6 rounded-2xl border border-${tier.color}-500/30 text-center hover:border-${tier.color}-500 transition-colors`}>
                  <h3 className={`text-2xl font-black text-${tier.color}-500 mb-2`}>{tier.severity}</h3>
                  <p className="text-white font-mono font-bold">{tier.payout}</p>
               </div>
            ))}
         </div>

         <div className="glass-card p-8 md:p-12 rounded-3xl border border-border">
            <h3 className="text-2xl font-bold text-white mb-6">Program Rules & Scope</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <h4 className="text-lg font-bold text-white mb-4">In Scope</h4>
                  <ul className="space-y-3 text-gray-400 text-sm">
                     <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Smart Contracts (Solidity/Rust)</li>
                     <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Protocol Logic Errors</li>
                     <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Liquidity Drain Vulnerabilities</li>
                     <li className="flex items-start gap-2"><span className="text-green-500">✓</span> Governance Bypass</li>
                  </ul>
               </div>
               <div>
                  <h4 className="text-lg font-bold text-white mb-4">Out of Scope</h4>
                  <ul className="space-y-3 text-gray-400 text-sm">
                     <li className="flex items-start gap-2"><span className="text-red-500">✕</span> Frontend UI bugs / Typos</li>
                     <li className="flex items-start gap-2"><span className="text-red-500">✕</span> DDoS Attacks</li>
                     <li className="flex items-start gap-2"><span className="text-red-500">✕</span> Social Engineering / Phishing</li>
                     <li className="flex items-start gap-2"><span className="text-red-500">✕</span> Third-party dependencies</li>
                  </ul>
               </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-white/5">
               <h4 className="font-bold text-white mb-2">Responsible Disclosure</h4>
               <p className="text-gray-400 text-sm leading-relaxed">
                  Please do not discuss any vulnerabilities publicly (including on GitHub, Discord, or X) until they have been resolved and you have received permission from the HyperMint team.
               </p>
            </div>
         </div>
      </div>
   );
};

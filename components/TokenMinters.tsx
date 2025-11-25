
import React, { useState } from 'react';
import { ViewState } from '../types';

interface TokenMintersProps {
  onNavigate: (view: ViewState) => void;
}

export const TokenMinters: React.FC<TokenMintersProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'deflationary' | 'reflection' | 'dao'>('standard');

  const contracts = {
    standard: {
      title: 'Standard ERC-20 / SPL',
      description: 'The industry standard for utility and governance tokens. No taxes, simple transfer logic, highly compatible with all CEXs and DEXs.',
      features: ['Mintable', 'Burnable', 'Pausable', 'Owner Control'],
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HyperStandardToken is ERC20, Ownable {
    constructor(string memory name, string memory symbol, uint256 initialSupply) 
        ERC20(name, symbol) 
        Ownable(msg.sender) 
    {
        _mint(msg.sender, initialSupply * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}`
    },
    deflationary: {
      title: 'Deflationary (Auto-Burn)',
      description: 'Automatically burns a percentage of every transaction, reducing supply over time and increasing scarcity.',
      features: ['Auto-Burn Tax', 'Marketing Tax', 'Liquidity Gen', 'Anti-Whale'],
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HyperDeflationaryToken is ERC20, Ownable {
    uint256 public burnRate = 2; // 2% burn
    
    function _update(address from, address to, uint256 value) internal override {
        uint256 burnAmount = (value * burnRate) / 100;
        uint256 sendAmount = value - burnAmount;
        
        super._update(from, address(0), burnAmount); // Burn
        super._update(from, to, sendAmount);
    }
}`
    },
    reflection: {
      title: 'Reflection (Yield)',
      description: 'Holders earn passive income simply by holding tokens. A tax is collected on transactions and redistributed to all existing holders.',
      features: ['Auto-Staking', 'Reflection Rewards', 'Liquidity Pool Feed', 'SafeMath'],
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HyperReflectionToken {
    // RFI Logic Implementation
    mapping (address => uint256) private _rOwned;
    mapping (address => uint256) private _tOwned;
    uint256 private constant MAX = ~uint256(0);
    uint256 private _tTotal;
    uint256 private _rTotal;
    
    constructor(uint256 supply) {
        _tTotal = supply;
        _rTotal = (MAX - (MAX % _tTotal));
    }
    
    // Distribute fees to all holders via reflection
    function _reflectFee(uint256 rFee, uint256 tFee) private {
        _rTotal = _rTotal - rFee;
        _tFeeTotal = _tFeeTotal + tFee;
    }
}`
    },
    dao: {
      title: 'DAO Governance',
      description: 'Tokens that represent voting power. Includes delegation, proposal creation, and automated execution capabilities.',
      features: ['Votes & Delegation', 'Timelock Integration', 'Proposal Thresholds', 'Snapshot Compatible'],
      code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract HyperGovernanceToken is ERC20, ERC20Permit, ERC20Votes {
    constructor(string memory name, string memory symbol) 
        ERC20(name, symbol) 
        ERC20Permit(name) 
    {}

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Votes) {
        super._update(from, to, value);
    }
}`
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
       <div className="text-center mb-16">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Audited Smart Contracts
         </div>
         <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            TOKEN <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">MINTERS</span>
         </h1>
         <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
            Explore our library of secure, gas-optimized smart contracts. Select a template to view the source code or deploy instantly via the Launchpad.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Sidebar Navigation */}
         <div className="lg:col-span-3 space-y-2">
            {(Object.keys(contracts) as Array<keyof typeof contracts>).map((key) => (
               <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                     activeTab === key 
                     ? 'bg-surface-highlight border-primary text-white shadow-[0_0_15px_rgba(0,240,255,0.1)]' 
                     : 'bg-surface border-border text-text-muted hover:border-white/20 hover:text-white'
                  }`}
               >
                  <span className="font-bold capitalize">{key} Token</span>
                  <span className={`text-xl ${activeTab === key ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'} transition-opacity`}>
                     →
                  </span>
               </button>
            ))}

            <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/5">
               <h4 className="font-bold text-white mb-2">Need a Custom Contract?</h4>
               <p className="text-sm text-gray-400 mb-4">
                  Our Solidity engineers can build bespoke mechanics for your project.
               </p>
               <button className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white font-bold transition-colors">
                  Contact Sales
               </button>
            </div>
         </div>

         {/* Main Content Area */}
         <div className="lg:col-span-9">
            <div className="glass-card rounded-2xl border border-border overflow-hidden">
               {/* Header */}
               <div className="p-8 border-b border-white/5">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                     <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{contracts[activeTab].title}</h2>
                        <p className="text-gray-400">{contracts[activeTab].description}</p>
                     </div>
                     <button 
                        onClick={() => onNavigate('create')}
                        className="bg-primary text-black font-bold px-8 py-3 rounded-xl hover:bg-white transition-colors shadow-lg whitespace-nowrap"
                     >
                        Deploy This Type
                     </button>
                  </div>
                  
                  <div className="flex gap-2 mt-6">
                     {contracts[activeTab].features.map((feat, i) => (
                        <span key={i} className="px-3 py-1 rounded-md bg-[#151921] border border-white/10 text-xs font-mono text-primary">
                           {feat}
                        </span>
                     ))}
                  </div>
               </div>

               {/* Code Viewer */}
               <div className="bg-[#0E1014] p-0 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#1A1D25] border-b border-black">
                     <span className="text-xs font-mono text-gray-500">TokenMinter.sol</span>
                     <button 
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                        onClick={() => navigator.clipboard.writeText(contracts[activeTab].code)}
                     >
                        <span>📋</span> Copy
                     </button>
                  </div>
                  <div className="p-6 overflow-x-auto">
                     <pre className="font-mono text-sm text-gray-300 leading-relaxed">
                        {contracts[activeTab].code}
                     </pre>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

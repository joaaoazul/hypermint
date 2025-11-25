
import React, { useState } from 'react';

export const SafetyDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faq' | 'risk' | 'terms'>('faq');

  const faqItems = [
    {
      q: "What can I do on the platform?",
      a: "You can buy, sell, store, transfer cryptocurrencies, and create your own token instantly without coding."
    },
    {
      q: "Do I need identity verification?",
      a: "Yes. To comply with international KYC/AML standards, we require identity verification for all creators and fiat users."
    },
    {
      q: "Is it safe?",
      a: "Yes. We use institutional-grade custody (MPC), regular external audits, real-time fraud monitoring, and mandatory MFA."
    },
    {
      q: "Can I create a token without coding?",
      a: "Absolutely. Our Token Generator handles the smart contract deployment (ERC-20/SPL) automatically."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-slide-up">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Safety & Documentation</h2>
      
      <div className="flex justify-center gap-4 mb-8 border-b border-gray-800 pb-1">
        {(['faq', 'risk', 'terms'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === tab 
                ? 'border-brand-green text-brand-green' 
                : 'border-transparent text-gray-500 hover:text-white'
            }`}
          >
            {tab === 'faq' ? 'FAQ' : tab === 'risk' ? 'Risk Policy' : 'Terms'}
          </button>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-xl border border-brand-input min-h-[400px]">
        {activeTab === 'faq' && (
          <div className="space-y-6">
            {faqItems.map((item, idx) => (
              <div key={idx} className="border-b border-gray-700 last:border-0 pb-4 last:pb-0">
                <h3 className="text-white font-bold text-lg mb-2">{item.q}</h3>
                <p className="text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="prose prose-invert max-w-none text-gray-300">
            <h3 className="text-xl font-bold text-brand-green mb-4">Risk Disclosure Policy</h3>
            <ul className="list-disc pl-5 space-y-3">
              <li>Investments in crypto assets involve significant risks, including partial or total loss of capital.</li>
              <li>Prices are highly volatile and can move rapidly in short periods.</li>
              <li>Blockchain transactions are irreversible by nature.</li>
              <li>You are solely responsible for protecting your private keys if using a non-custodial wallet.</li>
              <li>We recommend investing only what you can afford to lose.</li>
              <li>The platform does not guarantee profits, future returns, or asset appreciation.</li>
            </ul>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="prose prose-invert max-w-none text-gray-300 text-sm">
            <h3 className="text-xl font-bold text-brand-green mb-4">Terms of Service</h3>
            <p className="mb-4">By accessing MemeLaunch, you agree to the following summary terms:</p>
            <ul className="space-y-2">
              <li><strong>Eligibility:</strong> You must be at least 18 years old.</li>
              <li><strong>Compliance:</strong> You agree to complete KYC/AML verification when requested.</li>
              <li><strong>Suspension:</strong> We reserve the right to suspend suspicious accounts to prevent fraud.</li>
              <li><strong>Fees:</strong> All transaction fees are transparently displayed before confirmation.</li>
              <li><strong>Liability:</strong> The company is not liable for market losses or user errors.</li>
              <li><strong>Creation:</strong> Token creation and its legal implications are the sole responsibility of the user.</li>
            </ul>
            <p className="mt-6 text-gray-500 text-xs italic">Last updated: October 2023</p>
          </div>
        )}
      </div>
    </div>
  );
};

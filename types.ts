

export type ViewState = 'create' | 'dashboard' | 'safety' | 'marketplace' | 'reserves' | 'affiliates' | 'dao' | 'generated-site' | 'livestream-list' | 'livestream-view' | 'token-detail' | 'liquidity-locker' | 'token-minters' | 'documentation' | 'api-reference' | 'audit-reports' | 'bug-bounty';
export type TokenType = 'standard' | 'deflationary' | 'reflection' | 'dao';
export type Chain = 'SOL' | 'ETH' | 'BASE' | 'ARB' | 'BSC' | 'SUI';

export interface TokenomicsConfig {
  buyTax: number;
  sellTax: number;
  liquidityLockMonths: number;
  marketingWallet: number; // % of supply
  devWallet: number; // % of supply
}

export interface NftConfig {
  enabled: boolean;
  name: string;
  symbol: string;
  supply: number;
  mintPrice: number;
  royalty: number;
  image: string | null; // Base64
}

export interface TokenFormState {
  name: string;
  ticker: string;
  description: string;
  image: string | null; // Base64 string
  supply: number; // Added field
  twitter: string;
  telegram: string;
  website: string;
  discord: string;
  facebook: string;
  // Safety & Security Options
  revokeMint: boolean;
  revokeFreeze: boolean;
  antiBot: boolean;
  // Advanced ERC-20 Features
  tokenType: TokenType;
  canBurn: boolean;
  canPause: boolean;
  isOwnable: boolean;
  // Visual Tokenomics
  tokenomics: TokenomicsConfig;
  // NFT Launchpad
  nftConfig: NftConfig;
  chain: Chain;
}

export interface CreatedToken {
  id: string;
  name: string;
  ticker: string;
  description: string;
  image: string | null;
  supply: number; // Added field
  tokenType: TokenType;
  tokenomics: TokenomicsConfig;
  nftConfig: NftConfig;
  chain: Chain;
  // Metrics
  marketCap: number;
  replies: number;
  timestamp: number;
  riskScore: number; // 0-100 (Higher is safer)
  rugProbability: 'Low' | 'Medium' | 'High';
  isAudited: boolean;
  volume24h: number;
  // Flags
  revokeMint: boolean;
  revokeFreeze: boolean;
  antiBot: boolean;
  canBurn: boolean;
  canPause: boolean;
  isOwnable: boolean;
  twitter: string;
  telegram: string;
  website: string;
  discord?: string;
  facebook?: string;
}

export interface TokenComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timestamp: number;
  likes: number;
  image?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: number;
}

export interface ReserveData {
  asset: string;
  balance: number;
  valueUsd: number;
  address: string;
  custodian: 'Fireblocks' | 'BitGo' | 'ColdStorage';
  lastAudit: string;
}

export interface ReferralStats {
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  referrals: number;
  earningsSol: number;
  nftId: string;
  rank: number;
}

export interface DaoProposal {
  id: string;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  status: 'Active' | 'Passed' | 'Rejected';
  endDate: number;
  category: 'Feature' | 'Treasury' | 'Security';
}

export interface GeneratedSiteContent {
  heroHeadline: string;
  heroSubheadline: string;
  aboutTitle: string;
  aboutText: string;
  roadmapSteps: { title: string; description: string }[];
  features: { title: string; icon: string }[];
  colorPalette: { primary: string; secondary: string; background: string };
}

export interface LiveStream {
  id: string;
  hostName: string;
  title: string;
  viewers: number;
  thumbnail: string;
  isTokenGated: boolean;
  minTokenBalance?: number;
  pricePerView?: number; // In SOL
  tags: string[];
}

export interface SecurityLog {
  id: string;
  timestamp: number;
  type: 'INFO' | 'WARN' | 'CRIT' | 'SUCCESS';
  source: 'FIREWALL' | 'AI_AGENT' | 'BLOCKCHAIN' | 'USER_AUTH';
  message: string;
}

export interface SecurityAlert {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  status: 'detecting' | 'mitigating' | 'resolved';
  details: string;
}
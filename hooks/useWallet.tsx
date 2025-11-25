import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

// Types for the simulation
export type WalletType = 'evm' | 'solana';
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'signing';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  walletType: WalletType | null;
  status: ConnectionStatus;
  connect: (type: WalletType, providerId: string) => Promise<void>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | null>(null);

// MOCK CONSTANTS
const MOCK_EVM_ADDRESS = "0x71C...9A23";
const MOCK_SOL_ADDRESS = "HN7c...k2L9";

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [walletType, setWalletType] = useState<WalletType | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  // Simulate auto-reconnect on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('wallet_session');
    if (savedSession) {
      const { type, addr } = JSON.parse(savedSession);
      setWalletType(type);
      setAddress(addr);
      setStatus('connected');
    }
  }, []);

  const connect = useCallback(async (type: WalletType, providerId: string) => {
    setStatus('connecting');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate SIWE/SIWS Signing Flow
    setStatus('signing');
    await new Promise(resolve => setTimeout(resolve, 1500));

    const addr = type === 'evm' ? MOCK_EVM_ADDRESS : MOCK_SOL_ADDRESS;
    
    setWalletType(type);
    setAddress(addr);
    setStatus('connected');
    
    // Save session
    localStorage.setItem('wallet_session', JSON.stringify({ type, addr }));
  }, []);

  const disconnect = useCallback(() => {
    setStatus('disconnected');
    setWalletType(null);
    setAddress(null);
    localStorage.removeItem('wallet_session');
  }, []);

  const signMessage = useCallback(async (message: string) => {
    // In a real app, this would trigger the wallet's sign method
    return "0x_mock_signature_generated_by_wallet";
  }, []);

  return (
    <WalletContext.Provider value={{
      isConnected: status === 'connected',
      address,
      chainId: walletType === 'evm' ? 1 : 101, // 1=Eth Mainnet, 101=Solana Mainnet
      walletType,
      status,
      connect,
      disconnect,
      signMessage
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
};
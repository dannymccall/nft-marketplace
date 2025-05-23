// context/WalletContext.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import { useNotification } from './NotificationContext';
import { useNetworkStatus } from '@/app/hooks/useNetwork';
type WalletContextType = {
  account: string | null;
  web3: Web3 | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  isOnline: boolean
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const {showToast} = useNotification()
  const isOnline = useNetworkStatus();
  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const provider = (window as any).ethereum;
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        const selectedAccount = accounts[0];

        const w3 = new Web3(provider);
        setWeb3(w3);
        setAccount(selectedAccount);

        await localStorage.setItem('walletAddress', selectedAccount);

        // Listen for account changes
        provider.on('accountsChanged', async (accounts: string[]) => {
          const newAccount = accounts[0] || null;
          setAccount(newAccount);
          if (newAccount) {
            await localStorage.setItem('walletAddress', newAccount);
          } else {
            await localStorage.removeItem('walletAddress');
          }
          window.location.reload();
        });

        provider.on('chainChanged', () => {
          window.location.reload();
        });
      } else {
        showToast('Please install MetaMask.', "info")
      }
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      showToast(error.message, "error")

    }
  };

  const initWallet = async () => {
    try {
      const storedAccount = await localStorage.getItem('walletAddress');
      if (storedAccount) {
        setAccount(storedAccount);
        if ((window as any).ethereum) {
          const w3 = new Web3((window as any).ethereum);
          setWeb3(w3);
        }
      }
    } catch (error) {
      console.error('Failed to initialize wallet:', error);
    }
  };

  useEffect(() => {
    initWallet();
  }, []);

  // useEffect(() => {
  //   const isOnline = navigator.onLine;
  //   console.log(isOnline)
  //   if(!isOnline) {
  //     setIsOnline(isOnline)
  //     return;
  //   }
  // }, [navigator]);

  return (
    <WalletContext.Provider value={{ account, web3, isConnected: !!account, connectWallet, isOnline }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

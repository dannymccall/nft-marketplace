"use client"
import { useEffect, useState } from "react";
import Web3 from "web3";

declare global {
  interface Window {
    ethereum: any;
  }
}

const SEPOLIA_CHAIN_ID = process.env.NEXT_PUBLIC_SEPOLIA_CHAIN_ID; // Sepolia's chain ID in hex

export const useWeb3Contract = (contractAddress: string, contractABI: any) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed.");
      return;
    }

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    console.log({chainId})
    if (chainId !== SEPOLIA_CHAIN_ID) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
        setIsCorrectNetwork(true);
      } catch (err) {
        console.error("Failed to switch network:", err);
        setIsCorrectNetwork(false);
        return;
      }
    } else {
      setIsCorrectNetwork(true);
    }

    const web3Instance = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

    setWeb3(web3Instance);
    setAccount(accounts[0]);
    console.log({account})
    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
    setContract(contractInstance);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

  return {
    connectWallet,
    web3,
    contract,
    account,
    isCorrectNetwork,
  };
};

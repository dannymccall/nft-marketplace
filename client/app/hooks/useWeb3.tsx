import { useEffect, useState } from "react";
import Web3 from "web3";

export function useWeb3() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (typeof window !== "undefined" && (window as any).ethereum) {
          const provider = (window as any).ethereum;

          // Request wallet connection
          const accounts = await provider.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]);

          const w3 = new Web3(provider);
          setWeb3(w3);

          // Reload on wallet or network change
          provider.on("accountsChanged", () => window.location.reload());
          provider.on("chainChanged", () => window.location.reload());
        } else {
          setError("MetaMask not detected");
        }
      } catch (err: any) {
        console.error("Web3 init failed:", err);
        setError(err.message || "Web3 initialization error");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  return { web3, account, isLoading, error, setAccount };
}

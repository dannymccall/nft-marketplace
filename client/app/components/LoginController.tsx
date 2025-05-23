import React, { useEffect } from "react";
import Modal from "./Modal";
import Logo from "@/public/mint_logo.png";
import Image from "next/image";
import { useState } from "react";
import MetaMask from "@/public/metamask.png";
import { TiArrowForwardOutline } from "react-icons/ti";
import Web3 from "web3";
import { useAuth } from "@/app/context/AuthContext";
import { useWeb3 } from "@/app/hooks/useWeb3";
import { useWallet } from "@/app/context/WallatContext";
import { useNotification } from "../context/NotificationContext";
interface LoginControllerProps {
  modalOpen?: boolean;
  setModalOpen: (open: boolean) => boolean | void;
}

interface Window {
  ethereum: any;
}

declare global {
  interface Window {
    ethereum: any;
  }
}

const LoginController = ({ modalOpen, setModalOpen }: LoginControllerProps) => {
  // const [account, setAccount] = useState("");
  // const [web3, setWeb3] = useState<Web3 | null>(null);
  const [pending, setPending] = useState<boolean>(false);
  const { showToast } = useNotification();
  // const { web3, account, isLoading, error, setAccount } = useWeb3();
  const { account, connectWallet, isConnected, web3 } = useWallet();

  const { login } = useAuth();

  const signMessage = async (address: string, message: string) => {
    try {
      // const hexMessage = `0x${Buffer.from(message, 'utf8').toString('hex')}`;
      const signature = await web3?.eth.personal.sign(message, address, "");

      return signature;
    } catch (error: any) {
      console.error("MetaMask signing failed:", error);
      throw error;
    }
  };

  const connectAndLogin = async () => {
    if (!web3) {
      showToast("Please install MetaMask and try again!!!", "error");
      return;
    }

    try {
      setPending(true);

      // Step 1: Get nonce from your backend
      const res = await fetch("/api/auth/nonce?address=" + account);
      const { nonce } = await res.json();
      // Step 2: Sign nonce with MetaMask

      const message = `Login nonce: ${nonce}`;
      const signature = await signMessage(account as string, message);
      // Step 3: Send signature to backend to verify
      const verifyRes = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: account, signature }),
      });

      const data = await verifyRes.json();
      if (data.success) {
        showToast("Login successful!", "success");
        setPending(false);
        setModalOpen(false);
        login(data.user);
      } else {
        setPending(false);
        showToast("Signature verification failed, try again", "error");
        return;
      }
    } catch (err: any) {
      console.error("MetaMask login failed:", err);
      showToast(err.message, "success")
    }
  };
  return (
    <div>
      <Modal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        onClose={() => {}}
        width="max-w-md"
      >
        <div className="flex flex-col items-center justify-center p-6 rounded-lg">
          <Image
            src={Logo}
            alt="Logo"
            width={100}
            height={100}
            className="mb-4"
          />
          <h2 className="lg:text-2xl md:text-xl sm:text-base font-bold mb-4 text-slate-800 font-sans">
            Connect to DreamMint
          </h2>
          <button
            className="btn text-slate-800 gap-4  rounded-lg px-4 py-2 flex items-center justify-center mb-4 w-max"
            onClick={connectAndLogin}
            disabled={pending}
          >
            <Image
              src={MetaMask}
              alt="MetaMask"
              width={30}
              height={30}
              className="mr-2"
            />
            MetaMask
            {pending && (
              <span className="loading loading-spinner text-primary"></span>
            )}
          </button>
          <div className="flex items-center justify-center my-8">
            <div className="w-full border-t border-gray-600" />
            <span className="px-4 text-sm text-gray-400 uppercase">or</span>
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="w-full mb-4 border-2 shadow-lg rounded-md focus:ring flex items-center justify-between p-2">
            <input
              type="email"
              placeholder="Continue with Email"
              className="mt-1 w-full  text-slate-700 focus:outline-none"
            />
            <TiArrowForwardOutline
              className="bg-[#302b63] rounded-md cursor-pointer hover:scale-110 transition-all duration-300"
              size={25}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LoginController;

"use client";
import { useWallet } from "@/app/context/WallatContext";

export default function WalletChecker({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOnline } = useWallet();
    console.log("isOnline", isOnline);
  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#302b63] text-white">
        <h1 className="text-3xl font-bold text-white">
          No Internet Connection
        </h1>
        <p className="text-lg text-gray-400 text-center">
          Please connect to the internet and refresh the page
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

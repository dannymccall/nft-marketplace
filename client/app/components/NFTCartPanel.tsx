"use client";
import { useNFTCart } from "@/app/context/CartContext";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import LoginController from "./LoginController";
import { stringifyBigInts } from "../lib/helperFunctions";
import { buyNFT as buyNFTFromContract } from "../lib/helperFunctions";
import { useNotification } from "../context/NotificationContext";
import { AiFillCloseCircle } from "react-icons/ai";
import { useHandleSendToBackend } from "../hooks/useSendToBackend";
import { useRouter } from "next/navigation";
import { useWallet } from "../context/WallatContext";
export default function NFTCartPanel() {
  const { items, removeItem, isOpen, toggleCart } = useNFTCart();
  const total = items.reduce((sum, nft) => sum + nft.price, 0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { user } = useAuth();
  const { showToast } = useNotification();
  const { sendListingToBackend } = useHandleSendToBackend();
  const {account} = useWallet();
  const router = useRouter();
  const buyNFT = async (
    tokenId: number,
    price: number,
    listId: number,
    id: string
  ) => {
    try {
      console.log(`Buying...  ${tokenId} ${price} ${listId}`);

      const receipt = await buyNFTFromContract(tokenId, price, listId); // this can throw
      console.log(receipt);

      const safeTransaction = stringifyBigInts(receipt);

      await sendListingToBackend(
        { receipt: safeTransaction, listId: listId, service: "buyListing",address: account! },
        `/api/listing?service=buyListing`
      );
      removeItem(id);
      router.refresh();
    } catch (error: any) {
      console.error("Error in buyNFT:", error);
      showToast(error.message || "Failed to buy NFT", "error");
    }
  };

  return (
    <>
      <LoginController modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <div
        className={`fixed top-0 right-0 h-full bottom-0 z-50  w-full md:w-1/2 lg:w-1/3 bg-[#302b63] text-slate-200 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-500 flex justify-between items-center">
          <h2 className="text-xl font-bold">Check Out</h2>
          <button onClick={toggleCart} className="cursor-pointer">
            {/* <p className="flex items-center justify-center top-1 right-1 bg-slate-50 rounded-full text-[#302b63] w-6 h-6 text-lg font-bold leading-none"> */}
            <AiFillCloseCircle size={25} />

            {/* </p> */}
          </button>
        </div>

        {/* NFT List */}
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-240px)] mb-auto">
          {items.length === 0 ? (
            <p className="text-slate-400">Your cart is empty.</p>
          ) : (
            items.map((nft) => (
              <div
                key={nft.id}
                className="flex flex-col gap-2 border border-slate-600 rounded-lg p-3"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    width={300}
                    height={300}
                    className="w-16 h-16 object-cover rounded border border-slate-400"
                  />
                  <div className="flex-1">
                    <h3 className="text-md font-semibold">{nft.name}</h3>
                    {nft.edition && (
                      <p className="text-slate-400 text-sm">
                        Edition {nft.edition}
                      </p>
                    )}
                    <p className="text-sm">Ξ {nft.price} ETH</p>
                  </div>
                  <button
                    onClick={() => removeItem(nft.id)}
                    className="text-red-400 text-xs hover:text-red-300 cursor-pointer tooltip"
                    data-tip="Remove"
                  >
                    Remove
                  </button>
                </div>
                <button
                  onClick={() =>
                    buyNFT(nft.tokenId, nft.price, nft.listId, nft.id)
                  }
                  className="bg-slate-200 text-[#302b63] font-bold py-2 px-4 rounded hover:bg-slate-100 cursor-pointer text-sm w-full"
                >
                  Buy this NFT
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-slate-500">
            <div className="flex justify-between mb-4 font-bold text-lg">
              <span>Total:</span>
              <span>Ξ {total} ETH</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

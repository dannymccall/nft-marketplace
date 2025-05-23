"use client";
import React from "react";
import { NFTProps } from "../lib/types";
import { useNFTCart } from "../context/CartContext";

interface NFTActionButtonsProps {
  nft: NFTProps;
  showBuy?: boolean;
  showList?: boolean;
  showCancel?: boolean;
  onBuy?: (nft: NFTProps) => void;
  onList?: (nft: NFTProps) => void;
  onCancel?: (nft: NFTProps) => void;
}

const NFTActionButtons: React.FC<NFTActionButtonsProps> = ({
  nft,
  showBuy,
  showList,
  showCancel,
  onBuy,
  onList,
  onCancel,
}) => {
  const { addItem } = useNFTCart();

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
      <h1 className="w-full sm:w-24 text-gray-400 text-sm">Action:</h1>

      {showBuy && (
        <button
          onClick={() =>
            onBuy
              ? onBuy(nft)
              : addItem({
                  id: nft._id,
                  name: nft.name,
                  image: nft.image,
                  price: nft.price,
                  tokenId: parseInt(nft.tokenId),
                  listId: nft.listId,
                })
          }
          className="bg-[#1c1b29] text-slate-50 rounded-sm px-3 py-1 text-sm shadow-md hover:scale-105 border border-gray-700 hover:bg-[#242338] transition-transform duration-300 cursor-pointer"
        >
          Buy NFT
        </button>
      )}

      {showList && (
        <button
          onClick={() => onList?.(nft)}
          className="bg-green-700 text-slate-50 rounded-sm px-3 py-1 text-sm shadow-md hover:scale-105 border border-gray-700 hover:bg-green-800 transition-transform duration-300 cursor-pointer"
        >
          List NFT
        </button>
      )}

      {showCancel && (
        <button
          onClick={() => onCancel?.(nft)}
          className="bg-red-700 text-slate-50 rounded-sm px-3 py-1 text-sm shadow-md hover:scale-105 border border-gray-700 hover:bg-red-800 transition-transform duration-300 cursor-pointer"
        >
          Cancel Listing
        </button>
      )}
    </div>
  );
};

export default NFTActionButtons;

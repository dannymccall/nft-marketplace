"use client";
import React from "react";
import { ListingProps, NFTProps } from "../lib/types";
import { useNFTCart } from "../context/CartContext";

type ActionContext = "listing-page" | "profile-page";

type NFTActionButtonsProps =
  | {
      context: "listing-page";
      data: ListingProps;
      showBuy?: boolean;
      showCancel?: boolean;
      onBuy?: (listing: ListingProps) => void;
      onCancel?: (listing: ListingProps) => void;

    }
  | {
      context: "profile-page";
      data: ListingProps | NFTProps;
      showList?: boolean;
      showCancel?: boolean;
      onList?: (nft: NFTProps) => void;
      onCancel?: (nft: NFTProps) => void;
    };


const NFTActionButtons: React.FC<NFTActionButtonsProps> = (props) => {
  const { addItem } = useNFTCart();

  const isListing = props.context === "listing-page";
  const isProfile = props.context === "profile-page";

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
      <h1 className="w-full sm:w-24 text-gray-400 text-sm">Action:</h1>

      {isListing && props.showBuy  && (
        <button
          onClick={() =>
            props.onBuy
              ? props.onBuy(props.data as ListingProps)
              : addItem({
                  id: props.data._id,
                  name: props.data.nft.name,
                  image: props.data.nft.image,
                  price: props.data.price,
                  tokenId: parseInt(props.data.nft.tokenId),
                  listId: props.data.listId
                })
          }
          className="bg-[#1c1b29] text-slate-50 rounded-sm px-3 py-1 text-sm shadow-md hover:scale-105 border border-gray-700 hover:bg-[#242338] transition-transform duration-300 cursor-pointer"
        >
          Buy NFT
        </button>
      )}

      {isListing && props.showCancel && "onCancel" in props && (
        <button
          onClick={() => props.onCancel?.(props.data as ListingProps)}
          className="bg-red-700 text-slate-50 rounded-sm px-3 py-1 text-sm shadow-md hover:scale-105 border border-gray-700 hover:bg-red-800 transition-transform duration-300 cursor-pointer"
        >
          Cancel Listing
        </button>
      )}

      {isProfile && props.showList && "onList" in props && "name" in props.data && (
        <button
          onClick={() => props.onList?.(props.data as NFTProps)}
          className="bg-green-700 text-slate-50 rounded-sm px-3 py-1 text-sm shadow-md hover:scale-105 border border-gray-700 hover:bg-green-800 transition-transform duration-300 cursor-pointer"
        >
          List NFT
        </button>
      )}

      {isProfile && props.showCancel && "onCancel" in props  && (
        <button
          onClick={() => props.onCancel?.(props.data as NFTProps)}
          className="bg-red-400 text-slate-900 font-semibold rounded-sm px-3 py-1 text-sm shadow-md hover:scale-105 border border-gray-700 hover:bg-red-800 transition-transform duration-300 cursor-pointer"
        >
          Cancel Listing
        </button>
      )}

      {
        isProfile && !props.showCancel && !props.showList && 
         (
          <p className="text-gray-400 text-sm border border-gray-700 px-3 py-1 rounded-sm">No actions available</p>
        )
      }
    </div>
  );
};


export default NFTActionButtons;

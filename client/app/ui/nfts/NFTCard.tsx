"use client";
import Image from "next/image";

import React from "react";
import { NFTProps } from "@/app/lib/types";
import { useNFTCart } from "@/app/context/CartContext";
import { isOwner, makeRequest, toCapitalized } from "@/app/lib/helperFunctions";
import { FiCheck, FiCopy } from "react-icons/fi";
import { useHandleCopy } from "@/app/hooks/useCopy";
import { useWallet } from "@/app/context/WallatContext";
import { listNFT, approve, checkApproved } from "@/app/lib/helperFunctions";
import NFTActionButtons from "@/app/components/NFTActionButtons";
import { stringifyBigInts } from "@/app/lib/helperFunctions";
import { useNotification } from "@/app/context/NotificationContext";

interface INFT {
  nft: NFTProps;
}

const NFTCard = ({ nft }: INFT) => {
  const { addItem } = useNFTCart();
  const { copyToClipboard, setCopied, copied } = useHandleCopy();
  const { account } = useWallet();
  const {showToast} = useNotification()

  const handleListNFT = async (nft: NFTProps) => {
    const tokenId = parseInt(nft.tokenId);
    try{
      const needsApproval = await checkApproved(tokenId);
      console.log({needsApproval})
      if(!needsApproval) await approve(tokenId);
      const receipt = await listNFT(tokenId, `${nft.price}`);
      console.log(receipt);
      const listId = receipt.events?.NFTListed.returnValues.id!.toString();
      const safeTransaction = stringifyBigInts(receipt);
      const response = await makeRequest(`/api/nft?service=listNFT`, {
        method: "POST",
        body: JSON.stringify({
          receipt: safeTransaction,
          data: { tokenId, listId },
        }),
      });

      if(response.success){
        showToast(response.message, "success");
      }
    }catch(error: any){
      console.log(error.message)
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 overflow-x-auto mb-5">
      <div className="w-full h-[650px]">
        <Image
          src={nft.image}
          alt={`NFT ${nft.name}`}
          width={700}
          height={700}
          // fill
          className="w-full h-full  shadow-md rounded-md"
        />
      </div>
      <div className="w-full bg-[#1c1b29] overflow-x-auto">
        <section className="p-4 rounded-md gap-5 flex flex-col border border-gray-600 overflow-x-auto">
          <h1>NFT Details</h1>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            <h1 className="w-full sm:w-24 text-gray-400 text-sm">Name:</h1>
            <p className="text-gray-400 text-sm border border-gray-600 py-1 px-3 rounded-sm w-full sm:w-auto">
              {toCapitalized(nft.name)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            <h1 className="w-full sm:w-24 text-gray-400 text-sm">
              Collection:
            </h1>
            <p className="text-gray-400 text-sm border border-gray-600 py-1 px-3 rounded-sm w-full sm:w-auto">
              {toCapitalized(nft.collectionName)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            <h1 className="w-full sm:w-24 text-gray-400 text-sm">Price:</h1>
            <p className="text-gray-400 text-sm border border-gray-600 py-1 px-3 rounded-sm w-full sm:w-auto">
              {nft.price} ETH
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            <h1 className="w-full sm:w-24 text-gray-400 text-sm">Creator:</h1>
            <p className="text-gray-400 flex items-center text-sm border border-gray-600 py-1 px-3 rounded-sm break-all w-full sm:w-auto">
              {nft.creator.address}
              <button
                onClick={() => {
                  copyToClipboard(nft.creator.address), setCopied(true);
                }}
                title={copied ? "Copied!" : "Copy address"}
                className="cursor-pointer text-slate-50 hover:text-green-400 p-2 rounded-r-md rounded-l-none"
              >
                {copied ? <FiCheck /> : <FiCopy />}
              </button>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            <h1 className="w-full sm:w-24 text-gray-400 text-sm">Owner:</h1>
            <p className="text-gray-400 flex items-center text-sm border border-gray-600 py-1 px-3 rounded-sm break-all w-full sm:w-auto">
              {nft.owner.address}
              <button
                onClick={() => {
                  copyToClipboard(nft.owner.address), setCopied(true);
                }}
                title={copied ? "Copied!" : "Copy address"}
                className="cursor-pointer text-slate-50 hover:text-green-400 p-2 rounded-r-md rounded-l-none"
              >
                {copied ? <FiCheck /> : <FiCopy />}
              </button>
            </p>
          </div>
          <NFTActionButtons
            nft={nft}
            showBuy={!isOwner(account!, nft)}
            showList={isOwner(account!, nft) && !nft.active}
            showCancel={isOwner(account!, nft) && nft.active}
            // onBuy={(nft) => {
            //   console.log("Buying NFT", nft);
            //   // Call smart contract or add to cart
            // }}
            onList={(nft) => {
              console.log("Listing NFT", nft);
              handleListNFT(nft);
              // Call backend or blockchain to list
            }}
            onCancel={(nft) => {
              console.log("Canceling listing", nft);
              // Cancel listing via contract or API
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default NFTCard;

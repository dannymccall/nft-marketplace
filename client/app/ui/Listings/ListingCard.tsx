"use client";
import Image from "next/image";

import React, { useState } from "react";
import { NFTProps, ListingProps } from "@/app/lib/types";
import { useNFTCart } from "@/app/context/CartContext";
import { isOwner, makeRequest, toCapitalized } from "@/app/lib/helperFunctions";
import { FiCheck, FiCopy } from "react-icons/fi";
import { useHandleCopy } from "@/app/hooks/useCopy";
import { useWallet } from "@/app/context/WallatContext";
import {
  cancelNFTListing,
} from "@/app/lib/helperFunctions";
import NFTActionButtons from "@/app/components/NFTActionButtons";
import { stringifyBigInts } from "@/app/lib/helperFunctions";
import { useNotification } from "@/app/context/NotificationContext";
import { useRouter } from "next/navigation";


interface IListing {
  listing: ListingProps;
}

const ListingCard = ({ listing }: IListing) => {
  const { addItem } = useNFTCart();
  const { copyToClipboard, setCopied, copied } = useHandleCopy();
  const { account } = useWallet();
  const { showToast } = useNotification();
  const [shouldListAfterApproval, setShouldListAfterApproval] = useState(false);

  const router = useRouter();

  console.log(listing)

  const sendListingToBackend = async (payload: {
    listId: number;
    service: string;
    receipt?: any;
    tokenId?: number;
    price?: number;
  }) => {
    const response = await makeRequest(
      `/api/listing?service=${payload.service}`,
      {
        method: payload.service === "listNFT" ? "POST" : "PUT",
        body: JSON.stringify({ listId: payload.listId }),
      }
    );

    if (!response.success) {
      showToast(response.message, "error");
      router.refresh();
      return;
    } else showToast(response.message, "success");
  };

  const handleCancelNFT = async (listing: ListingProps) => {
    try {
      const receipt = await cancelNFTListing(listing.listId);
     
      const safeTransaction = stringifyBigInts(receipt);
      await sendListingToBackend({
        listId: listing.listId,
        service: "cancelListing",
      });
      router.refresh()
    } catch (error: any) {
      console.log(error.message);
      showToast(error.message, "error");
    }
  };


  return (
    <div className="flex flex-col md:flex-row  items-start justify-center w-full h-full  rounded-md  border border-gray-600 mb-5">
      <div className="w-full h-[400px] md:h-[650px] flex justify-center items-center p-4  relative   border border-gray-600">
        <Image
          src={listing.nft.image}
          alt={`NFT ${listing.nft.name}`}
          width={700}
          height={700}
          // fill
          className="w-full h-full  shadow-md rounded-md"
        />
      </div>
      <div className="w-full overflow-x-auto flex items-center p-4 justify-center h-[650px]   border border-gray-600">
        <section className="w-full px-3 py-2 h-full rounded-md  flex flex-col  overflow-x-auto justify-between shadow-md">
          <h1 className="text-slate-200">NFT Details</h1>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            <h1 className="w-full sm:w-24 text-gray-400 text-sm">Name:</h1>
            <p className="text-gray-400 text-sm border border-gray-600 py-1 px-3 rounded-sm w-full sm:w-auto">
              {toCapitalized(listing.nft.name)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            <h1 className="w-full sm:w-24 text-gray-400 text-sm">
              Collection:
            </h1>
            <p className="text-gray-400 text-sm border border-gray-600 py-1 px-3 rounded-sm w-full sm:w-auto">
              {toCapitalized(listing.nft.collectionName)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            <h1 className="w-full sm:w-24 text-gray-400 text-sm">Price:</h1>
            <p className="text-gray-400 text-sm border border-gray-600 py-1 px-3 rounded-sm w-full sm:w-auto">
              {listing.price} ETH
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
            <h1 className="w-full sm:w-24 text-gray-400 text-sm">Creator:</h1>
            <p className="text-gray-400 flex items-center text-sm border border-gray-600 py-1 px-3 rounded-sm break-all w-full sm:w-auto">
              {listing.nft.creator.address}
              <button
                onClick={() => {
                  copyToClipboard(listing.nft.creator.address), setCopied(true);
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
              {listing.seller.address}
              <button
                onClick={() => {
                  copyToClipboard(listing.seller.address), setCopied(true);
                }}
                title={copied ? "Copied!" : "Copy address"}
                className="cursor-pointer text-slate-50 hover:text-green-400 p-2 rounded-r-md rounded-l-none"
              >
                {copied ? <FiCheck /> : <FiCopy />}
              </button>
            </p>
          </div>
          <NFTActionButtons
            data={listing}
            context="listing-page"
            showBuy={!isOwner(account!, listing.seller.address)}
            showCancel={isOwner(account!, listing.seller.address) && listing.active}
            // onBuy={(listing) => {
            //   console.log("Listing NFT", listing);
            //   handleListNFT(listing);
            // }}
            onCancel={(listing) => {
              handleCancelNFT(listing); // Cancel listing via contract or API
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default ListingCard;

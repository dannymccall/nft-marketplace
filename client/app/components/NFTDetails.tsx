"use client";

import Image from "next/image";
import { FiCheck, FiCopy } from "react-icons/fi";
import { useState } from "react";
import { NFTProps } from "../lib/types";
import NFTActionButtons from "./NFTActionButtons";
import Web3 from "web3";
interface Listing {
  active: boolean;
  price: string;
}

interface NFTDetailsProps {
  nft: NFTProps;
  listingOnContract: Record<string, any>;
  toCapitalized: (text: string) => string;
  copyToClipboard: (text: string) => void;
  showListButton: boolean;
  showCancelButton: boolean;
  handleCancelNFT: (tokenId: number) => Promise<any>;
  handleListNFT: (nft: NFTProps) => Promise<any>;
}

export default function NFTDetails({
  nft,
  listingOnContract,
  toCapitalized,
  copyToClipboard,
  handleCancelNFT,
  handleListNFT,
  showListButton,
  showCancelButton,
}: NFTDetailsProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const web3 = new Web3();
  const handleCopy = (address: string) => {
    copyToClipboard(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <>
    <div className="flex flex-col md:flex-row  items-start justify-center w-full h-full  rounded-md  border border-gray-600 ">
      
      <div className="w-full h-[400px] md:h-[650px] flex justify-center items-center p-4  relative   border border-gray-600">
        <Image
          src={nft.image}
          alt={`NFT ${nft.name}`}
          width={700}
          height={700}
          className="w-full h-full rounded-md shadow-md"
        />
      </div>

      <div className="w-full overflow-x-auto flex items-center p-4 justify-center h-[650px]   border border-gray-600">
        <section className="  w-full px-3 py-2 h-full rounded-md gap-5 flex flex-col  overflow-x-auto justify-between shadow-md">
          <h1 className="text-lg font-semibold text-white">NFT Details</h1>

          <Detail label="Name" value={toCapitalized(nft.name)} />
          <Detail
            label="Collection"
            value={toCapitalized(nft.collectionName)}
          />

          {listingOnContract.active && !listingOnContract.sold ? (
            <>
              <Detail label="NFT State" value="Listed" />
              <Detail
                label="Price"
                value={`${web3.utils.fromWei(
                  listingOnContract.price,
                  "ether"
                )} ETH`}
              />
            </>
          ) : Object.keys(listingOnContract).length > 0 && listingOnContract.sold ? (
            <Detail label="NFT State" value="Sold" />
          ) : (
            <Detail label="NFT State" value="Not Listed" />
          )}

          <AddressDetail
            label="Creator"
            address={nft.creator.address}
            copied={copiedAddress === nft.creator.address}
            onCopy={handleCopy}
          />

          <AddressDetail
            label="Owner"
            address={nft.owner.address}
            copied={copiedAddress === nft.owner.address}
            onCopy={handleCopy}
          />
          <NFTActionButtons
            data={nft}
            context="profile-page"
            showList={showListButton}
            showCancel={showCancelButton}
            onCancel={(nft) => {
              console.log("Cancel Listing", nft);
              handleCancelNFT(parseInt(nft.tokenId));
              // Call backend or blockchain to cancel
            }}
            onList={(nft) => {
              console.log("Listing NFT", nft);
              handleListNFT(nft);
              // Call backend or blockchain to list
            }}
          />
        </section>
      </div>
    </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
      <h1 className="w-full sm:w-24 text-gray-400 text-sm">{label}:</h1>
      <p className="text-gray-400 text-sm border border-gray-600 py-1 px-3 rounded-sm w-full sm:w-auto">
        {value}
      </p>
    </div>
  );
}

function AddressDetail({
  label,
  address,
  copied,
  onCopy,
}: {
  label: string;
  address: string;
  copied: boolean;
  onCopy: (addr: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
      <h1 className="w-full sm:w-24 text-gray-400 text-sm">{label}:</h1>
      <p className="text-gray-400 flex items-center text-sm border border-gray-600 py-1 px-3 rounded-sm break-all w-full sm:w-auto">
        {address}
        <button
          onClick={() => onCopy(address)}
          title={copied ? "Copied!" : "Copy address"}
          className="cursor-pointer text-slate-50 hover:text-green-400 p-2 rounded-r-md rounded-l-none"
        >
          {copied ? <FiCheck /> : <FiCopy />}
        </button>
      </p>
    </div>
  );
}

"use client";
import nftImage from "@/public/mint_logo.png";
import Image from "next/image";
import { useNFTCart } from "../context/CartContext";
import TestImage from "@/public/nft-example.jpeg";
import { ListingProps } from "../lib/types";
import Link from "next/link";
import { isOwner } from "../lib/helperFunctions";
import { useWallet } from "../context/WallatContext";

interface IListingProps {
  listings: ListingProps[];
}
export default function NFTListings({ listings }: IListingProps) {
  const { addItem } = useNFTCart();
  const { account } = useWallet();

  return (
  <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white p-6">
  <div className="w-full flex gap-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent pb-4">
    {listings.map((listing: ListingProps, i) => (
      <div
        key={i}
        className="bg-[#1c1b29] inline-block w-80 flex-shrink-0 rounded-xl z-10 overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
      >
        <Link href={`/listing/${listing._id}`} className="block w-full">
          <Image
            src={listing.nft.image}
            alt={`NFT ${i + 1}`}
            width={300}
            height={300}
            className="w-full h-48"
          />
        </Link>
        <div className="p-4 flex-col lg:flex-row md:flex-col flex justify-between lg:items-center">
          <div>
            <h2 className="text-lg font-semibold mb-2">{listing.nft.name}</h2>
            <p className="text-sm text-gray-400">Price: {listing.price} ETH</p>
          </div>
          {!isOwner(account!, listing.seller.address) && (
            <button
              className="bg-[#1c1b29] text-slate-50 rounded-sm z-50 px-3 cursor-pointer py-1 text-sm shadow-md hover:scale-105 border border-gray-700 hover:bg-[#242338] transition-transform duration-300"
              onClick={(e) => {
                e.stopPropagation();
                addItem({
                  id: listing._id,
                  name: listing.nft.name,
                  image: listing.nft.image,
                  price: listing.price,
                  tokenId: parseInt(listing.nft.tokenId),
                  listId: listing.listId
                });
              }}
            >
              Buy NFT
            </button>
          )}
        </div>
      </div>
    ))}
  </div>
</div>


  );
}

"use client";
import nftImage from "@/public/mint_logo.png";
import Image from "next/image";
import TestImage from "@/public/nft-example.jpeg";
import Link from "next/link";
import { UserNFTProps } from "@/app/lib/types";
interface INFTs {
  nfts: UserNFTProps[];
}
export default function UserNFTs({ nfts }: INFTs) {
  return (
    <div className="text-white p-6 shadow-md">
      {nfts.length > 0 ? (
        <div className="w-full flex gap-4 flex-wrap  pb-4">
          {nfts.map((nft: UserNFTProps, i) => (
            <div
              key={i}
              className="bg-[#1c1b29] inline-block w-80 flex-shrink-0 rounded-xl z-10 overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <Link href={`/nft/${nft._id}`} className="block w-full">
                <Image
                  src={nft.image}
                  alt={`NFT ${i + 1}`}
                  width={300}
                  height={400}
                  className="w-full h-48"
                />
              </Link>
              <div className="p-4 flex-col lg:flex-row md:flex-col flex justify-between lg:items-center">
                <div>
                  <h2 className="text-lg font-semibold mb-2">{nft.name}</h2>
                  <p className="text-sm text-gray-400">
                    Price: {nft.price} ETH
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1>No data found</h1>
      )}
    </div>
  );
}

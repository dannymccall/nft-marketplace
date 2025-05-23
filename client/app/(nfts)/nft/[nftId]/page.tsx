import React from "react";
import { makeRequest } from "@/app/lib/helperFunctions";
import NFTCard from "@/app/ui/nfts/NFTCard";
import Loader from "@/app/components/Loader";

const page = async ({ params }: { params: Promise<{ nftId: string }> }) => {
  try {
    const nftId = (await params).nftId;
    const nft = await makeRequest(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/api/nft?nftId=${encodeURIComponent(nftId)}`,
      { method: "GET" }
    );
    console.log(nft);
    if (!nft) {
      return (
        <main>
          <p>NFT not found.</p>
        </main>
      );
    }

    return (
      <main className="flex flex-col ">
        <div className="mt-20">
          {
            nft ?
            <NFTCard nft={nft} /> : <Loader />
          }
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching client data:", error);
    return (
      <main>
        <p>Failed to load client information. Please try again later.</p>
      </main>
    );
  }
};

export default page;

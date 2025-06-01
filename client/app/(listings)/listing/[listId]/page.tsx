import React from "react";
import { makeRequest } from "@/app/lib/helperFunctions";
import NFTCard from "@/app/ui/nfts/NFTCard";
import Loader from "@/app/components/Loader";
import ListingCard from "@/app/ui/Listings/ListingCard";
const page = async ({ params }: { params: Promise<{ listId: string }> }) => {
  try {
    const listId = (await params).listId;
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL
      }/api/listing?listId=${encodeURIComponent(listId)}`,
        {
        cache: "no-store",
      }
    );

    if(!response.ok) throw new Error(response.statusText);

    const listing = await response.json();
    if (!listing) {
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
            listing ?
            <ListingCard listing={listing} /> : <Loader />
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

import { ListingService } from "@/app/lib/backend/services/ListingService";
import { NextRequest, NextResponse } from "next/server";
import NFT from "@/app/lib/backend/models/nft.model";
import Listing from "@/app/lib/backend/models/listing.model";
import { nftService } from "@/app/lib/backend/services/NFTService";
import { User } from "@/app/lib/backend/models/user.model";
import { formatTransaction } from "@/app/lib/helperFunctions";
import { findUser } from "../nft/route";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const listId = searchParams.get("listId");
  let  filter = searchParams.get("filter");

   filter = filter?.trim() || "";
  try {
    if (listId) {
      const listing = await Listing.findOne({
        $or: [{ _id: listId }, { nft: listId }],
      })
        .populate({ path: "seller", select: "address" })
        .populate({
          path: "nft",
          select: "tokenId name description image collectionName",
          populate: [
            { path: "owner", select: "address" },
            { path: "creator", select: "address" },
          ],
        });
      return NextResponse.json(listing);
    }

    if (
      filter &&
      ["art", "game", "music"].includes(filter.toLowerCase())
    ) {
      const listings = await Listing.find({ active: true })
        .populate({
          path: "nft",
          match: {
            $or: [
              { name: { $regex: filter, $options: "i" } },
              { collectionName: { $regex: new RegExp(`^${filter}$`, "i") } },
            ],
          },
          select: "tokenId name collectionName image description",
        })
        .populate({ path: "seller", select: "address" });
      // .populate({ path: "owner", select: "address" });

      // Remove listings where the NFT didn’t match the filter
      const filteredListings = listings.filter(
        (listing) => listing.nft !== null
      );

      // console.log(filteredListings);
      return NextResponse.json(filteredListings);
    }

    if(filter && filter === "top-rated"){
      const listings = await Listing.find({ active: true, listedBefore: true })
        .sort({ likes: -1 })
        .populate({ path: "seller", select: "address" })
        .populate({path: "nft", select: "tokenId name description image collectionName",})

        console.log({listings});
        return NextResponse.json({listings});

    }

    if(filter && filter === "new"){
      const listings = await Listing.find({ active: true, listedBefore: true })
        .sort({ createdAt: -1 }) // Assuming createdAt is the field to sort by
        .populate({ path: "seller", select: "address" })
        .populate({path: "nft", select: "tokenId name description image collectionName",})

      return NextResponse.json(listings);
    }

    const listings = await Listing.find({ active: true })
      .populate({ path: "seller", select: "address" })
      .populate({
        path: "nft",
        select: "tokenId name description image collectionName",
        populate: [
          { path: "owner", select: "address" },
          { path: "creator", select: "address" },
        ],
      });
    return NextResponse.json(listings);
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Something happened , try again: ", error.message);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("Request body:", body);
  try {
    const nft = await NFT.findOne({ tokenId: body.payload.tokenId })
      .populate({ path: "owner", select: "address" })
      .populate({ path: "creator", select: "address" });

    if (!nft) {
      return NextResponse.json({ success: false, message: "NFT not found" });
    }

    const listing = await ListingService.getListing({
      listId: body.payload.listId,
      active: true,
    });
    if (listing)
      return NextResponse.json({
        success: true,
        message: "This is listing has already been listed off chain",
      });
    // Build listing object for creation
    const listingData = {
      nft: nft._id,
      seller: nft.owner._id || nft.owner, // in case owner is populated or just an ID
      price: body.payload.price,
      buyer: null,
      listId: body.payload.listId,
      active: true,
      soldAt: null,
      listedBefore: true,
    };

    const listedNFT = await ListingService.newListing(listingData);

    if (!listedNFT) {
      return NextResponse.json({
        success: false,
        message: "Listing failed, try again",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Listing successful",
      data: listedNFT,
    });
  } catch (error: any) {
    console.error("Listing error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

async function cancelListing(listId: number) {
  const listing = await ListingService.getListing({
    listId: listId,
    sold: false,
  });

  if (!listing) return "Listing already sold or does not exist";

  return await ListingService.updateModel(
    { listId: listId },
    { active: false }
  );
}

async function activateListing(listId: number, price: number) {
  const listing = await ListingService.getListing({
    listId: listId,
    sold: false,
  });

  if (!listing) return "Listing already sold or does not exist";

  return await ListingService.updateModel(
    { listId: listId },
    { active: true, price: price }
  );
}

async function buyListing(listId: number, address: string) {
  // const formattedTransaction = formatTransaction(receipt);

  const buyer = await findUser(address);
  if (!buyer) throw new Error("Buyer not found");

  const listing = await ListingService.getListing({
    listId: listId,
    sold: false,
  });

  if (!listing) return "Listing already sold or does not exist";

  const nft: any = await Listing.findOne({ listId: listId }).populate({
    path: "nft",
    select: "owner creator",
    populate: [
      { path: "owner", select: "address" },
      { path: "creator", select: "address" },
    ],
  });

  console.log(nft);

  await Promise.all([
    // Update NFT ownership and listing status

    // Add to buyer's owned NFTs
    User.updateOne(
      { _id: buyer._id },
      { $addToSet: { OwnedNFTs: nft.nft._id } }
    ),

    // Remove from previous owner's owned NFTs

    User.updateOne({ _id: nft.seller }, { $pull: { OwnedNFTs: nft.nft._id } }),

    NFT.updateOne(
      { _id: nft.nft },
      { $addToSet: { previousOwners: nft.seller }, owner: buyer._id }
    ),

    ListingService.updateModel(
      { listId: listId },
      { active: false, sold: true, buyer: buyer._id }
    ),
  ]);
}

export async function PUT(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const service = searchParams.get("service");
    const body = await req.json();
    console.log(body);
    console.log("id: ", body);
    const listing = await ListingService.getListing({
      listId: body.payload.listId,
    });
    // console.log(listing);
    if (!listing) {
      return NextResponse.json({
        success: false,
        message: "Listing not found",
      });
    }

    switch (service) {
      case "cancelListing": {
        const result = await cancelListing(body.payload.listId);
        if (typeof result === "string") {
          return NextResponse.json({ success: false, message: result });
        }
        return NextResponse.json({
          success: true,
          message: "Listing cancelled successfully",
        });
      }
      case "activateListing": {
        const result = await activateListing(
          body.payload.listId,
          body.payload.price
        );
        if (typeof result === "string") {
          return NextResponse.json({ success: false, message: result });
        }
        return NextResponse.json({
          success: true,
          message: "Listing activation successfully",
        });
      }
      case "buyListing": {
        const result = await buyListing(
          body.payload.listId,
          body.payload.address
        );
        if (typeof result === "string") {
          return NextResponse.json({ success: false, message: result });
        }
        return NextResponse.json({
          success: true,
          message: "Listing bought successfully",
        });
      }
      default:
        return NextResponse.json({
          success: false,
          message: "Invalid service",
        });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

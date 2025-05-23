import { NextRequest, NextResponse } from "next/server";
import { nftService } from "@/app/lib/backend/services/NFTService";
import { User } from "@/app/lib/backend/models/user.model";
import { formatTransaction } from "@/app/lib/helperFunctions";
import NFT from "@/app/lib/backend/models/nft.model";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/mongodb";

await connectDB();

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const nftId = searchParams.get("nftId");
  const filter = searchParams.get("filter");
  try {
    if (nftId) {
      const nft = await NFT.findOne({ _id: nftId })
        .populate({ path: "creator", select: "address" })
        .populate({ path: "owner", select: "address" });
      return NextResponse.json(nft);
    }

    if (filter?.trim()) {
      const nfts = await NFT.find({
        $and: [
          {
            $or: [
              { name: { $regex: filter, $options: "i" } },
              { collectionName: { $regex: filter, $options: "i" } },
            ],
          },
          { active: true },
        ],
      })
        .populate({ path: "creator", select: "address" })
        .populate({ path: "owner", select: "address" });

      return NextResponse.json({ nfts });
    }
    const nfts = await NFT.find({ active: true })
      .populate({ path: "creator", select: "address" })
      .populate({ path: "owner", select: "address" });

    return NextResponse.json({ nfts });
  } catch (error: any) {
    console.error("GET NFT error:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch NFTs" },
      { status: 500 }
    );
  }
}

const findUser = async (address: string) =>
  await User.findOne({ address: address });

async function mintNFT(data: any, receipt: any) {
  const formattedTransaction = formatTransaction(receipt);
  const user = await findUser(formattedTransaction.From);

  const tokenId: number = parseInt(
    receipt.events.Transfer.returnValues.tokenId.toString()
  );

  const nftData: any = {
    tokenId,
    name: data.name,
    description: data.description,
    image: data.metadataUri,
    metadataUri: data.metadataGatewayUrl,
    owner: user?._id as mongoose.Types.ObjectId,
    creator: user?._id as mongoose.Types.ObjectId,
    collectionName: data.collection,
    price: parseFloat(data.price),
    active: data.sell,
    listId: data.listId,
  };

  const savedNFT = await nftService.saveNFTData(nftData);

  await User.updateOne(
    { address: formattedTransaction.From },
    { $push: { OwnedNFTs: savedNFT._id } }
  );

  return savedNFT;
}

async function buyNFT(data: any, receipt: any) {
  const formattedTransaction = formatTransaction(receipt);

  // New owner
  const buyer = await findUser(formattedTransaction.From);
  if (!buyer) throw new Error("Buyer not found");

  // Get the NFT document and current owner
  const nft: {owner: {address: string}} | any= await NFT.findOne({ tokenId: data.tokenId })
    .populate({
      path: "owner",
      select: "address", // Only get the address
    })
    .populate({
      path: "creator",
      select: "address", // Only get the address
    });

  if (!nft) throw new Error("NFT not found");

  const previousAddress = nft.owner?.address;

  // 1. Update NFT: set new owner, unlist
  // 2. Add NFT to buyer's OwnedNFTs
  // 3. Remove NFT from previous owner's OwnedNFTs

  await Promise.all([
    // Update NFT ownership and listing status
    nftService.updateModel(
      { tokenId: data.tokenId },
      { owner: buyer._id, active: false, sold: true,  }
    ),

    // Add to buyer's owned NFTs
    User.updateOne({ _id: buyer._id }, { $addToSet: { OwnedNFTs: nft._id } }),

    // Remove from previous owner's owned NFTs
    previousAddress
      ? User.updateOne(
          { address: previousAddress },
          { $pull: { OwnedNFTs: nft._id } }
        )
      : Promise.resolve(), // If no previous owner, skip this step
  ]);
}

async function listNFT(data: any, receipt: any) {
  const formattedTransaction = formatTransaction(receipt);
  const user = await findUser(formattedTransaction.From);

  await nftService.updateOne(
    { tokenId: data.tokenId },
    { owner: user?._id, active: true, listId: data.listId }
  );
}

export async function POST(req: NextRequest) {
  try {
    const { receipt, data } = await req.json();
    const service = req.nextUrl.searchParams.get("service");

    if (!receipt || !data) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    switch (service) {
      case "buyNFT":
        await buyNFT(data, receipt);
        return NextResponse.json({
          success: true,
          message: "NFT bought successfully",
        });

      case "listNFT":
        await listNFT(data, receipt);
        return NextResponse.json({
          success: true,
          message: "NFT listed successfully",
        });

      case "mintNFT":
      default:
        await mintNFT(data, receipt);
        return NextResponse.json({
          success: true,
          message: "Mint Successful!",
        });
    }
  } catch (err: any) {
    console.error("Error in NFT POST handler:", err.message || err);
    return NextResponse.json(
      { error: "NFT operation failed" },
      { status: 500 }
    );
  }
}

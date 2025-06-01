import { NextRequest, NextResponse } from "next/server";
import { nftService } from "@/app/lib/backend/services/NFTService";
import { User } from "@/app/lib/backend/models/user.model";
import { formatTransaction } from "@/app/lib/helperFunctions";
import NFT from "@/app/lib/backend/models/nft.model";
import mongoose from "mongoose";
import { connectDB } from "@/app/lib/mongodb";

await connectDB();


interface User {
  _id: mongoose.Types.ObjectId;
}
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

export const findUser = async (address: string) =>
  await User.findOne({ address: address });

export async function POST(req: NextRequest) {
  try {
    const { receipt, data } = await req.json();

    if (!receipt || !data) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

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
    };

    const savedNFT = await nftService.saveNFTData(nftData);

    await User.updateOne(
      { address: formattedTransaction.From },
      { $push: { OwnedNFTs: savedNFT._id } }
    );

    return NextResponse.json({success: true, message: "Mint Successful"});
  } catch (err: any) {
    console.error("Error in NFT POST handler:", err.message || err);
    return NextResponse.json(
      { error: "NFT operation failed" },
      { status: 500 }
    );
  }
}

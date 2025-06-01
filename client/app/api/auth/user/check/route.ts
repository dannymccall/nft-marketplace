import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/lib/backend/models/user.model";
import { connectDB } from "@/app/lib/mongodb";
import { getArrayBuffer, uploadToCloudinary } from "@/app/lib/serverFunctions";
import { userService } from "@/app/lib/backend/services/userService";
import Listing from "@/app/lib/backend/models/listing.model";
import mongoose from "mongoose";
import NFT from "@/app/lib/backend/models/nft.model";
await connectDB();
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const userId = searchParams.get("userId");
  const service = searchParams.get("service");

  console.log({ userId, address });

  if (!address && !userId) {
    return NextResponse.json(
      { error: "No address or user found" },
      { status: 400 }
    );
  }

  if (address) {
    const user = await User.findOne({ address: address });

    if (!user) return NextResponse.json(false);

    return NextResponse.json(user);
  }

  try {
    if (userId && service?.trim() && service === "fetchProfile") {
      // const creatorId = new ObjectId(userId as string);
      const result = await Listing.aggregate([
        {
          $facet: {
            listings: [
              {
                $match: {
                  seller: new mongoose.Types.ObjectId(userId as string),
                  active: true,
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "seller",
                  foreignField: "_id",
                  as: "seller",
                },
              },
              { $unwind: "$seller" },
              {
                $lookup: {
                  from: "nfts",
                  localField: "nft",
                  foreignField: "_id",
                  as: "nft",
                },
              },
              { $unwind: "$nft" },
              {
                $lookup: {
                  from: "users",
                  localField: "nft.owner",
                  foreignField: "_id",
                  as: "nft.owner",
                },
              },
              { $unwind: "$nft.owner" },
              {
                $lookup: {
                  from: "users",
                  localField: "nft.creator",
                  foreignField: "_id",
                  as: "nft.creator",
                },
              },
              { $unwind: "$nft.creator" },
              {
                $project: {
                  _id: 1,
                  price: 1,
                  "seller.address": 1,
                  "nft.tokenId": 1,
                  "nft.name": 1,
                  "nft.description": 1,
                  "nft.image": 1,
                  "nft.collectionName": 1,
                  "nft.owner.address": 1,
                  "nft.creator.address": 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            user: {
              $literal: await User.aggregate([
                {
                  $match: {
                    _id: new mongoose.Types.ObjectId(userId as string),
                  },
                },
                {
                  $lookup: {
                    from: "nfts",
                    localField: "_id",
                    foreignField: "owner",
                    as: "OwnedNFTs",
                  },
                },
                {
                  $project: {
                    _id: 1,
                    username: 1,
                    address: 1,
                    avarta: 1,
                    email: 1,
                    OwnedNFTs: {
                      _id: 1,
                      tokenId: 1,
                      name: 1,
                      description: 1,
                      image: 1,
                      collectionName: 1,
                    },
                  },
                },
              ]),
            },
          },
        },
      ]);

     const created = await NFT.aggregate([
        {
          $match: {
            creator: new mongoose.Types.ObjectId(userId as string),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "creator",
            foreignField: "_id",
            as: "creator",
          },
        },
        { $unwind: "$creator" },
        {
          $project: {
            _id: 1,
            tokenId: 1,
            name: 1,
            description: 1,
            image: 1,
            collectionName: 1,
            "creator.address": 1,
          },
        },
      ]);

      return NextResponse.json({result, created}, { status: 200 });
    }

    // if (userId) {
    //   const user = await User.findOne({_id: userId})
    //   if (!user) {
    //     return NextResponse.json({ user: {} }, { status: 200 });
    //   }
    //   return NextResponse.json(user, { status: 200 });
    // }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Error while checking user" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const contentType = req.headers.get("content-type");
  const userId = req.nextUrl.searchParams.get("userId");
  console.log(userId);

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" });
  }

  if (contentType?.includes("multipart/form-data")) {
    const body = await req.formData();
    const profileImage: any = body.get("profileImage");
    try {
      if (!profileImage?.name) {
        return NextResponse.json({
          success: false,
          message: "Please file path is needed",
        });
      }

      const buffer = await getArrayBuffer(profileImage);
      const result = await uploadToCloudinary(buffer, "nft");

      const newFileName = (result as { secure_url: string }).secure_url;
      const updatedProfilePicture = await userService.updateUser(
        userId as string,
        { avarta: newFileName }
      );

      return NextResponse.json({
        success: true,
        message: "Profile picture updated successfully",
        updatedProfilePicture,
      });
    } catch (error: any) {
      console.log(error);
      return NextResponse.json({ success: false, message: error.message });
    }
  } else {
    const body = await req.json();
    const { username, email } = body;
    if (!username.trim() || !email.trim())
      return NextResponse.json({
        success: false,
        message: "User update failed",
      });

    const user = await userService.findOne({
      $or: [{ username: username }, { email: email }],
    });

    console.log(user);
    if (user) {
      return NextResponse.json({
        success: false,
        message: "Username or Email already taken",
      });
    }
    try {
      const userUpdated = await userService.updateUser(userId as string, {
        username,
        email,
      });
      if (userUpdated) {
        return NextResponse.json({ success: true });
      }
    } catch (error: any) {
      console.log(error.message);
      return NextResponse.json({ success: true, message: error.message });
    }
  }
}

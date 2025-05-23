import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/lib/backend/models/user.model";
import { connectDB } from "@/app/lib/mongodb";
import { getArrayBuffer, uploadToCloudinary } from "@/app/lib/serverFunctions";
import { userService } from "@/app/lib/backend/services/userService";
await connectDB();
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const userId = searchParams.get("userId");

  console.log({ userId, address });

  if (!address && !userId) {
    return NextResponse.json(
      { error: "No address or user found" },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({
      $or: [{ address: address }, { _id: userId }],
    }).populate({
      path: "OwnedNFTs",
      select: "image description name collectionName price listed",
      populate: [
        {
          path: "owner",
          select: "address", // Only bring in the address of the owner
        },
        {
          path: "creator",
          select: "address", // Only bring in the address of the creator
        },
      ],
    });
    if (!user) {
      return NextResponse.json({ user: {} }, { status: 200 });
    }

    return NextResponse.json(user, { status: 200 });
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
      $or: [{ _id: userId }, { email: email }],
    });
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

import { NextResponse, NextRequest } from "next/server";
import crypto, { randomBytes } from "crypto";
import { connectDB } from "@/app/lib/mongodb";
import { WalletAuthentication } from "@/app/lib/backend/models/wallet_auth";
await connectDB();
export async function GET(req: NextRequest) {

  const address = req.nextUrl.searchParams.get("address");
  const nonce = randomBytes(16).toString("hex");
  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  const user = await WalletAuthentication.create({wallet_address: address, nonce });
  if (!user) {
    return NextResponse.json(
      { error: "Failed to create nonce" },
      { status: 500 }
    );
  }

  return NextResponse.json({nonce});
}

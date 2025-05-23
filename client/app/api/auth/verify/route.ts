import { NextRequest, NextResponse } from "next/server";
import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import { User } from "@/app/lib/backend/models/user.model";
import { WalletAuthentication } from "@/app/lib/backend/models/wallet_auth";
import { createSession } from "@/app/lib/session/sessions";
export async function POST (req: NextRequest) {
  const { address, signature } = await req.json();
  console.log(address, signature);
  try {
    if (!address || !signature) {
      return NextResponse.json({
        success: false,
        error: "Address and signature are required",
      });
    }
    const existingUser = await WalletAuthentication.findOne({wallet_address: address }).select(
      "wallet_address nonce"
    );

    console.log({existingUser})
    const msg = `Login nonce: ${existingUser?.nonce}`;
    console.log(msg)
    const msgBufferHex = `0x${Buffer.from(msg, 'utf8').toString('hex')}`;

    console.log("msgBufferHex", msgBufferHex);
    const recoveredAddress = recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });

    console.log({recoveredAddress, address})
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json({ success: false, error: "Signature mismatch" });
    }

    // Check if user exists, else create
    let user = await User.findOne({ address });
    if (!user) {
      user = await User.create({ address});
    }

    console.log(user)
    await createSession(user); // Create a session for the user

    // Issue a session or JWT here if needed
    await WalletAuthentication.deleteOne({ wallet_address: address });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error verifying signature:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    });
  }
};

import { NextRequest, NextResponse } from "next/server";
import { uploadMetadata } from "@/app/lib/serverFunctions";
import NFT from "@/app/lib/backend/models/nft.model";
import {User} from "@/app/lib/backend/models/user.model";

export async function POST(req: NextRequest){
    const body = await req.formData();

    try{
        if(!body) return NextResponse.json({error: "No body found"}, {status: 400});
        const metadata = body.get("metadata");
        if (!metadata) {
            return NextResponse.json({ error: "No metadata found" }, { status: 400 });
        }
        
        const user = await User.findOne({address: body.get("address")});

        if (!user) {
            return NextResponse.json({success: false, error: "User not found" }, { status: 404 });
        }
        const result = await uploadMetadata(JSON.parse(metadata as string), body.get("file") as File);
        console.log(result)
        if (!result) {
            return NextResponse.json({ error: "Error while uploading file" }, { status: 500 });
        }
        return NextResponse.json({success: true, metadata: result}, { status: 200 });

    }catch(error){
        console.log(error)
        return NextResponse.json({error: "Error while uploading file"}, {status: 500})
    }
}
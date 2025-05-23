import { NextRequest,NextResponse } from "next/server";
import { deleteSession } from "@/app/lib/session/sessions";


export async function POST(req: NextRequest) {
    await deleteSession(); // Delete the session for the user
    return NextResponse.json({ success: true });
}
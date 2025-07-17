import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDatafromToken";
import User from "@/models/userModel";

export async function GET(req: NextRequest) {
    try {
        const userId = getDataFromToken(req);
        const user = await User.findOne({ _id: userId }).select("-password");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json(user);
    }
    catch (error: any) {
        console.error(`Error in me route: ${error.message}`);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

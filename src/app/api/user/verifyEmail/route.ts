import { connectDB } from "@/db/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

connectDB();

export async function POST(req:NextRequest) {
    try{
        const reqbody =await req.json();
        const { token }: any = reqbody;
        console.log("Token received for verification:", token);
        const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } });
        if (!user) {
            return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 400 });
        }
        console.log("User found for verification:", user);
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
    }
    catch (error:any) {
        console.error(`Error in verifyEmail route: ${error.message}`);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
    
}
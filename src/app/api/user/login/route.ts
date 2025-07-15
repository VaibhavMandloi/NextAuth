import { connectDB } from "@/db/dbconfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export const POST = async (req: NextRequest) => {
    try {
        const reqbody = await req.json(); 
        console.log("Request body:", reqbody);
        const { email, password }: any = reqbody;
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        console.log("User found:", user);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        const tokenData={
            id: user._id,
            username: user.username,
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET as string, { expiresIn: '1d' });
        console.log("Token generated:", token);
        const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
        response.cookies.set("token", token, {
            httpOnly: true,
        });
        return response;
    } catch (error: any) {
        console.error(`Error in login route: ${error.message}`);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

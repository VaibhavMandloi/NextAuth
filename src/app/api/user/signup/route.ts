import { connectDB } from "@/db/dbconfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connectDB();

export const POST = async (req: NextRequest) => {
    try{
        const reqbody = await req.json(); 
        const { username, email, password }:any = reqbody;
        if (!username || !email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        const existingUser = await User.findOne({ username });
        if (existingUser) { 
            return NextResponse.json({ error: "Username already exists" }, { status: 400 });
        }
        const exixstingEmail = await User.findOne({ email });
        if (exixstingEmail) {
            return NextResponse.json({ error: "Email already exists" }, { status: 400 });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();
        console.log("User created successfully" , savedUser);

        await sendEmail({
            email,
            emailType: "VERIFY",
            userId: savedUser._id
        });
        return NextResponse.json({ message: "User created successfully" }, { status: 201 });


    }
    catch (error: any) {
        console.error(`Error in signup route: ${error.message}`);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
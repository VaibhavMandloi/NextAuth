import { NextRequest, NextResponse } from "next/server";

export const GET= async (req: NextRequest) => {
    try {
        const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0) // Set the cookie to expire immediately
        });
        return response;
    } catch (error: any) {
        console.error(`Error in logout route: ${error.message}`);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

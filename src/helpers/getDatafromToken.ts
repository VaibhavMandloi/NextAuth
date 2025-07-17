import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (req: NextRequest) => {
    const token = req.cookies.get("token")?.value;
    if (!token) {
        throw new Error("No token found");
    }
    
    try {
        const decoded:any = jwt.verify(token, process.env.TOKEN_SECRET as string);

        return decoded.id;
    } catch (error) {
        throw new Error("Invalid token");
    }
};
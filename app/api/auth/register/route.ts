import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/connectdb";
import User from "@/app/models/User.model";

export async function POST(request: NextRequest){
    try {
        const {email, password} =await request.json();
        if(!email && !password){
            return NextResponse.json(
                {message: "All fields are required."},
                {status: 400},
            );
        }
        
        await connectDB();
        const existingUser = await User.find({email});
        if(existingUser){
            return NextResponse.json(
                {message: "User already registered."},
                {status: 400},
            );
        }

        await User.create({email, password});

        return NextResponse.json(
            {message: "User registration complete."},
            {status: 201},
        );
    } catch (error: any) {
        console.log("Error found in Register route.", error.message);
        return NextResponse.json(
            {Message: "User registration failed."},
            {status: 500},
        );
    }
};
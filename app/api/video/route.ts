import { authOptions } from "@/app/lib/auth";
import connectDB from "@/app/lib/connectdb";
import Video, { IVideo }  from "@/app/models/Video.model";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const allVideos = await Video.find({}).sort({ createdAt: -1 }).lean();
        if (!allVideos || allVideos.length === 0) {
            return NextResponse.json(
                { message: "No videos found" }, 
                { status: 404 }
            );
        }

        return NextResponse.json(allVideos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized" }, 
                { status: 401 }
            );
        }
        await connectDB();
        const body: IVideo = await request.json();
        if( !body.title || !body.description || !body.videoUrl || !body.thumbnailUrl ) {
            return NextResponse.json(
                { error: "Title, description, video URL, and thumbnail URL are required" }, 
                { status: 400 }
            );
        }

        const videoData = {
            ...body,
            controls: body?.controls ?? true, // Default to true if not provided
            transformation: {
                height: 1920, // Default height
                width: 1080, // Default width
                quality: body?.transformation?.quality ?? 80, // Default quality if not provided
            },
        };

        const newVideo = await Video.create(videoData);
        if (!newVideo) {
            return NextResponse.json(
                { error: "Failed to create video" }, 
                { status: 500 }
            );
        }
        console.log("Video created successfully:", newVideo);
        return NextResponse.json(newVideo, { status: 201 });

    } catch (error) {
        console.error("Error in POST request: Get Session", error);
        return NextResponse.json({ error: "Failed to get session" }, { status: 500 });
    }
    
}


import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;
if(!MONGODB_URL){
    console.log("Please provide DB connection string in .env");
    throw new Error("Empty DB Connection string.");
}

export interface connectionObject{
    isConnected?: boolean;
}

const connection: connectionObject = {};

async function connectDB(){
    if(connection.isConnected){
        console.log("Database already Connected.");
        return;
    }
    try {
        const db = await mongoose.connect(MONGODB_URL!);
        connection.isConnected = db.connections[0].readyState === 1;
        console.log("Database Connection Successfull.");
        return;
    } catch (error: any) {
        console.log("Failed to connect Database.", error.message);
        throw new Error("Connection failed to Database.");
        return;
    }
}

export default connectDB;
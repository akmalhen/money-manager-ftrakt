import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/lib/mongoose";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    // Check if MongoDB connection string is defined
    const MONGODB_URI = process.env.MONGODB_URI;
    const mongoConnectionStatus = MONGODB_URI 
      ? "MONGODB_URI is defined" 
      : "MONGODB_URI is not defined";
    
    // Get authentication information
    const session = await auth();
    const authStatus = session ? "Authenticated" : "Not authenticated";
    
    // Get user ID if authenticated
    let userId = "Not available";
    if (session && session.user) {
      // @ts-ignore - NextAuth session type mismatch
      userId = session.user.id || session.user.email || "Not available";
    }
    
    try {
      // Try to connect to MongoDB
      await connectToDB();
      
      // If connected, try to access the UserProgress collection
      const UserProgress = mongoose.models.UserProgress || 
        mongoose.model("UserProgress", new mongoose.Schema({
          user: { type: String, required: true, index: true },
          level: Number,
          points: Number,
          quizzesTaken: Number,
          correctAnswers: Number,
          streakDays: Number,
          badges: Array,
          quizHistory: Array
        }));
      
      // Get user progress count in the database to verify connection
      const totalDocuments = await UserProgress.countDocuments();
      
      // Get specific user progress if authenticated
      let userProgressExists = false;
      if (session && session.user) {
        // @ts-ignore
        const userIdForQuery = session.user.id || session.user.email;
        const userProgress = await UserProgress.findOne({ user: userIdForQuery });
        userProgressExists = !!userProgress;
      }
      
      return NextResponse.json({
        status: "ok",
        mongodb: {
          connectionString: mongoConnectionStatus,
          connected: true,
          totalProgressDocuments: totalDocuments,
          userProgressExists
        },
        auth: {
          status: authStatus,
          userId
        },
        localStorage: {
          available: typeof window !== 'undefined'
        }
      });
    } catch (dbError: any) {
      // If MongoDB connection fails, return error information
      return NextResponse.json({
        status: "error",
        mongodb: {
          connectionString: mongoConnectionStatus,
          connected: false,
          error: dbError.message
        },
        auth: {
          status: authStatus,
          userId
        },
        localStorage: {
          available: typeof window !== 'undefined'
        }
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      error: error.message
    }, { status: 500 });
  }
} 
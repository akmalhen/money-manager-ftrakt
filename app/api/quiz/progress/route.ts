import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import { connectToDB } from "@/lib/mongoose";

// Default badges for new users
const defaultBadges = [
  {
    id: "first-quiz",
    name: "Quiz Beginner",
    description: "Complete your first quiz",
    icon: "🎓",
    unlocked: false,
    unlockedAt: undefined,
    category: "achievement",
    requirement: "Complete 1 quiz"
  },
  {
    id: "streak-master",
    name: "Streak Master",
    description: "Maintain a 3-day quiz streak",
    icon: "🔥",
    unlocked: false,
    unlockedAt: undefined,
    category: "achievement",
    requirement: "3-day streak"
  },
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Get a perfect score on any quiz",
    icon: "🏆",
    unlocked: false,
    unlockedAt: undefined,
    category: "achievement",
    requirement: "100% score"
  },
  {
    id: "saving-expert",
    name: "Saving Expert",
    description: "Master saving concepts by scoring 80%+ on 3 saving quizzes",
    icon: "💰",
    unlocked: false,
    unlockedAt: undefined,
    category: "knowledge",
    requirement: "80%+ on 3 saving quizzes"
  },
  {
    id: "budgeting-expert",
    name: "Budgeting Expert",
    description: "Master budgeting concepts by scoring 80%+ on 3 budgeting quizzes",
    icon: "📊",
    unlocked: false,
    unlockedAt: undefined,
    category: "knowledge",
    requirement: "80%+ on 3 budgeting quizzes"
  },
  {
    id: "investing-expert",
    name: "Investing Expert",
    description: "Master investing concepts by scoring 80%+ on 3 investing quizzes",
    icon: "📈",
    unlocked: false,
    unlockedAt: undefined,
    category: "knowledge",
    requirement: "80%+ on 3 investing quizzes"
  },
  {
    id: "debt-expert",
    name: "Debt Management Expert",
    description: "Master debt concepts by scoring 80%+ on 3 debt quizzes",
    icon: "💳",
    unlocked: false,
    unlockedAt: undefined,
    category: "knowledge",
    requirement: "80%+ on 3 debt quizzes"
  },
  {
    id: "quiz-master",
    name: "Quiz Master",
    description: "Complete 10 quizzes with an average score of 80% or higher",
    icon: "👑",
    unlocked: false,
    unlockedAt: undefined,
    category: "achievement",
    requirement: "10 quizzes with 80%+ avg"
  },
  {
    id: "financial-guru",
    name: "Financial Guru",
    description: "Reach level 10 in your financial knowledge journey",
    icon: "🧠",
    unlocked: false,
    unlockedAt: undefined,
    category: "achievement",
    requirement: "Reach level 10"
  }
];

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDB();
    
    // Check if user is authenticated
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }
    
    // Get the user ID from the session - prioritize the ID field over email
    // @ts-ignore - NextAuth session type mismatch
    const userId = session.user.id || session.user.email;
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }
    
    console.log("Fetching progress for user:", userId);
    
    // Import the model directly here to avoid issues
    const UserProgress = mongoose.models.UserProgress || 
      mongoose.model("UserProgress", new mongoose.Schema({
        user: { 
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
          index: true 
        },
        userId: { 
          type: String, 
          required: true, 
          index: true 
        },
        level: { type: Number, default: 1 },
        points: { type: Number, default: 0 },
        quizzesTaken: { type: Number, default: 0 },
        correctAnswers: { type: Number, default: 0 },
        streakDays: { type: Number, default: 0 },
        lastQuizDate: { type: Date },
        badges: [{
          id: { type: String, required: true },
          name: { type: String, required: true },
          description: { type: String, required: true },
          icon: { type: String, required: true },
          unlocked: { type: Boolean, default: false },
          unlockedAt: { type: Date, default: null },
          category: { type: String, required: true },
          requirement: { type: String, required: true },
        }],
        quizHistory: [{
          quizId: { type: String },
          category: { type: String },
          difficulty: { type: String },
          score: { type: Number },
          total: { type: Number },
          date: { type: Date, default: Date.now }
        }]
      }));
    
    // Try to get the User ObjectId if possible
    // Import the User model to find the user's ObjectId
    const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
    }));
    
    // Find the user's progress document
    // First check if there's a record with the userId field
    let userProgress = await UserProgress.findOne({ userId: userId });
    
    // If not found, try the legacy field
    if (!userProgress) {
      userProgress = await UserProgress.findOne({ user: userId });
    }
    
    // If still not found, try to find by email (for compatibility)
    if (!userProgress && userId.includes('@')) {
      const user = await User.findOne({ email: userId });
      if (user) {
        userProgress = await UserProgress.findOne({ user: user._id });
      }
    }
    
    console.log("User progress found:", userProgress ? "Yes" : "No");
    
    // If user progress doesn't exist, create a new one with default badges
    if (!userProgress) {
      console.log("Creating new user progress document");
      
      // Try to find the user by email to get their ObjectId
      let userObjId = null;
      if (userId.includes('@')) {
        const user = await User.findOne({ email: userId });
        if (user) {
          userObjId = user._id;
        }
      }
      
      userProgress = await UserProgress.create({
        user: userObjId || userId, // Use ObjectId if available, otherwise fallback to string
        userId: userId, // Always store the string ID as well
        level: 1,
        points: 0,
        quizzesTaken: 0,
        correctAnswers: 0,
        streakDays: 0,
        badges: defaultBadges,
        quizHistory: []
      });
      
      console.log("New user progress created successfully");
    }
    
    return NextResponse.json({ userProgress });
  } catch (error: any) {
    console.error("Error fetching user progress:", error);
    console.error("Error stack trace:", error.stack);
    
    return NextResponse.json(
      { error: error.message || "Failed to fetch user progress" },
      { status: 500 }
    );
  }
}

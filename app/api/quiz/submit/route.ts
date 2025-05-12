import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { auth } from "@/auth";
import { connectToDB } from "@/lib/mongoose";

// Import the checkForBadgeUnlocks function directly
function checkForBadgeUnlocks(userProgress: any, category?: string, percentage?: number) {
  const unlockedBadges: any[] = [];
  
  // Clone the badges array to avoid modifying the original
  const badges = [...userProgress.badges];
  
  // Check for first-quiz badge
  const firstQuizBadge = badges.find(b => b.id === "first-quiz");
  if (firstQuizBadge && !firstQuizBadge.unlocked && userProgress.quizzesTaken >= 1) {
    firstQuizBadge.unlocked = true;
    firstQuizBadge.unlockedAt = new Date();
    unlockedBadges.push(firstQuizBadge);
  }
  
  // Check for streak-master badge
  const streakBadge = badges.find(b => b.id === "streak-master");
  if (streakBadge && !streakBadge.unlocked && userProgress.streakDays >= 3) {
    streakBadge.unlocked = true;
    streakBadge.unlockedAt = new Date();
    unlockedBadges.push(streakBadge);
  }
  
  // Check for perfect-score badge
  const perfectBadge = badges.find(b => b.id === "perfect-score");
  if (perfectBadge && !perfectBadge.unlocked && percentage === 100) {
    perfectBadge.unlocked = true;
    perfectBadge.unlockedAt = new Date();
    unlockedBadges.push(perfectBadge);
  }
  
  // Check for category-specific badges
  if (category) {
    const categoryMap: { [key: string]: string } = {
      "saving": "saving-expert",
      "budgeting": "budgeting-expert",
      "investing": "investing-expert",
      "debt": "debt-expert"
    };
    
    const badgeId = categoryMap[category];
    if (badgeId) {
      const categoryBadge = badges.find(b => b.id === badgeId);
      if (categoryBadge && !categoryBadge.unlocked && percentage && percentage >= 80) {
        // Count how many quizzes in this category with 80%+ score
        const highScoreQuizzes = userProgress.quizHistory.filter((q: any) => 
          q.category === category && ((q.score / q.total) * 100) >= 80
        );
        
        if (highScoreQuizzes.length >= 3) {
          categoryBadge.unlocked = true;
          categoryBadge.unlockedAt = new Date();
          unlockedBadges.push(categoryBadge);
        }
      }
    }
  }
  
  // Check for quiz-master badge
  const quizMasterBadge = badges.find(b => b.id === "quiz-master");
  if (quizMasterBadge && !quizMasterBadge.unlocked && userProgress.quizzesTaken >= 10) {
    const totalScore = userProgress.quizHistory.reduce((sum: number, quiz: any) => sum + quiz.score, 0);
    const totalPossible = userProgress.quizHistory.reduce((sum: number, quiz: any) => sum + quiz.total, 0);
    const averagePercentage = (totalScore / totalPossible) * 100;
    
    if (averagePercentage >= 80) {
      quizMasterBadge.unlocked = true;
      quizMasterBadge.unlockedAt = new Date();
      unlockedBadges.push(quizMasterBadge);
    }
  }
  
  // Check for financial-guru badge
  const guruBadge = badges.find(b => b.id === "financial-guru");
  if (guruBadge && !guruBadge.unlocked && userProgress.level >= 10) {
    guruBadge.unlocked = true;
    guruBadge.unlockedAt = new Date();
    unlockedBadges.push(guruBadge);
  }
  
  // Update the badges in the user progress
  userProgress.badges = badges;
  
  return unlockedBadges;
}

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

export async function POST(req: NextRequest) {
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
    
    console.log("Processing quiz submission for user:", userId);
    
    const body = await req.json();
    const { category, difficulty, score, total } = body;
    
    if (score === undefined || total === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: score and total are required" },
        { status: 400 }
      );
    }
    
    console.log(`Quiz data: category=${category}, difficulty=${difficulty}, score=${score}, total=${total}`);
    
    const percentage = (score / total) * 100;
    
    // Import the UserProgress model directly
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
    
    if (!userProgress) {
      // Create new user progress
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
    }
    
    // Update quiz history
    userProgress.quizHistory.push({
      quizId: new Date().getTime().toString(),
      category,
      difficulty,
      score,
      total,
      date: new Date()
    });
    
    // Update stats
    userProgress.quizzesTaken += 1;
    userProgress.correctAnswers += score;
    
    // Add points based on difficulty and score
    let pointsEarned = score;
    if (difficulty === "medium") pointsEarned *= 2;
    if (difficulty === "hard") pointsEarned *= 3;
    
    userProgress.points += pointsEarned;
    
    // Update level
    const newLevel = Math.floor(userProgress.points / 100) + 1;
    userProgress.level = newLevel;
    
    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (userProgress.lastQuizDate) {
      const lastQuizDay = new Date(userProgress.lastQuizDate);
      lastQuizDay.setHours(0, 0, 0, 0);
      
      const dayDifference = Math.floor((today.getTime() - lastQuizDay.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDifference === 1) {
        // Consecutive day
        userProgress.streakDays += 1;
      } else if (dayDifference > 1) {
        // Streak broken
        userProgress.streakDays = 1;
      }
      // If dayDifference is 0, it's the same day, so don't update streak
    } else {
      // First quiz ever
      userProgress.streakDays = 1;
    }
    
    userProgress.lastQuizDate = today;
    
    // Check for badges to unlock
    const unlockedBadges = checkForBadgeUnlocks(userProgress, category, percentage);
    
    console.log("Saving user progress...");
    
    // Save changes
    await userProgress.save();
    
    console.log("User progress saved successfully");
    
    return NextResponse.json({
      userProgress,
      unlockedBadges
    });
  } catch (error: any) {
    console.error("Error submitting quiz results:", error);
    console.error("Error stack trace:", error.stack);
    
    return NextResponse.json(
      { error: error.message || "Failed to submit quiz results" },
      { status: 500 }
    );
  }
}

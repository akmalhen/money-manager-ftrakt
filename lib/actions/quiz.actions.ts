"use client";

import { connectToDB } from "@/lib/mongoose";
import { auth, getCurrentUserInfo } from "@/auth";
import mongoose from "mongoose";

// Define types for TypeScript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: Date | undefined;
  category: string;
  requirement: string;
}

interface QuizHistoryItem {
  quizId: string;
  category?: string;
  difficulty?: string;
  score: number;
  total: number;
  date: Date;
}

// Type for user progress data
interface UserProgressData {
  user: string;
  level: number;
  points: number;
  quizzesTaken: number;
  correctAnswers: number;
  streakDays: number;
  lastQuizDate?: Date;
  badges: Badge[];
  quizHistory: QuizHistoryItem[];
}

// Default badges that all users will have
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

// Import the UserProgress model
let UserProgress: any;

// Helper function to get the UserProgress model
async function getUserProgressModel() {
  if (!UserProgress) {
    try {
      // Only import on the server side
      if (typeof window === 'undefined') {
        const importedModule = await import("@/lib/models/quiz.model");
        UserProgress = importedModule.default;
      } else {
        // On client side, we'll use the API endpoints
        console.log("Client-side: Using API endpoints for quiz progress");
        // Return a dummy model for client-side that will be replaced by API calls
        return {};
      }
    } catch (err) {
      console.error("Error importing UserProgress model:", err);
    }
  }
  return UserProgress;
}

// Get or create user progress
export async function getUserProgress() {
  try {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      // On client side, first try fetching from API endpoint
      console.log("Client-side: Fetching user progress from API");
      
      try {
        const response = await fetch('/api/quiz/progress');
        if (!response.ok) {
          console.error(`Failed to fetch user progress: ${response.status} ${response.statusText}`);
          throw new Error(`Failed to fetch user progress: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Store the progress in localStorage as a backup with user-specific key
        try {
          const currentUser = getCurrentUserInfo();
          const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
          localStorage.setItem(userSpecificKey, JSON.stringify(data.userProgress));
        } catch (storageError) {
          console.warn("Could not save quiz progress to localStorage:", storageError);
        }
        
        return data.userProgress;
      } catch (error) {
        console.error("Error fetching user progress from API:", error);
        
        // Try to load backup from localStorage with user-specific key
        try {
          const currentUser = getCurrentUserInfo();
          const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
          const savedProgress = localStorage.getItem(userSpecificKey);
          if (savedProgress) {
            console.log(`Using quiz progress from localStorage for user: ${currentUser.id}`);
            return JSON.parse(savedProgress);
          }
        } catch (storageError) {
          console.warn("Could not read quiz progress from localStorage:", storageError);
        }
        
        // Return fallback data if API fails and no localStorage backup
        console.log("Using fallback user progress data");
        const fallbackProgress = {
          level: 1,
          points: 0,
          quizzesTaken: 0,
          correctAnswers: 0,
          streakDays: 0,
          badges: defaultBadges,
          quizHistory: []
        };
        
        // Save fallback to localStorage with user-specific key
        try {
          const currentUser = getCurrentUserInfo();
          const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
          localStorage.setItem(userSpecificKey, JSON.stringify(fallbackProgress));
        } catch (storageError) {
          console.warn("Could not save fallback progress to localStorage:", storageError);
        }
        
        return fallbackProgress;
      }
    }
    
    // Server-side code
    await connectToDB();
    
    // Get the current user from the session
    const session = await auth();
    
    // Ensure user is authenticated
    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }
    
    // @ts-ignore - NextAuth session type mismatch
    const userId = session.user.id || session.user.email;
    
    if (!userId) {
      throw new Error("User ID not found in session");
    }
    
    console.log("Getting user progress for user:", userId);
    
    // Get the UserProgress model
    const UserProgressModel = await getUserProgressModel();
    if (!UserProgressModel) {
      throw new Error("UserProgress model not available");
    }
    
    // Find or create user progress
    // First, try to find by userId field
    let userProgress = await UserProgressModel.findOne({ userId: userId });
    
    // If not found, try with the legacy user field
    if (!userProgress) {
      userProgress = await UserProgressModel.findOne({ user: userId });
    }
    
    // If still not found, we need to create a new profile
    if (!userProgress) {
      console.log("Creating new user progress for user:", userId);
      
      // Try to get User ID if possible
      let userObjId = null;
      if (userId.includes('@')) {
        const User = mongoose.models.User || mongoose.model("User", {
          email: { type: String, required: true, unique: true }
        });
        
        const user = await User.findOne({ email: userId });
        if (user) {
          userObjId = user._id;
        }
      }
      
      userProgress = await UserProgressModel.create({
        user: userObjId || userId, // Use ObjectId reference if available
        userId: userId, // Always store the string ID
        level: 1,
        points: 0,
        quizzesTaken: 0,
        correctAnswers: 0,
        streakDays: 0,
        badges: defaultBadges,
        quizHistory: []
      });
    } else {
      console.log("Found existing user progress for user:", userId);
    }
    
    return userProgress;
  } catch (error) {
    console.error("Error getting user progress:", error);
    
    // Return default data as fallback
    return {
      level: 1,
      points: 0,
      quizzesTaken: 0,
      correctAnswers: 0,
      streakDays: 0,
      badges: defaultBadges,
      quizHistory: []
    };
  }
}

// Check for badge unlocks based on user progress
function checkForBadgeUnlocks(userProgress: any, category?: string, percentage?: number) {
  const unlockedBadges: Badge[] = [];
  
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
        const highScoreQuizzes = userProgress.quizHistory.filter((q: QuizHistoryItem) => 
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
    const totalScore = userProgress.quizHistory.reduce((sum: number, quiz: QuizHistoryItem) => sum + quiz.score, 0);
    const totalPossible = userProgress.quizHistory.reduce((sum: number, quiz: QuizHistoryItem) => sum + quiz.total, 0);
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

// Submit quiz results
export async function submitQuizResults(quizData: {
  category?: string;
  difficulty?: string;
  score: number;
  total: number;
}) {
  try {
    // Check if we're on the client side
    if (typeof window !== 'undefined') {
      // On client side, first try submitting to API endpoint
      console.log("Client-side: Submitting quiz results to API");
      
      try {
        const response = await fetch('/api/quiz/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(quizData),
        });
        
        if (!response.ok) {
          console.error(`Failed to submit quiz results: ${response.status} ${response.statusText}`);
          throw new Error(`Failed to submit quiz results: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Store the updated progress in localStorage as a backup with user-specific key
        try {
          const currentUser = getCurrentUserInfo();
          const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
          localStorage.setItem(userSpecificKey, JSON.stringify(result.userProgress));
        } catch (storageError) {
          console.warn("Could not save updated quiz progress to localStorage:", storageError);
        }
        
        return result;
      } catch (error) {
        console.error("Error submitting quiz results to API:", error);
        
        // Fallback: Update progress locally in localStorage
        try {
          console.log("Using fallback: Updating quiz progress in localStorage");
          
          // Get current user for user-specific localStorage key
          const currentUser = getCurrentUserInfo();
          const userSpecificKey = `fintrack_quiz_progress_${currentUser.id}`;
          
          // Get current progress from localStorage or create new
          let currentProgress;
          try {
            const savedProgress = localStorage.getItem(userSpecificKey);
            currentProgress = savedProgress ? JSON.parse(savedProgress) : {
              level: 1,
              points: 0,
              quizzesTaken: 0,
              correctAnswers: 0,
              streakDays: 0,
              badges: defaultBadges,
              quizHistory: []
            };
          } catch (storageError) {
            console.warn("Could not read quiz progress from localStorage:", storageError);
            currentProgress = {
              level: 1,
              points: 0,
              quizzesTaken: 0,
              correctAnswers: 0,
              streakDays: 0,
              badges: defaultBadges,
              quizHistory: []
            };
          }
          
          // Update with new quiz data
          const { category, difficulty, score, total } = quizData;
          const percentage = (score / total) * 100;
          
          // Update quiz history
          currentProgress.quizHistory.push({
            quizId: new Date().getTime().toString(),
            category,
            difficulty,
            score,
            total,
            date: new Date()
          });
          
          // Update stats
          currentProgress.quizzesTaken += 1;
          currentProgress.correctAnswers += score;
          
          // Add points based on difficulty and score
          let pointsEarned = score;
          if (difficulty === "medium") pointsEarned *= 2;
          if (difficulty === "hard") pointsEarned *= 3;
          
          currentProgress.points += pointsEarned;
          
          // Update level
          currentProgress.level = Math.floor(currentProgress.points / 100) + 1;
          
          // Update streak
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (currentProgress.lastQuizDate) {
            const lastQuizDay = new Date(currentProgress.lastQuizDate);
            lastQuizDay.setHours(0, 0, 0, 0);
            
            const dayDifference = Math.floor((today.getTime() - lastQuizDay.getTime()) / (1000 * 60 * 60 * 24));
            
            if (dayDifference === 1) {
              // Consecutive day
              currentProgress.streakDays += 1;
            } else if (dayDifference > 1) {
              // Streak broken
              currentProgress.streakDays = 1;
            }
          } else {
            // First quiz ever
            currentProgress.streakDays = 1;
          }
          
          currentProgress.lastQuizDate = today;
          
          // Check for badges to unlock
          const unlockedBadges = checkForBadgeUnlocks(currentProgress, category, percentage);
          
          // Save updated progress with user-specific key
          localStorage.setItem(userSpecificKey, JSON.stringify(currentProgress));
          
          console.log(`Updated quiz progress saved to localStorage for user: ${currentUser.id}`);
          
          return {
            userProgress: currentProgress,
            unlockedBadges
          };
        } catch (localStorageError) {
          console.error("Error updating progress in localStorage:", localStorageError);
          
          // Provide minimal fallback data if local storage fails
          console.log("Using minimal fallback quiz submission data");
          
          // Create a properly formatted first-quiz badge for the unlockedBadges array
          const firstQuizBadge = defaultBadges.find(b => b.id === "first-quiz");
          const unlockedFirstQuizBadge = firstQuizBadge ? {
            ...firstQuizBadge,
            unlocked: true,
            unlockedAt: new Date()
          } : undefined;
          
          return {
            userProgress: {
              level: 1,
              points: quizData.score,
              quizzesTaken: 1,
              correctAnswers: quizData.score,
              streakDays: 1,
              badges: defaultBadges.map(badge => {
                if (badge.id === "first-quiz") {
                  return { ...badge, unlocked: true, unlockedAt: new Date() };
                }
                return badge;
              }),
              quizHistory: [{
                quizId: new Date().getTime().toString(),
                category: quizData.category,
                difficulty: quizData.difficulty,
                score: quizData.score,
                total: quizData.total,
                date: new Date()
              }]
            },
            unlockedBadges: unlockedFirstQuizBadge ? [unlockedFirstQuizBadge] : []
          };
        }
      }
    }
    
    // Server-side code
    await connectToDB();
    
    // Get the current user from the session
    const session = await auth();
    
    // Ensure user is authenticated
    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }
    
    // @ts-ignore - NextAuth session type mismatch
    const userId = session.user.id || session.user.email;
    
    if (!userId) {
      throw new Error("User ID not found in session");
    }
    
    console.log("Submitting quiz results for user:", userId);
    
    // Get the UserProgress model
    const UserProgressModel = await getUserProgressModel();
    if (!UserProgressModel) {
      throw new Error("UserProgress model not available");
    }
    
    // Find the user's progress document
    let userProgress = await UserProgressModel.findOne({ user: userId });
    
    if (!userProgress) {
      console.log("Creating new user progress for quiz submission:", userId);
      userProgress = await UserProgressModel.create({
        user: userId,
        level: 1,
        points: 0,
        quizzesTaken: 0,
        correctAnswers: 0,
        streakDays: 0,
        badges: defaultBadges,
        quizHistory: []
      });
    }
    
    const { category, difficulty, score, total } = quizData;
    const percentage = (score / total) * 100;
    
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
    
    // Save the updated progress to the database
    await userProgress.save();
    console.log("Saved updated user progress to database for user:", userId);
    
    return {
      userProgress,
      unlockedBadges
    };
  } catch (error) {
    console.error('Error updating user progress in database:', error);
    
    // Fallback to default mock data
    const mockUserProgress = {
      level: 1,
      points: quizData.score,
      quizzesTaken: 1,
      correctAnswers: quizData.score,
      streakDays: 1,
      badges: defaultBadges.map(badge => {
        if (badge.id === "first-quiz") {
          return { ...badge, unlocked: true, unlockedAt: new Date() };
        }
        return badge;
      }),
      quizHistory: [{
        quizId: new Date().getTime().toString(),
        category: quizData.category,
        difficulty: quizData.difficulty,
        score: quizData.score,
        total: quizData.total,
        date: new Date()
      }]
    };
    
    // Create a properly formatted first-quiz badge for the unlockedBadges array
    const firstQuizBadge = defaultBadges.find(b => b.id === "first-quiz");
    const unlockedFirstQuizBadge = firstQuizBadge ? {
      ...firstQuizBadge,
      unlocked: true,
      unlockedAt: new Date()
    } : undefined;
    
    return {
      userProgress: mockUserProgress,
      unlockedBadges: unlockedFirstQuizBadge ? [unlockedFirstQuizBadge] : []
    };
  }
}

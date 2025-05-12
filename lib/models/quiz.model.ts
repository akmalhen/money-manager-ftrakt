import mongoose, { Schema } from "mongoose";

// Define the badge schema
const BadgeSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  unlocked: { type: Boolean, default: false },
  unlockedAt: { type: Date, default: null },
  category: { type: String, required: true },
  requirement: { type: String, required: true },
});

// Define quiz history item schema
const QuizHistoryItemSchema = new Schema({
  quizId: { type: String },
  category: { type: String },
  difficulty: { type: String },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// Define the user progress schema
const UserProgressSchema = new Schema({
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
  badges: [BadgeSchema],
  quizHistory: [QuizHistoryItemSchema]
}, { timestamps: true });

// Create the model only on the server side
let UserProgress;

if (typeof window === 'undefined') {
  UserProgress = mongoose.models.UserProgress || mongoose.model("UserProgress", UserProgressSchema);
} else {
  // On client side, provide a dummy model or null
  UserProgress = null;
}

export default UserProgress;

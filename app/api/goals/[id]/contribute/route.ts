import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { connectToDB } from "@/lib/database";
import SavingGoal from "@/lib/models/saving-goal.model";
import mongoose from "mongoose";

// POST /api/goals/[id]/contribute - Add a contribution to a goal
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid goal ID" },
        { status: 400 }
      );
    }

    await connectToDB();

    const body = await req.json();
    const { amount, note } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid contribution amount" },
        { status: 400 }
      );
    }

    // Find the goal first to ensure it exists and belongs to the user
    // @ts-ignore - Next-auth types don't match our user structure
    const userId = session.user.id;
    
    const existingGoal = await SavingGoal.findOne({
      _id: id,
      user: userId,
    });

    if (!existingGoal) {
      return NextResponse.json(
        { success: false, message: "Goal not found" },
        { status: 404 }
      );
    }

    // Add the contribution and update the current amount
    const newContribution = {
      amount,
      date: new Date(),
      note: note || "",
    };

    const updatedGoal = await SavingGoal.findByIdAndUpdate(
      id,
      {
        $push: { contributions: newContribution },
        $inc: { currentAmount: amount },
      },
      { new: true }
    );

    return NextResponse.json({ success: true, goal: updatedGoal });
  } catch (error) {
    console.error("Error adding contribution:", error);
    return NextResponse.json(
      { success: false, message: "Failed to add contribution" },
      { status: 500 }
    );
  }
}

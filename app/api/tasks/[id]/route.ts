import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import Task from "@/lib/models/task.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

// GET a specific task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // @ts-ignore - Next-auth types don't match our user structure
    const userId = session.user.id;
    
    if (!userId) {
      console.error("User ID not found in session:", session);
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }
    
    const taskId = params.id;
    
    await connectToDB();
    
    const task = await Task.findById(taskId);
    
    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }
    
    // Verify ownership
    if (task.user.toString() !== userId) {
      return NextResponse.json(
        { error: "Not authorized to access this task" },
        { status: 403 }
      );
    }
    
    return NextResponse.json(task);
  } catch (error: any) {
    console.error("Error fetching task:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// PATCH update a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // @ts-ignore - Next-auth types don't match our user structure
    const userId = session.user.id;
    
    if (!userId) {
      console.error("User ID not found in session:", session);
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }
    
    const taskId = params.id;
    
    // Parse request body
    let updateData;
    try {
      updateData = await request.json();
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
    
    await connectToDB();
    
    const task = await Task.findById(taskId);
    
    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }
    
    // Verify ownership
    if (task.user.toString() !== userId) {
      return NextResponse.json(
        { error: "Not authorized to update this task" },
        { status: 403 }
      );
    }
    
    console.log("Updating task with data:", updateData);
    
    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { ...updateData },
      { new: true }
    );
    
    console.log("Task updated successfully:", updatedTask);
    
    return NextResponse.json(updatedTask);
  } catch (error: any) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update task" },
      { status: 500 }
    );
  }
}

// DELETE a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    // @ts-ignore - Next-auth types don't match our user structure
    const userId = session.user.id;
    
    if (!userId) {
      console.error("User ID not found in session:", session);
      return NextResponse.json(
        { error: "User ID not found in session" },
        { status: 400 }
      );
    }
    
    const taskId = params.id;
    
    await connectToDB();
    
    const task = await Task.findById(taskId);
    
    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }
    
    // Verify ownership
    if (task.user.toString() !== userId) {
      return NextResponse.json(
        { error: "Not authorized to delete this task" },
        { status: 403 }
      );
    }
    
    console.log("Deleting task:", taskId);
    
    // Delete task
    await Task.findByIdAndDelete(taskId);
    
    console.log("Task deleted successfully");
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete task" },
      { status: 500 }
    );
  }
}

// app/api/calendar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import CalendarEvent from "@/lib/models/calendar.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { Session } from "next-auth";

// GET all calendar events for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;

    await connectToDB();
    const events = await CalendarEvent.find({ user: userId }).sort({ date: 1 });

    return NextResponse.json(events);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch events" }, { status: 500 });
  }
}

// POST a new calendar event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // @ts-ignore
    const userId = session.user.id;
    const body = await request.json();

    const { title, description, date } = body;

    if (!title || !date) {
      return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
    }

    await connectToDB();

    const newEvent = await CalendarEvent.create({
      title,
      description: description || "",
      date: new Date(date),
      user: userId,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create event" }, { status: 500 });
  }
}

// /lib/models/calendar.model.ts
import { Schema, model, models } from "mongoose";

const CalendarEventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const CalendarEvent = models.CalendarEvent || model("CalendarEvent", CalendarEventSchema);

export default CalendarEvent;

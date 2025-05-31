// components/create-event-dialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreateEventDialogProps {
  onCreate: (event: {
    title: string;
    date: string;
    time: string;
    category: string;
  }) => void;
}

export function CreateEventDialog({ onCreate }: CreateEventDialogProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");

  const handleCreate = () => {
    if (!title || !date || !time || !category) return;
    onCreate({ title, date, time, category });
    setTitle("");
    setDate("");
    setTime("");
    setCategory("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Add Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <Button onClick={handleCreate} className="w-full">
            Create Event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { BASE_API_URL } from "@/index";
import { format } from "date-fns";
import { CreateEventDialog } from "@/components/create-event-dialog";
import { EventCard } from "@/components/event-card";

interface Event {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  color: "blue" | "green" | "purple" | "yellow" | "red";
  date: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  user: string;
}

export default function CalendarPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_API_URL}/api/events`);
        if (!response.ok) throw new Error("Failed to fetch events");

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load events.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchEvents();
    }
  }, [session, toast]);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedEvents = filteredEvents.filter((e) => e.isPinned);
  const unpinnedEvents = filteredEvents.filter((e) => !e.isPinned);

  const formatDate = (dateString: string) => format(new Date(dateString), "MMM d, yyyy");

  const handleAddEvent = async (
    newEvent: Omit<Event, "_id" | "createdAt" | "updatedAt" | "isPinned" | "user">
  ) => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create event");

      setEvents((prev) => [data.event, ...prev]);
      toast({ title: "Event created", description: "Event added successfully." });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    }
  };

  const handleTogglePin = async (id: string) => {
    const eventToUpdate = events.find((e) => e._id === id);
    if (!eventToUpdate) return;

    try {
      const response = await fetch(`${BASE_API_URL}/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !eventToUpdate.isPinned }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update event");
      }

      setEvents((prev) =>
        prev.map((e) => (e._id === id ? { ...e, isPinned: !e.isPinned } : e))
      );
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update event",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = async (id: string, updatedEvent: Partial<Event>) => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update event");
      }

      setEvents((prev) =>
        prev.map((e) => (e._id === id ? { ...e, ...updatedEvent } : e))
      );

      toast({ title: "Event updated", description: "Your event has been updated." });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update event",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete event");
      }

      setEvents((prev) => prev.filter((e) => e._id !== id));
      toast({ title: "Event deleted", description: "Your event has been removed." });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="flex-1 p-6 md:p-8 pt-16 md:pt-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
            Smart Calendar
          </h1>
          <p className="text-muted-foreground mt-1">Plan and track your events</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="w-full pl-8 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <CreateEventDialog onCreateEvent={handleAddEvent}>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </CreateEventDialog>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Card key={n} className="h-64 animate-pulse">
              <CardContent className="p-6">
                <div className="h-5 bg-muted rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {pinnedEvents.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                Pinned Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {pinnedEvents.map((event) => (
                  <EventCard
                    key={event._id}
                    {...event}
                    date={formatDate(event.date)}
                    onTogglePin={handleTogglePin}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))}
              </div>
            </>
          )}

          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            All Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unpinnedEvents.map((event) => (
              <EventCard
                key={event._id}
                {...event}
                date={formatDate(event.date)}
                onTogglePin={handleTogglePin}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

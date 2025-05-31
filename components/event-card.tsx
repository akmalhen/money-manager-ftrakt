// components/event-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM
  category: string;
}

export function EventCard({ title, date, time, category }: EventCardProps) {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold truncate">{title}</h3>
          <Badge>{category}</Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{time}</span>
        </div>
      </CardContent>
    </Card>
  );
}

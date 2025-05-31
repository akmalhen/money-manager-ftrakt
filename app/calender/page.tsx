'use client';

import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';

type CalendarEvent = {
  _id?: string;
  title: string;
  description?: string;
  date: string; // ISO string
};

export default function CalendarPage() {
  const [value, setValue] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch('/api/calendar');
    const data = await res.json();
    setEvents(data);
  };

  const handleAddEvent = async () => {
    if (!title) return alert('Title is required');
    
    const newEvent = {
      title,
      description,
      date: value.toISOString(),
    };

    const res = await fetch('/api/calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    });

    if (res.ok) {
      setTitle('');
      setDescription('');
      fetchEvents();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to add event');
    }
  };

  const getEventsForDate = (date: Date) => {
    const formatted = format(date, 'yyyy-MM-dd');
    return events.filter(event => format(new Date(event.date), 'yyyy-MM-dd') === formatted);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📅 Calendar</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div>
          <Calendar onChange={setValue} value={value} />
          <p className="mt-2 text-sm text-gray-600">
            Selected Date: {format(value, 'yyyy-MM-dd')}
          </p>
        </div>

        <div className="flex-1">
          <h2 className="font-semibold text-lg">Add Event</h2>
          <input
            className="w-full border p-2 my-1 rounded"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full border p-2 my-1 rounded"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded mt-2 hover:bg-blue-700"
            onClick={handleAddEvent}
          >
            Add Event
          </button>

          <div className="mt-6">
            <h3 className="font-semibold text-md mb-2">Events on {format(value, 'yyyy-MM-dd')}:</h3>
            {getEventsForDate(value).length === 0 ? (
              <p className="text-sm text-gray-500">No events.</p>
            ) : (
              <ul className="list-disc ml-5">
                {getEventsForDate(value).map((event) => (
                  <li key={event._id} className="mb-1">
                    <strong>{event.title}</strong> – {event.description || 'No description'}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { registerForEvent } from "./actions";

export type EventRow = {
  id: string;
  title: string;
  event_type: string;
  event_date: string;
  location: string;
  capacity: number | null;
  registered_count: number;
};

export function EventList({
  events,
  registeredEventIds,
  isLoggedIn,
}: {
  events: EventRow[];
  registeredEventIds: string[];
  isLoggedIn: boolean;
}) {
  return (
    <div className="space-y-8">
      {events.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              initiallyRegistered={registeredEventIds.includes(event.id)}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="w-full rounded-lg border border-white/[0.08] bg-white/[0.02] p-12 text-center shadow-xl shadow-black/20">
          <div className="w-12 h-12 rounded-full border border-white/[0.1] bg-white/[0.05] mx-auto flex items-center justify-center mb-4 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No upcoming events</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The collective is currently planning the next series of events. Check back soon or run the SQL migration to add test events.
          </p>
        </div>
      )}
    </div>
  );
}

function EventCard({
  event,
  initiallyRegistered,
  isLoggedIn,
}: {
  event: EventRow;
  initiallyRegistered: boolean;
  isLoggedIn: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [isRegistered, setIsRegistered] = useState(initiallyRegistered);
  const [localCount, setLocalCount] = useState(event.registered_count);
  const router = useRouter();

  const formattedDate = new Date(event.event_date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const isFull = event.capacity !== null && localCount >= event.capacity;

  const handleRegister = () => {
    startTransition(async () => {
      const res = await registerForEvent(event.id);
      if (res?.success) {
        setIsRegistered(true);
        setLocalCount((prev) => prev + 1);
      } else if (res?.error) {
        alert(res.error);
      }
    });
  };

  return (
    <Card className="h-full border-white/[0.08] bg-card hover:border-primary/20 transition-colors duration-300 shadow-xl shadow-black/20 flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase px-2 py-1 rounded-sm border bg-white/[0.03] border-white/[0.1] text-muted-foreground mb-3 inline-block">
              {event.event_type}
            </span>
            <CardTitle className="text-xl text-primary">
              {event.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow">
        <div className="space-y-2">
          {/* Date */}
          <div className="flex items-center gap-2 text-sm text-foreground/90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{formattedDate}</span>
          </div>
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{event.location}</span>
          </div>
          {/* Capacity */}
          {event.capacity !== null && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span className="text-xs">
                {localCount} / {event.capacity} registered
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t border-white/[0.04]">
        {!isLoggedIn ? (
          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors duration-200 opacity-100"
          >
            Sign in to register
          </Button>
        ) : isRegistered ? (
          <Button
            disabled
            variant="outline"
            className="w-full border-primary/20 bg-primary/5 text-primary opacity-100"
          >
            ✓ Registered
          </Button>
        ) : isFull ? (
          <Button
            disabled
            variant="outline"
            className="w-full border-white/[0.08] text-muted-foreground opacity-50"
          >
            Event Full
          </Button>
        ) : (
          <Button
            onClick={handleRegister}
            disabled={isPending}
            className="w-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors duration-200 opacity-100 disabled:opacity-50"
          >
            {isPending ? "Registering..." : "Register"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

import { createClient } from "@/lib/supabase/server";
import { EventList, type EventRow } from "./event-list";

export const metadata = {
  title: "Events - Agentic Devs Collective Hub",
  description: "Upcoming events, hackathons, and workshops.",
};

export default async function EventsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch all upcoming events (or all events for now, sorted by date)
  const { data: events, error } = await supabase
    .from("events")
    .select("*, event_registrations(count)")
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
  }

  // Fetch the current user's registrations if they are logged in
  let registeredEventIds: string[] = [];
  if (user) {
    const { data: registrations, error: regError } = await supabase
      .from("event_registrations")
      .select("event_id")
      .eq("member_id", user.id);

    if (!regError && registrations) {
      registeredEventIds = registrations.map((r) => r.event_id);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const initialEvents: EventRow[] = (events || []).map((e: any) => ({
    ...e,
    registered_count: e.event_registrations?.[0]?.count || 0,
  } as EventRow));

  return (
    <div className="min-h-screen relative overflow-hidden p-6 md:p-10">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-mono font-bold text-foreground">
            <span className="text-emerald-400">~/</span>events
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl">
            Register for upcoming hackathons, workshops, and chapter meetups. Space is limited for some events.
          </p>
        </div>

        {/* Client-side event grid */}
        <EventList 
          events={initialEvents} 
          registeredEventIds={registeredEventIds} 
          isLoggedIn={!!user} 
        />
      </div>
    </div>
  );
}

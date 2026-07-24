import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { EventList, type EventRow } from "./event-list";

export const metadata = {
  title: "Events - Agentic Devs Collective Hub",
  description: "Upcoming events, hackathons, and workshops.",
};

const getCachedEvents = unstable_cache(
  async () => {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      return [];
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (events || []).map((e: any) => ({
      ...e,
      registered_count: e.registered_count || 0,
    } as EventRow));
  },
  ["events-list"],
  { revalidate: 3600 }
);

export default async function EventsPage() {
  const supabaseServer = await createServerClient();

  // Parallelize the user fetch and the events fetch
  const [userResult, initialEvents] = await Promise.all([
    supabaseServer.auth.getUser(),
    getCachedEvents(),
  ]);

  const user = userResult.data?.user;

  // Fetch the current user's registrations if they are logged in
  let registeredEventIds: string[] = [];
  if (user) {
    const { data: registrations, error: regError } = await supabaseServer
      .from("event_registrations")
      .select("event_id")
      .eq("member_id", user.id);

    if (!regError && registrations) {
      registeredEventIds = registrations.map((r) => r.event_id);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-6 md:p-10">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            <span className="text-primary">~/</span>events
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

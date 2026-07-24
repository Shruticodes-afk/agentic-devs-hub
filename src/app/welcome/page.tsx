import { createClient } from "@/lib/supabase/server";
import { generateOnboardingMessage } from "./actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: { name?: string; city?: string };
}) {
  const name = searchParams.name || "Developer";
  const city = searchParams.city || "your city";

  const supabase = await createClient();

  // Find the chapter
  let chapter = null;
  if (city && city !== "your city") {
    const { data } = await supabase
      .from("chapters")
      .select("*")
      .eq("city", city)
      .single();
    chapter = data;
  }

  // Find upcoming event for the city
  let event = null;
  if (city && city !== "your city") {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("location", city)
      .gt("event_date", new Date().toISOString())
      .order("event_date", { ascending: true })
      .limit(1)
      .maybeSingle();
    event = data;
  }

  const welcomeMessage = await generateOnboardingMessage(
    name,
    city,
    chapter?.slug || null,
    event?.title || null
  );

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden p-6">
      <div className="absolute inset-0 dot-grid pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-white/10 bg-black/50 p-8 shadow-2xl shadow-black/50 backdrop-blur-md text-center">
        <h1 className="text-3xl font-bold text-white mb-6">Welcome to the Collective</h1>
        
        <div className="rounded-lg bg-white/[0.03] border border-white/5 p-6 mb-8 text-left">
          <p className="text-base text-white/90 leading-relaxed font-medium">
            {welcomeMessage}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row justify-center">
          {chapter && (
            <Link href={`/chapters`} className="flex-1">
              <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold">
                Join Chapter
              </Button>
            </Link>
          )}
          {event && (
            <Link href={`/events`} className="flex-1">
              <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">
                Register for {event.title}
              </Button>
            </Link>
          )}
          {!chapter && !event && (
            <Link href="/" className="w-full">
              <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

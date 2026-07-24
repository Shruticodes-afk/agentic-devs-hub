import { createClient } from "@/lib/supabase/server";
import { ChapterList, type Chapter } from "./chapter-list";

export const metadata = {
  title: "Chapters - Agentic Devs Collective Hub",
  description: "Find and join a local chapter of the Agentic Devs Collective.",
};

export default async function ChaptersPage() {
  const supabase = await createClient();

  // Fetch chapters, ordered by member count
  const { data: chapters, error } = await supabase
    .from("chapters")
    .select("*")
    .order("member_count", { ascending: false });

  if (error) {
    console.error("Error fetching chapters:", error);
  }

  // Fallback to empty array if there's an error or no data
  const initialChapters: Chapter[] = chapters || [];

  return (
    <div className="min-h-screen relative overflow-hidden p-6 md:p-10">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-sans font-bold text-foreground">
            <span className="text-primary">~/</span>chapters
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-xl">
            Join a local node of the collective. Attend events, collaborate on agent architectures, and build alongside peers in your city.
          </p>
        </div>

        {/* Client-side filter and grid */}
        <ChapterList initialChapters={initialChapters} />
      </div>
    </div>
  );
}

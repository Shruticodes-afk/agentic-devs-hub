import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { OrbitalDiagram } from "@/components/orbital-diagram";

const getCachedTotalMembers = unstable_cache(
  async () => {
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: chapters, error } = await supabase
      .from("chapters")
      .select("member_count");

    if (error) {
      console.error("Error fetching chapters:", error);
      return 128; // Fallback
    }
    
    const total = chapters.reduce((acc, chapter) => acc + (chapter.member_count || 0), 0);
    return total;
  },
  ["total-members-count"],
  { revalidate: 3600 }
);

export default async function HomePage() {
  const totalMembers = await getCachedTotalMembers();

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#0A0A0A] flex flex-col items-center justify-start pt-14">
      {/* Soft radial glow */}
      <div className="absolute inset-0 flex items-start justify-center pt-10 pointer-events-none z-0">
        <div 
          className="w-[1200px] h-[1000px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(200,255,230,0.08) 40%, transparent 70%)"
          }}
        />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-[calc(100vh-3.5rem)] py-24 flex flex-col items-center justify-center text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/80 mb-8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          Building the future of developer communities
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-sans tracking-tight leading-[1.1] text-white mb-6 max-w-5xl">
          The Hub for <span className="text-white/80">Agentic Developers</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-lg md:text-xl text-[#A0A0A0] max-w-2xl mb-12 leading-relaxed">
          Connect with your local chapter, attend AI-powered events, and build the next generation of autonomous systems — together.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-20">
          <Button
            size="lg"
            render={<Link href="/signup" />}
            className="rounded-full bg-white text-black hover:bg-gray-200 font-bold px-10 h-14 text-base transition-colors shadow-xl"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href="/dashboard" />}
            className="rounded-full bg-transparent border-white/20 text-white hover:bg-white/10 font-bold px-10 h-14 text-base transition-colors"
          >
            Go to Dashboard
          </Button>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-16 relative z-20">
          {[
            { icon: "🏙️", label: "Local Chapters" },
            { icon: "📅", label: "Community Events" },
            { icon: "🤖", label: "AI Assistant" },
            { icon: "👥", label: "Developer Network" },
          ].map((feature) => (
            <div
              key={feature.label}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/90 shadow-lg backdrop-blur-md"
            >
              <span>{feature.icon}</span>
              <span>{feature.label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Orbital Diagram Section */}
      <section className="relative z-10 w-full flex justify-center pb-20 overflow-hidden">
        <OrbitalDiagram statsLabel={`${totalMembers} Members`} />
      </section>
    </div>
  );
}

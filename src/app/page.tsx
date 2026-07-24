import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OrbitalDiagram } from "@/components/orbital-diagram";
import { MapPin, Calendar, Bot, Network, Star } from "lucide-react";

export default function HomePage() {
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
        
        {/* Orbital Diagram Background Integration */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
           <OrbitalDiagram />
        </div>

        {/* Hero Content Wrapper */}
        <div className="relative z-10 flex flex-col items-center w-full">
          {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/80 mb-8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          Building the future of developer communities
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-white mb-6 max-w-5xl">
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
            { icon: <MapPin className="w-4 h-4" />, label: "Local Chapters" },
            { icon: <Calendar className="w-4 h-4" />, label: "Community Events" },
            { icon: <Bot className="w-4 h-4" />, label: "AI Assistant" },
            { icon: <Network className="w-4 h-4" />, label: "Developer Network" },
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
        </div>
      </main>

      {/* Terminal Demo Section */}
      <section className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-16 flex justify-center">
        <div className="w-full rounded-xl border border-white/10 bg-[#121212] overflow-hidden shadow-2xl">
          {/* Terminal title bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/40">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className="text-xs text-white/40 ml-2 font-semibold">
              Live Activity
            </span>
          </div>
          {/* Terminal content */}
          <div className="p-6 text-sm leading-relaxed space-y-4 text-left">
            <div>
              <span className="text-white font-bold">agent init</span>
              <span className="text-white/60"> --collective</span>
            </div>
            <div className="text-white/80 text-xs leading-relaxed font-semibold">
              <p>✓ Connected to local chapter</p>
              <p>✓ Synced 42 community events</p>
              <p>✓ AI assistant ready</p>
            </div>
            <div className="pt-2 border-t border-white/10">
              <span className="text-white font-bold">agent status</span>
            </div>
            <div className="rounded-md bg-white/5 border border-white/10 px-4 py-3">
              <p className="text-white font-bold text-xs">
                ● online — 3 agents active
              </p>
              <p className="text-white/60 font-semibold text-xs mt-1">
                chapter: bengaluru · members: 128
              </p>
            </div>
            <div>
              <span className="text-white animate-pulse">
                ▌
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Developers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The Agentic Devs Collective is powering the next wave of builders across the globe.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "Finding builders who actually understand agent architectures used to be impossible. The collective events changed everything for my team.",
              name: "Priya Sharma",
              role: "Full Stack Developer",
              chapter: "Bengaluru Chapter",
              color: "bg-emerald-500/20 text-emerald-400",
              initial: "P",
            },
            {
              quote: "The AI assistant alone is worth joining for. It instantly connected me with local resources and helped me debug a massive LangChain integration.",
              name: "David Chen",
              role: "AI Engineer",
              chapter: "San Francisco Chapter",
              color: "bg-blue-500/20 text-blue-400",
              initial: "D",
            },
            {
              quote: "Finally, a community that actually builds instead of just talking about hype. I met my current co-founders at our local chapter meetup.",
              name: "Elena Rodriguez",
              role: "Systems Architect",
              chapter: "London Chapter",
              color: "bg-purple-500/20 text-purple-400",
              initial: "E",
            },
          ].map((t, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-8 flex flex-col justify-between">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-white/80 leading-relaxed mb-8">&quot;{t.quote}&quot;</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${t.color}`}>
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                  <p className="text-xs text-primary/80 mt-0.5">{t.chapter}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Purpose Section */}
      <section className="relative z-10 w-full bg-white/[0.01] border-y border-white/5 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Network className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Why We Build Together</h2>
          <div className="space-y-6 text-muted-foreground text-lg leading-relaxed text-left max-w-3xl mx-auto">
            <p>
              Developers building with AI agents often work in isolation. You&apos;re wrestling with massive LLM context windows, unpredictable agent loops, and evolving frameworks—alone in your terminal. There has been a distinct lack of community and shared resources for this specific frontier.
            </p>
            <p>
              The Agentic Devs Collective changes that. We connect local chapters of agentic developers so they can collaborate, share deep technical knowledge, and build together both in person and online. We believe that peer-to-peer networking is the fastest way to accelerate AI capabilities.
            </p>
            <p>
              Agentic AI development is new, fast-moving, and notoriously difficult to debug alone. To keep up, developers need more than documentation—they need a community support system.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Marquee Animation */}
      <section className="relative z-10 w-full overflow-hidden py-16 bg-[#0A0A0A]">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10"></div>
        
        <div className="flex w-[200%] animate-marquee">
          {/* Double array for seamless loop */}
          {[1, 2].map((group) => (
            <div key={group} className="flex w-1/2 items-center justify-around">
              {["Next.js", "Supabase", "Gemini AI", "Tailwind CSS", "React", "TypeScript", "Lucide"].map((tech) => (
                <span key={tech} className="text-xl font-bold text-white/20 whitespace-nowrap mx-8">
                  {tech}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

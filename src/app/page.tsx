import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />
      {/* Subtle emerald glow — bottom-left corner */}
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/[0.07] rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section — asymmetric split */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center w-full py-16 lg:py-0">
          {/* Left — text content (3/5) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-sm text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Building the future of developer communities
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              <span className="text-foreground">The Hub for </span>
              <span className="font-mono text-emerald-400">
                Agentic Developers
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Connect with your local chapter, attend AI-powered events, and
              build the next generation of autonomous systems — together.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
              <Button
                size="lg"
                render={<Link href="/signup" />}
                className="bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-colors duration-200 px-8 text-base"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/dashboard" />}
                className="border-white/[0.08] text-foreground hover:bg-white/[0.04] transition-colors duration-200 px-8 text-base"
              >
                Go to Dashboard
              </Button>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              {[
                { icon: "🏙️", label: "Local Chapters" },
                { icon: "📅", label: "Community Events" },
                { icon: "🤖", label: "AI Assistant" },
                { icon: "👥", label: "Developer Network" },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-sm text-muted-foreground hover:border-emerald-500/30 transition-colors duration-300"
                >
                  <span>{feature.icon}</span>
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — terminal block (2/5) */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] overflow-hidden shadow-2xl shadow-black/50">
              {/* Terminal title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <span className="text-xs text-muted-foreground font-mono ml-2">
                  ~/agentic-devs
                </span>
              </div>
              {/* Terminal content */}
              <div className="p-5 font-mono text-sm leading-relaxed space-y-3">
                <div>
                  <span className="text-emerald-400">$</span>
                  <span className="text-muted-foreground"> agent init</span>
                  <span className="text-emerald-400"> --collective</span>
                </div>
                <div className="text-muted-foreground/70 text-xs leading-relaxed">
                  <p>✓ Connected to local chapter</p>
                  <p>✓ Synced 42 community events</p>
                  <p>✓ AI assistant ready</p>
                </div>
                <div className="pt-1 border-t border-white/[0.04]">
                  <span className="text-emerald-400">$</span>
                  <span className="text-muted-foreground"> agent status</span>
                </div>
                <div className="rounded-md bg-emerald-500/5 border border-emerald-500/10 px-3 py-2">
                  <p className="text-emerald-400 text-xs">
                    ● online — 3 agents active
                  </p>
                  <p className="text-muted-foreground/60 text-xs mt-1">
                    chapter: bengaluru · members: 128
                  </p>
                </div>
                <div>
                  <span className="text-emerald-400">$</span>
                  <span className="text-muted-foreground animate-pulse">
                    {" "}
                    ▌
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

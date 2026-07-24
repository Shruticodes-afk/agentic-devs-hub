import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0A0A0A] flex flex-col items-center justify-center pt-14">
      {/* Soft radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] bg-white/[0.04] rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-32 flex flex-col items-center text-center">
        
        {/* Floating Pills */}
        <div className="absolute top-10 left-4 md:top-24 md:left-20 hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-md">
           <span className="w-2 h-2 rounded-full bg-white/80" />
           Local Chapters
        </div>
        <div className="absolute top-32 right-4 md:top-40 md:right-24 hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-md">
           <span className="w-2 h-2 rounded-full bg-white/80" />
           AI Assistant
        </div>
        <div className="absolute bottom-10 left-10 md:bottom-32 md:left-32 hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-md">
           <span className="w-2 h-2 rounded-full bg-white/80" />
           Community Events
        </div>
        <div className="absolute bottom-20 right-10 md:bottom-24 md:right-32 hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white shadow-lg backdrop-blur-md">
           <span className="w-2 h-2 rounded-full bg-white/80" />
           Developer Network
        </div>

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
      </main>
    </div>
  );
}

import { getResources } from "./actions";
import { ResourcesClient } from "./resources-client";
import { Library } from "lucide-react";

export const metadata = {
  title: "Resources | Agentic Devs Collective",
  description: "Community-driven resources, guides, templates, and links.",
};

export default async function ResourcesPage() {
  const initialResources = await getResources();

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 inset-x-0 h-full w-full bg-grid-white/[0.02] bg-[size:32px_32px]" />
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/10 via-transparent to-transparent opacity-50 blur-3xl" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] pointer-events-none" />
      
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 relative z-10">
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Library className="w-4 h-4" />
            <span>Community Library</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            Resources & Tools
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Discover and share essential guides, design templates, slide decks, and external links curated by the Agentic Devs community.
          </p>
        </div>

        {/* Resources Grid/List Client */}
        <ResourcesClient initialResources={initialResources} />
        
      </main>
    </div>
  );
}

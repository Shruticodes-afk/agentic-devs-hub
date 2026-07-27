"use client";

import { useState } from "react";
import { type Resource } from "./actions";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, BookOpen, LayoutTemplate, Presentation, Link as LinkIcon } from "lucide-react";
import { AddResourceDialog } from "./add-resource-dialog";
import { Badge } from "@/components/ui/badge";

interface ResourcesClientProps {
  initialResources: Resource[];
}

export function ResourcesClient({ initialResources }: ResourcesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter resources based on search query (searching titles and tags)
  const filteredResources = initialResources.filter((resource) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    
    return (
      resource.title.toLowerCase().includes(query) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      resource.type.toLowerCase().includes(query)
    );
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return <BookOpen className="w-4 h-4 mr-1.5" />;
      case 'template': return <LayoutTemplate className="w-4 h-4 mr-1.5" />;
      case 'deck': return <Presentation className="w-4 h-4 mr-1.5" />;
      default: return <LinkIcon className="w-4 h-4 mr-1.5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case 'template': return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case 'deck': return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default: return "bg-green-500/10 text-green-400 border-green-500/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search resources or tags..." 
            className="pl-9 bg-white/[0.03] border-white/[0.08] focus-visible:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <AddResourceDialog />
      </div>

      {/* Grid of Resources */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.02] border border-white/[0.05] rounded-2xl">
          <p className="text-muted-foreground">No resources found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <a 
              key={resource.id} 
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col h-full bg-[#121212]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(var(--primary),0.15)] hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <Badge variant="outline" className={`${getTypeColor(resource.type)} capitalize font-medium px-2.5 py-0.5 border`}>
                  {getTypeIcon(resource.type)}
                  {resource.type}
                </Badge>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 leading-tight">
                {resource.title}
              </h3>
              
              <div className="mt-auto pt-4 flex flex-wrap gap-2">
                {resource.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="text-xs font-medium px-2 py-1 rounded-md bg-white/[0.05] text-muted-foreground border border-white/[0.05]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

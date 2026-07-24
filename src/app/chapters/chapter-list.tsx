"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type Chapter = {
  id: string;
  city: string;
  country: string;
  member_count: number;
  status: "active" | "forming";
};

export function ChapterList({ initialChapters }: { initialChapters: Chapter[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChapters = initialChapters.filter((chapter) =>
    chapter.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <Input
          type="text"
          placeholder="Search by city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/[0.03] border-white/[0.08] focus:border-primary/50 focus:ring-primary/20"
        />
      </div>

      {/* Chapters Grid */}
      {filteredChapters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChapters.map((chapter) => (
            <Link key={chapter.id} href={`/chapters/${chapter.id}`}>
              <Card className="h-full border-white/[0.08] bg-card hover:border-primary/30 hover:bg-white/[0.02] transition-all duration-300 group cursor-pointer shadow-xl shadow-black/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-primary group-hover:text-primary/90 transition-colors">
                        {chapter.city}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{chapter.country}</p>
                    </div>
                    <span
                      className={`text-[10px] uppercase px-2 py-1 rounded-sm border ${
                        chapter.status === "active"
                          ? "bg-primary/10 border-primary/20 text-primary"
                          : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                      }`}
                    >
                      {chapter.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <span>{chapter.member_count} members</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="w-full rounded-lg border border-white/[0.08] bg-white/[0.02] p-12 text-center shadow-xl shadow-black/20">
          <div className="w-12 h-12 rounded-full border border-white/[0.1] bg-white/[0.05] mx-auto flex items-center justify-center mb-4 text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">No chapters found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {initialChapters.length === 0
              ? "The collective is just starting. Run the SQL migration and add some chapters to your Supabase database!"
              : `We couldn't find any chapters in "${searchQuery}". Try a different city.`}
          </p>
        </div>
      )}
    </div>
  );
}

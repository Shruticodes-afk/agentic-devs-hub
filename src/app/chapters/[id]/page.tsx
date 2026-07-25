import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JoinChapterButton } from "./join-button";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Chapter Details - Agentic Devs Collective Hub",
  description: "View chapter details, members, and events.",
};

export default async function ChapterDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Fetch chapter details
  const { data: chapter, error: chapterError } = await supabase
    .from("chapters")
    .select("*")
    .eq("id", params.id)
    .single();

  if (chapterError || !chapter) {
    notFound();
  }

  // Fetch members of this chapter
  const { data: members } = await supabase
    .from("members")
    .select("id, full_name, role")
    .eq("chapter_id", params.id);

  // Fetch events for this chapter
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("chapter_id", params.id)
    .order("event_date", { ascending: true });

  // Get current user to determine membership status
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isMember = false;
  if (user) {
    const { data: memberProfile } = await supabase
      .from("members")
      .select("chapter_id")
      .eq("id", user.id)
      .single();

    if (memberProfile && memberProfile.chapter_id === params.id) {
      isMember = true;
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden p-6 md:p-10">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/chapters"
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors w-fit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Chapters
          </Link>
        </div>

        {/* Chapter Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                {chapter.city}
              </h1>
              <span
                className={`text-[10px] uppercase px-2 py-1 rounded-sm border ${
                  chapter.status === "active"
                    ? "bg-primary/10 border-primary/20 text-primary"
                    : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                } font-semibold tracking-wider`}
              >
                {chapter.status}
              </span>
            </div>
            <p className="text-xl text-muted-foreground">{chapter.country}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                Members
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {members?.length || 0}
              </p>
            </div>
            {!user ? (
              <Button
                variant="outline"
                className="border-white/[0.08] text-muted-foreground"
                asChild
              >
                <Link href="/login">Sign in to join</Link>
              </Button>
            ) : !isMember ? (
              <JoinChapterButton chapterId={chapter.id} />
            ) : (
              <Button
                disabled
                variant="outline"
                className="border-primary/20 bg-primary/5 text-primary opacity-100 cursor-default"
              >
                ✓ Joined
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Events) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-semibold text-foreground border-b border-white/[0.08] pb-2">
              Upcoming Events
            </h2>
            {events && events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event) => (
                  <Card
                    key={event.id}
                    className="border-white/[0.08] bg-card hover:border-primary/20 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] uppercase px-2 py-1 rounded-sm border bg-white/[0.03] border-white/[0.1] text-muted-foreground mb-2 inline-block">
                            {event.event_type}
                          </span>
                          <CardTitle className="text-lg text-primary">
                            {event.title}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          <span>
                            {new Date(event.event_date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No upcoming events for this chapter.
              </p>
            )}
          </div>

          {/* Sidebar (Members) */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground border-b border-white/[0.08] pb-2">
              Members
            </h2>
            <div className="bg-card border border-white/[0.08] rounded-xl overflow-hidden">
              {members && members.length > 0 ? (
                <ul className="divide-y divide-white/[0.04]">
                  {members.map((m) => (
                    <li key={m.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                          {m.full_name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {m.full_name || "Anonymous Member"}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {m.role || "Member"}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-4 text-muted-foreground text-sm">
                  No members yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

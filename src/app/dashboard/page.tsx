import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // Fetch the member's profile from the members table
  const { data: member } = await supabase
    .from("members")
    .select("full_name, city, email, chapter_id, created_at")
    .eq("id", user.id)
    .single();

  const displayName =
    member?.full_name ||
    user.user_metadata?.full_name ||
    user.email ||
    "Member";
  const displayCity = member?.city || "Not set";
  const displayEmail = member?.email || user.email || "—";
  const memberSince = member?.created_at
    ? new Date(member.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-mono font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Welcome back, {displayName}
            </p>
          </div>
          <form action={logout}>
            <Button
              type="submit"
              variant="outline"
              className="border-white/[0.08] hover:bg-white/[0.04] text-sm"
            >
              Sign Out
            </Button>
          </form>
        </div>

        {/* Profile Card */}
        <Card className="border-white/[0.08] bg-card hover:border-primary/20 transition-colors duration-300">
          <CardHeader>
            <CardTitle className="text-base font-mono">Your Profile</CardTitle>
            <CardDescription className="text-sm">
              Your Agentic Devs Collective membership details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "FULL_NAME", value: displayName },
                { label: "EMAIL", value: displayEmail },
                { label: "CITY", value: displayCity },
                {
                  label: "CHAPTER",
                  value: member?.chapter_id
                    ? member.chapter_id
                    : "Not assigned yet",
                  muted: !member?.chapter_id,
                },
                { label: "MEMBER_SINCE", value: memberSince },
              ].map((field) => (
                <div key={field.label} className="space-y-1">
                  <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                    {field.label}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      "muted" in field && field.muted
                        ? "text-muted-foreground italic"
                        : "text-foreground"
                    }`}
                  >
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Chapter Members",
              value: "—",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              ),
            },
            {
              label: "Upcoming Events",
              value: "—",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              ),
            },
            {
              label: "AI Assists",
              value: "—",
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              ),
            },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="border-white/[0.08] bg-card hover:border-primary/20 transition-colors duration-300"
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xl font-mono font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

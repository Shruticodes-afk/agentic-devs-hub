import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Hydrate profile data from user_metadata (useful for OAuth or email confirmation flows)
      if (data.user?.user_metadata) {
        const { full_name, city, chapter_id } = data.user.user_metadata;
        if (full_name || city || chapter_id) {
          await supabase.from("members").update({
            full_name: full_name || undefined,
            city: city || null,
            chapter_id: chapter_id || null,
          }).eq("id", data.user.id);
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // If code is missing or exchange failed, redirect to an error page
  return NextResponse.redirect(`${origin}/login?error=Authentication+failed`);
}

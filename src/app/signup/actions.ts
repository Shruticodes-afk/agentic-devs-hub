"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  // Sign up with Supabase Auth — full_name stored in raw_user_meta_data
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message));
  }

  // Defense-in-depth: also insert into members table from the server action.
  // The PostgreSQL trigger on auth.users will handle this atomically,
  // but this serves as a fallback in case the trigger isn't set up yet.
  if (data.user) {
    const { error: memberError } = await supabase.from("members").upsert(
      {
        id: data.user.id,
        email,
        full_name: fullName,
        chapter_id: null,
      },
      { onConflict: "id" }
    );

    if (memberError) {
      console.error("Failed to create member row:", memberError.message);
      // Don't block signup — the trigger should handle this
    }
  }

  revalidatePath("/", "layout");
  redirect("/login?message=Check+your+email+to+confirm+your+account");
}

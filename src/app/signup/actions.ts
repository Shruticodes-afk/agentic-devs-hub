"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const city = formData.get("city") as string;

  let chapterId = null;
  if (city) {
    const { data: chapterData } = await supabase
      .from("chapters")
      .select("id")
      .eq("city", city)
      .single();
    if (chapterData) {
      chapterId = chapterData.id;
    }
  }

  // Sign up with Supabase Auth — full_name, city, chapter_id stored in raw_user_meta_data
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        city: city || null,
        chapter_id: chapterId,
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
    const { error: memberError } = await supabase
      .from("members")
      .update({
        full_name: fullName,
        city: city || null,
        chapter_id: chapterId,
      })
      .eq("id", data.user.id);

    if (memberError) {
      console.error("Failed to create member row:", memberError.message);
      // Don't block signup — the trigger should handle this
    }
  }

  revalidatePath("/", "layout");
  if (city) {
    redirect(`/welcome?name=${encodeURIComponent(fullName)}&city=${encodeURIComponent(city)}`);
  } else {
    redirect("/login?message=Check+your+email+to+confirm+your+account");
  }
}

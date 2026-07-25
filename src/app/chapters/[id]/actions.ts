"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function joinChapter(chapterId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to join a chapter." };
  }

  // Update the member's chapter_id
  const { error } = await supabase
    .from("members")
    .update({ chapter_id: chapterId })
    .eq("id", user.id);

  if (error) {
    console.error("Error joining chapter:", error);
    return { error: "Failed to join chapter. Please try again." };
  }

  // Revalidate the chapter details page and dashboard
  revalidatePath(`/chapters/${chapterId}`);
  revalidatePath("/dashboard");
  
  return { success: true };
}

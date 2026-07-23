"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function registerForEvent(eventId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to register." };
  }

  const { error } = await supabase.from("event_registrations").insert({
    event_id: eventId,
    member_id: user.id,
  });

  if (error) {
    console.error("Error registering for event:", error);
    // If it's a unique constraint violation, they are already registered
    if (error.code === "23505") {
      return { error: "You are already registered for this event." };
    }
    return { error: "Failed to register. Please try again." };
  }

  revalidatePath("/events");
  return { success: true };
}

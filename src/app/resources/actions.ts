"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type ResourceType = 'guide' | 'template' | 'deck' | 'link';

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  url: string;
  tags: string[];
  summary?: string;
  ai_tagged?: boolean;
  added_by: string;
  created_at: string;
}

export async function getResources(): Promise<Resource[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Failed to fetch resources:", error);
    return [];
  }

  return data as Resource[];
}

export async function addResource(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to add a resource." };
  }

  const title = formData.get("title")?.toString().trim();
  const url = formData.get("url")?.toString().trim();
  const type = formData.get("type")?.toString() as ResourceType;
  const tagsStr = formData.get("tags")?.toString().trim();

  if (!title || !url || !type) {
    return { error: "Title, URL, and Type are required." };
  }

  // Parse comma-separated tags and clean them
  const tags = tagsStr
    ? tagsStr.split(",").map(t => t.trim()).filter(t => t.length > 0)
    : [];

  const { error } = await supabase.from('resources').insert({
    title,
    url,
    type,
    tags,
    added_by: user.id
  });

  if (error) {
    console.error("Error inserting resource:", error);
    return { error: error.message || "Failed to add resource." };
  }

  revalidatePath('/resources');
  return { success: true };
}

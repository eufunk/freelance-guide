import "server-only";

import { requireUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

import type { Tables, TablesUpdate } from "./database.types";

export type Profile = Tables<"profiles">;
export type ProfileUpdate = Omit<TablesUpdate<"profiles">, "user_id" | "created_at" | "updated_at">;

/** The current user's profile. Created automatically on sign-up. */
export async function getProfile(returnPath: string): Promise<Profile> {
  const user = await requireUser(returnPath);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(changes: ProfileUpdate, returnPath: string): Promise<void> {
  const user = await requireUser(returnPath);
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update(changes).eq("user_id", user.id);
  if (error) throw error;
}

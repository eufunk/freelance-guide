import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

import { loginPathFor } from "./paths";

// Data Access Layer for authentication: the one place that decides who the
// current user is. Every page and Server Function that needs a user calls this;
// proxy.ts only redirects optimistically.

export type CurrentUser = { id: string; email: string | undefined };

/** The logged-in user, or null. Memoized per request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;
  return { id: claims.sub, email: claims.email };
});

/** The logged-in user; redirects to the login page if there is none. */
export async function requireUser(returnPath: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(loginPathFor(returnPath));
  return user;
}

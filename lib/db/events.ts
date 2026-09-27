import "server-only";

import { getCurrentUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import type { EventName, EventProperties } from "@/lib/tracking/events";

/**
 * Records a product metric event for the logged-in user. Does nothing without a
 * login (only logged-in users are tracked). Never throws: a failed event must not
 * break what the user is doing, so errors are only logged.
 */
export async function recordEvent<N extends EventName>(
  name: N,
  properties: EventProperties[N],
): Promise<void> {
  try {
    const user = await getCurrentUser();
    if (!user) return;
    const supabase = await createClient();
    const { error } = await supabase.from("events").insert({ user_id: user.id, name, properties });
    if (error) throw error;
  } catch (error) {
    console.error(`Could not record event "${name}"`, error);
  }
}

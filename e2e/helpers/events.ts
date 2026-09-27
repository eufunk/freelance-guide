import { execFileSync } from "node:child_process";

import { createClient } from "@supabase/supabase-js";

// Reads the events table with admin rights (users cannot read it themselves).
// The secret key of the local Supabase stack is read from `supabase status`
// instead of being stored in the repository.

let secretKey: string | undefined;

function localSecretKey(): string {
  if (secretKey) return secretKey;
  const [command, args] =
    process.platform === "win32"
      ? [
          "wsl.exe",
          ["-d", process.env.WSL_DISTRO ?? "Ubuntu", "--", "supabase", "status", "-o", "env"],
        ]
      : ["supabase", ["status", "-o", "env"]];
  // stderr only lists stopped optional services; the values are on stdout.
  const output = execFileSync(command, args, { stdio: ["ignore", "pipe", "ignore"] });
  const match = /^SECRET_KEY="?([^"\n]+)"?$/m.exec(output.toString());
  if (!match?.[1]) throw new Error("No SECRET_KEY in `supabase status`. Is the database running?");
  secretKey = match[1];
  return secretKey;
}

export type RecordedEvent = { name: string; properties: Record<string, unknown> };

/** All events of the user with this email, oldest first. */
export async function eventsOf(email: string): Promise<RecordedEvent[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
  if (!/^http:\/\/(127\.0\.0\.1|localhost)[:/]/.test(url)) {
    throw new Error("eventsOf() only runs against the local database");
  }
  const admin = createClient(url, localSecretKey(), { auth: { persistSession: false } });

  // The local database keeps users of earlier test runs, so page through all of them.
  let userId: string | undefined;
  for (let page = 1; !userId; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    userId = data.users.find((candidate) => candidate.email === email)?.id;
    if (data.users.length < 1000) break;
  }
  if (!userId) throw new Error(`No user with email ${email}`);

  const { data, error } = await admin
    .from("events")
    .select("name, properties")
    .eq("user_id", userId)
    .order("id");
  if (error) throw error;
  return data as RecordedEvent[];
}

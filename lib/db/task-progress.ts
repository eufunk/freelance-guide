import "server-only";

import { requireUser } from "@/lib/auth/dal";
import { getTask } from "@/lib/content";
import {
  timestampsFor,
  type TaskProgressSource,
  type TaskStatus,
} from "@/lib/progress/task-progress";
import { createClient } from "@/lib/supabase/server";

import type { Tables } from "./database.types";

export type TaskProgressRow = Tables<"task_progress">;

/** The current user's progress, keyed by task ID. Tasks without a row are "todo". */
export async function getTaskProgress(returnPath: string): Promise<Map<string, TaskProgressRow>> {
  const user = await requireUser(returnPath);
  const supabase = await createClient();
  const { data, error } = await supabase.from("task_progress").select("*").eq("user_id", user.id);
  if (error) throw error;
  return new Map(data.map((row) => [row.task_id, row]));
}

/** Saves the status of one task for the current user. */
export async function setTaskStatus(
  taskId: string,
  status: TaskStatus,
  returnPath: string,
  source: TaskProgressSource = "user",
): Promise<void> {
  // Task IDs come from the client; only accept tasks that exist in the content.
  if (!getTask(taskId)) throw new Error(`Unknown task "${taskId}"`);

  const user = await requireUser(returnPath);
  const supabase = await createClient();

  const { data: previous, error: readError } = await supabase
    .from("task_progress")
    .select("started_at, completed_at")
    .eq("user_id", user.id)
    .eq("task_id", taskId)
    .maybeSingle();
  if (readError) throw readError;

  const timestamps = timestampsFor(
    status,
    previous ? { startedAt: previous.started_at, completedAt: previous.completed_at } : undefined,
    new Date().toISOString(),
  );

  const { error } = await supabase.from("task_progress").upsert({
    user_id: user.id,
    task_id: taskId,
    status,
    source,
    started_at: timestamps.startedAt,
    completed_at: timestamps.completedAt,
  });
  if (error) throw error;
}

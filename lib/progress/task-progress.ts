// Pure rules for task progress timestamps. The database enforces that a
// completed task has completed_at (see the migration).

export const taskStatuses = ["todo", "in_progress", "completed"] as const;
export type TaskStatus = (typeof taskStatuses)[number];

export type TaskProgressSource = "user" | "onboarding";

export type TaskProgressTimestamps = {
  startedAt: string | null;
  completedAt: string | null;
};

/**
 * Timestamps after changing a task to `status`:
 * - started_at is set the first time a task is started or completed, and kept afterwards
 * - completed_at is set when completed and cleared when reopened
 */
export function timestampsFor(
  status: TaskStatus,
  previous: TaskProgressTimestamps | undefined,
  now: string,
): TaskProgressTimestamps {
  const startedAt = previous?.startedAt ?? (status === "todo" ? null : now);

  if (status === "completed") {
    return { startedAt, completedAt: previous?.completedAt ?? now };
  }
  return { startedAt, completedAt: null };
}

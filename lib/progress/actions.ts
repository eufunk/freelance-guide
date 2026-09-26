"use server";

import { refresh } from "next/cache";
import { z } from "zod";

import { getTask } from "@/lib/content";
import { setTaskStatus } from "@/lib/db/task-progress";

import { taskStatuses } from "./task-progress";

const schema = z.object({
  taskId: z.string().refine((id) => getTask(id) !== undefined, "Unknown task"),
  status: z.enum(taskStatuses),
});

/** Starts, completes or reopens a task (status "in_progress", "completed" or "todo"). */
export async function changeTaskStatus(formData: FormData): Promise<void> {
  const { taskId, status } = schema.parse({
    taskId: formData.get("taskId"),
    status: formData.get("status"),
  });
  const task = getTask(taskId)!;

  // Any change by the user makes the task the user's own, also if onboarding marked it.
  await setTaskStatus(taskId, status, `/roadmap/${task.stageId}`, "user");

  // Re-render the current page with the new progress in the same response.
  refresh();
}

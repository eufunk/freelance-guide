"use server";

import { refresh } from "next/cache";
import { z } from "zod";

import { getStage, getTask } from "@/lib/content";
import { recordEvent } from "@/lib/db/events";
import { getProgressByTask, setTaskStatus } from "@/lib/db/task-progress";

import { completesStage, statusOf } from "./roadmap-progress";
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
  const returnPath = `/roadmap/${task.stageId}`;
  const before = await getProgressByTask(returnPath);

  // Any change by the user makes the task the user's own, also if onboarding marked it.
  await setTaskStatus(taskId, status, returnPath, "user");

  // Record real changes only (e.g. not a double click on "Erledigt").
  if (status !== statusOf(taskId, before)) {
    const properties = { taskId, stageId: task.stageId };
    if (status === "in_progress") await recordEvent("task_started", properties);
    if (status === "completed") {
      await recordEvent("task_completed", properties);
      if (completesStage(getStage(task.stageId)!, taskId, before))
        await recordEvent("stage_completed", { stageId: task.stageId });
    }
  }

  // Re-render the current page with the new progress in the same response.
  refresh();
}

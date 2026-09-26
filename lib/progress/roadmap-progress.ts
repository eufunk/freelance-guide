import type { TaskStatus } from "./task-progress";

// Derived roadmap values (Phase 6 in guide/ToDo.docx). Pure functions: nothing
// here is stored; everything follows from the content and the task progress.

type TaskRef = { id: string };
type StageRef = { id: string; tasks: TaskRef[] };

export type TaskProgress = {
  status: TaskStatus;
  startedAt: string | null;
  completedAt: string | null;
};

/** Progress by task ID. Tasks without an entry are "todo". */
export type ProgressByTask = ReadonlyMap<string, TaskProgress>;

export function statusOf(taskId: string, progress: ProgressByTask): TaskStatus {
  return progress.get(taskId)?.status ?? "todo";
}

export function completedTaskIds(progress: ProgressByTask): Set<string> {
  return new Set(
    [...progress].filter(([, row]) => row.status === "completed").map(([taskId]) => taskId),
  );
}

export type StageStatus = "todo" | "in_progress" | "completed";

export type StageProgress = { completed: number; total: number; status: StageStatus };

/** A stage is completed when all its tasks are completed. */
export function stageProgress(stage: StageRef, progress: ProgressByTask): StageProgress {
  const statuses = stage.tasks.map((task) => statusOf(task.id, progress));
  const completed = statuses.filter((status) => status === "completed").length;
  const total = stage.tasks.length;
  const status: StageStatus =
    completed === total
      ? "completed"
      : statuses.some((status) => status !== "todo")
        ? "in_progress"
        : "todo";
  return { completed, total, status };
}

/** Completed tasks of all tasks, with a rounded percentage. */
export function roadmapProgress(roadmap: StageRef[], progress: ProgressByTask) {
  const total = roadmap.reduce((sum, stage) => sum + stage.tasks.length, 0);
  const completed = roadmap.reduce(
    (sum, stage) => sum + stageProgress(stage, progress).completed,
    0,
  );
  return { completed, total, percent: total === 0 ? 0 : Math.round((completed / total) * 100) };
}

/** The first stage in order with an open task, or undefined if everything is done. */
export function currentStage<S extends StageRef>(
  roadmap: S[],
  completed: ReadonlySet<string>,
): S | undefined {
  return roadmap.find((stage) => stage.tasks.some((task) => !completed.has(task.id)));
}

/**
 * What to do next: the task in progress that was started most recently;
 * otherwise the first todo task of the current stage.
 */
export function nextTask<T extends TaskRef, S extends { id: string; tasks: T[] }>(
  roadmap: S[],
  progress: ProgressByTask,
): T | undefined {
  const tasks = roadmap.flatMap((stage) => stage.tasks);

  const inProgress = tasks
    .filter((task) => statusOf(task.id, progress) === "in_progress")
    .sort((a, b) =>
      (progress.get(b.id)?.startedAt ?? "").localeCompare(progress.get(a.id)?.startedAt ?? ""),
    );
  if (inProgress[0]) return inProgress[0];

  const stage = currentStage(roadmap, completedTaskIds(progress));
  return stage?.tasks.find((task) => statusOf(task.id, progress) === "todo");
}

/** The next todo task after `current` in roadmap order. */
export function nextRecommendedTask<T extends TaskRef>(
  roadmap: { tasks: T[] }[],
  progress: ProgressByTask,
  current: TaskRef | undefined,
): T | undefined {
  if (!current) return undefined;
  const tasks = roadmap.flatMap((stage) => stage.tasks);
  const index = tasks.findIndex((task) => task.id === current.id);
  return tasks.slice(index + 1).find((task) => statusOf(task.id, progress) === "todo");
}

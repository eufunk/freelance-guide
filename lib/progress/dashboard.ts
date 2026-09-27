import {
  completedTaskIds,
  currentStage,
  nextRecommendedTask,
  nextTask,
  recentlyCompleted,
  roadmapProgress,
  statusOf,
  type ProgressByTask,
} from "./roadmap-progress";
import type { TaskStatus } from "./task-progress";

// Everything the dashboard shows, derived from the roadmap and the progress
// (Phase 7). Answers one question: "What should I do next?"

type TaskRef = { id: string; stageId: string };
type StageRef<T extends TaskRef> = {
  id: string;
  order: number;
  tasks: T[];
  relatedToolIds: string[];
  relatedTemplateIds: string[];
};

export type Dashboard<T extends TaskRef, S extends StageRef<T>> =
  | {
      state: "active";
      /** The primary call to action. */
      task: T;
      taskStatus: TaskStatus;
      /** The stage the task belongs to (it can differ from `currentStage` if started out of order). */
      taskStage: S;
      currentStage: S | undefined;
      /** What comes after the current task. */
      next: { task: T; stage: S } | undefined;
      progress: { completed: number; total: number; percent: number };
      recentlyCompleted: { task: T; completedAt: string }[];
      /** Tools and templates of the current stage, for quick access. */
      toolIds: string[];
      templateIds: string[];
    }
  | { state: "all-done"; progress: { completed: number; total: number; percent: number } };

export function buildDashboard<T extends TaskRef, S extends StageRef<T>>(
  roadmap: S[],
  progress: ProgressByTask,
): Dashboard<T, S> {
  const overall = roadmapProgress(roadmap, progress);
  const task = nextTask<T, S>(roadmap, progress);
  if (!task) return { state: "all-done", progress: overall };

  const stageOf = (t: T) => roadmap.find((stage) => stage.id === t.stageId)!;
  const current = currentStage(roadmap, completedTaskIds(progress));
  const nextOne = nextRecommendedTask<T>(roadmap, progress, task);
  const focus = current ?? stageOf(task);

  return {
    state: "active",
    task,
    taskStatus: statusOf(task.id, progress),
    taskStage: stageOf(task),
    currentStage: current,
    next: nextOne ? { task: nextOne, stage: stageOf(nextOne) } : undefined,
    progress: overall,
    recentlyCompleted: recentlyCompleted(roadmap, progress),
    toolIds: focus.relatedToolIds,
    templateIds: focus.relatedTemplateIds,
  };
}

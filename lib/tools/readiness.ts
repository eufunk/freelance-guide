import { statusOf, type ProgressByTask } from "@/lib/progress/roadmap-progress";

// Readiness checklist (Phase 8): derived from the roadmap progress, no own state.

type ItemRef = { id: string; stageIds: string[]; taskIds: string[] };
type StageRef = { id: string; tasks: { id: string }[] };

export type ReadinessResult<I> = {
  items: { item: I; done: boolean }[];
  done: number;
  total: number;
  percent: number;
};

/** An item is done when all tasks of its stages and all its own tasks are completed. */
export function readiness<I extends ItemRef>(
  items: I[],
  roadmap: StageRef[],
  progress: ProgressByTask,
): ReadinessResult<I> {
  const tasksOfStage = new Map(roadmap.map((stage) => [stage.id, stage.tasks]));
  const results = items.map((item) => {
    const taskIds = [
      ...item.stageIds.flatMap((stageId) => (tasksOfStage.get(stageId) ?? []).map((t) => t.id)),
      ...item.taskIds,
    ];
    return { item, done: taskIds.every((id) => statusOf(id, progress) === "completed") };
  });
  const done = results.filter((result) => result.done).length;
  return {
    items: results,
    done,
    total: items.length,
    percent: items.length === 0 ? 0 : Math.round((done / items.length) * 100),
  };
}

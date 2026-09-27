import { describe, expect, it } from "vitest";

import { buildDashboard } from "./dashboard";
import type { ProgressByTask, TaskProgress } from "./roadmap-progress";

function stage(id: string, order: number, taskIds: string[], toolIds: string[] = []) {
  return {
    id,
    order,
    tasks: taskIds.map((taskId) => ({ id: taskId, stageId: id })),
    relatedToolIds: toolIds,
    relatedTemplateIds: [],
  };
}

const roadmap = [
  stage("skills", 1, ["s1", "s2"]),
  stage("pricing", 2, ["p1"], ["hourly-rate"]),
  stage("clients", 3, ["c1"]),
];

const done = (at: string, source: TaskProgress["source"] = "user"): TaskProgress => ({
  status: "completed",
  startedAt: at,
  completedAt: at,
  source,
});

function progress(entries: Record<string, TaskProgress>): ProgressByTask {
  return new Map(Object.entries(entries));
}

describe("buildDashboard", () => {
  it("points a new user to the first task", () => {
    const dashboard = buildDashboard(roadmap, progress({}));

    expect(dashboard).toMatchObject({
      state: "active",
      task: { id: "s1" },
      taskStatus: "todo",
      taskStage: { id: "skills" },
      currentStage: { id: "skills" },
      next: { task: { id: "s2" }, stage: { id: "skills" } },
      progress: { completed: 0, total: 4, percent: 0 },
      recentlyCompleted: [],
      toolIds: [],
    });
  });

  it("offers the tools of the current stage", () => {
    const dashboard = buildDashboard(
      roadmap,
      progress({ s1: done("2026-09-01T10:00:00Z"), s2: done("2026-09-02T10:00:00Z") }),
    );

    expect(dashboard).toMatchObject({
      state: "active",
      task: { id: "p1" },
      currentStage: { id: "pricing" },
      next: { task: { id: "c1" }, stage: { id: "clients" } },
      toolIds: ["hourly-rate"],
    });
    expect(
      dashboard.state === "active" && dashboard.recentlyCompleted.map((e) => e.task.id),
    ).toEqual(["s2", "s1"]);
  });

  it("continues with a task in progress, even from a later stage", () => {
    const dashboard = buildDashboard(
      roadmap,
      progress({
        c1: {
          status: "in_progress",
          startedAt: "2026-09-03T10:00:00Z",
          completedAt: null,
          source: "user",
        },
      }),
    );

    expect(dashboard).toMatchObject({
      task: { id: "c1" },
      taskStatus: "in_progress",
      taskStage: { id: "clients" },
      currentStage: { id: "skills" },
      next: undefined,
    });
  });

  it("congratulates when everything is done", () => {
    const at = "2026-09-01T10:00:00Z";
    const dashboard = buildDashboard(
      roadmap,
      progress({ s1: done(at), s2: done(at, "onboarding"), p1: done(at), c1: done(at) }),
    );

    expect(dashboard).toEqual({
      state: "all-done",
      progress: { completed: 4, total: 4, percent: 100 },
    });
  });
});

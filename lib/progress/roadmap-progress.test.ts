import { describe, expect, it } from "vitest";

import {
  completedTaskIds,
  currentStage,
  nextRecommendedTask,
  nextTask,
  roadmapProgress,
  stageProgress,
  statusOf,
  type ProgressByTask,
  type TaskProgress,
} from "./roadmap-progress";

const roadmap = [
  { id: "skills", tasks: [{ id: "s1" }, { id: "s2" }] },
  { id: "service", tasks: [{ id: "v1" }, { id: "v2" }] },
  { id: "clients", tasks: [{ id: "c1" }] },
];

const done: TaskProgress = {
  status: "completed",
  startedAt: "2026-09-01",
  completedAt: "2026-09-02",
};
const started = (at: string): TaskProgress => ({
  status: "in_progress",
  startedAt: at,
  completedAt: null,
});

function progress(entries: Record<string, TaskProgress>): ProgressByTask {
  return new Map(Object.entries(entries));
}

describe("statusOf", () => {
  it("treats tasks without progress as todo", () => {
    expect(statusOf("s1", progress({}))).toBe("todo");
    expect(statusOf("s1", progress({ s1: done }))).toBe("completed");
  });
});

describe("completedTaskIds", () => {
  it("contains only completed tasks", () => {
    expect(completedTaskIds(progress({ s1: done, s2: started("2026-09-03") }))).toEqual(
      new Set(["s1"]),
    );
  });
});

describe("stageProgress", () => {
  it("is todo when nothing is started", () => {
    expect(stageProgress(roadmap[0]!, progress({}))).toEqual({
      completed: 0,
      total: 2,
      status: "todo",
    });
  });

  it("is in progress when a task is started or some are done", () => {
    expect(stageProgress(roadmap[0]!, progress({ s1: started("2026-09-03") })).status).toBe(
      "in_progress",
    );
    expect(stageProgress(roadmap[0]!, progress({ s1: done }))).toEqual({
      completed: 1,
      total: 2,
      status: "in_progress",
    });
  });

  it("is completed when all tasks are completed", () => {
    expect(stageProgress(roadmap[0]!, progress({ s1: done, s2: done })).status).toBe("completed");
  });
});

describe("roadmapProgress", () => {
  it("counts completed tasks of all tasks", () => {
    expect(roadmapProgress(roadmap, progress({ s1: done, v2: done }))).toEqual({
      completed: 2,
      total: 5,
      percent: 40,
    });
  });

  it("rounds the percentage", () => {
    expect(roadmapProgress(roadmap, progress({ s1: done })).percent).toBe(20);
    const three = [{ id: "a", tasks: [{ id: "1" }, { id: "2" }, { id: "3" }] }];
    expect(roadmapProgress(three, progress({ "1": done })).percent).toBe(33);
  });
});

describe("currentStage", () => {
  it("is the first stage with an open task", () => {
    expect(currentStage(roadmap, new Set(["s1", "s2", "v1"]))?.id).toBe("service");
    expect(currentStage(roadmap, new Set())?.id).toBe("skills");
  });

  it("skips stages completed out of order", () => {
    expect(currentStage(roadmap, new Set(["v1", "v2"]))?.id).toBe("skills");
  });

  it("is undefined when everything is done", () => {
    expect(currentStage(roadmap, new Set(["s1", "s2", "v1", "v2", "c1"]))).toBe(undefined);
  });
});

describe("nextTask", () => {
  it("prefers the task in progress that was started most recently", () => {
    const p = progress({ v1: started("2026-09-05"), c1: started("2026-09-10") });

    expect(nextTask(roadmap, p)?.id).toBe("c1");
  });

  it("otherwise takes the first todo task of the current stage", () => {
    expect(nextTask(roadmap, progress({ s1: done }))?.id).toBe("s2");
    expect(nextTask(roadmap, progress({}))?.id).toBe("s1");
  });

  it("is undefined when everything is done", () => {
    const all = progress({ s1: done, s2: done, v1: done, v2: done, c1: done });

    expect(nextTask(roadmap, all)).toBe(undefined);
  });
});

describe("nextRecommendedTask", () => {
  it("is the next todo task after the current one, across stages", () => {
    const p = progress({ s1: done, v1: done });

    expect(nextRecommendedTask(roadmap, p, { id: "s2" })?.id).toBe("v2");
  });

  it("skips tasks that are in progress or done", () => {
    const p = progress({ s2: started("2026-09-03"), v1: done });

    expect(nextRecommendedTask(roadmap, p, { id: "s1" })?.id).toBe("v2");
  });

  it("is undefined without a current task or at the end", () => {
    expect(nextRecommendedTask(roadmap, progress({}), undefined)).toBe(undefined);
    expect(nextRecommendedTask(roadmap, progress({}), { id: "c1" })).toBe(undefined);
  });
});

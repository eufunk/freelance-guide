import { describe, expect, it } from "vitest";

import { timestampsFor } from "./task-progress";

const earlier = "2026-09-01T10:00:00.000Z";
const now = "2026-09-24T12:00:00.000Z";

describe("timestampsFor", () => {
  it("sets started_at when a task is started", () => {
    expect(timestampsFor("in_progress", undefined, now)).toEqual({
      startedAt: now,
      completedAt: null,
    });
  });

  it("sets both timestamps when a task is completed without starting it first", () => {
    expect(timestampsFor("completed", undefined, now)).toEqual({
      startedAt: now,
      completedAt: now,
    });
  });

  it("keeps the original start when completing", () => {
    expect(timestampsFor("completed", { startedAt: earlier, completedAt: null }, now)).toEqual({
      startedAt: earlier,
      completedAt: now,
    });
  });

  it("keeps completed_at when a completed task is saved again", () => {
    expect(timestampsFor("completed", { startedAt: earlier, completedAt: earlier }, now)).toEqual({
      startedAt: earlier,
      completedAt: earlier,
    });
  });

  it("clears completed_at when a task is reopened", () => {
    expect(timestampsFor("todo", { startedAt: earlier, completedAt: earlier }, now)).toEqual({
      startedAt: earlier,
      completedAt: null,
    });
  });

  it("leaves a new todo task without timestamps", () => {
    expect(timestampsFor("todo", undefined, now)).toEqual({ startedAt: null, completedAt: null });
  });
});

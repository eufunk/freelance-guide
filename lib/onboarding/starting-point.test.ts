import { describe, expect, it } from "vitest";

import type { OnboardingRules } from "@/lib/content/schema";

import { entryStage, planOnboardingProgress, proposeDoneStages } from "./starting-point";

const roadmap = [
  { id: "skills", tasks: [{ id: "s1" }, { id: "s2" }] },
  { id: "service", tasks: [{ id: "v1" }] },
  { id: "portfolio", tasks: [{ id: "p1" }, { id: "p2" }] },
  { id: "basics", tasks: [{ id: "b1" }] },
  { id: "clients", tasks: [{ id: "c1" }] },
];

const rules: OnboardingRules = {
  proposedDoneByGoal: {
    "become-freelancer": [],
    "first-client": ["service", "skills"],
    "more-clients": ["skills", "service", "portfolio", "basics"],
  },
  proposedDoneByFlag: { hasPortfolio: ["portfolio"], hasFreelanceExperience: ["basics"] },
};

describe("proposeDoneStages", () => {
  it("proposes nothing for a complete beginner", () => {
    expect(
      proposeDoneStages(
        { goal: "become-freelancer", hasPortfolio: false, hasFreelanceExperience: false },
        rules,
        roadmap,
      ),
    ).toEqual([]);
  });

  it("uses the goal and returns stages in roadmap order", () => {
    expect(
      proposeDoneStages(
        { goal: "first-client", hasPortfolio: false, hasFreelanceExperience: false },
        rules,
        roadmap,
      ),
    ).toEqual(["skills", "service"]);
  });

  it("adds stages for yes answers without duplicates", () => {
    expect(
      proposeDoneStages(
        { goal: "first-client", hasPortfolio: true, hasFreelanceExperience: true },
        rules,
        roadmap,
      ),
    ).toEqual(["skills", "service", "portfolio", "basics"]);

    expect(
      proposeDoneStages(
        { goal: "more-clients", hasPortfolio: true, hasFreelanceExperience: true },
        rules,
        roadmap,
      ),
    ).toEqual(["skills", "service", "portfolio", "basics"]);
  });
});

describe("planOnboardingProgress", () => {
  it("completes all tasks of confirmed stages", () => {
    expect(planOnboardingProgress(["skills", "portfolio"], roadmap, [])).toEqual({
      complete: ["s1", "s2", "p1", "p2"],
      reset: [],
    });
  });

  it("never touches progress the user saved themselves", () => {
    const existing = [
      { taskId: "s1", status: "in_progress", source: "user" },
      { taskId: "c1", status: "completed", source: "user" },
    ];

    expect(planOnboardingProgress(["skills"], roadmap, existing)).toEqual({
      complete: ["s2"],
      reset: [],
    });
    expect(planOnboardingProgress([], roadmap, existing)).toEqual({ complete: [], reset: [] });
  });

  it("resets onboarding marks that are no longer confirmed when onboarding is re-run", () => {
    const existing = [
      { taskId: "s1", status: "completed", source: "onboarding" },
      { taskId: "s2", status: "completed", source: "onboarding" },
      { taskId: "v1", status: "completed", source: "onboarding" },
    ];

    expect(planOnboardingProgress(["service"], roadmap, existing)).toEqual({
      complete: [],
      reset: ["s1", "s2"],
    });
  });
});

describe("entryStage", () => {
  it("is the first stage with an open task", () => {
    expect(entryStage(roadmap, new Set(["s1", "s2", "v1", "p1"]))?.id).toBe("portfolio");
  });

  it("starts at the beginning when nothing is done", () => {
    expect(entryStage(roadmap, new Set())?.id).toBe("skills");
  });

  it("is undefined when everything is done", () => {
    expect(entryStage(roadmap, new Set(["s1", "s2", "v1", "p1", "p2", "b1", "c1"]))).toBe(
      undefined,
    );
  });
});

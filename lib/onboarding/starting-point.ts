import type { OnboardingRules } from "@/lib/content/schema";

import type { OnboardingAnswers } from "./schema";

// Pure rules for the personal starting point (see Phase 5 in guide/ToDo.docx).

type StageRef = { id: string; tasks: { id: string }[] };

/**
 * Stages proposed as "already done", in roadmap order: those for the goal plus
 * those for each yes/no answer that is "yes".
 */
export function proposeDoneStages(
  answers: Pick<OnboardingAnswers, "goal" | "hasPortfolio" | "hasFreelanceExperience">,
  rules: OnboardingRules,
  roadmap: StageRef[],
): string[] {
  const proposed = new Set(rules.proposedDoneByGoal[answers.goal]);
  if (answers.hasPortfolio) {
    for (const id of rules.proposedDoneByFlag.hasPortfolio) proposed.add(id);
  }
  if (answers.hasFreelanceExperience) {
    for (const id of rules.proposedDoneByFlag.hasFreelanceExperience) proposed.add(id);
  }
  return roadmap.filter((stage) => proposed.has(stage.id)).map((stage) => stage.id);
}

export type ExistingProgress = { taskId: string; status: string; source: string };

export type OnboardingProgressPlan = {
  /** Tasks to save as completed with source "onboarding". */
  complete: string[];
  /** Tasks marked by an earlier onboarding that are no longer confirmed: reset to todo. */
  reset: string[];
};

/**
 * What to change in the task progress after onboarding. Progress the user
 * saved themselves (source "user") is never changed.
 */
export function planOnboardingProgress(
  confirmedStageIds: string[],
  roadmap: StageRef[],
  existing: ExistingProgress[],
): OnboardingProgressPlan {
  const byTask = new Map(existing.map((row) => [row.taskId, row]));
  const confirmed = new Set(confirmedStageIds);
  const complete: string[] = [];
  const reset: string[] = [];

  for (const stage of roadmap) {
    for (const task of stage.tasks) {
      const row = byTask.get(task.id);
      if (row?.source === "user") continue;
      if (confirmed.has(stage.id)) {
        if (row?.status !== "completed") complete.push(task.id);
      } else if (row?.source === "onboarding") {
        reset.push(task.id);
      }
    }
  }
  return { complete, reset };
}

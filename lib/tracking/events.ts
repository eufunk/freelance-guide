// Product metric events (Phase 11). Stored in the events table, evaluated with
// SQL (supabase/analysis/). Keep properties minimal: IDs only, never user input
// such as calculator values or template text.

export const eventNames = [
  "onboarding_completed",
  "task_started",
  "task_completed",
  "stage_completed",
  "calculator_used",
  "template_copied",
] as const;

export type EventName = (typeof eventNames)[number];

export const trackedCalculators = ["hourly-rate", "project-price"] as const;
export type TrackedCalculator = (typeof trackedCalculators)[number];

/** Properties stored with each event. */
export type EventProperties = {
  /** repeat: the user ran the onboarding again from the profile. */
  onboarding_completed: { repeat: boolean };
  task_started: { taskId: string; stageId: string };
  task_completed: { taskId: string; stageId: string };
  stage_completed: { stageId: string };
  calculator_used: { calculator: TrackedCalculator };
  template_copied: { templateId: string };
};

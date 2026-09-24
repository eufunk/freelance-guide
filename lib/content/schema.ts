import { z } from "zod";

// Content schemas. Content (the same for all users) lives in content/ and is
// validated against these schemas at build time. User state (progress etc.)
// lives in the database and never in these models.
//
// IDs are stored in the database (e.g. task_progress.task_id). Never rename or
// reuse an ID once it has been deployed; add a new one instead.

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "IDs must be kebab-case (a-z, 0-9, -)");
const text = z.string().trim().min(1);

export const resourceTypes = ["article", "video", "tool", "link"] as const;

export const resourceSchema = z.strictObject({
  id,
  title: text,
  type: z.enum(resourceTypes),
  url: z.url({ protocol: /^https$/ }),
  description: text,
});

export const taskSchema = z.strictObject({
  id,
  title: text,
  description: text,
  estimatedMinutes: z.number().int().positive(),
  resources: z.array(resourceSchema).default([]),
});

export const toolIds = ["hourly-rate", "project-price", "readiness-checklist"] as const;
export type ToolId = (typeof toolIds)[number];

export const stageSchema = z.strictObject({
  id,
  title: text,
  shortExplanation: text,
  whyItMatters: text,
  tasks: z.array(taskSchema).min(1),
  resources: z.array(resourceSchema).default([]),
  relatedToolIds: z.array(z.enum(toolIds)).default([]),
  relatedTemplateIds: z.array(id).default([]),
});

export const roadmapSchema = z.array(stageSchema).min(1);

export const toolSchema = z.strictObject({
  id: z.enum(toolIds),
  title: text,
  description: text,
  href: z.string().startsWith("/"),
});

export const templateKinds = ["example", "template", "legal-sample"] as const;

/** Placeholders a template body may use, e.g. {{name}}. Filled from the profile. */
export const templatePlaceholders = [
  "name",
  "mainSkill",
  "additionalSkills",
  "yearsOfExperience",
  "hourlyRate",
] as const;

export const templateSchema = z
  .strictObject({
    id,
    title: text,
    category: text,
    kind: z.enum(templateKinds),
    body: text,
    disclaimer: text.optional(),
  })
  .refine((template) => template.kind !== "legal-sample" || template.disclaimer, {
    message: "Legal samples need a disclaimer",
    path: ["disclaimer"],
  });

export const legalArticleSchema = z.strictObject({
  id,
  title: text,
  summary: text,
  /** Markdown */
  body: text,
  sources: z.array(z.strictObject({ title: text, url: z.url() })).min(1),
  /** ISO date (YYYY-MM-DD) of the last check against the sources. */
  lastVerified: z.iso.date(),
});

export const goals = ["become-freelancer", "first-client", "more-clients"] as const;
export type Goal = (typeof goals)[number];

/** Yes/no onboarding answers that can mark stages as already done. */
export const onboardingFlags = ["hasPortfolio", "hasFreelanceExperience"] as const;
export type OnboardingFlag = (typeof onboardingFlags)[number];

export const onboardingRulesSchema = z.strictObject({
  /** Stages proposed as "already done" for each goal. */
  proposedDoneByGoal: z.record(z.enum(goals), z.array(id)),
  /** Stages proposed as "already done" when a flag is answered with yes. */
  proposedDoneByFlag: z.record(z.enum(onboardingFlags), z.array(id)),
});

// Input types: what authors write in content/ (defaults may be omitted).
export type StageInput = z.input<typeof stageSchema>;
export type ToolInput = z.input<typeof toolSchema>;
export type TemplateInput = z.input<typeof templateSchema>;
export type LegalArticleInput = z.input<typeof legalArticleSchema>;
export type OnboardingRulesInput = z.input<typeof onboardingRulesSchema>;

// Parsed types.
export type Resource = z.output<typeof resourceSchema>;
export type Tool = z.output<typeof toolSchema>;
export type Template = z.output<typeof templateSchema>;
export type LegalArticle = z.output<typeof legalArticleSchema>;
export type OnboardingRules = z.output<typeof onboardingRulesSchema>;
type ParsedStage = z.output<typeof stageSchema>;
type ParsedTask = z.output<typeof taskSchema>;

/** A task as the app uses it: with its stage and position. */
export type Task = ParsedTask & { stageId: string; order: number };

/** A stage as the app uses it: with its position and tasks in order. */
export type Stage = Omit<ParsedStage, "tasks"> & { order: number; tasks: Task[] };

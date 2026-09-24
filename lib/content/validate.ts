import {
  goals,
  legalArticleSchema,
  onboardingFlags,
  onboardingRulesSchema,
  roadmapSchema,
  templatePlaceholders,
  templateSchema,
  toolSchema,
  type LegalArticle,
  type OnboardingRules,
  type Stage,
  type Template,
  type Tool,
} from "./schema";
import { z } from "zod";

export type RawContent = {
  roadmap: unknown;
  tools: unknown;
  templates: unknown;
  legalArticles: unknown;
  onboardingRules: unknown;
};

export type Content = {
  roadmap: Stage[];
  tools: Tool[];
  templates: Template[];
  legalArticles: LegalArticle[];
  onboardingRules: OnboardingRules;
};

export class ContentError extends Error {
  constructor(readonly problems: string[]) {
    super(`Invalid content:\n${problems.map((p) => `  - ${p}`).join("\n")}`);
    this.name = "ContentError";
  }
}

const PLACEHOLDER = /\{\{\s*([^}]*?)\s*\}\}/g;

/** Placeholder names used in a template body, e.g. "{{name}}" -> "name". */
export function extractPlaceholders(body: string): string[] {
  return [...new Set([...body.matchAll(PLACEHOLDER)].map((match) => match[1] ?? ""))];
}

function duplicates(ids: string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) dupes.add(id);
    seen.add(id);
  }
  return [...dupes];
}

function schemaProblems(label: string, error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length > 0 ? `.${issue.path.join(".")}` : "";
    return `${label}${path}: ${issue.message}`;
  });
}

/**
 * Parses and validates all content, including references between files.
 * Throws a ContentError listing every problem, so one build shows all of them.
 */
export function loadContent(raw: RawContent, today: string): Content {
  const problems: string[] = [];

  const roadmap = roadmapSchema.safeParse(raw.roadmap);
  const tools = z.array(toolSchema).safeParse(raw.tools);
  const templates = z.array(templateSchema).safeParse(raw.templates);
  const legalArticles = z.array(legalArticleSchema).safeParse(raw.legalArticles);
  const onboardingRules = onboardingRulesSchema.safeParse(raw.onboardingRules);

  if (!roadmap.success) problems.push(...schemaProblems("roadmap", roadmap.error));
  if (!tools.success) problems.push(...schemaProblems("tools", tools.error));
  if (!templates.success) problems.push(...schemaProblems("templates", templates.error));
  if (!legalArticles.success)
    problems.push(...schemaProblems("legalArticles", legalArticles.error));
  if (!onboardingRules.success)
    problems.push(...schemaProblems("onboardingRules", onboardingRules.error));

  if (
    !roadmap.success ||
    !tools.success ||
    !templates.success ||
    !legalArticles.success ||
    !onboardingRules.success
  ) {
    throw new ContentError(problems);
  }

  const stages = roadmap.data;
  const tasks = stages.flatMap((stage) => stage.tasks);
  const resources = [
    ...stages.flatMap((stage) => stage.resources),
    ...tasks.flatMap((task) => task.resources),
  ];

  // IDs must be unique, because progress in the database refers to them.
  for (const [label, ids] of [
    ["stage", stages.map((s) => s.id)],
    ["task", tasks.map((t) => t.id)],
    ["resource", resources.map((r) => r.id)],
    ["tool", tools.data.map((t) => t.id)],
    ["template", templates.data.map((t) => t.id)],
    ["legal article", legalArticles.data.map((a) => a.id)],
  ] as const) {
    for (const dupe of duplicates([...ids])) problems.push(`Duplicate ${label} ID "${dupe}"`);
  }

  const stageIds = new Set(stages.map((s) => s.id));
  const toolIds = new Set(tools.data.map((t) => t.id));
  const templateIds = new Set(templates.data.map((t) => t.id));

  for (const stage of stages) {
    for (const toolId of stage.relatedToolIds) {
      if (!toolIds.has(toolId))
        problems.push(`Stage "${stage.id}" refers to unknown tool "${toolId}"`);
    }
    for (const templateId of stage.relatedTemplateIds) {
      if (!templateIds.has(templateId))
        problems.push(`Stage "${stage.id}" refers to unknown template "${templateId}"`);
    }
  }

  const rules = onboardingRules.data;
  for (const [key, ids] of [
    ...goals.map((goal) => [`goal "${goal}"`, rules.proposedDoneByGoal[goal]] as const),
    ...onboardingFlags.map((flag) => [`flag "${flag}"`, rules.proposedDoneByFlag[flag]] as const),
  ]) {
    for (const stageId of ids) {
      if (!stageIds.has(stageId))
        problems.push(`Onboarding rule for ${key} refers to unknown stage "${stageId}"`);
    }
  }

  const allowedPlaceholders = new Set<string>(templatePlaceholders);
  for (const template of templates.data) {
    for (const name of extractPlaceholders(template.body)) {
      if (!allowedPlaceholders.has(name))
        problems.push(`Template "${template.id}" uses unknown placeholder "{{${name}}}"`);
    }
  }

  for (const article of legalArticles.data) {
    if (article.lastVerified > today)
      problems.push(
        `Legal article "${article.id}" has lastVerified in the future (${article.lastVerified})`,
      );
  }

  if (problems.length > 0) throw new ContentError(problems);

  return {
    roadmap: stages.map((stage, stageIndex) => ({
      ...stage,
      order: stageIndex + 1,
      tasks: stage.tasks.map((task, taskIndex) => ({
        ...task,
        stageId: stage.id,
        order: taskIndex + 1,
      })),
    })),
    tools: tools.data,
    templates: templates.data,
    legalArticles: legalArticles.data,
    onboardingRules: rules,
  };
}

/**
 * True if a legal article was last verified more than `maxAgeMonths` ago.
 * Dates are ISO strings (YYYY-MM-DD).
 */
export function isVerificationStale(lastVerified: string, today: string, maxAgeMonths = 12) {
  const [year, month, day] = lastVerified.split("-").map(Number) as [number, number, number];
  const limit = new Date(Date.UTC(year, month - 1 + maxAgeMonths, day));
  return new Date(`${today}T00:00:00Z`) > limit;
}

import { legalArticles } from "@/content/legal-articles";
import { onboardingRules } from "@/content/onboarding-rules";
import { readinessChecklist } from "@/content/readiness-checklist";
import { roadmap } from "@/content/roadmap";
import { templates } from "@/content/templates";
import { tools } from "@/content/tools";

import type { LegalArticle, Stage, Task, Template, Tool, ToolId } from "./schema";
import { loadContent } from "./validate";

export const rawContent = {
  roadmap,
  tools,
  templates,
  legalArticles,
  onboardingRules,
  readinessChecklist,
};

// Parsed once when the module loads. Invalid content throws here, so every
// page that uses content fails the build instead of showing broken data.
export const content = loadContent(rawContent, new Date().toISOString().slice(0, 10));

const stagesById = new Map(content.roadmap.map((stage) => [stage.id, stage]));
const tasksById = new Map(
  content.roadmap.flatMap((stage) => stage.tasks).map((task) => [task.id, task]),
);

/** All stages in roadmap order, each with its tasks in order. */
export function getRoadmap(): Stage[] {
  return content.roadmap;
}

export function getStage(id: string): Stage | undefined {
  return stagesById.get(id);
}

/** All tasks in roadmap order. */
export function getAllTasks(): Task[] {
  return content.roadmap.flatMap((stage) => stage.tasks);
}

export function getTask(id: string): Task | undefined {
  return tasksById.get(id);
}

export function getTools(): Tool[] {
  return content.tools;
}

export function getTool(id: ToolId): Tool | undefined {
  return content.tools.find((tool) => tool.id === id);
}

export function getTemplates(): Template[] {
  return content.templates;
}

export function getTemplate(id: string): Template | undefined {
  return content.templates.find((template) => template.id === id);
}

/** Stages that link to a template, in roadmap order. */
export function getStagesForTemplate(templateId: string): Stage[] {
  return content.roadmap.filter((stage) => stage.relatedTemplateIds.includes(templateId));
}

export function getLegalArticles(): LegalArticle[] {
  return content.legalArticles;
}

export function getLegalArticle(id: string): LegalArticle | undefined {
  return content.legalArticles.find((article) => article.id === id);
}

/** Stages that link to a Germany basics article, in roadmap order. */
export function getStagesForArticle(articleId: string): Stage[] {
  return content.roadmap.filter((stage) => stage.relatedArticleIds.includes(articleId));
}

/** Items grouped by their category, keeping the content order. */
export function groupByCategory<T extends { category: string }>(items: T[]): [string, T[]][] {
  const groups = new Map<string, T[]>();
  for (const item of items) groups.set(item.category, [...(groups.get(item.category) ?? []), item]);
  return [...groups];
}

export function getOnboardingRules() {
  return content.onboardingRules;
}

export function getReadinessChecklist() {
  return content.readinessChecklist;
}

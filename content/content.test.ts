import { describe, expect, it } from "vitest";

import { content, getAllTasks } from "@/lib/content";
import { isVerificationStale } from "@/lib/content/validate";

// Runs before every build (npm run content:check), so broken content never ships.
describe("content", () => {
  it("has the 15 roadmap stages in the planned order", () => {
    expect(content.roadmap.map((stage) => stage.id)).toEqual([
      "define-skills",
      "choose-service",
      "define-target-customer",
      "build-portfolio",
      "define-pricing",
      "prepare-profile",
      "business-basics",
      "find-clients",
      "contact-clients",
      "create-offer",
      "close-project",
      "deliver-project",
      "invoice-client",
      "collect-testimonial",
      "improve-repeat",
    ]);
  });

  it("has the 8 planned templates", () => {
    expect(content.templates.map((template) => template.id)).toEqual([
      "freelancer-profile",
      "portfolio-structure",
      "client-outreach",
      "follow-up-message",
      "project-brief",
      "project-proposal",
      "invoice-example",
      "testimonial-request",
    ]);
  });

  it("links every template from at least one stage", () => {
    const linked = new Set(content.roadmap.flatMap((stage) => stage.relatedTemplateIds));
    expect(content.templates.filter((template) => !linked.has(template.id))).toEqual([]);
  });

  it("has the 9 planned Germany basics articles", () => {
    expect(content.legalArticles.map((article) => article.id)).toEqual([
      "freelancer-or-trade",
      "registration",
      "tax-office",
      "small-business-scheme",
      "vat",
      "invoices",
      "health-insurance",
      "retirement",
      "false-self-employment",
    ]);
  });

  it("links every Germany basics article from at least one stage", () => {
    const linked = new Set(content.roadmap.flatMap((stage) => stage.relatedArticleIds));
    expect(content.legalArticles.filter((article) => !linked.has(article.id))).toEqual([]);
  });

  // Rules change (e.g. thresholds, e-invoicing). When this fails, check the article
  // against its sources again and update lastVerified.
  it("has no Germany basics article last verified more than 12 months ago", () => {
    const today = new Date().toISOString().slice(0, 10);
    const stale = content.legalArticles
      .filter((article) => isVerificationStale(article.lastVerified, today))
      .map((article) => `${article.id} (${article.lastVerified})`);
    expect(stale).toEqual([]);
  });

  // User progress in the database refers to these IDs. If this test fails
  // because an ID was renamed or removed, add a new ID instead and keep the old
  // one, or plan a data migration. Only update the snapshot for added IDs.
  it("keeps all task IDs stable", () => {
    expect(getAllTasks().map((task) => `${task.stageId}/${task.id}`)).toMatchSnapshot();
  });
});

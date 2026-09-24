import { describe, expect, it } from "vitest";

import {
  ContentError,
  extractPlaceholders,
  isVerificationStale,
  loadContent,
  type RawContent,
} from "./validate";

const today = "2026-09-24";

function validContent(): RawContent {
  return {
    roadmap: [
      {
        id: "stage-one",
        title: "Stufe 1",
        shortExplanation: "Erklärung",
        whyItMatters: "Darum",
        relatedToolIds: ["hourly-rate"],
        relatedTemplateIds: ["outreach"],
        tasks: [
          { id: "task-a", title: "Task A", description: "Beschreibung", estimatedMinutes: 10 },
          { id: "task-b", title: "Task B", description: "Beschreibung", estimatedMinutes: 20 },
        ],
      },
      {
        id: "stage-two",
        title: "Stufe 2",
        shortExplanation: "Erklärung",
        whyItMatters: "Darum",
        tasks: [
          { id: "task-c", title: "Task C", description: "Beschreibung", estimatedMinutes: 30 },
        ],
      },
    ],
    tools: [{ id: "hourly-rate", title: "Rechner", description: "Beschreibung", href: "/tools/x" }],
    templates: [
      {
        id: "outreach",
        title: "Anfrage",
        category: "Akquise",
        kind: "template",
        body: "Hallo, ich bin {{name}} und arbeite mit {{ mainSkill }}.",
      },
    ],
    legalArticles: [
      {
        id: "kleinunternehmer",
        title: "Kleinunternehmerregelung",
        summary: "Kurz",
        body: "Text",
        sources: [{ title: "Quelle", url: "https://example.org" }],
        lastVerified: "2026-09-01",
      },
    ],
    onboardingRules: {
      proposedDoneByGoal: {
        "become-freelancer": [],
        "first-client": ["stage-one"],
        "more-clients": ["stage-one", "stage-two"],
      },
      proposedDoneByFlag: { hasPortfolio: ["stage-two"], hasFreelanceExperience: [] },
    },
  };
}

function problemsOf(raw: RawContent): string[] {
  try {
    loadContent(raw, today);
  } catch (error) {
    if (error instanceof ContentError) return error.problems;
    throw error;
  }
  return [];
}

describe("loadContent", () => {
  it("accepts valid content", () => {
    expect(problemsOf(validContent())).toEqual([]);
  });

  it("derives order and stageId from the position in the file", () => {
    const content = loadContent(validContent(), today);

    expect(content.roadmap.map((s) => [s.id, s.order])).toEqual([
      ["stage-one", 1],
      ["stage-two", 2],
    ]);
    expect(content.roadmap[0]?.tasks.map((t) => [t.id, t.stageId, t.order])).toEqual([
      ["task-a", "stage-one", 1],
      ["task-b", "stage-one", 2],
    ]);
  });

  it("fills in defaults for optional lists", () => {
    const stage = loadContent(validContent(), today).roadmap[1];

    expect(stage?.resources).toEqual([]);
    expect(stage?.relatedToolIds).toEqual([]);
    expect(stage?.tasks[0]?.resources).toEqual([]);
  });

  it("reports schema errors with their path", () => {
    const raw = validContent();
    (raw.roadmap as { tasks: { estimatedMinutes: number }[] }[])[0]!.tasks[0]!.estimatedMinutes =
      -5;

    expect(problemsOf(raw)).toEqual([
      expect.stringMatching(/^roadmap\.0\.tasks\.0\.estimatedMinutes: /),
    ]);
  });

  it("rejects unknown fields, so typos don't go unnoticed", () => {
    const raw = validContent();
    (raw.roadmap as Record<string, unknown>[])[0]!.titel = "Tippfehler";

    expect(problemsOf(raw)).toEqual([expect.stringContaining("titel")]);
  });

  it("rejects IDs that are not kebab-case", () => {
    const raw = validContent();
    (raw.roadmap as { id: string }[])[0]!.id = "Stage One";

    expect(problemsOf(raw)).toEqual([expect.stringContaining("kebab-case")]);
  });

  it("rejects a stage without tasks", () => {
    const raw = validContent();
    (raw.roadmap as { tasks: unknown[] }[])[1]!.tasks = [];

    expect(problemsOf(raw)).toEqual([expect.stringMatching(/^roadmap\.1\.tasks: /)]);
  });

  it("rejects duplicate task IDs across stages", () => {
    const raw = validContent();
    (raw.roadmap as { tasks: { id: string }[] }[])[1]!.tasks[0]!.id = "task-a";

    expect(problemsOf(raw)).toEqual(['Duplicate task ID "task-a"']);
  });

  it("rejects references to unknown templates", () => {
    const raw = validContent();
    (raw.roadmap as { relatedTemplateIds: string[] }[])[0]!.relatedTemplateIds = ["missing"];

    expect(problemsOf(raw)).toEqual(['Stage "stage-one" refers to unknown template "missing"']);
  });

  it("rejects references to tools that are not in the tool list", () => {
    const raw = validContent();
    (raw.roadmap as { relatedToolIds: string[] }[])[0]!.relatedToolIds = ["project-price"];

    expect(problemsOf(raw)).toEqual(['Stage "stage-one" refers to unknown tool "project-price"']);
  });

  it("rejects onboarding rules that point to unknown stages", () => {
    const raw = validContent();
    (
      raw.onboardingRules as { proposedDoneByFlag: Record<string, string[]> }
    ).proposedDoneByFlag.hasPortfolio = ["stage-99"];

    expect(problemsOf(raw)).toEqual([
      'Onboarding rule for flag "hasPortfolio" refers to unknown stage "stage-99"',
    ]);
  });

  it("requires a rule for every goal", () => {
    const raw = validContent();
    delete (raw.onboardingRules as { proposedDoneByGoal: Record<string, string[]> })
      .proposedDoneByGoal["more-clients"];

    expect(problemsOf(raw)).toEqual([expect.stringContaining("more-clients")]);
  });

  it("rejects unknown template placeholders", () => {
    const raw = validContent();
    (raw.templates as { body: string }[])[0]!.body = "Hallo {{vorname}}";

    expect(problemsOf(raw)).toEqual(['Template "outreach" uses unknown placeholder "{{vorname}}"']);
  });

  it("requires a disclaimer for legal samples", () => {
    const raw = validContent();
    (raw.templates as { kind: string }[])[0]!.kind = "legal-sample";

    expect(problemsOf(raw)).toEqual(["templates.0.disclaimer: Legal samples need a disclaimer"]);
  });

  it("requires at least one source for legal articles", () => {
    const raw = validContent();
    (raw.legalArticles as { sources: unknown[] }[])[0]!.sources = [];

    expect(problemsOf(raw)).toEqual([expect.stringMatching(/^legalArticles\.0\.sources: /)]);
  });

  it("rejects invalid and future verification dates", () => {
    const invalid = validContent();
    (invalid.legalArticles as { lastVerified: string }[])[0]!.lastVerified = "2026-02-30";
    expect(problemsOf(invalid)).toEqual([expect.stringMatching(/^legalArticles\.0\.lastVerified/)]);

    const future = validContent();
    (future.legalArticles as { lastVerified: string }[])[0]!.lastVerified = "2026-10-01";
    expect(problemsOf(future)).toEqual([
      'Legal article "kleinunternehmer" has lastVerified in the future (2026-10-01)',
    ]);
  });

  it("reports all problems at once", () => {
    const raw = validContent();
    (raw.roadmap as { relatedTemplateIds: string[] }[])[0]!.relatedTemplateIds = ["missing"];
    (raw.templates as { body: string }[])[0]!.body = "{{vorname}}";

    expect(problemsOf(raw)).toHaveLength(2);
  });
});

describe("extractPlaceholders", () => {
  it("finds each placeholder once, ignoring spaces", () => {
    expect(extractPlaceholders("{{name}} – {{ mainSkill }} – {{name}}")).toEqual([
      "name",
      "mainSkill",
    ]);
  });

  it("returns nothing for text without placeholders", () => {
    expect(extractPlaceholders("Hallo")).toEqual([]);
  });
});

describe("isVerificationStale", () => {
  it("is fresh within 12 months", () => {
    expect(isVerificationStale("2025-09-24", "2026-09-24")).toBe(false);
  });

  it("is stale after 12 months", () => {
    expect(isVerificationStale("2025-09-23", "2026-09-24")).toBe(true);
  });

  it("supports a custom maximum age", () => {
    expect(isVerificationStale("2026-03-01", "2026-09-24", 6)).toBe(true);
  });
});

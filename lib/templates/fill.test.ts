import { describe, expect, it } from "vitest";

import {
  countOpenGaps,
  fillPlaceholders,
  formatYears,
  missingPlaceholders,
  placeholderValues,
  type ProfileForTemplates,
} from "./fill";

const profile: ProfileForTemplates = {
  name: "Alex Muster",
  main_skill: "React",
  additional_skills: ["TypeScript", "Next.js"],
  years_experience: 5,
};

describe("fillPlaceholders", () => {
  it("replaces known placeholders, also with spaces inside the braces", () => {
    expect(
      fillPlaceholders("Ich bin {{name}}, {{ mainSkill }}.", { name: "Alex", mainSkill: "React" }),
    ).toBe("Ich bin Alex, React.");
  });

  it("replaces every occurrence", () => {
    expect(fillPlaceholders("{{name}} / {{name}}", { name: "Alex" })).toBe("Alex / Alex");
  });

  it("keeps placeholders without a value visible", () => {
    expect(fillPlaceholders("{{name}} für {{hourlyRate}}", { name: "Alex" })).toBe(
      "Alex für {{hourlyRate}}",
    );
    expect(fillPlaceholders("{{name}}", { name: "" })).toBe("{{name}}");
  });

  it("leaves [gaps] for the user untouched", () => {
    expect(fillPlaceholders("[Firma]", { name: "Alex" })).toBe("[Firma]");
  });
});

describe("missingPlaceholders", () => {
  it("lists placeholders without a value once, in order of use", () => {
    expect(
      missingPlaceholders("{{hourlyRate}} {{name}} {{hourlyRate}} {{mainSkill}}", {
        name: "Alex",
      }),
    ).toEqual(["hourlyRate", "mainSkill"]);
  });

  it("is empty when everything is filled", () => {
    expect(missingPlaceholders("{{name}}", { name: "Alex" })).toEqual([]);
  });
});

describe("countOpenGaps", () => {
  it("counts [gaps] and remaining {{placeholders}}", () => {
    expect(countOpenGaps("Hallo [Name], ich bin {{name}}. [Firma] [Firma]")).toBe(4);
  });

  it("is 0 when everything is filled in", () => {
    expect(countOpenGaps("Hallo Frau Beispiel, ich bin Alex.")).toBe(0);
  });

  it("ignores brackets across lines and empty brackets", () => {
    expect(countOpenGaps("[\n] []")).toBe(0);
  });
});

describe("formatYears", () => {
  it.each([
    [0, "weniger als ein Jahr"],
    [1, "1 Jahr"],
    [2, "2 Jahre"],
    [15, "15 Jahre"],
  ])("%i -> %s", (years, text) => {
    expect(formatYears(years)).toBe(text);
  });
});

describe("placeholderValues", () => {
  it("fills all values from the profile and the saved hourly rate", () => {
    expect(placeholderValues(profile, 56.33)).toEqual({
      name: "Alex Muster",
      mainSkill: "React",
      additionalSkills: "TypeScript, Next.js",
      yearsOfExperience: "5 Jahre",
      hourlyRate: "57 €",
    });
  });

  it("formats large rates with a thousands separator and a plain space", () => {
    expect(placeholderValues(null, 1200).hourlyRate).toBe("1.200 €");
  });

  it("leaves out empty and missing values", () => {
    expect(
      placeholderValues(
        { name: "  ", main_skill: null, additional_skills: [" "], years_experience: null },
        null,
      ),
    ).toEqual({});
  });

  it("keeps 0 years of experience", () => {
    expect(placeholderValues({ ...profile, years_experience: 0 }, null).yearsOfExperience).toBe(
      "weniger als ein Jahr",
    );
  });

  it("returns no values without a profile (not logged in)", () => {
    expect(placeholderValues(null, null)).toEqual({});
  });
});

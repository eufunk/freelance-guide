import { describe, expect, it } from "vitest";

import {
  firstStepWithError,
  onboardingInputFrom,
  onboardingInputFromProfile,
  onboardingSchema,
  parseSkillList,
  validateStep,
  type OnboardingInput,
} from "./schema";

const valid: OnboardingInput = {
  name: " Anna Muster ",
  country: "DE",
  mainSkill: "Webentwicklung",
  additionalSkills: "React, TypeScript, react, ",
  yearsExperience: "4",
  hasPortfolio: "yes",
  hasFreelanceExperience: "no",
  goal: "first-client",
  hoursPerWeek: "20",
  desiredStartDate: "",
  confirmedStageIds: ["define-skills"],
};

describe("onboardingSchema", () => {
  it("parses valid answers into typed values", () => {
    expect(onboardingSchema.parse(valid)).toEqual({
      name: "Anna Muster",
      country: "DE",
      mainSkill: "Webentwicklung",
      additionalSkills: ["React", "TypeScript"],
      yearsExperience: 4,
      hasPortfolio: true,
      hasFreelanceExperience: false,
      goal: "first-client",
      hoursPerWeek: 20,
      desiredStartDate: null,
      confirmedStageIds: ["define-skills"],
    });
  });

  it("keeps a valid start date", () => {
    const result = onboardingSchema.parse({ ...valid, desiredStartDate: "2026-11-01" });

    expect(result.desiredStartDate).toBe("2026-11-01");
  });

  it.each([
    ["yearsExperience", "-1"],
    ["yearsExperience", "2.5"],
    ["yearsExperience", "61"],
    ["hoursPerWeek", "0"],
    ["hoursPerWeek", "zwanzig"],
    ["desiredStartDate", "2026-02-30"],
  ] as const)("rejects %s = %s", (field, value) => {
    expect(onboardingSchema.safeParse({ ...valid, [field]: value }).success).toBe(false);
  });
});

describe("validateStep", () => {
  it("only checks the fields of the given step", () => {
    const values = { ...valid, name: "", goal: "" as OnboardingInput["goal"] };

    expect(validateStep(0, values)).toEqual({ name: ["Bitte gib deinen Namen ein."] });
    expect(validateStep(1, values)).toBe(null);
    expect(validateStep(2, values)).toEqual({ goal: ["Bitte wähle dein Ziel."] });
  });

  it("asks for yes or no in German", () => {
    const values = { ...valid, hasPortfolio: "" as OnboardingInput["hasPortfolio"] };

    expect(validateStep(1, values)).toEqual({ hasPortfolio: ["Bitte wähle Ja oder Nein."] });
  });
});

describe("firstStepWithError", () => {
  it("finds the step that contains a field", () => {
    expect(firstStepWithError(["hoursPerWeek", "goal"])).toBe(2);
    expect(firstStepWithError(["name"])).toBe(0);
  });
});

describe("parseSkillList", () => {
  it("trims, drops empty entries and removes duplicates ignoring case", () => {
    expect(parseSkillList(" SQL, , Python,sql ")).toEqual(["SQL", "Python"]);
  });
});

describe("onboardingInputFrom", () => {
  it("reads all fields, including the confirmed stages", () => {
    const formData = new FormData();
    formData.set("name", "Anna");
    formData.append("confirmedStageIds", "define-skills");
    formData.append("confirmedStageIds", "choose-service");

    const input = onboardingInputFrom(formData);

    expect(input.name).toBe("Anna");
    expect(input.goal).toBe("");
    expect(input.confirmedStageIds).toEqual(["define-skills", "choose-service"]);
  });
});

describe("onboardingInputFromProfile", () => {
  it("turns a saved profile back into form values", () => {
    const input = onboardingInputFromProfile({
      name: "Anna",
      country: "DE",
      main_skill: "Webentwicklung",
      additional_skills: ["React", "SQL"],
      years_experience: 0,
      has_portfolio: true,
      has_freelance_experience: false,
      goal: "first-client",
      hours_per_week: 20,
      desired_start_date: null,
    });

    expect(input).toEqual({
      ...valid,
      name: "Anna",
      additionalSkills: "React, SQL",
      yearsExperience: "0",
      confirmedStageIds: [],
    });
    expect(onboardingSchema.safeParse(input).success).toBe(true);
  });

  it("leaves unanswered questions empty", () => {
    const input = onboardingInputFromProfile({
      name: null,
      country: null,
      main_skill: null,
      additional_skills: [],
      years_experience: null,
      has_portfolio: null,
      has_freelance_experience: null,
      goal: null,
      hours_per_week: null,
      desired_start_date: null,
    });

    expect(input.hasPortfolio).toBe("");
    expect(input.yearsExperience).toBe("");
  });
});

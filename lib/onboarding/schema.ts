import { z } from "zod";

import { goals } from "@/lib/content/schema";

// Onboarding answers. Used by the form (per step) and by the Server Function.

export const countries = ["DE", "AT", "CH", "OTHER"] as const;
export type Country = (typeof countries)[number];

export const countryLabels: Record<Country, string> = {
  DE: "Deutschland",
  AT: "Österreich",
  CH: "Schweiz",
  OTHER: "Anderes Land",
};

export const goalLabels: Record<(typeof goals)[number], { title: string; description: string }> = {
  "become-freelancer": {
    title: "Ich will Freelancer werden",
    description: "Du startest bei null und willst den Schritt in die Selbstständigkeit planen.",
  },
  "first-client": {
    title: "Ich suche meinen ersten Kunden",
    description: "Dein Angebot steht grob, jetzt soll der erste Auftrag her.",
  },
  "more-clients": {
    title: "Ich bin schon Freelancer und brauche mehr Kunden",
    description: "Du arbeitest bereits selbstständig und willst mehr Aufträge gewinnen.",
  },
};

const yesNo = z.enum(["yes", "no"], "Bitte wähle Ja oder Nein.").transform((v) => v === "yes");

const wholeNumber = (min: number, max: number, message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .regex(/^\d+$/, message)
    .transform(Number)
    .pipe(z.number().int().min(min, message).max(max, message));

/** Splits "React, TypeScript, react" into ["React", "TypeScript"]. */
export function parseSkillList(value: string): string[] {
  const seen = new Set<string>();
  const skills: string[] = [];
  for (const raw of value.split(",")) {
    const skill = raw.trim();
    if (skill && !seen.has(skill.toLowerCase())) {
      seen.add(skill.toLowerCase());
      skills.push(skill);
    }
  }
  return skills;
}

export const onboardingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Bitte gib deinen Namen ein.")
    .max(100, "Der Name darf höchstens 100 Zeichen lang sein."),
  country: z.enum(countries, "Bitte wähle ein Land."),
  mainSkill: z
    .string()
    .trim()
    .min(1, "Bitte gib deinen Haupt-Skill ein.")
    .max(100, "Bitte fasse deinen Haupt-Skill kürzer (höchstens 100 Zeichen)."),
  additionalSkills: z
    .string()
    .transform(parseSkillList)
    .pipe(
      z
        .array(z.string().max(50, "Ein Skill darf höchstens 50 Zeichen lang sein."))
        .max(20, "Bitte gib höchstens 20 weitere Skills an."),
    ),
  yearsExperience: wholeNumber(0, 60, "Bitte gib eine ganze Zahl zwischen 0 und 60 ein."),
  hasPortfolio: yesNo,
  hasFreelanceExperience: yesNo,
  goal: z.enum(goals, "Bitte wähle dein Ziel."),
  hoursPerWeek: wholeNumber(1, 80, "Bitte gib eine ganze Zahl zwischen 1 und 80 ein."),
  desiredStartDate: z.union([
    z.literal("").transform(() => null),
    z.iso.date("Bitte gib ein gültiges Datum ein."),
  ]),
  /** Stages the user confirmed as already done in the last step. */
  confirmedStageIds: z.array(z.string()),
});

export type OnboardingInput = z.input<typeof onboardingSchema>;
export type OnboardingAnswers = z.output<typeof onboardingSchema>;
export type OnboardingField = keyof OnboardingInput;

/** The steps and their fields. The last step shows the proposed starting point. */
export const onboardingSteps = [
  { id: "person", title: "Über dich", fields: ["name", "country"] },
  {
    id: "profile",
    title: "Dein IT-Profil",
    fields: [
      "mainSkill",
      "additionalSkills",
      "yearsExperience",
      "hasPortfolio",
      "hasFreelanceExperience",
    ],
  },
  { id: "goal", title: "Dein Ziel", fields: ["goal"] },
  { id: "availability", title: "Deine Zeit", fields: ["hoursPerWeek", "desiredStartDate"] },
  { id: "summary", title: "Dein Startpunkt", fields: ["confirmedStageIds"] },
] as const satisfies readonly { id: string; title: string; fields: readonly OnboardingField[] }[];

/** Field errors of one step, or null if the step is valid. */
export function validateStep(
  stepIndex: number,
  values: OnboardingInput,
): Partial<Record<OnboardingField, string[]>> | null {
  const step = onboardingSteps[stepIndex];
  if (!step) return null;
  const mask = Object.fromEntries(step.fields.map((field) => [field, true])) as {
    [K in OnboardingField]?: true;
  };
  const result = onboardingSchema.pick(mask).safeParse(values);
  return result.success ? null : z.flattenError(result.error).fieldErrors;
}

/** Index of the first step that contains one of the given fields. */
export function firstStepWithError(fields: string[]): number {
  const index = onboardingSteps.findIndex((step) =>
    step.fields.some((field) => fields.includes(field)),
  );
  return index === -1 ? 0 : index;
}

/** Reads the form fields into the input shape. */
export function onboardingInputFrom(formData: FormData): OnboardingInput {
  const text = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };
  return {
    name: text("name"),
    country: text("country") as OnboardingInput["country"],
    mainSkill: text("mainSkill"),
    additionalSkills: text("additionalSkills"),
    yearsExperience: text("yearsExperience"),
    hasPortfolio: text("hasPortfolio") as OnboardingInput["hasPortfolio"],
    hasFreelanceExperience: text(
      "hasFreelanceExperience",
    ) as OnboardingInput["hasFreelanceExperience"],
    goal: text("goal") as OnboardingInput["goal"],
    hoursPerWeek: text("hoursPerWeek"),
    desiredStartDate: text("desiredStartDate"),
    confirmedStageIds: formData
      .getAll("confirmedStageIds")
      .filter((value): value is string => typeof value === "string"),
  };
}

type ProfileAnswers = {
  name: string | null;
  country: string | null;
  main_skill: string | null;
  additional_skills: string[];
  years_experience: number | null;
  has_portfolio: boolean | null;
  has_freelance_experience: boolean | null;
  goal: string | null;
  hours_per_week: number | null;
  desired_start_date: string | null;
};

const yesNoFrom = (value: boolean | null) => (value === null ? "" : value ? "yes" : "no");

/** Form values from a saved profile, to pre-fill the form when onboarding is re-run. */
export function onboardingInputFromProfile(profile: ProfileAnswers): OnboardingInput {
  return {
    name: profile.name ?? "",
    country: (profile.country ?? "") as OnboardingInput["country"],
    mainSkill: profile.main_skill ?? "",
    additionalSkills: profile.additional_skills.join(", "),
    yearsExperience: profile.years_experience?.toString() ?? "",
    hasPortfolio: yesNoFrom(profile.has_portfolio) as OnboardingInput["hasPortfolio"],
    hasFreelanceExperience: yesNoFrom(
      profile.has_freelance_experience,
    ) as OnboardingInput["hasFreelanceExperience"],
    goal: (profile.goal ?? "") as OnboardingInput["goal"],
    hoursPerWeek: profile.hours_per_week?.toString() ?? "",
    desiredStartDate: profile.desired_start_date ?? "",
    confirmedStageIds: [],
  };
}

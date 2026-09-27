// Used on the server and in the browser: no imports that pull in validation code.
import type { TemplatePlaceholder } from "@/lib/content/schema";
import { formatNumber } from "@/lib/format";

export type PlaceholderValues = Partial<Record<TemplatePlaceholder, string>>;

const PLACEHOLDER = /\{\{\s*([^}]*?)\s*\}\}/g;

/** Replaces {{placeholders}} with their values. Missing values stay visible as {{placeholder}}. */
export function fillPlaceholders(body: string, values: PlaceholderValues): string {
  return body.replace(PLACEHOLDER, (match, name: string) => {
    const value = values[name as TemplatePlaceholder];
    return value ? value : match;
  });
}

/** Placeholders the body uses that have no value, in order of first use. */
export function missingPlaceholders(
  body: string,
  values: PlaceholderValues,
): TemplatePlaceholder[] {
  const used = [...body.matchAll(PLACEHOLDER)].map((match) => match[1] as TemplatePlaceholder);
  return [...new Set(used)].filter((name) => !values[name]);
}

// {{placeholder}} or [gap to fill in by hand], on a single line.
const GAP = /\{\{[^}\n]*\}\}|\[[^[\]\n]+\]/g;

/** Number of spots the user still has to fill in: {{placeholders}} and [gaps]. */
export function countOpenGaps(text: string): number {
  return text.match(GAP)?.length ?? 0;
}

/** "1 Jahr", "5 Jahre", "weniger als ein Jahr" – fits "… Berufserfahrung". */
export function formatYears(years: number): string {
  if (years < 1) return "weniger als ein Jahr";
  return years === 1 ? "1 Jahr" : `${formatNumber(years)} Jahre`;
}

export type ProfileForTemplates = {
  name: string | null;
  main_skill: string | null;
  additional_skills: string[];
  years_experience: number | null;
};

/** Placeholder values from the profile and the saved hourly rate (rounded up to whole euros). */
export function placeholderValues(
  profile: ProfileForTemplates | null,
  hourlyRate: number | null,
): PlaceholderValues {
  const values: PlaceholderValues = {};
  const name = profile?.name?.trim();
  const mainSkill = profile?.main_skill?.trim();
  const additionalSkills = (profile?.additional_skills ?? [])
    .map((skill) => skill.trim())
    .filter(Boolean);

  if (name) values.name = name;
  if (mainSkill) values.mainSkill = mainSkill;
  if (additionalSkills.length > 0) values.additionalSkills = additionalSkills.join(", ");
  if (profile?.years_experience != null)
    values.yearsOfExperience = formatYears(profile.years_experience);
  // A plain space before "€", so copied text has no non-breaking space.
  if (hourlyRate != null && hourlyRate > 0)
    values.hourlyRate = `${formatNumber(Math.ceil(hourlyRate))} €`;
  return values;
}

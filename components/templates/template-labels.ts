import type { TemplateKind, TemplatePlaceholder } from "@/lib/content/schema";

export const templateKindLabels: Record<TemplateKind, string> = {
  template: "Vorlage",
  example: "Beispiel",
  "legal-sample": "Rechtliches Muster",
};

/** How to use each kind, shown on the template page. */
export const templateKindHints: Record<TemplateKind, string> = {
  template: "Ein Lückentext: Ersetze die Stellen in [eckigen Klammern] durch deine Angaben.",
  example:
    "Ein ausformuliertes Beispiel zur Orientierung: Übernimm den Aufbau und schreib den Text mit deinen eigenen Inhalten neu.",
  "legal-sample":
    "Ein Muster mit den üblichen Angaben. Es ist nicht rechtlich geprüft und nicht garantiert vollständig.",
};

/** What the placeholders stand for, to tell users which values are missing. */
export const placeholderLabels: Record<TemplatePlaceholder, string> = {
  name: "Name",
  mainSkill: "Haupt-Skill",
  additionalSkills: "weitere Skills",
  yearsOfExperience: "Berufserfahrung",
  hourlyRate: "Stundensatz",
};

import type { ReadinessItemInput } from "@/lib/content/schema";

// The "Startklar-Check" (readiness checklist). Each item is done when all its
// stages and tasks are completed in the roadmap; it has no state of its own.
export const readinessChecklist = [
  {
    id: "clear-service",
    title: "Klare Dienstleistung",
    description: "Du weißt, was du anbietest und für wen.",
    stageIds: ["choose-service"],
  },
  {
    id: "portfolio",
    title: "Portfolio",
    description: "Du kannst mit Beispielen zeigen, was du kannst.",
    stageIds: ["build-portfolio"],
  },
  {
    id: "profile",
    title: "Freelancer-Profil",
    description: "Kunden finden dich und verstehen dein Angebot.",
    stageIds: ["prepare-profile"],
  },
  {
    id: "pricing",
    title: "Preise",
    description: "Du kennst deinen Stundensatz und weißt, wie du Projekte kalkulierst.",
    stageIds: ["define-pricing"],
  },
  {
    id: "business-basics",
    title: "Rechtliche und geschäftliche Grundlagen",
    description: "Anmeldung, Finanzamt und Versicherung sind geklärt.",
    taskIds: ["clarify-business-type", "register-tax-office", "clarify-insurance"],
  },
  {
    id: "acquisition",
    title: "Strategie für die Kundensuche",
    description: "Du hast eine Liste potenzieller Kunden.",
    stageIds: ["find-clients"],
  },
  {
    id: "contract-template",
    title: "Vertragsvorlage",
    description: "Du hast eine Vorlage für Projektverträge aus einer verlässlichen Quelle.",
    taskIds: ["get-contract-template"],
  },
  {
    id: "invoice-template",
    title: "Rechnungsvorlage",
    description: "Du kannst direkt nach dem ersten Auftrag korrekt abrechnen.",
    taskIds: ["prepare-invoice-template"],
  },
] satisfies ReadinessItemInput[];

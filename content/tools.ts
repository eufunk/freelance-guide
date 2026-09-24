import type { ToolInput } from "@/lib/content/schema";

// The tools themselves are built in Phase 8. This list makes them linkable
// from roadmap stages and the dashboard.
export const tools = [
  {
    id: "hourly-rate",
    title: "Stundensatz-Rechner",
    description:
      "Berechne, welchen Stundensatz du brauchst, um dein Wunsch-Nettoeinkommen zu erreichen.",
    href: "/tools/stundensatz",
  },
  {
    id: "project-price",
    title: "Projektpreis-Rechner",
    description: "Schätze den Preis für ein Projekt aus Aufwand, Stundensatz und Puffer.",
    href: "/tools/projektpreis",
  },
  {
    id: "readiness-checklist",
    title: "Startklar-Check",
    description: "Sieh auf einen Blick, wie gut du für deinen ersten Auftrag vorbereitet bist.",
    href: "/tools/startklar",
  },
] satisfies ToolInput[];

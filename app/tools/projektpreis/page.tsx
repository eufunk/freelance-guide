import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { ProjectPriceCalculator } from "@/components/tools/project-price-calculator";
import { projectPriceDefaults } from "@/content/calculator-defaults";
import { getCurrentUser } from "@/lib/auth/dal";
import { getCalculatorResult } from "@/lib/db/calculator-results";
import { parseNumber } from "@/lib/tools/numbers";

export const metadata: Metadata = { title: "Projektpreis-Rechner" };

// Public tool. The hourly rate comes from the link of the hourly rate
// calculator (?stundensatz=…) or from the user's saved result.
export default async function ProjectPricePage({ searchParams }: PageProps<"/tools/projektpreis">) {
  const { stundensatz } = await searchParams;
  let rate = typeof stundensatz === "string" ? parseNumber(stundensatz) : Number.NaN;

  if (Number.isNaN(rate)) {
    const user = await getCurrentUser();
    const saved = user ? await getCalculatorResult("hourly-rate", "/tools/projektpreis") : null;
    if (saved) rate = Math.ceil(Number(saved.result));
  }

  return (
    <PageContainer
      title="Projektpreis-Rechner"
      description="Was sollte ein Projekt kosten? Aus Aufwand, Stundensatz und Puffer."
    >
      <ProjectPriceCalculator
        initialValues={{
          hours: "",
          hourlyRate: Number.isNaN(rate) ? "" : rate.toLocaleString("de-DE"),
          contingencyPercent: String(projectPriceDefaults.contingencyPercent),
        }}
      />
    </PageContainer>
  );
}

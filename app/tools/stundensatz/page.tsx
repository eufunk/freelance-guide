import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { HourlyRateCalculator } from "@/components/tools/hourly-rate-calculator";
import { hourlyRateDefaults } from "@/content/calculator-defaults";
import { getCurrentUser } from "@/lib/auth/dal";
import { getCalculatorResult } from "@/lib/db/calculator-results";
import { hourlyRateFields, type HourlyRateField } from "@/lib/tools/hourly-rate";

export const metadata: Metadata = { title: "Stundensatz-Rechner" };

const PATH = "/tools/stundensatz";

type Values = Record<HourlyRateField, string>;

const defaultValues: Values = {
  netMonthlyIncome: "",
  monthlyExpenses: "",
  hoursPerWeek: String(hourlyRateDefaults.hoursPerWeek),
  nonBillableHoursPerWeek: String(hourlyRateDefaults.nonBillableHoursPerWeek),
  vacationDays: String(hourlyRateDefaults.vacationDays),
  publicHolidays: String(hourlyRateDefaults.publicHolidays),
  sickDays: String(hourlyRateDefaults.sickDays),
  monthlyHealthInsurance: String(hourlyRateDefaults.monthlyHealthInsurance),
  monthlyRetirement: String(hourlyRateDefaults.monthlyRetirement),
  taxRatePercent: String(hourlyRateDefaults.taxRatePercent),
};

/** Values from a saved calculation, falling back to the defaults for missing fields. */
function valuesFrom(saved: unknown): Values {
  if (!saved || typeof saved !== "object") return defaultValues;
  const values = { ...defaultValues };
  for (const field of hourlyRateFields) {
    const value = (saved as Record<string, unknown>)[field];
    if (typeof value === "number") values[field] = value.toLocaleString("de-DE");
  }
  return values;
}

// Public tool: works without an account; saving needs a login.
export default async function HourlyRatePage() {
  const user = await getCurrentUser();
  const saved = user ? await getCalculatorResult("hourly-rate", PATH) : null;

  return (
    <PageContainer
      title="Stundensatz-Rechner"
      description="Welchen Stundensatz brauchst du, um von deiner Arbeit leben zu können?"
    >
      <HourlyRateCalculator initialValues={valuesFrom(saved?.inputs)} canSave={user !== null} />
    </PageContainer>
  );
}

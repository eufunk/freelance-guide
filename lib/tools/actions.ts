"use server";

import { saveCalculatorResult } from "@/lib/db/calculator-results";

import type { SaveResultState } from "./form-state";
import { hourlyRateFields, parseAndCalculateHourlyRate, type HourlyRateField } from "./hourly-rate";

/** Saves the hourly rate for the logged-in user. The server recalculates the result. */
export async function saveHourlyRate(
  _: SaveResultState,
  formData: FormData,
): Promise<SaveResultState> {
  const values = Object.fromEntries(
    hourlyRateFields.map((field) => {
      const value = formData.get(field);
      return [field, typeof value === "string" ? value : ""];
    }),
  ) as Record<HourlyRateField, string>;

  const parsed = parseAndCalculateHourlyRate(values);
  if (!parsed.ok) {
    return { status: "error", message: "Bitte korrigiere zuerst die markierten Angaben." };
  }

  await saveCalculatorResult(
    "hourly-rate",
    parsed.input,
    Math.round(parsed.result.hourlyRate * 100) / 100,
    "/tools/stundensatz",
  );
  return {
    status: "success",
    message: "Gespeichert. Der Projektpreis-Rechner übernimmt diesen Stundensatz.",
  };
}

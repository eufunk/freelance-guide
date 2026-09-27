import { parseNumber } from "./numbers";

// Hourly rate calculator (Phase 8 in guide/ToDo.docx). A simplified model based
// on a 5-day week. The result is net, excluding VAT.

export type HourlyRateInput = {
  /** Desired net income per month (what is left after taxes and insurance). */
  netMonthlyIncome: number;
  hoursPerWeek: number;
  /** Of which non-billable: acquisition, admin, learning. */
  nonBillableHoursPerWeek: number;
  vacationDays: number;
  publicHolidays: number;
  sickDays: number;
  monthlyExpenses: number;
  monthlyHealthInsurance: number;
  monthlyRetirement: number;
  taxRatePercent: number;
};

export type HourlyRateField = keyof HourlyRateInput;

export type HourlyRateResult = {
  workingDays: number;
  billableHoursPerYear: number;
  requiredProfitPerYear: number;
  requiredRevenuePerYear: number;
  hourlyRate: number;
};

const WORKDAYS_PER_YEAR = 260; // 52 weeks × 5 days

const limits: Record<HourlyRateField, { min: number; max: number; message: string }> = {
  netMonthlyIncome: {
    min: 1,
    max: 100_000,
    message: "Bitte gib dein Wunsch-Nettoeinkommen pro Monat ein.",
  },
  hoursPerWeek: { min: 1, max: 80, message: "Bitte gib 1 bis 80 Stunden pro Woche ein." },
  nonBillableHoursPerWeek: { min: 0, max: 80, message: "Bitte gib 0 bis 80 Stunden ein." },
  vacationDays: { min: 0, max: 100, message: "Bitte gib 0 bis 100 Urlaubstage ein." },
  publicHolidays: { min: 0, max: 20, message: "Bitte gib 0 bis 20 Feiertage ein." },
  sickDays: { min: 0, max: 100, message: "Bitte gib 0 bis 100 Krankheitstage ein." },
  monthlyExpenses: { min: 0, max: 100_000, message: "Bitte gib einen Betrag ab 0 € ein." },
  monthlyHealthInsurance: { min: 0, max: 10_000, message: "Bitte gib einen Betrag ab 0 € ein." },
  monthlyRetirement: { min: 0, max: 10_000, message: "Bitte gib einen Betrag ab 0 € ein." },
  taxRatePercent: { min: 0, max: 60, message: "Bitte gib 0 bis 60 % ein." },
};

export const hourlyRateFields = Object.keys(limits) as HourlyRateField[];

export type ParsedHourlyRate =
  | { ok: true; input: HourlyRateInput; result: HourlyRateResult }
  | { ok: false; errors: Partial<Record<HourlyRateField, string>> };

/** Parses the form values and calculates the hourly rate, or returns errors per field. */
export function parseAndCalculateHourlyRate(
  values: Record<HourlyRateField, string>,
): ParsedHourlyRate {
  const errors: Partial<Record<HourlyRateField, string>> = {};
  const input = {} as HourlyRateInput;

  for (const field of hourlyRateFields) {
    const value = parseNumber(values[field]);
    const { min, max, message } = limits[field];
    if (Number.isNaN(value) || value < min || value > max) errors[field] = message;
    else input[field] = value;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const result = calculateHourlyRate(input);
  if (typeof result === "string") {
    return { ok: false, errors: { nonBillableHoursPerWeek: result } };
  }
  return { ok: true, input, result };
}

/** The calculation from the TODO. Returns an error message if no hours are billable. */
export function calculateHourlyRate(input: HourlyRateInput): HourlyRateResult | string {
  const workingDays =
    WORKDAYS_PER_YEAR - input.vacationDays - input.publicHolidays - input.sickDays;
  const billableHoursPerDay = (input.hoursPerWeek - input.nonBillableHoursPerWeek) / 5;
  const billableHoursPerYear = workingDays * billableHoursPerDay;

  if (workingDays <= 0 || billableHoursPerDay <= 0) {
    return "Mit diesen Angaben bleiben keine abrechenbaren Stunden übrig.";
  }

  const requiredProfitPerYear =
    ((input.netMonthlyIncome + input.monthlyHealthInsurance + input.monthlyRetirement) * 12) /
    (1 - input.taxRatePercent / 100);
  const requiredRevenuePerYear = requiredProfitPerYear + input.monthlyExpenses * 12;

  return {
    workingDays,
    billableHoursPerYear,
    requiredProfitPerYear,
    requiredRevenuePerYear,
    hourlyRate: requiredRevenuePerYear / billableHoursPerYear,
  };
}

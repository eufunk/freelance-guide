import { parseNumber } from "./numbers";

// Project price calculator (Phase 8): hours × rate × (1 + contingency), net.

export type ProjectPriceField = "hours" | "hourlyRate" | "contingencyPercent";

export type ProjectPriceResult = {
  basePrice: number;
  contingency: number;
  price: number;
};

export type ParsedProjectPrice =
  | { ok: true; result: ProjectPriceResult }
  | { ok: false; errors: Partial<Record<ProjectPriceField, string>> };

const limits: Record<ProjectPriceField, { min: number; max: number; message: string }> = {
  hours: { min: 0.5, max: 10_000, message: "Bitte gib den geschätzten Aufwand in Stunden ein." },
  hourlyRate: { min: 1, max: 10_000, message: "Bitte gib deinen Stundensatz ein." },
  contingencyPercent: { min: 0, max: 100, message: "Bitte gib 0 bis 100 % ein." },
};

export function calculateProjectPrice(
  hours: number,
  hourlyRate: number,
  contingencyPercent: number,
): ProjectPriceResult {
  const basePrice = hours * hourlyRate;
  const contingency = basePrice * (contingencyPercent / 100);
  return { basePrice, contingency, price: basePrice + contingency };
}

export function parseAndCalculateProjectPrice(
  values: Record<ProjectPriceField, string>,
): ParsedProjectPrice {
  const errors: Partial<Record<ProjectPriceField, string>> = {};
  const numbers = {} as Record<ProjectPriceField, number>;
  for (const field of Object.keys(limits) as ProjectPriceField[]) {
    const value = parseNumber(values[field]);
    const { min, max, message } = limits[field];
    if (Number.isNaN(value) || value < min || value > max) errors[field] = message;
    else numbers[field] = value;
  }
  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    result: calculateProjectPrice(numbers.hours, numbers.hourlyRate, numbers.contingencyPercent),
  };
}

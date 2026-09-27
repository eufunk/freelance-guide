import { describe, expect, it } from "vitest";

import type { ProgressByTask, TaskProgress } from "@/lib/progress/roadmap-progress";

import {
  calculateHourlyRate,
  parseAndCalculateHourlyRate,
  type HourlyRateField,
  type HourlyRateInput,
} from "./hourly-rate";
import { parseNumber } from "./numbers";
import { calculateProjectPrice, parseAndCalculateProjectPrice } from "./project-price";
import { readiness } from "./readiness";

describe("parseNumber", () => {
  it.each([
    ["3000", 3000],
    ["3.000", 3000],
    ["3000,50", 3000.5],
    ["3.000,50", 3000.5],
    ["1.234.567", 1234567],
    ["2.5", 2.5],
    [" 20 % ", 20],
    ["600 €", 600],
    ["0", 0],
  ])("reads %s as %d", (input, expected) => {
    expect(parseNumber(input)).toBe(expected);
  });

  it.each(["", "abc", "3,000,00", "1.2.3"])("rejects %j", (input) => {
    expect(parseNumber(input)).toBeNaN();
  });
});

const example: HourlyRateInput = {
  netMonthlyIncome: 3000,
  hoursPerWeek: 40,
  nonBillableHoursPerWeek: 10,
  vacationDays: 30,
  publicHolidays: 10,
  sickDays: 10,
  monthlyExpenses: 200,
  monthlyHealthInsurance: 600,
  monthlyRetirement: 400,
  taxRatePercent: 30,
};

describe("calculateHourlyRate", () => {
  it("follows the formula from the TODO step by step", () => {
    const result = calculateHourlyRate(example);
    if (typeof result === "string") throw new Error(result);

    expect(result.workingDays).toBe(210); // 260 − 30 − 10 − 10
    expect(result.billableHoursPerYear).toBe(1260); // 210 × (40 − 10) / 5
    expect(result.requiredProfitPerYear).toBeCloseTo(68571.43, 2); // 4000 × 12 / 0.7
    expect(result.requiredRevenuePerYear).toBeCloseTo(70971.43, 2); // + 200 × 12
    expect(result.hourlyRate).toBeCloseTo(56.33, 2); // / 1260
  });

  it("needs a higher rate with fewer billable hours", () => {
    const fewer = calculateHourlyRate({ ...example, nonBillableHoursPerWeek: 20 });
    const base = calculateHourlyRate(example);
    if (typeof fewer === "string" || typeof base === "string") throw new Error();

    expect(fewer.hourlyRate).toBeGreaterThan(base.hourlyRate);
  });

  it("refuses when no hours are billable", () => {
    expect(calculateHourlyRate({ ...example, nonBillableHoursPerWeek: 40 })).toBe(
      "Mit diesen Angaben bleiben keine abrechenbaren Stunden übrig.",
    );
    expect(
      // 260 − 200 − 10 − 60 = −10 working days
      calculateHourlyRate({ ...example, vacationDays: 200, sickDays: 60 }),
    ).toBe("Mit diesen Angaben bleiben keine abrechenbaren Stunden übrig.");
  });
});

describe("parseAndCalculateHourlyRate", () => {
  const values = Object.fromEntries(
    Object.entries(example).map(([field, value]) => [field, String(value)]),
  ) as Record<HourlyRateField, string>;

  it("accepts German number formats", () => {
    const parsed = parseAndCalculateHourlyRate({ ...values, netMonthlyIncome: "3.000" });

    expect(parsed.ok && parsed.result.hourlyRate).toBeCloseTo(56.33, 2);
  });

  it("reports errors per field in German", () => {
    const parsed = parseAndCalculateHourlyRate({
      ...values,
      netMonthlyIncome: "",
      taxRatePercent: "80",
    });

    expect(parsed).toEqual({
      ok: false,
      errors: {
        netMonthlyIncome: "Bitte gib dein Wunsch-Nettoeinkommen pro Monat ein.",
        taxRatePercent: "Bitte gib 0 bis 60 % ein.",
      },
    });
  });

  it("shows the no-billable-hours problem at the non-billable hours", () => {
    const parsed = parseAndCalculateHourlyRate({ ...values, nonBillableHoursPerWeek: "40" });

    expect(parsed.ok ? null : parsed.errors.nonBillableHoursPerWeek).toContain(
      "keine abrechenbaren Stunden",
    );
  });
});

describe("calculateProjectPrice", () => {
  it("adds the contingency to hours × rate", () => {
    expect(calculateProjectPrice(40, 57, 20)).toEqual({
      basePrice: 2280,
      contingency: 456,
      price: 2736,
    });
  });

  it("validates the inputs", () => {
    expect(
      parseAndCalculateProjectPrice({ hours: "0", hourlyRate: "57", contingencyPercent: "20" }),
    ).toEqual({
      ok: false,
      errors: { hours: "Bitte gib den geschätzten Aufwand in Stunden ein." },
    });
    expect(
      parseAndCalculateProjectPrice({ hours: "12,5", hourlyRate: "80", contingencyPercent: "0" }),
    ).toEqual({ ok: true, result: { basePrice: 1000, contingency: 0, price: 1000 } });
  });
});

describe("readiness", () => {
  const roadmap = [
    { id: "service", tasks: [{ id: "v1" }, { id: "v2" }] },
    { id: "basics", tasks: [{ id: "b1" }, { id: "b2" }, { id: "contract" }] },
  ];
  const items = [
    { id: "clear-service", stageIds: ["service"], taskIds: [] },
    { id: "business-basics", stageIds: [], taskIds: ["b1", "b2"] },
    { id: "contract-template", stageIds: [], taskIds: ["contract"] },
  ];
  const done: TaskProgress = {
    status: "completed",
    startedAt: null,
    completedAt: "2026-09-27",
    source: "user",
  };
  const progress = (ids: string[]): ProgressByTask => new Map(ids.map((id) => [id, done]));

  it("marks items done when all their stages and tasks are completed", () => {
    const result = readiness(items, roadmap, progress(["v1", "v2", "b1", "contract"]));

    expect(result.items.map((entry) => [entry.item.id, entry.done])).toEqual([
      ["clear-service", true],
      ["business-basics", false],
      ["contract-template", true],
    ]);
    expect(result).toMatchObject({ done: 2, total: 3, percent: 67 });
  });

  it("starts at 0 %", () => {
    expect(readiness(items, roadmap, progress([]))).toMatchObject({ done: 0, percent: 0 });
  });
});

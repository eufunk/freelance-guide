// Default assumptions of the calculators (Phase 8 in guide/ToDo.docx).
// Rough estimates to get beginners started. Users can change every value.
// TO VERIFY before going live, especially insurance and retirement.

export const hourlyRateDefaults = {
  hoursPerWeek: 40,
  nonBillableHoursPerWeek: 10,
  vacationDays: 30,
  publicHolidays: 10,
  sickDays: 10,
  /** Health and long-term care insurance per month. Rough estimate. */
  monthlyHealthInsurance: 600,
  /** Retirement provision per month. Rough estimate. */
  monthlyRetirement: 400,
  /** Flat income tax rate on the profit, in percent. Simplification. */
  taxRatePercent: 30,
};

export const projectPriceDefaults = {
  contingencyPercent: 20,
};

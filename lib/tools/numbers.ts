/**
 * Parses a number typed in German or plain notation: "3000", "3.000", "3000,50",
 * "3.000,50", "2.5". Returns NaN for anything else (including empty input).
 */
export function parseNumber(input: string): number {
  const value = input.trim().replace(/\s|€|%/g, "");
  if (value === "") return Number.NaN;

  // German: dots group thousands, comma is the decimal separator.
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(value)) {
    return Number(value.replace(/\./g, "").replace(",", "."));
  }
  if (/^-?\d+(,\d+)?$/.test(value)) return Number(value.replace(",", "."));
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  return Number.NaN;
}

import { describe, expect, it } from "vitest";

import { formatDate, formatDuration, formatEuro, formatNumber } from "./format";

describe("formatDuration", () => {
  it.each([
    [15, "ca. 15 Min."],
    [45, "ca. 45 Min."],
    [60, "ca. 1 Std."],
    [90, "ca. 1,5 Std."],
    [100, "ca. 1,5 Std."],
    [120, "ca. 2 Std."],
    [480, "ca. 8 Std."],
  ])("formats %i minutes as %s", (minutes, expected) => {
    expect(formatDuration(minutes)).toBe(expected);
  });
});

describe("formatDate", () => {
  it("formats in German, in German time", () => {
    expect(formatDate("2026-09-26T10:00:00Z")).toBe("26.09.2026");
    // 23:30 UTC is already the next day in Germany.
    expect(formatDate("2026-09-26T23:30:00Z")).toBe("27.09.2026");
  });
});

describe("formatEuro", () => {
  it("formats whole euros in German", () => {
    // Intl uses a non-breaking space before the euro sign.
    expect(formatEuro(2736).replace(/\s/g, " ")).toBe("2.736 €");
    expect(formatEuro(56.6).replace(/\s/g, " ")).toBe("57 €");
  });
});

describe("formatNumber", () => {
  it("rounds and groups thousands", () => {
    expect(formatNumber(1260)).toBe("1.260");
    expect(formatNumber(68571.43)).toBe("68.571");
  });
});

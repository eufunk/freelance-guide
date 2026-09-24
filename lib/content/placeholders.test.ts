import { describe, expect, it } from "vitest";

import { findPlaceholders, isPublicSiteUrl, splitPlaceholders } from "./placeholders";

describe("findPlaceholders", () => {
  it("finds placeholders in nested values", () => {
    expect(
      findPlaceholders({
        name: "[[PLATZHALTER: Name]]",
        sections: [{ list: ["fertig", "Hosting: [[PLATZHALTER: Anbieter ]]"] }],
        draft: true,
      }),
    ).toEqual(["Name", "Anbieter"]);
  });

  it("returns nothing for filled texts", () => {
    expect(findPlaceholders({ name: "Anna Muster", count: 3 })).toEqual([]);
  });
});

describe("splitPlaceholders", () => {
  it("separates placeholders from plain text", () => {
    expect(splitPlaceholders("Nach [[PLATZHALTER: Anzahl]] Tagen.")).toEqual([
      { text: "Nach ", placeholder: false },
      { text: "Anzahl", placeholder: true },
      { text: " Tagen.", placeholder: false },
    ]);
  });

  it("keeps text without placeholders as one segment", () => {
    expect(splitPlaceholders("Hallo")).toEqual([{ text: "Hallo", placeholder: false }]);
  });
});

describe("isPublicSiteUrl", () => {
  it.each(["http://localhost:3200", "http://127.0.0.1:3200", "http://[::1]:3200"])(
    "treats %s as local",
    (url) => {
      expect(isPublicSiteUrl(url)).toBe(false);
    },
  );

  it("treats a real domain as public", () => {
    expect(isPublicSiteUrl("https://freelance-guide.de")).toBe(true);
  });

  it("treats a missing or invalid URL as local", () => {
    expect(isPublicSiteUrl(undefined)).toBe(false);
    expect(isPublicSiteUrl("kein-url")).toBe(false);
  });
});

import { describe, expect, it } from "vitest";

import { isActivePath, mainNavigation } from "./navigation";

describe("isActivePath", () => {
  it("matches the page itself", () => {
    expect(isActivePath("/roadmap", "/roadmap")).toBe(true);
  });

  it("matches subpages", () => {
    expect(isActivePath("/roadmap/portfolio", "/roadmap")).toBe(true);
  });

  it("does not match pages that only share a prefix", () => {
    expect(isActivePath("/roadmapping", "/roadmap")).toBe(false);
  });

  it("does not match other pages", () => {
    expect(isActivePath("/", "/dashboard")).toBe(false);
  });
});

describe("mainNavigation", () => {
  it("has at most 5 entries so it fits the mobile bottom bar", () => {
    expect(mainNavigation.length).toBeLessThanOrEqual(5);
  });
});

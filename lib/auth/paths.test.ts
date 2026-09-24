import { describe, expect, it } from "vitest";

import { isLoggedOutOnlyPath, isProtectedPath, loginPathFor, safeNextPath } from "./paths";

describe("isProtectedPath", () => {
  it.each([
    "/dashboard",
    "/roadmap",
    "/roadmap/build-portfolio",
    "/profil",
    "/onboarding",
    "/passwort-neu",
  ])("protects %s", (path) => {
    expect(isProtectedPath(path)).toBe(true);
  });

  it.each([
    "/",
    "/tools",
    "/wissen",
    "/wissen/grundlagen",
    "/anmelden",
    "/impressum",
    "/dashboards",
  ])("does not protect %s", (path) => {
    expect(isProtectedPath(path)).toBe(false);
  });
});

describe("isLoggedOutOnlyPath", () => {
  it("matches login and registration", () => {
    expect(isLoggedOutOnlyPath("/anmelden")).toBe(true);
    expect(isLoggedOutOnlyPath("/registrieren")).toBe(true);
    expect(isLoggedOutOnlyPath("/passwort-vergessen")).toBe(false);
  });
});

describe("safeNextPath", () => {
  it("keeps paths inside the app", () => {
    expect(safeNextPath("/roadmap")).toBe("/roadmap");
    expect(safeNextPath("/roadmap?stage=pricing")).toBe("/roadmap?stage=pricing");
  });

  it.each([
    ["an absolute URL", "https://evil.example"],
    ["a protocol-relative URL", "//evil.example"],
    ["a backslash trick", String.raw`/\evil.example`],
    ["a relative path", "dashboard"],
    ["a control character", "/\nevil"],
    ["an empty string", ""],
  ])("rejects %s", (_, next) => {
    expect(safeNextPath(next)).toBe("/dashboard");
  });

  it("uses the fallback for missing values", () => {
    expect(safeNextPath(null)).toBe("/dashboard");
    expect(safeNextPath(undefined, "/profil")).toBe("/profil");
  });
});

describe("loginPathFor", () => {
  it("encodes the return path", () => {
    expect(loginPathFor("/roadmap?x=1")).toBe("/anmelden?next=%2Froadmap%3Fx%3D1");
  });
});

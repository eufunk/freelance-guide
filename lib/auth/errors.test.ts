import { describe, expect, it } from "vitest";

import { GENERIC_AUTH_ERROR, authErrorMessage } from "./errors";

describe("authErrorMessage", () => {
  it("translates known codes", () => {
    expect(authErrorMessage("invalid_credentials")).toBe(
      "E-Mail-Adresse oder Passwort ist falsch.",
    );
  });

  it("falls back to a generic message for unknown or missing codes", () => {
    expect(authErrorMessage("something_new")).toBe(GENERIC_AUTH_ERROR);
    expect(authErrorMessage(undefined)).toBe(GENERIC_AUTH_ERROR);
  });

  it("does not treat inherited object keys as codes", () => {
    expect(authErrorMessage("toString")).toBe(GENERIC_AUTH_ERROR);
  });
});

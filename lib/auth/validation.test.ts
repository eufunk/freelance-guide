import { describe, expect, it } from "vitest";

import {
  changePasswordSchema,
  deleteAccountSchema,
  fieldErrorsOf,
  newPasswordSchema,
  signInSchema,
  signUpSchema,
} from "./validation";

function errorsFor(result: ReturnType<typeof signUpSchema.safeParse>) {
  return result.success ? {} : fieldErrorsOf(result.error);
}

describe("signUpSchema", () => {
  it("accepts a valid email and password and trims the email", () => {
    const result = signUpSchema.safeParse({ email: " anna@example.de ", password: "geheim123" });

    expect(result.success && result.data.email).toBe("anna@example.de");
  });

  it("rejects an invalid email in German", () => {
    expect(errorsFor(signUpSchema.safeParse({ email: "anna", password: "geheim123" }))).toEqual({
      email: ["Bitte gib eine gültige E-Mail-Adresse ein."],
    });
  });

  it("asks for a missing email", () => {
    expect(errorsFor(signUpSchema.safeParse({ email: "", password: "geheim123" })).email).toEqual([
      "Bitte gib deine E-Mail-Adresse ein.",
    ]);
  });

  it.each([
    ["too short", "abc123", "mindestens 8 Zeichen"],
    ["without digits", "nurbuchstaben", "mindestens eine Zahl"],
    ["without letters", "12345678", "mindestens einen Buchstaben"],
    ["too long", `a1${"x".repeat(71)}`, "höchstens 72 Zeichen"],
  ])("rejects a password %s", (_, password, message) => {
    const errors = errorsFor(signUpSchema.safeParse({ email: "a@b.de", password }));

    expect(errors.password?.join(" ")).toContain(message);
  });

  it("accepts letters with umlauts", () => {
    expect(signUpSchema.safeParse({ email: "a@b.de", password: "müßiggang1" }).success).toBe(true);
  });
});

describe("signInSchema", () => {
  it("does not apply the new-password rules to existing passwords", () => {
    expect(signInSchema.safeParse({ email: "a@b.de", password: "x" }).success).toBe(true);
  });
});

describe("newPasswordSchema", () => {
  it("requires both passwords to match", () => {
    const result = newPasswordSchema.safeParse({
      password: "geheim123",
      passwordConfirmation: "geheim124",
    });

    expect(result.success ? {} : fieldErrorsOf(result.error)).toEqual({
      passwordConfirmation: ["Die Passwörter stimmen nicht überein."],
    });
  });
});

describe("changePasswordSchema", () => {
  it("requires the current password and a valid, confirmed new password", () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: "",
      password: "kurz",
      passwordConfirmation: "anders",
    });
    const errors = result.success ? {} : fieldErrorsOf(result.error);

    expect(errors.currentPassword).toEqual(["Bitte gib dein aktuelles Passwort ein."]);
    expect(errors.password?.join(" ")).toContain("mindestens 8 Zeichen");
  });

  it("accepts a valid change", () => {
    expect(
      changePasswordSchema.safeParse({
        currentPassword: "alt",
        password: "neuesPasswort1",
        passwordConfirmation: "neuesPasswort1",
      }).success,
    ).toBe(true);
  });
});

describe("deleteAccountSchema", () => {
  it("requires the current password", () => {
    const result = deleteAccountSchema.safeParse({ currentPassword: "" });

    expect(result.success ? {} : fieldErrorsOf(result.error)).toEqual({
      currentPassword: ["Bitte gib dein aktuelles Passwort ein."],
    });
  });
});

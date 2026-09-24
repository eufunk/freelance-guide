import { expect, type Page } from "@playwright/test";

import { confirmPathFrom, waitForEmail } from "./mailpit";

// Shared steps for tests that need a user. Require the local database
// (npm run db:start).

export const PASSWORD = "geheim123";

export function uniqueEmail() {
  return `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`;
}

export async function register(page: Page, email: string, password = PASSWORD) {
  await page.goto("/registrieren");
  await page.getByLabel("E-Mail-Adresse").fill(email);
  await page.getByLabel("Passwort").fill(password);
  await page.getByRole("button", { name: "Konto erstellen" }).click();
  await expect(page.getByRole("status")).toContainText("Wir haben dir eine E-Mail");
}

export async function confirmEmail(page: Page, email: string) {
  const html = await waitForEmail(email, "Bitte bestätige deine E-Mail-Adresse");
  await page.goto(confirmPathFrom(html));
}

/** Registers and confirms a new user, who is then logged in. */
export async function createLoggedInUser(page: Page) {
  const email = uniqueEmail();
  await register(page, email);
  await confirmEmail(page, email);
  await expect(page).toHaveURL("/dashboard");
  return email;
}

export async function logIn(page: Page, email: string, password = PASSWORD) {
  await page.getByLabel("E-Mail-Adresse").fill(email);
  await page.getByLabel("Passwort", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Anmelden", exact: true }).click();
}

export async function logOut(page: Page) {
  await page.goto("/profil");
  await page.getByRole("button", { name: "Abmelden" }).click();
  await expect(page).toHaveURL("/");
}

/** Our form message. Next.js also renders an (empty) route announcer with role="alert". */
export function formAlert(page: Page, text: string) {
  return page.getByRole("alert").filter({ hasText: text });
}

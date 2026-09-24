import { expect, test } from "@playwright/test";

import { createLoggedInUser, formAlert, logIn, logOut, PASSWORD } from "./helpers/auth";

// Account settings on the profile page (Phase 4).

test("change the password with the current password", async ({ page }) => {
  const email = await createLoggedInUser(page);
  await page.goto("/profil");

  const form = page.locator("form").filter({ hasText: "Aktuelles Passwort" });
  await form.getByLabel("Aktuelles Passwort").fill("falsch123");
  await form.getByLabel("Neues Passwort", { exact: true }).fill("neuesPasswort1");
  await form.getByLabel("Neues Passwort wiederholen").fill("neuesPasswort1");
  await form.getByRole("button", { name: "Passwort ändern" }).click();
  await expect(form.getByText("Das aktuelle Passwort ist falsch.")).toBeVisible();

  await form.getByLabel("Aktuelles Passwort").fill(PASSWORD);
  await form.getByLabel("Neues Passwort", { exact: true }).fill("neuesPasswort1");
  await form.getByLabel("Neues Passwort wiederholen").fill("neuesPasswort1");
  await form.getByRole("button", { name: "Passwort ändern" }).click();
  await expect(form.getByRole("status")).toHaveText("Dein Passwort wurde geändert.");

  await logOut(page);
  await page.goto("/anmelden");
  await logIn(page, email, "neuesPasswort1");
  await expect(page).toHaveURL("/dashboard");
});

test("delete the account with the current password", async ({ page }) => {
  const email = await createLoggedInUser(page);
  await page.goto("/profil");

  const form = page.locator("form").filter({ hasText: "Zur Bestätigung" });
  await form.getByLabel("Zur Bestätigung: dein Passwort").fill("falsch123");
  await form.getByRole("button", { name: "Konto endgültig löschen" }).click();
  await expect(form.getByText("Das aktuelle Passwort ist falsch.")).toBeVisible();

  await form.getByLabel("Zur Bestätigung: dein Passwort").fill(PASSWORD);
  await form.getByRole("button", { name: "Konto endgültig löschen" }).click();
  await expect(page).toHaveURL("/konto-geloescht");

  // Logged out, and the account no longer exists.
  await page.goto("/dashboard");
  await expect(page).toHaveURL("/anmelden?next=%2Fdashboard");
  await logIn(page, email);
  await expect(formAlert(page, "E-Mail-Adresse oder Passwort ist falsch.")).toBeVisible();
});

test("the profile page links to re-running the onboarding", async ({ page }) => {
  await createLoggedInUser(page);
  await page.goto("/profil");

  await page.getByRole("link", { name: "Angaben ändern" }).click();
  await expect(page).toHaveURL("/onboarding");
});

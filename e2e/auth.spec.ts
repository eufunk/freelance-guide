import { expect, test } from "@playwright/test";

import {
  confirmEmail,
  formAlert,
  logIn,
  logOut,
  NEW_USER_START,
  register,
  uniqueEmail,
} from "./helpers/auth";
import { confirmPathFrom, waitForEmail } from "./helpers/mailpit";

// Full authentication flows against the local Supabase stack (npm run db:start).
// Users here skip the onboarding, so after login they land on NEW_USER_START.

test("protected pages send logged-out visitors to the login page", async ({ page }) => {
  await page.goto("/roadmap");

  await expect(page).toHaveURL("/anmelden?next=%2Froadmap");
  await expect(page.getByRole("heading", { name: "Anmelden" })).toBeVisible();
});

test("registration shows German validation errors", async ({ page }) => {
  await page.goto("/registrieren");
  await page.getByLabel("E-Mail-Adresse").fill("keine-adresse");
  await page.getByLabel("Passwort").fill("kurz");
  await page.getByRole("button", { name: "Konto erstellen" }).click();

  await expect(page.getByText("Bitte gib eine gültige E-Mail-Adresse ein.")).toBeVisible();
  await expect(page.getByText("mindestens 8 Zeichen lang")).toBeVisible();
  await expect(page.getByLabel("E-Mail-Adresse")).toHaveValue("keine-adresse");
});

test("register, confirm, log out and log in again", async ({ page }) => {
  const email = uniqueEmail();

  await register(page, email);
  await confirmEmail(page, email);

  // The confirmation link logs the user in; new users start with the onboarding.
  await expect(page).toHaveURL(NEW_USER_START);
  await expect(
    page.getByRole("heading", { name: "Willkommen beim Freelance Guide" }),
  ).toBeVisible();

  // Logged-in users don't see the login page.
  await page.goto("/anmelden");
  await expect(page).toHaveURL(NEW_USER_START);

  await page.goto("/profil");
  await expect(page.getByText(email)).toBeVisible();
  await logOut(page);

  // Log in again, returning to the page that was requested.
  await page.goto("/roadmap");
  await logIn(page, email, "falsch123");
  await expect(formAlert(page, "E-Mail-Adresse oder Passwort ist falsch.")).toBeVisible();

  await logIn(page, email);
  await expect(page).toHaveURL("/roadmap");
});

test("login is refused until the email address is confirmed", async ({ page }) => {
  const email = uniqueEmail();
  await register(page, email);

  await page.goto("/anmelden");
  await logIn(page, email);

  await expect(formAlert(page, "Bitte bestätige zuerst deine E-Mail-Adresse")).toBeVisible();
});

test("reset a forgotten password", async ({ page }) => {
  const email = uniqueEmail();
  await register(page, email);
  await confirmEmail(page, email);
  await logOut(page);

  await page.goto("/anmelden");
  await page.getByRole("link", { name: "Passwort vergessen?" }).click();
  await expect(page.getByRole("heading", { name: "Passwort vergessen" })).toBeVisible();
  await page.getByLabel("E-Mail-Adresse").fill(email);
  await page.getByRole("button", { name: "Link senden" }).click();
  await expect(page.getByRole("status")).toContainText("einen Link zum Zurücksetzen geschickt");

  const html = await waitForEmail(email, "Passwort zurücksetzen");
  await page.goto(confirmPathFrom(html));
  await expect(page).toHaveURL("/passwort-neu");

  await page.getByLabel("Neues Passwort", { exact: true }).fill("neuesPasswort1");
  await page.getByLabel("Neues Passwort wiederholen").fill("anderesPasswort1");
  await page.getByRole("button", { name: "Passwort speichern" }).click();
  await expect(page.getByText("Die Passwörter stimmen nicht überein.")).toBeVisible();

  await page.getByLabel("Neues Passwort", { exact: true }).fill("neuesPasswort1");
  await page.getByLabel("Neues Passwort wiederholen").fill("neuesPasswort1");
  await page.getByRole("button", { name: "Passwort speichern" }).click();
  await expect(page).toHaveURL(NEW_USER_START);

  await logOut(page);
  await page.goto("/anmelden");
  await logIn(page, email, "neuesPasswort1");
  await expect(page).toHaveURL(NEW_USER_START);
});

test("an invalid email link shows a helpful message", async ({ page }) => {
  await page.goto("/auth/confirm?token_hash=ungueltig&type=email");

  await expect(page).toHaveURL("/anmelden?fehler=link");
  await expect(formAlert(page, "Der Link ist ungültig oder abgelaufen")).toBeVisible();
});

test("the next parameter cannot redirect to other sites", async ({ page }) => {
  const email = uniqueEmail();
  await register(page, email);
  await confirmEmail(page, email);
  await logOut(page);

  await page.goto("/anmelden?next=https://evil.example");
  await logIn(page, email);

  await expect(page).toHaveURL(NEW_USER_START);
});

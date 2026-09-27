import { expect, test, type Page } from "@playwright/test";

import { createLoggedInUser } from "./helpers/auth";
import { completeOnboarding, defaultAnswers } from "./helpers/onboarding";

// Tools (Phase 8). With the default assumptions, 3.000 € net and 200 € expenses
// give 56,33 € per hour, shown rounded up as 57 €.

const resultOf = (page: Page) => page.getByRole("region", { name: "Dein Mindest-Stundensatz" });
const priceOf = (page: Page) => page.getByRole("region", { name: "Geschätzter Projektpreis" });

// Intl formats euros with a non-breaking space.
const euro = (amount: string) => new RegExp(`${amount.replace(".", "\\.")}\\s€`);

async function fillHourlyRate(page: Page, net: string, expenses: string) {
  await page.getByLabel("Wie viel möchtest du im Monat netto verdienen?").fill(net);
  await page.getByLabel("Betriebskosten").fill(expenses);
}

test("the tools page links to all tools", async ({ page }) => {
  await page.goto("/tools");

  await page.getByRole("link", { name: /Stundensatz-Rechner/ }).click();
  await expect(page).toHaveURL("/tools/stundensatz");
});

test("the hourly rate calculator works without an account", async ({ page }) => {
  await page.goto("/tools/stundensatz");
  await expect(resultOf(page)).toContainText("Gib dein Wunsch-Nettoeinkommen");

  await fillHourlyRate(page, "3.000", "200");

  await expect(resultOf(page)).toContainText(euro("57"));
  await expect(resultOf(page)).toContainText("1.260");
  await expect(page.getByText("Das ist eine Schätzung")).toBeVisible();
  await expect(page.getByRole("link", { name: "Melde dich an" })).toBeVisible();
});

test("the calculator explains wrong assumptions", async ({ page }) => {
  await page.goto("/tools/stundensatz");
  await fillHourlyRate(page, "3000", "200");

  await page.getByText("Weitere Annahmen anpassen").click();
  await page.getByLabel("Davon nicht abrechenbar").fill("40");

  await expect(page.getByText("keine abrechenbaren Stunden")).toBeVisible();
  await expect(resultOf(page)).not.toContainText("€");
});

test("the hourly rate leads to the project price", async ({ page }) => {
  await page.goto("/tools/stundensatz");
  await fillHourlyRate(page, "3000", "200");
  await page.getByRole("link", { name: "Damit einen Projektpreis berechnen" }).click();

  await expect(page).toHaveURL("/tools/projektpreis?stundensatz=57");
  await expect(page.getByLabel("Dein Stundensatz")).toHaveValue("57");

  // 40 h × 57 € = 2.280 €, plus 20 % buffer = 2.736 €
  await page.getByLabel("Geschätzter Aufwand").fill("40");
  await expect(priceOf(page)).toContainText(euro("2.736"));
  await expect(priceOf(page)).toContainText(euro("2.280"));
});

test("a saved hourly rate is kept and used for the project price", async ({ page }) => {
  await createLoggedInUser(page);
  await page.goto("/tools/stundensatz");
  await fillHourlyRate(page, "4000", "300");
  await page.getByRole("button", { name: "Ergebnis speichern" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Gespeichert" })).toBeVisible();

  await page.goto("/tools/stundensatz");
  await expect(page.getByLabel("Wie viel möchtest du im Monat netto verdienen?")).toHaveValue(
    "4.000",
  );

  await page.goto("/tools/projektpreis");
  await expect(page.getByLabel("Dein Stundensatz")).not.toHaveValue("");
});

test("the readiness check needs a login", async ({ page }) => {
  await page.goto("/tools/startklar");

  await expect(page.getByText("Melde dich an, um ihn zu sehen.")).toBeVisible();
});

test("the readiness check follows the roadmap", async ({ page }) => {
  await createLoggedInUser(page, { onboarded: false });
  // First client + portfolio: stages 1–4 are done, which covers "service" and "portfolio".
  await completeOnboarding(page, {
    ...defaultAnswers,
    hasPortfolio: true,
    goal: /Ich suche meinen ersten Kunden/,
  });

  await page.goto("/tools/startklar");
  await expect(page.getByText("25 % startklar")).toBeVisible();
  await expect(page.getByRole("link", { name: /Klare Dienstleistung/ })).toContainText("Erledigt");
  await expect(page.getByRole("link", { name: /^Preise/ })).toContainText("Offen");

  await page.getByRole("link", { name: /^Vertragsvorlage/ }).click();
  await expect(page).toHaveURL("/roadmap/business-basics");
});

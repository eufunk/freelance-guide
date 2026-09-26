import { expect, test } from "@playwright/test";

import { createLoggedInUser, NEW_USER_START } from "./helpers/auth";
import { answerOnboarding, completeOnboarding, defaultAnswers } from "./helpers/onboarding";

// Onboarding and the personal starting point (Phase 5).

test("new users are asked the onboarding questions first", async ({ page }) => {
  await createLoggedInUser(page, { onboarded: false });

  await page.goto("/dashboard");
  await expect(page).toHaveURL(NEW_USER_START);
  await expect(page.getByText("Schritt 1 von 5")).toBeVisible();
});

test("each step is checked before going on", async ({ page }) => {
  await createLoggedInUser(page, { onboarded: false });

  await page.getByRole("button", { name: "Weiter" }).click();

  await expect(page.getByText("Bitte gib deinen Namen ein.")).toBeVisible();
  await expect(page.getByText("Bitte wähle ein Land.")).toBeVisible();
  await expect(page.getByText("Schritt 1 von 5")).toBeVisible();
});

test("a beginner starts at the first stage", async ({ page }) => {
  await createLoggedInUser(page, { onboarded: false });
  await answerOnboarding(page);

  await expect(page.getByText("Du startest ganz am Anfang der Roadmap")).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Stufe 1: Skills definieren");

  await page.getByRole("button", { name: "Los geht's" }).click();
  await expect(page).toHaveURL("/dashboard");
  await expect(page.getByRole("heading", { name: "Hallo Anna" })).toBeVisible();
});

test("answers propose stages as done, and the user can adjust them", async ({ page }) => {
  await createLoggedInUser(page, { onboarded: false });
  await answerOnboarding(page, {
    ...defaultAnswers,
    hasPortfolio: true,
    goal: /Ich suche meinen ersten Kunden/,
  });

  // Goal "first client" proposes stages 1–3, the portfolio adds stage 4.
  const proposed = page.getByRole("checkbox");
  await expect(proposed).toHaveCount(4);
  await expect(page.getByRole("checkbox", { name: "Stufe 4: Portfolio aufbauen" })).toBeChecked();
  await expect(page.getByRole("status")).toContainText("Stufe 5: Preise festlegen");

  // Not done yet: the target customer. The start moves back to stage 3.
  await page.getByRole("checkbox", { name: "Stufe 3: Zielkunden bestimmen" }).uncheck();
  await expect(page.getByRole("status")).toContainText("Stufe 3: Zielkunden bestimmen");

  await page.getByRole("button", { name: "Los geht's" }).click();
  await expect(page).toHaveURL("/dashboard");
});

test("going back keeps the answers", async ({ page }) => {
  await createLoggedInUser(page, { onboarded: false });
  await answerOnboarding(page);

  for (let i = 0; i < 4; i++) await page.getByRole("button", { name: "Zurück" }).click();

  await expect(page.getByLabel("Wie heißt du?")).toHaveValue("Anna");
  await expect(page.getByRole("radio", { name: "Deutschland" })).toBeChecked();
});

test("a country other than Germany shows a hint", async ({ page }) => {
  await createLoggedInUser(page, { onboarded: false });

  await page.getByRole("radio", { name: "Österreich" }).check();

  await expect(page.getByText("beziehen sich auf Deutschland")).toBeVisible();
});

test("the answers can be changed later from the profile", async ({ page }) => {
  await createLoggedInUser(page);

  await page.goto("/profil");
  await page.getByRole("link", { name: "Angaben ändern" }).click();

  await expect(page.getByRole("heading", { level: 1, name: "Angaben ändern" })).toBeVisible();
  await expect(page.getByLabel("Wie heißt du?")).toHaveValue("Anna");

  await completeOnboarding(page, { ...defaultAnswers, name: "Anna Muster" });
  await expect(page.getByRole("heading", { name: "Hallo Anna Muster" })).toBeVisible();
});

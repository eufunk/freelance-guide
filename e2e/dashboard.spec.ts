import { expect, test, type Page } from "@playwright/test";

import { createLoggedInUser } from "./helpers/auth";
import { completeOnboarding, defaultAnswers } from "./helpers/onboarding";

// Dashboard (Phase 7): "What should I do next?"

function primaryAction(page: Page) {
  return page.getByRole("link", { name: /^Weiter: / });
}

async function completeTask(page: Page, stageId: string, title: string) {
  await page.goto(`/roadmap/${stageId}`);
  await page.getByRole("button", { name: `Erledigt: ${title}` }).click();
  await expect(page.getByRole("button", { name: `Wieder öffnen: ${title}` })).toBeVisible();
}

test("a beginner is sent to the very first task", async ({ page }) => {
  await createLoggedInUser(page);

  await expect(page.getByRole("heading", { level: 1, name: "Hallo Anna" })).toBeVisible();
  await expect(page.getByText("Deine nächste Aufgabe · Stufe 1: Skills definieren")).toBeVisible();
  await expect(primaryAction(page)).toHaveText("Weiter: Deine Skills auflisten");
  await expect(page.getByText("0 % geschafft")).toBeVisible();

  // "Danach" shows the task after the next one.
  await expect(page.getByRole("link", { name: /Skills nach Erfahrung bewerten/ })).toBeVisible();

  await primaryAction(page).click();
  await expect(page).toHaveURL("/roadmap/define-skills#aufgabe-list-skills");
  await expect(page.locator("#aufgabe-list-skills")).toBeInViewport();
});

test("completed tasks move the dashboard on", async ({ page }) => {
  await createLoggedInUser(page);

  await completeTask(page, "define-skills", "Deine Skills auflisten");
  await page.goto("/dashboard");

  await expect(primaryAction(page)).toHaveText("Weiter: Skills nach Erfahrung bewerten");
  await expect(page.getByText("2 % geschafft")).toBeVisible();
  const recent = page.getByRole("region", { name: "Zuletzt erledigt" });
  await expect(recent).toContainText("Deine Skills auflisten");
});

test("a task in progress comes first", async ({ page }) => {
  await createLoggedInUser(page);

  await page.goto("/roadmap/find-clients");
  await page
    .getByRole("button", { name: "Starten: Dein persönliches Netzwerk durchgehen" })
    .click();
  await expect(page.getByText("In Arbeit")).toBeVisible();
  await page.goto("/dashboard");

  await expect(page.getByText(/^Du arbeitest gerade an · Stufe 8/)).toBeVisible();
  await expect(primaryAction(page)).toHaveText("Weiter: Dein persönliches Netzwerk durchgehen");
  await expect(page.getByText("Aktuelle Stufe: 1. Skills definieren")).toBeVisible();
});

test("tasks from the onboarding are not listed as recently completed", async ({ page }) => {
  await createLoggedInUser(page, { onboarded: false });
  await completeOnboarding(page, { ...defaultAnswers, goal: /Ich suche meinen ersten Kunden/ });

  await expect(page.getByText("19 % geschafft")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Zuletzt erledigt" })).toHaveCount(0);
});

test("the tools of the current stage are offered", async ({ page }) => {
  await createLoggedInUser(page, { onboarded: false });
  // First client + portfolio: stages 1–4 are done, the current stage is "Preise festlegen".
  await completeOnboarding(page, {
    ...defaultAnswers,
    hasPortfolio: true,
    goal: /Ich suche meinen ersten Kunden/,
  });

  await expect(page.getByText("Aktuelle Stufe: 5. Preise festlegen")).toBeVisible();
  const related = page.getByRole("region", { name: "Passend zu deiner Stufe" });
  await expect(related.getByRole("heading", { name: "Stundensatz-Rechner" })).toBeVisible();
  await expect(related.getByRole("heading", { name: "Projektpreis-Rechner" })).toBeVisible();
});

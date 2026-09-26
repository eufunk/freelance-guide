import { expect, test, type Page } from "@playwright/test";

import { createLoggedInUser } from "./helpers/auth";
import { completeOnboarding, defaultAnswers } from "./helpers/onboarding";

// Roadmap and task system (Phase 6). The roadmap has 15 stages and 48 tasks;
// stage 1 "Skills definieren" has 3 tasks.

function taskCard(page: Page, title: string) {
  return page
    .getByRole("listitem")
    .filter({ has: page.getByRole("heading", { name: title, exact: true }) });
}

function currentStageLink(page: Page) {
  return page.locator('a[aria-current="step"]');
}

test("a beginner sees all stages and starts at the first", async ({ page }) => {
  await createLoggedInUser(page);
  await page.goto("/roadmap");

  await expect(page.getByText("0 % geschafft")).toBeVisible();
  await expect(page.getByText("0 von 48 Aufgaben erledigt")).toBeVisible();
  await expect(page.getByRole("main").getByRole("list").getByRole("listitem")).toHaveCount(15);
  await expect(currentStageLink(page)).toContainText("Skills definieren");
  await expect(currentStageLink(page)).toContainText("Aktuell");
});

test("start, complete and reopen a task", async ({ page }) => {
  await createLoggedInUser(page);
  await page.goto("/roadmap");
  await currentStageLink(page).click();
  await expect(page.getByRole("heading", { level: 1, name: "Skills definieren" })).toBeVisible();

  const task = taskCard(page, "Deine Skills auflisten");
  await expect(task).toContainText("Offen");

  await task.getByRole("button", { name: "Starten: Deine Skills auflisten" }).click();
  await expect(task).toContainText("In Arbeit");
  await expect(task.getByRole("button", { name: /^Starten/ })).toHaveCount(0);

  await task.getByRole("button", { name: "Erledigt: Deine Skills auflisten" }).click();
  await expect(task).toContainText(/Erledigt am \d{2}\.\d{2}\.\d{4}/);
  await expect(page.getByText("1 von 3 erledigt")).toBeVisible();

  await task.getByRole("button", { name: "Wieder öffnen: Deine Skills auflisten" }).click();
  await expect(task).toContainText("Offen");
  await expect(page.getByText("0 von 3 erledigt")).toBeVisible();
});

test("completing all tasks of a stage moves on to the next stage", async ({ page }) => {
  await createLoggedInUser(page);
  await page.goto("/roadmap/define-skills");

  for (const title of [
    "Deine Skills auflisten",
    "Skills nach Erfahrung bewerten",
    "Deine 2–3 Kernskills auswählen",
  ]) {
    await taskCard(page, title)
      .getByRole("button", { name: `Erledigt: ${title}` })
      .click();
    await expect(taskCard(page, title)).toContainText("Erledigt am");
  }

  await expect(page.getByRole("status")).toContainText("Stufe erledigt");
  await page.getByRole("link", { name: "Weiter mit Stufe 2: Dienstleistung festlegen" }).click();
  await expect(page).toHaveURL("/roadmap/choose-service");

  await page.goto("/roadmap");
  await expect(page.getByText("6 % geschafft")).toBeVisible();
  await expect(page.getByText("3 von 48 Aufgaben erledigt")).toBeVisible();
  await expect(currentStageLink(page)).toContainText("Dienstleistung festlegen");
});

test("stages marked in the onboarding show as done and can be reopened", async ({ page }) => {
  await createLoggedInUser(page, { onboarded: false });
  await completeOnboarding(page, { ...defaultAnswers, goal: /Ich suche meinen ersten Kunden/ });

  await page.goto("/roadmap");
  await expect(page.getByText("9 von 48 Aufgaben erledigt")).toBeVisible();
  await expect(currentStageLink(page)).toContainText("Portfolio aufbauen");

  // Something from stage 1 isn't done after all.
  await page.goto("/roadmap/define-skills");
  await taskCard(page, "Deine Skills auflisten")
    .getByRole("button", { name: "Wieder öffnen: Deine Skills auflisten" })
    .click();
  await expect(taskCard(page, "Deine Skills auflisten")).toContainText("Offen");

  await page.goto("/roadmap");
  await expect(currentStageLink(page)).toContainText("Skills definieren");
});

test("a stage lists its related tools", async ({ page }) => {
  await createLoggedInUser(page);
  await page.goto("/roadmap/define-pricing");

  await expect(page.getByRole("heading", { name: "Passende Tools" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Stundensatz-Rechner" })).toBeVisible();
});

test("an unknown stage shows a helpful page", async ({ page }) => {
  await createLoggedInUser(page);
  const response = await page.goto("/roadmap/gibt-es-nicht");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Stufe nicht gefunden" })).toBeVisible();
});

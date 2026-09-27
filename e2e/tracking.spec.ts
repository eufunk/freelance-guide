import { expect, test, type Page } from "@playwright/test";

import { createLoggedInUser } from "./helpers/auth";
import { eventsOf } from "./helpers/events";

// Product metric events (Phase 11): recorded for logged-in users only.

test.use({ permissions: ["clipboard-read", "clipboard-write"] });

async function names(email: string) {
  return (await eventsOf(email)).map((event) => event.name);
}

async function clickTaskAction(page: Page, label: string, title: string, next: string) {
  await page.getByRole("button", { name: `${label}: ${title}` }).click();
  await expect(page.getByRole("button", { name: `${next}: ${title}` })).toBeVisible();
}

test("onboarding, tasks and a completed stage are recorded", async ({ page }) => {
  const email = await createLoggedInUser(page);
  await expect
    .poll(() => eventsOf(email))
    .toEqual([{ name: "onboarding_completed", properties: { repeat: false } }]);

  await page.goto("/roadmap/define-skills");
  await clickTaskAction(page, "Starten", "Deine Skills auflisten", "Erledigt");
  await clickTaskAction(page, "Erledigt", "Deine Skills auflisten", "Wieder öffnen");
  await clickTaskAction(page, "Erledigt", "Skills nach Erfahrung bewerten", "Wieder öffnen");
  await expect.poll(() => names(email)).not.toContain("stage_completed");

  await clickTaskAction(page, "Erledigt", "Deine 2–3 Kernskills auswählen", "Wieder öffnen");

  await expect
    .poll(() => eventsOf(email))
    .toEqual([
      { name: "onboarding_completed", properties: { repeat: false } },
      { name: "task_started", properties: { taskId: "list-skills", stageId: "define-skills" } },
      { name: "task_completed", properties: { taskId: "list-skills", stageId: "define-skills" } },
      { name: "task_completed", properties: { taskId: "rate-skills", stageId: "define-skills" } },
      {
        name: "task_completed",
        properties: { taskId: "pick-core-skills", stageId: "define-skills" },
      },
      { name: "stage_completed", properties: { stageId: "define-skills" } },
    ]);

  // Reopening records nothing.
  await clickTaskAction(page, "Wieder öffnen", "Deine Skills auflisten", "Erledigt");
  await expect.poll(async () => (await names(email)).length).toBe(6);
});

test("calculator use and template copies are recorded without user input", async ({ page }) => {
  const email = await createLoggedInUser(page);

  await page.goto("/tools/stundensatz");
  await page.getByLabel("Wie viel möchtest du im Monat netto verdienen?").fill("3000");
  await page.getByLabel("Betriebskosten").fill("200");
  await page.getByLabel("Betriebskosten").fill("250");

  await page.goto("/wissen/vorlagen/follow-up-message");
  await page.getByRole("button", { name: "Text kopieren" }).click();
  await expect(page.getByRole("button", { name: "Kopiert" })).toBeVisible();

  // Once per page view, and only IDs – no amounts, no template text.
  await expect
    .poll(async () => (await eventsOf(email)).slice(1))
    .toEqual([
      { name: "calculator_used", properties: { calculator: "hourly-rate" } },
      { name: "template_copied", properties: { templateId: "follow-up-message" } },
    ]);
});

test("a repeated onboarding is marked as repeat", async ({ page }) => {
  const email = await createLoggedInUser(page);
  await page.goto("/onboarding");
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: "Weiter" }).click();
  await page.getByRole("button", { name: /Los geht's|Speichern/ }).click();
  await expect(page).toHaveURL("/dashboard");

  await expect
    .poll(() => eventsOf(email))
    .toEqual([
      { name: "onboarding_completed", properties: { repeat: false } },
      { name: "onboarding_completed", properties: { repeat: true } },
    ]);
});

import { expect, test } from "@playwright/test";

import { createLoggedInUser } from "./helpers/auth";

// Germany basics (Phase 10): general information with sources, date and disclaimer.

test("the overview lists all articles by category", async ({ page }) => {
  await page.goto("/wissen/grundlagen");

  await expect(page.getByText("keine Rechts- oder Steuerberatung")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Absicherung" })).toBeVisible();
  await expect(page.getByRole("main").getByRole("link")).toHaveCount(9);

  await page.getByRole("link", { name: /^Kleinunternehmerregelung/ }).click();
  await expect(page).toHaveURL("/wissen/grundlagen/small-business-scheme");
});

test("an article shows summary, body, sources, date and disclaimer", async ({ page }) => {
  await page.goto("/wissen/grundlagen/small-business-scheme");

  await expect(
    page.getByRole("heading", { level: 1, name: "Kleinunternehmerregelung" }),
  ).toBeVisible();
  await expect(page.getByText("Zuletzt geprüft am")).toBeVisible();
  await expect(page.getByText("Kurz gesagt")).toBeVisible();
  // Markdown is rendered as headings and lists, not as raw text.
  await expect(
    page.getByRole("heading", { level: 2, name: "Die Grenzen seit 2025" }),
  ).toBeVisible();
  await expect(page.getByText("## ")).toHaveCount(0);

  const sources = page.getByRole("region", { name: "Quellen" }).getByRole("link");
  await expect(sources.first()).toHaveAttribute("href", /^https:\/\//);
  await expect(sources.first()).toHaveAttribute("target", "_blank");

  await expect(
    page.getByRole("note").filter({ hasText: "Keine Rechts- oder Steuerberatung" }),
  ).toBeVisible();
  await expect(
    page.getByRole("note").filter({ hasText: "noch nicht fachlich geprüft" }),
  ).toBeVisible();
});

test("stage pages link to background articles", async ({ page }) => {
  await createLoggedInUser(page);
  await page.goto("/roadmap/business-basics");

  const section = page.getByRole("region", { name: "Hintergrundwissen" });
  await expect(section.getByRole("link")).toHaveCount(6);
  await section.getByRole("link", { name: /Krankenversicherung/ }).click();

  await expect(page).toHaveURL("/wissen/grundlagen/health-insurance");
  await expect(
    page.getByRole("region", { name: "Passt zu diesen Stufen" }).getByRole("link"),
  ).toHaveText(/Stufe 7: Geschäftliche Grundlagen schaffen/);
});

test("an unknown article shows a not-found page", async ({ page }) => {
  await page.goto("/wissen/grundlagen/gibt-es-nicht");
  await expect(
    page.getByRole("heading", { level: 1, name: "Artikel nicht gefunden" }),
  ).toBeVisible();
});

import { expect, test } from "@playwright/test";

// Product structure (Phase 4): navigation, knowledge area, tools, legal pages.

test("the knowledge area leads to templates and Germany basics", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Hauptnavigation" }).filter({ visible: true });
  await nav.getByRole("link", { name: "Wissen" }).click();

  await expect(page).toHaveURL("/wissen");
  await page.getByRole("link", { name: /Deutschland-Grundlagen/ }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Deutschland-Grundlagen" }),
  ).toBeVisible();

  await page.goto("/wissen");
  await page.getByRole("link", { name: /Vorlagen/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Vorlagen" })).toBeVisible();
});

test("the tools page lists the tools from the content", async ({ page }) => {
  await page.goto("/tools");

  for (const title of ["Stundensatz-Rechner", "Projektpreis-Rechner", "Startklar-Check"]) {
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
});

test("the landing page explains how it works", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "So funktioniert's" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Loslegen" })).toHaveAttribute(
    "href",
    "/registrieren",
  );
});

test("onboarding requires a login", async ({ page }) => {
  await page.goto("/onboarding");

  await expect(page).toHaveURL("/anmelden?next=%2Fonboarding");
});

for (const { path, heading } of [
  { path: "/impressum", heading: "Impressum" },
  { path: "/datenschutz", heading: "Datenschutzerklärung" },
]) {
  test(`${heading} is marked as draft while placeholders are left`, async ({ page }) => {
    await page.goto(path);

    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await expect(page.getByRole("note")).toContainText("Entwurf");
    await expect(page.locator("mark").first()).toBeVisible();
  });
}

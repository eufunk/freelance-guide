import { expect, test } from "@playwright/test";

test("landing page shows the headline and a start button", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Freelance Guide/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Loslegen" })).toBeVisible();
});

test("main navigation leads to the tools and marks them as active", async ({ page }) => {
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Hauptnavigation" }).filter({ visible: true });
  await nav.getByRole("link", { name: "Tools" }).click();

  await expect(page).toHaveURL(/\/tools$/);
  await expect(page.getByRole("heading", { level: 1, name: "Tools" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Tools" })).toHaveAttribute("aria-current", "page");
});

test("footer links to imprint and privacy policy", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "Impressum" })).toHaveAttribute("href", "/impressum");
  await expect(page.getByRole("link", { name: "Datenschutz" })).toHaveAttribute(
    "href",
    "/datenschutz",
  );
});

test("unknown pages show the German 404 page", async ({ page }) => {
  const response = await page.goto("/gibt-es-nicht");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Seite nicht gefunden" })).toBeVisible();
});

test("page has no horizontal scrolling", async ({ page }) => {
  await page.goto("/");

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

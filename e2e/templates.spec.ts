import { expect, test, type Page } from "@playwright/test";

import { createLoggedInUser } from "./helpers/auth";

// Templates (Phase 9): edit in the browser and copy; nothing is saved.

// Both projects run Chromium, which supports these permissions.
test.use({ permissions: ["clipboard-read", "clipboard-write"] });

const editor = (page: Page) => page.getByLabel("Dein Text");
// The Windows clipboard turns line breaks into \r\n.
const clipboard = async (page: Page) =>
  (await page.evaluate(() => navigator.clipboard.readText())).replaceAll("\r\n", "\n");

test("the overview lists all templates with their kind", async ({ page }) => {
  await page.goto("/wissen/vorlagen");

  await expect(page.getByRole("heading", { level: 2, name: "Kundengewinnung" })).toBeVisible();
  const links = page.getByRole("main").getByRole("link");
  await expect(links).toHaveCount(8);
  await expect(
    page.getByRole("link", { name: /Rechnungsbeispiel.*Rechtliches Muster/ }),
  ).toBeVisible();

  await page.getByRole("link", { name: /Kundenanfrage/ }).click();
  await expect(page).toHaveURL("/wissen/vorlagen/client-outreach");
  await expect(page.getByRole("heading", { level: 1, name: "Kundenanfrage" })).toBeVisible();
});

test("a template can be edited and copied without an account", async ({ page }) => {
  await page.goto("/wissen/vorlagen/follow-up-message");

  // Profile placeholders stay visible without an account.
  await expect(editor(page)).toHaveValue(/Viele Grüße\n\{\{name\}\}$/);
  await expect(page.getByRole("link", { name: "Melde dich an" })).toBeVisible();
  await expect(page.getByText("Noch 6 Stellen in Klammern anzupassen")).toBeVisible();

  const text = "Guten Tag Frau Beispiel,\n\nich wollte kurz nachfragen.\n\nViele Grüße\nAlex";
  await editor(page).fill(text);
  await expect(page.getByText("Keine offenen Stellen in Klammern mehr")).toBeVisible();

  await page.getByRole("button", { name: "Text kopieren" }).click();
  await expect(page.getByRole("button", { name: "Kopiert" })).toBeVisible();
  await expect(page.getByRole("status").filter({ hasText: "Zwischenablage" })).toBeVisible();
  expect(await clipboard(page)).toBe(text);

  // Reset asks first, then restores the original text.
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Zurücksetzen" }).click();
  await expect(editor(page)).toHaveValue(/^Betreff: Re: \[Betreff deiner ersten Nachricht\]/);
  await expect(page.getByRole("button", { name: "Zurücksetzen" })).toBeDisabled();
});

test("legal samples show their kind and a disclaimer", async ({ page }) => {
  await page.goto("/wissen/vorlagen/invoice-example");

  await expect(page.getByText("Rechtliches Muster", { exact: true })).toBeVisible();
  await expect(page.getByRole("note")).toContainText("nicht rechtlich geprüft");
  await expect(page.getByRole("note")).toContainText(
    "keine individuelle Rechts- oder Steuerberatung",
  );
});

test("placeholders are filled from the profile", async ({ page }) => {
  await createLoggedInUser(page);
  await page.goto("/wissen/vorlagen/freelancer-profile");

  await expect(editor(page)).toHaveValue(/^Anna – Freelance .* mit Schwerpunkt Webentwicklung/);
  await expect(editor(page)).toHaveValue(/3 Jahre Berufserfahrung mit Webentwicklung/);
  // No additional skills in the default onboarding answers.
  await expect(editor(page)).toHaveValue(/Weitere Kenntnisse: \{\{additionalSkills\}\}/);
  await expect(page.getByText("Noch ohne Angabe: weitere Skills.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Angaben ergänzen" })).toHaveAttribute(
    "href",
    "/onboarding",
  );
});

test("a missing hourly rate links to the calculator", async ({ page }) => {
  await createLoggedInUser(page);
  await page.goto("/wissen/vorlagen/project-proposal");

  await expect(page.getByText("Noch ohne Angabe: Stundensatz.")).toBeVisible();
  await page.getByRole("link", { name: "Stundensatz berechnen und speichern" }).click();
  await expect(page).toHaveURL("/tools/stundensatz");
});

test("stage pages link to their templates", async ({ page }) => {
  await createLoggedInUser(page);
  await page.goto("/roadmap/contact-clients");

  const section = page.getByRole("region", { name: "Passende Vorlagen" });
  await expect(section.getByRole("link")).toHaveCount(2);
  await section.getByRole("link", { name: /Nachfass-Nachricht/ }).click();

  await expect(page).toHaveURL("/wissen/vorlagen/follow-up-message");
  await expect(
    page.getByRole("region", { name: "Passt zu diesen Stufen" }).getByRole("link"),
  ).toHaveText(/Stufe 9: Potenzielle Kunden ansprechen/);
});

test("an unknown template shows a not-found page", async ({ page }) => {
  await page.goto("/wissen/vorlagen/gibt-es-nicht");
  await expect(
    page.getByRole("heading", { level: 1, name: "Vorlage nicht gefunden" }),
  ).toBeVisible();
});

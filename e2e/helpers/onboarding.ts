import { expect, type Page } from "@playwright/test";

export type OnboardingAnswers = {
  name: string;
  country: "Deutschland" | "Österreich" | "Schweiz" | "Anderes Land";
  mainSkill: string;
  years: string;
  hasPortfolio: boolean;
  hasFreelanceExperience: boolean;
  goal: RegExp;
  hours: string;
};

export const defaultAnswers: OnboardingAnswers = {
  name: "Anna",
  country: "Deutschland",
  mainSkill: "Webentwicklung",
  years: "3",
  hasPortfolio: false,
  hasFreelanceExperience: false,
  goal: /Ich will Freelancer werden/,
  hours: "20",
};

function step(page: Page, title: string) {
  return expect(page.getByRole("heading", { level: 2, name: title })).toBeVisible();
}

/** Answers the question steps and stops at the summary step. */
export async function answerOnboarding(page: Page, answers: OnboardingAnswers = defaultAnswers) {
  const next = page.getByRole("button", { name: "Weiter" });

  await step(page, "Über dich");
  await page.getByLabel("Wie heißt du?").fill(answers.name);
  await page.getByRole("radio", { name: answers.country }).check();
  await next.click();

  await step(page, "Dein IT-Profil");
  await page.getByLabel("Was ist dein Haupt-Skill?").fill(answers.mainSkill);
  await page.getByLabel("Wie viele Jahre Berufserfahrung").fill(answers.years);
  await page
    .getByRole("group", { name: "Hast du schon ein Portfolio" })
    .getByRole("radio", { name: answers.hasPortfolio ? "Ja" : "Nein" })
    .check();
  await page
    .getByRole("group", { name: "Hast du schon einmal freiberuflich gearbeitet?" })
    .getByRole("radio", { name: answers.hasFreelanceExperience ? "Ja" : "Nein" })
    .check();
  await next.click();

  await step(page, "Dein Ziel");
  await page.getByRole("radio", { name: answers.goal }).check();
  await next.click();

  await step(page, "Deine Zeit");
  await page.getByLabel("Wie viele Stunden pro Woche").fill(answers.hours);
  await next.click();

  await step(page, "Dein Startpunkt");
}

/** Answers all steps and submits; ends on the dashboard. */
export async function completeOnboarding(page: Page, answers: OnboardingAnswers = defaultAnswers) {
  await answerOnboarding(page, answers);
  await page.getByRole("button", { name: /Los geht's|Speichern/ }).click();
  await expect(page).toHaveURL("/dashboard");
}

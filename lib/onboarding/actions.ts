"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { getOnboardingRules, getRoadmap } from "@/lib/content";
import { updateProfile } from "@/lib/db/profile";
import { applyOnboardingProgress, getTaskProgress } from "@/lib/db/task-progress";

import type { OnboardingFormState } from "./form-state";
import { onboardingInputFrom, onboardingSchema } from "./schema";
import { planOnboardingProgress, proposeDoneStages } from "./starting-point";

const RETURN_PATH = "/onboarding";

export async function saveOnboarding(
  _: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const parsed = onboardingSchema.safeParse(onboardingInputFrom(formData));
  if (!parsed.success) {
    return { status: "error", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  const answers = parsed.data;

  // Only stages the rules propose can be confirmed, whatever the form sends.
  const roadmap = getRoadmap();
  const proposed = new Set(proposeDoneStages(answers, getOnboardingRules(), roadmap));
  const confirmed = answers.confirmedStageIds.filter((id) => proposed.has(id));

  await updateProfile(
    {
      name: answers.name,
      country: answers.country,
      main_skill: answers.mainSkill,
      additional_skills: answers.additionalSkills,
      years_experience: answers.yearsExperience,
      has_portfolio: answers.hasPortfolio,
      has_freelance_experience: answers.hasFreelanceExperience,
      goal: answers.goal,
      hours_per_week: answers.hoursPerWeek,
      desired_start_date: answers.desiredStartDate,
      onboarding_completed_at: new Date().toISOString(),
    },
    RETURN_PATH,
  );

  const existing = await getTaskProgress(RETURN_PATH);
  const plan = planOnboardingProgress(
    confirmed,
    roadmap,
    [...existing.values()].map((row) => ({
      taskId: row.task_id,
      status: row.status,
      source: row.source,
    })),
  );
  await applyOnboardingProgress(plan, RETURN_PATH);

  redirect("/dashboard");
}

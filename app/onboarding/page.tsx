import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { skillSuggestions } from "@/content/skill-suggestions";
import { getOnboardingRules, getRoadmap } from "@/lib/content";
import { getProfile } from "@/lib/db/profile";
import { getTaskProgress } from "@/lib/db/task-progress";
import { onboardingInputFromProfile } from "@/lib/onboarding/schema";

export const metadata: Metadata = { title: "Onboarding" };

const RETURN_PATH = "/onboarding";

export default async function OnboardingPage() {
  const [profile, progress] = await Promise.all([
    getProfile(RETURN_PATH),
    getTaskProgress(RETURN_PATH),
  ]);
  const isRerun = profile.onboarding_completed_at !== null;

  const stages = getRoadmap().map((stage) => ({
    id: stage.id,
    title: stage.title,
    order: stage.order,
    tasks: stage.tasks.map((task) => ({ id: task.id })),
  }));
  const userCompletedTaskIds = [...progress.values()]
    .filter((row) => row.source === "user" && row.status === "completed")
    .map((row) => row.task_id);

  return (
    <PageContainer
      title={isRerun ? "Angaben ändern" : "Willkommen beim Freelance Guide"}
      description={
        isRerun
          ? "Passe deine Antworten an. Aufgaben, die du selbst erledigt hast, bleiben erhalten."
          : "Ein paar kurze Fragen – daraus ergibt sich dein persönlicher Startpunkt. Das dauert etwa zwei Minuten."
      }
    >
      <OnboardingForm
        initialValues={onboardingInputFromProfile(profile)}
        stages={stages}
        rules={getOnboardingRules()}
        userCompletedTaskIds={userCompletedTaskIds}
        skillSuggestions={skillSuggestions}
        submitLabel={isRerun ? "Speichern" : "Los geht's"}
      />
    </PageContainer>
  );
}

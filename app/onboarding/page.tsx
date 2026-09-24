import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { requireUser } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Onboarding" };

// Placeholder – implemented in Phase 5.
export default async function OnboardingPage() {
  await requireUser("/onboarding");

  return <PageContainer title="Onboarding" description="Dieser Bereich ist noch in Arbeit." />;
}

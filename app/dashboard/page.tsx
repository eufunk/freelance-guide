import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { getProfile } from "@/lib/db/profile";

export const metadata: Metadata = { title: "Dashboard" };

// Placeholder – implemented in Phase 7.
export default async function DashboardPage() {
  const profile = await getProfile("/dashboard");
  // New users answer the onboarding questions first.
  if (!profile.onboarding_completed_at) redirect("/onboarding");

  return (
    <PageContainer
      title={profile.name ? `Hallo ${profile.name}` : "Dashboard"}
      description="Dein Dashboard ist noch in Arbeit."
    />
  );
}

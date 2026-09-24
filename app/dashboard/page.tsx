import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { requireUser } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Dashboard" };

// Placeholder – implemented in Phase 7.
export default async function DashboardPage() {
  await requireUser("/dashboard");

  return <PageContainer title="Dashboard" description="Dieser Bereich ist noch in Arbeit." />;
}

import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { requireUser } from "@/lib/auth/dal";

export const metadata: Metadata = { title: "Roadmap" };

// Placeholder – implemented in Phase 6.
export default async function RoadmapPage() {
  await requireUser("/roadmap");

  return <PageContainer title="Roadmap" description="Dieser Bereich ist noch in Arbeit." />;
}

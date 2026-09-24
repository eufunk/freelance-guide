import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = { title: "Datenschutzerklärung" };

// Placeholder – implemented in Phase 4/11.
export default function PrivacyPolicyPage() {
  return (
    <PageContainer title="Datenschutzerklärung" description="Dieser Bereich ist noch in Arbeit." />
  );
}

import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal/legal-document";
import { PageContainer } from "@/components/layout/page-container";
import { privacyPolicy } from "@/content/legal-pages";

export const metadata: Metadata = { title: "Datenschutzerklärung" };

export default function PrivacyPolicyPage() {
  return (
    <PageContainer title="Datenschutzerklärung">
      <LegalDocument
        sections={privacyPolicy.sections}
        draft={privacyPolicy.draft}
        lastUpdated={privacyPolicy.lastUpdated}
      />
    </PageContainer>
  );
}

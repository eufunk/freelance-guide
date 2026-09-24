import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal/legal-document";
import { PageContainer } from "@/components/layout/page-container";
import { imprint } from "@/content/legal-pages";

export const metadata: Metadata = { title: "Impressum" };

export default function ImprintPage() {
  return (
    <PageContainer title="Impressum">
      <LegalDocument sections={imprint.sections} />
    </PageContainer>
  );
}

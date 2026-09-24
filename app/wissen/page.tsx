import type { Metadata } from "next";

import { InfoCard } from "@/components/layout/info-card";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = { title: "Wissen" };

export default function KnowledgePage() {
  return (
    <PageContainer title="Wissen" description="Vorlagen und Hintergrundwissen für deinen Start.">
      <div className="grid gap-3 md:grid-cols-2">
        <InfoCard
          href="/wissen/vorlagen"
          title="Vorlagen"
          description="Profiltext, Kundenanfrage, Angebot und mehr – zum Anpassen und Kopieren."
        />
        <InfoCard
          href="/wissen/grundlagen"
          title="Deutschland-Grundlagen"
          description="Anmeldung, Steuern, Versicherung: was du als Freelancer in Deutschland wissen musst."
        />
      </div>
    </PageContainer>
  );
}

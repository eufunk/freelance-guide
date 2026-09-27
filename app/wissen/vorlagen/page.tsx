import type { Metadata } from "next";

import { InfoCard } from "@/components/layout/info-card";
import { PageContainer } from "@/components/layout/page-container";
import { templateKindLabels } from "@/components/templates/template-labels";
import { getTemplates, groupByCategory } from "@/lib/content";

export const metadata: Metadata = { title: "Vorlagen" };

export default function TemplatesPage() {
  return (
    <PageContainer
      title="Vorlagen"
      description="Texte für Profil, Kundenkontakt, Angebot und Rechnung – im Browser anpassen und kopieren."
    >
      <div className="space-y-8">
        {groupByCategory(getTemplates()).map(([category, templates]) => (
          <section key={category} className="space-y-3">
            <h2 className="text-lg font-semibold">{category}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {templates.map((template) => (
                <InfoCard
                  key={template.id}
                  href={`/wissen/vorlagen/${template.id}`}
                  title={template.title}
                  description={template.description}
                  badge={templateKindLabels[template.kind]}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}

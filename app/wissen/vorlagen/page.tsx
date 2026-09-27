import type { Metadata } from "next";

import { InfoCard } from "@/components/layout/info-card";
import { PageContainer } from "@/components/layout/page-container";
import { templateKindLabels } from "@/components/templates/template-labels";
import { getTemplates } from "@/lib/content";
import type { Template } from "@/lib/content/schema";

export const metadata: Metadata = { title: "Vorlagen" };

/** Templates grouped by category, in content order. */
function byCategory(templates: Template[]): [string, Template[]][] {
  const groups = new Map<string, Template[]>();
  for (const template of templates) {
    groups.set(template.category, [...(groups.get(template.category) ?? []), template]);
  }
  return [...groups];
}

export default function TemplatesPage() {
  return (
    <PageContainer
      title="Vorlagen"
      description="Texte für Profil, Kundenkontakt, Angebot und Rechnung – im Browser anpassen und kopieren."
    >
      <div className="space-y-8">
        {byCategory(getTemplates()).map(([category, templates]) => (
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

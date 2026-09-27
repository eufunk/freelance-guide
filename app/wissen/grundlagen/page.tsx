import type { Metadata } from "next";

import { InfoCard } from "@/components/layout/info-card";
import { PageContainer } from "@/components/layout/page-container";
import { getLegalArticles, groupByCategory } from "@/lib/content";

export const metadata: Metadata = { title: "Deutschland-Grundlagen" };

export default function GermanBasicsPage() {
  return (
    <PageContainer
      title="Deutschland-Grundlagen"
      description="Anmeldung, Steuern und Absicherung: was du als Freelancer in Deutschland wissen solltest."
    >
      <p className="mb-8 max-w-prose rounded-xl bg-muted px-4 py-3 text-sm">
        Allgemeine Informationen, keine Rechts- oder Steuerberatung. Für deinen konkreten Fall
        helfen eine Steuerberatung, dein Finanzamt oder deine Krankenkasse.
      </p>
      <div className="space-y-8">
        {groupByCategory(getLegalArticles()).map(([category, articles]) => (
          <section key={category} className="space-y-3">
            <h2 className="text-lg font-semibold">{category}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {articles.map((article) => (
                <InfoCard
                  key={article.id}
                  href={`/wissen/grundlagen/${article.id}`}
                  title={article.title}
                  description={article.summary}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageContainer>
  );
}

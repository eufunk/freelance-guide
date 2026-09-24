import type { Metadata } from "next";

import { InfoCard } from "@/components/layout/info-card";
import { PageContainer } from "@/components/layout/page-container";
import { getTools } from "@/lib/content";

export const metadata: Metadata = { title: "Tools" };

// The tools themselves are built in Phase 8; until then they are listed without links.
export default function ToolsPage() {
  return (
    <PageContainer title="Tools" description="Rechner und Checks für deine Planung.">
      <div className="grid gap-3 md:grid-cols-2">
        {getTools().map((tool) => (
          <InfoCard
            key={tool.id}
            title={tool.title}
            description={tool.description}
            badge="Bald verfügbar"
          />
        ))}
      </div>
    </PageContainer>
  );
}

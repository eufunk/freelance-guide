import { CheckCircle2, ChevronRight, Circle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ProgressBar } from "@/components/roadmap/progress-bar";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/dal";
import { getReadinessChecklist, getRoadmap, getTask } from "@/lib/content";
import { getProgressByTask } from "@/lib/db/task-progress";
import { readiness } from "@/lib/tools/readiness";

export const metadata: Metadata = { title: "Startklar-Check" };

const PATH = "/tools/startklar";

/** Where to work on an item: its first stage, or the stage of its first task. */
function stageLink(item: { stageIds: string[]; taskIds: string[] }) {
  const stageId = item.stageIds[0] ?? getTask(item.taskIds[0] ?? "")?.stageId;
  return stageId ? `/roadmap/${stageId}` : "/roadmap";
}

export default async function ReadinessPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <PageContainer
        title="Startklar-Check"
        description="Wie gut bist du für deinen ersten Auftrag vorbereitet?"
      >
        <p className="mb-4 max-w-prose">
          Der Check ergibt sich aus deinem Fortschritt in der Roadmap. Melde dich an, um ihn zu
          sehen.
        </p>
        <Link href={`/anmelden?next=${encodeURIComponent(PATH)}`} className={buttonVariants()}>
          Anmelden
        </Link>
      </PageContainer>
    );
  }

  const progress = await getProgressByTask(PATH);
  const result = readiness(getReadinessChecklist(), getRoadmap(), progress);

  return (
    <PageContainer
      title="Startklar-Check"
      description="Wie gut bist du für deinen ersten Auftrag vorbereitet? Der Check ergibt sich aus deiner Roadmap."
    >
      <div className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">{`${result.percent} % startklar`}</span>
            <span className="text-muted-foreground">
              {` · ${result.done} von ${result.total} erledigt`}
            </span>
          </p>
          <ProgressBar value={result.done} max={result.total} label="Startklar" />
        </div>

        <ul className="space-y-3">
          {result.items.map(({ item, done }) => (
            <li key={item.id}>
              <Link
                href={stageLink(item)}
                className="flex items-center gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/50"
              >
                {done ? (
                  <CheckCircle2 aria-hidden className="size-5 shrink-0 text-emerald-600" />
                ) : (
                  <Circle aria-hidden className="size-5 shrink-0 text-muted-foreground" />
                )}
                <span className="flex-1 space-y-0.5">
                  <span className="block font-medium">{item.title}</span>
                  <span className="block text-sm text-muted-foreground">{item.description}</span>
                  <span className="block text-sm font-medium">{done ? "Erledigt" : "Offen"}</span>
                </span>
                <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageContainer>
  );
}

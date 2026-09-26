import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ProgressBar } from "@/components/roadmap/progress-bar";
import { StageMarker } from "@/components/roadmap/stage-marker";
import { getRoadmap } from "@/lib/content";
import { getProgressByTask } from "@/lib/db/task-progress";
import {
  completedTaskIds,
  currentStage,
  roadmapProgress,
  stageProgress,
} from "@/lib/progress/roadmap-progress";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Roadmap" };

export default async function RoadmapPage() {
  const progress = await getProgressByTask("/roadmap");
  const roadmap = getRoadmap();
  const overall = roadmapProgress(roadmap, progress);
  const current = currentStage(roadmap, completedTaskIds(progress));

  return (
    <PageContainer
      title="Deine Roadmap"
      description="In 15 Stufen vom eigenen Angebot bis zum ersten Kunden – und darüber hinaus."
    >
      <div className="mb-8 max-w-2xl space-y-2">
        <p className="text-sm">
          <span className="font-medium">{overall.percent} % geschafft</span>
          <span className="text-muted-foreground">
            {` · ${overall.completed} von ${overall.total} Aufgaben erledigt`}
          </span>
        </p>
        <ProgressBar value={overall.completed} max={overall.total} label="Fortschritt gesamt" />
      </div>

      <ol className="max-w-2xl space-y-3">
        {roadmap.map((stage) => {
          const { completed, total, status } = stageProgress(stage, progress);
          const isCurrent = stage.id === current?.id;

          return (
            <li key={stage.id}>
              <Link
                href={`/roadmap/${stage.id}`}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/50",
                  isCurrent && "border-foreground",
                )}
              >
                <StageMarker order={stage.order} status={status} current={isCurrent} />
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-medium">
                      <span className="sr-only">{`Stufe ${stage.order}: `}</span>
                      {stage.title}
                    </h2>
                    {isCurrent && (
                      <span className="rounded-full bg-foreground px-2 py-0.5 text-xs text-background">
                        Aktuell
                      </span>
                    )}
                  </div>
                  {/* Progressive disclosure: details only for the current stage. */}
                  {isCurrent && (
                    <p className="text-sm text-muted-foreground">{stage.shortExplanation}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {status === "completed"
                      ? "Erledigt"
                      : `${completed} von ${total} Aufgaben erledigt`}
                  </p>
                </div>
                <ChevronRight aria-hidden className="size-5 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
      </ol>
    </PageContainer>
  );
}

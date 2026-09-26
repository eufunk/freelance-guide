import { ChevronLeft, ExternalLink, PartyPopper } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { InfoCard } from "@/components/layout/info-card";
import { PageContainer } from "@/components/layout/page-container";
import { ProgressBar } from "@/components/roadmap/progress-bar";
import { TaskCard } from "@/components/roadmap/task-card";
import { buttonVariants } from "@/components/ui/button";
import { getRoadmap, getStage, getTool } from "@/lib/content";
import { getProgressByTask } from "@/lib/db/task-progress";
import { stageProgress } from "@/lib/progress/roadmap-progress";

export async function generateMetadata({
  params,
}: PageProps<"/roadmap/[stageId]">): Promise<Metadata> {
  const stage = getStage((await params).stageId);
  return { title: stage ? stage.title : "Stufe nicht gefunden" };
}

export default async function StagePage({ params }: PageProps<"/roadmap/[stageId]">) {
  const { stageId } = await params;
  const stage = getStage(stageId);
  if (!stage) notFound();

  const progress = await getProgressByTask(`/roadmap/${stage.id}`);
  const { completed, total, status } = stageProgress(stage, progress);
  const roadmap = getRoadmap();
  const previous = roadmap[stage.order - 2];
  const next = roadmap[stage.order];
  const tools = stage.relatedToolIds.map((id) => getTool(id)).filter((tool) => tool !== undefined);

  return (
    <PageContainer className="max-w-3xl">
      <Link
        href="/roadmap"
        className="mb-4 -ml-2 inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft aria-hidden className="size-4" />
        Alle Stufen
      </Link>

      <div className="mb-6 space-y-2">
        <p className="text-sm text-muted-foreground">
          {`Stufe ${stage.order} von ${roadmap.length}`}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{stage.title}</h1>
        <p className="text-muted-foreground">{stage.shortExplanation}</p>
      </div>

      <div className="mb-8 rounded-xl bg-muted px-4 py-3">
        <h2 className="text-sm font-medium">Warum das wichtig ist</h2>
        <p className="text-sm">{stage.whyItMatters}</p>
      </div>

      <section aria-labelledby="tasks-heading" className="space-y-4">
        <div className="space-y-2">
          <h2 id="tasks-heading" className="text-lg font-semibold">
            Aufgaben
          </h2>
          <p className="text-sm text-muted-foreground">{`${completed} von ${total} erledigt`}</p>
          <ProgressBar value={completed} max={total} label={`Fortschritt ${stage.title}`} />
        </div>

        {status === "completed" && (
          <div
            role="status"
            className="flex gap-3 rounded-xl border border-emerald-600/30 bg-emerald-600/10 p-4"
          >
            <PartyPopper aria-hidden className="size-5 shrink-0 text-emerald-700" />
            <div className="space-y-2">
              <p className="font-medium">Stufe erledigt – stark!</p>
              {next && (
                <Link href={`/roadmap/${next.id}`} className={buttonVariants()}>
                  {`Weiter mit Stufe ${next.order}: ${next.title}`}
                </Link>
              )}
            </div>
          </div>
        )}

        <ul className="space-y-3">
          {stage.tasks.map((task) => (
            <TaskCard key={task.id} task={task} progress={progress.get(task.id)} />
          ))}
        </ul>
      </section>

      {tools.length > 0 && (
        <section aria-labelledby="tools-heading" className="mt-10 space-y-3">
          <h2 id="tools-heading" className="text-lg font-semibold">
            Passende Tools
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {/* The tools are built in Phase 8; until then they are listed without links. */}
            {tools.map((tool) => (
              <InfoCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                badge="Bald verfügbar"
              />
            ))}
          </div>
        </section>
      )}

      {stage.resources.length > 0 && (
        <section aria-labelledby="resources-heading" className="mt-10 space-y-3">
          <h2 id="resources-heading" className="text-lg font-semibold">
            Weiterführende Links
          </h2>
          <ul className="space-y-2">
            {stage.resources.map((resource) => (
              <li key={resource.id}>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
                >
                  {resource.title}
                  <ExternalLink aria-hidden className="size-3.5" />
                </a>
                <p className="text-sm text-muted-foreground">{resource.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav
        aria-label="Stufen"
        className="mt-10 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between"
      >
        {previous ? (
          <Link href={`/roadmap/${previous.id}`} className={buttonVariants({ variant: "outline" })}>
            {`← Stufe ${previous.order}`}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/roadmap/${next.id}`} className={buttonVariants({ variant: "outline" })}>
            {`Stufe ${next.order} →`}
          </Link>
        )}
      </nav>
    </PageContainer>
  );
}

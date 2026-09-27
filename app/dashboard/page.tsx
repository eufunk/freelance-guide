import { ArrowRight, CheckCircle2, Clock, PartyPopper } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useId } from "react";

import { InfoCard } from "@/components/layout/info-card";
import { PageContainer } from "@/components/layout/page-container";
import { ProgressBar } from "@/components/roadmap/progress-bar";
import { templateKindLabels } from "@/components/templates/template-labels";
import { buttonVariants } from "@/components/ui/button";
import { getRoadmap, getStage, getTemplate, getTool } from "@/lib/content";
import type { Stage, Task, ToolId } from "@/lib/content/schema";
import { getProfile } from "@/lib/db/profile";
import { getProgressByTask } from "@/lib/db/task-progress";
import { formatDate, formatDuration } from "@/lib/format";
import { buildDashboard } from "@/lib/progress/dashboard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Dashboard" };

const RETURN_PATH = "/dashboard";

function taskHref(task: Task) {
  return `/roadmap/${task.stageId}#aufgabe-${task.id}`;
}

/** A titled section, announced by its title to screen readers. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="space-y-3">
      <h2 id={headingId} className="text-lg font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function DashboardPage() {
  const [profile, progress] = await Promise.all([
    getProfile(RETURN_PATH),
    getProgressByTask(RETURN_PATH),
  ]);
  // New users answer the onboarding questions first.
  if (!profile.onboarding_completed_at) redirect("/onboarding");

  const dashboard = buildDashboard<Task, Stage>(getRoadmap(), progress);
  const greeting = profile.name ? `Hallo ${profile.name}` : "Hallo";

  if (dashboard.state === "all-done") {
    const lastStage = getStage("improve-repeat");
    return (
      <PageContainer title={greeting}>
        <div className="max-w-2xl space-y-4 rounded-xl border border-emerald-600/30 bg-emerald-600/10 p-6">
          <PartyPopper aria-hidden className="size-8 text-emerald-700" />
          <h2 className="text-xl font-semibold">Glückwunsch – du hast alle Stufen geschafft!</h2>
          <p>
            Du hast deinen Weg vom ersten Schritt bis zum abgeschlossenen Projekt gemeistert. Jetzt
            geht es darum, aus deinen Erfahrungen zu lernen und dauerhaft genug Aufträge zu haben.
          </p>
          {lastStage && (
            <Link href={`/roadmap/${lastStage.id}`} className={buttonVariants()}>
              {`Zu „${lastStage.title}“`}
            </Link>
          )}
        </div>
      </PageContainer>
    );
  }

  const { task, taskStatus, taskStage, currentStage, next, recentlyCompleted } = dashboard;
  const tools = dashboard.toolIds
    .map((id) => getTool(id as ToolId))
    .filter((tool) => tool !== undefined);
  const templates = dashboard.templateIds
    .map((id) => getTemplate(id))
    .filter((template) => template !== undefined);

  return (
    <PageContainer title={greeting}>
      <div className="max-w-2xl space-y-10">
        {/* The primary call to action: what to do next. */}
        <section
          aria-labelledby="next-task"
          className="space-y-4 rounded-xl border-2 border-foreground p-5"
        >
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {taskStatus === "in_progress" ? "Du arbeitest gerade an" : "Deine nächste Aufgabe"}
              {` · Stufe ${taskStage.order}: ${taskStage.title}`}
            </p>
            <h2 id="next-task" className="text-xl font-semibold">
              {task.title}
            </h2>
            <p className="text-muted-foreground">{task.description}</p>
            <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Clock aria-hidden className="size-3.5" />
              {formatDuration(task.estimatedMinutes)}
            </p>
          </div>
          <Link
            href={taskHref(task)}
            className={cn(
              buttonVariants({ size: "lg" }),
              // Long task titles wrap instead of overflowing on small screens.
              "h-auto min-h-12 w-full justify-between py-3 text-left whitespace-normal sm:w-auto",
            )}
          >
            {`Weiter: ${task.title}`}
            <ArrowRight aria-hidden />
          </Link>
        </section>

        <Section title="Dein Fortschritt">
          <p className="text-sm">
            <span className="font-medium">{`${dashboard.progress.percent} % geschafft`}</span>
            <span className="text-muted-foreground">
              {` · ${dashboard.progress.completed} von ${dashboard.progress.total} Aufgaben erledigt`}
            </span>
          </p>
          <ProgressBar
            value={dashboard.progress.completed}
            max={dashboard.progress.total}
            label="Fortschritt gesamt"
          />
          {currentStage && (
            <p className="text-sm">
              {"Aktuelle Stufe: "}
              <Link
                href={`/roadmap/${currentStage.id}`}
                className="font-medium underline-offset-4 hover:underline"
              >
                {`${currentStage.order}. ${currentStage.title}`}
              </Link>
            </p>
          )}
          <Link href="/roadmap" className={buttonVariants({ variant: "outline" })}>
            Zur Roadmap
          </Link>
        </Section>

        {next && (
          <Section title="Danach">
            <InfoCard
              href={taskHref(next.task)}
              title={next.task.title}
              description={`Stufe ${next.stage.order}: ${next.stage.title} · ${formatDuration(next.task.estimatedMinutes)}`}
            />
          </Section>
        )}

        {recentlyCompleted.length > 0 && (
          <Section title="Zuletzt erledigt">
            <ul className="space-y-2">
              {recentlyCompleted.map(({ task: doneTask, completedAt }) => (
                <li key={doneTask.id} className="flex items-start gap-2">
                  <CheckCircle2 aria-hidden className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                  <span>
                    {doneTask.title}
                    <span className="text-sm text-muted-foreground">{` · ${formatDate(completedAt)}`}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {(tools.length > 0 || templates.length > 0) && (
          <Section title="Passend zu deiner Stufe">
            <div className="grid gap-3">
              {tools.map((tool) => (
                <InfoCard
                  key={tool.id}
                  title={tool.title}
                  description={tool.description}
                  href={tool.href}
                />
              ))}
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
          </Section>
        )}
      </div>
    </PageContainer>
  );
}

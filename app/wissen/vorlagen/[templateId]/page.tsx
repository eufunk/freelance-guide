import { ChevronLeft, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { InfoCard } from "@/components/layout/info-card";
import { PageContainer } from "@/components/layout/page-container";
import { TemplateEditor } from "@/components/templates/template-editor";
import {
  placeholderLabels,
  templateKindHints,
  templateKindLabels,
} from "@/components/templates/template-labels";
import { getCurrentUser } from "@/lib/auth/dal";
import { loginPathFor } from "@/lib/auth/paths";
import { getStagesForTemplate, getTemplate } from "@/lib/content";
import { getCalculatorResult } from "@/lib/db/calculator-results";
import { getProfile } from "@/lib/db/profile";
import { fillPlaceholders, missingPlaceholders, placeholderValues } from "@/lib/templates/fill";

const linkClass = "font-medium underline underline-offset-4";

export async function generateMetadata({
  params,
}: PageProps<"/wissen/vorlagen/[templateId]">): Promise<Metadata> {
  const template = getTemplate((await params).templateId);
  return { title: template ? template.title : "Vorlage nicht gefunden" };
}

// Public page: without an account, placeholders simply stay visible.
export default async function TemplatePage({ params }: PageProps<"/wissen/vorlagen/[templateId]">) {
  const { templateId } = await params;
  const template = getTemplate(templateId);
  if (!template) notFound();

  const path = `/wissen/vorlagen/${template.id}`;
  const user = await getCurrentUser();
  const [profile, savedRate] = user
    ? await Promise.all([getProfile(path), getCalculatorResult("hourly-rate", path)])
    : [null, null];

  const values = placeholderValues(profile, savedRate ? Number(savedRate.result) : null);
  const missing = missingPlaceholders(template.body, values);
  const stages = getStagesForTemplate(template.id);

  return (
    <PageContainer className="max-w-3xl">
      <Link
        href="/wissen/vorlagen"
        className="mb-4 -ml-2 inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft aria-hidden className="size-4" />
        Alle Vorlagen
      </Link>

      <div className="mb-6 space-y-2">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{template.category}</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
            {templateKindLabels[template.kind]}
          </span>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{template.title}</h1>
        <p className="text-muted-foreground">{template.description}</p>
      </div>

      <div className="space-y-6">
        {template.disclaimer && (
          <div
            role="note"
            className="flex gap-3 rounded-xl border border-amber-600/40 bg-amber-500/10 p-4 text-sm"
          >
            <TriangleAlert aria-hidden className="size-5 shrink-0 text-amber-700" />
            <div className="space-y-1">
              <p className="font-medium">Wichtiger Hinweis</p>
              <p>{template.disclaimer}</p>
            </div>
          </div>
        )}

        <div className="space-y-2 rounded-xl bg-muted px-4 py-3 text-sm">
          <h2 className="font-medium">So nutzt du die Vorlage</h2>
          <p>{templateKindHints[template.kind]}</p>
          <ul className="list-disc space-y-1 pl-5">
            {template.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>

        {missing.length > 0 && (
          <p className="text-sm">
            {user ? (
              <>
                {`Noch ohne Angabe: ${missing.map((name) => placeholderLabels[name]).join(", ")}. `}
                {"Diese Stellen bleiben als {{…}} stehen. "}
                {missing.some((name) => name !== "hourlyRate") && (
                  <>
                    <Link href="/onboarding" className={linkClass}>
                      Angaben ergänzen
                    </Link>
                    {missing.includes("hourlyRate") && " · "}
                  </>
                )}
                {missing.includes("hourlyRate") && (
                  <Link href="/tools/stundensatz" className={linkClass}>
                    Stundensatz berechnen und speichern
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href={loginPathFor(path)} className={linkClass}>
                  Melde dich an
                </Link>
                {
                  ", dann werden Name, Skills und Stundensatz automatisch eingesetzt. Ohne Konto bleiben sie als {{…}} stehen."
                }
              </>
            )}
          </p>
        )}

        <TemplateEditor
          templateId={template.id}
          initialText={fillPlaceholders(template.body, values)}
        />

        <p className="text-sm text-muted-foreground">
          Dein Text wird nicht gespeichert. Kopiere ihn, bevor du die Seite verlässt.
        </p>
      </div>

      {stages.length > 0 && (
        <section aria-labelledby="stages-heading" className="mt-10 space-y-3">
          <h2 id="stages-heading" className="text-lg font-semibold">
            Passt zu diesen Stufen
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {stages.map((stage) => (
              <InfoCard
                key={stage.id}
                href={`/roadmap/${stage.id}`}
                title={`Stufe ${stage.order}: ${stage.title}`}
                description={stage.shortExplanation}
              />
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  );
}

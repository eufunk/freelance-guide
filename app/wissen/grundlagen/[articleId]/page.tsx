import { ChevronLeft, ExternalLink, Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MarkdownText } from "@/components/content/markdown";
import { InfoCard } from "@/components/layout/info-card";
import { PageContainer } from "@/components/layout/page-container";
import { getLegalArticle, getStagesForArticle } from "@/lib/content";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/wissen/grundlagen/[articleId]">): Promise<Metadata> {
  const article = getLegalArticle((await params).articleId);
  return { title: article ? article.title : "Artikel nicht gefunden" };
}

export default async function GermanBasicsArticlePage({
  params,
}: PageProps<"/wissen/grundlagen/[articleId]">) {
  const { articleId } = await params;
  const article = getLegalArticle(articleId);
  if (!article) notFound();

  const stages = getStagesForArticle(article.id);

  return (
    <PageContainer className="max-w-3xl">
      <Link
        href="/wissen/grundlagen"
        className="mb-4 -ml-2 inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft aria-hidden className="size-4" />
        Alle Grundlagen
      </Link>

      <article className="max-w-prose">
        <div className="mb-6 space-y-2">
          <p className="text-sm text-muted-foreground">{article.category}</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{article.title}</h1>
          <p className="text-sm text-muted-foreground">
            {`Zuletzt geprüft am ${formatDate(article.lastVerified)}`}
          </p>
        </div>

        {!article.expertReviewed && (
          <p
            role="note"
            className="mb-4 rounded-lg border border-amber-500/40 bg-amber-100 px-4 py-3 text-sm text-amber-950"
          >
            <strong>Entwurf:</strong> Dieser Artikel wurde noch nicht fachlich geprüft.
          </p>
        )}

        <div role="note" className="mb-4 flex gap-3 rounded-xl bg-muted px-4 py-3 text-sm">
          <Info aria-hidden className="size-5 shrink-0" />
          <p>
            <strong>Keine Rechts- oder Steuerberatung.</strong> Dieser Artikel erklärt allgemein,
            wie die Regeln funktionieren, und kann Fehler enthalten oder veralten. Was in deinem
            Fall gilt, klärst du mit einer Steuerberatung, deinem Finanzamt, deiner Krankenkasse
            oder der Deutschen Rentenversicherung.
          </p>
        </div>

        <div className="mb-8 rounded-xl border-2 border-foreground p-4">
          <h2 className="text-sm font-medium text-muted-foreground">Kurz gesagt</h2>
          <p className="mt-1">{article.summary}</p>
        </div>

        <MarkdownText>{article.body}</MarkdownText>

        <section aria-labelledby="sources-heading" className="mt-10 space-y-3">
          <h2 id="sources-heading" className="text-lg font-semibold">
            Quellen
          </h2>
          <ul className="space-y-2 text-sm">
            {article.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-1 font-medium underline-offset-4 hover:underline"
                >
                  <span>{source.title}</span>
                  <ExternalLink aria-hidden className="size-3.5 shrink-0" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </article>

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

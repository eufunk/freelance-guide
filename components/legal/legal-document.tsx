import { siteOperator, type LegalSection } from "@/content/legal-pages";
import { findPlaceholders, splitPlaceholders } from "@/lib/content/placeholders";

/** Text with [[PLATZHALTER: ...]] parts highlighted. */
function Text({ children }: { children: string }) {
  return (
    <>
      {splitPlaceholders(children).map((segment, index) =>
        segment.placeholder ? (
          <mark key={index} className="rounded bg-amber-200 px-1 text-amber-950">
            {segment.text}
          </mark>
        ) : (
          segment.text
        ),
      )}
    </>
  );
}

function OperatorAddress() {
  return (
    <address className="not-italic">
      <Text>{siteOperator.name}</Text>
      <br />
      <Text>{siteOperator.street}</Text>
      <br />
      <Text>{siteOperator.postalCodeAndCity}</Text>
      <br />
      E-Mail: <Text>{siteOperator.email}</Text>
    </address>
  );
}

type LegalDocumentProps = {
  sections: LegalSection[];
  draft?: boolean;
  lastUpdated?: string;
};

/** Renders the imprint or privacy policy from content/legal-pages.ts. */
export function LegalDocument({ sections, draft = false, lastUpdated }: LegalDocumentProps) {
  const incomplete = draft || findPlaceholders({ sections, siteOperator }).length > 0;

  return (
    <div className="max-w-prose space-y-8">
      {incomplete && (
        <p
          role="note"
          className="rounded-lg border border-amber-500/40 bg-amber-100 px-4 py-3 text-sm text-amber-950"
        >
          <strong>Entwurf:</strong> Diese Seite ist noch nicht vollständig geprüft. Markierte
          Stellen müssen vor der Veröffentlichung ausgefüllt werden.
        </p>
      )}
      {sections.map((section) => (
        <section key={section.heading} className="space-y-3">
          <h2 className="text-lg font-semibold">{section.heading}</h2>
          {section.paragraphs?.map((paragraph) => (
            <p key={paragraph}>
              <Text>{paragraph}</Text>
            </p>
          ))}
          {section.showOperator && <OperatorAddress />}
          {section.list && (
            <ul className="list-disc space-y-2 pl-5">
              {section.list.map((item) => (
                <li key={item}>
                  <Text>{item}</Text>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
      {lastUpdated && (
        <p className="text-sm text-muted-foreground">
          Stand:{" "}
          {new Date(`${lastUpdated}T00:00:00Z`).toLocaleDateString("de-DE", { timeZone: "UTC" })}
        </p>
      )}
    </div>
  );
}

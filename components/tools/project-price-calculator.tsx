"use client";

import Link from "next/link";
import { useState } from "react";

import { NumberField } from "@/components/tools/number-field";
import { useRecordCalculatorUse } from "@/components/tools/use-record-calculator-use";
import { formatEuro } from "@/lib/format";
import { parseAndCalculateProjectPrice, type ProjectPriceField } from "@/lib/tools/project-price";

type Values = Record<ProjectPriceField, string>;

export function ProjectPriceCalculator({ initialValues }: { initialValues: Values }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Partial<Record<ProjectPriceField, boolean>>>({});

  const parsed = parseAndCalculateProjectPrice(values);
  useRecordCalculatorUse("project-price", parsed.ok && Object.keys(touched).length > 0);
  const errorOf = (name: ProjectPriceField) =>
    !parsed.ok && touched[name] ? parsed.errors[name] : undefined;

  function field(name: ProjectPriceField, label: string, unit: string, hint?: string) {
    return (
      <NumberField
        name={name}
        label={label}
        unit={unit}
        hint={hint}
        value={values[name]}
        onChange={(value) => {
          setValues((current) => ({ ...current, [name]: value }));
          setTouched((current) => ({ ...current, [name]: true }));
        }}
        onBlur={() => setTouched((current) => ({ ...current, [name]: true }))}
        error={errorOf(name)}
      />
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      <div className="space-y-6">
        {field(
          "hours",
          "Geschätzter Aufwand",
          "Stunden",
          "Zerlege das Projekt in Arbeitsschritte und addiere die Stunden.",
        )}
        <div className="space-y-2">
          {field("hourlyRate", "Dein Stundensatz", "€ / Stunde")}
          <p className="text-sm text-muted-foreground">
            {"Noch keinen? "}
            <Link
              href="/tools/stundensatz"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Stundensatz berechnen
            </Link>
          </p>
        </div>
        {field(
          "contingencyPercent",
          "Puffer",
          "%",
          "Für Unvorhergesehenes und Abstimmungen. Anfänger unterschätzen den Aufwand oft.",
        )}
      </div>

      <section
        aria-labelledby="price-heading"
        aria-live="polite"
        className="space-y-4 rounded-xl border-2 border-foreground p-5 md:sticky md:top-20"
      >
        <h2 id="price-heading" className="text-sm text-muted-foreground">
          Geschätzter Projektpreis
        </h2>
        {parsed.ok ? (
          <>
            <p>
              <span className="text-4xl font-semibold">{formatEuro(parsed.result.price)}</span>
              <span className="block text-sm text-muted-foreground">netto (ohne Umsatzsteuer)</span>
            </p>
            <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-sm">
              <dt className="text-muted-foreground">Aufwand × Stundensatz</dt>
              <dd className="text-right">{formatEuro(parsed.result.basePrice)}</dd>
              <dt className="text-muted-foreground">Puffer</dt>
              <dd className="text-right">{formatEuro(parsed.result.contingency)}</dd>
            </dl>
          </>
        ) : (
          <p className="text-muted-foreground">
            Gib Aufwand und Stundensatz ein – dann siehst du hier den Preis.
          </p>
        )}
        <p className="rounded-lg bg-muted px-3 py-2 text-sm">
          Eine Schätzung als Grundlage für dein Angebot. Halte im Angebot fest, was genau im Preis
          enthalten ist.
        </p>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { FormMessage } from "@/components/auth/form-message";
import { NumberField } from "@/components/tools/number-field";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatEuro, formatNumber } from "@/lib/format";
import { saveHourlyRate } from "@/lib/tools/actions";
import { initialSaveResultState } from "@/lib/tools/form-state";
import { parseAndCalculateHourlyRate, type HourlyRateField } from "@/lib/tools/hourly-rate";

type Values = Record<HourlyRateField, string>;

type HourlyRateCalculatorProps = {
  initialValues: Values;
  /** Logged-in users can save the result; others see a hint to log in. */
  canSave: boolean;
};

const basicFields: { name: HourlyRateField; label: string; unit: string; hint?: string }[] = [
  {
    name: "netMonthlyIncome",
    label: "Wie viel möchtest du im Monat netto verdienen?",
    unit: "€ / Monat",
    hint: "Was dir nach Steuern und Versicherungen zum Leben bleiben soll.",
  },
  {
    name: "monthlyExpenses",
    label: "Betriebskosten",
    unit: "€ / Monat",
    hint: "Zum Beispiel Software, Hardware, Weiterbildung, Berufshaftpflicht.",
  },
  { name: "hoursPerWeek", label: "Arbeitszeit", unit: "Std. / Woche" },
];

const advancedFields: { name: HourlyRateField; label: string; unit: string; hint?: string }[] = [
  {
    name: "nonBillableHoursPerWeek",
    label: "Davon nicht abrechenbar",
    unit: "Std. / Woche",
    hint: "Kundensuche, Buchhaltung, Weiterbildung – Zeit, die kein Kunde bezahlt.",
  },
  { name: "vacationDays", label: "Urlaub", unit: "Tage / Jahr" },
  { name: "publicHolidays", label: "Feiertage", unit: "Tage / Jahr" },
  { name: "sickDays", label: "Krankheitstage", unit: "Tage / Jahr" },
  {
    name: "monthlyHealthInsurance",
    label: "Kranken- und Pflegeversicherung",
    unit: "€ / Monat",
    hint: "Grober Schätzwert. Frag deine Krankenkasse nach deinem Beitrag in der Selbstständigkeit.",
  },
  {
    name: "monthlyRetirement",
    label: "Altersvorsorge",
    unit: "€ / Monat",
    hint: "Grober Schätzwert. In der Selbstständigkeit sorgst du meist selbst fürs Alter vor.",
  },
  {
    name: "taxRatePercent",
    label: "Steuersatz (pauschal)",
    unit: "%",
    hint: "Vereinfachung: ein fester Anteil deines Gewinns für die Einkommensteuer.",
  },
];

export function HourlyRateCalculator({ initialValues, canSave }: HourlyRateCalculatorProps) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Partial<Record<HourlyRateField, boolean>>>({});
  const [saveState, saveAction, saving] = useActionState(saveHourlyRate, initialSaveResultState);

  const parsed = parseAndCalculateHourlyRate(values);
  const errorOf = (field: HourlyRateField) =>
    !parsed.ok && touched[field] ? parsed.errors[field] : undefined;

  function field({ name, label, unit, hint }: (typeof basicFields)[number]) {
    return (
      <NumberField
        key={name}
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

  const rate = parsed.ok ? Math.ceil(parsed.result.hourlyRate) : undefined;

  return (
    // Mobile: basic fields, result, then the advanced assumptions – so the result is
    // visible right after the first inputs. Desktop: inputs left, result right.
    <form action={saveAction} noValidate className="grid gap-8 md:grid-cols-2 md:items-start">
      <div className="space-y-6 md:col-start-1">{basicFields.map(field)}</div>

      <div className="space-y-4 md:sticky md:top-20 md:col-start-2 md:row-span-2 md:row-start-1">
        <section
          aria-labelledby="result-heading"
          aria-live="polite"
          className="space-y-4 rounded-xl border-2 border-foreground p-5"
        >
          <h2 id="result-heading" className="text-sm text-muted-foreground">
            Dein Mindest-Stundensatz
          </h2>
          {parsed.ok && rate !== undefined ? (
            <>
              <p>
                <span className="text-4xl font-semibold">{formatEuro(rate)}</span>
                <span className="block text-sm text-muted-foreground">
                  pro Stunde, netto (ohne Umsatzsteuer)
                </span>
              </p>
              <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-sm">
                <dt className="text-muted-foreground">Arbeitstage pro Jahr</dt>
                <dd className="text-right">{formatNumber(parsed.result.workingDays)}</dd>
                <dt className="text-muted-foreground">Abrechenbare Stunden pro Jahr</dt>
                <dd className="text-right">{formatNumber(parsed.result.billableHoursPerYear)}</dd>
                <dt className="text-muted-foreground">Nötiger Gewinn vor Steuern</dt>
                <dd className="text-right">{`${formatEuro(parsed.result.requiredProfitPerYear)} / Jahr`}</dd>
                <dt className="text-muted-foreground">Nötiger Umsatz</dt>
                <dd className="text-right">{`${formatEuro(parsed.result.requiredRevenuePerYear)} / Jahr`}</dd>
              </dl>
              <Link
                href={`/tools/projektpreis?stundensatz=${rate}`}
                className={buttonVariants({ variant: "outline" })}
              >
                Damit einen Projektpreis berechnen
              </Link>
            </>
          ) : (
            <p className="text-muted-foreground">
              Gib dein Wunsch-Nettoeinkommen und deine Betriebskosten ein – dann siehst du hier,
              welchen Stundensatz du mindestens brauchst.
            </p>
          )}
        </section>

        {canSave ? (
          <div className="space-y-3">
            {saveState.status !== "idle" && (
              <FormMessage type={saveState.status}>{saveState.message}</FormMessage>
            )}
            <Button type="submit" disabled={!parsed.ok || saving}>
              {saving ? "Wird gespeichert …" : "Ergebnis speichern"}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            <Link
              href="/anmelden?next=%2Ftools%2Fstundensatz"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Melde dich an
            </Link>
            , um dein Ergebnis zu speichern.
          </p>
        )}

        <div className="space-y-2 rounded-xl bg-muted px-4 py-3 text-sm">
          <p>
            <strong>Das ist eine Schätzung</strong> auf Basis eines vereinfachten Modells – keine
            Steuer- oder Finanzberatung. Steuern und Versicherungen hängen von deiner persönlichen
            Situation ab.
          </p>
          <p>
            Auf den Stundensatz kommt in der Regel noch die Umsatzsteuer (19 %), außer du nutzt die
            Kleinunternehmerregelung.
          </p>
        </div>
      </div>

      <details className="group rounded-xl border p-4 md:col-start-1">
        <summary className="flex min-h-11 cursor-pointer items-center font-medium">
          Weitere Annahmen anpassen
        </summary>
        <div className="mt-4 space-y-6">{advancedFields.map(field)}</div>
      </details>
    </form>
  );
}

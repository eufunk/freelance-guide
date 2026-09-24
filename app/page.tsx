import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";

const steps = [
  {
    title: "Standort bestimmen",
    description:
      "Ein paar Fragen zu deinen Skills, deiner Erfahrung und deinem Ziel – daraus ergibt sich dein Startpunkt.",
  },
  {
    title: "Schritt für Schritt vorgehen",
    description:
      "Deine Roadmap führt dich vom eigenen Angebot über Preise und Anmeldung bis zur ersten Kundenanfrage.",
  },
  {
    title: "Den ersten Auftrag gewinnen",
    description:
      "Rechner und Vorlagen helfen bei Stundensatz, Angebot und Rechnung. Du siehst jederzeit, was als Nächstes kommt.",
  },
];

export default function HomePage() {
  return (
    <PageContainer className="flex flex-col gap-12 py-12 md:py-20">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
          Dein Weg in die IT-Freiberuflichkeit
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Der Freelance Guide zeigt dir Schritt für Schritt, was als Nächstes zu tun ist – bis zu
          deinem ersten Kunden.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/registrieren" className={buttonVariants({ size: "lg" })}>
            Loslegen
          </Link>
          <Link href="/anmelden" className={buttonVariants({ size: "lg", variant: "outline" })}>
            Ich habe schon ein Konto
          </Link>
        </div>
      </div>

      <section aria-labelledby="how-it-works" className="space-y-6">
        <h2 id="how-it-works" className="text-xl font-semibold">
          So funktioniert&apos;s
        </h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="space-y-2">
              <span
                aria-hidden
                className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-semibold"
              >
                {index + 1}
              </span>
              <h3 className="font-medium">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </section>
    </PageContainer>
  );
}

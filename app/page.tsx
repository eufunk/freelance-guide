import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";

export default function HomePage() {
  return (
    <PageContainer className="flex flex-col gap-6 py-12 md:py-20">
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
    </PageContainer>
  );
}

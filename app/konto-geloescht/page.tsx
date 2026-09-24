import type { Metadata } from "next";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Konto gelöscht" };

export default function AccountDeletedPage() {
  return (
    <PageContainer
      title="Dein Konto wurde gelöscht"
      description="Wir haben dein Konto und alle deine Daten gelöscht. Viel Erfolg auf deinem Weg!"
    >
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        Zur Startseite
      </Link>
    </PageContainer>
  );
}
